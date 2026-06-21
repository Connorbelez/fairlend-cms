# Hero Magenta Cutout V2

This visual-asset run retries the hero extraction from the original source PNG after the first WebP showed a thin magenta edge fringe.

## Output

- Production asset: `/Users/connor/Dev/fairlend-cms/public/assets/hero-isometric-map-cutout.webp`
- Artifact WebP: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/generated/webp/hero-isometric-map-cutout.webp`
- Trimmed transparent PNG: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/generated/raw/hero-isometric-map-cutout.png`
- Full-size transparent PNG: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/generated/raw/hero-isometric-map-cutout.untrimmed.png`
- Preview: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/verification-preview.png`
- Bottom-edge zoom: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/bottom-edge-zoom.png`

## Verification

- Final WebP dimensions: `1630x918`
- Final WebP size: `329,790` bytes
- Alpha channel: present, `0..255`
- Partial-alpha magenta residue pixels: `0`
- Transparency-edge magenta residue pixels: `0`
- Visible magenta residue pixels: `0`
- Transparent pixels: `260,935`
- Partial alpha edge pixels: `3,330`
- Opaque pixels: `1,232,075`

## Reproduction

```bash
python3 /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/key_magenta_cutout_v2.py \
  "/Users/connor/Downloads/Image Recreation Request Jun 20 2026.png" \
  --raw-out /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/generated/raw/hero-isometric-map-cutout.untrimmed.png \
  --trimmed-out /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/generated/raw/hero-isometric-map-cutout.png \
  --webp-out /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/generated/webp/hero-isometric-map-cutout.webp \
  --report /Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-magenta-cutout-v2/extraction-report.json \
  --webp-quality 94
```
