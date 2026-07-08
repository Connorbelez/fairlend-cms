---
name: FairLend Root Landing Page
description: Current visual system for `/`, including standalone landing chrome, rail-wrapped section stack, scroll choreography, FAQ, and footer.
source:
  route: "src/app/(frontend)/page.tsx"
  chrome: "src/app/(frontend)/FrontendChrome.client.tsx"
  globals: "src/app/(frontend)/globals.css"
pageOrder:
  - "DirectionalHoverHeader from FrontendChrome"
  - "FairlendScrollChoreography"
  - "FairlendLandingRail fabric-of-squares: FairlendLandingHero"
  - "FairlendLandingRail grid-noise: FairlendRouteSelector"
  - "FairlendLandingRail inflicted: FairlendLandingOverviewSection"
  - "FairlendLandingRail debut-light: FairlendBuilderConsultingSection"
  - "FairlendLandingRail groovepaper: FairlendLeadershipSection"
  - "FairlendLandingRail gutters disabled: FairlendFaqSection"
  - "WatermelonFooter"
colors:
  paper: "#F8F7F5"
  panel: "#FFFFFF"
  surface: "#FBFAF8"
  card-paper: "#FBFAF5"
  overview-paper: "#FBFAF7"
  white-paper: "#FFFDF9"
  ink: "#08090A"
  ink-deep: "#030405"
  ink-soft: "#141414"
  muted: "rgb(73 73 68)"
  muted-soft: "rgb(108 108 100)"
  field-ink: "#15201F"
  muted-field: "#586562"
  rule: "#DEDED7"
  rule-soft: "rgb(8 9 10 / 14%)"
  lime: "#96EC18"
  acid: "#8DFF00"
  route-lime: "#9CFF00"
  lime-hover: "#A4FB20"
  lime-soft: "#E8FF9B"
  footer-lime-ink: "#203500"
  builder-cream: "rgb(255 253 247)"
  builder-paper: "rgb(255 250 241)"
  builder-forest: "oklch(0.235 0.026 164)"
  builder-coral: "oklch(0.588 0.151 42.5)"
  builder-blueprint: "oklch(0.464 0.091 243.7)"
  faq-paper: "#F7F6F1"
  faq-route: "#B7FF05"
typography:
  body:
    fontFamily: "var(--font-inter), Arial, sans-serif"
    lineHeight: 1.45
  display-serif:
    fontFamily: "var(--font-cormorant), Georgia, serif"
  builder-display:
    fontFamily: "\"League Gothic\", Impact, \"Arial Narrow\", sans-serif"
  builder-mono:
    fontFamily: "\"Oxanium\", \"Arial Narrow\", system-ui, sans-serif"
radii:
  button: "8px-12px"
  hero-cta: "9px"
  helper: "14px"
  card: "18px"
  section: "24px"
  hero-bottom: "28px"
  pill: "9999px"
spacing:
  landing-frame-max: "1848px"
  hero-x: "clamp(24px, 4.55vw, 60px)"
  hero-top: "clamp(28px, 4vw, 40px)"
  route-y: "70px"
  overview-padding: "58px 49px"
components:
  landing-page:
    backgroundColor: "{colors.paper}"
    minHeight: "100svh"
  landing-rail:
    width: "min(100%, var(--landing-frame-max))"
    gutters: "var(--landing-gutter-width)"
    desktopDots: "8px square cross dots from 768px up"
  primary-action:
    backgroundColor: "{colors.lime}"
    hoverBackgroundColor: "{colors.lime-hover}"
    textColor: "#101010"
  selected-route:
    borderColor: "{colors.route-lime}"
    backgroundColor: "{colors.card-paper}"
    shadow: "0 22px 48px rgb(138 255 0 / 14%), inset 0 0 0 1px rgb(156 255 0 / 24%)"
---

# Design System: FairLend Root Landing Page

## 1. Scope

This document describes the current root landing page at `/`. The source of truth is `src/app/(frontend)/page.tsx`, plus the standalone chrome applied by `src/app/(frontend)/FrontendChrome.client.tsx`.

The page is no longer only the first three sections. It now includes:

- Standalone `DirectionalHoverHeader`.
- `FairlendScrollChoreography`.
- Six `FairlendLandingRail` bands: hero, route selector, overview, builder consulting, leadership, and FAQ.
- Global `WatermelonFooter`.

Do not infer admin, Payload CMS, generic page-builder, Watermelon demo, or non-root route design rules from this file. It is a root landing page spec.

## 2. Creative North Star

**Toronto lending operating map.**

The page should feel like a premium field guide for real property finance: local, practical, structured, and high-trust. The design language is warm paper, black ink, city and route imagery, selected lime action, and technical underwriting detail. It should not feel like navy-and-gold banking, generic blue fintech, or a SaaS landing page with interchangeable cards.

## 3. Architecture

The live root route renders this order:

1. `DirectionalHoverHeader` through `FrontendChrome` because `/` is a standalone landing path.
2. `.fairlend-landing-page` shell with `min-h-svh` and `#f8f7f5`.
3. `FairlendScrollChoreography`, a client-only GSAP/ScrollTrigger controller.
4. Hero rail with `gutterTexture="fabric-of-squares"`.
5. Route selector rail with `gutterTexture="grid-noise"` and `id="services"`.
6. Overview rail with `gutterTexture="inflicted"`.
7. Builder consulting rail with `gutterTexture="debut-light"`.
8. Leadership rail with `gutterTexture="groovepaper"`.
9. FAQ rail with `--landing-gutter-width: 0px` and rail dots hidden.
10. `WatermelonFooter`.

The page metadata is:

- Title: `Fairlend | Multiplex, Single Family, and Land Financing`
- Description: `Fairlend guides Toronto builders and investors through permit, acquisition, construction, and completion financing.`

## 4. Color System

The base palette is paper plus ink, with electric lime used for action, selected state, pathfinding, and proof. The newer builder and leadership sections add a technical planning palette, but it must stay compartmentalized.

### Core

- **Landing Paper** (`#F8F7F5`): Root background, hero paper, leadership paper, footer paper.
- **Panel White** (`#FFFFFF`): Leadership panels, footer panel, high-contrast paper blocks.
- **Surface Paper** (`#FBFAF8`): Directional header surface.
- **Card Paper** (`#FBFAF5`): Route cards, route helper, FAQ panels.
- **Overview Paper** (`#FBFAF7`): Overview section and financing cards.
- **Ink** (`#08090A`): Default high-contrast landing text.
- **Deep Ink** (`#030405` / `#050506`): Hero and display emphasis.
- **Muted Ink** (`rgb(73 73 68)` / `rgb(108 108 100)`): Footer, leadership, and dense support copy.
- **Rules** (`#DEDED7`, `#DEDEDB`, `rgb(8 9 10 / 14%)`): Borders, rails, card dividers, footer grid lines.

### Lime

- **Application Lime** (`#96EC18`): Hero CTA, form submit, leadership signal, footer lime.
- **Header Acid** (`#8DFF00`): Standalone header accent and hero trust heart.
- **Route Lime** (`#9CFF00`): Selected route card, selected route CTA, active route dot, route helper CTA.
- **Hover Lime** (`#A4FB20`): Primary action hover.
- **Soft Lime** (`#E8FF9B`): Route icon orbs and selected support surfaces.
- **Footer Lime Ink** (`#203500`): Footer section labels on light paper.

### Section Accents

- **Builder Cream** (`rgb(255 253 247)`) and **Builder Warm Paper** (`rgb(255 250 241)`) ground the builder consulting canvas.
- **Builder Forest** (`oklch(0.235 0.026 164)`) is the primary builder ink.
- **Builder Coral** (`oklch(0.588 0.151 42.5)`) marks risk, loss, and project-friction details.
- **Builder Blueprint** (`oklch(0.464 0.091 243.7)`) is allowed only as a technical drawing accent. It is not a generic trust blue.
- **FAQ Route Lime** (`#B7FF05`) powers the route path and active FAQ map marks.

### Named Rules

**The Lime Rarity Rule.** A decision area gets one dominant lime action. Supporting lime marks can orient the eye, but lime should not become paragraph color.

**The Paper Continuity Rule.** The root page should read as one continuous paper system. Gutter textures, rail dots, rounded cuts, skyline imagery, and density shifts carry section changes.

**The Blueprint Exception Rule.** Blue is allowed in builder consulting only when it behaves like a drawing or planning accent. Do not introduce broad blue fintech panels, CTAs, or trust badges.

## 5. Typography

The root layout loads Inter and Cormorant Garamond through `next/font/google`.

- **Serif Display:** `var(--font-cormorant), Georgia, serif`.
- **Body / UI:** `var(--font-inter), Arial, sans-serif`.
- **Builder / Leadership Display:** `"League Gothic", Impact, "Arial Narrow", sans-serif`.
- **Builder / Leadership Technical Labels:** `"Oxanium", "Arial Narrow", system-ui, sans-serif`.

### Hierarchy

- **Hero Display:** `clamp(62px, 6.8vw, 87px)`, `500`, `1.07`, `-0.047em`; mobile is `58px`, `1.03`, `-0.052em`, with `51px` below `390px`.
- **Proof Stats:** Serif `72px`, `0.82`, tight tracking, paired with plain `18px` labels.
- **Route Display:** `52px` mobile, `60px` small, `72px` desktop, serif `600`, `0.89`, centered.
- **Overview Display:** Large serif, tight tracking, used for company positioning and section title. Keep long copy out of this style.
- **Route Card Title:** Serif, compact, around `27px`, intentionally constrained to keep card density.
- **Builder / Leadership Display:** Condensed display type. It should feel like a project ledger, site signage, or underwriting board, not a marketing hero headline.
- **FAQ Text:** Dense, map-adjacent interface copy. Questions should stay direct and scannable.
- **Kickers / Labels:** Heavy uppercase Inter or Oxanium. Use sparingly. The page already has route kicker, overview labels, builder labels, leadership labels, FAQ route labels, and footer `//` headings.

### Named Rules

**The Big Type Does the Trust Work Rule.** Major promises belong in Cormorant or the established compressed builder/leadership display stack. Do not swap major claims into generic sans-serif without a full redesign.

**The Label Budget Rule.** This page already uses many label systems. Do not add decorative eyebrows to every block.

**The Mobile Fit Rule.** Hero, route, overview, builder, leadership, and FAQ headings all run aggressive sizing or tracking. New copy must be checked against the smallest breakpoint before shipping.

## 6. Rails And Textures

`FairlendLandingRail` is the structural wrapper for every root content section.

- Desktop uses three columns: left gutter, content, right gutter.
- Gutters draw vertical rules and texture backgrounds from `globals.css`.
- Rail cross dots appear from `768px` up.
- Adjacent rails get quiet top rules to make the page feel like stacked paper bands.
- Mobile collapses to block layout and hides gutters.

Texture mapping:

- Hero: `fabric-of-squares`.
- Route selector: `grid-noise`.
- Overview: `inflicted`.
- Builder consulting: `debut-light`.
- Leadership: `groovepaper`.
- FAQ: gutters and dots disabled.

Do not wrap rail content in extra floating page cards. Sections are the frame.

## 7. Components

### Standalone Directional Header

The root page uses `DirectionalHoverHeader`, not the CMS `Header`.

- **Brand:** `FairLend` wordmark with divider and mortgage label.
- **Desktop nav:** Financing Solutions, Investor Opportunities, Who We Are, Resources, Contact.
- **Interaction:** Directional mega-menu hover, keyboard navigation, focus management, animated open/close using motion easing.
- **Actions:** Sign in, Get in touch, and small language/action affordance depending on viewport.
- **Palette:** `#fbfaf8` surface, `#101213` ink, `#8dff00` acid accent, `rgb(26 28 28 / 10%)` rules.
- **Rule:** Header should feel integrated with the paper page, not like a separate app chrome bar.

### Landing Hero

`FairlendLandingHero` is the first-viewport brand impression.

- **Canvas:** Full width, `min-h-svh`, inner canvas `h-[min(100svh,972px)]`, `min-h-[760px]`, rounded bottom `28px`.
- **Background:** `#f8f7f5` with Toronto skyline and cloud layers.
- **Headline:** "Financing for multi-plex, single family, and land." Left aligned, serif, max width around `466px`.
- **CTA:** "Start your application" lime button with black arrow square.
- **Proof Stats:** Desktop `xl` absolute rail with `$2B+`, `24 hrs`, and `28+`.
- **Trust Cue:** Desktop avatar cluster using `/assets/elie-headshot.webp`, grayscale rotations, lime heart, and "trusted by borrowers, builders & investors".
- **Application Form:** Absolute desktop card, responsive mobile dock. Tabs: Build, Invest, Get a mortgage.
- **Motion:** Hero copy, skyline, clouds, and form animate through hero-specific CSS/JS. Reduced motion must remove transform, blur, and drift.

Hero assets:

- `/assets/fairlend/toronto-hero-16x10/toronto-skyline-waterfront-16x10.webp`
- `/assets/fairlend/toronto-hero-16x10/cloud-upper-west.webp`
- `/assets/fairlend/toronto-hero-16x10/cloud-upper-east-large.webp`
- `/assets/fairlend/toronto-hero-16x10/cloud-mid-west-large.webp`
- `/assets/fairlend/toronto-hero-16x10/cloud-mid-east-small.webp`
- `/assets/fairlend/toronto-hero-16x10/cloud-low-west.webp`
- `/assets/fairlend/toronto-hero-16x10/cloud-low-east.webp`
- `/assets/fairlend/toronto-hero-16x10/cloud-far-east-low.webp`

### Hero Application Form

- **Tabs:** Build, Invest, Get a mortgage. Active state uses `aria-selected`.
- **Build:** Address-first, with Google address autocomplete.
- **Invest:** Name, email, phone, amount, focus.
- **Mortgage:** Name, email, phone, address, approximate equity.
- **Submit:** Posts to `/api/leads`, then routes to `/intake` with intent/source and available lead data.
- **Fields:** `clamp(46px, 3.1vw, 52px)`, `12px` radius, translucent white paper, `#dededb` border.
- **Focus:** Lime border plus `0 0 0 3px rgb(150 236 24 / 18%)`.

### Route Selector

`FairlendRouteSelector` is the main pathfinding section.

- **Copy:** "Choose your route" and "Where would you like to go with FairLend?"
- **Section:** `#f7f6f1`, `24px` radius, desktop vertical padding around `70px`, topographic paper background plus pale overlay.
- **Motion:** Route arrow and card reveals are handled by `FairlendRouteSelectorMotion` and `FairlendRouteSelectorArrow`.
- **Grid:** One column mobile, two columns from `md`, four columns from `xl`.
- **Default Selection:** `private-mortgage`.
- **Routes:** Invest with FairLend, Get a private mortgage, Get construction financing, Partner program.
- **Helper Banner:** "Not sure which route is right for you?" with compass illustration and "Help me choose".

Route assets:

- `/assets/fairlend-route-selector/topographic-paper-background.webp`
- `/assets/fairlend-route-selector/investor-skyline-engraving.webp`
- `/assets/fairlend-route-selector/private-mortgage-house-engraving.webp`
- `/assets/fairlend-route-selector/construction-building-engraving.webp`
- `/assets/fairlend-route-selector/partner-handshake-engraving.webp`
- `/assets/fairlend-route-selector/route-compass-engraving.webp`

### Route Cards

- **Shape:** `18px` radius, minimum height `520px`, `18px` padding, overflow hidden.
- **Default State:** Light paper translucency, `#deded7` border, low shadow, hover lift only when motion is allowed.
- **Selected State:** Lime border, selected shadow, lime CTA, `Popular` badge where applicable, active first step dot.
- **Content Model:** Icon orb, serif title, description, benefit bullets, monochrome illustration, four-step track, full-width CTA.
- **Rule:** Selection is a state treatment. Do not scale, float, or resize the selected route card.

### Landing Overview

`FairlendLandingOverviewSection` bridges brand credibility and product categories.

- **Canvas:** `#fbfaf7`, desktop target height around `941px`, padding `58px 49px`.
- **Left Side:** "Who We Are", large serif positioning, three proof/expertise cells, Toronto skyline visual language.
- **Expertise Items:** Local Expertise, Disciplined Approach, Aligned Interests.
- **Right Side:** "What We Finance", serif section title, six finance cards.
- **Finance Items:** Residential Private Mortgages, Bridge Loans, Renovation Financing, Multi-plex Financing, Garden & Laneway Suites, MLI-Select Insured Housing.
- **Visual Rule:** Finance cards are dense, bordered, icon-led, and numbered `01-06` in lime. Keep them operational, not decorative.

Overview assets live under `/assets/about-webp/webp/`:

- `finance-icon-residential-private-mortgages.webp`
- `finance-icon-bridge-loans.webp`
- `finance-icon-mortgage-investments.webp`
- `finance-icon-multiplex-financing.webp`
- `finance-icon-garden-suites.webp`
- `finance-icon-purpose-built-rentals.webp`

### Builder Consulting

`FairlendBuilderConsultingSection` introduces the project-planning and construction-risk design mode.

- **Palette:** Warm cream, forest ink, coral risk marks, restrained green, blueprint blue as a technical accent.
- **Typography:** League Gothic-style condensed display plus Oxanium-style technical labels.
- **Content Grammar:** Timeline years (`2019`, `2023`, `2026`), project inputs (`LAND`, `LOT BASIS`, `BUILD COST`, `PER FT2`, `HOME PROGRAM`, `OUTPUT`, `EXPECTED SALE`, `EXIT VALUE`), and program choices.
- **Program Labels:** Single family, Multiplex, GardenSuite.
- **Imagery:** `/assets/right-house-estate.webp` with paper textures `/assets/heatherpapertexture.png` and `/assets/diagonal_paperTexture.png`.
- **Rule:** This section can feel more like a feasibility board than the first three sections, but it must still sit on the same paper rail system.

### Leadership

`FairlendLeadershipSection` turns proof into a regulated-practice story.

- **Palette:** Returns to `#f8f7f5`, white panels, black ink, muted copy, lime signal.
- **Typography:** Same compressed display and Oxanium technical mode as builder consulting.
- **Assets:** `/assets/elie-headshot.webp`, `/assets/fairlend-principal-broker-background.webp`, plus paper textures.
- **Proof Points:** Years experience, Total financed `$2B+`, Lenders & borrowers `160+`, Toronto-based `GTA`.
- **Capabilities:** Brokerage expertise, Construction finance, MLI Select planning, Deal structuring.
- **Commitments:** Regulated. Trusted. Accountable.; Client-first approach; Transparent communication; Results that speak for themselves.
- **Rule:** Leadership should feel accountable and specific. Avoid vague founder-card fluff.

### FAQ

`FairlendFaqSection` is a client component with JSON-LD and an interactive route-map FAQ UI.

- **Groups:** Borrowers, Investors, Builders, Partners.
- **Default Item:** The second investor FAQ is active by default.
- **Visual System:** Topographic paper, route path, numbered stops, active panels, compass/building/Toronto reference imagery.
- **Assets:** `/assets/fairlend-route-selector/topographic-paper-background.webp`, `/assets/fairlend-faq-reference/toronto-skyline-reference.webp`, `/assets/fairlend-faq-reference/compass-reference.webp`, `/assets/fairlend-faq-reference/bottom-building-reference.webp`.
- **Interaction:** Accordion state drives the route map. Questions must stay short enough to scan in the mapped layout.
- **Rule:** FAQ is part of the conversion path, not a support-page dump. Keep answers practical and finance-specific.

### Footer

The root page ends with `WatermelonFooter`.

- **Canvas:** `#f8f7f5` footer paper with bordered white panel, grid ticks, low shadow, and paper/technical rhythm.
- **Tokens:** `--footer-paper`, `--footer-panel`, `--footer-ink`, `--footer-muted`, `--footer-line`, `--footer-lime`, `--footer-lime-ink`.
- **Content:** Brand/legal disclosure, default public nav fallbacks, service links, borrower links, compliance links, FSRA verification, privacy, terms.
- **Newsletter:** Posts email leads to `/api/leads` with `intent: newsletter` and `source: footer-newsletter`.
- **Motion:** Uses `motion/react` reveal variants and respects reduced motion.
- **Rule:** Footer can be information-dense, but it should remain quiet, compliant, and grounded in the same paper/lime system.

## 8. Motion

Motion is part of the page architecture, not decoration.

- `FairlendScrollChoreography.client` registers GSAP `ScrollTrigger`.
- Route selector elements use `data-fairlend-route-motion` and selected-state attributes.
- Hero uses skyline/cloud parallax, cloud drift, copy reveal, and form reveal.
- Overview animates skyline, clouds, labels, title lines, copy, finance cards, and section marks.
- Builder and leadership use scroll reveals, line drawing, proof item entrance, and restrained parallax.
- FAQ uses client-side accordion state and SVG route path recalculation.
- Footer uses motion reveal variants.

Reduced motion must disable or substantially flatten transform-heavy effects, blur, filter animation, cloud drift, and scroll-scrubbed movement.

## 9. Elevation

Depth comes from paper layering, border rules, active state, and small tactical shadows.

- **Hero CTA:** `0 10px 24px rgb(118 205 0 / 12%)`, with stronger hover lift.
- **Hero Form:** Soft paper card shadow, stronger only on desktop.
- **Route Card:** `0 18px 42px rgb(27 25 18 / 5%)`.
- **Route Card Hover:** `0 24px 52px rgb(27 25 18 / 8%)`.
- **Selected Route:** Lime shadow plus inset lime line.
- **Helper Banner:** `0 16px 38px rgb(28 26 18 / 5%)`.
- **Avatar:** `0 6px 14px rgb(0 0 0 / 8%)`.
- **Footer Panel:** `0 28px 80px rgb(8 9 10 / 8%)` plus inset white highlight.

Do not add heavy ambient shadows to every paper surface. If a block already has a visible border, keep its shadow light.

## 10. Do's And Don'ts

### Do:

- **Do** source root landing decisions from `src/app/(frontend)/page.tsx` and its imported components.
- **Do** preserve the exact section order unless there is a deliberate content strategy change.
- **Do** use existing components directly: `FairlendLandingRail`, `FairlendLandingHero`, `FairlendRouteSelector`, `FairlendLandingOverviewSection`, `FairlendBuilderConsultingSection`, `FairlendLeadershipSection`, `FairlendFaqSection`, and `WatermelonFooter`.
- **Do** keep Toronto skyline, route/topographic imagery, and paper textures as primary brand signals.
- **Do** use lime for action, route selection, active steps, guide marks, proof accents, and focus.
- **Do** keep the route selector selected state redundant: color plus border plus badge/CTA/step treatment.
- **Do** keep builder and leadership technical typography compartmentalized to those sections.
- **Do** preserve keyboard, focus, reduced-motion, and semantic states in header menus, tabs, forms, route links, accordions, and footer forms.
- **Do** keep body copy high contrast on paper surfaces.

### Don't:

- **Don't** revert the page to a first-three-sections-only design model.
- **Don't** introduce navy/gold banking cliches or generic blue fintech trust styling.
- **Don't** use lime for normal paragraphs.
- **Don't** add glassmorphism. Current translucency is paper-like and restrained.
- **Don't** wrap whole sections in floating cards or cards inside cards.
- **Don't** add repeated decorative eyebrows where section labels already exist.
- **Don't** scale or resize selected route cards.
- **Don't** create new card grids when an existing root landing component can be adapted.
- **Don't** let long display copy overflow on mobile.
- **Don't** separate the footer/header from the landing paper system with a visually unrelated theme.
