# Asset Optimization Report

Date: 2026-06-26

## Scope

Audited local web-served media under `public`, `src`, `app`, and `components`, excluding build output, dependencies, and generated folders.

Initial inventory:

- 153 media assets, 74.51 MB total.
- PNGs accounted for 58.25 MB.
- WebP assets accounted for 15.49 MB.
- 52 assets were over 250 KB.

## Completed Optimizations

Referenced page payload changed from 16.14 MB to 4.00 MB, saving 12.14 MB (75.2%) across the optimized assets now used by the app.

| Area | Before | After | Savings |
| --- | ---: | ---: | ---: |
| Mobile hero | 2,436.3 KB | 232.1 KB | 90.5% |
| Desktop hero | 2,424.6 KB | 193.6 KB | 92.0% |
| Drawflow blueprint | 1,037.0 KB | 167.2 KB | 83.9% |
| Drawflow background | 1,632.5 KB | 44.2 KB | 97.3% |
| Milestone stack | 1,511.9 KB | 249.7 KB | 83.5% |
| Multiplex transparent asset | 1,683.5 KB | 246.5 KB | 85.4% |
| Site plan foreground | 1,018.2 KB | 941.1 KB | 7.6% |
| Site plan field | 290.5 KB | 224.3 KB | 22.8% |
| Build progress lot | 325.5 KB | 237.4 KB | 27.1% |
| Build progress foundation | 317.8 KB | 237.0 KB | 25.4% |
| Build progress structure | 312.1 KB | 234.6 KB | 24.8% |
| Build progress finished | 282.5 KB | 212.5 KB | 24.8% |
| Build progress polished | 267.4 KB | 194.6 KB | 27.2% |
| Builder house | 1,846.2 KB | 261.7 KB | 85.8% |
| Leadership headshot | 752.3 KB | 58.2 KB | 92.3% |
| Toronto skyline | 388.5 KB | 356.6 KB | 8.2% |

Code changes:

- Added responsive WebP `srcSet` variants for the landing hero so small screens no longer pull multi-megabyte PNGs.
- Switched Drawflow image constants from PNG/original WebP files to optimized WebP variants.
- Switched builder consulting, leadership, about, and services artwork to optimized WebP variants.
- Changed shared Payload media image quality from 100 to 82.
- Updated Next image `qualities` from `[100]` to `[75, 82, 90, 100]` so optimized image responses are not forced into maximum-quality output.
- Updated E2E asset-name assertions to match the optimized hero files.

## Remaining Cleanup Candidates

Originals were preserved intentionally. Because of that, the repo asset total is now 78.72 MB even though the referenced page payload is much smaller. Deleting or archiving originals should be a separate explicit decision.

Largest remaining raw or likely-unused public assets:

- `public/assets/drawflow-intake/Property Site Plan Foreground.png` - 3,164.9 KB
- `public/assets/drawflow-intake/Build Progression Series.png` - 2,934.0 KB
- `public/assets/drawflow-intake/Build Progression Series (2).png` - 2,915.0 KB
- `public/assets/drawflow-intake/Build Progression Series (1).png` - 2,874.8 KB
- `public/assets/drawflow-intake/Build Progression Series (3).png` - 2,804.4 KB
- `public/mobileHero.png` - 2,797.6 KB
- `public/assets/drawflow-intake/Build Progression Series (4).png` - 2,656.1 KB
- `public/media/Hero Image Extraction Jun 20 2026 (6)-1400x1050.png` - 2,503.1 KB
- `public/assets/drawflow-intake/Property Site Plan Step 2.png` - 2,486.8 KB
- `public/assets/mobileHero.png` - 2,436.3 KB
- `public/assets/fairlend-hero-jun-26-2026.png` - 2,424.6 KB
- `public/assets/ChatGPT Image Jun 23 2026 from Creation Request.png` - 2,422.4 KB
- `public/assets/mobileHero1.png` - 2,415.7 KB

Notes:

- `public/Hero Image Extraction Jun 20 2026 (6).png` and `public/media/Hero Image Extraction Jun 20 2026 (6).png` are duplicate-size image candidates.
- The site-plan foreground remains 941.1 KB after optimization. Trial encodes at lower WebP quality only reduced it to roughly 840-886 KB, so further reduction likely needs art-direction work, cropping, or accepting visible quality loss.
- CMS/external media payloads were not rewritten, but the shared media image component now defaults to a more reasonable optimization quality.

## Verification

- Confirmed no remaining references to the replaced old asset names in `src`, `tests`, or `docs`.
- Confirmed every newly referenced local asset exists.
- Confirmed touched files pass ESLint with the local ESLint binary.
- Static local asset checker still reports unrelated pre-existing sample/dynamic references in registry/demo code and media documentation.
- Full `pnpm lint` currently fails outside this asset change on pre-existing generated/tooling warnings and an existing `react-hooks/immutability` error in `src/components/ui/ink-reveal.tsx`.
- Build, Playwright, and E2E were not run per project instructions for landing/marketing-page work.
