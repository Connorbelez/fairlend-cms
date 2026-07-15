# Build Model Context Band — Design QA

## Comparison target

- Source visual truth:
  - `/Users/connor/Library/Application Support/CleanShot/media/media_GT1m7nYNXM/CleanShot 2026-07-15 at 15.43.00@2x.png`
  - `/Users/connor/Library/Application Support/CleanShot/media/media_I17wyheaI6/CleanShot 2026-07-15 at 15.47.44.png`
- Rendered implementation evidence:
  - `/tmp/fairlend-context-band-intro-desktop.png`
  - `/tmp/fairlend-context-band-drawflow-desktop.png`
  - `/tmp/fairlend-context-band-plan-desktop.png`
  - `/tmp/fairlend-context-band-finance-desktop.png`
  - `/tmp/fairlend-context-band-support-desktop.png`
  - `/tmp/fairlend-context-band-takeout-desktop.png`
  - `/tmp/fairlend-context-band-contingency-desktop.png`
- Full-view evidence: `/tmp/fairlend-context-full-intro.png` through
  `/tmp/fairlend-context-full-contingency.png`.
- Focused comparison evidence:
  - `/tmp/fairlend-context-reference-rail-501x97.png`
  - `/tmp/fairlend-context-current-rail-501x97.png`
  - `/tmp/fairlend-context-rail-diff.png`
- Desktop capture viewport: 1440 × 1200 requested viewport; screenshots retain the browser's
  device-pixel scaling.
- Responsive checks: rendered client widths 1244, 1078, and 433 CSS px.
- States: Intent, DrawFlow, Plan, Finance, Support, Takeout, and Contingency.

## Reference ledger

- Preserve the existing authority-file card, typography, palette rotation, dossier content,
  timeline, and CTA.
- Remove the separate light Land/Scope/Capital ledger.
- Move all contextual variables into the black utility band.
- Keep a stable two-row band footprint.
- Three-item states use two items on row one and one full-width item on row two.
- Two-item states use two full-width rows.
- Render only the variables assigned to the active scroll state, in the supplied order.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: Oxanium labels retain the established uppercase technical treatment;
  labels do not clip or truncate at the narrow visible-card width.
- Spacing and layout rhythm: the band measures 95.998 px high in the rendered desktop card. Its
  two rows measure approximately 47.44 px each. The sticky card remains 880 px high between
  states, eliminating layout jumps.
- Colors and visual tokens: the band uses `#08090a`, labels use `#fbfaf7`, and icons use
  `#8dff00`. Contrast is 19.09:1 for ivory-on-ink and 15.60:1 for lime-on-ink.
- Image quality and asset fidelity: no raster assets were added or replaced. Existing Lucide
  icons and the parcel-sketch asset remain sharp and semantically correct.
- Copy and content: every active state matches the requested sequence:
  - Intent: Land, Scope, Capital
  - DrawFlow: Capital, Draw schedule, Professional path
  - Plan: Land, Scope
  - Finance: Capital, Draw schedule
  - Support: Capital, Draw schedule, Professional path
  - Takeout: Permit & MLI readiness, Exit
  - Contingency: Capital, Draw schedule, Recovery
- Responsiveness: no horizontal overflow was detected at 1244, 1078, or 433 CSS px. The existing
  responsive behavior suppresses the decorative sticky board below 1080 px and leaves the
  accessible scroll-panel content visible.

## Numeric comparison

The focused image comparator reported MAE 28.1132, p95 channel delta 198, SSIM -0.005297, and
23.1269% of pixels over delta 15. These strict parity numbers are intentionally non-gating: the
reference contains four utilities in a single row, while the user's selected target explicitly
replaces it with contextual two-row layouts and different labels. The comparison is retained as
evidence that exact source-pixel parity is not the acceptance criterion for the requested
composition change.

## Comparison history

1. Initial render: state content and order passed, but an independent layout critic found the
   center divider in three-item states too faint.
2. Fix: replaced the subtle pseudo-element with an explicit 1 px, 38%-white left border on the
   second first-row item.
3. Post-fix evidence: DOM geometry confirms two 249.87 px first-row cells, a 499.75 px full-width
   second-row cell, stable 47.44 px row heights, and the intended divider contract.
4. Independent detail critique objected to the two-row geometry relative to the old one-row
   reference. That finding is classified as an intentional deviation because the user's explicit
   instruction requires two rows.

## Verification

- Primary interaction checked: scrolling through all seven build-model states updates the card
  title, theme, dossier, progress marker, and contextual band together.
- Console errors: none observed during the state capture pass.
- Formatting: Prettier passed after formatting the three edited component files.
- Repository rule followed: no test suite, Playwright suite, or production build was run for this
  marketing-page-only change.

final result: passed
