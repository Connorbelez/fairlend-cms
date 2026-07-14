---
target: this section of /intake (CapitalFeatureSection)
total_score: 21
p0_count: 0
p1_count: 3
timestamp: 2026-07-09T20-02-53Z
slug: omponents-drawflowintake-drawflowintake-client-tsx
---
# Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 1/4 | Foundation is active while every later milestone is marked complete, communicating an impossible state. |
| 2 | Match Between System and Real World | 2/4 | Construction language and imagery are strong, but Completion-to-Foundation reverses normal project chronology and “SLA” is internal jargon. |
| 3 | User Control and Freedom | 2/4 | Two differently labeled CTAs imply separate paths but both invoke the same action. |
| 4 | Consistency and Standards | 2/4 | The visual system is cohesive, but the metallic primary CTA conflicts with the established lime-action rule and timeline convention is inverted. |
| 5 | Error Prevention | 2/4 | The disclaimer helps, but misleading completion states and an unexplained 24-hour target invite incorrect expectations. |
| 6 | Recognition Rather Than Recall | 3/4 | Amounts, stages, bars, and building states are co-located; current versus completed meaning is not explicitly labeled. |
| 7 | Flexibility and Efficiency | 2/4 | Entry is quick, but the apparent choice collapses into one action and there is no distinct advisor route. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Strong art direction, but headline, ladder, building stack, two CTAs, qualification, and metric strip compete in one viewport. |
| 9 | Error Recovery | 2/4 | The contradictory milestone state provides no way for users to resolve their interpretation. |
| 10 | Help and Documentation | 2/4 | The qualification helps, but the approval sequence, “SLA,” and post-click outcome remain unclear. |
| **Total** |  | **21/40** | **Acceptable — strong visual foundation, substantial semantic and conversion correction required.** |

# Anti-Patterns Verdict

**LLM assessment:** Pass, with localized AI tells. The exploded construction stack, milestone-to-capital mapping, blueprint-paper field, and disciplined blueprint/forest palette feel specific to DrawFlow rather than generic fintech. The weaker tells are the large serif plus uppercase kicker plus underline formula, five repeated amount cards, metallic CTA treatment, and especially the generic `0 / 24-hour / 1` metric strip. The blueprint grid is justified because this is literally a construction drawing surface.

**Deterministic scan:** The bundled detector returned `[]`: zero findings in `DrawflowIntake.client.tsx`, including `CapitalFeatureSection`. There were no rule hits or false positives. This does not clear the section: the highest-severity defects are semantic state logic, misleading choice architecture, and accessibility semantics, none of which the pattern detector is designed to infer.

**Visual overlays:** No reliable user-visible overlay is available. The in-app browser backend was unavailable (`Browser is not available: iab`), so mutable-injection preflight could not run. The existing localhost route returned HTTP 200, and the supplied 3212×2244 capture was used as the visual fallback. The Impeccable live server was not started.

# Overall Impression

This is visually one of the stronger sections on the intake route. It has an ownable idea: approved construction progress physically raises available capital. The single biggest opportunity is to make the information model as trustworthy as the art direction. Right now the visualization says future work is complete, the two CTAs promise different outcomes but do the same thing, and the section ends on weak proof rather than reassurance.

# What’s Working

- **Ownable visual metaphor:** The exploded building assembly and capital ladder make staged draw financing tangible without generic finance graphics.
- **Specific brand world:** Blueprint ink, construction dimensions, paper texture, editorial serif authority, and dense sans-serif amounts read like a builder’s underwriting dossier rather than a bank landing page.
- **Solid baseline craft:** Contrast is generally strong, actions use native buttons, CTA height exceeds 44px, focus styles exist, and reduced-motion handling exists globally.

# Priority Issues

## [P1] The milestone state model is logically false

The data runs Completion → Foundation, Foundation is `active`, and every later phase is labeled `complete`.

**Why it matters:** This is the section’s main explanatory device. If users cannot trust it, it damages confidence in DrawFlow’s underwriting model.

**Fix:** Choose one model. For chronology, render Foundation → Framing → Roof → Interior → Completion, with Foundation current and later phases projected. To preserve the literal rise metaphor, keep Foundation at the bottom, label the axis `CAPITAL UNLOCKS ↑`, remove timeline connectors/checkmarks, and use neutral projected-stage markers. Future stages must never be called complete.

**Suggested command:** `$impeccable clarify` followed by `$impeccable shape`

## [P1] The two conversion actions create false choice

“Check financeability” and “Start project review” both call the same `onStart` callback.

**Why it matters:** In high-stakes finance, two different promises leading to one identical action feel evasive and lower trust.

**Fix:** Keep one lime primary action: `Check my project’s financeability`. Add outcome copy: `Answer a few project questions and receive a review path.` If a secondary action remains, make it genuinely distinct, such as `Talk to a DrawFlow advisor`. Replace the metallic CTA with the established lime action treatment.

**Suggested command:** `$impeccable clarify` followed by `$impeccable polish`

## [P1] The timeline is visually styled but programmatically inert

The primitive discards `activeIndex`; the structure uses generic divs; no item receives `aria-current`; percentages are rendered as `<time>` elements with unrelated 2026 dates; active/completed meaning exists only in visual data attributes and icons.

**Why it matters:** Screen-reader users do not receive the critical state relationship, while hidden dates add false specificity.

**Fix:** Render an ordered list, use plain text or `<data value="0.25">25%</data>`, add explicit `Current stage` / `Projected unlock` text, and set `aria-current="step"` only on a real current milestone. Make `activeIndex` functional or remove it. Raise the qualification from 11px uppercase to 13–14px sentence case.

**Suggested command:** `$impeccable harden` followed by `$impeccable audit`

## [P2] The closing metric strip is weak, generic proof

`0 forced draw schedule`, `24-hour draw SLA target`, and `1 advisor-built plan` use a generic hero-metric pattern. “1” is unimpressive, “SLA” is jargon, and the 24-hour claim may conflict with lender/admin qualification.

**Why it matters:** These are the section’s final claims, so peak-end memory lands on questionable proof rather than confidence.

**Fix:** Replace them with plain-language benefits: `No forced draw calendar`; `Draw requests reviewed within one business day` only if substantiated; `Evidence plan built with your advisor`. Qualify or source the service target.

**Suggested command:** `$impeccable distill` followed by `$impeccable clarify`

## [P2] Mobile loses the signature visual but keeps the repetition

At the mobile breakpoint the construction stack is hidden while all five milestone cards, both CTAs, the note, and the three closing benefits remain. At small-tablet widths the benefits remain squeezed into three columns.

**Why it matters:** Mobile removes the most memorable brand asset and preserves the most tedious content density.

**Fix:** Convert the ladder to five compact semantic rows, preserve a cropped construction-stack image or stage thumbnail, and stack the three closing benefits around 600px rather than only at phone width.

**Suggested command:** `$impeccable adapt`

# Persona Red Flags

**Jordan — first-time builder/borrower:** Green checks read as finished work, yet Foundation is active at 0%, so the story collapses. “Draw SLA” and “milestone evidence” are unexplained. The two CTAs appear different but are not. No concise statement explains timing, documents, or what happens after clicking.

**Sam — screen-reader and keyboard user:** The timeline lacks list/step semantics; `activeIndex={4}` exposes no accessible state; percentages are encoded as time elements; current/completed status is visual only. Native buttons, visible focus, and adequate targets are positive.

**Casey — distracted mobile user:** The signature building visual disappears, leaving a long five-card march. Two full-width actions appear before their distinction is clear, three dense benefits remain side by side at small-tablet widths, and the all-caps qualification is easy to skip.

# Minor Observations

- The 9.6ch heading measure forces five lines; widening it slightly would reduce competition with the capital ladder.
- Cormorant at weight 400 feels less established than the project’s declared 600-weight authority.
- Hidden 2026 dates introduce stale specificity without visible value.
- Decorative dimensions and the building asset are correctly hidden from assistive technology because the milestone data duplicates their meaning.
- The financial qualification is responsible and should be promoted, not treated as tiny legal debris.

# Questions to Consider

- Is this a live project state or an explanation of the product model? The copy says illustrative while the UI asserts active and complete states.
- Is bottom-up “capital rises” important enough to violate timeline convention? If so, the component should explicitly be an upward scale, not a timeline.
- Why retain two CTAs if there is only one next step?
- Can FairLend substantiate the 24-hour target after lender and admin review?
- Should the user remember the milestone-backed model or `0 / 24-hour / 1`? The weakest content currently gets the final word.
