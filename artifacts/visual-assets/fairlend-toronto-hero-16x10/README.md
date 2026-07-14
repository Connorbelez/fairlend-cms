# FairLend Toronto Hero Assets

Generated standalone assets from the supplied FairLend hero screenshot.

## Public Assets

Use these app-facing paths:

| Asset | Dimensions | Public URL |
| --- | ---: | --- |
| Toronto skyline waterfront | 1600x1000 | `/assets/fairlend/toronto-hero-16x10/toronto-skyline-waterfront-16x10.webp` |
| Upper west cloud | 1692x516 | `/assets/fairlend/toronto-hero-16x10/cloud-upper-west.webp` |
| Upper east large cloud | 1721x695 | `/assets/fairlend/toronto-hero-16x10/cloud-upper-east-large.webp` |
| Mid west large cloud | 1733x488 | `/assets/fairlend/toronto-hero-16x10/cloud-mid-west-large.webp` |
| Mid east small cloud | 737x287 | `/assets/fairlend/toronto-hero-16x10/cloud-mid-east-small.webp` |
| Low west cloud | 1630x468 | `/assets/fairlend/toronto-hero-16x10/cloud-low-west.webp` |
| Low east cloud | 1547x427 | `/assets/fairlend/toronto-hero-16x10/cloud-low-east.webp` |
| Far east low cloud | 806x431 | `/assets/fairlend/toronto-hero-16x10/cloud-far-east-low.webp` |

## Pipeline Files

- `asset-spec.json`: source decomposition and generation prompts.
- `asset-manifest.json`: validated crop-reference manifest.
- `image-generation-plan.json`: imagegen queue.
- `generated/raw/`: raw imagegen PNG outputs, never crops.
- `generated/keyed/`: transparent PNG intermediates after chroma-key cleanup.
- `generated/webp/`: optimized transparent WebP artifacts.
- `production-assets.json`: validated production output manifest.
- `generated/webp-verification-sheet.png`: transparency/edge verification sheet.

The skyline asset is padded to an exact 16:10 transparent canvas. Cloud assets are trimmed to alpha bounds for easier absolute positioning.
