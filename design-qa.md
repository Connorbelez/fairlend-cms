# Garden Suite Hoisted Dossier — Design QA

## Comparison target

- Source visual truth: `/Users/connor/.codex/visualizations/2026/07/21/019f86d7-2b32-7670-bd02-dce65273202b/dossier-reference-source.png`
- Rendered implementation: `/Users/connor/.codex/visualizations/2026/07/21/019f86d7-2b32-7670-bd02-dce65273202b/qa-desktop-open.png`
- Full-view comparison: `/Users/connor/.codex/visualizations/2026/07/21/019f86d7-2b32-7670-bd02-dce65273202b/dossier-reference-comparison-final.png`
- Focused card comparison: `/Users/connor/.codex/visualizations/2026/07/21/019f86d7-2b32-7670-bd02-dce65273202b/dossier-focus-comparison.png`
- Focused notch comparison: `/Users/connor/.codex/visualizations/2026/07/21/019f86d7-2b32-7670-bd02-dce65273202b/dossier-notch-comparison.png`
- Primary viewport: 1680 × 950 CSS px at device scale factor 1.
- Additional viewports: 1440 × 900, 1280 × 800, 1100 × 780, 1024 × 768, and 390 × 844 CSS px.
- Source pixels: 3446 × 1822. The full-view source was center-cropped and normalized to 1680 × 950; the right dossier was independently cropped and normalized to 700 × 600 for the focused comparison.
- Implementation pixels: 1680 × 950; the implemented dossier was cropped at its rendered 700 × 600 CSS size.
- State: desktop, form aligned after the automatic page-load hoist.

## Acceptance contract

- Translate the right-hand reference card into a live form using the same dark technical-dossier language.
- Use a more vertical, right-shifted composition without covering copy or interactable elements.
- Carry the notched silhouette through the visible outline, with measurement ticks and subtle paper texture.
- Preserve the detailed raster ropes, hooks, mounting geometry, page-load hoist, live validation, close/reopen behavior, and reduced-motion final state.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: the implementation preserves the reference's editorial-serif versus condensed-technical-sans hierarchy. Display copy remains optically dominant; labels, state text, and button text retain the compact tracked dossier treatment. No wrapping, clipping, or truncation failures are visible.
- Spacing and layout rhythm: the form is a 700 × 600 CSS px vertical dossier anchored on the right. Its controls use a clear full-width address row, two-column project/contact grid, and full-width submit action. The two mounts remain symmetric at 37.5% and 62.5%; their midpoint matches the panel midpoint with a measured 0 px center delta.
- Colors and visual tokens: deep navy and blue-black surfaces, ivory display type, blue-gray rules, and sparse lime verification/action states map directly to the reference. Coral is reserved for invalid state feedback and remains legible on navy.
- Image quality and asset fidelity: the form uses a generated low-contrast dark-paper raster texture and a real raster measurement-tick asset. Existing high-resolution rope/hook art is preserved without stretching, substitute SVGs, or floating gaps. The combined focused comparison confirms the same technical-paper density and edge language as the source.
- Copy and content: all live assessment fields, privacy statement, file state, heading, and submit copy are intact and readable. The implementation intentionally uses the application's project-assessment content rather than copying the reference's financing explainer copy.
- Outline and notches: the one-pixel blue-gray shell and inset fill share the same clipped polygon. The outline visibly follows the top-right diagonal notch and bottom-left release notch; no rectangular border remains behind either cut.
- Interaction states: focus uses a lime arrival border, select content inherits the navy dossier palette, validation uses readable coral, close lowers the panel, and reopen replays the hoist. Internal form details remain static while the containing hoist wrapper moves.
- Responsiveness and safety: animated desktop behavior is limited to widths at or above 1440 px. At 1439 px and below, the dossier renders directly in document flow. Collision arrays are empty at every audited viewport, and headline/body-copy overlap checks are false.
- Accessibility: field labels remain persistent, focused controls have a visible high-contrast state, invalid controls expose their state and error text, and reduced motion renders the complete panel directly in its verified final position.

## Comparison history

1. Earlier implementation used a pale 1040 × 270 horizontal strip. It had poor field clarity and did not match the selected dark technical-dossier reference.
2. Fix: rebuilt the form as a 700 × 600 right-anchored navy dossier, reorganized controls into a vertical grid, and restyled focus, validation, select, privacy, and submit states.
3. The first notched-card pass clipped only the fill while leaving a rectangular outer border, so the outline did not follow the top-right cut.
4. Fix: introduced a dedicated clipped shell and an inset pseudo-element that share the same polygon, then moved surface texture and edge ticks inside that silhouette.
5. Post-fix evidence: the full-view, focused-card, and focused-notch comparison inputs show the final diagonal outline, textured surface, edge measurements, sparse lime states, and compact technical typography alongside the source.
6. Geometry verification confirms a 0 px hoist-center delta, zero external interactable collisions, no copy overlap, no internal scroll at 1680 × 950, and a complete static layout at narrower breakpoints.

## Verification

- Primary interactions: automatic hoist and compression settle, focus, select-open, validation error, close/lower, reopen, reduced motion, desktop boundary, tablet, and mobile states.
- Browser events: no application console errors in the final QA capture.
- Static checks: targeted ESLint, TypeScript `--noEmit`, asset-script syntax, manifest JSON parsing, and `git diff --check` pass.
- Repository rule followed: no test suite, Playwright/E2E suite, or production build was run for this marketing-page-only change.

## Follow-up polish

- No blocking polish remains. The reference contains more editorial financing content than the live form can appropriately carry; that density difference is intentional and supports the conversion task.

final result: passed
