# FairLend route selector — Impeccable section pipeline

Date: 2026-07-13  
Scope: `src/components/FairlendRouteSelector` on the root landing page only.

## Section queue

- [x] `FairlendRouteSelector` — the only page-level section authorized for this pipeline.

## Stage ledger

### Polish

- Restored the existing selected/unselected CTA hierarchy instead of hard-coding every route CTA as selected.
- Replaced the three nested residential mortgage cards with one ruled financing ledger.
- Added explicit article-to-heading relationships with `aria-labelledby`.
- Evidence: desktop section capture showed the active construction route as the only lime primary action, with no horizontal overflow.

### Bolder

- Made construction the unambiguous starting route with the existing white-paper/lime selection language and a dynamic `Start here` badge.
- Kept all amplification inside the documented paper, ink, and route-lime system.
- Evidence: selected and supporting routes remain visually distinct without new palette primitives.

### Typeset

- Ran the required isolated visual assessment and mechanical type scan in parallel.
- Removed the reverse `xl` headline scale and replaced it with a continuous `clamp(3.25rem, 4vw, 4rem)` scale.
- Normalized supporting titles to the documented 27px role; increased proof, service, helper, disclaimer, and process text for readability.
- Preserved two deliberate section-specific exceptions: the selected construction lead copy and the compact consultation-helper title.
- Detector advisories for 13–15px dense-card copy, 32px mobile card titles, and 13px CTA text are documented permissions in `DESIGN.md`; they were reviewed and not suppressed.
- Evidence: 390px, 820px, and 1600px captures report 52px, 52px, and 64px headlines with zero section/body overflow.

### Animate

- Reworked the entrance from broad blur/3D tilt into a shorter field-guide sheet reveal using bounded clip, opacity, and transform motion.
- Removed large-surface blur work, shortened the stagger, and stopped animating offscreen supporting cards on narrow screens.
- Added equivalent keyboard focus treatment for illustration feedback.
- Reduced motion renders the complete static frame with no animation, clip, opacity, or transform gating.
- Evidence: desktop state reached `active` with `routeCardIn`; mobile animated only the selected route; reduced-motion state reported `reduced`, `animation: none`, and full opacity.

### Overdrive

Directions considered:

1. Live underwriting route tracer — existing Canvas path retargets to the route being explored.
2. Scroll-driven topographic parallax — lower semantic value and partial browser support.
3. WebGL blueprint field — highest payload/maintenance cost and inappropriate for the trust register.

Selected direction: live underwriting route tracer. The shared canvas now exposes target changes; the route-selector client leaf mirrors the active target into a scoped preview state. The target gains the documented lime selection treatment, and the state clears on pointer exit. Canvas remains decorative, fine-pointer-only, reduced-motion-aware, and frame-driven only while moving or settling.

Evidence: browser interaction selected `residential-mortgages`, rendered non-empty canvas ink, lifted the card by 4px, and cleared both the preview attribute and section state on exit.

### Delight

- Selected exactly one delight: a 760ms maximum lime signal passing across the four process dots of the route being previewed.
- The signal is decorative, non-blocking, replayed only on a new route preview, and absent under reduced motion/touch input.
- Evidence: all four dots ran `routePreviewStepSignal`, returned to their original active/inactive colors, and produced no page errors.

## User-requested section changes folded into the pipeline

- The desktop grid is explicit: Construction Financing spans the Residential Mortgage and Backyard Rental rows; Invest anchors the bottom-left; the compact Partner Program card starts at the top of the bottom-right grid row.
- Partner Program is the final route in DOM and visual order, returns to the wider right column, and uses a purpose-fit 155px horizontal composition—exactly half of its previous 310px height.
- The reusable rental-income callout keeps its visual treatment, removes the redundant comparison sentence, and becomes a 112px-tall sticky note offset 28px above and 48px right of the Backyard Rental card. Desktop section and grid overflow remain visible, and the route-selector rail content owns a scoped stacking layer above the gutter siblings, so the note crosses both the card boundary and the right gutter without clipping or being painted over. The suite illustration remains visible beneath it.
- Garden/Laneway Suites now reuses the extracted `GardenSuiteOpportunityBadge` pattern with a route variant showing an illustrative `$2,660/mo` Toronto two-bedroom asking-rent benchmark.
- The callout keeps the benchmark and actual-rent/eligibility caveat while removing the redundant projected-takeout comparison sentence.
- The underlying callout remains available to the earlier overview section through the new shared server-rendered component.
- The existing full-width compass consultation banner is restored beneath the desktop card grid with its “Not sure what you need?” copy and booking CTA.

## Completion gate

- Composition: route data remains separate from rendering; the income callout is an extracted, reusable CVA component; no duplicated implementation was introduced.
- Static rendering: the section and cards remain Server Components. Browser behavior is isolated to the existing motion and arrow client leaves. With JavaScript disabled, all five cards and the rental-income callout remain visible.
- Assets: all route imagery remains WebP rendered through `next/image`; all visible desktop images loaded with intrinsic dimensions. Hidden responsive images correctly remain lazy.
- Responsive: 390px, 820px, 1280px, and 1600px have zero body overflow. At 1600px, Construction is 803px tall—reduced by the same 155px as Partner—while Partner remains 155px. The two columns both measure 1125px, terminate on the same baseline, and use exactly 12px for every horizontal and vertical card gutter.
- Accessibility: semantic heading structure is intact; all route articles resolve their labelled heading; every visible section interaction is at least 44×44px and exposes a focus-visible treatment; callout ink/lime contrast is 15.88:1.
- Motion: normal, narrow-screen, pointer-exit, and reduced-motion paths were verified in Chromium through Puppeteer-core. No Playwright or E2E was run.
- Quality checks: scoped ESLint and `git diff --check` pass. The detector's remaining type advisories are documented dense/compact roles or the two reviewed art-directed exceptions above.
- Browser console: no section page errors. The root page still emits a pre-existing hydration mismatch from `BuildSensitivityConsole`, outside this section and unchanged by this work.
- Repository constraints: no build and no test suite were run, per the landing-page instructions.

## Visual evidence

- Baseline: `route-selector-baseline-mobile.png`, `route-selector-baseline-tablet.png`, `route-selector-baseline-desktop.png`
- Final: `route-selector-final-mobile.png`, `route-selector-final-tablet.png`, `route-selector-final-desktop.png`
- Overdrive: `route-selector-stage-5-overdrive-tracer.png`
