---
name: FairLend Core Landing Page
description: A brutalist Toronto lending dossier built from ink, textured paper, rotating field colors, and electric-lime signals.
colors:
  electric-lime: '#8DFF00'
  signal-lime: '#96EC18'
  lime-soft: '#E8FF9B'
  lime-ink: '#203500'
  blueprint-blue: '#002949'
  field-forest: '#002416'
  ink: '#08090A'
  deep-ink: '#030405'
  ivory: '#FBFAF7'
  paper: '#F8F7F5'
  white-paper: '#FFFDF9'
  muted-ink: '#494944'
  paper-rule: '#DEDED8'
typography:
  display:
    fontFamily: 'var(--font-cormorant), Georgia, serif'
    fontSize: 'clamp(3.25rem, 6vw, 6rem)'
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'var(--font-cormorant), Georgia, serif'
    fontSize: 'clamp(2.75rem, 5vw, 4.5rem)'
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: '-0.035em'
  title:
    fontFamily: 'var(--font-inter), Arial, sans-serif'
    fontSize: 'clamp(1.5rem, 2.2vw, 2.25rem)'
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: '-0.025em'
  body:
    fontFamily: 'var(--font-inter), Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: 'normal'
  label:
    fontFamily: 'var(--font-oxanium), ui-monospace, monospace'
    fontSize: '11px'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '0.14em'
  technical-display:
    fontFamily: 'League Gothic, Impact, Arial Narrow, sans-serif'
    fontSize: 'clamp(3.5rem, 8vw, 7.375rem)'
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: '-0.02em'
rounded:
  square: '0px'
  marker: '4px'
  control: '8px'
  field: '12px'
  shell: '18px'
  pill: '9999px'
spacing:
  touch-target: '44px'
  control-x: '18px'
  card-inset: 'clamp(18px, 2.25vw, 30px)'
  section-x: 'clamp(20px, 4vw, 56px)'
  section-y: 'clamp(54px, 8vw, 112px)'
  landing-gutter: 'clamp(72px, 5.9vw, 112px)'
  landing-frame-max: '1848px'
components:
  button-primary:
    backgroundColor: '{colors.electric-lime}'
    textColor: '{colors.deep-ink}'
    rounded: '{rounded.control}'
    padding: '0 20px'
    height: '48px'
  button-dark:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.electric-lime}'
    rounded: '{rounded.control}'
    padding: '0 20px'
    height: '48px'
  callout-lime:
    backgroundColor: '{colors.electric-lime}'
    textColor: '{colors.deep-ink}'
    rounded: '{rounded.square}'
    padding: '18px 20px'
  deal-file-card:
    backgroundColor: '{colors.white-paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.square}'
    padding: '{spacing.card-inset}'
  field-board-forest:
    backgroundColor: '{colors.field-forest}'
    textColor: '{colors.ivory}'
    rounded: '{rounded.square}'
    padding: '{spacing.card-inset}'
  input:
    backgroundColor: '{colors.white-paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '48px'
---

<!-- markdownlint-disable MD013 MD025 MD036 -->

# Design System: FairLend Core Landing Page

## Overview

**Creative North Star: "The Live Lending Dossier"**

The core landing page is a tactile Toronto financing file enlarged to architectural scale. It combines editorial, stippled, half tone ink drawing, severe black rules, practical underwriting language, and electric-lime intervention. The supplied Supacode references define the target: ivory paper spreads, full-bleed blueprint and forest fields, dense but legible deal files, square callout slips, dashed route arrows, and visible offset layers. The page should feel printed, marked up, and actively worked on—not polished into generic fintech glass.

The composition alternates between two modes. **Paper mode** uses ivory or white stock, black ink, grayscale engraving, and lime marks. **Field mode** rotates through blueprint blue, electric green, dark forest, and ivory as the visitor advances through the Build Model. These are not independent themes; they are pages in one dossier. Cult UI `BackgroundImageTexture` materials—especially `fabric-of-squares` and `groovepaper`—make every field feel physical while preserving text contrast.

In addition to paper like textures we use topographical map backgrounds with low opacity with greater opacity near the corners and edges of the page.

Brutalism is structural rather than careless. Borders are explicit, corners are predominantly square, shadows are hard offsets, labels read like file metadata, and callouts overlap the layout as attached evidence. Refinement comes from disciplined type, exact alignment, meaningful imagery, and controlled density. The visual tension is intentional: Cormorant authority against Inter directness, paper softness against hard frames, monochrome Toronto engraving against saturated lime.

The landing page (/) is the source of truth for the design language. 

**Key Characteristics:**

- Ink-and-paper base with real halftone, stipple, engraving, and screened Toronto imagery.
- Electric lime as highlight, action, verification, route, and hard offset—not ambient decoration.
- Blueprint blue, electric green, dark forest, ink, and ivory fields that rotate with the Build Model narrative.
- Cult UI paper textures integrated into section and board surfaces with theme-aware blend modes.
- Brutalist deal-file cards, square callout slips, black rules, and visible offset layers.
- Dashed arrows and plotted routes that explain direction, sequence, and progress.
- Editorial serif propositions paired with dense, candid sans-serif underwriting information.
- Responsive re-composition that retains one dominant idea and one visible action per viewport.

**The Root-Only Source Rule.** When another FairLend surface conflicts with the core landing page, the root implementation and supplied reference images win.

**The Worked-Paper Rule.** Texture must make a surface feel printed or handled. It must never reduce readability or become decorative noise floating above controls and body copy.

**The Evidence-First Rule.** Every visual flourish must communicate place, financing structure, progress, proof, or action. If it communicates none of those, remove it.

## Colors

The palette is a controlled full-palette system: paper and ink establish continuity; electric lime marks intervention; blueprint and forest establish distinct working states.

### Primary

- **Electric Lime** (`electric-lime`): the highest-energy field and the canonical brutalist callout fill. Use for Build Model state changes, hard offsets, large evidence slips, and high-priority actions.
- **Signal Lime** (`signal-lime`): the slightly quieter operational signal used for highlights, underlines, route nodes, focus, verified marks, and repeated interaction states.
- **Lime Ink** (`lime-ink`): dark green text and icon color on lime surfaces. Pale text is forbidden on lime.

### Secondary

- **Blueprint Blue** (`blueprint-blue`): the permit, recovery, drawing, and technical-planning field. Pair with ivory type, pale rules, and sparse lime signals.
- **Field Forest** (`field-forest`): the construction-finance and capital-control field. Pair with ivory type and lime verification.
- **Lime Soft** (`lime-soft`): a low-emphasis highlight wash for selected chips, marker halos, and inline annotations.

### Tertiary

- **Ink** (`ink`) and **Deep Ink** (`deep-ink`): default type, borders, dark panels, diagram lines, and reversed field states. Deep Ink is for the hardest contrast and attached black evidence cards.

### Neutral

- **Ivory** (`ivory`): the Build Model's light working field and preferred background for large paper-mode sections.
- **Paper** (`paper`): the continuous landing canvas and rail center.
- **White Paper** (`white-paper`): deal-file sheets, fields, and the brightest reading surfaces.
- **Muted Ink** (`muted-ink`): secondary copy and metadata that must still meet WCAG AA.
- **Paper Rule** (`paper-rule`): quiet dividers inside light paper surfaces. Exterior card borders remain Ink.

**The Rotating Field Rule.** Build Model chapters may rotate only among Ivory, Blueprint Blue, Electric Lime, Field Forest, and Ink. Each transition must correspond to a real narrative state; never cycle color as decoration.

**The Lime Has a Job Rule.** Lime must indicate action, active state, progress, verification, highlighted evidence, or a physical offset layer. A meaningless lime shape is off-brand.

**The Contrast Inversion Rule.** Light fields use Ink; blueprint, forest, and ink fields use Ivory; lime fields use Deep Ink. Never solve contrast by dropping body copy to washed-out gray.

## Typography

**Display Font:** Cormorant Garamond (`var(--font-cormorant), Georgia, serif`)

**Body Font:** Inter (`var(--font-inter), Arial, sans-serif`)

**Technical Label Font:** Oxanium (`var(--font-oxanium), ui-monospace, monospace`)

**Technical Display Font:** League Gothic (`League Gothic, Impact, Arial Narrow, sans-serif`)

**Character:** Cormorant gives the dossier public authority and the scale of a printed title page. Inter delivers blunt, contemporary clarity for financing products, callouts, and actions. Oxanium and League Gothic are restricted to file metadata, site-board instrumentation, and condensed technical emphasis.

### Hierarchy

- **Display** (`clamp(3.25rem, 6vw, 6rem)`, `600`, `0.94`, `-0.04em`): one dominant proposition per composition. Balance the lines and test every long word for overflow.
- **Headline** (`clamp(2.75rem, 5vw, 4.5rem)`, `600`, `0.95`, `-0.035em`): section propositions and major state narratives.
- **Brutalist Title** (`clamp(1.5rem, 2.2vw, 2.25rem)`, `800`, `0.95`, uppercase when short): deal-file names, callout claims, and high-contrast card headings.
- **Body** (`16px`, `500`, `1.45`): candid financial explanation. Cap long prose around `65–72ch`; card copy may compress to `14–15px` without becoming gray or faint.
- **Label** (`11px`, `800`, `0.14em`, uppercase): file numbers, board states, process stages, and genuine system metadata. It is not a decorative eyebrow for every section.
- **Technical Display** (`League Gothic`, condensed, uppercase): only builder consulting, Build Model instrumentation, and oversized numeric or status language.

Inline emphasis may use a lime marker wash, lime underline, or heavier weight. The mark should look applied to the page, slightly irregular in width, while the glyphs remain crisp and readable.

**The Two-Register Rule.** Cormorant proposes; Inter explains and acts. Oxanium and League Gothic label the machine. Never let all four compete in one small component.

**The Tight-but-Legible Rule.** Display tracking never goes tighter than `-0.04em`. Headings must use balanced wrapping and remain inside their container at every breakpoint.

## Elevation

Elevation is printmaking, not atmosphere. Paper sheets separate through one-pixel Ink borders, small hard-offset shadows, overlapping slips, and occasional stacked-sheet edges. Soft ambient shadows are reserved for floating navigation and interaction feedback; they do not define the core brutalist card language.

### Shadow Vocabulary

- **File Offset** (`4px 4px 0 rgb(8 9 10 / 22%)`): default deal-file sheet resting above another sheet.
- **Lime Offset** (`6px 6px 0 #8DFF00`): selected dark cards, authority files, and high-value evidence panels.
- **Board Offset** (`9px 9px 0 var(--bm-board-offset)`): the sticky Build Model board; its offset changes with the active field.
- **Pressed Offset** (`2px 2px 0 currentColor`): active state for small brutalist controls where the element visibly compresses.
- **Navigation Lift** (`0 18px 54px rgb(17 18 18 / 7%)`): the one soft shell floating over moving page content.

**The Hard-Edge Rule.** Deal files and callouts use a border or a hard offset. Never pair a one-pixel border with a decorative soft shadow wider than `8px` blur.

**The Attached Evidence Rule.** Overlapping callouts must appear physically attached to the composition through alignment, offset, or a connecting rule. They may not float randomly in unused space.

## Components

### Landing Rail and Textured Fields

The desktop page sits in a maximum `1848px` rail with textured gutters and a centered content field. Gutters use low-opacity Cult UI textures such as `fabric-of-squares`, `grid-noise`, and `inflicted`; Build Model boards and comparison sheets use `fabric-of-squares` and `groovepaper`. Light themes blend texture with `multiply`; dark blueprint, forest, and ink themes invert it and blend with `screen`. Texture remains below content, never above interactive elements. Below `768px`, the rail becomes a full-width single column and section padding replaces the gutters.

### Navigation

The fixed root header remains the only softly elevated shell. It uses paper, Ink, and lime action contrast while the page beneath rotates fields. Desktop targets are at least `44px`; mobile navigation becomes a deliberate full state rather than squeezing the desktop row. Focus is always visible with a high-contrast `2px` outline and offset.

### Buttons and Inputs

- **Primary Action:** Electric Lime or Signal Lime with Deep Ink, a compact `8px` radius, minimum `44px` height, and a black arrow tile or explicit direction glyph.
- **Dark Action:** Ink with Electric Lime, used on light paper and lime fields.
- **Brutalist Action:** square or `4px` corners, full Ink border, hard offset, and a `1–2px` press on active.
- **Input:** White Paper, Ink border, `8–12px` corners, dark placeholder, and a three-part focus treatment: lime border, visible ring, and preserved label.

### Deal-File Cards

Deal-file cards are the canonical repeated container. They use square corners, a full Ink outline, White Paper fill, sparse internal rules, a file number, condensed uppercase title, one engraved subject, one highlighted phrase, and an “Open deal file” action anchored to the bottom. Repetition is permitted because each card is an actual catalogued financing file; vary internal evidence and image placement rather than turning the page into generic icon cards.

### Brutalist Callout Cards

Callouts are attached slips for consequential facts: savings, rental income, qualification criteria, verified status, or “with FairLend / without FairLend” comparisons. Use Electric Lime or Ink, a `1–2px` border, square corners, hard offset, blunt Inter type, and compact hierarchy. They may overlap a card edge or bridge a grid seam when the relationship is clear. One callout should dominate; do not scatter badges everywhere.

### Dashed Route Arrows

Dashed arrows are a signature navigation primitive. They connect source to destination across hero, route selector, and process sections; their curve must clear copy and card faces. Use a black dashed line on ivory and lime on dark fields, with a visible origin node and decisive arrowhead. Animation draws from origin to destination once, then rests. Under reduced motion, render the final complete route immediately.

### Monochromatic Halftone Ink Imagery

Toronto skylines, buildings, construction sites, property types, maps, and portraits use halftone, stipple, crosshatch, engraving, or screened grayscale. Art must retain a recognizable subject at mobile sizes. Lime overlays may underline, route, verify, or mark a node but must not recolor the full illustration. Texture belongs inside the image or its intentional paper field; never apply a global grain layer over text and controls.

### Build Model Board

The Build Model is the strongest expression of the system: a sticky brutalist authority file with a full border, `9px` hard offset, layered dossier tabs, variable chips, a progress rail, and one high-priority CTA. Narrative progression rotates the entire field among Ivory, Electric Lime, Field Forest, Ink, and Blueprint Blue. Background color and text change together over `820ms cubic-bezier(0.22, 1, 0.36, 1)`; content swaps use brief blur and translation without ever hiding the default render. On mobile, sticky choreography linearizes while preserving the current state, texture, and CTA.

### Motion and Responsiveness

Motion must reveal a route, advance a file, verify a state, or physically compress a control. Use exponential ease-out curves; no bounce or elastic motion. Every animation has a `prefers-reduced-motion` final state. On narrow screens, overlap becomes stack, wide deal-file grids become one readable column, and dashed routes shorten or recompose rather than shrinking into clutter.

**The Motion Means Progress Rule.** If motion cannot be described with a financing verb—trace, open, compare, verify, advance, fund, or complete—it does not belong.

## Do's and Don'ts

### Do

- **Do** treat the supplied Supacode screenshots and the `/` implementation as the visual source of truth.
- **Do** rotate Blueprint Blue, Electric Lime, Field Forest, Ink, and Ivory only when the Build Model's narrative state changes.
- **Do** use Cult UI `BackgroundImageTexture` variants as real paper material with theme-aware opacity, inversion, and blend mode.
- **Do** retain black rules, square corners, hard offsets, overlapping evidence slips, and blunt callout typography.
- **Do** use dashed arrows to communicate a real route, handoff, or sequence; give every path an origin and destination.
- **Do** keep monochromatic Toronto and property imagery visibly engraved, stippled, screened, or halftoned.
- **Do** reserve lime for action, highlight, verification, progress, and physical offset.
- **Do** maintain WCAG AA contrast, semantic headings, visible focus, `44px` touch targets where practical, and reduced-motion equivalents.
- **Do** keep one dominant proposition and one obvious next action per viewport.
- **Do** recompose dense desktop cards for mobile instead of scaling the entire composition down.

### Don't

- **Don't** use navy-and-gold bank cliches or generic AI finance landing-page grammar.
- **Don't** soften the brutalist file system into glass cards, pill-heavy SaaS UI, or border-plus-wide-shadow ghost cards.
- **Don't** use the blue, lime, forest, ink, and ivory fields as an automatic carousel or decorative color cycle.
- **Don't** put texture above body copy, form controls, or focus indicators; worked paper must remain readable.
- **Don't** scatter tiny uppercase eyebrows above every heading. File labels must identify a real route, stage, artifact, or status.
- **Don't** turn every fact into a callout. One attached evidence slip is stronger than a field of badges.
- **Don't** use dashed arrows as filler, route them through text, or animate them endlessly.
- **Don't** recolor an entire skyline, portrait, or building lime; lime annotates monochrome ink.
- **Don't** replace real imagery with hand-drawn SVG doodles, generic flat vectors, pastel 3D renders, or decorative CSS geometry.
- **Don't** add gradient text, decorative side stripes, repeating diagonal stripes, decorative grid overlays, or arbitrary `32px+` card radii.
- **Don't** ship cramped display type, over-wrapped card labels, horizontal scrolling, or motion that makes the map and financing process feel like a toy.
