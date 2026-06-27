#!/usr/bin/env python3
"""Remove the magenta chroma-key background from the supplied hero image."""

from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


def border_connected(mask: np.ndarray) -> np.ndarray:
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if mask[0, x]:
            queue.append((x, 0))
        if mask[height - 1, x]:
            queue.append((x, height - 1))
    for y in range(height):
        if mask[y, 0]:
            queue.append((0, y))
        if mask[y, width - 1]:
            queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if seen[y, x] or not mask[y, x]:
            continue
        seen[y, x] = True
        if x > 0:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))

    return seen


def magenta_background_mask(rgb: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    hue = hsv[:, :, 0].astype(np.int16)
    saturation = hsv[:, :, 1].astype(np.int16)
    value = hsv[:, :, 2].astype(np.int16)

    red = rgb[:, :, 0].astype(np.int16)
    green = rgb[:, :, 1].astype(np.int16)
    blue = rgb[:, :, 2].astype(np.int16)
    magenta_strength = ((red + blue) // 2) - green

    strict = (
        (hue >= 136)
        & (hue <= 176)
        & (saturation >= 105)
        & (value >= 145)
        & (red >= 175)
        & (blue >= 170)
        & (green <= 105)
        & (magenta_strength >= 125)
        & (np.abs(red - blue) <= 95)
    )
    return border_connected(strict)


def build_alpha(rgb: np.ndarray, bg_mask: np.ndarray, edge_width: float) -> np.ndarray:
    foreground_binary = (~bg_mask).astype(np.uint8)
    distance_to_background = cv2.distanceTransform(foreground_binary, cv2.DIST_L2, 5)
    alpha = np.clip(distance_to_background / edge_width, 0.0, 1.0)
    alpha[bg_mask] = 0.0

    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    hue = hsv[:, :, 0].astype(np.int16)
    saturation = hsv[:, :, 1].astype(np.int16)
    red = rgb[:, :, 0].astype(np.int16)
    green = rgb[:, :, 1].astype(np.int16)
    blue = rgb[:, :, 2].astype(np.int16)
    magenta_strength = ((red + blue) // 2) - green

    soft_magenta = (
        (hue >= 132)
        & (hue <= 178)
        & (saturation >= 70)
        & (red >= 150)
        & (blue >= 145)
        & (green <= 150)
        & (magenta_strength >= 75)
        & (np.abs(red - blue) <= 120)
    )
    edge_band = (distance_to_background > 0) & (distance_to_background <= edge_width * 2.5)
    alpha[soft_magenta & edge_band] = np.minimum(alpha[soft_magenta & edge_band], 0.9)

    return (alpha * 255.0).round().astype(np.uint8)


def despill(rgb: np.ndarray, alpha: np.ndarray, bg_mask: np.ndarray) -> np.ndarray:
    inpaint_mask = (~bg_mask).astype(np.uint8) * 255
    local_key = cv2.inpaint(rgb, inpaint_mask, 15, cv2.INPAINT_TELEA).astype(np.float32)

    rgb_f = rgb.astype(np.float32)
    alpha_f = np.clip(alpha.astype(np.float32) / 255.0, 1.0 / 255.0, 1.0)
    matte = alpha_f[:, :, None]
    recovered = (rgb_f - (1.0 - matte) * local_key) / matte
    recovered = np.clip(recovered, 0, 255)

    edge = (alpha > 0) & (alpha < 250)
    out = rgb_f.copy()
    out[edge] = recovered[edge]
    out[alpha == 0] = 0
    return out.round().astype(np.uint8)


def alpha_bbox(alpha: np.ndarray) -> dict[str, int] | None:
    ys, xs = np.where(alpha > 0)
    if len(xs) == 0:
        return None
    left = int(xs.min())
    top = int(ys.min())
    right = int(xs.max()) + 1
    bottom = int(ys.max()) + 1
    return {
        "x": left,
        "y": top,
        "width": right - left,
        "height": bottom - top,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="Source PNG with magenta background")
    parser.add_argument("--out", required=True, help="Output transparent PNG")
    parser.add_argument("--report", required=True, help="Output JSON report")
    parser.add_argument("--edge-width", type=float, default=1.65)
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    out_path = Path(args.out).expanduser().resolve()
    report_path = Path(args.report).expanduser().resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.parent.mkdir(parents=True, exist_ok=True)

    image = Image.open(input_path).convert("RGB")
    rgb = np.asarray(image)
    bg_mask = magenta_background_mask(rgb)
    alpha = build_alpha(rgb, bg_mask, args.edge_width)
    clean_rgb = despill(rgb, alpha, bg_mask)
    rgba = np.dstack([clean_rgb, alpha])
    Image.fromarray(rgba, "RGBA").save(out_path)

    report = {
        "input": str(input_path),
        "output": str(out_path),
        "source_size": {"width": image.width, "height": image.height},
        "background_pixels": int(bg_mask.sum()),
        "transparent_pixels": int((alpha == 0).sum()),
        "partial_alpha_pixels": int(((alpha > 0) & (alpha < 255)).sum()),
        "opaque_pixels": int((alpha == 255).sum()),
        "alpha_bbox": alpha_bbox(alpha),
        "edge_width": args.edge_width,
    }
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
