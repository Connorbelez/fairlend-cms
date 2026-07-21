# Garden Suite Financing GTA — UX/UI Shape Brief

**Route:** `/garden-suite-financing-gta`  
**Status:** Awaiting explicit confirmation before implementation  
**Fidelity:** Production-ready direction  
**Surface:** Full money page, all 21 content sections, and the complete six-step assessment flow

## Approved source boundary

This shape uses only the sources explicitly approved for this pass:

- `PRODUCT.md`
- `DESIGN.md`
- `docs/SEO/synthesis/GardenSuites/money-page-copy.md`
- Supacode references supplied for the paper spread, deal-file cards, and blueprint DrawFlow dossier
- The selected visual probe: [`winning-direction-conversion-dossier.png`](./assets/garden-suite-financing-gta/winning-direction-conversion-dossier.png)
- The selected later-page detail: [`drawflow-schedule-capital-strip.png`](./assets/garden-suite-financing-gta/drawflow-schedule-capital-strip.png)
- Existing root-page design-system primitives and current form conventions where they do not conflict with `DESIGN.md`

Do not inspect or recover prior versions of this route, deleted files, build output, caches, source maps, archived GardenSuites material, or unapproved GardenSuites documentation. The intentional reset placeholder remains the source-control boundary.

Generated probes are direction tests, not production imagery, final copy, or accessibility specifications.

---

## 1. Feature summary

This is FairLend's definitive Garden and Laneway Suite financing money page for Toronto and the GTA. It serves an early- or mid-stage homeowner who controls a property and has intent, but may not yet have a builder, validated budget, plans, or permits.

The page must convert that homeowner into a project-assessment lead while proving that FairLend is not simply another mortgage broker. Its differentiation is the combination of mortgage structuring, construction fluency, legal/operating discipline, an established project network, field oversight, and the DrawFlow planning and milestone-funding system.

The stalled-project pathway remains visible and credible, but secondary to the planning homeowner journey.

## 2. Primary user action

**Primary action:** Begin and complete the six-step Garden Suite project assessment.

The first step is embedded above the fold in the hero. A homeowner should understand immediately that:

1. They can start without a builder.
2. This first step is not a credit check or loan application.
3. FairLend will assess the property and project state before requesting sensitive financial details.
4. The page will preserve their entered information as they continue through the same-page flow.

### Conversion hierarchy

1. **Primary:** `Plan My Garden Suite Project` — hero Step 1 and final CTA only, exactly as locked in the production copy.
2. **Secondary:** `See How DrawFlow Works` — moves to the mechanism chapter without competing visually with the assessment.
3. **Assisted:** `Speak With the Garden Suite Team` — present near final conversion and success/error recovery, not beside every primary action.
4. **Urgent:** `My Garden Suite Project Is Already Underway` — appears in the rescue section and can set the form's build status to in-progress/stalled.
5. **Research exit:** link to the cost-and-feasibility resource from the answer block and prescribed later sections.

Repeated generic `Apply now` buttons are not part of this route's conversion language.

---

## 3. Design direction

### Winning direction

**Probe A — Conversion Dossier** is the dominant direction. The hero is a tactile paper file built around a real Toronto Garden/Laneway project image, an immediate assessment sheet, attached authority evidence, and one plotted route into the form.

The compact **Construction Schedule / Capital & Draw Plan** strip from Probe C is retained as a later DrawFlow proof module. It does not become the hero and must not make the opening experience feel like enterprise software.

### Color strategy

**Full palette, paper-led.** Ivory and white paper carry the entry and reading-heavy sections. Blueprint Blue, Field Forest, Ink, and Electric Lime appear as committed narrative fields when the story changes from homeowner orientation to operating mechanism, evidence, control, or action.

Color rotation is semantic, not decorative:

- **Ivory / White Paper:** orientation, service definition, authority, comparison, preparation, and reading.
- **Field Forest:** DrawFlow's homeowner-facing operating loop and construction continuity.
- **Blueprint Blue:** engine mechanics, schedule/dependency analysis, and technical evidence.
- **Ink:** permission-controlled workspace and rescue/failure states.
- **Electric Lime:** action, verification, highlighted evidence, active progress, and the final conversion field.

### Theme scene sentence

A Toronto homeowner sits at a bright kitchen table with a real backyard-build file open in front of them; the paper is marked, measured, and credible, while a construction specialist has organized the route well enough that the homeowner feels informed rather than overwhelmed.

This scene requires a light, image-led opening. Dark technical fields arrive only after relevance and trust have been established.

### Brand voice

**Worked, measured, assured.**

- **Worked:** the page looks actively used—clipped evidence, file tabs, route marks, project imagery, and hard offsets.
- **Measured:** claims, stages, schedules, and comparisons are explicit and attributable.
- **Assured:** copy and hierarchy are direct without banking clichés, startup bravado, or urgency theatre.

### Anchor references

1. The selected conversion-dossier probe for hero topology, project imagery, attached proof, and immediate form.
2. The supplied Supacode paper spread for editorial scale, engraved Toronto imagery, white-paper files, and lime evidence marks.
3. The supplied blueprint DrawFlow dossier for dense-but-legible technical fields, hard lime offsets, milestone rails, and schedule/capital evidence.

Existing Cormorant, Inter, Oxanium, and League Gothic roles remain because identity preservation wins over greenfield font selection. The implementation must still enforce the documented two-register rule and prevent all four families from competing in a single component.

### Explicit restraint

The primary visual risk is becoming **too technical for an idea-stage homeowner**. Every mechanism section must lead with the homeowner outcome before revealing the operating detail:

- outcome first;
- one diagram or product frame second;
- methodology/deeper detail third;
- CTA or next route last.

Dark fields must be separated by substantial ivory reading intervals. The page cannot become one continuous control room.

---

## 4. Scope

### Fidelity

Production-ready UX/UI direction, not a sketch. The eventual implementation is expected to be responsive, accessible, performant, indexable, analytics-ready, and legally gated.

### Breadth

The complete route:

- all 21 prescribed content sections;
- the hero's embedded first assessment step;
- the full six-step progressive assessment;
- success, failure, validation, urgent, and no-JavaScript states;
- desktop, tablet, mobile, reduced-motion, and keyboard behavior;
- launch-critical evidence and content gates.

### Interactivity

Shipped-quality interactions, not a visual prototype:

- progressive form;
- journey progression;
- DrawFlow state board;
- before/after plan toggle;
- checklists, tabs, and accordions;
- methodology disclosures;
- accessible comparison behavior;
- contextual route links and analytics events from the approved copy.

### Time intent

Polish until the surface is ready to ship, subject to compliance, evidence, media, analytics, and product-owner sign-off. No fabricated placeholder values may be used to simulate readiness.

### Technical constraints

- Next.js, Tailwind, and existing ShadCN primitives.
- Static/indexable content must remain server-rendered.
- JavaScript enhances content; it must not contain the only copy, comparison, checklist item, or answer.
- No horizontal page scroll.
- Below-fold rich media must lazy-load.
- The form must avoid sending sensitive field values to GA4, ad pixels, or replay tools.
- WCAG AA contrast, visible focus, semantic headings, labelled fields, and practical 44px targets are baseline requirements.
- Every motion treatment must have a complete reduced-motion state.

---

## 5. Layout strategy

### Global frame

Use the established FairLend landing rail: a centered content field within restrained textured gutters at large widths, becoming a full-width single column below tablet. Cross marks and texture are material cues, not a decorative grid overlay.

The route should read as one long project file divided into six chapters. These chapters organize the 21 SEO sections without changing their prescribed order or copy.

### Chapter 1 — Orient and qualify trust

**Sections 1–4:** Hero, answer block, planning-to-takeout journey, integrated experience.

- Paper mode dominates.
- The real project image and assessment are the hero's two primary anchors.
- Attached proof establishes authority without turning the hero into a metrics template.
- The answer block is a clean quotable file with no imagery.
- The journey gives relief before deeper technical explanation.
- Credentials make the team accountable and named.

### Chapter 2 — Explain the operating mechanism

**Sections 5–8:** DrawFlow definition, engine, capital efficiency, claims/evidence.

- Transition to Field Forest for the four-layer operating loop.
- Move to Blueprint Blue for inputs/analysis/outputs and the adaptive example.
- Use the approved compact schedule/capital strip inside this chapter, most naturally between the engine and capital-efficiency sections.
- Return to ivory for claims, case files, and the worked comparison so evidence is readable and auditable.

### Chapter 3 — Prove control in the real build

**Sections 9–11:** Shared workspace, field oversight, professional network.

- Ink supports the permission-controlled workspace.
- Ivory supports real field media and the weekly cadence.
- The network map returns to paper and makes introductions feel useful rather than exclusive or compulsory.

### Chapter 4 — Help the homeowner judge fit and route

**Sections 12–16:** Fit checklist, route comparison, cost/capital, takeout/CMHC, Laneway differences.

- Reading-first paper mode.
- Interactive elements behave as decision aids, never approval scores.
- The comparison is balanced and visibly includes DrawFlow's limitations.
- The takeout route reverses direction to show that the exit is planned before construction.
- Garden versus Laneway remains a dedicated, quotable distinction with site diagrams.

### Chapter 5 — Prepare or rescue the file

**Sections 17–18:** Readiness checklist and failure modes.

- Paper file dividers make preparation feel manageable.
- Ink creates the page's darkest, most urgent moment for already-underway or stalled files.
- The urgent path is blunt but never promises that a file can be rescued.

### Chapter 6 — Consolidate and convert

**Sections 19–21:** Why FairLend evidence index, FAQ, final CTA.

- Return to ivory for the evidence index and FAQ.
- Use Electric Lime as a full final field with one proposition and two actions.
- The final CTA should feel like the file being formally opened, not a repeated banner.

### Rhythm

Avoid 21 visually equal sections. Alternate among:

- a single dominant image-led composition;
- a quotable reading file;
- a dense but bounded operating board;
- a wide comparison or route;
- a short evidence interruption;
- a spacious conversion field.

No generic same-size card grid may become the default. Deal-file repetition is allowed only where the content is genuinely a catalog of files, cases, credentials, or evidence.

### Hero topology

Desktop:

- Approximate 58/42 image/story-to-form split.
- H1 occupies two to three balanced lines and remains under the documented 6rem ceiling.
- Real halftone project imagery sits behind and below the proposition as part of the paper composition, not inside a rounded photo card.
- Four primary proof slips attach to the image edge: 28 years mortgage, 30 years construction, 10+ years legal, and up to 15 draws.
- The up-to-50% claim does not join the hero cluster unless its ledger and methodology have cleared launch review.
- The assessment sheet appears physically clipped to the dossier and uses a dark-blue rear tab as depth, not soft shadow.
- A single dashed lime route ends at the form action and then rests.

Mobile:

- H1 and reassurance first.
- Project image second, cropped to preserve the actual suite and site context.
- Proof becomes a two-by-two attached strip rather than four floating slips.
- Step 1 follows immediately in document order.
- No image overlay may compete with labels or form controls.
- The hero must not force a viewport-height lock; content can grow naturally.

### Assessment continuation

The hero contains the complete first logical step: municipality, property address, ownership/control, Garden/Laneway/unsure, and current stage. Compact field grouping is allowed, but no required field from Step 1 may be silently deferred.

When the homeowner activates `Plan My Garden Suite Project`:

1. Validate Step 1 in place.
2. Preserve entered values.
3. Move focus to a full-width, same-page assessment workspace immediately following the hero.
4. Scroll only after focus and error handling are resolved.
5. Continue Steps 2–6 in that workspace without navigation or modal confinement.
6. Keep the page context available above and below; do not trap the homeowner in an overlay.

The assessment workspace is one persistent file, not six detached cards. Only the active step is visually dominant; completed-step summaries remain available for review.

---

## 6. Key states

### Page and media states

- **Default:** all core content visible and readable before animation.
- **Reduced motion:** routes and progress render complete; field transitions become instant or brief crossfades; no sticky choreography that depends on scrubbed motion.
- **Project image unavailable:** retain the proposition and form; use an approved neutral image field with descriptive status copy only if compliance has approved the omission. Do not substitute generated art or a generic CSS panel.
- **Product screenshot unavailable:** render the server-side mechanism explanation and semantic diagram; label the product-media location as pending internally, never as a public fake screenshot.
- **No JavaScript:** all section copy, tables, checklist items, FAQ answers, and form labels remain present; enhanced states may linearize.

### Form states

- **Pristine:** concise purpose copy, visible progress, no premature error messages.
- **Typing/selection:** labels never disappear; autocomplete and chip states are keyboard operable.
- **Address unavailable:** permit manual entry and explain that address lookup failure does not block assessment.
- **Validation error:** inline, specific, and announced; focus moves to the first invalid field; valid entries remain intact.
- **Step complete:** compact summary with an explicit Edit action.
- **Saving:** disable only the action being submitted; show a textual saving state without blanking the form.
- **Network failure:** preserve every entered value and provide retry plus an assisted-contact path.
- **Urgent branch:** in-progress/stalled/immediate-need answers visibly adapt the next-step copy and flag the file for urgent review without promising speed or approval.
- **Consent incomplete:** explain the exact required consent; never pre-check it.
- **Submitting:** prevent duplicate submissions and announce progress.
- **Success:** confirm receipt, summarize what FairLend will review, explain the approved contact channel, and offer the readiness checklist/resource. Do not promise approval, rate, savings, or funding speed.
- **Duplicate/returning lead:** acknowledge the existing assessment where technically supported; do not erase new information.
- **Session interruption:** preserve non-sensitive progress locally only if privacy review approves; never persist documents or sensitive financial details in browser storage.

### Interactive content states

- **Journey:** current, complete, and upcoming stages; all stages remain accessible without scroll animation.
- **DrawFlow board:** Plan, Optimize, Operate, Adapt; current state has more than color alone.
- **Before/after example:** default, changed, and revised; this is a two-state comparison, not a carousel.
- **Fit checklist:** unchecked/checked and neutral running orientation; never a qualification score.
- **Tabs/accordions:** selected, unselected, expanded, collapsed, focus-visible; all content remains in the HTML.
- **Comparison tables:** desktop full table; mobile either sticky-first-column scroll region with explicit affordance or content-equivalent stacked routes.

---

## 7. Interaction model

### Hero and assessment

- The form is usable immediately; the CTA is not a decorative scroll button.
- The dashed route draws once from project image to assessment action after the hero settles.
- The form sheet may use a subtle 1–2px pressed offset on action; it must not bounce or float.
- After valid Step 1, the assessment workspace receives programmatic focus at its heading and exposes Step 2.
- Browser back/forward behavior must not accidentally discard submitted data or resubmit a request.

### Long-page navigation

- A compact chapter index may become sticky after the hero on desktop, but labels must describe real chapters rather than `01 / 02 / 03` decoration.
- On mobile, use a simple progress menu or jump list; do not keep a wide sticky rail.
- The secondary hero action goes directly to the DrawFlow definition, not the deepest engine diagram.
- Evidence-index links return to stable source anchors with appropriate scroll margin.

### Journey

- Desktop may use sticky progression if every stage is keyboard reachable and content never disappears.
- Mobile is a stacked ordered route with all role rows visible or expandable.
- The route animation traces once in the direction of progress and stops.

### DrawFlow mechanism

- Lead each state with one homeowner sentence.
- Reveal the operating detail below that sentence.
- Use the approved compact schedule/capital strip as a proof artifact with real labels and accessible list/table equivalents.
- Plan → Optimize → Operate → Adapt transitions use the documented 820ms field timing only when motion is allowed.

### Proof and methodology

- Claim slips link to their methodology anchors.
- Methodology is expanded by default on first arrival from a claim link.
- The case ledger and worked comparison are static HTML first.
- No animated counter, rolling number, or hero-metric treatment is permitted.

### Mobile conversion support

After the hero form has left the viewport, a compact sticky action may appear. It must:

- use the locked primary phrase or a short `Continue assessment` state when progress exists;
- disappear whenever the active form or consent controls are visible;
- respect safe-area insets;
- never cover content, validation, cookie controls, or footer actions.

---

## 8. Content requirements

### Copy authority

`docs/SEO/synthesis/GardenSuites/money-page-copy.md` is the only GardenSuites copy source for this pass. Preserve its locked metadata, H1, section order, CTA language, legal qualifiers, placeholders, internal links, structured-data constraints, and analytics-event notes.

Do not convert build notes, belief-stage notes, table construction notes, or placeholder ownership notes into public body copy.

### Section-by-section presentation

1. **Hero:** exact locked H1, approved subhead, reassurance, trust line, attached proof, and embedded Step 1.
2. **Answer block:** one server-rendered quotable service-definition file; no image.
3. **Journey:** ten real stages with FairLend role, homeowner decision, third-party role, and output.
4. **Integrated experience:** three named, accountable discipline files with real portraits when approved.
5. **What DrawFlow is:** four-state homeowner-facing operating board.
6. **Engine:** Inputs → Analysis → Outputs, real dependency example, and adaptive before/after proof.
7. **Capital efficiency:** builder continuity and homeowner interest exposure presented as two sides of one mechanism.
8. **Claims/evidence:** three distinct claim families, case ledger, reproducible comparison, and release-authority explanation.
9. **Workspace:** redacted real product UI plus least-privilege role matrix.
10. **Field oversight:** consented project sequence, walkthrough evidence, and daily/weekly/milestone cadence.
11. **Network:** seven practical participant categories with clear choice and relationship disclosure.
12. **Fit checklist:** strong and still-worth-assessing signals; neutral self-orientation only.
13. **Route comparison:** six balanced funding routes using one scenario and equivalent assumptions.
14. **Cost/capital:** dated cost anchor, full capital stack, and five lender views.
15. **Takeout/CMHC:** reversed route from takeout to pre-construction; visible review date.
16. **Laneway:** two site diagrams and quotable definitions; no paraphrased zoning claims.
17. **Readiness:** nine accessible groups and downloadable equivalent when approved.
18. **Rescue:** honest failure modes and an urgent assessment branch.
19. **Evidence index:** links only to proof already presented; no newly stylized claims.
20. **FAQ:** concise server-rendered answers with full-section links.
21. **Final CTA:** full lime field, one proposition, primary and assisted actions, reassurance, and legal qualification.

### Required media roles

- Consented real Toronto Garden/Laneway hero project image and matching OG image.
- Real, approved portraits for the accountable mortgage, construction, and legal profiles.
- Redacted DrawFlow dependency graph.
- Real adaptive schedule example.
- Redacted current workspace screenshot with role identified.
- Consented date-sequenced field/drone media.
- Approved walkthrough report sample.
- Semantic Garden/Laneway lot diagrams.

Production media should come from approved project assets or newly consented operational material. The direction probe must not ship as a fake project photograph or product screenshot.

### Semantic/generated visual roles

The following may be implemented as semantic SVG/CSS/HTML because they communicate structure rather than pretend to be documentary evidence:

- dashed journey routes;
- milestone/progress rails;
- Inputs → Analysis → Outputs diagram;
- draw-step chart;
- network map;
- capital-stack bar;
- reverse takeout route;
- lot/access diagrams when reviewed for factual accuracy.

Do not use hand-drawn doodle scenes, fake blueprint screenshots, decorative grid backgrounds, or generated evidence.

### Form content

Use the six prescribed groups exactly:

1. Property/project.
2. Team/readiness.
3. Budget/capital.
4. Build status.
5. Outcome.
6. Contact/consent.

Sensitive details remain deferred to secure intake. Every field that requests an address, ownership, capital, mortgage, income-adjacent range, or contact detail must explain why it matters in plain language.

### Accessibility copy

- Every input requires a persistent visible label.
- Placeholder text is example/help only, never the label.
- Error copy states what happened and how to fix it.
- Charts and diagrams require concise text equivalents.
- Project-image alt text names the actual stage and context, not merely `garden suite`.
- Decorative engraving layers use empty alt text.

---

## 9. Implementation references to load next

For an implementation pass, load these Impeccable references in this order as needed:

1. `reference/craft.md` — end-to-end build workflow after this brief is confirmed.
2. `reference/layout.md` — hero split, chapter rhythm, sticky journey, long-page density, and responsive re-composition.
3. `reference/typeset.md` — exact serif/grotesque hierarchy, headline wrapping, labels, tables, and long-form reading.
4. `reference/animate.md` — single hero route, field transitions, sticky journey, reduced motion, and state choreography.
5. `reference/harden.md` — assessment errors, submission recovery, sensitive-data handling, dynamic content, and evidence fallbacks.
6. `reference/adapt.md` — mobile form ordering, comparison behavior, sticky CTA, and linearized technical modules.
7. `reference/audit.md` — accessibility, performance, responsive behavior, and final launch checks.
8. `reference/clarify.md` only if product/compliance asks for form or state-copy revisions; do not rewrite the locked SEO body casually.

ShadCN registry search should precede creation of new generic form, accordion, tabs, tooltip, dialog, or progress primitives. Custom composition remains appropriate for the dossier, route, and DrawFlow evidence modules.

---

## 10. Open questions and launch gates

The visual direction and conversion topology are resolved. The remaining issues are evidence, product, compliance, and operational gates—not invitations to invent design content.

### Launch-critical evidence gates

- Consented hero/OG project image.
- Principal Broker licensed identity, prescribed title, and licence history.
- Legal-team identities, credentials, tenure, and approved scope wording.
- Standard lender-agreement clauses and approved release workflow.
- Multi-case ledger supporting the up-to-50% claim.
- Reproducible inputs, schedules, fees, version, reviewer, and date for the approximately $12,000 model.
- Approved definition and methodology for the Toronto-build AI training claim.
- Redacted current workspace screenshot.
- Walkthrough report, reviewer identity/qualification, and inspection-scope language.
- Network selection and commercial/referral disclosures.
- Current CMHC and government-program sources with visible review dates.

### Product/engineering gates

- Confirm whether the existing intake infrastructure can safely support this specialized six-step schema or requires a dedicated Garden Suite intake adapter.
- Confirm CRM field mapping, partial-save policy, urgent-file routing, idempotency, duplicate handling, and approved browser-persistence behavior.
- Confirm the post-submission contact channel and response wording without inventing an SLA.
- Confirm analytics payloads are event-only and never contain raw address, mortgage, income, document, or project-detail values.
- Confirm the downloadable checklist asset or classify it as deferred.

### Deferrable media candidates

Only the designated owners may classify the dependency-graph example, adaptive before/after example, drone sequence, build-advisory biography, and downloadable checklist as deferred. Their absence must produce a truthful, intentionally simpler module—not a fake placeholder.

---

## Confirmation gate

Confirm this brief before any implementation begins. On confirmation, the next action is an `$impeccable craft /garden-suite-financing-gta` pass using this file as the task-specific source of truth, while retaining the approved source boundary above.
