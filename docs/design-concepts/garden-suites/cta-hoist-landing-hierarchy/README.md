# CTA Hoist — Landing Hierarchy Concepts

Eight generated desktop hero concepts for FairLend's Garden Suite Financing page. The set uses the live landing page's above-the-fold hierarchy and the selected forest, ivory dossier, and blueprint directions.

## Shared hierarchy

- Restrained ivory navigation with FairLend identity, primary navigation, and expert phone CTA
- Lime technical eyebrow
- Dominant editorial serif H1: “Garden Suite Financing in Toronto, Built Around Your Project”
- Compact supporting copy
- Lime primary action and understated secondary link
- Builder reassurance row
- One large static architectural illustration
- One encapsulated CTA form suspended from an independently segmentable cable and hook

## Concepts

1. `01-field-stage-hoist.png` — Forest construction stage with a full-width project-plan board suspended over the worksite.
2. `02-survey-plan-hoist.png` — Ivory property survey with a portrait project-assessment file lowered through the central gutter.
3. `03-roof-truss-hoist.png` — Blueprint exploded framing axonometric with a gantry-suspended project form.
4. `04-permit-desk-hoist.png` — Ivory architect's permit desk and physical suite model with a compact review form.
5. `05-laneway-delivery-hoist.png` — Forest laneway material-delivery scene with a chain-block CTA board.
6. `06-foundation-inspection-hoist.png` — Ivory foundation cutaway with a verified next-draw release form.
7. `07-property-equity-cutaway-hoist.png` — Forest property section connecting existing equity, build capital, and rental income.
8. `08-draw-schedule-rail-hoist.png` — Blueprint suite cutaway and milestone rail with a trolley-suspended draw-schedule form.

## Motion contract

Each concept is composed around simple DOM animation rather than Lottie:

- Cable: `transform-origin: top; scaleY(0 → 1)`
- Hook or trolley: `translateY`, optionally a small `translateX` for concept 08
- Complete form: one rigid `translateY` element; no independently animated children required
- Static architectural scene: no motion required
- Reduced motion: render the final landed state immediately

## Generation mode

Generated with the built-in `imagegen` tool from five supplied visual references. Prompts explicitly constrained the output to a 16:9 production-style hero, FairLend's dossier palette and typography, crisp halftone engraving, sparse lime accents, and clean segmentation of every animated element.
