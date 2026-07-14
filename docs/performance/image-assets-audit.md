# Image asset audit

## Outcome

- Migrated all 97 raw JSX `<img>` elements in `src/` to `next/image`, including production components, reusable UI primitives, registry sources, and Watermelon blocks.
- Replaced `public/assets/fairlend-toronto-contour-map.png` (1,899,801 bytes) with an equivalent WebP asset (64,576 bytes), a 96.6% reduction, and updated all four production references.
- Localized the root route's Transparent Textures dependencies to the existing files under `public/textures/`, eliminating six third-party image requests.
- Added the required Next.js remote optimizer allowlist for the known image hosts used by reusable components.
- Preserved the small transparent paper textures as PNG. Measured WebP and AVIF encodes were larger than the originals, so converting them would be a regression.

## Continuous enforcement

Run:

```sh
pnpm audit:images
```

The audit fails when it finds:

- a raw JSX `<img>` element;
- a referenced PNG at or above 250 KB; or
- a `transparenttextures.com` dependency.

It also reports large unreferenced PNGs without deleting them. Some are raw creative sources, mockups, generated contact sheets, or historical direct-link assets; deleting those automatically could break CMS-authored or externally linked content that is not discoverable through static source analysis.

## Remaining archive candidates

The largest unreferenced PNG groups are under:

- `public/assets/drawflow-intake/`
- `public/assets/foliage/raw/`
- `public/assets/visual-assets/small-residential-construction/`
- `public/mockups/borrower-concept-a/`
- `public/media/`

The audit currently reports 55 such PNGs totaling 102,645,552 bytes. They do not affect page image transfer because no shipped source references them, but they increase repository and deployment-upload size. Use the audit output as the deletion manifest after confirming there are no CMS-authored or external direct links.

## Validation

- `pnpm audit:images` passes.
- `pnpm exec tsc --noEmit --incremental false -p tsconfig.next.json` passes.
- Targeted ESLint reports no errors in the production components changed by this work. Existing `LogoLoop` hook-dependency and explicit-`any` warnings remain unchanged.
- No Next.js build was run.
