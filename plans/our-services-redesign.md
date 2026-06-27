# Our Services Section Redesign

## Context
- The user wants a new version of the FairLend "Our Services" section that matches the supplied pitch-deck image.
- The current `src/components/FairlendServicesSection/index.tsx` is a tabbed, 5-card layout.
- The reference image is a 4-column editorial layout with a dark-green header bar, large "OUR / SERVICES" lockup, a short value prop, a faint map background, and a bottom "Transparency • Integrity • Performance" strip.
- Motion brief: editorial / Swiss-style choreography, including the dividing lines.
- The user has confirmed: **replace the existing `FairlendServicesSection` component** and **reuse the existing `partners-handshake-puzzle-icon.webp` for card 04**, with a TODO/placeholder note for a future building-with-sign asset.

## Desired End State
- A single, self-contained `FairlendServicesSection` component that visually matches the supplied image as closely as possible.
- Scroll-triggered, Swiss/editorial-style entrance animations: header reveal, line draws, column stagger, and footer fade-in.
- Full `prefers-reduced-motion` fallback.
- Responsive behavior: 4 columns on desktop, 2x2 on tablet, single column on mobile, with dividers adapting accordingly.
- No broken existing imports or pages.

## Approach
1. **Rewrite `FairlendServicesSection/index.tsx`** as a single `'use client'` component with a full-bleed layout.
2. **Structure:**
   - Dark-green left header panel with the FairLend Capital logo and `EST. 2015`.
   - Large "OUR" (green) / "SERVICES" (orange) lockup.
   - Vertical divider + description paragraph + "FOCUSED ON REAL OUTCOMES" kicker.
   - Faint blueprint/map background on the right.
   - Four service columns (01–04) with number, icon, isometric image, title, horizontal rule, bullet list, and footer tagline + arrow.
   - Full-width bottom strip with values and logo.
3. **Animation:**
   - Use `motion`'s `useInView` to trigger a one-shot choreography when the section enters the viewport.
   - Animate divider lines via `scaleX` / `scaleY` transforms.
   - Stagger column content using CSS custom properties and a shared reveal keyframe.
   - Apply the existing `fairlendRevealUp` / `fairlendCardIn` easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Add `@media (prefers-reduced-motion: reduce)` overrides.
4. **Assets:**
   - Map existing service-concepts WebPs to the four cards.
   - Add a TODO comment above the Partners image noting the desired building-with-sign asset.
5. **Styling:**
   - Use Tailwind-only class names, OKLCH values from `:root`, and avoid arbitrary inline styles except for animation delays.
   - Use `next/image` with explicit `width`/`height`/`sizes`.

## Files to Modify
- `src/components/FairlendServicesSection/index.tsx` — full rewrite.
- `src/app/(frontend)/globals.css` — add line-draw and Swiss-reveal utility classes/keyframes.
- `src/components/FairlendOpportunityCanvas/index.tsx` — minor wrapper cleanup if needed (remove any max-width constraints from the old services section; confirm no layout regression).

## Reuse
- **Existing assets:** `public/assets/service-concepts/private-mortgage-investments-icon.webp`, `multi-mortgage-house-shield-icon.webp`, `construction-project-crane-icon.webp`, `partners-handshake-puzzle-icon.webp`.
- **Animation easing/tokens:** `src/app/(frontend)/globals.css` (`--fairlend-forest`, `--fairlend-orange`, `fairlendRevealUp` keyframe, `fairlendCardIn` keyframe).
- **Icon library:** `lucide-react` (`Shield`, `Home`, `Building2`, `Users`, `ArrowRight`, `Check`).
- **Utilities:** `cn` from `src/utilities/ui.ts`, `useInView` from `motion/react`.
- **Image component:** `next/image`.

## Asset Mapping
| Card | Title | Source image | Notes |
|------|-------|--------------|-------|
| 01 | Private Mortgage Investments | `private-mortgage-investments-icon.webp` | house + phone; acceptable substitute for the image's standalone house |
| 02 | Mortgage Financing | `multi-mortgage-house-shield-icon.webp` | modern house; close to image's card 02 |
| 03 | Construction Financing | `construction-project-crane-icon.webp` | matches image's crane scene |
| 04 | Partners | `partners-handshake-puzzle-icon.webp` | **TODO:** replace with building + "FairLend Partner" sign when asset is generated |

## Copy (from reference image)
### Header
- Logo: `FAIRLEND CAPITAL`
- Tag: `EST. 2015`
- Title: `OUR` (green) / `SERVICES` (orange)
- Description: `FairLend provides flexible financing and investment solutions designed for borrowers, builders, and investors.`
- Kicker: `FOCUSED ON REAL OUTCOMES`

### Card 01 — Private Mortgage Investments
- Icon: shield with dollar
- Bullets: `End-to-end digital servicing`, `Digital deal closing`, `Review and close deals from your phone`
- Footer: `INVESTING WITH CONFIDENCE →`

### Card 02 — Mortgage Financing
- Icon: house with dollar
- Bullets: `1st, 2nd, and 3rd+ mortgages for borrowers`, `Loan commitment within 72 hours`, `$0 payout fee`, `$50 missed payment fee`, `Flexible workout plans`
- Footer: `FAST. FLEXIBLE. RELIABLE. →`

### Card 03 — Construction Financing
- Icon: crane
- Bullets: `Invest in or finance a construction project`, `CMHC MLI Select available`, `8–14% returns`, `Make your own draw schedule`, `Complimentary build and finance consultants`, `Access to a network of contractors, professionals, and suppliers`
- Footer: `BUILT FOR BUILDERS →`

### Card 04 — Partners
- Icon: two people
- Bullets: `For architects, real estate agents, contractors, and other professionals joining our partner program`, `For brokers looking to co-broker deals`
- Footer: `STRONGER TOGETHER →`

### Bottom strip
- Values: `TRANSPARENCY • INTEGRITY • PERFORMANCE`
- Logo: small FairLend mark

## Steps
- [ ] Update `src/app/(frontend)/globals.css` with new utility classes:
  - `.services-reveal` (opacity + translateY)
  - `.services-line-x` / `.services-line-y` (scaleX/scaleY line draw)
  - `.services-stagger` children with `--i` delay
  - reduced-motion overrides.
- [ ] Rewrite `src/components/FairlendServicesSection/index.tsx`:
  - [ ] Build header bar with dark-green panel, logo, title, description, kicker, and map background.
  - [ ] Build four-column grid with vertical dividers.
  - [ ] Add card content: number, icon, image, title, line, bullets, footer tagline.
  - [ ] Add bottom values strip.
  - [ ] Wire `useInView` to toggle `data-visible` and drive the animation choreography.
  - [ ] Add `prefers-reduced-motion` support.
- [ ] Verify `FairlendOpportunityCanvas/index.tsx` still renders the section correctly without extra max-width wrappers.
- [ ] Add a TODO comment in the Partners column for the future building-with-sign asset.
- [ ] Spot-check responsive breakpoints (desktop 4-col, tablet 2x2, mobile 1-col).
- [ ] Run the local dev server and visually verify the section on `/` and `/fairlend-landing-hero`.

## Verification
- `pnpm dev` and open `http://localhost:3000` (or `/fairlend-landing-hero`).
- Scroll to the services section and confirm:
  - Header matches the image (dark panel, logo, EST. 2015, OUR/SERVICES lockup, description, kicker).
  - Four columns display with correct copy, images, icons, and dividing lines.
  - Entrance animation plays once on scroll: header reveals, lines draw, columns stagger in.
  - Reduced motion is respected (e.g., test with OS reduced motion enabled).
  - No layout breakage on mobile/tablet.
- No Playwright/E2E tests required per `AGENTS.md` for landing-page changes.
