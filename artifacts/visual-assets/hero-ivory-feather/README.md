# Hero Ivory Feather

Generated a transparent desktop hero WebP that avoids hard background extraction.

- Production asset: `/Users/connor/Dev/fairlend-cms/public/assets/fairlend-desktop-hero-ivory-feather.webp`
- Source asset: `/Users/connor/Dev/fairlend-cms/public/assets/fairlend-desktop-hero.webp`
- Generator: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-ivory-feather/generate_feathered_hero.mjs`
- Preview on hero ivory: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-ivory-feather/preview-on-ivory.png`
- Checkerboard preview: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-ivory-feather/preview-on-checker.png`
- Alpha matte: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-ivory-feather/alpha-matte.png`
- Report: `/Users/connor/Dev/fairlend-cms/artifacts/visual-assets/hero-ivory-feather/report.json`

The generator uses manual alpha ramps instead of color-key extraction:

- left edge: transparent until 3.5% width, full opacity at 34% width
- top edge: full opacity at 8.5% height
- bottom water: dissolve starts at 70% height, minimum opacity at bottom is 8%
- near-background pixels are shifted toward `rgb(255 253 247)` to remove beige halo contamination
