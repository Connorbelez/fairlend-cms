# FairLend Route Selector Decomposition

## Standalone Components

- `FairlendRouteSelector`: full responsive section with intro copy, four route cards, and helper banner.
- `FairlendRouteCard`: reusable route option card with default/selected variants, optional badge, live text, illustration slot, CTA, and step tracker.
- `FairlendRouteIconBadge`: reusable lime icon wash using lucide icons.
- `FairlendRouteStepTrack`: reusable four-step progress row with active dot and arrow labels.
- `FairlendRouteHelpBanner`: reusable lower CTA prompt with compass image slot, text, divider, and button.

Component source lives in `src/components/FairlendRouteSelector/`.
The section is mounted in `src/app/(frontend)/page.tsx` after `FairlendLandingOverviewSection` and before `FairlendServicesSection`.

## Standalone Assets

- `topographic-paper-background.webp`: subtle off-white topo paper texture.
- `investor-skyline-engraving.webp`: city skyline and bridge engraving.
- `private-mortgage-house-engraving.webp`: suburban house engraving.
- `construction-building-engraving.webp`: construction frame and crane engraving.
- `partner-handshake-engraving.webp`: business handshake engraving.
- `route-compass-engraving.webp`: compass engraving for the helper banner.

Public assets live in `public/assets/fairlend-route-selector/`.

## Pipeline Artifacts

- `asset-spec.json`: authored decomposition spec.
- `asset-manifest.json`: validated crop manifest.
- `crops/`: reference crops only, not production assets.
- `image-generation-plan.json`: image generation queue.
- `generated/raw/`: copied raw imagegen outputs.
- `generated/webp/`: optimized generated WebP outputs.
- `production-assets.json`: provenance record for generated assets.
- `generated/asset-verification-sheet.jpg`: transparency and fidelity inspection sheet.

## Shadcn / Local Primitive Usage

The shadcn MCP was searched for card, badge, separator, and button-style primitives. The implementation adapts existing local shadcn primitives under `src/components/ui/`: `Button`, `Badge`, and `Separator`.

## Verification

- `validate_asset_manifest.py`: passed.
- `validate_generated_assets.py`: passed.
- `pnpm exec eslint src/components/FairlendRouteSelector --max-warnings=0`: passed.
- `pnpm exec eslint 'src/app/(frontend)/page.tsx' src/components/FairlendRouteSelector --max-warnings=0`: passed.
- Generated public asset existence check: passed.
- Filtered `pnpm exec tsc --noEmit --pretty false --incremental false`: no errors in `src/app/(frontend)/page.tsx` or `src/components/FairlendRouteSelector`.
- `pnpm exec tsc --noEmit --pretty false`: new module is clean; command still fails on pre-existing unrelated errors in `src/blocks/WatermelonLayouts/fields.ts`, `src/components/FairlendBuilderConsultingSection/index.tsx`, and `src/components/FairlendLandingHero/index.tsx`.
- Build, Playwright, and E2E were not run because the project instructions explicitly prohibit them for landing/marketing-page work.
