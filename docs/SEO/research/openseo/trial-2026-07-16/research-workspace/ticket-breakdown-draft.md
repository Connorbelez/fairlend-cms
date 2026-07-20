# FairLend OpenSEO trial — proposed ticket breakdown

**Status:** Approved and published to the local tracker on 2026-07-16  
**Source:** Approved FairLend OpenSEO trial research contract  
**Tracker:** Local Markdown  
**Proposed ticket count:** 9

## Dependency graph

```text
01 Research workspace and contracts
└── 02 Budget-governed live data tracer
    ├── 03 Five-plus-unit multiplex / MLI Select
    ├── 04 Garden and laneway-suite financing
    ├── 05 DrawFlow and builder financing
    └── 06 B2B partner and referral demand
        └─┐
03 ───────┤
04 ───────┼── 07 Cross-workstream opportunity portfolio
05 ───────┤       └── 08 Greenfield page map and no-copy briefs
06 ───────┘               └── 09 Validate package and estimate full run
```

Tickets 03–06 depend only on the tested budget governor and can otherwise proceed independently. Ticket 07 is the first point where all four workstreams must be complete because it resolves overlap, cannibalization, and portfolio-wide priority.

## Proposed tickets

### 1. Establish the read-only research workspace and evidence contracts

**Blocked by:** None — can start immediately.

**What it delivers:** A verifiable research-package scaffold that converts the approved contract, current FairLend site inventory, and supplied audit into normalized data contracts before paid research begins. It defines the keyword, cluster, SERP, competitor, page-opportunity, AI-question, evidence, claim, brief, spend, and run-manifest records; enforces the no-copy and no-mutation boundaries; and includes representative fixture records so every later ticket can prove it emits compatible artifacts.

**Acceptance shape:**

- The current canonical URL inventory and audit findings are represented as dated source evidence rather than assumed facts.
- Every required dataset has a documented schema, stable identifiers, provenance fields, confidence fields, and validation rules.
- Funnel, lifecycle, persona, geography, dual-score, exclusion, and claim-status vocabularies match the approved contract.
- A validation command or equivalent deterministic check rejects final prose, missing provenance, invalid score totals, and prohibited mutation states.
- A representative fixture passes validation without spending paid-data budget.

### 2. Prove the budget-governed OpenSEO research path end to end

**Blocked by:** 01 — Establish the read-only research workspace and evidence contracts.

**What it delivers:** One deliberately minimal, Toronto-targeted OpenSEO/DataForSEO tracer that proves connectivity, live keyword evidence, cost prediction/logging, normalization into the approved contracts, and hard-stop behaviour before the four workstreams spend the remaining balance. It assigns non-overlapping per-workstream envelopes whose maximum total cannot exceed US$0.90.

**Acceptance shape:**

- OpenSEO and its configured live provider are identified and connectivity is verified read-only.
- The available included balance and endpoint charging behaviour are checked before the first paid call.
- One minimal paid request completes from seed to normalized, provenance-bearing record.
- Estimated and actual/returned cost are logged; cumulative spend remains visible.
- Per-workstream ceilings plus reserve total no more than US$0.90.
- Requests fail closed when cost is unknown or a call would exceed its envelope.
- No website, CMS, repository source, platform, or external account is mutated.

### 3. Validate the five-plus-unit multiplex and MLI Select opportunity slice

**Blocked by:** 02 — Prove the budget-governed OpenSEO research path end to end.

**What it delivers:** A complete sampled research slice for Toronto/GTA five-plus-unit, build-to-hold projects: live query expansion and metrics, official incentive/program evidence, representative SERPs, commercial/search/authority competitors, AI and natural-language questions, funnel/lifecycle/persona classification, and defensible page opportunities. Small multiplex terms remain separately classified so they cannot contaminate MLI Select intent.

**Acceptance shape:**

- At least one defensible five-plus-unit cluster is supported by live metrics and representative SERP evidence.
- Current official sources support program and incentive facts with jurisdiction and verification dates.
- Five-plus-unit/MLI Select and two-to-four-unit intent are explicitly separated.
- Build-to-hold, acquisition, construction, stabilization, takeout, and bank-declined triggers are represented where evidence supports them.
- Commercial, search, and authority competitors are distinguished.
- AI/question opportunities remain separate from volume-bearing keywords.
- The slice produces page-opportunity and evidence/claim records without marketing prose.
- Spend stays within the assigned envelope.

### 4. Validate the garden and laneway-suite financing opportunity slice

**Blocked by:** 02 — Prove the budget-governed OpenSEO research path end to end.

**What it delivers:** A complete sampled research slice for Toronto homeowners using property equity to create legal garden or laneway suites for long-term rental income. It covers financing and feasibility intent, comparison decisions, local terminology, representative SERPs and competitors, question/AI demand, stage-matched conversion paths, and justified page opportunities without producing content.

**Acceptance shape:**

- At least one defensible garden/laneway-suite cluster is supported by live metrics and representative SERP evidence.
- Financing intent is distinguished from garden design, rental listings, Airbnb management, and unrelated renovation traffic.
- The research covers evidence-supported comparisons such as long-term rental versus short-term rental and HELOC/second-mortgage/construction-financing options.
- Toronto-specific terminology and facts are separated from generic GTA or municipality-level variants.
- Research and buying-signal stages receive distinct questions, CTAs, and qualification expectations.
- The slice produces page-opportunity and evidence/claim records without marketing prose.
- Spend stays within the assigned envelope.

### 5. Validate the DrawFlow and builder-financing opportunity slice

**Blocked by:** 02 — Prove the budget-governed OpenSEO research path end to end.

**What it delivers:** A complete sampled research slice for builders seeking construction financing that follows real project cash flow. It tests demand around milestone-based availability, on-demand verified draws, deposits and trade payments, reimbursement gaps, idle capital, overlapping projects, stopped draws, rescue financing, and lender replacement. It treats builders as financing customers here, not referral partners.

**Acceptance shape:**

- At least one defensible builder/DrawFlow cluster is supported by live metrics and representative SERP evidence.
- Product-mechanism, pain-point, comparison, and urgent rescue intent are separately classified.
- Distressed-project opportunities include strict qualification requirements and remain separate from flagship positioning.
- Commercial, search, and authority competitors are distinguished.
- The stated up-to-50% interest-savings claim remains provisional and unusable for public content until case evidence is supplied and approved.
- The package includes the required anonymized case-study evidence template.
- The slice produces page-opportunity and evidence/claim records without marketing prose.
- Spend stays within the assigned envelope.

### 6. Validate the B2B partner and referral-demand opportunity slice

**Blocked by:** 02 — Prove the budget-governed OpenSEO research path end to end.

**What it delivers:** A complete sampled research slice for mortgage brokers, realtors, and upstream professional partners who can refer qualified multiplex, construction, bank-declined, or acquisition projects. Builders seeking their own financing remain in Ticket 05; this slice covers builders only when acting as referral or delivery partners. It identifies partner intent, referral triggers, authority/collaboration opportunities, and distinct conversion paths.

**Acceptance shape:**

- At least one defensible B2B cluster is supported by live or clearly labelled qualitative evidence.
- Mortgage-broker, realtor, builder-customer, and builder-referral intents are explicitly separated.
- Secondary architect, planner, contractor, appraiser, and property-manager language is sampled without diluting the primary cohort.
- Referral intent remains separate from borrower-facing page opportunities.
- Partner resources, collaboration assets, and authority/link opportunities are identified without planning outreach or writing channel content.
- The slice produces page-opportunity and evidence/claim records without marketing prose.
- Spend stays within the assigned envelope.

### 7. Synthesize the cross-workstream keyword and opportunity portfolios

**Blocked by:**

- 03 — Validate the five-plus-unit multiplex and MLI Select opportunity slice.
- 04 — Validate the garden and laneway-suite financing opportunity slice.
- 05 — Validate the DrawFlow and builder-financing opportunity slice.
- 06 — Validate the B2B partner and referral-demand opportunity slice.

**What it delivers:** One coherent trial portfolio that merges and normalizes all four slices, resolves duplicate and overlapping intent, applies hard traffic exclusions, validates page boundaries using SERP/intent overlap, and ranks opportunities independently for qualified lead capture and authority building. It also produces scenario-based—not promised—demand and lead-quality estimates.

**Acceptance shape:**

- Duplicate queries and clusters are consolidated without losing source provenance.
- Cross-workstream overlaps are assigned a canonical cluster or explicitly marked as shared support.
- Borrower, builder-customer, and referral-partner intents cannot silently merge.
- Lead Capture and Authority Build scores are independently calculated, explainable, and confidence-labelled.
- High-volume but project-irrelevant traffic is excluded or heavily down-ranked.
- SERP evidence changes or validates at least one proposed page boundary.
- AI/question opportunities remain separate from measured keyword demand.
- The output identifies a clearly ranked trial frontier rather than an unprioritized keyword dump.

### 8. Produce the greenfield page map and content-ready research briefs

**Blocked by:** 07 — Synthesize the cross-workstream keyword and opportunity portfolios.

**What it delivers:** A greenfield information-architecture proposal below the homepage and a no-copy research brief for every prioritized trial page opportunity. It maps hubs, money pages, support resources, conversion paths, internal-link roles, existing-page disposition, evidence needs, schema/metadata opportunities, and compliance approvals while stopping before final headings, prose, implementation diffs, or CMS content.

**Acceptance shape:**

- The homepage remains the core brand surface but receives evidence-backed pathway, metadata, CTA, internal-link, and trust recommendations where justified.
- Existing subordinate pages are preserved, consolidated, retired, or replaced based on winning intent rather than sunk cost.
- Every new URL is justified by distinct intent/SERP evidence rather than a lexical variation.
- Each brief contains the approved purpose, audience, trigger, cluster, outline requirements, questions, evidence, CTA specification, internal links, schema/metadata opportunity, approvals, and KPIs.
- The evidence-acquisition and claims/compliance registers are complete for every proposed page.
- Missing evidence remains explicit; the DrawFlow case claim remains locked.
- Automated checks confirm there is no finished marketing copy, CMS-ready prose, or implementation diff.

### 9. Validate and hand off the trial research package

**Blocked by:** 08 — Produce the greenfield page map and content-ready research briefs.

**What it delivers:** A self-contained, dated research package that a human can audit and a later agent can consume. It reconciles spend, sources, assumptions, confidence, success gates, unresolved evidence, and the full-scale research estimate; explains what the US$1 trial did and did not validate; and proves that no prohibited mutation or content creation occurred.

**Acceptance shape:**

- Every required Markdown, CSV, JSON, register, brief, manifest, and estimate artifact exists and passes schema/link/provenance checks.
- The run manifest lists tools, versions/commits where available, timestamps, market/location settings, paid tasks, and cumulative spend.
- Actual paid spend is at or below US$0.90.
- All 12 contract success gates receive pass/fail status with evidence.
- Limitations and unverified claims are prominent, including the unavailable DrawFlow case substantiation.
- The executive strategy names the ranked Lead Capture and Authority Build frontiers without presenting content.
- The full-scale estimate specifies scope, expected paid-data cost, sequencing, and what additional evidence/access would improve confidence.
- A final mutation audit confirms the live site, Payload CMS, repository source, platform settings, and external accounts were untouched.

## Review questions

Before publishing one local issue file per ticket:

1. Does this nine-ticket granularity feel right, or is it too coarse/fine?
2. Are the blocking edges correct—especially the four parallel workstreams converging at Ticket 07?
3. Should any workstream ticket be merged or split further?

The user approved this breakdown. The local issue files have been published with `ready-for-agent` status.
