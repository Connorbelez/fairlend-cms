#!/usr/bin/env python3
"""Remove magenta background and magenta edge contamination from the hero source."""

from __future__ import annotations

import argparse
import json
import subprocess
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


def initial_magenta_mask(rgb: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    h = hsv[:, :, 0].astype(np.int16)
    s = hsv[:, :, 1].astype(np.int16)
    v = hsv[:, :, 2].astype(np.int16)
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    strength = ((r + b) // 2) - g

    strict = (
        (h >= 134)
        & (h <= 178)
        & (s >= 82)
        & (v >= 112)
        & (r >= 145)
        & (b >= 130)
        & (g <= 145)
        & (strength >= 58)
        & (np.abs(r - b) <= 135)
    )
    return border_connected(strict)


def create_alpha(rgb: np.ndarray, background: np.ndarray, eat_pixels: int) -> np.ndarray:
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (eat_pixels * 2 + 1, eat_pixels * 2 + 1))
    expanded_bg = cv2.dilate(background.astype(np.uint8), kernel, iterations=1).astype(bool)

    foreground = (~expanded_bg).astype(np.uint8)
    distance = cv2.distanceTransform(foreground, cv2.DIST_L2, 5)
    alpha = np.clip((distance - 0.15) / 1.1, 0.0, 1.0)
    alpha[expanded_bg] = 0.0

    hsvc = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    h = hsvc[:, :, 0].astype(np.int16)
    s = hsvc[:, :, 1].astype(np.int16)
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    strength = ((r + b) // 2) - g
    magenta_edge = (
        (h >= 126)
        & (h <= 179)
        & (s >= 45)
        & (r >= 120)
        & (b >= 92)
        & (g <= 158)
        & (strength >= 34)
        & (np.abs(r - b) <= 165)
    )
    edge = (distance > 0) & (distance < 4.5)
    alpha[magenta_edge & edge] = 0.0
    return (alpha * 255.0).round().astype(np.uint8)


def clean_edge_rgb(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    repair = alpha < 255
    repair_mask = repair.astype(np.uint8) * 255
    inpainted = cv2.inpaint(rgb, repair_mask, 21, cv2.INPAINT_TELEA)

    out = rgb.copy()
    out[repair] = inpainted[repair]
    return out


def alpha_bbox(alpha: np.ndarray) -> dict[str, int] | None:
    ys, xs = np.where(alpha > 0)
    if not len(xs):
        return None
    left = int(xs.min())
    top = int(ys.min())
    right = int(xs.max()) + 1
    bottom = int(ys.max()) + 1
    return {"x": left, "y": top, "width": right - left, "height": bottom - top}


def magenta_residue_count(rgba: np.ndarray) -> int:
    alpha = rgba[:, :, 3]
    r = rgba[:, :, 0].astype(np.int16)
    g = rgba[:, :, 1].astype(np.int16)
    b = rgba[:, :, 2].astype(np.int16)
    visible = alpha > 0
    residue = (
        visible
        & (r > 100)
        & (b > 88)
        & (g < 142)
        & ((((r + b) // 2) - g) > 28)
        & (np.abs(r - b) < 170)
    )
    return int(residue.sum())


def run_magick_trim(input_png: Path, output_png: Path) -> None:
    output_png.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "magick",
            str(input_png),
            "-alpha",
            "on",
            "-trim",
            "+repage",
            str(output_png),
        ],
        check=True,
    )


def run_magick_webp(input_png: Path, output_webp: Path, quality: int) -> None:
    output_webp.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "magick",
            str(input_png),
            "-quality",
            str(quality),
            "-define",
            "webp:method=6",
            str(output_webp),
        ],
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="Original RGB source image")
    parser.add_argument("--raw-out", required=True, help="Untrimmed transparent PNG output")
    parser.add_argument("--trimmed-out", required=True, help="Trimmed transparent PNG output")
    parser.add_argument("--webp-out", required=True, help="Transparent WebP output")
    parser.add_argument("--report", required=True, help="JSON report output")
    parser.add_argument("--eat-pixels", type=int, default=1)
    parser.add_argument("--webp-quality", type=int, default=94)
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    raw_path = Path(args.raw_out).expanduser().resolve()
    trimmed_path = Path(args.trimmed_out).expanduser().resolve()
    webp_path = Path(args.webp_out).expanduser().resolve()
    report_path = Path(args.report).expanduser().resolve()

    image = Image.open(input_path).convert("RGB")
    rgb = np.asarray(image)
    background = initial_magenta_mask(rgb)
    alpha = create_alpha(rgb, background, args.eat_pixels)
    clean_rgb = clean_edge_rgb(rgb, alpha)
    rgba = np.dstack([clean_rgb, alpha])

    raw_path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(raw_path)
    run_magick_trim(raw_path, trimmed_path)
    run_magick_webp(trimmed_path, webp_path, args.webp_quality)

    trimmed = np.asarray(Image.open(trimmed_path).convert("RGBA"))
    webp = np.asarray(Image.open(webp_path).convert("RGBA"))
    report = {
        "input": str(input_path),
        "raw_output": str(raw_path),
        "trimmed_output": str(trimmed_path),
        "webp_output": str(webp_path),
        "source_size": {"width": image.width, "height": image.height},
        "raw_alpha_bbox": alpha_bbox(alpha),
        "raw_transparent_pixels": int((alpha == 0).sum()),
        "raw_partial_alpha_pixels": int(((alpha > 0) & (alpha < 255)).sum()),
        "raw_opaque_pixels": int((alpha == 255).sum()),
        "trimmed_size": {"width": int(trimmed.shape[1]), "height": int(trimmed.shape[0])},
        "webp_size": {"width": int(webp.shape[1]), "height": int(webp.shape[0])},
        "trimmed_magenta_residue_pixels": magenta_residue_count(trimmed),
        "webp_magenta_residue_pixels": magenta_residue_count(webp),
        "eat_pixels": args.eat_pixels,
        "webp_quality": args.webp_quality,
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
