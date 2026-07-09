---
name: FairLend Root Landing Page
description: Toronto atlas imagery, underwriting precision, paper tactility, and electric-lime route signals for FairLend's canonical brand surface.
colors:
  signal-lime: '#96EC18'
  acid-lime: '#8DFF00'
  route-lime: '#9CFF00'
  signal-hover: '#A4FB20'
  signal-soft: '#E8FF9B'
  signal-ink: '#203500'
  paper: '#F8F7F5'
  surface: '#FBFAF8'
  route-paper: '#F7F6F1'
  card-paper: '#FBFAF5'
  white-paper: '#FFFDF9'
  ink: '#08090A'
  ink-deep: '#030405'
  muted: '#494944'
  muted-soft: '#6C6C64'
  rule: '#DEDED8'
  builder-blueprint: '#002949'
  builder-forest: '#002416'
typography:
  display:
    fontFamily: 'var(--font-cormorant), Georgia, serif'
    fontSize: 'clamp(64px, 5.35vw, 82px)'
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'var(--font-cormorant), Georgia, serif'
    fontSize: 'clamp(52px, 5vw, 72px)'
    fontWeight: 600
    lineHeight: 0.89
    letterSpacing: 'normal'
  title:
    fontFamily: 'var(--font-cormorant), Georgia, serif'
    fontSize: '27px'
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: 'normal'
  body:
    fontFamily: 'var(--font-inter), Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: 'normal'
  label:
    fontFamily: 'var(--font-inter), Arial, sans-serif'
    fontSize: '12px'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '0.28em'
  technical-label:
    fontFamily: 'Oxanium, ui-monospace, monospace'
    fontSize: '10px'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '0.16em'
  technical-display:
    fontFamily: 'League Gothic, Impact, Arial Narrow, sans-serif'
    fontSize: 'clamp(56px, 8vw, 118px)'
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: '-0.02em'
rounded:
  badge: '5px'
  arrow: '7px'
  button: '8px'
  hero-button: '9px'
  field: '12px'
  helper: '14px'
  card: '18px'
  section: '24px'
  hero-bottom: '28px'
  pill: '9999px'
spacing:
  touch-target: '44px'
  control-x: '18px'
  card-inset: '18px'
  section-x: 'clamp(20px, 4vw, 56px)'
  section-y: 'clamp(42px, 6vw, 76px)'
  hero-x: 'clamp(24px, 4.55vw, 60px)'
  landing-gutter: 'clamp(72px, 5.9vw, 112px)'
  landing-frame-max: '1848px'
components:
  button-primary:
    backgroundColor: '{colors.signal-lime}'
    textColor: '{colors.ink-deep}'
    rounded: '{rounded.hero-button}'
    padding: '0 20px 0 18px'
  button-primary-hover:
    backgroundColor: '{colors.signal-hover}'
    textColor: '{colors.ink-deep}'
    rounded: '{rounded.hero-button}'
    padding: '0 20px 0 18px'
  button-dark:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.acid-lime}'
    rounded: '{rounded.pill}'
    padding: '7px 15px 7px 8px'
  button-footer:
    backgroundColor: '{colors.signal-lime}'
    textColor: '{colors.ink-deep}'
    rounded: '0px'
    padding: '0 20px'
  input:
    backgroundColor: '{colors.white-paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.field}'
    padding: '0 16px'
  nav-item:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    padding: '0 13px'
  chip-active:
    backgroundColor: '{colors.signal-soft}'
    textColor: '{colors.signal-ink}'
    rounded: '{rounded.pill}'
    padding: '7px 12px'
  route-card-selected:
    backgroundColor: '{colors.card-paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.card}'
    padding: '18px'
  dossier-card:
    backgroundColor: '{colors.white-paper}'
    textColor: '{colors.ink}'
    rounded: '10px'
    padding: '12px'
---

# Design System: FairLend Root Landing Page

## Overview

**Creative North Star: "The Toronto Financing Field Guide"**

FairLend's canonical brand surface is the root landing page at `/`: a Toronto atlas crossed with a live underwriting and construction dossier. The supplied July 9, 2026 captures confirm the intended composition—engraved monochrome city and property imagery, pale paper fields, exacting rules, oversized editorial serif statements, dense practical sans-serif information, and electric lime tracing the path from intent to action. The result feels precise, established, warm, and locally fluent: a specialist who can read both the property and the capital equation.

The page is not one repeated template. It moves through distinct but related artifacts: a panoramic Toronto scene, a topographic route chooser, a split lending ledger, a sticky live-deal file, builder and leadership proof, a map-led FAQ, and a structured capital-desk footer. Paper continuity, monochrome illustration, lime signals, and typography make those worlds one identity. Motion behaves like competent progress through a file—revealing, tracing, funding, and advancing—never like ornamental spectacle.

This document is deliberately root-only. Its source of truth is `src/app/(frontend)/page.tsx`, the components imported by that file, the root `FrontendChrome`, global root footer, root-scoped CSS, and the supplied screenshots. It does not authorize styles from Payload admin, generic CMS blocks, demo routes, or non-root marketing pages.

**Key Characteristics:**

- Near-white paper canvas with black engraved imagery and fine technical rules.
- Cormorant Garamond for authority and narrative; Inter for clarity and action.
- Electric lime as route, state, proof, focus, and conversion signal.
- Toronto skyline, clouds, topography, parcels, buildings, and deal files as evidence—not decoration.
- Broad editorial compositions paired with dense, practical financial information.
- Controlled motion with explicit reduced-motion equivalents.

**The Root-Only Source Rule.** When another FairLend surface conflicts with `/`, the root landing page wins. Reuse these actual components and tokens; do not average the whole repository into a diluted hybrid.

## Colors

The palette is high-contrast paper and ink with a rare, unmistakable lime signal. Blueprint and forest appear only when the Build Model changes working context.

### Primary

- **FairLend Signal Lime** (`signal-lime`, `#96EC18`): primary application actions, active progress, proof marks, focus states, underlines, and section guidance.
- **Acid Lime** (`acid-lime`, `#8DFF00`): the sharper chrome and high-energy accent used in the fixed header and selected micro-states.
- **Route Lime** (`route-lime`, `#9CFF00`): route-selector selection, origin points, card borders, badges, step dots, and arrows.
- **Signal Hover** (`signal-hover`, `#A4FB20`): the actual hover state for the core hero and footer actions; it brightens rather than darkens.

### Secondary

- **Signal Soft** (`signal-soft`, `#E8FF9B`): icon orbs, active-chip fields, and low-emphasis selection surfaces.
- **Signal Ink** (`signal-ink`, `#203500`): readable dark green for text and icons sitting near lime. Never place white or pale gray text on lime.

### Tertiary

- **Builder Blueprint** (`builder-blueprint`, `#002949` sRGB approximation; canonical `oklch(0.275 0.074 247)`): a working-drawing state inside the Build Model only.
- **Builder Forest** (`builder-forest`, `#002416` sRGB approximation; canonical `oklch(0.228 0.055 166)`): a financing/build-support state inside the Build Model only.

### Neutral

- **Landing Paper** (`paper`, `#F8F7F5`): the continuous page canvas and hero field.
- **Chrome Surface** (`surface`, `#FBFAF8`): fixed navigation and elevated paper chrome.
- **Route Paper** (`route-paper`, `#F7F6F1`): topographic chooser and FAQ field.
- **Card Paper** (`card-paper`, `#FBFAF5`): route cards and quiet contained surfaces.
- **White Paper** (`white-paper`, `#FFFDF9`): inputs, dossier sheets, and the brightest internal page.
- **Ink** (`ink`, `#08090A`): default text, rules at opacity, and icon linework.
- **Deep Ink** (`ink-deep`, `#030405`): display typography and black action tiles.
- **Muted Ink** (`muted`, `#494944`): secondary body copy; still dark enough to remain legible on paper.
- **Soft Muted Ink** (`muted-soft`, `#6C6C64`): tertiary labels and placeholders where the source already uses it.
- **Paper Rule** (`rule`, `#DEDED8`): structural borders, dividers, and card outlines.

**The Lime Signal Rule.** Lime identifies action, route, active state, or verified proof. It never becomes paragraph text, a full generic section fill, or ambient decoration with no meaning.

**The Paper Continuity Rule.** Section changes come from material, imagery, density, and rail texture—not from unrelated background colors. The page must still read as one long physical document.

**The Blueprint Exception Rule.** Blueprint and forest are permitted only where the Build Model changes state. They must feel like working-document modes, never like generic blue fintech branding.

## Typography

**Display Font:** Cormorant Garamond (`var(--font-cormorant), Georgia, serif`)

**Body Font:** Inter (`var(--font-inter), Arial, sans-serif`)

**Technical Label Font:** Oxanium (`Oxanium, ui-monospace, monospace`)

**Technical Display Font:** League Gothic (`League Gothic, Impact, Arial Narrow, sans-serif`)

**Character:** Cormorant supplies established judgment and the visual confidence of a broadsheet or title page. Inter makes financial details, controls, and process language immediate. Oxanium and League Gothic appear inside builder/leadership instruments where the page deliberately becomes a site board or deal ledger; they are not alternate global brand fonts.

### Hierarchy

- **Hero Display** (`clamp(64px, 5.35vw, 82px)`, `600`, `0.98`, `-0.04em`): four stacked lines—Fast, Flexible, Fair, Financing for—with the lime underline reserved for “Fair.” Mobile settles at `58px`, then `51px` below `390px`.
- **Section Display** (`clamp(52px, 5vw, 72px)`, `600`, `0.89`): route decisions and major section propositions. Keep lines balanced and intentionally short.
- **Overview Display** (`clamp(58px, 5.28vw, 82px)`, `500`, `0.95–1.06`): the source uses exceptionally tight tracking in this one composition. Treat it as an existing art-directed exception, not a reusable default.
- **Card Title** (`27px`, `600`, `0.94`): compact serif titles within route cards; mobile may rise to `32px` when the card becomes horizontal.
- **Body** (`16px`, `500`, `1.45`): concise financial explanation with a practical maximum measure of `65–72ch`; denser cards use `13–15px` with proportionate line height.
- **Proof Stat** (`72px`, serif, `0.82`): isolated evidence only, paired with plain `18px` labels. Do not turn every section into a metric strip.
- **Label** (`10–12px`, `800`, `0.16–0.28em`, uppercase): route and file metadata. Use only where the interface is genuinely labeling a system, stage, or document.
- **Technical Display** (`League Gothic`, condensed, uppercase): builder consulting and leadership instrumentation only.
- **Handwritten Note** (`Architects Daughter`, blue): one hero annotation exception. Never spread handwriting into general headings or body copy.

**The Two-Register Rule.** Cormorant tells the story; Inter explains and operates it. Oxanium and League Gothic are compartmentalized technical voices, never general-purpose decoration.

**The Tight-but-Legible Rule.** New display work never tracks tighter than `-0.04em`. Existing tighter overview treatments are locked compositions, not precedents.

## Elevation

Depth comes from stacked paper, thin rules, restrained state shadows, and one functional translucent navigation layer. Most surfaces remain flat until hierarchy or interaction requires lift. The fixed header's blur is a deliberate readability treatment over moving page content; it is not permission for decorative glass cards elsewhere.

### Shadow Vocabulary

- **Landing Section** (`0 22px 58px rgb(8 9 10 / 7%)`): root-scoped proof and model panels.
- **Hero CTA** (`0 10px 24px rgb(118 205 0 / 12%)`): lime conversion action; hover rises to `0 14px 32px rgb(118 205 0 / 18%)`.
- **Header Shell** (`0 18px 54px rgb(17 18 18 / 7%)` plus a white inset highlight): the fixed navigation floating over the hero.
- **Route Card** (`0 18px 42px rgb(27 25 18 / 5%)`): almost-flat default paper.
- **Route Card Hover** (`0 24px 52px rgb(27 25 18 / 8%)`): paired with a restrained `-4px` lift when motion is allowed.
- **Selected Route** (`0 22px 48px rgb(138 255 0 / 14%), inset 0 0 0 1px rgb(156 255 0 / 24%)`): selection evidence, not general decoration.
- **Build Model Board** (`0 24px 80px var(--bm-shadow)`): one large physical dossier held above the page during sticky scroll.
- **Avatar** (`0 6px 14px rgb(0 0 0 / 8%)`): enough separation for overlapping grayscale portraits.
- **Footer Panel** (`0 28px 80px rgb(8 9 10 / 8%)` plus inset white highlight): terminal desk-like paper slab.

**The Layered Evidence Rule.** Borders describe paper edges; shadows describe a real layer or active state. A wide shadow on every bordered box destroys the document metaphor.

**The One Elevated State Rule.** Within a component group, only the active or sticky object earns the strongest shadow. Siblings remain quiet.

## Components

### Landing Rail and Material Frame

The page is organized as a maximum `1848px` three-column rail: textured gutters on both sides and a centered content field. Desktop gutters breathe from `72px` to `112px`; below `768px` the rail becomes a single full-width block. One-pixel separators and `8px` cross-dots mark section joins. `fabric-of-squares`, `grid-noise`, `inflicted`, `debut-light`, and `groovepaper` are low-opacity material changes, never foreground patterns.

### Navigation

The root uses the fixed `DirectionalHoverHeader`, not the generic CMS header. Its `62px` paper shell is `18px` rounded, inset from the viewport by `clamp(16px, 2.9vw, 32px)` vertically and the hero gutter horizontally. Desktop items are `44px` minimum pill targets. The black phone/action control uses acid-lime text and a lime phone disc. Menus support hover direction, keyboard focus, and a full mobile state; focus is a visible `2px` outline with `3px` offset.

### Buttons

- **Primary:** signal-lime, deep-ink text, `9px` hero radius, `55px` height, and a black `30px` arrow tile. It lifts `2px` on hover and brightens to Signal Hover.
- **Route Primary:** full-width, `44px` height, `8px` radius, `13px` semibold copy, lime fill, and black arrow box. Active state compresses to `0.985`.
- **Dark Expert Action:** black pill with acid-lime copy and a lime circular phone icon. It is compact, high-contrast proof of human access.
- **Footer Submit:** deliberately square (`0px` radius), `48px` high, lime fill. The hard edge belongs to the footer's capital-desk grid and must not replace rounded hero controls.
- **Focus:** black or lime `2–3px` ring with visible offset, chosen for contrast against the local paper.

### Inputs and Application Panel

Hero fields are bright paper with a `12px` radius, `1px` rule, `46–52px` height, `14–15px` text, and dark placeholders. Focus shifts the border to Signal Lime and adds `0 0 0 3px rgb(150 236 24 / 18%)`. The desktop application panel docks over the skyline; on smaller screens it enters the document flow without losing the three Build / Invest / Get a mortgage tabs or the visible first action.

### Chips and Labels

Build Model variables are compact uppercase Oxanium pills with a full `1px` outline and true pill radius. Active chips use a lime-tinted field and Signal Ink; inactive chips remain paper with muted text. Badges such as “Popular” are small rectangular flags (`5px` radius), not oversized pills.

### Cards and Containers

- **Route Card:** `18px` radius, `18px` inset, `520px` desktop minimum height, paper translucency, a single rule, and monochrome illustration. Each card contains an icon orb, serif title, direct description, benefits, image, four-stage track, and one CTA. Selection is redundant—lime border, badge, active dot, and primary CTA—but never changes the card's size.
- **Dossier Card:** `10px` radius, `12px` inset, precise rule, stacked/rotated paper sheets, serif file title, Oxanium metadata, and one evidence visualization. Only the active sheet becomes fully opaque and aligned.
- **Overview Finance Cell:** thin ruled rectangles with lime index and arrow, monochrome building/bridge engraving, uppercase sans title, and concise copy. They read as a ledger rather than a generic icon-card grid.
- **Audience Card:** restrained `1px` rule and small top accent; used only to contrast experienced and first-time builders.

### Landing Hero

The hero is the brand's first impression: a full-viewport near-white field with a black engraved Toronto waterfront and CN Tower, layered halftone clouds, a single dashed lime route, left-anchored four-line serif promise, evidence stats, financing-path deck, consultation and expert actions, application entry, and grayscale trust portraits. The skyline is evidence of local expertise, not a decorative wallpaper. The financing deck begins readable and settles into a stacked interactive file; reduced motion shows the final state without auto-rotation or blur.

### Route Selector

The route chooser sits on a quiet topographic field with one dashed black arc and lime origin. Four long cards present construction financing, private mortgage, investing, and partner paths. On desktop the cards form one comparative row; on mobile each card becomes a scannable block. Illustration stays monochrome and etching-like. The helper banner closes the choice architecture with a compass and one consultation action.

### Landing Overview

The overview pairs an oversized licensing/private-lending statement and annotated Toronto skyline with a ruled six-cell financing matrix. Lime behaves like highlighter, underline, index, and direction arrow. The composition is asymmetric, dense, and editorial without pretending to be a magazine: every flourish supports credibility, product range, or local fluency.

### Build Model

The Build Model is a sticky-scroll live-deal file, not a marketing card. A bordered board holds status, count, title, dossier sheets, variable chips, and a six-stage progress track while the narrative advances through Plan, Finance, Build Support, DrawFlow, Takeout, and Outcome. The default ivory state matches the page; blueprint, forest, and ink states mark real changes in working context. Theme transitions use `820ms cubic-bezier(0.22, 1, 0.36, 1)`; text swaps use a restrained `150ms` blur/translate. On mobile the board and narrative linearize without hiding the current state.

### Builder Consulting, Leadership, FAQ, and Footer

These later sections retain the same paper, ink, lime, rail, and imagery system while increasing technical density. Builder and leadership may use League Gothic and Oxanium because they behave like site signage and underwriting instrumentation. FAQ returns to route-paper and map logic, with a recalculated SVG path connecting accordion content. The footer resolves the page as a structured capital desk: squared grid cells, serif closing proposition, lime square submit action, regulatory disclosure, navigation columns, and controlled motion.

**The Motion Means Progress Rule.** Motion may reveal a route, move a boat in its sailing direction, advance a file, select a card, trace a line, or expose proof. It may not make the map, skyline, or financial process feel like a toy. Every transform-heavy behavior has a reduced-motion final state.

## Do's and Don'ts

### Do:

- **Do** treat `/` and its imported root components as the brand source of truth.
- **Do** preserve the sequence: header, hero, route selector, overview, Build Model, builder consulting, leadership, FAQ, and footer.
- **Do** use real Toronto skyline, topographic, parcel, construction, property, and deal-file imagery as primary brand material.
- **Do** keep monochrome engraving/halftone imagery dominant and reserve color for lime signals and controlled Build Model modes.
- **Do** pair Cormorant authority with Inter clarity; keep Oxanium and League Gothic inside technical sections.
- **Do** keep application entry visible, compact, labeled, and usable at every viewport.
- **Do** preserve semantic headings, keyboard focus, minimum `44px` touch targets where practical, WCAG AA contrast, and reduced-motion alternatives.
- **Do** use lime redundantly for meaningful selected states: color plus border, label, icon, or progress treatment.
- **Do** keep body copy dark on paper and cap long measures around `65–72ch`.
- **Do** adapt or reuse the actual root components before creating any new brand primitive.

### Don't:

- **Don't** use navy-and-gold bank cliches.
- **Don't** produce generic AI finance landing pages.
- **Don't** use decorative glassmorphism for its own sake; the fixed header is the sole functional translucent-chrome exception.
- **Don't** add city labels or pins that compete with the offer.
- **Don't** ship cramped hero type; new display tracking stops at `-0.04em`, and headings must be tested for overflow.
- **Don't** allow over-wrapped card labels; change the measure, scale, or responsive composition.
- **Don't** use motion that makes the map feel like a toy.
- **Don't** turn lime into paragraph text, a generic full-section background, or meaningless glow.
- **Don't** introduce generic fintech blue; blueprint and forest belong only to Build Model state changes.
- **Don't** replace the root's real raster/engraved assets with hand-drawn SVG doodles, generic line icons, or decorative CSS geometry.
- **Don't** repeat a tiny uppercase eyebrow above every heading. Labels must identify a real route, file, phase, or technical system.
- **Don't** build an endless identical card grid. Cards are reserved for genuine comparison, file, or evidence structures.
- **Don't** add gradient text, decorative side-stripe borders, diagonal stripe fills, or arbitrary `32px+` card radii.
