# Transparent foliage assets

Generated from `public/assets/foliage/raw/*.png` on 2026-06-28 with ImageMagick.

The raw files use a chroma-green background. The production assets are trimmed transparent WebP files encoded with alpha at WebP method 6, quality 84, and stripped metadata.

## Recipe

```sh
magick "$src" \
  -alpha set \
  -fuzz 22% -transparent '#00ff00' \
  -channel A -fx '((g>0.22)&&(g>r*1.02)&&(g>b*1.02))?0:a' +channel \
  -trim +repage \
  -define webp:method=6 \
  -define webp:alpha-quality=100 \
  -quality 84 \
  -strip \
  "$out"
```

## Outputs

| Source | Output |
| --- | --- |
| `raw/ChatGPT Image Jun 28 2026 Edge-decor Animation (1).png` | `transparent/foliage-edge-decor-01.webp` |
| `raw/ChatGPT Image Jun 28 2026 Edge-decor Animation (2).png` | `transparent/foliage-edge-decor-02.webp` |
| `raw/ChatGPT Image Jun 28 2026 Edge-decor Animation (3).png` | `transparent/foliage-edge-decor-03.webp` |
| `raw/ChatGPT Image Jun 28 2026 Edge-decor Animation (4).png` | `transparent/foliage-edge-decor-04.webp` |
| `raw/ChatGPT Image Jun 28 2026 Edge-decor Animation.png` | `transparent/foliage-edge-decor-05.webp` |
| `raw/ChatGPT Image Jun 28 2026 from Edge-decor.png` | `transparent/foliage-edge-decor-06.webp` |
| `raw/Edge-decor Animation Asset Jun 28 2026 (1).png` | `transparent/foliage-edge-decor-07.webp` |
| `raw/Edge-decor Animation Asset Jun 28 2026.png` | `transparent/foliage-edge-decor-08.webp` |

