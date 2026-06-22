#!/usr/bin/env python3
from __future__ import annotations

import io
import json
import math
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
RAW_OUT = ROOT / "generated" / "raw" / "gta-leadership-background-map.png"
PROD_OUT = Path("public/assets/fairlend-gta-leadership-background-map.webp").resolve()
REPORT_OUT = ROOT / "gta-map-render-report.json"

# Central Toronto / GTA context. This viewport intentionally frames the same real-world areas
# visible in the reference: Yorkville, Financial District, Harbourfront, Lake Ontario, CN Tower.
BBOX = {
    "west": -79.4218,
    "south": 43.6202,
    "east": -79.3468,
    "north": 43.6868,
}
ZOOM = 15
WIDTH = 1320
HEIGHT = 1900
TILE_URL = "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
USER_AGENT = "fairlend-cms-asset-generation/1.0 (+https://www.openstreetmap.org/copyright)"

CREAM = (250, 244, 235, 255)
INK = (131, 121, 105, 255)
LINE = (198, 188, 172, 255)
WATER = (218, 225, 222, 255)
ORANGE = (242, 117, 77, 255)


def latlon_to_global_px(lat: float, lon: float, zoom: int) -> tuple[float, float]:
    sin_lat = math.sin(math.radians(lat))
    scale = 256 * 2**zoom
    x = (lon + 180.0) / 360.0 * scale
    y = (0.5 - math.log((1 + sin_lat) / (1 - sin_lat)) / (4 * math.pi)) * scale
    return x, y


def global_px_to_local(lat: float, lon: float, crop_origin: tuple[float, float], source_size: tuple[int, int]) -> tuple[float, float]:
    x, y = latlon_to_global_px(lat, lon, ZOOM)
    return ((x - crop_origin[0]) * WIDTH / source_size[0], (y - crop_origin[1]) * HEIGHT / source_size[1])


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def fetch_tile(z: int, x: int, y: int) -> Image.Image:
    url = TILE_URL.format(z=z, x=x, y=y)
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=20) as response:
        return Image.open(io.BytesIO(response.read())).convert("RGBA")


def draw_letterspaced(draw: ImageDraw.ImageDraw, xy: tuple[float, float], text: str, spacing: int, fill: tuple[int, int, int, int], font_obj: ImageFont.ImageFont, anchor: str = "mm") -> None:
    chars = list(text.upper())
    widths = [draw.textlength(char, font=font_obj) for char in chars]
    total = sum(widths) + spacing * max(0, len(chars) - 1)
    x, y = xy
    if anchor.endswith("m"):
        cursor = x - total / 2
    else:
        cursor = x
    for index, char in enumerate(chars):
        draw.text((cursor, y), char, font=font_obj, fill=fill, anchor="lm")
        cursor += widths[index] + spacing


def draw_pin(draw: ImageDraw.ImageDraw, xy: tuple[float, float], radius: int = 7) -> None:
    x, y = xy
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=ORANGE)
    draw.ellipse((x - radius * 2, y - radius * 2, x + radius * 2, y + radius * 2), outline=(242, 117, 77, 60), width=2)


def build_map() -> tuple[Image.Image, dict[str, object]]:
    nw = latlon_to_global_px(BBOX["north"], BBOX["west"], ZOOM)
    se = latlon_to_global_px(BBOX["south"], BBOX["east"], ZOOM)
    left, top = nw
    right, bottom = se

    tile_left = math.floor(left / 256)
    tile_top = math.floor(top / 256)
    tile_right = math.floor((right - 1) / 256)
    tile_bottom = math.floor((bottom - 1) / 256)

    mosaic = Image.new(
        "RGBA",
        ((tile_right - tile_left + 1) * 256, (tile_bottom - tile_top + 1) * 256),
        (255, 255, 255, 255),
    )
    fetched = []
    for ty in range(tile_top, tile_bottom + 1):
        for tx in range(tile_left, tile_right + 1):
            tile = fetch_tile(ZOOM, tx, ty)
            mosaic.alpha_composite(tile, ((tx - tile_left) * 256, (ty - tile_top) * 256))
            fetched.append({"z": ZOOM, "x": tx, "y": ty})
            time.sleep(0.04)

    crop_left = left - tile_left * 256
    crop_top = top - tile_top * 256
    crop = mosaic.crop((round(crop_left), round(crop_top), round(crop_left + (right - left)), round(crop_top + (bottom - top))))
    base = crop.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).convert("RGBA")

    # Pale editorial treatment: reduce contrast, move everything into warm cream/gray.
    gray = base.convert("L")
    gray = ImageEnhance.Contrast(gray).enhance(0.72)
    gray = ImageEnhance.Brightness(gray).enhance(1.04)
    colorized = Image.merge("RGBA", [gray, gray, gray, base.getchannel("A")])
    tinted = Image.new("RGBA", base.size, CREAM)
    line_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    pixels = colorized.load()
    out = line_layer.load()
    for yy in range(HEIGHT):
        for xx in range(WIDTH):
            value = pixels[xx, yy][0]
            if value < 252:
                alpha = max(0, min(150, int((252 - value) * 2.15)))
                out[xx, yy] = (LINE[0], LINE[1], LINE[2], alpha)

    rendered = Image.alpha_composite(tinted, line_layer.filter(ImageFilter.GaussianBlur(0.12)))
    water_overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    water_draw = ImageDraw.Draw(water_overlay)
    # Real waterfront area is in the lower frame. Keep the wash low enough that downtown land,
    # including the CN Tower/Rogers Centre area, does not read as harbour.
    water_draw.rectangle((0, int(HEIGHT * 0.82), WIDTH, HEIGHT), fill=(WATER[0], WATER[1], WATER[2], 44))
    rendered = Image.alpha_composite(rendered, water_overlay.filter(ImageFilter.GaussianBlur(18)))

    draw = ImageDraw.Draw(rendered)
    crop_origin = (left, top)
    source_size = (right - left, bottom - top)

    landmarks = {
        "yorkville": global_px_to_local(43.6719, -79.3928, crop_origin, source_size),
        "financial": global_px_to_local(43.6487, -79.3817, crop_origin, source_size),
        "harbourfront": global_px_to_local(43.6381, -79.3830, crop_origin, source_size),
        "cn_tower": global_px_to_local(43.6426, -79.3871, crop_origin, source_size),
        "lake": global_px_to_local(43.6232, -79.3940, crop_origin, source_size),
    }

    label_font = font(28, bold=True)
    small_font = font(18)
    draw_letterspaced(draw, (landmarks["yorkville"][0] + 18, landmarks["yorkville"][1] - 18), "Yorkville", 8, (135, 124, 108, 168), label_font)
    draw_letterspaced(draw, (landmarks["financial"][0] + 62, landmarks["financial"][1] + 20), "Financial", 6, (135, 124, 108, 170), label_font)
    draw_letterspaced(draw, (landmarks["financial"][0] + 62, landmarks["financial"][1] + 55), "District", 6, (135, 124, 108, 170), label_font)
    draw_letterspaced(draw, (landmarks["harbourfront"][0] + 58, landmarks["harbourfront"][1] + 78), "Harbourfront", 5, (154, 143, 126, 130), small_font)
    draw_letterspaced(draw, (landmarks["lake"][0] - 130, HEIGHT - 155), "Lake Ontario", 9, (101, 124, 133, 118), font(24, bold=False))

    for point in [
        global_px_to_local(43.6634, -79.3869, crop_origin, source_size),
        global_px_to_local(43.6500, -79.3792, crop_origin, source_size),
        global_px_to_local(43.6389, -79.3915, crop_origin, source_size),
    ]:
        draw_pin(draw, point, 7)
    cn_x, cn_y = landmarks["cn_tower"]
    draw_pin(draw, (cn_x, cn_y), 6)
    draw_letterspaced(
        draw,
        (cn_x + 102, cn_y - 12),
        "CN Tower",
        4,
        (135, 124, 108, 128),
        small_font,
    )

    vignette = Image.new("RGBA", rendered.size, (255, 255, 255, 0))
    vd = ImageDraw.Draw(vignette)
    for radius, alpha in [(0, 72), (80, 42), (170, 24)]:
        vd.rounded_rectangle((radius, radius, WIDTH - radius, HEIGHT - radius), radius=90, outline=(255, 255, 255, alpha), width=radius + 10)
    rendered = Image.alpha_composite(rendered, vignette.filter(ImageFilter.GaussianBlur(42)))

    report = {
        "bbox": BBOX,
        "zoom": ZOOM,
        "size": {"width": WIDTH, "height": HEIGHT},
        "tile_source": TILE_URL,
        "attribution": "Map tiles by CARTO, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
        "landmarks": {
            "Yorkville": {"lat": 43.6719, "lon": -79.3928},
            "Financial District": {"lat": 43.6487, "lon": -79.3817},
            "Harbourfront": {"lat": 43.6381, "lon": -79.3830},
            "CN Tower": {"lat": 43.6426, "lon": -79.3871},
        },
        "tiles": fetched,
    }
    return rendered, report


def main() -> None:
    RAW_OUT.parent.mkdir(parents=True, exist_ok=True)
    PROD_OUT.parent.mkdir(parents=True, exist_ok=True)
    image, report = build_map()
    image.save(RAW_OUT)
    REPORT_OUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"raw": str(RAW_OUT), "report": str(REPORT_OUT), "size": image.size}, indent=2))


if __name__ == "__main__":
    main()
