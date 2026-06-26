# Fairlend Hero Handwritten Caret Alignment Plan

## Context
- The Fairlend hero handwritten note `(and execution support)` is currently rendered above the hero title, but its caret/connector is misplaced and visually clipped.
- Desired outcome: the caret sits precisely between the words `Financing` and `for:` in the orange `Financing for:` line, while `(and execution support)` sits above the hero text with its horizontal center directly above that caret.
- Current implementation renders the note in `HeroHandwrittenInsertion.client.tsx` as a flex row with the connector after the text, then places it before the `<h1>` in `src/components/FairlendLandingHero/index.tsx`. That makes the connector naturally land at the note's right edge rather than at the target gap in `Financing for:`.

## Approach
- Convert the handwritten insertion from a separate, margin-positioned line into an anchored overlay tied to the `Financing for:` line.
- Move/render `HeroHandwrittenInsertion` inside `HeroFinancingLine`, so the component can anchor to the gap between `Financing` and `for:` instead of relying on viewport-specific left margins.
- Split the orange line into `Financing`, an inline relative anchor/caret slot, and `for:`. Position the handwritten note absolutely above that anchor with `left: 50%` / `translate-x(-50%)`; position the connector below the note at the same anchor center.
- Preserve current responsive typography and visibility behavior by reusing the existing `hero-*` variants for note font size, vertical offset, and hiding on very short mobile viewports.

## Files to modify
- `src/components/FairlendLandingHero/HeroHandwrittenInsertion.client.tsx`
- `src/components/FairlendLandingHero/index.tsx`
- `tests/e2e/fairlend-hero-responsive.spec.ts` (optional but recommended, to assert the connector center aligns with the financing-line anchor)
- `tests/e2e/frontend.e2e.spec.ts` (optional smoke assertion update if the DOM structure changes enough to affect existing locators)

## Reuse
- `cn` utility from `src/utilities/ui.ts` for class merging.
- Existing `HeroFinancingLine` function in `src/components/FairlendLandingHero/index.tsx` as the correct semantic placement for the anchor.
- Existing `data-testid="hero-handwritten-insertion"` and `data-testid="hero-handwritten-connector"` selectors used by `tests/e2e/fairlend-hero-responsive.spec.ts`.
- Existing custom Tailwind variants from `src/app/(frontend)/globals.css`: `hero-mobile`, `hero-tablet`, `hero-tablet-landscape`, `hero-tablet-landscape-short`, `hero-portrait-wide`, and `hero-mobile-short`.

## Steps
- [ ] Refactor `HeroHandwrittenInsertion` to remove viewport-specific `ml-[...]` positioning and accept/assume an anchor context.
- [ ] Make the outer insertion absolutely centered on the anchor (`left-1/2 -translate-x-1/2`) and place it above the line with responsive negative `top`/`bottom` offsets.
- [ ] Rework the connector so it originates from the anchor center rather than from the note's right edge; keep the handwritten blue color and existing entrance animations.
- [ ] Update `HeroFinancingLine` to split `Financing` and `for:` with a relative inline anchor between them, then render `HeroHandwrittenInsertion` inside that anchor.
- [ ] Ensure both desktop and compact/mobile `HeroFinancingLine` usages receive the same anchored behavior without duplicating the note outside the title.
- [ ] If needed, add a small test-only marker on the anchor slot (for example `data-testid="hero-financing-caret-anchor"`) so Playwright can compare connector center to the intended gap.
- [ ] Update responsive E2E checks to assert the handwritten connector is fully visible and horizontally centered near the anchor/gap across representative compact, tablet-landscape, portrait-wide, and desktop viewports.

## Verification
- Run the focused responsive hero suite:
  - `RESPONSIVE_HERO_STRICT=1 ROUND=handwritten-caret pnpm exec playwright test tests/e2e/fairlend-hero-responsive.spec.ts --project=chromium`
- Run the frontend hero smoke suite:
  - `pnpm exec playwright test tests/e2e/frontend.e2e.spec.ts --project=chromium`
- Manually inspect `/fairlend-landing-hero` at the reported screenshot viewport and representative breakpoints to confirm:
  - caret sits between `Financing` and `for:`;
  - note text is centered over the caret;
  - no note/caret clipping or horizontal overflow;
  - existing form, map, process, and stats layout remains stable.

## Assumption
- Apply the anchored handwritten note anywhere the `Financing for:` line is visible, preserving `hero-mobile-short:hidden` or equivalent only for constrained heights where the note would crowd or clip.
