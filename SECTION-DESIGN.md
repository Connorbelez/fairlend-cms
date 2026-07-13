# SECTION-DESIGN.md

## 1. Section Objective

Replace the sparse service-bullet treatment in the existing `FairlendBuildModelSection` with the selected **Concept 01 — One team, every stage** lifecycle. The finished section must explain that the builder remains in control while FairLend works alongside the builder as the financing and advisory partner from feasibility through construction financing, adjustable draws, CMHC-insured takeout, and the Unf\*ck Contingency Program.

The implementation must preserve the current audience-routing and DrawFlow content captured in the user-supplied screenshots.

## 2. Existing Page Context

- Page: root FairLend landing page.
- Existing section: `src/components/FairlendBuildModelSection`.
- Existing visual system: sticky live-deal dossier, paper/ink interface, blueprint and forest working states, lime route signals, Cormorant narrative type, Inter operating copy, and Oxanium technical labels.
- Existing conversion: free build consultation.
- Existing motion contract: each `.bm-scroll-step` updates the sticky dossier through `BuildModelMotion.client.tsx`.

## 3. Insertion Point

This is not a new adjacent section. It is a production redesign of the existing `#build-model` section in place.

- Previous page section: FairLend overview / financing context.
- Next page section: builder consulting equation strip, then leadership.
- Preserve the existing `id="build-model"`, `data-testid="fairlend-build-model-section"`, and page order.

## 4. Section Role

The section must make four beliefs clear:

1. FairLend is not only a consultant; FairLend provides and structures construction financing.
2. The builder remains the core decision-maker while FairLend works with the builder across the full process.
3. Capital can be staged and the draw plan can be changed mid-build so the project is not squeezed for cash or paying interest on funds earlier than necessary.
4. The relationship continues through CMHC-insured takeout financing and, when needed, the memorable Unf\*ck Contingency Program.

## 5. Locked Copy

### Section introduction

- Kicker: `03 / Our Build Model`
- Headline: `Keep your team in control with one financing partner at every stage.`
- Lead: `Builders usually coordinate the site review, project budget, construction lender, draw process, consultants, and takeout separately. FairLend works with the builder to connect those responsibilities, so your financing is structured around the actual project and your team remains at the centre of every decision.`
- Preserve the current variable ribbon: `Land · Scope · Capital · Draw plan · Professional path · Permit & MLI readiness · Exit`.

### Preserved audience-entry module

Preserve this content and hierarchy from the current implementation:

- Shared lead: `Instead of finding and coordinating every party yourself, bring FairLend the property, plan, or early idea. We help assemble the right team and keep the project, financing, draws, and takeout moving through one coordinated plan.`
- Ledger columns: `Your starting point` / `FairLend carries forward`
- Route 01:
  - `Already building`
  - `Keep your focus on the site.`
  - `Capital path`
  - `We carry the financing and business equation around it.`
- Route 02:
  - `First-time builder`
  - `Bring a property and a down payment.`
  - `Full project team`
  - `We shape the design and specs, assign an experienced builder or project manager, then carry permits, draws and takeout through closing.`
- CTA: `Book a free consultation`
- CTA microcopy: `Bring a property, plan, or early idea — your first conversation is on us.`

### Lifecycle station 01 — Plan

- Label: `Plan / Feasibility and project economics`
- Headline: `FairLend works with you to test whether the site and project economics support a financeable build.`
- Body: `Before you commit more capital to land or design, FairLend works with you to review the acquisition basis, zoning and housing form, unit mix, buildable area, hard and soft costs, contingency, timeline, expected value, and intended exit. This identifies financing constraints while the scope can still be changed.`
- Without FairLend: `Source and brief a planner, designer, builder or project manager, cost consultant, and permit specialists—then reconcile their advice with the budget, financing, and exit.`
- One FairLend team: `Bring us the site or early idea. FairLend helps assemble the required specialists and turns their inputs into one financeable project plan.`
- Sticky-board title: `Feasibility review before you commit more capital.`
- Sticky-board output: `Feasibility review and financing brief`

### Lifecycle station 02 — Finance

- Label: `Finance / Provide and structure construction capital`
- Headline: `FairLend provides the construction financing and works with you to structure it around your specific build.`
- Body: `Together, we align the land basis, construction budget, borrower equity, working-capital needs, project milestones, and exit. FairLend provides the financing and stages the advances around the work, helping keep enough capital available so the build is not squeezed without advancing funds earlier than needed and increasing interest carry.`
- Without FairLend: `Find a construction lender, compare structures, and coordinate the appraisal, legal, insurance, budget review, draw requirements, and working-capital plan.`
- One FairLend team: `FairLend leads the capital plan, construction financing, diligence, and milestone draw structure through one financing relationship.`
- Sticky-board title: `Construction financing provided and structured around your build.`
- Sticky-board output: `Financing sized and staged for the build`

### Preserved DrawFlow signature block

Place DrawFlow immediately after the Finance station as proof of how FairLend structures and administers construction capital. Preserve all of the following:

- Label: `Powered by DrawFlow`
- Headline: `A milestone line of credit for your build.`
- Subheadline: `More draws. Less interest. Fund the work, not the wait.`
- Milestones: `Foundation · Framing · Roof · Windows · Mechanical · Plumbing · Electrical · Drywall · Flooring`
- Comparison: `Traditional — 3 draws` / `FairLend — up to 15 draws`
- Savings callout: `≈ $12,000 — Illustrative interest saved over a typical build.`
- Caveat: `*Illustrative only. Every project differs.`
- Flexibility tile 01:
  - `Your schedule, not ours`
  - `Build your own draw schedule. Tie releases to the milestones that match how your project actually goes up.`
- Flexibility tile 02:
  - `Modify it mid-build`
  - `Builds don't always go as planned. Adjust the draw plan as the work shifts so capital is there when you need it, and not costing interest when you don't.`
- More-than-capital callout: `More than capital. Complimentary access to our GTA build specialists and a deep supplier & trade network — your project manager comes with the financing.`
- Client signal: `The draw schedule matched the way the job actually progressed. We were not paying for idle capital between milestones.`
- Attribution: `GTA residential builder` / `Milestone draw borrower`

### Lifecycle station 03 — Build Support

- Label: `Build support / Adjust draws as the build changes`
- Headline: `Adjust the draw plan mid-build as the work and capital requirements change.`
- Body: `Builds do not always follow the original sequence. FairLend works with you to revise the draw schedule as the work shifts, subject to the financing terms, so capital is available when the project needs it without being advanced earlier than necessary and adding avoidable interest carry.`
- Without FairLend: `Find and manage a builder or project manager, organize trades and suppliers, coordinate consultants and inspections, prepare each draw package, and relay every change to the lender.`
- One FairLend team: `FairLend helps put the right project team around the build, then keeps the draw process, project milestones, and capital plan working from one coordinated file.`
- Sticky-board title: `A draw plan that can change with the build.`
- Sticky-board output: `Adjustable draw plan and current funding file`

### Lifecycle station 04 — Takeout

- Label: `Takeout / CMHC-insured financing`
- Headline: `FairLend helps you qualify for CMHC-insured takeout financing and provides the takeout financing itself.`
- Body: `FairLend works with you early to shape the project, documentation, and operating plan toward CMHC-insured takeout eligibility. As completion approaches, we prepare the application together and FairLend provides the takeout financing for eligible projects. MLI Select is one possible CMHC-insured program, not the whole takeout offering.`
- Without FairLend: `Start a second lender search, confirm CMHC eligibility, assemble valuation, completion, occupancy, income, and operating documents, and coordinate the refinance before maturity.`
- One FairLend team: `FairLend sets the takeout requirements early, prepares the application with you, and provides CMHC-insured takeout financing for eligible projects.`
- Sticky-board title: `CMHC-insured takeout qualification and financing.`
- Sticky-board output: `CMHC-insured takeout qualification and financing plan`

### Lifecycle station 05 — Unf\*ck Contingency Program

- Label: `Unf*ck Contingency Program`
- Headline: `The Unf*ck Contingency Program helps you diagnose what stalled the build and coordinate a recovery plan.`
- Body: `The Unf*ck Contingency Program reviews schedule, budget, trades, working capital, draw requirements, and documentation to identify the root constraints. FairLend then helps coordinate an appropriate recovery path and the resources required to pursue it. Recovery support does not guarantee cost, timing, contractor performance, completion, or full recovery.`
- Without FairLend: `Call the project manager, trades, consultants, quantity surveyor, and lender separately, piece together competing diagnoses, and coordinate a recovery plan while the project is stalled.`
- One FairLend team: `Bring the whole problem to one escalation point. FairLend diagnoses the connected schedule, budget, trade, documentation, and capital constraints, then coordinates a prioritized recovery path.`
- Sticky-board title: `The Unf*ck Contingency Program.`
- Sticky-board output: `Prioritized recovery plan with clear owners`

### Preserved transition out

Preserve the existing Builder Consulting thesis strip and its position after the sticky lifecycle:

- Label: `Builder Consulting`
- Headline: `Building shouldnt be the easy part`
- Body: `A successful build is not only a construction problem, it is a business equation.`
- Preserve the current thesis equation cells and their existing data.

## 6. Transition Requirements

- Transition in: the section must answer what FairLend does for a builder after the preceding financing overview.
- Internal transition: the audience ledger lowers the entry barrier; Plan establishes feasibility; Finance establishes that FairLend provides the capital; DrawFlow proves the capital mechanism; Build Support proves continuing involvement; Takeout proves the exit; Unf\*ck proves recovery capability.
- Transition out: preserve the existing thesis strip so the next builder-consulting section receives the business-equation narrative without an abrupt visual reset.

## 7. Visual Direction

Selected direction: **Concept 01 — One team, every stage.**

- Keep the existing sticky dossier on the left and scroll narrative on the right.
- Use a direct two-column responsibility comparison: `Without FairLend` on the left and `One FairLend team` on the right.
- `Without FairLend`: screened paper field, subdued ink, and a stacked-workstreams `≡` marker. The copy inventories the specialists, documents, and handoffs the client would otherwise manage personally; it does not predict a poor outcome.
- `One FairLend team`: clean paper or active state surface, lime verification edge, and a single-accountability `1` marker.
- Preserve blueprint and forest theme changes only for working states in the build model.
- Preserve the existing audience ledger and DrawFlow designs rather than reinterpreting them.

## 8. Existing Design System to Preserve

- Cormorant Garamond for narrative and station headlines.
- Inter for practical explanatory copy.
- Oxanium for file, stage, and system labels.
- FairLend paper, ink, builder blueprint, builder forest, and electric lime tokens already defined in `build-model.css` and root `DESIGN.md`.
- Existing 12px/8px dossier radii, paper rules, sticky-board elevation, material layers, and reduced-motion treatment.
- Lime remains a functional signal for active, verified, directional, or selected states.

## 9. Section Grid

Desktop:

- Preserve the current `minmax(360px, .94fr) / minmax(0, 1.06fr)` sticky two-column grid.
- Sticky board remains left; scroll content remains right.
- Each station comparison is a strict 50/50 left-right split.

Tablet/mobile:

- Preserve the current mobile dossier behavior.
- Narrative order remains linear and complete.
- Comparison stays left-right where readable; below 420px it may stack `Without FairLend` then `One FairLend team`, with both headings always visible.

## 10. Typography Treatment

- Station headlines: Cormorant, responsive `clamp(38px, 5vw, 70px)`, maximum measure adjusted to fit the longer direct copy without orphaned words.
- Technical labels: Oxanium uppercase, 9–13px, tracked.
- Body: Inter, 14–16px, 1.45–1.65 line height.
- Comparison headings must read literally `Without FairLend` and `One FairLend team`.
- Preserve the current DrawFlow type hierarchy shown in the supplied screenshot.

## 11. Color Treatment

- Base section remains paper/ink with current theme transitions.
- Without FairLend: current theme surface plus low-opacity stipple/dot screen and muted copy.
- One FairLend team: higher-contrast surface with a 3–4px lime verification edge.
- Do not use red or a failure marker. Contrast, screening, the `≡` workstream marker, and the `1` accountability marker establish the difference.
- Unf\*ck station uses ink/blueprint with lime outline; do not introduce a new warning-red theme.

## 12. Spacing and Rhythm

- Preserve current scroll-step vertical rhythm and sticky board viewport behavior.
- Station comparison starts 26–30px below the headline/body.
- Comparison cells use 18–22px padding and equal height.
- DrawFlow remains a large proof chapter, not compressed into a comparison cell.
- Audience ledger spacing and CTA placement remain unchanged unless required for copy fit.

## 13. Components

| Component                   | Production requirement                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `FairlendBuildModelSection` | Reuse and modify directly; do not create a parallel section.                                                              |
| `BuildModelBoard`           | Preserve sticky/dossier mechanics; update state titles, summaries, and outputs to locked copy.                            |
| `AudiencePaths`             | Preserve content and visual hierarchy from the current implementation.                                                    |
| `DrawFlowStep`              | Preserve all screenshot content and existing presentation; move directly after Finance if needed for narrative coherence. |
| `StationStep`               | Replace `services` list with body plus `withoutFairlend` and `withFairlend` comparison cells.                             |
| `BuildModelTestimonial`     | Preserve for DrawFlow client signal; station testimonials may remain only if they do not duplicate the comparison.        |
| `ThesisStrip`               | Preserve unchanged as the exit bridge.                                                                                    |
| `BuildModelMotion`          | Reuse existing observer/state system; no new animation framework.                                                         |

## 14. Motion and Scroll Choreography

- Preserve the current IntersectionObserver-based active-step model.
- Sticky dossier state updates on Intro, DrawFlow, Plan, Finance, Build Support, Takeout, Unf\*ck, and Thesis.
- Recommended narrative order: Intro/Audience → Plan → Finance → DrawFlow → Build Support → Takeout → Unf\*ck → Thesis.
- On state change, update board status, count, title, active dossier tab, chips, and progress exactly as the current motion code does.
- Comparison cells reveal together; no decorative stagger that delays the conversion argument.
- Respect `prefers-reduced-motion` and keep all content visible without motion.

## 15. Responsive Behavior

- Desktop ≥1024px: sticky two-column experience.
- Tablet 700–1023px: existing mobile dossier inserted before relevant content; no horizontal overflow.
- Mobile <700px: single-column chapters, minimum 44px touch targets, comparison may stack only when two readable columns cannot be maintained.
- DrawFlow milestone rail may scroll horizontally or retain its existing clipped/condensed behavior, but labels must remain readable.
- Audience ledger retains both builder routes and CTA without truncation.

## 16. Accessibility Requirements

- Preserve semantic section heading hierarchy and `aria-labelledby` links.
- Comparison cells must not rely on color: use literal headings plus the `≡` workstream and `1` accountability markers.
- Keep the audience ledger and milestone track accessible names.
- Decorative routes, dots, and board duplication remain `aria-hidden`.
- Sticky board CTA remains removed from the tab order as currently implemented; the real CTA remains keyboard accessible.
- Maintain WCAG AA contrast and visible focus rings.

## 17. Asset Strategy

- Reuse the existing parcel image and current dossier illustrations.
- No new stock imagery or generated assets.
- Preserve current monochromatic/blueprint treatment.
- User-supplied screenshots are reference evidence only and are not production assets.

## 18. Claims Ledger

| Claim                                                                             | Status / production rule                                                                                                                                 |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FairLend provides construction financing                                          | User-confirmed positioning; verify exact legal entity/disclosure language before publication.                                                            |
| Draw plan can be modified mid-build                                               | User-confirmed capability; qualify with `subject to financing terms`, lender conditions, underwriting, and project status where public copy requires it. |
| `up to 15 draws`                                                                  | Preserve current copy; must remain substantiated and program-specific.                                                                                   |
| `≈ $12,000` illustrative interest saved                                           | Preserve current copy and immediate caveat; validate calculation and definition of `typical build` before publication.                                   |
| CMHC-insured takeout qualification support                                        | User-confirmed capability; never imply guaranteed CMHC approval.                                                                                         |
| FairLend provides CMHC-insured takeout financing                                  | User-confirmed positioning; publish only with exact eligible-product/entity wording approved.                                                            |
| MLI Select                                                                        | Present only as one possible CMHC-insured program; never equate the whole takeout offering with MLI Select.                                              |
| Complimentary specialists, supplier/trade network, project manager with financing | Preserve current screenshot copy; verify availability, scope, geography, exclusions, and meaning of `complimentary`.                                     |
| Client signal testimonial                                                         | Preserve current attribution format; publish only if testimonial and permission are verified.                                                            |
| Unf\*ck Contingency Program recovery support                                      | Preserve memorable name; retain no-guarantee language for cost, timing, performance, completion, or full recovery.                                       |

## 19. Framework Application Ledger

| Framework              | Concrete spec decision                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| Messaging Architecture | Leads with builder control, then proves full-lifecycle financing and support.                                   |
| Problem → Solution     | Every lifecycle station contrasts the client-managed coordination stack with one FairLend-led workstream.       |
| Choice Architecture    | Audience ledger preserves two clear starting points without forcing visitors to self-diagnose the full service. |
| Cialdini / proof       | DrawFlow comparison, illustrative savings, and client signal remain adjacent to the Finance mechanism.          |
| Grid Systems           | Existing sticky two-column grid and strict 50/50 comparison split are preserved.                                |
| Typography System      | Cormorant narrates; Inter explains; Oxanium labels operational states.                                          |
| White Space            | DrawFlow remains a full proof chapter rather than being crowded into the station comparison.                    |
| Nielsen Heuristics     | Sticky dossier maintains system status and current lifecycle position.                                          |
| Fitts's Law            | Existing large consultation CTA and 44px minimum touch targets remain.                                          |
| Brand Equity           | Reuses the live-deal dossier, DrawFlow, blueprint/forest states, and lime verification language.                |

## 20. Do / Don't Rules

### Do

- Modify the existing component directly.
- Preserve the audience-entry and DrawFlow screenshot content.
- Keep the builder central: FairLend works with the builder.
- State plainly that FairLend provides financing.
- Make adjustable draws and interest timing a core differentiator.
- Keep the Unf\*ck Contingency Program name prominent.
- Use literal `Without FairLend` and `One FairLend team` labels.
- Describe the real sourcing, briefing, document, and handoff workload on the self-managed side; do not frame it as a predicted failure or poor consequence.

### Don't

- Do not recreate the section as a parallel component.
- Do not remove or compress the audience ledger or DrawFlow proof content.
- Do not describe FairLend as consulting-only.
- Do not imply guaranteed funding, CMHC approval, takeout, savings, project completion, or recovery.
- Do not lead with MLI Select as if it is the entire insured-takeout offering.
- Do not return to sparse four-bullet service grids.
- Do not run build, Playwright, E2E, or automated tests for this landing-page-only change.

## 21. Production Acceptance Criteria

- Production uses Concept 01 and no other concept tab or selector.
- Current `AudiencePaths` content and consultation CTA are preserved.
- Current DrawFlow milestone, comparison, savings, flexibility, network, and testimonial content are preserved.
- Lifecycle order is Plan → Finance → DrawFlow proof → Build Support → Takeout → Unf\*ck Contingency.
- Every lifecycle station contains a clear left/right `Without FairLend / One FairLend team` responsibility comparison on desktop.
- FairLend-provided financing, adjustable draws, interest timing, CMHC-insured takeout, and Unf\*ck are explicit.
- Existing sticky board, dossier tabs, theme transitions, CTA behavior, thesis strip, and reduced-motion behavior continue to work.
- Mobile contains the complete content with no clipping or horizontal page overflow.
- No tests or build commands are run, per project instructions; verification is limited to static review, formatting, and manual visual inspection of the existing page if authorized in Phase 6.
