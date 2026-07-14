# `/contact` Impeccable Page Pipeline

Date: 2026-07-14  
Target: `src/app/(frontend)/contact/page.tsx`  
Register: brand  
Quality bar: flagship marketing surface

## Outcome

The `/contact` route now uses FairLend's canonical paper, ink, lime, engraved-imagery, and landing-rail system. The former monolithic client section was replaced with three page-level server-rendered sections and one narrow client form leaf. Existing lead submission, analytics, metadata, structured data, direct contact links, licence disclosure, and policy links remain intact.

Repository constraints were observed: the existing dev server on port `4975` was reused; no build, test suite, Playwright suite, or E2E command was run.

## Section ledger

### Shared header

- **polish:** Verified the established `DirectionalHoverHeader` against the rebuilt route at desktop, tablet, mobile, and narrow-mobile widths.
- **bolder:** Preserved the existing root chrome because it is already the documented brand source of truth.
- **typeset:** Header hierarchy and touch targets remained unchanged; no contact-specific typography drift was introduced.
- **animate:** Existing header behavior was retained; no competing page-level header motion was added.
- **overdrive:** Considered contact-specific chrome, a dark route-aware header, and preserving the canonical root header. Selected preservation to avoid cross-route drift and needless global coupling.
- **delight:** Existing mobile call action remains the sole header interaction cue.
- **composition/static/assets:** No shared-header boundary or asset changes.
- **verification:** Header remained present, keyboard-semantic, and free of runtime warnings across all browser passes.

### Contact hero and file intake

- **polish:** Tightened content hierarchy, replaced undersized contact detail text, standardized Oxanium technical labels, improved contrast, preserved form labels, and focused the first invalid field on validation failure.
- **bolder:** Reframed the section as a capital-routing desk with the stronger proposition “Bring us the file. We’ll make the next move clear.”
- **typeset:** Cormorant display caps at `82px` with `-0.04em` tracking and `0.98` line-height; prose is `16px+`; metadata is confined to documented `10–12px` technical roles. The required isolated typography assessment and mechanical scan ran in parallel, then were synthesized. The final contact-scoped type detector returned `[]`.
- **animate:** Added one orchestrated ink reveal for the hero composition, a bounded engraving reveal, direct hover/active feedback, and a complete reduced-motion override. Static content remains visible and meaningful without animation.
- **overdrive:** Considered (A) a route-aware capital desk, (B) a parallax Toronto engraving, and (C) an interactive desk selector. Selected A for strongest product meaning, brand fit, accessibility, CSS-only progressive enhancement, browser support, performance, and maintenance cost.
- **delight:** The earned delight is the form success confirmation: a brief lime check transition and state-aware submit icon. It never delays submission and becomes effectively instant under reduced motion.
- **composition:** `ContactHeroSection.tsx`, `ContactMethodList.tsx`, and `ContactForm.client.tsx` own narrow responsibilities. The obsolete `src/components/contact-section.tsx` was removed.
- **static:** The hero and contact methods are Server Components. Only `ContactForm.client.tsx` hydrates for validation, submission state, and analytics.
- **assets:** Reused `/assets/fairlend-faq-reference/toronto-landmark-engraving.webp` through `next/image` with intrinsic dimensions, empty decorative alt text, lazy loading, and a responsive `sizes` contract corrected after browser inspection.
- **verification:** Desktop rendered at a `1600×1000` effective viewport, tablet at `911×1222`, mobile at `433×937`, and narrow mobile at `355×800`. No document-level overflow or heading overflow. Inputs render at ~48px, textarea at ~128px, and submit at ~52px. Empty submit focuses `#contact-email`; valid email plus empty message focuses `#contact-message`; both expose the live error through `aria-describedby` and `aria-invalid`.

### Financing pathways

- **polish:** Replaced four generic equal cards with a ruled routing ledger, stronger hierarchy, clearer descriptions, and visible focus treatment.
- **bolder:** Introduced the asymmetric “Four desks. One clean handoff.” composition with real route classifications and an engraved Southern Ontario property artifact.
- **typeset:** Each destination is a semantic `<h3>`; card prose is `16px`; technical route labels use the documented Oxanium role.
- **animate:** Each row has a fast route-line transition and arrow response on hover/focus. No blanket scroll-fade treatment was added.
- **overdrive:** Considered (A) a static routing ledger with progressive route trace, (B) a decorative compass/radial map, and (C) a client-side interactive route switcher. Selected A because it carries the financing mental model, works without JavaScript, supports every browser, and has the lowest maintenance and hydration cost.
- **delight:** The earned delight is the selected row's lime route trace across the top rule, paired with directional arrow movement.
- **composition:** Static route data lives in `data.ts`; `ContactPathwayLink.tsx` owns the repeated semantic link; `ContactPathwaysSection.tsx` owns section composition.
- **static:** Entire section is server-rendered with native links and no client boundary.
- **assets:** Reused `/assets/fairlend-faq-reference/infill-block-engraving.webp` via `next/image`, informative alt text, intrinsic dimensions, lazy loading, and a responsive source size that prevents tablet/mobile upscaling.
- **verification:** All four rows remain full-width at `355px`; headings do not overflow; the page remains horizontally stable. The final desktop image source was `608px` wide for a `586.7px` render; tablet selected a `1230px` source for a `924.9px` render.

### Regulated identity and policy docket

- **polish:** Consolidated identity, licence numbers, underwriting caveat, and policy links into one legible close to the page narrative.
- **bolder:** Turned the section into a precise licence docket instead of a generic legal block.
- **typeset:** Display copy uses Cormorant, body copy is `16px`, technical metadata uses Oxanium, and licence values use tabular numerals.
- **animate:** Policy links receive short focus/hover verification feedback only; the section has no ornamental entrance motion.
- **overdrive:** Considered (A) a licence dossier, (B) a large regulatory seal, and (C) an interactive disclosure drawer. Selected A for trust, semantic clarity, zero hydration, broad browser support, and low maintenance.
- **delight:** The earned delight is the compact lime verification surface on policy hover/focus, with a directional arrow response.
- **composition:** Added a `contact` CVA variant to the existing `FairlendRegistrationDisclosure`; no disclosure clone was created.
- **static/assets:** Entire section is server-rendered and asset-free.
- **verification:** Policy links are ~56px tall at the narrow viewport, focus-visible, and remain inside the document width. Licence information remains an explicitly labelled region.

### Shared footer

- **polish:** Verified the existing global footer, contact entry, expert form, licence links, and navigation hierarchy against the rebuilt page.
- **bolder/typeset/animate:** Preserved the canonical root footer to avoid cross-route design drift and duplicate delight.
- **overdrive:** Considered a contact-specific closing panel, a shortened footer, and the canonical capital-desk footer. Selected the canonical footer because it already completes the brand narrative and contains the required contact/regulatory surfaces.
- **delight:** Existing footer imagery and expert contact interaction remain the footer's intentional moment.
- **composition/static/assets:** No shared-footer code or asset changes.
- **verification:** Footer remained present in the accessibility tree and produced no console warnings/errors.

## Architecture and cleanup

- `src/app/(frontend)/contact/page.tsx` is a static page that now composes three `FairlendLandingRail` regions.
- `src/components/ContactPage/ContactHeroSection.tsx` is server-rendered.
- `src/components/ContactPage/ContactMethodList.tsx` is server-rendered and reusable.
- `src/components/ContactPage/ContactForm.client.tsx` is the only new contact-page client boundary.
- `src/components/ContactPage/ContactPathwaysSection.tsx` and `ContactPathwayLink.tsx` are server-rendered.
- `src/components/ContactPage/ContactComplianceSection.tsx` is server-rendered.
- `src/components/ContactPage/data.ts` separates typed route content from rendering.
- `src/components/FairlendRegistrationDisclosure.tsx` was extended with a contact variant; existing callers remain supported.
- `src/components/contact-section.tsx` was removed after all behavior was migrated.
- No new dependencies or generated assets were added.

## Verification evidence

- Existing Next.js dev server compiled and rendered `/contact` after the refactor.
- Browser evidence captured at desktop, tablet, mobile, and narrow-mobile viewports.
- No document-level horizontal overflow at any inspected viewport.
- No heading overflow at the `355px` narrow viewport.
- Form error paths focus the invalid control and expose accessible state.
- Heading order is `h1 → h2 → h3` with one page `h1`.
- Both page images completed successfully with nonzero intrinsic dimensions and corrected responsive source selection.
- Console warning/error log: empty.
- Contact-scoped Impeccable detector: `[]`.
- Contact-scoped Impeccable typography detector: `[]`.
- `git diff --check`: clean.
- React best-practices review: clean after converting pathway titles to semantic `h3` elements.
- shadcn audit checklist: imports and installed primitives verified; local `next/image` assets require no remote pattern; browser compilation supplied TypeScript/runtime evidence; browser verification completed.

The full-file detector still reports the existing `11px` and `15px` dense-metadata values in the unrelated `hero` and `footer` variants of `FairlendRegistrationDisclosure`. DESIGN.md explicitly permits `10–12px` labels and `13–15px` dense-card copy, so these are retained as documented contextual exceptions. The real pre-existing `9px` mobile label was corrected to `10px`.
