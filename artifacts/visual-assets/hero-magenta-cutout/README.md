# Hero Magenta Cutout

This visual-asset run extracts the supplied hero image into a transparent production WebP by removing only the magenta chroma-key background.

## Output

- Production asset: `/Users/connor/Dev/fairlend-cms/public/assets/hero-isometric-map-cutout.webp`
- Artifact WebP: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/generated/webp/hero-isometric-map-cutout.webp`
- Raw transparent PNG: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/generated/raw/hero-isometric-map-cutout.png`
- Preview: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/verification-preview.png`

## Verification

- Final WebP dimensions: `1631x919`
- Final WebP size: `252,732` bytes
- Alpha channel: present, `0..255`
- Visible magenta-like pixels after cutout: `0`
- Transparent pixels: `259,058`
- Partial alpha edge pixels: `4,245`
- Opaque pixels: `1,235,586`

## Reproduction

```bash
python3 /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/key_magenta_cutout.py \
  "/Users/connor/Downloads/Image Recreation Request Jun 20 2026.png" \
  --out /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/generated/raw/hero-isometric-map-cutout.png \
  --report /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/extraction-report.json

python3 /Users/connor/.codex/skills/visual-asset-pipeline/scripts/prepare_web_asset.py \
  /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/generated/raw/hero-isometric-map-cutout.png \
  --out /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout/generated/webp/hero-isometric-map-cutout.webp \
  --transparent-background none \
  --trim \
  --quality 90
```
