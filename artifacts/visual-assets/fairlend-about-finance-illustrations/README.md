# Fairlend About + Finance Illustration Assets

Generated from the supplied Fairlend about/finance page screenshot on 2026-07-04.

## Outputs

- `asset-manifest.json`: source-image crop manifest for the skyline and six card illustrations.
- `image-generation-plan.json`: imagegen queue used for the seven standalone assets.
- `crops/`: reference crops only; these are not production assets.
- `generated/raw/`: built-in imagegen PNG outputs on chroma-key backgrounds.
- `generated/keyed/`: chroma-key removed PNGs.
- `generated/alpha/`: normalized transparent PNGs.
- `generated/webp/`: optimized transparent WebP files.
- `production-assets.json`: generated/raw/final/public path mapping.
- `generated/webp-contact-sheet.png`: visual verification over checker and ivory backgrounds.

## Public Asset Paths

- `/assets/about-webp/webp/toronto-skyline-sketch-optimized.webp`
- `/assets/about-webp/webp/toronto-skyline-sketch.webp`
- `/assets/about-webp/webp/finance-icon-residential-private-mortgages.webp`
- `/assets/about-webp/webp/finance-icon-bridge-loans.webp`
- `/assets/about-webp/webp/finance-icon-mortgage-investments.webp`
- `/assets/about-webp/webp/finance-icon-multiplex-financing.webp`
- `/assets/about-webp/webp/finance-icon-garden-suites.webp`
- `/assets/about-webp/webp/finance-icon-purpose-built-rentals.webp`

## Verification

- Manifest validation passed with `validate_asset_manifest.py`.
- Generated asset validation passed with `validate_generated_assets.py`.
- All production WebPs have alpha channels.
- Visible green-remnant check reported `greenish=0` for every production WebP.
- The existing `FairlendAboutStorySection` component already imports these public filenames, so no component code change was required.
