# Money-page block catalogue

Generated from `docs/page-construction/money-page-blocks.config.json` on 2026-07-21T04:43:51.854Z. The JSON manifest is authoritative.

## Category summary

| Category | Blocks |
|---|---:|
| answer | 1 |
| calculator | 2 |
| checklist | 1 |
| comparison | 5 |
| content-grid | 1 |
| cta | 4 |
| editorial | 1 |
| faq | 5 |
| form | 3 |
| hero | 5 |
| page-composer | 1 |
| page-shell | 2 |
| problem | 2 |
| process | 4 |
| proof | 5 |
| qualification | 3 |
| seo | 1 |
| solution | 2 |
| transition | 1 |

## Block inventory

| Block | Category | Reuse | Status | Purpose | Aesthetic | Source |
|---|---|---|---|---|---|---|
| `fairlend-application-cta` | form | direct | production | Capture a lightweight application identifier and move a visitor into the established application flow. | FairLend shared money-page system; single-field application CTA; medium | `src/components/FairlendFinancingRouteReference/index.tsx` |
| `fairlend-borrower-consultation` | cta | reference-only | candidate | Close a private-mortgage narrative with consultation conversion and deadline context. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerConsultation/index.tsx` |
| `fairlend-borrower-cta` | cta | direct | production | Render the canonical FairLend money-page action with consistent link behaviour and hierarchy. | FairLend shared money-page system; lime or outlined action button; medium | `src/components/FairlendBorrowerCta/index.tsx` |
| `fairlend-borrower-differentiators` | comparison | reference-only | candidate | Explain the full economics and decision factors behind a private mortgage rather than presenting only rate. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerDifferentiators/index.tsx` |
| `fairlend-borrower-faq` | faq | reference-only | candidate | Resolve private-mortgage objections through a dedicated accordion question register. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerFaq/index.tsx` |
| `fairlend-borrower-hero` | hero | reference-only | candidate | Open a deadline-driven private-mortgage page with embedded intake and decision proof. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerHero/index.tsx` |
| `fairlend-borrower-problem` | problem | reference-only | candidate | Reframe a fast financing approval as insufficient without complete cost and exit clarity. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerProblem/index.tsx` |
| `fairlend-borrower-process` | process | reference-only | candidate | Visualize the private-mortgage route from initial review through a credible exit. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerProcess/index.tsx` |
| `fairlend-borrower-scenarios` | qualification | reference-only | candidate | Route visitors through scenarios where private financing may fit. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerScenarios/index.tsx` |
| `fairlend-borrower-solution` | solution | reference-only | candidate | Present private-mortgage structures around the borrower's next move and exit path. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerSolution/index.tsx` |
| `fairlend-borrower-trust-proof` | proof | reference-only | candidate | Establish principal-broker judgment, local context and operating standards. | FairLend private-mortgage conversion dossier; route-specific editorial conversion block; medium | `src/components/FairlendBorrowerTrustProof/index.tsx` |
| `fairlend-build-model-section` | calculator | direct | production | Explain FairLend's build model and DrawFlow through an interactive technical financing dossier. | DrawFlow technical financing dossier; scroll-driven model board and narrative; high | `src/components/FairlendBuildModelSection/index.tsx` |
| `fairlend-builder-consulting-section` | calculator | extend | production | Model builder/project economics through an editorial pro-forma and scenario timeline. | FairLend builder pro-forma workbook; scroll-driven equation workspace; high | `src/components/FairlendBuilderConsultingSection/index.tsx` |
| `fairlend-credibility-stats-strip` | proof | direct | production | Show compact licence, turnaround, or capability proof beneath a financing-route composition. | FairLend shared money-page system; horizontal credibility strip; medium | `src/components/FairlendFinancingRouteReference/index.tsx` |
| `fairlend-editorial-review` | editorial | direct | production | Publish licensed reviewer identity, review date, methodology and primary sources for YMYL content. | FairLend editorial evidence card; reviewer and source split; medium | `src/components/SEO/FairlendEditorialReview.tsx` |
| `fairlend-faq-section` | faq | extend | production | Render the global FairLend FAQ groups and their existing JSON-LD payload. | FairLend shared money-page system; content-dependent shared block; medium | `src/components/FairlendFaqSection/index.tsx` |
| `fairlend-feedback-content-page` | page-composer | composer | production | Assemble a static editorial money/service page from a typed hero, proof, answer, content-section, editorial and final-CTA configuration. | FairLend cream-and-forest editorial money page; large split hero followed by configurable editorial sections; medium | `src/components/FairlendFeedbackContentPage/index.tsx` |
| `fairlend-financing-route-copy-panel` | solution | direct | production | Present route-specific positioning, explanatory copy and an optional application CTA inside the financing-route system. | FairLend shared money-page system; editorial copy panel; medium | `src/components/FairlendFinancingRouteReference/index.tsx` |
| `fairlend-financing-route-header` | page-shell | direct | production | Render the indexed system header and descriptor for a financing-route block. | FairLend shared money-page system; technical ledger header; medium | `src/components/FairlendFinancingRouteReference/index.tsx` |
| `fairlend-financing-route-reference` | hero | direct | production | Compose a financing-route hero/feature from header, copy, illustration, inline application CTA and credibility proof. | FairLend financing-route technical editorial; split copy and illustration with evidence footer; medium | `src/components/FairlendFinancingRouteReference/index.tsx` |
| `fairlend-geo-answer-block` | answer | direct | production | Publish an answer-first, citation-ready passage with an optional accessible comparison table. | FairLend editorial evidence card; answer passage with optional table; medium | `src/components/SEO/FairlendGeoAnswerBlock.tsx` |
| `fairlend-inline-application-cta` | form | direct | production | Place the compact application CTA over or beside a route illustration at large breakpoints. | FairLend shared money-page system; compact floating application form; medium | `src/components/FairlendFinancingRouteReference/index.tsx` |
| `fairlend-landing-rail` | page-shell | direct | production | Provide the canonical FairLend framed page canvas, side gutters and selectable texture. | FairLend shared money-page system; framed full-page content rail; medium | `src/components/FairlendLandingRail/index.tsx` |
| `fairlend-lead-intake` | form | direct | production | Run the established FairLend lead-intake workflow with intent, product, source and page/hero variants. | FairLend shared money-page system; progressive conversion form; medium | `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx` |
| `fairlend-registration-disclosure` | proof | direct | production | Render FairLend's authorized legal name and licence disclosure consistently. | FairLend shared money-page system; compact legal disclosure; medium | `src/components/FairlendRegistrationDisclosure.tsx` |
| `fairlend-section-transition` | transition | direct | production | Create a controlled visual buffer between incompatible light FairLend section surfaces. | FairLend shared money-page system; decorative gradient spacer; medium | `src/components/FairlendSectionTransition.tsx` |
| `fairlend-service-seo` | seo | direct | production | Render the canonical WebPage, Service and Breadcrumb structured-data graph for a FairLend service route. | Non-visual SEO infrastructure; non-visual; low | `src/components/SEO/FairlendRouteSeo.tsx` |
| `fairlend-talk-to-expert-cta` | cta | direct | production | Render the compact FairLend consultation action for human-assisted conversion. | FairLend shared money-page system; compact pill consultation action; medium | `src/components/FairlendTalkToExpertCta.tsx` |
| `feedback-page-checklist-section` | checklist | composer | production | Render a section introduction followed by a responsive checklist of decision or evidence items. | FairLend cream-and-forest editorial money page; section lead above checklist grid; medium | `virtual:fairlend-feedback-content-page` |
| `feedback-page-faq-section` | faq | composer | production | Render a visible-HTML question register inside a Feedback Page section without emitting FAQPage structured data. | FairLend cream-and-forest editorial money page; section lead above stacked questions and answers; medium | `virtual:fairlend-feedback-content-page` |
| `feedback-page-final-cta` | cta | composer | production | Close a Feedback Page with a dark evidence note and repeat the configured primary action. | FairLend cream-and-forest editorial money page; dark horizontal closing band; low | `virtual:fairlend-feedback-content-page` |
| `feedback-page-hero` | hero | composer | production | Render the configurable split hero embedded in FairlendFeedbackContentPage. | FairLend cream-and-forest editorial money page; large split copy and illustration; medium | `virtual:fairlend-feedback-content-page` |
| `feedback-page-panel-section` | content-grid | composer | production | Render a section introduction beside a responsive grid of titled explanatory panels. | FairLend cream-and-forest editorial money page; section lead beside card grid; medium | `virtual:fairlend-feedback-content-page` |
| `feedback-page-proof-strip` | proof | composer | production | Render compact proof statements beneath the Feedback Page hero illustration. | FairLend cream-and-forest editorial money page; responsive proof-card strip; medium | `virtual:fairlend-feedback-content-page` |
| `feedback-page-steps-section` | process | composer | production | Render numbered process, mechanism or capital-stack stages inside a Feedback Page section. | FairLend cream-and-forest editorial money page; section lead above numbered step grid; medium | `virtual:fairlend-feedback-content-page` |
| `feedback-page-table-section` | comparison | composer | production | Render an accessible comparison or evidence table with an optional disclosure note inside a Feedback Page section. | FairLend cream-and-forest editorial money page; section lead above bordered comparison table; medium | `virtual:fairlend-feedback-content-page` |
| `institutional-mortgage-decline-decoder` | problem | extract-first | production | Decode lender declines into specific policy, evidence, structure or timing responses. | Institutional mortgage policy-file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/institutional-mortgage/sections/DeclineDecoder.tsx` |
| `institutional-mortgage-fit-decision` | comparison | extract-first | production | Compare two financing routes across equivalent decision fields and close with a suitability principle. | Institutional mortgage policy-file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/institutional-mortgage/sections/FitDecision.tsx` |
| `institutional-mortgage-institutional-cover` | hero | extract-first | production | Open a mortgage money page with local imagery, qualification signals and embedded intake. | Institutional mortgage policy-file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/institutional-mortgage/sections/InstitutionalCover.tsx` |
| `institutional-mortgage-lender-fit-matrix` | qualification | extract-first | production | Explain a multi-factor underwriting decision through a structured evidence matrix. | Institutional mortgage policy-file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/institutional-mortgage/sections/LenderFitMatrix.tsx` |
| `institutional-mortgage-matching-route` | process | extract-first | production | Present a numbered route from file normalization through closing with a visual source-to-fit network. | Institutional mortgage policy-file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/institutional-mortgage/sections/MatchingRoute.tsx` |
| `institutional-mortgage-question-register` | faq | extract-first | production | Combine a late-stage CTA, disclaimer and accessible accordion FAQ. | Institutional mortgage policy-file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/institutional-mortgage/sections/QuestionRegister.tsx` |
| `institutional-mortgage-term-sheet` | comparison | extract-first | production | Explain the fields borrowers should compare in a financing commitment or term sheet. | Institutional mortgage policy-file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/institutional-mortgage/sections/TermSheet.tsx` |
| `private-mortgage-financing-cost-xray` | comparison | extract-first | production | Compare rushed financing against a transparent plan across complete cost and risk fields. | Private mortgage technical file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/private-mortgage-financing/sections/CostXray.tsx` |
| `private-mortgage-financing-cover-sheet` | hero | extract-first | production | Open an urgent mortgage page with decision questions, proof and embedded intake. | Private mortgage technical file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/private-mortgage-financing/sections/CoverSheet.tsx` |
| `private-mortgage-financing-exit-route` | process | extract-first | production | Map a financing process backward from maturity and make the exit path explicit. | Private mortgage technical file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/private-mortgage-financing/sections/ExitRoute.tsx` |
| `private-mortgage-financing-incident-board` | qualification | extract-first | production | Route visitors by the incident or constraint that forced the financing decision. | Private mortgage technical file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/private-mortgage-financing/sections/IncidentBoard.tsx` |
| `private-mortgage-financing-judgment-desk` | proof | extract-first | production | Show professional judgment, whole-file review inputs, local context and operating standards. | Private mortgage technical file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/private-mortgage-financing/sections/JudgmentDesk.tsx` |
| `private-mortgage-financing-question-register` | faq | extract-first | production | Resolve financing objections with an accessible question register and closing conversion path. | Private mortgage technical file dossier; route-specific structured evidence block; medium | `src/app/(frontend)/borrowers/private-mortgage-financing/sections/QuestionRegister.tsx` |

## Detailed interfaces

### Application CTA Form

- **ID:** `fairlend-application-cta`
- **Category / operation:** form / direct
- **Purpose:** Capture a lightweight application identifier and move a visitor into the established application flow.
- **Best for:** high-intent inline conversion; hero or route-reference application start
- **Slots:** label, placeholder, field name, action label, submit handler
- **Variants:** default, compact
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; single-field application CTA; inherited; medium density
- **Responsive:** Inline form collapses within the route-reference composition without changing the conversion intent.
- **Constraints:** None registered
- **Source:** `src/components/FairlendFinancingRouteReference/index.tsx` → `FairlendApplicationCta`
- **Detected call sites:** None detected

### Fairlend Borrower Consultation

- **ID:** `fairlend-borrower-consultation`
- **Category / operation:** cta / reference-only
- **Purpose:** Close a private-mortgage narrative with consultation conversion and deadline context.
- **Best for:** urgent consultation close; private-mortgage conversion
- **Slots:** fixed heading, fixed supporting copy, consultation CTA
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerConsultation/index.tsx` → `FairlendBorrowerConsultation`
- **Detected call sites:** None detected

### Borrower CTA

- **ID:** `fairlend-borrower-cta`
- **Category / operation:** cta / direct
- **Purpose:** Render the canonical FairLend money-page action with consistent link behaviour and hierarchy.
- **Best for:** primary conversion; secondary route navigation; inline text action
- **Slots:** label, href, anchor or Next Link props
- **Variants:** primary, secondary, text, large, medium, hide arrow
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; lime or outlined action button; inherited; medium density
- **Responsive:** Maintains a minimum touch target and permits wrapping only at the surrounding layout level.
- **Constraints:** None registered
- **Source:** `src/components/FairlendBorrowerCta/index.tsx` → `FairlendBorrowerCta`
- **Detected call sites:** `src/components/FairlendBorrowerConsultation/index.tsx`, `src/components/FairlendBorrowerProcess/index.tsx`, `src/components/FairlendBorrowerScenarios/index.tsx`, `src/components/FairlendBorrowerSolution/index.tsx`, `src/components/FairlendFeedbackContentPage/index.tsx`, `src/components/FairlendInvestorFinalCta/index.tsx`, `src/components/FairlendInvestorFit/index.tsx`, `src/components/FairlendInvestorManagedPlatform/index.tsx`, `src/components/FairlendInvestorOpportunities/index.tsx`, `src/components/FairlendInvestorProcess/index.tsx`, `src/components/FairlendPartnerProgram/index.tsx`

### Fairlend Borrower Differentiators

- **ID:** `fairlend-borrower-differentiators`
- **Category / operation:** comparison / reference-only
- **Purpose:** Explain the full economics and decision factors behind a private mortgage rather than presenting only rate.
- **Best for:** total-cost comparison; commercial objection handling
- **Slots:** fixed comparison axes, fixed explanatory copy
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerDifferentiators/index.tsx` → `FairlendBorrowerDifferentiators`
- **Detected call sites:** None detected

### Fairlend Borrower Faq

- **ID:** `fairlend-borrower-faq`
- **Category / operation:** faq / reference-only
- **Purpose:** Resolve private-mortgage objections through a dedicated accordion question register.
- **Best for:** private-mortgage FAQ; late-stage objection handling
- **Slots:** fixed question groups
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerFaq/index.tsx` → `FairlendBorrowerFaq`
- **Detected call sites:** None detected

### Fairlend Borrower Hero

- **ID:** `fairlend-borrower-hero`
- **Category / operation:** hero / reference-only
- **Purpose:** Open a deadline-driven private-mortgage page with embedded intake and decision proof.
- **Best for:** urgent borrower acquisition; private-mortgage lead capture
- **Slots:** fixed eyebrow, fixed heading, fixed proof signals, embedded intake
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerHero/index.tsx` → `FairlendBorrowerHero`
- **Detected call sites:** None detected

### Fairlend Borrower Problem

- **ID:** `fairlend-borrower-problem`
- **Category / operation:** problem / reference-only
- **Purpose:** Reframe a fast financing approval as insufficient without complete cost and exit clarity.
- **Best for:** risk agitation; cost-and-exit education
- **Slots:** fixed problem statement, fixed cost equation
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerProblem/index.tsx` → `FairlendBorrowerProblem`
- **Detected call sites:** None detected

### Fairlend Borrower Process

- **ID:** `fairlend-borrower-process`
- **Category / operation:** process / reference-only
- **Purpose:** Visualize the private-mortgage route from initial review through a credible exit.
- **Best for:** exit-first process; multi-stage mortgage explanation
- **Slots:** fixed process steps, fixed CTA
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerProcess/index.tsx` → `FairlendBorrowerProcess`
- **Detected call sites:** None detected

### Fairlend Borrower Scenarios

- **ID:** `fairlend-borrower-scenarios`
- **Category / operation:** qualification / reference-only
- **Purpose:** Route visitors through scenarios where private financing may fit.
- **Best for:** self-qualification; scenario routing
- **Slots:** fixed scenarios, fixed CTA
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerScenarios/index.tsx` → `FairlendBorrowerScenarios`
- **Detected call sites:** None detected

### Fairlend Borrower Solution

- **ID:** `fairlend-borrower-solution`
- **Category / operation:** solution / reference-only
- **Purpose:** Present private-mortgage structures around the borrower's next move and exit path.
- **Best for:** solution framing; product-route explanation
- **Slots:** fixed solution cards, fixed CTA
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerSolution/index.tsx` → `FairlendBorrowerSolution`
- **Detected call sites:** None detected

### Fairlend Borrower Trust Proof

- **ID:** `fairlend-borrower-trust-proof`
- **Category / operation:** proof / reference-only
- **Purpose:** Establish principal-broker judgment, local context and operating standards.
- **Best for:** expertise proof; regulated-service trust
- **Slots:** fixed reviewer proof, fixed standards
- **Variants:** —
- **Aesthetic:** FairLend private-mortgage conversion dossier; urgent but accountable; route-specific editorial conversion block; mixed; medium density
- **Responsive:** Responsive implementation exists, but must be verified outside its original private-mortgage composition.
- **Constraints:** Hard-coded private-mortgage copy and data.; No current production page call site was detected; use as a pattern unless extracted and parameterized.
- **Source:** `src/components/FairlendBorrowerTrustProof/index.tsx` → `FairlendBorrowerTrustProof`
- **Detected call sites:** None detected

### Fairlend Build Model Section

- **ID:** `fairlend-build-model-section`
- **Category / operation:** calculator / direct
- **Purpose:** Explain FairLend's build model and DrawFlow through an interactive technical financing dossier.
- **Best for:** DrawFlow mechanism; construction financing differentiation; builder economics
- **Slots:** embedded build-model states, DrawFlow comparison, sensitivity console
- **Variants:** full build-model introduction, start with DrawFlow
- **Aesthetic:** DrawFlow technical financing dossier; technical and evidentiary; scroll-driven model board and narrative; mixed; high density
- **Responsive:** Provides separate desktop board and mobile narrative states; preserve its motion leaf boundaries.
- **Constraints:** Content and claims are substantially embedded in the component.; Heavy visual block; use once per page and do not place beside another dominant interactive section.
- **Source:** `src/components/FairlendBuildModelSection/index.tsx` → `FairlendBuildModelSection`
- **Detected call sites:** `src/components/DrawflowIntake/DrawflowIntake.client.tsx`, `src/components/FairlendDeferredLandingSections.client.tsx`

### Fairlend Builder Consulting Section

- **ID:** `fairlend-builder-consulting-section`
- **Category / operation:** calculator / extend
- **Purpose:** Model builder/project economics through an editorial pro-forma and scenario timeline.
- **Best for:** development feasibility; builder consulting; project economics
- **Slots:** embedded project types, embedded years, equation variables, scenario explanations
- **Variants:** —
- **Aesthetic:** FairLend builder pro-forma workbook; analytical and advisory; scroll-driven equation workspace; mixed; high density
- **Responsive:** Existing responsive behaviour must be preserved while adding typed content slots or variants.
- **Constraints:** Large component with embedded data and bespoke motion; add typed scenario inputs before using different project copy.; Use once per page.
- **Source:** `src/components/FairlendBuilderConsultingSection/index.tsx` → `FairlendBuilderConsultingSection`
- **Detected call sites:** `src/components/FairlendDeferredLandingSections.client.tsx`

### Credibility Stats Strip

- **ID:** `fairlend-credibility-stats-strip`
- **Category / operation:** proof / direct
- **Purpose:** Show compact licence, turnaround, or capability proof beneath a financing-route composition.
- **Best for:** hero-adjacent trust; route proof
- **Slots:** icon and label statistics
- **Variants:** default supplied statistics, custom statistics
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; horizontal credibility strip; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/FairlendFinancingRouteReference/index.tsx` → `FairlendCredibilityStatsStrip`
- **Detected call sites:** None detected

### Fairlend Editorial Review

- **ID:** `fairlend-editorial-review`
- **Category / operation:** editorial / direct
- **Purpose:** Publish licensed reviewer identity, review date, methodology and primary sources for YMYL content.
- **Best for:** mortgage guidance; YMYL trust; source transparency
- **Slots:** date modified, methodology, primary sources, class name
- **Variants:** —
- **Aesthetic:** FairLend editorial evidence card; regulated, direct and technical; reviewer and source split; light; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/SEO/FairlendEditorialReview.tsx` → `FairlendEditorialReview`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`, `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`, `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`, `src/components/FairlendFeedbackContentPage/index.tsx`

### Fairlend Faq Section

- **ID:** `fairlend-faq-section`
- **Category / operation:** faq / extend
- **Purpose:** Render the global FairLend FAQ groups and their existing JSON-LD payload.
- **Best for:** global FAQ; homepage objection handling
- **Slots:** fixed global FAQ groups
- **Variants:** —
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; content-dependent shared block; inherited; medium density
- **Responsive:** Existing responsive behaviour must be preserved while adding typed content slots or variants.
- **Constraints:** FAQ content and JSON-LD are coupled to the global data module.; Add typed question groups and schema controls before using page-specific commercial FAQs.
- **Source:** `src/components/FairlendFaqSection/index.tsx` → `FairlendFaqSection`
- **Detected call sites:** `src/components/FairlendDeferredLandingSections.client.tsx`

### Fairlend Feedback Content Page

- **ID:** `fairlend-feedback-content-page`
- **Category / operation:** page-composer / composer
- **Purpose:** Assemble a static editorial money/service page from a typed hero, proof, answer, content-section, editorial and final-CTA configuration.
- **Best for:** SEO service pages; fast money-page assembly; server-rendered informational-commercial pages
- **Slots:** eyebrow, title, subtitle, image, primary CTA, secondary CTA, hero footer (supporting lines, CTA microcopy, text links, disclosures), proof items, geo answer, panel/checklist/steps/table/faq/custom-content sections, section anchors and inline section CTAs, editorial review, final note, final microcopy
- **Variants:** panels section, checklist section, steps section, table section, faq section, custom content section, section CTA with optional secondary, geo-answer comparison, editorial review, final CTA
- **Aesthetic:** FairLend cream-and-forest editorial money page; direct, evidence-led and local; large split hero followed by configurable editorial sections; light; medium density
- **Responsive:** Hero collapses to one column; proof, panel, checklist and steps grids reflow at their registered breakpoints; tables scroll horizontally below their minimum width.
- **Constraints:** Section bodies support typed panel, checklist, steps, table, faq and custom-content variants; choose the typed slot that matches the section contract before using the custom-content escape hatch.; The faq variant renders visible HTML only and never emits FAQPage structured data.; Use typed extensions for comparison, process, case-study or custom-section slots instead of escaping into duplicated page markup.
- **Source:** `src/components/FairlendFeedbackContentPage/index.tsx` → `FairlendFeedbackContentPage`
- **Detected call sites:** `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`, `src/app/(frontend)/construction-draw-financing/page.tsx`, `src/app/(frontend)/garden-suite-financing-gta/page.tsx`, `src/app/(frontend)/garden-suite/page.tsx`, `src/app/(frontend)/multiplex-financing-gta/page.tsx`

### Financing Route Copy Panel

- **ID:** `fairlend-financing-route-copy-panel`
- **Category / operation:** solution / direct
- **Purpose:** Present route-specific positioning, explanatory copy and an optional application CTA inside the financing-route system.
- **Best for:** financing-route explanation; hero or high-intent solution framing
- **Slots:** eyebrow, title, subtitle, description, application CTA
- **Variants:** —
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; editorial copy panel; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/FairlendFinancingRouteReference/index.tsx` → `FairlendFinancingRouteCopyPanel`
- **Detected call sites:** None detected

### Financing Route Header

- **ID:** `fairlend-financing-route-header`
- **Category / operation:** page-shell / direct
- **Purpose:** Render the indexed system header and descriptor for a financing-route block.
- **Best for:** numbered financing-route sections; technical page-system continuity
- **Slots:** index, section label, step label, brand, descriptor
- **Variants:** —
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; technical ledger header; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/FairlendFinancingRouteReference/index.tsx` → `FairlendFinancingRouteHeader`
- **Detected call sites:** None detected

### Financing Route Reference

- **ID:** `fairlend-financing-route-reference`
- **Category / operation:** hero / direct
- **Purpose:** Compose a financing-route hero/feature from header, copy, illustration, inline application CTA and credibility proof.
- **Best for:** money-page hero; financing route introduction; high-intent conversion
- **Slots:** illustration, header props, copy panel props, inline CTA props, credibility statistics
- **Variants:** with inline CTA, without inline CTA, custom illustration class
- **Aesthetic:** FairLend financing-route technical editorial; confident and technical; split copy and illustration with evidence footer; light; medium density
- **Responsive:** Split composition stacks while the inline CTA and credibility strip adapt at registered breakpoints.
- **Constraints:** None registered
- **Source:** `src/components/FairlendFinancingRouteReference/index.tsx` → `FairlendFinancingRouteReference`
- **Detected call sites:** None detected

### GEO Answer Block

- **ID:** `fairlend-geo-answer-block`
- **Category / operation:** answer / direct
- **Purpose:** Publish an answer-first, citation-ready passage with an optional accessible comparison table.
- **Best for:** featured-snippet answer; AI citation passage; definition and comparison
- **Slots:** eyebrow, question, answer, comparison caption, comparison columns, comparison rows
- **Variants:** answer only, answer with comparison
- **Aesthetic:** FairLend editorial evidence card; regulated, direct and technical; answer passage with optional table; light; medium density
- **Responsive:** Text remains fluid; comparison table becomes horizontally scrollable below its minimum width.
- **Constraints:** None registered
- **Source:** `src/components/SEO/FairlendGeoAnswerBlock.tsx` → `FairlendGeoAnswerBlock`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`, `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`, `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`, `src/components/FairlendFeedbackContentPage/index.tsx`

### Inline Application CTA

- **ID:** `fairlend-inline-application-cta`
- **Category / operation:** form / direct
- **Purpose:** Place the compact application CTA over or beside a route illustration at large breakpoints.
- **Best for:** hero illustration conversion; desktop inline application start
- **Slots:** application CTA props, class name
- **Variants:** —
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; compact floating application form; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** Designed as a supporting route-reference element; ensure a mobile conversion path remains visible.
- **Source:** `src/components/FairlendFinancingRouteReference/index.tsx` → `FairlendInlineApplicationCta`
- **Detected call sites:** None detected

### Landing Rail

- **ID:** `fairlend-landing-rail`
- **Category / operation:** page-shell / direct
- **Purpose:** Provide the canonical FairLend framed page canvas, side gutters and selectable texture.
- **Best for:** full money-page shell; editorial financing dossiers
- **Slots:** children, wrapper class, content class, gutter texture
- **Variants:** fabric-of-squares, grid-noise, inflicted, debut-light, groovepaper
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; framed full-page content rail; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/FairlendLandingRail/index.tsx` → `FairlendLandingRail`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`, `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`, `src/app/(frontend)/contact/page.tsx`, `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`, `src/app/(frontend)/partners/page.tsx`, `src/app/(frontend)/posts/[slug]/page.tsx`, `src/app/(frontend)/posts/error.tsx`, `src/app/(frontend)/posts/loading.tsx`, `src/app/(frontend)/posts/page.tsx`, `src/app/(frontend)/posts/page/[pageNumber]/page.tsx`, `src/app/(home)/page.tsx`, `src/blocks/MoneyPage/Component.tsx`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx`, `src/components/FairlendDeferredLandingSections.client.tsx`, `src/components/FairlendJournalArchive/index.tsx`

### Lead Intake

- **ID:** `fairlend-lead-intake`
- **Category / operation:** form / direct
- **Purpose:** Run the established FairLend lead-intake workflow with intent, product, source and page/hero variants.
- **Best for:** mortgage lead capture; construction/build intake; investor intake; contact conversion
- **Slots:** intent override, source override, mortgage product, mortgage variant, investor variant, rental transaction
- **Variants:** page, hero, private mortgage, institutional mortgage, residential mortgage, rental property, build, invest, contact
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; progressive conversion form; inherited; medium density
- **Responsive:** Client-side wizard and standard forms adapt to their container; preserve existing field, error and consent behaviour.
- **Constraints:** Client component with sensitive-data and analytics controls; never fork or duplicate the intake implementation.; Wrap with Suspense where the existing call pattern requires search parameters.
- **Source:** `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx` → `FairlendLeadIntake`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/InstitutionalCover.tsx`, `src/app/(frontend)/borrowers/private-mortgage-financing/sections/CoverSheet.tsx`, `src/components/FairlendBorrowerHero/index.tsx`, `src/components/FairlendInvestorHero/index.tsx`, `src/components/FairlendLeadIntake/FairlendIntakeRouter.client.tsx`

### Registration Disclosure

- **ID:** `fairlend-registration-disclosure`
- **Category / operation:** proof / direct
- **Purpose:** Render FairLend's authorized legal name and licence disclosure consistently.
- **Best for:** hero licence disclosure; contact disclosure; full regulatory disclosure
- **Slots:** variant, class name, HTML section attributes
- **Variants:** hero, contact, full
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; compact legal disclosure; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/FairlendRegistrationDisclosure.tsx` → `FairlendRegistrationDisclosure`
- **Detected call sites:** `src/app/(frontend)/disclosures/page.tsx`, `src/app/(frontend)/garden-suite-financing-gta/page.tsx`, `src/components/ContactPage/ContactComplianceSection.tsx`

### Section Transition

- **ID:** `fairlend-section-transition`
- **Category / operation:** transition / direct
- **Purpose:** Create a controlled visual buffer between incompatible light FairLend section surfaces.
- **Best for:** cross-family section transition; spacing and gradient handoff
- **Slots:** size, class name, HTML div attributes
- **Variants:** comfortable, spacious
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; decorative gradient spacer; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/FairlendSectionTransition.tsx` → `FairlendSectionTransition`
- **Detected call sites:** `src/components/FairlendOpportunityCanvas/index.tsx`

### Service SEO Graph

- **ID:** `fairlend-service-seo`
- **Category / operation:** seo / direct
- **Purpose:** Render the canonical WebPage, Service and Breadcrumb structured-data graph for a FairLend service route.
- **Best for:** mortgage service page schema; money-page structured data
- **Slots:** name, description, path, service type, date modified, principal-broker review flag, breadcrumb trail override
- **Variants:** with reviewer, without reviewer
- **Aesthetic:** Non-visual SEO infrastructure; structured data; non-visual; transparent; low density
- **Responsive:** Non-visual server-rendered JSON-LD.
- **Constraints:** None registered
- **Source:** `src/components/SEO/FairlendRouteSeo.tsx` → `FairlendServiceSeo`
- **Detected call sites:** `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`, `src/app/(frontend)/booking/[bookingtype]/page.tsx`, `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`, `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`, `src/app/(frontend)/construction-draw-financing/page.tsx`, `src/app/(frontend)/garden-suite-financing-gta/page.tsx`, `src/app/(frontend)/garden-suite/page.tsx`, `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`, `src/app/(frontend)/multiplex-financing-gta/page.tsx`, `src/app/(frontend)/partners/page.tsx`

### Talk-to-Expert CTA

- **ID:** `fairlend-talk-to-expert-cta`
- **Category / operation:** cta / direct
- **Purpose:** Render the compact FairLend consultation action for human-assisted conversion.
- **Best for:** secondary consultation CTA; expert escalation
- **Slots:** eyebrow, label, href, link attributes
- **Variants:** —
- **Aesthetic:** FairLend shared money-page system; regulated, direct and technical; compact pill consultation action; inherited; medium density
- **Responsive:** Responsive behaviour is contained by the shared component and its documented variants.
- **Constraints:** None registered
- **Source:** `src/components/FairlendTalkToExpertCta.tsx` → `FairlendTalkToExpertCta`
- **Detected call sites:** `src/Header/Component.client.tsx`, `src/components/FairlendLandingHero/index.tsx`, `src/components/directional-hover-header/header.tsx`

### Feedback Page Checklist Section

- **ID:** `feedback-page-checklist-section`
- **Category / operation:** checklist / composer
- **Purpose:** Render a section introduction followed by a responsive checklist of decision or evidence items.
- **Best for:** document requirements; qualification checklist; failure modes; readiness signals
- **Slots:** kicker, title, body, checklist items
- **Variants:** one to three-column checklist
- **Aesthetic:** FairLend cream-and-forest editorial money page; practical and scannable; section lead above checklist grid; light; medium density
- **Responsive:** Checklist reflows from one to three columns with consistent item height and icon treatment.
- **Constraints:** Embedded capability; items do not currently support per-item title/body pairs.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Feedback Page FAQ Section

- **ID:** `feedback-page-faq-section`
- **Category / operation:** faq / composer
- **Purpose:** Render a visible-HTML question register inside a Feedback Page section without emitting FAQPage structured data.
- **Best for:** commercial money-page FAQs; visible objection handling
- **Slots:** kicker, title, question, answer
- **Variants:** visible question list
- **Aesthetic:** FairLend cream-and-forest editorial money page; direct and accountable; section lead above stacked questions and answers; light; medium density
- **Responsive:** Questions and answers stack full width at all breakpoints.
- **Constraints:** Embedded capability; never emits FAQPage markup; answers must stay visible HTML.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Feedback Page Final CTA

- **ID:** `feedback-page-final-cta`
- **Category / operation:** cta / composer
- **Purpose:** Close a Feedback Page with a dark evidence note and repeat the configured primary action.
- **Best for:** final conversion; risk-reversal close
- **Slots:** final note, final microcopy, primary CTA
- **Variants:** CTA, decorative arrow when no CTA exists
- **Aesthetic:** FairLend cream-and-forest editorial money page; decisive and accountable; dark horizontal closing band; dark; low density
- **Responsive:** Copy and action stack on small screens and align horizontally when space permits.
- **Constraints:** Embedded capability and tied to the parent primary CTA label/href.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Feedback Page Hero

- **ID:** `feedback-page-hero`
- **Category / operation:** hero / composer
- **Purpose:** Render the configurable split hero embedded in FairlendFeedbackContentPage.
- **Best for:** SEO money-page hero; service-page introduction
- **Slots:** eyebrow, title, subtitle, image, primary CTA, secondary CTA, hero footer, proof strip
- **Variants:** with or without either CTA, with or without proof
- **Aesthetic:** FairLend cream-and-forest editorial money page; direct and evidence-led; large split copy and illustration; light; medium density
- **Responsive:** Two-column hero stacks on smaller viewports; proof changes from rail to grid.
- **Constraints:** Embedded capability; use through FairlendFeedbackContentPage or extract while preserving all five parent call sites.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Feedback Page Panel Section

- **ID:** `feedback-page-panel-section`
- **Category / operation:** content-grid / composer
- **Purpose:** Render a section introduction beside a responsive grid of titled explanatory panels.
- **Best for:** features; audiences; evidence categories; solution pillars
- **Slots:** kicker, title, body, panel title, panel body, panel items
- **Variants:** two or three-column panel grid
- **Aesthetic:** FairLend cream-and-forest editorial money page; structured and explanatory; section lead beside card grid; light; medium density
- **Responsive:** Lead and panel grid stack; panels reflow from one to three columns.
- **Constraints:** Embedded capability; panel body typography assumes short explanatory copy.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Feedback Page Proof Strip

- **ID:** `feedback-page-proof-strip`
- **Category / operation:** proof / composer
- **Purpose:** Render compact proof statements beneath the Feedback Page hero illustration.
- **Best for:** hero proof; product claims; qualification signals
- **Slots:** proof items
- **Variants:** one or more proof items
- **Aesthetic:** FairLend cream-and-forest editorial money page; compact and declarative; responsive proof-card strip; light; medium density
- **Responsive:** Proof items reflow between one and three columns according to the parent breakpoints.
- **Constraints:** Embedded in the parent hero and not independently exportable.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Feedback Page Steps Section

- **ID:** `feedback-page-steps-section`
- **Category / operation:** process / composer
- **Purpose:** Render numbered process, mechanism or capital-stack stages inside a Feedback Page section.
- **Best for:** process timelines; product mechanism stages; ordered capital or evidence stacks
- **Slots:** kicker, title, body, step title, step body
- **Variants:** one or two-column numbered step grid
- **Aesthetic:** FairLend cream-and-forest editorial money page; ordered and instructional; section lead above numbered step grid; light; medium density
- **Responsive:** Step grid reflows from one to two columns with stable numeral and title treatment.
- **Constraints:** Embedded capability; steps reuse the panel title/body shape with automatic numbering.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Feedback Page Table Section

- **ID:** `feedback-page-table-section`
- **Category / operation:** comparison / composer
- **Purpose:** Render an accessible comparison or evidence table with an optional disclosure note inside a Feedback Page section.
- **Best for:** financing-route comparison; worked proof comparisons; methodology and disclosure display
- **Slots:** kicker, title, body, table anchor id, caption, label header, columns, rows, disclosure note
- **Variants:** comparison table with optional note
- **Aesthetic:** FairLend cream-and-forest editorial money page; evidentiary and technical; section lead above bordered comparison table; light; medium density
- **Responsive:** Table scrolls horizontally below its minimum width; the note stays inline below.
- **Constraints:** Embedded capability; publish claim disclosures in the note slot directly below the table.
- **Source:** `virtual:fairlend-feedback-content-page` → `embedded capability`
- **Detected call sites:** None detected

### Decline Decoder

- **ID:** `institutional-mortgage-decline-decoder`
- **Category / operation:** problem / extract-first
- **Purpose:** Decode lender declines into specific policy, evidence, structure or timing responses.
- **Best for:** decline recovery; diagnostic objection handling
- **Slots:** heading, introduction, diagnostic findings, responses
- **Variants:** —
- **Aesthetic:** Institutional mortgage policy-file dossier; analytical and policy-led; route-specific structured evidence block; light; medium density
- **Responsive:** Uses the institutional route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to institutional-mortgage.css through im-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the institutional route call site.
- **Source:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/DeclineDecoder.tsx` → `DeclineDecoder`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`

### Fit Decision

- **ID:** `institutional-mortgage-fit-decision`
- **Category / operation:** comparison / extract-first
- **Purpose:** Compare two financing routes across equivalent decision fields and close with a suitability principle.
- **Best for:** route comparison; commercial investigation
- **Slots:** heading, introduction, comparison columns, comparison rows, decision note
- **Variants:** —
- **Aesthetic:** Institutional mortgage policy-file dossier; analytical and policy-led; route-specific structured evidence block; light; medium density
- **Responsive:** Uses the institutional route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to institutional-mortgage.css through im-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the institutional route call site.
- **Source:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/FitDecision.tsx` → `FitDecision`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`

### Institutional Cover

- **ID:** `institutional-mortgage-institutional-cover`
- **Category / operation:** hero / extract-first
- **Purpose:** Open a mortgage money page with local imagery, qualification signals and embedded intake.
- **Best for:** mortgage money-page hero; hero intake conversion
- **Slots:** breadcrumb label, heading, lede, proof signals, skip link, embedded intake
- **Variants:** —
- **Aesthetic:** Institutional mortgage policy-file dossier; analytical and policy-led; route-specific structured evidence block; light; medium density
- **Responsive:** Uses the institutional route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to institutional-mortgage.css through im-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the institutional route call site.
- **Source:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/InstitutionalCover.tsx` → `InstitutionalCover`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`

### Lender Fit Matrix

- **ID:** `institutional-mortgage-lender-fit-matrix`
- **Category / operation:** qualification / extract-first
- **Purpose:** Explain a multi-factor underwriting decision through a structured evidence matrix.
- **Best for:** lender criteria; project qualification; evidence requirements
- **Slots:** heading, introduction, factor cells, evidence labels, annotation
- **Variants:** —
- **Aesthetic:** Institutional mortgage policy-file dossier; analytical and policy-led; route-specific structured evidence block; light; medium density
- **Responsive:** Uses the institutional route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to institutional-mortgage.css through im-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the institutional route call site.
- **Source:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/LenderFitMatrix.tsx` → `LenderFitMatrix`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`

### Matching Route

- **ID:** `institutional-mortgage-matching-route`
- **Category / operation:** process / extract-first
- **Purpose:** Present a numbered route from file normalization through closing with a visual source-to-fit network.
- **Best for:** mortgage process; evidence-to-decision sequence
- **Slots:** heading, introduction, ordered steps, network labels
- **Variants:** —
- **Aesthetic:** Institutional mortgage policy-file dossier; analytical and policy-led; route-specific structured evidence block; light; medium density
- **Responsive:** Uses the institutional route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to institutional-mortgage.css through im-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the institutional route call site.
- **Source:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/MatchingRoute.tsx` → `MatchingRoute`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`

### Institutional Question Register

- **ID:** `institutional-mortgage-question-register`
- **Category / operation:** faq / extract-first
- **Purpose:** Combine a late-stage CTA, disclaimer and accessible accordion FAQ.
- **Best for:** money-page FAQ; late-stage conversion and objections
- **Slots:** heading, introduction, CTA, disclaimer, questions and answers
- **Variants:** —
- **Aesthetic:** Institutional mortgage policy-file dossier; analytical and policy-led; route-specific structured evidence block; light; medium density
- **Responsive:** Uses the institutional route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to institutional-mortgage.css through im-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the institutional route call site.
- **Source:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/QuestionRegister.tsx` → `QuestionRegister`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`, `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

### Term Sheet

- **ID:** `institutional-mortgage-term-sheet`
- **Category / operation:** comparison / extract-first
- **Purpose:** Explain the fields borrowers should compare in a financing commitment or term sheet.
- **Best for:** offer comparison; cost and condition education
- **Slots:** eyebrow, heading, introduction, term rows, closing principle
- **Variants:** —
- **Aesthetic:** Institutional mortgage policy-file dossier; analytical and policy-led; route-specific structured evidence block; light; medium density
- **Responsive:** Uses the institutional route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to institutional-mortgage.css through im-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the institutional route call site.
- **Source:** `src/app/(frontend)/borrowers/institutional-mortgage/sections/TermSheet.tsx` → `TermSheet`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`

### Cost Xray

- **ID:** `private-mortgage-financing-cost-xray`
- **Category / operation:** comparison / extract-first
- **Purpose:** Compare rushed financing against a transparent plan across complete cost and risk fields.
- **Best for:** total-cost comparison; risk disclosure; alternative comparison
- **Slots:** heading, introduction, cost equation, comparison rows, closing note
- **Variants:** —
- **Aesthetic:** Private mortgage technical file dossier; urgent, candid and risk-aware; route-specific structured evidence block; mixed; medium density
- **Responsive:** Uses the private-mortgage route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to private-mortgage-financing.css through pm-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the private-mortgage route call site.
- **Source:** `src/app/(frontend)/borrowers/private-mortgage-financing/sections/CostXray.tsx` → `CostXray`
- **Detected call sites:** `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

### Private Mortgage Cover Sheet

- **ID:** `private-mortgage-financing-cover-sheet`
- **Category / operation:** hero / extract-first
- **Purpose:** Open an urgent mortgage page with decision questions, proof and embedded intake.
- **Best for:** high-intent mortgage hero; deadline-driven intake
- **Slots:** breadcrumb label, heading, lede, decision questions, proof points, embedded intake
- **Variants:** —
- **Aesthetic:** Private mortgage technical file dossier; urgent, candid and risk-aware; route-specific structured evidence block; mixed; medium density
- **Responsive:** Uses the private-mortgage route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to private-mortgage-financing.css through pm-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the private-mortgage route call site.
- **Source:** `src/app/(frontend)/borrowers/private-mortgage-financing/sections/CoverSheet.tsx` → `CoverSheet`
- **Detected call sites:** `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

### Exit Route

- **ID:** `private-mortgage-financing-exit-route`
- **Category / operation:** process / extract-first
- **Purpose:** Map a financing process backward from maturity and make the exit path explicit.
- **Best for:** exit-first financing process; construction takeout path
- **Slots:** eyebrow, heading, introduction, ordered process steps, exit options, closing note
- **Variants:** —
- **Aesthetic:** Private mortgage technical file dossier; urgent, candid and risk-aware; route-specific structured evidence block; mixed; medium density
- **Responsive:** Uses the private-mortgage route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to private-mortgage-financing.css through pm-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the private-mortgage route call site.
- **Source:** `src/app/(frontend)/borrowers/private-mortgage-financing/sections/ExitRoute.tsx` → `ExitRoute`
- **Detected call sites:** `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

### Incident Board

- **ID:** `private-mortgage-financing-incident-board`
- **Category / operation:** qualification / extract-first
- **Purpose:** Route visitors by the incident or constraint that forced the financing decision.
- **Best for:** scenario self-identification; urgent file routing
- **Slots:** heading, introduction, scenario cards, review inputs
- **Variants:** —
- **Aesthetic:** Private mortgage technical file dossier; urgent, candid and risk-aware; route-specific structured evidence block; mixed; medium density
- **Responsive:** Uses the private-mortgage route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to private-mortgage-financing.css through pm-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the private-mortgage route call site.
- **Source:** `src/app/(frontend)/borrowers/private-mortgage-financing/sections/IncidentBoard.tsx` → `IncidentBoard`
- **Detected call sites:** `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

### Judgment Desk

- **ID:** `private-mortgage-financing-judgment-desk`
- **Category / operation:** proof / extract-first
- **Purpose:** Show professional judgment, whole-file review inputs, local context and operating standards.
- **Best for:** expertise proof; review methodology; local service trust
- **Slots:** heading, expert copy, review register, local proof, operating standards
- **Variants:** —
- **Aesthetic:** Private mortgage technical file dossier; urgent, candid and risk-aware; route-specific structured evidence block; mixed; medium density
- **Responsive:** Uses the private-mortgage route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to private-mortgage-financing.css through pm-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the private-mortgage route call site.
- **Source:** `src/app/(frontend)/borrowers/private-mortgage-financing/sections/JudgmentDesk.tsx` → `JudgmentDesk`
- **Detected call sites:** `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

### Private Mortgage Question Register

- **ID:** `private-mortgage-financing-question-register`
- **Category / operation:** faq / extract-first
- **Purpose:** Resolve financing objections with an accessible question register and closing conversion path.
- **Best for:** money-page FAQ; risk and suitability objections
- **Slots:** heading, introduction, questions and answers, CTA, disclaimer
- **Variants:** —
- **Aesthetic:** Private mortgage technical file dossier; urgent, candid and risk-aware; route-specific structured evidence block; mixed; medium density
- **Responsive:** Uses the private-mortgage route's explicit desktop-to-mobile CSS composition.
- **Constraints:** Coupled to private-mortgage-financing.css through pm-* selectors.; Content is imported from the route-local data module or hard-coded in the block.; Extract styles and typed data before reuse; preserve the private-mortgage route call site.
- **Source:** `src/app/(frontend)/borrowers/private-mortgage-financing/sections/QuestionRegister.tsx` → `QuestionRegister`
- **Detected call sites:** `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`, `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

