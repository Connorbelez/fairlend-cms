# Requirements brief — Toronto garden-suite cost and feasibility model

**Status:** proposal only; not finished copy  
**Priority:** P1  
**Proposed canonical path:** `/resources/garden-suite-cost-toronto/`

## Search task

Help a Toronto homeowner/investor move from “could a garden suite create income?” to a property-specific estimate of feasibility, total project cost, funding need, rent assumptions, and next professional steps.

## Evidence

- `garden suites toronto`: observed volume 590, difficulty 5.
- `toronto garden suites`: 210, difficulty 5.
- `garden suite cost toronto`: 20, difficulty unavailable.
- Live Toronto cost SERP: AI Overview, Reddit first organic, PAA, discussion/forum block, video, calculators, local builders, reviews, and a knowledge graph.
- Ranking snippets present materially different cost ranges; the page must explain assumptions instead of publishing one unsupported number.

## Required modules

- REQUIREMENT: Give a short answer with a reviewed date, range basis, and estimate disclaimer.
- REQUIREMENT: Separate pre-construction/soft costs, site/servicing, hard construction, contingency, financing/carry, lease-up, and ongoing operating considerations.
- REQUIREMENT: Provide an input-driven model or calculator with visible assumptions and an export/print view.
- REQUIREMENT: Explain what changes with size, storeys, access, trees, servicing, existing structures, soil/site conditions, finishes, and delivery method.
- REQUIREMENT: Add a Toronto official-source navigator for zoning, preliminary review, permit guide, trees, variance, certified plans, permit status, and development-charge/parkland context.
- REQUIREMENT: Include a financing timeline showing acquisition/equity, deposits, construction draws, completion, rent/stabilization, and takeout/refinance decision.
- REQUIREMENT: Compare “garden suite,” “laneway suite,” internal additional unit, and “do nothing/sell” only at a decision level; do not force them into one cost range.
- REQUIREMENT: Include a rent/ROI scenario only with user-entered assumptions and explicit exclusions; do not claim a typical return.
- REQUIREMENT: Link to the separate financing path and property-screening assessment, not a generic contact CTA.

## Answer targets

- How much does a garden suite cost in Toronto?
- What costs occur before construction?
- Can this property support a garden suite?
- What permits and professional drawings are required?
- How does financing work and when is cash needed?
- How much rent would make the project viable under the user's assumptions?
- How does a Toronto garden suite differ from a Mississauga pre-approved plan or a laneway suite?

## Required evidence and reviewers

- EVIDENCE: current City of Toronto garden-suite and adding-units sources;
- EVIDENCE: reviewed local cost dataset with date, sample definition, and exclusions;
- EVIDENCE: financing assumptions approved by the brokerage/product reviewer;
- REVIEW: planner/designer, builder/QS, mortgage compliance, legal/tax/insurance where referenced;
- REVIEW: accessibility, calculator arithmetic, mobile layout, and print/export output.

## Multi-format requirements

- one long-form walkthrough video;
- three short clips;
- cost-stack diagram;
- property feasibility decision tree;
- calculator and downloadable assumptions worksheet;
- visible transcript and image alt text;
- FAQ only for questions answered visibly on the page.

## Proposed structured data

`Article` or `WebPage`, `BreadcrumbList`, `VideoObject`, and a clearly named interactive-tool entity if supported. FAQ markup only if current search guidelines permit and visible answers match exactly. No `FinancialProduct` claims should be inferred from the educational model.

## Claims locked

- “typical” cost, rent, ROI, approval time, rate, leverage, or savings without approved evidence;
- eligibility/permit/financing guarantee;
- claim that a garden suite is better than Airbnb, selling, or borrowing for every homeowner;
- fabricated testimonials or community quotes.

## Acceptance criteria

- source and assumption register complete;
- calculator test cases pass;
- every numeric output names its input/date/range;
- no thin municipality clones;
- video/transcript/diagram requirements satisfied;
- compliance and professional reviewers approve;
- proposed tracking distinguishes calculator use, export, assessment start, and qualified submission.
