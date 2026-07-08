# SECTION-DESIGN.md

**Section:** Our Build Model (`fairlend-build-model`)
**Source concept:** `checkpoint-04-section-visual-concepts-v2.html` → Concept B — Elevated Bridge (selected, with refinements)
**Parent page:** FairLend root landing (`src/app/(frontend)/page.tsx`)
**Status:** Production-ready spec. Phase 6 builds from this file alone.

---

## 1. Section Objective

Make one strategic move: after visitors see *what FairLend finances* (Overview's product menu), show them that a build with FairLend comes with the **planning intelligence, project management, milestone draw system, and end-to-end build support** needed to make the project equation work — for experienced builders *and* complete novices.

The section is a **catch-all for the broad audience** (builders, small developers, property owners, and first-time garden-suite/laneway/multiplex aspirants). The next section (Builder Consulting) is targeted at experienced builders and frames FairLend's build-profitability thesis.

This section positions FairLend as the partner that *constructs the equation* — land, scope, capital, draws, policy, incentives, and takeout — so the visitor trusts FairLend to model their project before the next section's 2019/2023/2026 math lands.

## 2. Existing Page Context

| Field | Value |
|---|---|
| Page | FairLend root landing (`/`) |
| Page type | Brand + lead-gen marketing page (single scroll) |
| Primary audience | GTA builders, small developers, property owners, and first-time build aspirants (Brief segments 9.2 & 9.3) |
| Primary conversion | Single lime CTA → `/intake?intent=consultation&source=build-model-consultation` |
| Existing section order | Hero → Route Selector (`#services`) → Overview → **[NEW: Our Build Model]** → Builder Consulting → Leadership → FAQ |

## 3. Insertion Point

Between `FairlendLandingOverviewSection` (rail texture `inflicted`) and `FairlendBuilderConsultingSection` (rail texture `debut-light`).

The new section wraps in a `FairlendLandingRail` band with **`gutterTexture="fabric-of-squares"`** — bookending the hero and reading as a brand-level model statement, distinct from both adjacent bands.

## 4. Section Role

- **Primary:** Offer Explainer
- **Secondary:** Bridge Section, Mechanism Section (DrawFlow), Objection Handler, CTA Preparation

**Target belief:** "I can come to FairLend with a property, a plan, or early intent — or just a property and a down payment — and they'll help shape financing, design/specs, project management, draw logic, permit/MLI readiness, and takeout in one place."

**Primary objection addressed:** "I'd have to stitch together a broker, planner, contractor network, permit strategist, and takeout lender myself" — and, for novices, "I don't have build experience."

## 5. Locked Copy

All copy below is final. Phase 6 implements verbatim.

### Hero
- **Kicker:** `03 / Our Build Model`
- **Headline:** `Bring us the property. We'll help build the equation.`
- **Lead line (serif italic, centered):** `From early intent to construction financing and takeout strategy, we shape one financeable project — end to end.`
- **Variable ribbon (chips, in order):** `Land` · `Scope` · `Capital` · `Draw plan` · `Professional path` · `Permit & MLI readiness` · `Exit`
- **Shared lead (one line):** `You don't need the whole team, a perfect plan, or prior build experience before you talk to us.`

### Audience cards (two, parallel)
- **Card A — tag `If you already build` (blueprint-blue rule):**
  - `Keep your focus on the site. We help carry the financing and business equation around it.`
- **Card B — tag `First-time builder` (coral rule):**
  - `Bring a property and a down payment. We craft the design and specs with you, assign an experienced builder or project manager, and handle the rest — permits, draws, takeout, everything.`

### CTA
- **Label:** `Book a free consultation`
- **Target:** `buildFairlendIntakeHref({ intent: 'consultation', source: 'build-model-consultation' })`
- **Microcopy:** `Bring a property, plan, or early idea — your first conversation is on us.`

### Station track (four pillars, expandable)
| # | Station | Sub-services (revealed on expand) |
|---|---|---|
| 01 | **Plan** | Site search & feasibility review · Land basis & acquisition price the project can support · Zoning path, housing form, unit mix, buildable area · Construction budget pressure-testing |
| 02 | **Finance** | Construction budget & borrower capital position · Private financing & capital structure · Draw schedule (milestone-based, DrawFlow) · Working-capital planning |
| 03 | **Build support** | Contractor, consultant & professional network — introductions where appropriate · Permit strategy & documentation gap analysis · CMHC MLI Select readiness support (where applicable) · Milestone/draw administration & site monitoring |
| 04 | **Takeout** | Sale, refinance, or rental stabilization · Insured (MLI Select) takeout preparation · Long-term financing direction |

### DrawFlow signature block
- **Label:** `Powered by DrawFlow`
- **Headline:** `A milestone line of credit for your build.`
- **Sub:** `More draws. Less interest. Fund the work, not the wait.`
- **Milestone track nodes (in order):** Foundation · Framing · Roof · Windows · Mechanical · **Plumbing** (active) · Electrical · Drywall · Flooring
- **Comparison:** Traditional `3 draws` vs FairLend `up to 15 draws`
- **Interest-saved callout:** `≈ $12,000 — Illustrative interest saved over a typical build.` + caveat `*Illustrative only. Every project differs.`
- **Flexibility tiles (two):**
  - *Tile 1 — `Your schedule, not ours`:* `Build your own draw schedule. Tie releases to the milestones that match how your project actually goes up.`
  - *Tile 2 — `Modify it mid-build`:* `Builds don't always go as planned. Adjust the draw plan as the work shifts so capital is there when you need it, and not costing interest when you don't.`
- **More-than-capital closer:** `More than capital. Complimentary access to our GTA build specialists and a deep supplier & trade network — your project manager comes with the financing.`

### Thesis strip (handoff into Builder Consulting)
- **Label:** `Builder Consulting`
- **Headline:** `FairLend's thesis: profit lives in the variables.`
- **Body:** `A profitable build is not only a construction problem. It is a business equation that changes with land, cost, capital, draws, policy, incentives, and takeout.`
- **Equation row:** `Land + Cost + Capital + Draws + Policy + Incentives + Takeout → Outcome`

## 6. Transition Requirements

**Transition in (from Overview):** Overview lists what we finance. Our Build Model narrows the frame — for build projects, financing is one variable in a larger equation. The Overview's "Disciplined capital. Local insight. Aligned outcomes." line hands off naturally.

**Transition out (to Builder Consulting):** The forest-green thesis strip bleeds full-width to meet the Builder Consulting band flush. The equation row (`Land + Cost + Capital + Draws + Policy + Incentives + Takeout → Outcome`) rhymes with Builder Consulting's `LAND + BUILD COST + HOME = SALE → PROFIT` visual grammar, so the visitor's eye is pre-trained for the profit math that follows.

## 7. Visual Direction

**Concept B — Elevated Bridge.** A centered, full-width band that signals "we're shifting gears into build territory." The horizontal build-station track turns the four pillars into a process you read left-to-right, foreshadowing Builder Consulting's feasibility-board register without adopting its League Gothic.

**Signature elements:**
1. Scannable hero — italic lead line → coral variable ribbon → shared lead → two audience cards.
2. Build-station track — four tappable stations with bespoke single-stroke blueprint line icons, connected by a dashed coral route.
3. DrawFlow block — milestone node-track + 3-vs-15-draws comparison + illustrative interest-saved + more-than-capital closer.
4. Forest-green thesis strip — dark manifesto handoff with the build equation row.

## 8. Existing Design System to Preserve

Sourced from `DESIGN.md`. The new section is a **design delta**, not a new system.

| System | Token |
|---|---|
| Landing paper | `#F8F7F5` |
| Overview/section paper | `#fbfaf7` → `#FBFAF7` |
| Builder cream | `rgb(255 253 247)` |
| Builder warm paper | `rgb(255 250 241)` |
| Ink (forest) | `oklch(0.235 0.026 164)` |
| Ink-deep | `#050506` |
| Coral | `oklch(0.588 0.151 42.5)` |
| Coral-deep | `oklch(0.48 0.14 41)` |
| Blueprint blue | `oklch(0.464 0.091 243.7)` (technical-accent only) |
| Lime (action) | `#9DFF00` |
| Lime-ink | `#203500` |
| Serif display | `var(--font-cormorant), Georgia, serif` |
| Body / UI | `var(--font-inter), Arial, sans-serif` |
| Mono technical labels | `"Oxanium", ui-monospace, monospace` |
| Rail frame | `FairlendLandingRail`, gutter `fabric-of-squares`, cross-dots from 768px |

**Non-negotiable rules (from DESIGN.md):**
- **Lime Rarity Rule** — one dominant lime action (the CTA). Supporting lime marks (the 15-draw dots) are orienting, not decision actions.
- **Paper Continuity Rule** — the page reads as one continuous paper system.
- **Blueprint Exception Rule** — blue is a technical/drawing accent only, never a generic trust color.
- **Label Budget Rule** — do not add decorative eyebrows; the kicker is the only label.
- **League Gothic is excluded** from this section (reserved for Builder Consulting + Leadership).

## 9. Section Grid

Centered, max-width content column within the rail content area.

- **Hero:** centered single column, `max-width` ~`640px` for text blocks; variable ribbon wraps at `max-width: 640px`; audience cards grid `1fr 1fr` at `max-width: 760px`.
- **Station track:** `grid-template-columns: repeat(4, 1fr)` desktop; collapses to vertical stack at ≤`900px` with the route-line bending 90° down the left edge.
- **DrawFlow block:** `max-width: 920px`, centered; internal comparison is `1fr 1fr` collapsing to single column at ≤`640px`.
- **Thesis strip:** full-bleed within the rail content (negative margins to meet the rail edges), centered text column `max-width: 54ch`.

## 10. Typography Treatment

| Role | Face | Size | Weight | Notes |
|---|---|---|---|---|
| Kicker | Oxanium | 12px | 900 | `03 / Our Build Model`; "03" and "/" in coral |
| Headline | Cormorant Garamond | `clamp(30px, 4vw, 46px)` | 500 | `-0.03em` tracking; centered |
| Lead line | Cormorant Garamond italic | `clamp(17px, 1.8vw, 21px)` | 500 | "early intent" in coral non-italic |
| Variable chip | Oxanium | 11px | 800 | uppercase, `0.05em` tracking, coral-deep |
| Shared lead | Inter | 14.5px | 400 | centered, ink-soft |
| Audience tag | Oxanium | 10px | 900 | uppercase, `0.12em` tracking; builders=blueprint, novice=coral |
| Audience body | Inter | 14px | 400 | ink-deep for `<strong>` |
| CTA label | Inter | 15px | 800 | lime-ink on lime |
| Station number | Oxanium | 10px | 900 | coral |
| Station name | Inter | 14px | 800 | ink-deep; coral-deep when active |
| DrawFlow label | Oxanium | 11px | 900 | blueprint-blue, pip dot |
| DrawFlow headline | Cormorant Garamond | `clamp(22px, 2.8vw, 30px)` | 500 | "line of credit" italic blueprint-blue |
| DrawFlow sub | Inter | 14px | 400 | "Fund the work, not the wait." in coral bold |
| DrawFlow node label | Oxanium | 9.5px | 800 | uppercase, `0.05em`; future nodes muted |
| Comparison number | Cormorant Garamond | 30px | 500 | — |
| Interest-saved amount | Cormorant Garamond | 26px | 500 | — |
| Thesis label | Oxanium | 11px | 900 | coral, flanked by hairlines |
| Thesis headline | Cormorant Garamond | `clamp(26px, 3.6vw, 40px)` | 500 | "variables" italic coral with subtle highlight |
| Thesis equation vars | Oxanium | `clamp(13px, 1.5vw, 17px)` | 800 | uppercase, `0.1em` tracking |
| Thesis OUTCOME | Oxanium | `clamp(15px, 1.8vw, 20px)` | 900 | coral, `text-shadow` glow |

## 11. Color Treatment

- **Paper base:** `#fbfaf7` (warm paper, matches Overview).
- **Forest ink** as the primary text color.
- **Coral** escalates from pure accent (hero chips) → connector + active station → DrawFlow active node → thesis OUTCOME glow. This controlled escalation prepares the eye for Builder Consulting's coral-heavy risk marks.
- **Blueprint blue** appears only as: audience-card A rule, DrawFlow label, DrawFlow completed nodes/lines, DrawFlow headline italic. Never a trust panel or CTA.
- **Lime** is single-use on the CTA, plus the 15-draw comparison dots (orienting, not an action).
- **Thesis strip** inverts to forest-green (`oklch(0.26 0.05 166)` top-lit radial → `oklch(0.155 0.04 166)`), cream text, coral accents. **No grid/repeating fill** — only a top-lit radial gradient + a single horizontal hairline glow near the base.

## 12. Spacing and Rhythm

- Section vertical padding: `clamp(44px, 6vw, 64px)` top/bottom; the thesis strip bleeds below the bottom padding via negative margins.
- Hero blocks: lead line → 16px → variable ribbon → 28px → shared lead → 16px → audience cards → 8px → CTA row.
- Station track: 30px margin-top; DrawFlow block: 36px margin-top; thesis strip: 28px margin-top (then bleeds).
- Maintain Overview's generous vertical rhythm; the section is **permitted to exceed a single viewport** to keep density comfortable.

## 13. Components

| Component | Implementation |
|---|---|
| Rail wrapper | `FairlendLandingRail gutterTexture="fabric-of-squares"` |
| Kicker | `FairlendSectionKicker` with `number="03"` and label "Our Build Model" |
| Variable chips | Flex-wrap row; pill shape; coral border on `rgba(232 91 47 / 0.05)` fill |
| Audience card | Bordered card with a 3px left rule (blueprint for builders, coral for novice); Oxanium tag + Inter body |
| CTA | Lime button, ink-deep border, arrow circle; `box-shadow: 0 10px 24px rgba(157 255 0 / 22%)` |
| Station track | 4-col grid; each station is a `<details>` whose `<summary>` carries the icon + number + name; dashed coral SVG route across tops |
| Station icon | Bespoke single-stroke blueprint line SVG (site plan / loan stack / build form / takeout arrow). **Not icon-pack glyphs.** |
| DrawFlow milestone track | Inline SVG: done nodes filled blueprint, active node coral with ring, future nodes outlined; labels in Oxanium |
| DrawFlow comparison | Two-column card; dots row (hollow vs filled lime) |
| DrawFlow interest-saved | Lime-rule callout; amount in Cormorant; caveat in Oxanium mono |
| DrawFlow flexibility tiles | Two-tile grid; coral-soft icon chip (sliders / refresh) + Oxanium title + Inter body; collapses to single column at ≤640px |
| DrawFlow more-than-capital | Dashed-border card with lime check circle |
| Thesis strip | Full-bleed forest-green band; Oxanium label + Cormorant headline + Inter body + Oxanium equation row |

## 14. Motion and Scroll Choreography

Registered through `FairlendScrollChoreography` (GSAP ScrollTrigger). All motion flattens under `prefers-reduced-motion: reduce`.

- **Hero:** kicker, headline, lead line reveal on enter.
- **Variable chips:** stagger in left-to-right.
- **Audience cards:** reveal together after the shared lead.
- **Station track:** stations cascade in left-to-right; dashed coral route-line draws across the tops; expanding a station slides its detail drawer down.
- **DrawFlow milestone track:** node-track strokes draw left-to-right (dashoffset) on enter; active node pulses once.
- **DrawFlow comparison:** 3-dots fade in, then 15-dots cascade.
- **Thesis strip:** headline reveal; equation-row operators (`+`, `→`) and variables stagger; OUTCOME glows in last.

Reduced-motion: all reveals become instant; the active-node pulse and OUTCOME glow are static.

## 15. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Desktop (>1024px) | Centered hero; 4-col station track; DrawFlow comparison side-by-side; thesis strip full-bleed |
| Tablet (641–1024px) | Hero stays centered; station track collapses to 2×2 or vertical stack; DrawFlow block stays single-pane, comparison side-by-side |
| Mobile (≤640px) | Single column throughout; station track stacks vertically with route-line bending 90° down the left edge; audience cards stack; DrawFlow comparison stacks; thesis strip bleeds to viewport edges with `padding-inline: 18px` |
| ≤560px | Thesis equation row wraps with smaller gaps; milestone labels shrink to 8.5px |

## 16. Accessibility Requirements

- Section: `<section aria-labelledby="fairlend-build-model-title">` tied to the headline.
- Station track & DrawFlow: use native `<details>`/`<summary>`; active state conveyed by color + ring + `aria-expanded` (redundant, not color-alone).
- CTA: real `<a>` with accessible name "Book a free consultation"; visible focus ring.
- Station icons, route-lines, milestone-track SVG, thesis-strip hairline: `aria-hidden="true"` (decorative).
- DrawFlow milestone track: `role="img"` with descriptive `aria-label` (it conveys a sequence).
- Color contrast: lime is background/accent only, never small body text on paper. Coral labels pass contrast at the locked sizes.
- `prefers-reduced-motion`: all transform/scrub motion flattens (instant reveals, no draw-on, no pulse).

## 17. Asset Strategy

- **No new raster images required.** All signature visuals are inline SVG (blueprint line motifs, milestone track, equation row).
- **No grid-pattern or repeating-background fills** anywhere (explicit anti-AI-slop rule).
- **No League Gothic** in this section.
- Reuse the paper texture already loaded by the rail (`fabric-of-squares`).
- Station icons are bespoke single-stroke SVGs authored in-component; do not substitute icon-pack glyphs.

## 18. Claims Ledger

| Claim | Status | Allowed usage |
|---|---|---|
| FairLend helps shape land, scope, capital, draw plan, professional path, permit/MLI readiness, and exit | supported (Brief §4.3) | help/structure language |
| FairLend can connect builders with contractors, consultants, professionals, suppliers | supported · hedged (§4.3, §7.5) | "introductions where appropriate" / "can connect"; never "we deliver contractors" |
| FairLend supports permit strategy, CMHC MLI Select readiness, takeout preparation | supported · hedged (§4.3, §7.3) | readiness/support/preparation only; never guaranteed approval |
| Build planning layer is complimentary when you finance with FairLend | user-provided (Brief §4.3) | payoff framing; not unlimited free professional services |
| DrawFlow milestone-based draw administration | supported (§7.4, §8.7) | operating model, not a delay guarantee |
| We assign an experienced builder or project manager | user-provided (this session) | present as part of the novice turnkey path; avoid implying we are the GC of record |
| ≈ $12,000 illustrative interest saved | user-provided (doorhanger) | **must carry** `*Illustrative only. Every project differs.` caveat |
| Up to 15 draws vs traditional 3 | user-provided (doorhanger) | "up to"; not a guarantee of 15 on every file |
| Guaranteed approval/MLI Select/timeline/profit/completion | **prohibited** (§5.6, §10) | never |

## 19. Framework Application Ledger

| Framework | Decision influenced |
|---|---|
| Grid Systems | Centered hero column + 4-col station track + full-bleed thesis strip; collapses cleanly to mobile |
| White Space | Section permitted to exceed one viewport to keep density comfortable; rhythm inherited from Overview |
| Nielsen Heuristics | Native `<details>` for disclosure (familiar, keyboard-native); redundant active-state signaling |
| Brand Equity | Reused warm paper + Cormorant + Oxanium + lime-one-action; blueprint line motifs as the distinctive visual asset |
| Messaging Architecture | Hero → mechanism (DrawFlow) → thesis (handoff) belief sequence |
| Choice Architecture | Single CTA; pillars are disclosure not competing actions |
| Fitts's Law | Full-width station/pillar rows + oversized CTA on mobile |
| Cialdini (Authority) | DrawFlow milestone system + "more than capital" network = proof of mechanism, not invented outcomes |

## 20. Do / Don't Rules

**Do:**
- Wrap in `FairlendLandingRail gutterTexture="fabric-of-squares"`.
- Use Cormorant for the headline, lead line, DrawFlow headline, and thesis headline.
- Keep lime single-use (CTA) plus orienting dots in the comparison.
- Render all signature visuals as inline SVG blueprint line motifs.
- Carry the `*Illustrative only` caveat with the $12,000 figure.
- Surface the complimentary-advisory framing in the DrawFlow "more than capital" closer.

**Don't:**
- Don't use grid-pattern or repeating-background fills (AI-slop guardrail).
- Don't use League Gothic in this section.
- Don't add secondary CTAs (one-action rule).
- Don't use blueprint blue as a trust panel or CTA color.
- Don't drop the `$12,000` figure without its illustrative-only caveat.
- Don't imply guaranteed MLI Select qualification, approval, timeline, or profit.
- Don't substitute icon-pack glyphs for the bespoke station/milestone SVGs.

## 21. Production Acceptance Criteria

- [ ] Section renders between Overview and Builder Consulting in its own `fabric-of-squares` rail.
- [ ] Kicker `03 / Our Build Model`; headline and all locked copy render verbatim.
- [ ] Scannable hero: italic lead line → variable ribbon → shared lead → two audience cards (builders | first-time builder).
- [ ] Single lime CTA "Book a free consultation" → `/intake?intent=consultation&source=build-model-consultation`; no competing CTAs.
- [ ] Four-station track (Plan / Finance / Build support / Takeout) as accessible `<details>` with bespoke blueprint line icons and the dashed coral route.
- [ ] DrawFlow block: milestone node-track + 3-vs-15 comparison + illustrative $12,000 (with caveat) + more-than-capital closer.
- [ ] Forest-green thesis strip bleeds full-width with the equation row `Land + Cost + Capital + Draws + Policy + Incentives + Takeout → Outcome`.
- [ ] No grid/repeating fills; no League Gothic; blueprint blue used only as a technical accent.
- [ ] Reduced-motion respected; all transforms flatten.
- [ ] Mobile: single column; station track stacks; thesis strip bleeds to viewport edges.
- [ ] Keyboard-accessible disclosures; visible focus rings; decorative SVGs `aria-hidden`.
