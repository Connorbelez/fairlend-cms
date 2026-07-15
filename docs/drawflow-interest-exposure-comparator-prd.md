# DrawFlow Interest Exposure Comparator and Case Generator PRD

**Product:** FairLend + DrawFlow  
**Module:** Construction financing comparison, case-study generation, lead follow-up, and self-serve calculator  
**Status:** Draft for product, compliance, and engineering review  
**Created:** July 15, 2026  
**Primary audience:** Product, engineering, growth, brokerage operations, and compliance  
**Working public name:** DrawFlow Cost Comparison  
**Working internal name:** DrawFlow Savings Case Generator  

**Related implementation sources:**

- `/Users/connor/Dev/drawFlow/docs/draw_flow_prd.md`
- `/Users/connor/Dev/drawFlow/v1/drawflowv1/src/features/timeline-workspace/-timeline-milestone-schedule.ts`
- `/Users/connor/Dev/drawFlow/v1/drawflowv1/src/features/timeline-workspace/-TimelineSetupFlow.tsx`
- `/Users/connor/Dev/drawFlow/v1/drawflowv1/src/features/timeline-workspace/-timeline-draw-optimizer.ts`
- `/Users/connor/Dev/drawFlow/v1/drawflowv1/src/features/timeline-workspace/-timeline-share-snapshot.ts`
- `/Users/connor/Dev/drawFlow/v1/drawflowv1/src/features/timeline-workspace/TimelineWorkspace.tsx`
- `/Users/connor/Dev/drawFlow/v1/drawflowv1/convex/schema.ts`
- `src/calculators/catalog.ts`
- `src/calculators/engine-construction.ts`
- `docs/twenty-crm.md`
- `docs/intake-partial-submission.md`
- `docs/qr-campaign-attribution.md`

---

## 1. Executive Summary

FairLend should build one versioned comparison engine that models the same construction project under two draw strategies:

1. a conventional three-draw schedule; and
2. a DrawFlow milestone-based schedule optimized around completed work, eligible reimbursement, working capital, draw fees, and interest carry.

The engine will power three product surfaces:

- an internal case generator that turns approved, anonymized historical builds into evidence-rich partner and borrower case studies;
- an automated, personalized comparison delivered after a qualified website lead submits project inputs; and
- a public calculator where a prospect selects project type, budget, timeline, financing assumptions, and working capital to compare the two schedules interactively.

Each comparison will show a paired construction timeline with draw overlays, interest-bearing principal over time, cumulative interest exposure, cash-on-hand or unreimbursed-cost exposure, a draw schedule, and a concise summary of modeled differences. The output must be reproducible from an immutable input snapshot and calculation-engine version.

This product must not present a hypothetical projection as guaranteed savings. Public language will use **modeled interest difference**, **modeled financing-cost difference**, or **modeled interest avoided under the stated assumptions**. Every published output must expose its material assumptions and pass calculation, anonymization, and compliance gates.

---

## 2. Problem and Opportunity

### 2.1 The communication problem

DrawFlow's value is temporal. A borrower does not pay interest on the approved facility in the abstract; interest exposure changes as funds are released over a construction timeline. A static claim such as “save on interest” does not make the mechanism understandable or credible.

Builders, brokers, architects, designers, project managers, investor communities, and podcast audiences need to see:

- when project costs occur;
- when completed work becomes eligible for reimbursement;
- when each draw is released;
- how released principal accumulates interest;
- how much borrower cash is tied up between draws; and
- how draw frequency trades lower interest carry against additional draw fees.

### 2.2 The acquisition opportunity

FairLend already receives project type, budget, timing, and contact data through acquisition surfaces. The same comparison can serve as:

- a high-specificity partner outreach asset;
- proof material during a sales conversation;
- an immediate value exchange after lead submission;
- a self-qualification tool for prospects; and
- a structured bridge from FairLend marketing into a DrawFlow proposal.

### 2.3 Why one engine matters

The historical case study, email result, and public calculator must not implement separate financial logic. Separate implementations would create irreconcilable totals, unsupported marketing claims, and audit risk. DrawFlow V1 already contains the schedule, cashflow, snapshot, and optimizer primitives. This initiative productizes those primitives behind a stable comparison contract and reuses them everywhere.

---

## 3. Product Principles and Non-Negotiable Decisions

1. **One project, two strategies.** A comparison holds project scope and common financing assumptions constant and changes the draw strategy only, unless the output explicitly labels another changed variable.
2. **DrawFlow is the calculation authority.** FairLend CMS consumes a shared DrawFlow comparison service or package. It does not reproduce draw or interest formulas.
3. **Interest starts after release.** Approved or unlocked capacity is not interest-bearing principal.
4. **Reimbursement-only modeling.** Work is completed and evidenced before it becomes eligible for reimbursement, followed by review and release lag.
5. **Working capital is separate from lender draw policy.** Borrower cash availability and lender draw limits must never be conflated.
6. **The baseline must be credible.** The conventional schedule cannot be intentionally weakened to manufacture a favorable result.
7. **Total cost accompanies interest.** Results show interest, draw fees, and total modeled financing cost because more frequent draws can reduce interest while increasing fees.
8. **Infeasibility is a result, not an error.** If a three-draw schedule requires more borrower cash than supplied, the product reports the shortfall and cash required to make it feasible. It must not silently inject cash.
9. **No guaranteed-savings claim.** Projections are conditional on disclosed inputs and assumptions.
10. **No silent production defaults.** Demo values such as a 9.25% annual rate, $500 draw fee, eight-day review lag, or $400,000 starting cash may be offered as editable examples but cannot be applied invisibly.
11. **Every result is reproducible.** Store normalized inputs, calculation outputs, engine version, policy version, input hash, timestamp, and rendering version.
12. **Published historical cases are immutable.** Editing a case creates a new revision. It never changes the evidence behind an already distributed asset.
13. **Anonymization precedes rendering.** Sensitive source fields must not reach screenshots, PDFs, URLs, analytics, email markup, or public result payloads.
14. **Calculation and claim review are separate.** A mathematically valid output may still be unsuitable for public promotion.
15. **Reuse the real timeline.** Visual assets should render the same DrawFlow timeline and chart components, or a shared presentation layer extracted from them, instead of rebuilding approximations for marketing.

---

## 4. Goals and Non-Goals

### 4.1 Goals

- Quantify and explain the effect of draw timing on interest exposure and borrower working-capital requirements.
- Produce approved, anonymized case-study assets from real or modeled builds in a repeatable workflow.
- Generate a useful personalized result immediately after a qualified lead submits enough project information.
- Let self-serve prospects compare a conventional three-draw strategy with DrawFlow using understandable inputs.
- Give partners a co-brandable, campaign-attributed asset they can share without exposing private borrower or project information.
- Create a direct, consent-aware handoff from comparison result to FairLend consultation, DrawFlow proposal, and CRM follow-up.
- Produce deterministic, audit-ready calculations and artifacts.

### 4.2 Non-Goals

- Quoting or committing to a loan, approval, rate, term, advance, or draw authorization.
- Replacing underwriting, quantity surveying, site inspection, evidence review, or lender approval.
- Claiming the DrawFlow schedule is universally cheaper or feasible.
- Predicting future construction costs or completion dates without user-supplied or explicitly disclosed template assumptions.
- Exposing identifiable historical borrower, property, contractor, lender, address, or document data.
- Turning the marketing calculator into a live construction draw administration system.
- Mutating the source build, proposal, budget, or production timeline when generating a case.
- Sending an automatically generated historical case externally before its review gates are complete.

---

## 5. Personas and Primary Jobs

### 5.1 FairLend growth or brokerage operator

**Job:** Select a representative build, create a defensible comparison, approve the narrative, and send a relevant asset to a partner or prospect.

### 5.2 Builder or developer

**Job:** Understand whether draw timing reduces financing carry or working-capital strain on a specific kind of build.

### 5.3 Early-file professional

Includes architects, designers, planners, permit consultants, project managers, estimators, general contractors, accountants, lawyers, mortgage brokers, and real-estate professionals.

**Job:** See a credible example they can use to recognize and refer a suitable client before financing and draw structure are fixed.

### 5.4 Investor-community or media partner

Includes podcasts, meetups, investor groups, newsletters, and trade-show organizers.

**Job:** Share an educational, data-backed example or calculator that is valuable to the audience and attributable to the partner.

### 5.5 FairLend website lead

**Job:** Receive an immediate, personalized explanation of how project type, timing, budget, rate, and draw schedule affect modeled financing cost.

### 5.6 Compliance or approving broker

**Job:** Verify assumptions, claims, anonymization, disclosures, and publication scope before a case becomes externally accessible.

---

## 6. Terminology

| Term | Definition |
|---|---|
| Comparison | A single normalized project modeled under a baseline strategy and a DrawFlow strategy. |
| Baseline | A disclosed conventional three-draw schedule, either policy-generated or supplied from an actual known schedule. |
| DrawFlow strategy | A milestone-based schedule generated by the versioned DrawFlow optimizer or approved manual schedule. |
| Eligible capacity | Completed, evidenced, and policy-eligible costs available for reimbursement before lender review and release. |
| Released principal | Funds actually advanced. This is the interest-bearing balance, subject to the configured interest treatment. |
| Working capital | Borrower cash available to fund project costs before reimbursement. |
| Peak unreimbursed exposure | Maximum cumulative eligible project spend not yet reimbursed at any point in the modeled timeline. |
| Modeled interest difference | Baseline modeled interest less DrawFlow modeled interest. Positive is favorable to DrawFlow. |
| Modeled financing-cost difference | Baseline interest and scenario-specific fees less DrawFlow interest and scenario-specific fees. |
| Historical case | A comparison derived from an authorized real project and anonymized before publication. |
| Modeled case | A comparison created from a project template or prospect inputs, not represented as an observed historical outcome. |
| Case revision | Immutable normalized input, calculation output, narrative, and artifact set for one approved case version. |
| Horizon | The common date through which both strategies accrue interest, normally takeout, repayment, sale, or an explicitly stated post-completion date. |

---

## 7. Product Surfaces

### 7.1 Internal Case Studio

An authenticated workflow for FairLend staff to:

- select an authorized build/proposal snapshot, normalized budget import, or template;
- configure and reconcile project and financing assumptions;
- preview baseline and DrawFlow schedules;
- run validation and sensitivities;
- inspect redacted source fields;
- author a restrained case narrative;
- route the case through review;
- generate versioned web, image, and PDF assets;
- assign a campaign, partner, audience, and expiry; and
- revoke or archive public access without deleting the audit record.

### 7.2 Personalized Lead Follow-Up

After an eligible lead form submission:

1. persist the lead and consent state first;
2. determine whether inputs meet the minimum calculation contract;
3. enqueue comparison generation asynchronously;
4. show an immediate confirmation and send a receipt even if rendering is still in progress;
5. generate a personalized modeled result from declared inputs and disclosed defaults;
6. email a secure result link when ready;
7. create CRM activities for generation, delivery, result view, CTA, and errors; and
8. provide the assigned human a concise assumptions-and-opportunity summary.

This surface uses prospect inputs or templates. It must not automatically match a lead to an identifiable historical case.

### 7.3 Public Calculator

A guided calculator using the same comparison engine. The minimum first release asks for:

- project type;
- construction budget;
- planned start and duration, or start and completion dates;
- annual interest rate;
- per-draw fee;
- available borrower working capital; and
- optional expected takeout or repayment date.

Advanced inputs expose milestone allocation, review lag, reserve, co-pay or reimbursement ratio, holdback, payment timing, draw policy, compounding treatment, and known baseline draw dates.

The calculator provides useful on-screen results without requiring contact details. Saving, emailing, sharing, or requesting a proposal may require consent-aware contact capture.

### 7.4 Partner and Campaign Assets

An approved result can produce a co-branded landing page or partner-safe share link with:

- partner identity and approved logo treatment;
- audience-specific introduction;
- one representative comparison;
- editable calculator preloaded with the case assumptions;
- campaign and referrer attribution;
- a partner-specific CTA; and
- no unapproved changes to calculated facts or compliance language.

---

## 8. Canonical Comparison Contract

### 8.1 Required project inputs

| Field | Requirement |
|---|---|
| Project type | Required; controlled taxonomy with template version. |
| Project budget | Required; positive currency amount and currency code. |
| Milestones | Required directly or generated by a versioned project template. |
| Milestone timing | Start, end, dependencies, and payment timing required after normalization. |
| Eligible cost | Required per milestone; reconciles to total reimbursable project cost. |
| Start and completion | Required. Generated dates must be disclosed as assumptions. |
| Horizon | Required; may equal takeout date or a disclosed derived date. |
| Starting working capital | Required for feasibility. |
| Minimum cash reserve | Required; zero is permitted only when explicit. |
| Co-pay/reimbursement ratio | Required; 100% may be explicit. |
| Holdback/retainage | Required; zero may be explicit. |
| Approved draw limit | Required for financed scenarios. |

### 8.2 Required common financing inputs

- annual interest rate;
- day-count basis;
- simple or compound accrual method;
- interest payment or capitalization treatment;
- rounding method and precision;
- per-draw fee and any fixed scenario-specific fee;
- evidence/review/site-visit/release lag;
- draw eligibility policy;
- draw policy limit;
- takeout or repayment treatment; and
- timezone and event-day ordering.

### 8.3 Strategy-specific inputs

**Baseline:**

- schedule source: generated policy or actual known dates;
- target cumulative eligible-cost thresholds or milestone groups;
- draw count, defaulting to three;
- baseline-only fees, if any; and
- documented exception or manual override reason.

**DrawFlow:**

- optimizer policy version;
- allowed draw dates or cadence restrictions;
- minimum draw amount;
- maximum draw count, if applicable;
- lender policy limits;
- optimization objective; and
- approved manual override reason, if used.

### 8.4 Required output contract

Every calculation response must contain:

- comparison ID and revision ID;
- normalized inputs and source provenance;
- engine, policy, template, and schema versions;
- deterministic input hash;
- baseline result;
- DrawFlow result;
- difference result;
- daily or event-level ledger for both strategies;
- validation results and warnings;
- assumption and disclosure payload;
- render-safe anonymized labels; and
- creation timestamp and actor context.

Each strategy result includes:

- feasibility status and reason;
- draw events with eligibility, review, and release dates;
- draw count and released amount;
- interest by period and total interest;
- draw fees and total modeled financing cost;
- peak unreimbursed exposure;
- minimum cash-on-hand and shortfall;
- cash required to make the schedule feasible;
- completion and horizon dates; and
- policy warnings or manual overrides.

---

## 9. Comparison Methodology

### 9.1 Fair-comparison invariant

The two strategies must share:

- project budget and eligible-cost basis;
- milestone scope, cost, dependency, and spend timing;
- construction start and completion dates;
- interest rate, day-count convention, and accrual treatment;
- horizon;
- reimbursement ratio, holdback, and approved facility limit;
- review and release lag, unless the comparison explicitly studies operational lag;
- starting working capital and minimum reserve; and
- common fees.

If a case changes a common input, the UI and artifact must call it a **scenario comparison**, identify the changed assumption, and avoid attributing the entire result to draw frequency.

### 9.2 Event ledger

The canonical engine creates an ordered event ledger from:

- milestone spend;
- completion and eligibility unlock;
- evidence submission;
- review or site visit completion;
- draw release;
- borrower cash infusion;
- lender fee;
- interest accrual or capitalization;
- repayment/takeout; and
- horizon close.

Event ordering on the same calendar day must be explicit, deterministic, versioned, and identical across strategy calculations.

### 9.3 Interest calculation

For daily compounding over an interval:

`interest = openingInterestBearingBalance × ((1 + annualRate / dayCountBasis) ^ elapsedDays - 1)`

For simple daily interest:

`interest = openingInterestBearingBalance × annualRate × elapsedDays / dayCountBasis`

Released principal begins accruing only at the configured release-event boundary. Approved limits, unlocked capacity, unreimbursed spend, borrower equity, co-pay, and undrawn funds do not accrue loan interest. If accrued interest is capitalized, the ledger must show the capitalization event and subsequent interest-bearing balance separately.

### 9.4 Cost calculation

`modeledFinancingCost = modeledInterest + drawFees + disclosedScenarioSpecificFees`

`modeledInterestDifference = baselineInterest - drawFlowInterest`

`modeledFinancingCostDifference = baselineFinancingCost - drawFlowFinancingCost`

`differencePercent = modeledFinancingCostDifference / baselineFinancingCost`

When the baseline cost is zero, percentage difference is not calculated. Common costs that do not vary between strategies are disclosed but excluded from the difference to avoid inflating the result.

### 9.5 Conventional three-draw baseline

The default baseline policy will:

1. group total eligible cost into three disclosed cumulative thresholds, initially 33.33%, 66.67%, and 100%;
2. locate the first date each threshold is reached by completed, eligible work;
3. add the same evidence, review, and release lag used by the DrawFlow strategy;
4. release no more than eligible reimbursable costs and the remaining facility limit;
5. preserve any required holdback until its release condition; and
6. test the resulting cash ledger against supplied working capital and reserve.

Thresholds are defaults, not facts. Operators and advanced calculator users may instead select milestone groups or enter an actual known three-draw schedule. Manual input must retain provenance and must still pass eligibility validation.

If the borrower cannot reach the next threshold with supplied working capital, the baseline is **infeasible**. The result reports the maximum cash shortfall and cash required to make it feasible. It does not move the draw earlier, fabricate a cash infusion, or exclude the baseline from the comparison.

### 9.6 DrawFlow strategy

The DrawFlow strategy reuses the V1 milestone timeline and constraint-ledger optimizer. It should generate draws no earlier than eligibility and as late as feasible before a modeled cash constraint, while minimizing the selected objective subject to:

- working capital and reserve;
- eligible capacity;
- approved facility and lender policy limits;
- draw fee;
- interest rate and horizon;
- minimum draw amount;
- review/release lag;
- cadence restrictions; and
- draw-count or administrative constraints.

The current V1 optimizer's fixed `$500` fee is a demo implementation detail. Production comparison requests must supply and persist the fee. The optimizer cannot power external claims until this and all other material assumptions are parameterized.

### 9.7 Sensitivity analysis

Internal cases should support a sensitivity grid for:

- interest rate;
- review lag;
- construction duration or delay;
- starting working capital;
- draw fee;
- horizon; and
- milestone spend timing.

Sensitivity results are supporting evidence, not a substitute for the primary like-for-like comparison. Public calculator results may show a restrained range after the single-input result is clear.

---

## 10. Historical Case Generation Pipeline

### 10.1 Source selection

Supported sources:

1. immutable DrawFlow proposal or build snapshot;
2. completed-build export authorized for case-study use;
3. normalized budget workbook processed through the DrawFlow budget-import contract; or
4. versioned project template for a clearly labeled modeled example.

The source selector records source type, source ID, source revision, owner, authorization basis, and intended publication scope. The generator never writes back to the source.

### 10.2 Rights and authorization gate

Before source data is processed for an external case, an operator records:

- the contractual or written basis for case-study use;
- permitted audience and channels;
- whether actual or normalized figures may be used;
- whether dates may be exact, shifted, or banded;
- whether project imagery may be used;
- expiry or revocation conditions; and
- approving staff member.

If authorization is absent, the source may be used only for internal analysis or converted into a synthetic template whose facts cannot be traced to the source project.

### 10.3 Anonymization and minimization

The pipeline removes or replaces:

- borrower, guarantor, contractor, consultant, lender, and staff names;
- property address, parcel, permit, application, and loan identifiers;
- precise geolocation and uniquely identifying municipality details where necessary;
- email, telephone, signature, account, and payment information;
- document filenames and embedded metadata;
- free-text notes and evidence descriptions;
- image EXIF and visually identifying signage or addresses;
- exact dates if their combination can identify the project; and
- unique cost-line descriptions or amounts where re-identification risk is material.

The approved case receives a neutral Case ID, project-type label, broad geography band, construction-period band, and controlled public milestone labels. Date shifting must preserve durations and event intervals. Amount normalization must preserve ratios and calculation integrity, and the artifact must disclose when values are normalized rather than actual.

Automated scanning flags residual names, addresses, identifiers, metadata, and unusually specific free text. A human anonymization review remains mandatory for historical public cases.

### 10.4 Normalization and reconciliation

The pipeline converts the source into the canonical comparison contract and verifies:

- milestone costs sum to the declared project budget;
- eligible costs plus ineligible costs reconcile to budget;
- reimbursement ratio and co-pay are applied consistently;
- dates, durations, dependencies, and spend events are valid;
- draws do not exceed eligible capacity or facility limits;
- holdback is not released before its condition;
- the common horizon occurs on or after construction start;
- currency, rate, fees, and day-count basis are explicit; and
- all generated assumptions identify their template and version.

Reconciliation failure blocks calculation. Operators must repair the source mapping or explicitly exclude and document an unsupported item; the system must not silently rebalance amounts.

### 10.5 Immutable comparison snapshot

After normalization, create an immutable comparison revision containing:

- anonymized normalized input;
- encrypted or access-controlled source lineage;
- input hash;
- template and policy versions;
- authorization record reference;
- operator and timestamp; and
- current review state.

Any material edit creates a new revision and invalidates downstream artifacts for that revision.

### 10.6 Schedule generation and calculation

Generate the baseline and DrawFlow schedules, calculate their event ledgers, and run automated invariants. Operators can inspect schedule differences and create a reasoned manual override, but overrides are versioned, highlighted, and included in approval review.

### 10.7 Validation gate

Calculation validation blocks release when any of the following occurs:

- project totals do not reconcile;
- a draw precedes eligibility;
- a draw exceeds eligible capacity or facility limit;
- a repayment, holdback, co-pay, or fee is applied differently without disclosure;
- common assumptions differ unintentionally;
- daily ledger totals do not reconcile to summary totals;
- repeated execution produces a different output hash;
- visual labels or rounded summaries disagree with calculation output; or
- the engine or policy version is not approved for public claims.

Warnings that do not block calculation, such as a baseline cash shortfall or unusually long review lag, remain visible in the output and review screen.

### 10.8 Narrative and claims gate

The case narrative is generated from structured facts, then reviewed. It may state:

- what project type and budget range were modeled;
- which schedule released funds and when;
- the modeled interest and financing-cost difference;
- the difference in draw fees;
- the peak working-capital exposure; and
- the assumptions under which the result holds.

It may not state or imply:

- guaranteed savings;
- that the example is typical without substantiation;
- that financing, approval, or a particular rate is available;
- that DrawFlow eliminates interest, delay, inspection, evidence, or lender discretion; or
- that a modeled template is an observed client outcome.

### 10.9 Artifact rendering

After approval, the rendering worker produces deterministic assets from the immutable result payload. Rendering must not recalculate financial results.

Required outputs:

- responsive hosted case page;
- 1600×900 presentation image;
- 1200×630 social or email-preview image;
- email-safe summary image;
- accessible PDF case sheet; and
- machine-readable JSON for approved internal integrations.

The renderer records render version, source result hash, asset checksum, generated timestamp, dimensions, and accessibility validation status.

### 10.10 Publication and revocation

Publication creates a random, non-enumerable public identifier separate from source and comparison IDs. Staff can constrain audience, partner, campaign, expiry, indexing, download, and co-branding. Revocation immediately disables public assets while retaining the internal audit record.

---

## 11. Visual and Content Requirements

### 11.1 Primary comparison view

The desktop view places baseline and DrawFlow on a shared date axis so the user can compare timing without mentally aligning two charts. Mobile may stack the strategies but must preserve the same scale and offer a strategy toggle.

Required visual layers:

- project milestones and dependencies;
- milestone cost or spend timing;
- eligibility date or capacity unlock;
- draw-group region;
- draw release marker and amount;
- construction completion and horizon; and
- cash shortfall or feasibility warning.

### 11.2 Interest exposure view

Show both:

- interest-bearing released principal over time; and
- cumulative modeled interest over time.

The two measures must not share an ambiguous unlabeled axis. Tooltips identify date, released balance, interval interest, cumulative interest, and causative draw event.

### 11.3 Working-capital view

Show cash on hand or unreimbursed exposure over time, including:

- starting working capital;
- project spend;
- draw reimbursement;
- minimum reserve;
- lowest cash point;
- peak unreimbursed exposure; and
- baseline shortfall when infeasible.

### 11.4 Summary metrics

Every full result displays:

- modeled interest: baseline and DrawFlow;
- draw fees: baseline and DrawFlow;
- total modeled financing cost: baseline and DrawFlow;
- modeled cost difference in currency and percentage, when defined;
- draw count;
- released principal;
- peak unreimbursed exposure;
- minimum cash-on-hand or required additional cash;
- construction duration; and
- calculation horizon.

The headline metric defaults to total modeled financing-cost difference. Interest difference may lead only when the surrounding content also discloses the draw-fee difference.

### 11.5 Assumptions and disclosures

All assets include or link directly to:

- project classification and whether the case is historical, normalized, or modeled;
- budget, duration, and horizon;
- rate, fee, day-count, accrual, and capitalization assumptions;
- baseline draw policy;
- reimbursement ratio, holdback, working capital, and review lag;
- calculation date and engine version;
- material exclusions; and
- FairLend-approved projection and availability disclaimer.

Screenshots and cropped assets retain a compact assumptions footer and QR/deep link to the complete result. A crop cannot remove the modeled-result label or disclaimer marker.

### 11.6 Accessibility

- Do not encode strategy or feasibility by color alone.
- Charts require text summaries and accessible data tables.
- All interactions must be keyboard accessible.
- Currency, percentages, dates, and abbreviations require screen-reader-safe labels.
- PDF output must be tagged and follow a logical reading order.
- Motion is nonessential and respects reduced-motion settings.

---

## 12. Lead-Form Follow-Up Requirements

### 12.1 Minimum viable input contract

A personalized calculation requires project type, construction budget, planned duration or dates, rate, draw fee, and working capital. If rate, fee, or working capital is missing, the form must either ask for it or clearly present a selectable assumption before submission. A generic hidden default is not sufficient for a personalized claim.

If minimum inputs are not available, send an educational result labeled as an example and provide a link to complete the calculator. Do not manufacture a personalized amount.

### 12.2 Processing behavior

- Lead persistence and CRM sync must not depend on successful comparison generation.
- Generation uses a durable, idempotent job keyed by lead submission and input revision.
- The confirmation page renders an immediate lightweight preview when calculation completes within the request budget; otherwise it shows a stable pending state.
- Email delivery is triggered by a completed approved-for-automation result, not by a fixed delay.
- Retries must not send duplicate emails or create duplicate CRM activities.
- A failed calculation creates an internal alert and sends a useful non-numeric follow-up rather than exposing an error to the lead.

### 12.3 Email content

Subject and copy adapt to project type and declared goal without overstating the result. The email includes:

- one-sentence explanation of the comparison;
- a compact image or metric block;
- the result's modeled status and top assumptions;
- a secure deep link to the complete interactive result;
- a CTA to review the schedule with FairLend; and
- consent, sender identity, and unsubscribe treatment appropriate to the message type.

The message must not embed sensitive project details in the subject line, tracking query parameters, or image URL.

### 12.4 CRM handoff

Record, at minimum:

- lead and person/company linkage;
- calculator/result ID and revision;
- project type, budget band, duration band, and working-capital band;
- baseline and DrawFlow feasibility;
- modeled cost-difference band, not unnecessarily precise sensitive inputs;
- assumptions requiring human confirmation;
- originating page, campaign, partner, QR, and UTM attribution;
- delivery, open where lawful, result view, CTA, booking, and reply events; and
- generation or delivery failure state.

The human task should summarize the decision-relevant facts and proposed conversation hook rather than copying the full ledger into Twenty.

---

## 13. Public Calculator Experience

### 13.1 Guided input sequence

1. **Choose the build:** project type and location band if needed for templates.
2. **Set scope:** budget and start/completion or duration.
3. **Set financing:** rate, draw fee, available working capital, reserve, and horizon.
4. **Review schedule:** editable generated milestones and conventional three-draw thresholds.
5. **Compare:** timeline, principal exposure, interest, fees, cash need, and feasibility.
6. **Stress test:** change one assumption at a time with visible deltas.
7. **Act:** save, email, share, book a consultation, or start a DrawFlow proposal.

### 13.2 Progressive disclosure

The default experience uses plain language and a versioned project template. Advanced controls are available without making the initial path feel like an underwriting application. Every generated assumption is visible before the first numeric result.

### 13.3 Result interpretation

The calculator must support all valid outcomes:

- DrawFlow has lower modeled interest and lower total cost;
- DrawFlow has lower interest but higher total cost after draw fees;
- DrawFlow and baseline are approximately equal;
- the baseline is infeasible with supplied working capital;
- DrawFlow is infeasible under supplied constraints; or
- inputs are insufficient or internally inconsistent.

The UI explains the driver of the result. It never hides an unfavorable DrawFlow outcome.

### 13.4 Save and share

Anonymous users can calculate without creating an account. A result can be stored in short-lived browser state. Server-side save, email, or share requires explicit consent and a non-enumerable result token. Public sharing excludes contact details and uses the calculator's anonymized public payload.

---

## 14. Partner Outreach and Co-Branding

### 14.1 Partner-specific framing

The same approved case can be framed by the partner's audience need without changing calculated facts:

- **Builder:** reduce cash tied up between completed work and reimbursement.
- **Architect/designer/planner:** help clients model financing before drawings and permits become committed costs.
- **Project manager/estimator:** connect real milestone sequencing to funding availability.
- **Mortgage broker/accountant/lawyer:** identify draw-structure risk earlier in advisory work.
- **Investor group/meetup:** compare leverage cost and liquidity under a concrete build schedule.
- **Podcast/newsletter:** provide an educational visual story, downloadable case, and audience calculator.
- **Trade show:** use a QR-linked calculator preconfigured to the event's dominant project type.

### 14.2 Campaign controls

Partner links support:

- partner and campaign ID;
- approved introduction and CTA;
- co-branding configuration;
- preloaded but editable assumptions;
- expiry and revocation;
- QR generation;
- attribution through calculator completion and CRM conversion; and
- an audit trail of which case revision was distributed.

The partner cannot edit interest figures, assumptions, disclosures, or calculated claims after approval.

---

## 15. Workflow and State Model

### 15.1 Historical case states

`draft → source_authorized → anonymization_review → calculation_validation → compliance_review → approved → published`

From any nonterminal state, a case may move to `rejected`. A published case may move to `archived` or `revoked`. A material edit creates a new `draft` revision rather than moving the approved revision backward.

### 15.2 Modeled automated-result states

`received → normalized → calculating → validated → rendering → ready → delivered`

Failure states are `needs_input`, `calculation_failed`, `render_failed`, and `delivery_failed`. Each stores a safe error code, retryability, attempt count, and internal diagnostic reference.

### 15.3 Roles

- **Operator:** creates and edits draft cases.
- **Calculation reviewer:** approves source mapping and numeric reconciliation.
- **Privacy reviewer:** approves anonymization for historical cases.
- **Compliance approver:** approves narrative, disclosures, and publication scope.
- **Publisher:** publishes, expires, archives, or revokes approved assets.
- **System worker:** generates automated modeled results only within approved templates, policies, and claims.

Production permissions must support separation of duties even if one authorized person holds multiple roles initially.

---

## 16. Data Model

The names below are conceptual and should be aligned with DrawFlow's production schema conventions during technical design.

### 16.1 `comparisonCases`

- case ID and tenant/brokerage scope;
- case type: historical, normalized historical, modeled, or lead-generated;
- title, project-type taxonomy, and public labels;
- source authorization and publication scope;
- current revision and workflow state;
- assigned owner and reviewers;
- partner/campaign references; and
- created, updated, approved, published, expired, revoked timestamps.

### 16.2 `comparisonCaseRevisions`

- immutable normalized input payload;
- protected source lineage;
- template, schema, engine, policy, and renderer versions;
- input and output hashes;
- structured assumptions and disclosures;
- strategy result references;
- validation and warning summary;
- narrative blocks;
- revision reason and actor; and
- superseded revision reference.

### 16.3 `comparisonStrategyResults`

- strategy type and schedule provenance;
- feasibility, shortfall, and explanation;
- draw schedule;
- event ledger;
- interest, fee, and cost totals;
- working-capital metrics;
- chart series or derivation reference; and
- calculation checksum.

### 16.4 `comparisonArtifacts`

- revision ID and artifact type;
- storage key, checksum, MIME type, dimensions, and page count;
- renderer version and generated timestamp;
- accessibility status;
- public asset identifier, access mode, expiry, and revocation state; and
- campaign/partner presentation configuration.

### 16.5 `comparisonReviews`

- revision and review type;
- reviewer identity and role;
- checklist version;
- decision, comments, and timestamp; and
- structured exceptions and supporting evidence.

### 16.6 `comparisonJobs`

- idempotency key and job type;
- lead/case/revision reference;
- state, attempt count, scheduling, and lease data;
- safe failure code and diagnostic trace reference; and
- created, started, completed, and next-attempt timestamps.

### 16.7 `comparisonEvents`

- case/result/lead/campaign references;
- event type and timestamp;
- privacy-safe session or actor reference;
- channel and attribution context; and
- schema version.

No public identifier, URL, email payload, or analytics event may expose a source build ID, proposal ID, borrower ID, address, or internal comparison ID.

---

## 17. Service Boundaries and Integration Contract

### 17.1 Calculation service

DrawFlow owns a pure, versioned comparison function or authenticated API:

`calculateComparison(normalizedComparisonInput) → comparisonResult`

The function must be deterministic, side-effect free, and callable by:

- the DrawFlow Case Studio;
- FairLend CMS server actions or jobs;
- the render worker; and
- offline verification tooling.

It returns numbers and presentation-ready series but does not publish, email, or write CRM records.

### 17.2 Template service

Project templates produce milestones, cost weights, durations, dependencies, and spend timing for supported project types. Template output is normalized before calculation and tagged with a version. Initial supported types should follow the V1 setup flow:

- single-family full build;
- single-family renovation;
- multiplex build; and
- explicitly mapped garden-suite and laneway-suite variants.

### 17.3 Rendering service

A render route accepts an immutable result revision and presentation manifest, renders shared timeline/chart components, and produces the asset bundle. It cannot receive source PII. Server-side rendering, browser capture, and PDF production must share one presentation manifest so labels and metrics remain consistent.

### 17.4 FairLend CMS integration

The CMS owns:

- acquisition UI and consent;
- public calculator shell;
- lead persistence;
- campaign and partner attribution;
- CRM sync;
- result delivery UX; and
- conversion analytics.

It calls DrawFlow for template generation and comparison calculation. The existing coarse `interest-by-draw` calculator in `src/calculators/engine-construction.ts` is not the source of truth for this product and must not be extended into a competing engine.

### 17.5 CRM and email integrations

Twenty receives summarized opportunity and engagement data, not the full financial event ledger. Email delivery consumes a ready result event through a durable outbox or job boundary. The product must not assume a specific email vendor until implementation selection.

---

## 18. Security, Privacy, and Compliance Requirements

### 18.1 Data handling

- Tenant and brokerage scope must be enforced on source, case, review, artifact, and event records.
- Protected source lineage is never returned to public clients.
- Public result payloads are an allowlisted projection, not a redacted copy of internal data.
- Assets use private storage until publication.
- Signed or opaque links are short-lived for private lead results.
- Public case links are non-enumerable and revocable.
- Logs and traces exclude project addresses, names, email addresses, and full financial payloads.
- Retention differs for source data, public artifacts, lead results, analytics, and audit records.

### 18.2 Claims and disclosure controls

- All result language is drawn from an approved phrase library keyed by result type.
- The system distinguishes historical fact, normalized historical result, and modeled projection visually and semantically.
- A changed rate, delay, fee, eligibility rule, or horizon cannot be attributed to DrawFlow draw timing.
- Rate or product availability language must be reviewed under FairLend's current licensing and advertising controls.
- Compliance may disable a template, policy, phrase, or engine version globally without code deployment.
- Published assets retain the disclosures approved with their revision even if current defaults later change.

### 18.3 Anonymization verification

Before publication of a historical case:

- scan structured and unstructured fields for PII and project identifiers;
- strip document and image metadata;
- inspect rendered assets, including charts, tooltips, filenames, and accessibility text;
- test public JSON and page source for protected identifiers; and
- record a human review decision against the rendered revision.

---

## 19. Observability and Analytics

### 19.1 Operational telemetry

Track:

- calculation, validation, render, and delivery latency;
- queue age, retries, and terminal failures;
- engine/policy/template version distribution;
- reconciliation and invariant failure codes;
- asset generation and checksum failures;
- email delivery and result-link access; and
- revocation propagation time.

### 19.2 Product funnel

Track privacy-safe events for:

- calculator start;
- minimum inputs completed;
- calculation completed;
- advanced assumption opened;
- result viewed;
- sensitivity changed;
- result saved, emailed, downloaded, or shared;
- partner/QR/campaign attribution;
- consultation CTA and booking;
- DrawFlow proposal started;
- qualified opportunity created; and
- partner-sourced funded outcome where attribution is permitted.

### 19.3 Primary success metrics

- calculator completion rate;
- qualified CTA rate after result view;
- lead-to-booking lift versus comparable forms without the result;
- partner link-to-qualified-lead conversion;
- time from lead submission to ready result;
- percentage of automated results delivered successfully;
- case-study reuse across partner campaigns;
- zero material public calculation discrepancies; and
- zero confirmed re-identification or unapproved-claim incidents.

Success must not be measured by maximizing the displayed “savings” amount.

---

## 20. Failure Handling

| Failure | User behavior | Internal behavior |
|---|---|---|
| Missing required input | Explain the missing assumption and allow completion. | Store no numeric result. |
| Invalid or unreconciled budget | Block comparison and identify the mismatch. | Create validation issue; do not auto-balance. |
| Baseline infeasible | Show cash shortfall as a meaningful result. | Persist feasibility explanation and ledger. |
| DrawFlow infeasible | Explain the binding constraint and next useful input. | Persist optimizer diagnostics. |
| Calculation timeout | Preserve inputs and show processing state. | Retry idempotently; alert on terminal failure. |
| Rendering failure | Keep the interactive result available when valid. | Retry asset only; never recalculate silently. |
| Email failure | Keep secure result link and do not claim delivery. | Retry without duplicate send; create CRM exception. |
| Revoked historical case | Show a neutral unavailable page. | Disable assets and log access attempt without source disclosure. |
| Engine version withdrawn | Block new publication using that version. | Preserve existing audit records; revoke affected assets if required. |

---

## 21. Rollout Plan

### Phase 0 — Methodology lock and engine hardening

- Approve terminology, baseline policy, interest treatment, event ordering, and disclosures.
- Extract or consolidate one canonical interest and cost calculation path from V1.
- Parameterize draw fee and all assumptions currently embedded as demo constants.
- Add deterministic versioning, hashes, ledgers, reconciliation, and golden fixtures.
- Define source authorization and anonymization checklists.

**Exit:** Finance/product/compliance sign off on example fixtures and no formula divergence remains among optimizer, summary, and charts.

### Phase 1 — Internal Case Studio pilot

- Build immutable case revisions and review workflow.
- Support DrawFlow snapshot and normalized budget sources.
- Render hosted page, PNGs, and PDF from shared components.
- Create three to five approved historical or normalized cases across project types.
- Pilot with internal outreach only.

**Exit:** Cases reproduce exactly, pass anonymization review, and can be revoked end to end.

### Phase 2 — Partner campaign distribution

- Add co-branding, campaign links, QR attribution, audience framing, and partner reporting.
- Use approved cases in targeted builder/professional/podcast/community outreach.
- Measure engagement and qualitative objection patterns.

**Exit:** At least two partner categories produce attributable qualified conversations with no material claim or privacy incident.

### Phase 3 — Personalized lead follow-up

- Add minimum input contract to selected high-intent forms.
- Implement durable generation, secure result links, transactional email handoff, CRM activities, and human summary.
- A/B test result delivery against the existing confirmation and follow-up path.

**Exit:** Reliable delivery and measurable booking lift without degraded form completion.

### Phase 4 — Public interactive calculator

- Release guided calculator and advanced assumptions.
- Add anonymous use, consent-aware save/share, sensitivities, and proposal handoff.
- Expand project templates only after fixture and compliance approval.

**Exit:** Stable calculation and conversion performance at public traffic volume, with discrepancy and privacy incident targets maintained.

---

## 22. Acceptance Criteria

### 22.1 Calculation correctness

- Given the same normalized input, engine version, and policy version, repeated runs produce byte-equivalent normalized results and the same output hash.
- No scenario accrues interest before draw release.
- No draw exceeds eligible capacity, approved limit, remaining reimbursable cost, or configured policy limit.
- Baseline and DrawFlow totals use identical common assumptions.
- Interest ledger, draw table, chart series, KPI totals, PDF, image, and hosted page reconcile within the declared rounding policy.
- Draw fees are parameterized and included in total modeled financing cost.
- Infeasible schedules report the binding constraint and required additional cash.
- A known three-draw schedule can be reproduced exactly from manual eligible release dates.
- Golden fixtures cover simple interest, daily compounding, capitalized interest, co-pay, holdback, delays, zero baseline cost, and both-strategy infeasibility.

### 22.2 Historical case safety

- Source records are read-only throughout generation.
- Public payload and every generated artifact contain no protected source identifiers.
- Anonymization, calculation, and compliance reviews are recorded against the exact published revision.
- Material changes create a revision and invalidate prior unapproved artifacts.
- Revocation removes public access without deleting the audit record.

### 22.3 Lead follow-up

- Lead persistence succeeds independently of calculation, rendering, CRM, and email status.
- Jobs are idempotent and retries create neither duplicate results nor duplicate messages.
- A lead never receives a numeric personalized claim when the minimum inputs are absent.
- Email and result URLs do not expose PII or internal IDs.
- CRM receives the result summary, assumptions requiring confirmation, attribution, and engagement events.

### 22.4 Calculator UX

- Users can calculate without submitting contact information.
- Generated assumptions are visible before the first result.
- All valid favorable, neutral, unfavorable, and infeasible outcomes render correctly.
- Every chart has an accessible table or text equivalent.
- The result remains understandable at mobile width and under keyboard-only navigation.
- Changing an input invalidates the old result until recalculation completes.

### 22.5 Operations

- Staff can see job status, validation failures, reviews, publication state, and asset checksums.
- Compliance can disable a phrase, template, policy, or engine version.
- Published assets identify their calculation date and engine version.
- Operational alerts distinguish input problems, calculation defects, rendering defects, delivery defects, and privacy/compliance blocks.

---

## 23. Test Strategy

### 23.1 Unit and property tests

- interest and fee functions across day counts, rounding boundaries, rate extremes, and zero values;
- event ordering and same-day release behavior;
- budget, eligibility, facility, co-pay, and holdback invariants;
- baseline threshold generation;
- optimizer feasibility and tie-breaking;
- anonymized public projection allowlist; and
- deterministic hashing and serialization.

Property tests should generate random valid schedules and assert conservation of project costs, no pre-eligibility draw, no limit breach, deterministic results, and ledger-to-summary reconciliation.

### 23.2 Golden comparison fixtures

Maintain finance-reviewed fixtures for each supported project template and special case. Each fixture contains normalized input, event ledger, schedule, totals, expected chart points, disclosure payload, and rendered snapshot references.

### 23.3 Integration tests

- source snapshot to immutable case revision;
- comparison service to CMS calculator;
- approved result to image/PDF renderer;
- form submission to result job, CRM activity, and email handoff;
- partner attribution through CTA; and
- expiry/revocation across hosted page and assets.

### 23.4 Security and privacy tests

- cross-tenant and role access denial;
- public payload allowlist snapshots;
- PII canaries in source fields, metadata, accessibility text, URLs, logs, and artifacts;
- token enumeration and expiry;
- stored XSS in imported milestone and narrative labels; and
- revoked asset cache invalidation.

### 23.5 Visual regression tests

Verify shared timeline/chart output at supported dimensions, long currency labels, dense milestones, infeasible warnings, mobile stacking, PDF pagination, and both light and print rendering. Visual tests must use the same golden result payloads as calculation tests.

---

## 24. Dependencies and Reuse Map

| Capability | Existing source | Productization requirement |
|---|---|---|
| Milestone scheduling and spend events | `-timeline-milestone-schedule.ts` | Extract stable, tested domain API independent of demo route state. |
| Project templates and setup inputs | `-TimelineSetupFlow.tsx` | Separate template data/generation from UI and version it. |
| Constraint ledger and draw optimization | `-timeline-draw-optimizer.ts` | Parameterize fees and policies; return explanations and versioned ledgers. |
| Cashflow and draw availability | `TimelineWorkspace.tsx` | Consolidate canonical math outside the component and share result types. |
| Timeline and financial charts | Timeline workspace chart components | Accept immutable comparison presentation payloads and render without live workspace dependencies. |
| Snapshot serialization | `-timeline-share-snapshot.ts` | Add production comparison schema/version and migration policy. |
| Proposal/build source data | DrawFlow `convex/schema.ts` | Read through tenant-scoped immutable snapshot adapters. |
| Public calculator catalog | FairLend `src/calculators/catalog.ts` | Register the new experience but call DrawFlow's engine. |
| Existing construction calculator | FairLend `src/calculators/engine-construction.ts` | Do not reuse its coarse monthly interest-by-draw formula for comparison claims. |
| Lead/CRM attribution | FairLend intake, Twenty, and QR documentation | Add result IDs, summary fields, events, and idempotent jobs. |

---

## 25. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Straw-man baseline overstates DrawFlow benefit | Publish baseline policy, allow actual schedule input, hold common assumptions constant, and show full schedule. |
| More draws lower interest but raise fees | Headline total financing cost and display both components. |
| Historical project can be re-identified | Authorization gate, data minimization, date/amount normalization, automated scanning, and human rendered-asset review. |
| Formula drift across calculator, chart, and PDF | One versioned engine and immutable result payload; renderer never recalculates. |
| Demo defaults become accidental public claims | Require explicit assumptions and policy versions; block unapproved defaults. |
| A result is interpreted as a loan quote | Approved modeled-result language, assumption disclosure, consultation CTA, and compliance-controlled phrase library. |
| Automated email arrives late or twice | Durable idempotent jobs, ready-result event, transactional outbox, and deduplicated sends. |
| Baseline or DrawFlow is infeasible | Treat feasibility and required cash as primary outputs rather than suppressing the result. |
| Public calculator becomes too complex | Guided defaults with visible assumptions and progressive disclosure of advanced controls. |
| Shared charts depend too heavily on demo UI state | Extract presentation components around a stable render manifest before building the renderer. |
| Cached asset remains after revocation | Private-by-default storage, revocation-aware delivery, bounded cache policy, and propagation monitoring. |

---

## 26. Product Decisions Required Before Implementation

The following decisions are intentionally unresolved and must be approved during Phase 0:

1. **Headline measure:** total modeled financing-cost difference is recommended; confirm whether interest difference may lead in specific campaign formats.
2. **Baseline policy:** confirm 33.33% / 66.67% / 100% eligible-cost thresholds as the default and define supported alternatives.
3. **Horizon default:** choose whether unknown takeout defaults to construction completion, completion plus a disclosed stabilization period, or requires user input.
4. **Interest treatment:** define the supported day-count conventions, compounding/capitalization defaults, and event-day ordering.
5. **Holdback treatment:** define initial public-calculator behavior and whether advanced users can alter it.
6. **Minimum calculator inputs:** decide whether working capital is mandatory or whether the calculator can return cost-only results with feasibility marked unknown.
7. **Historical normalization:** define the permitted date-shift and amount-normalization methods and the minimum cohort size or aggregation standard for public cases.
8. **Review authority:** designate calculation, privacy, and compliance approvers and the conditions under which duties may be combined.
9. **Link policy:** choose expiry and authentication requirements for lead results, partner previews, and public approved cases.
10. **Email classification:** determine transactional versus marketing treatment for each form and follow-up path with counsel/compliance.
11. **Initial templates:** select the first two or three project types based on available high-quality build data and outreach priority.
12. **Sensitivity bounds:** approve the rate, fee, duration, and working-capital ranges the public calculator may model.

---

## 27. Recommended Initial Release Definition

The smallest credible release is not the public calculator. It is an internal Case Studio backed by a hardened comparison engine, one baseline policy, two project templates, deterministic rendering, and full review/revocation controls.

That release should produce three approved examples:

1. a renovation where both schedules are feasible and DrawFlow lowers total modeled cost;
2. a ground-up build where the three-draw baseline creates a material working-capital shortfall; and
3. a case where interest is lower under DrawFlow but additional draw fees narrow or reverse the total-cost benefit.

Together, these cases prove the product is an honest decision tool rather than a savings-number generator. Once the methodology and rendering pipeline survive real internal use, the same engine can safely support personalized lead follow-up and then the public calculator.

