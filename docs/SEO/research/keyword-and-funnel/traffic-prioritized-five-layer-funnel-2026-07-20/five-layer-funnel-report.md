# Traffic-prioritized five-layer keyword funnel

**Prepared:** 2026-07-20  
**Market:** Ontario with Toronto/GTA emphasis  
**Primary commercial scope:** garden suites, laneway suites, construction lending, multiplex lending, and MLI Select  
**Dataset:** 85 unique retained keywords, 12 canonical page clusters, 46 keywords with observed volume, and 39 keywords whose volume remains unknown rather than zero

## Executive decision

The existing FairLend keyword research has a sound five-layer funnel and a disciplined `unavailable-not-zero` evidence state. Its main weakness is not taxonomy; it is traffic prioritization and page ownership.

The July 19 universe gives every service two keywords per funnel layer, but 150 of its 160 rows have no current volume. The July 16–17 OpenSEO packages contain materially larger observed terms that were not merged into the current funnel. The July 20 cluster validation then compresses layers 1–3 into `research-decision` and layers 4–5 into `qualification-rescue`. That is workable for page count control, but it hides the content job each layer must perform and makes rescue intent too easy to bury.

This enhancement keeps the historical packages intact and adds a governed overlay:

- Every keyword is assigned to exactly one of five funnel layers.
- Every keyword maps to exactly one canonical URL.
- A URL may serve adjacent layers when the search intent is compatible.
- Observed volume is never replaced with zero when a provider returned no value.
- High volume is qualified for intent, geography, SERP ownership, and FairLend's ability to add value before it affects priority.
- Synonym volumes are not summed into a fictional total addressable market.

The immediate SEO build order is: create the broad Ontario construction-financing page, refresh the garden-suite feasibility hub, strengthen the existing garden-suite and multiplex money pages, make DrawFlow the canonical construction-draw tool, create the MLI Select hub and requirements calculator, and publish a distinct construction-rescue page.

## What changed from the existing research

| Audit finding | Existing state | Enhancement |
|---|---|---|
| Funnel coverage | Balanced at 32 keywords per layer in the borrower strategy | Preserved all five layers while concentrating more terms in L4 where validated construction demand exists |
| Volume evidence | 150 of 160 landing-service rows are unknown; five historical exact estimates are retained | Merged 46 observed-volume rows from the July 16–17 packages with 39 strategically necessary unknown-volume terms |
| High-volume terms | Several strong terms existed only in OpenSEO deliverables | Promoted `mortgage calculator`, `MLI Select`, `construction financing`, `construction mortgage`, and `garden suites Toronto` into canonical clusters |
| Page ownership | Research and decision stages were sometimes combined too broadly | Added explicit page jobs and cannibalization boundaries for 12 canonical clusters |
| Urgency | L5 existed in the universe but was often folded into the same page as ordinary qualification | Split construction rescue into a dedicated proposed problem-solver page while keeping smaller rescue variants as sections on their money pages |
| False positives | Raw traffic terms could appear attractive without intent controls | Marked municipal heads as authority-support, singular `garden suite` as ambiguous-secondary, and removed unrelated or wrong-geography terms from the active universe |

## Highest-traffic opportunities, qualified

Search volume and difficulty are snapshots from the local July 16–17 research packages. They are not represented as fresh July 20 Keyword Planner data. Blank volume means unknown, not zero.

| Keyword | Observed monthly searches | KD | Funnel layer | Decision |
|---|---:|---:|---|---|
| mortgage calculator | 368,000 | 73 | L2 | High-value sitewide tool opportunity. Improve `/calculators`; do not publish another generic article. |
| Toronto building permit | 2,400 | 2 | L2 | Official-source intent. Use as secondary context in a project-specific permit and zoning navigator. |
| garden suite | 1,900 | 0 | L1 | Ambiguous head term with non-ADU contamination. Use as a synonym; target the Toronto plural variant. |
| development applications Toronto | 1,900 | 0 | L2 | Upstream municipal intent. Useful support traffic but not a lending money-page title. |
| Toronto zoning / Toronto zoning bylaw | 1,600 each | 0 | L1 | Authority-led. Translate rules into project and financing readiness and cite the City. |
| MLI Select | 1,600 | 0 | L2 | P0 commercial cluster. CMHC owns the definition; FairLend should own eligibility modelling and execution. |
| mortgage broker Toronto | 1,300 | 27 | L4 | Valuable umbrella term but broader than this project-financing campaign. Keep on `/borrowers` as P2. |
| construction financing | 880 | 10 | L4 | Highest qualified construction-lending head term and the primary target for `/construction-financing-ontario`. |
| garden suites Toronto | 590 | 5 | L2 | Best qualified garden-suite head term because geography disambiguates the search. |
| construction mortgage | 590 | 0 | L4 | Co-primary construction synonym for the same Ontario money page. |
| construction lien | 390 | 0 | L5 | Urgent but legally adjacent. Use only as a secondary rescue topic with a legal-advice boundary. |
| Toronto garden suites | 210 | 5 | L2 | Same canonical feasibility hub as `garden suites Toronto`. |
| construction mortgage Ontario | 170 | 0 | L4 | Strong local transactional modifier for title and H1 testing. |
| construction financing Canada variants | 140 each | 0–17 | L4 | Relevant secondary language; retain Ontario service boundaries and do not create thin national pages. |
| construction to permanent financing | 110 | 20 | L3 | Strong comparison topic that connects construction approval to take-out risk. |
| commercial construction loan | 110 | 0 | L4 | Qualified money-page term requiring a commercial project branch. |

### Volume traps deliberately excluded or constrained

| Term | Observed volume | Treatment | Reason |
|---|---:|---|---|
| grey gardens Toronto | 5,400 | Exclude | Hotel, film, and cultural intent; not an accessory-dwelling query. |
| realtor mortgage calculator | 2,400 | Exclude | Branded/navigational competitor intent and a poor fit for FairLend's project-financing campaign. |
| garden suite Edmonton | 140 | Exclude | Wrong service geography. |
| roof financing | 110 | Exclude | Consumer home-improvement financing is outside the defined construction-lending cluster. |
| garden suite Brampton / Mississauga | 90 each | Defer | Valid local intent but location pages should ship only when FairLend can provide municipality-specific rules, proof, and unique content. |
| garden suite | 1,900 | Constrain | Retained as a secondary semantic term; the unmodified SERP is not clean enough to be the primary target. |

## Five-layer funnel operating model

### L1 — Awareness and education

**Searcher question:** What is this, and is it relevant to my property or project?

Primary jobs:

- Define construction mortgages, garden suites, laneway suites, multiplexes, and MLI Select in Canadian terminology.
- Establish Ontario and Toronto applicability.
- Route regulatory questions to current primary sources.
- Introduce the one-to-four versus five-plus unit financing distinction early.

Winning content:

- Plain-language definitions followed by a visual process.
- A property or project-type selector.
- Official-source links with `last reviewed` dates.
- Contextual links to L2 tools rather than a hard application CTA.

Primary canonical pages: `/garden-suite`, `/construction-financing-ontario`, `/resources/toronto-multiplex-financing-guide`, `/resources/mli-select-requirements-points`, and `/resources/toronto-permit-zoning-navigator`.

### L2 — Project feasibility

**Searcher question:** Can this project work on my site, with my equity, budget, rent, and timeline?

Primary jobs:

- Capture the largest tool and feasibility demand.
- Model cost, loan amount, draw timing, rental income, and MLI Select points.
- Turn municipal constraints into lending-readiness consequences.
- Give a credible go/no-go or needs-review outcome.

Winning content:

- Interactive calculators with assumptions visible next to results.
- Cost and rent ranges with dates, sources, and sensitivity bands.
- Permit, zoning, and required-document checklists.
- Save/share/export functionality where the tool supports a borrower conversation.

Primary canonical pages: `/calculators`, `/garden-suite`, `/construction-draw-financing`, `/resources/toronto-multiplex-financing-guide`, `/mli-select`, and the two proposed requirements navigators.

### L3 — Planning and comparison

**Searcher question:** Which structure is best, what will it cost, and what trade-offs am I accepting?

Primary jobs:

- Compare private versus institutional construction financing.
- Compare HELOC, refinance, construction mortgage, bridge, and take-out structures.
- Explain the fourplex/fiveplex underwriting break and MLI Select versus conventional paths.
- Show process, timeline, documents, risks, and exit requirements.

Winning content:

- Neutral comparison matrices based on project facts.
- Worked scenarios instead of unsupported rate claims.
- Explicit `best fit / poor fit` criteria.
- Internal links from each comparison to the correct L4 qualification page.

Primary canonical pages: `/construction-financing-ontario`, `/construction-draw-financing`, `/garden-suite-financing-gta`, `/resources/toronto-multiplex-financing-guide`, and `/resources/mli-select-requirements-points`.

### L4 — Financing qualification

**Searcher question:** Who can fund this project, do I qualify, and what do I need to apply?

Primary jobs:

- Capture the highest commercial construction terms.
- Demonstrate lender access, underwriting expertise, execution process, licensing, and local proof.
- Branch by property type, unit count, stage, loan size, and exit strategy.
- Convert qualified users through a project-specific intake rather than a generic contact form.

Winning content:

- Exact-match title/H1 alignment without keyword stuffing.
- Lender-fit and documentation matrices.
- An anonymized case table: project, challenge, capital stack, draw/take-out solution, and outcome.
- Clear qualification boundaries and no approval guarantees.

Primary canonical pages: `/construction-financing-ontario`, `/garden-suite-financing-gta`, `/multiplex-financing-gta`, `/mli-select`, and `/borrowers` for the broad broker term.

### L5 — Immediate transaction problem

**Searcher question:** My lender, draw, budget, appraisal, or take-out failed. What can I do now?

Primary jobs:

- Diagnose the failure mode quickly.
- Collect the documents required for a cost-to-complete and rescue review.
- Explain realistic bridge, replacement-lender, equity, and take-out options.
- Separate financing guidance from legal advice.

Winning content:

- Problem-first headings matching `declined`, `stopped draw`, `shortfall`, `unfinished`, and `deadline` language.
- A triage flow using remaining cost, as-is/as-complete value, liens, current advance, equity, and deadline.
- A response-time commitment only if FairLend operations can consistently meet it.
- A focused CTA that requests the minimum viable rescue file.

Primary canonical page: `/resources/construction-financing-rescue`, with narrower rescue sections on `/garden-suite-financing-gta`, `/multiplex-financing-gta`, and `/mli-select`.

## Canonical page architecture

```text
/calculators                                      L2 — sitewide feasibility tools
/borrowers                                        L4 — broad Toronto broker intent

/garden-suite                                     L1–L3 — legality, cost, ROI, feasibility
/garden-suite-financing-gta                       L3–L5 — structure, qualification, shortfall
/resources/toronto-permit-zoning-navigator        L1–L2 — official-source readiness support

/construction-financing-ontario                   L1, L3, L4 — broad construction money page
/construction-draw-financing                      L2–L3 — DrawFlow schedule/tool authority
/resources/construction-financing-rescue          L5 — declined/stalled/stopped-draw problems

/resources/toronto-multiplex-financing-guide      L1–L3 — feasibility and unit-count decisions
/multiplex-financing-gta                           L4–L5 — qualification and financing gaps

/resources/mli-select-requirements-points         L1–L3 — requirements, fees, points, comparison
/mli-select                                       L2, L4, L5 — program-fit and financing execution
```

One keyword still belongs to one layer even when a page spans layers. The page is allowed to answer multiple compatible intents; the primary heading, tool, CTA, and internal-link destination must still reflect the dominant page job.

## Why the current winners rank — and how FairLend beats them

### Garden and laneway suites

The [City of Toronto garden-suites page](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/) wins authority-led queries because it is the primary source for zoning, permits, performance standards, and current regulatory changes. Builder pages then win commercial queries by pairing cost and feasibility language with local project imagery.

FairLend should not attempt to impersonate the municipal source. It can create a stronger borrower journey by combining official-rule citations with:

- a property eligibility decision tree;
- a date-stamped cost and rental-income model;
- financing capacity based on equity, budget, and draw timing;
- a garden versus laneway distinction;
- project examples and a lender-ready document export;
- a clean handoff from `/garden-suite` to `/garden-suite-financing-gta`.

### Construction lending

Current construction results include exact-match specialist domains and pages such as [Ontario Construction Loans](https://www.ontarioconstructionloans.ca/), [Burke Financial](https://burkefinancial.ca/construction-financing/), [LendingHub](https://lendinghub.ca/construction-financing), and [Grewal Mortgage Advisory](https://grewaladvisory.ca/builder-financing). They win through strong title alignment, Ontario modifiers, plain-language explanations, draw mechanics, and broad product coverage. Many remain vulnerable because their tools, citations, cases, document requirements, and rescue workflows are thin or absent.

FairLend's advantage should be a three-page system rather than one overloaded article:

1. `/construction-financing-ontario` captures broad and qualification demand.
2. `/construction-draw-financing` owns draw schedules, calculators, and templates.
3. `/resources/construction-financing-rescue` owns decline, stopped-draw, shortfall, and failed-take-out intent.

Each page should contain original underwriting logic, anonymized outcomes, and reciprocal internal links. That creates more useful information gain than expanding word count alone.

### Multiplex lending

Observed volume remains unavailable for the most commercially relevant multiplex phrases. That is a measurement limitation, not proof of zero demand. Multiplex content should therefore be prioritized by business fit, first-party impressions, regulatory momentum, and adjacency to construction and MLI Select.

The research guide should own feasibility and the one-to-four/five-plus decision. `/multiplex-financing-gta` should own lender, qualification, and live financing-gap intent. Both pages need examples that state unit count, conversion/construction scope, equity, stabilized income, and exit route.

### MLI Select

The [official CMHC MLI Select page](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect?ap=a1-p1) owns program facts. FairLend can win downstream searches by making those facts executable:

- a sourced and date-stamped points estimator;
- requirements and fee tables with links to CMHC;
- affordability, energy, and accessibility evidence checklists;
- comparison against standard/conventional financing;
- construction-to-take-out sequencing;
- a project-readiness review CTA.

## Content specifications for the P0 clusters

| Page | Required differentiated modules | Primary conversion |
|---|---|---|
| `/construction-financing-ontario` | Project-type selector; capital-stack diagram; lender-fit matrix; draw and take-out timeline; qualification checklist; anonymized cases | Submit project facts for lender-path review |
| `/construction-draw-financing` | Draw schedule calculator; editable template; inspection and holdback explanation; cash-flow stress test; draw failure prevention | Export schedule or request draw-structure review |
| `/resources/construction-financing-rescue` | Failure-mode triage; cost-to-complete calculator; required document list; bridge/replacement/take-out paths; legal boundary | Submit urgent rescue file |
| `/garden-suite` | Garden versus laneway selector; zoning source panel; cost and rent model; ROI sensitivity; permit checklist | Calculate project feasibility |
| `/garden-suite-financing-gta` | HELOC/refi/construction/private comparison; equity and draw requirements; lender-fit flow; shortfall section; case proof | Request financing assessment |
| `/resources/toronto-multiplex-financing-guide` | Unit-count branch; zoning and permit sources; conversion budget; one-to-four versus five-plus matrix; MLI eligibility handoff | Complete readiness checklist |
| `/multiplex-financing-gta` | Acquisition/conversion/construction branches; DSCR and equity inputs; lender documents; financing-gap section; cases | Submit multiplex financing file |
| `/resources/mli-select-requirements-points` | Points estimator; official-source requirements; fees; comparison table; document export; last-reviewed date | Export readiness report |
| `/mli-select` | Program-fit summary; lender and insurer process; construction take-out sequence; execution timeline; case proof | Request MLI Select review |

## Internal linking rules

1. L1 definitions link to the nearest L2 feasibility tool using descriptive anchors.
2. L2 results link to one L3 comparison and one L4 money page based on the user's result.
3. L3 matrices link to the relevant L4 qualification section rather than a generic homepage.
4. L4 pages link to L5 only when the user identifies a decline, shortfall, stopped draw, or deadline.
5. L5 rescue pages link back to L2/L3 resources only after the immediate triage path.
6. Municipal and CMHC pages are cited as primary authorities; FairLend pages explain application and financing consequences.
7. Do not create a second construction draw-schedule URL. The existing `/construction-draw-financing` route is canonical.

## 90-day execution sequence

### Days 0–30: capture validated commercial demand

1. Create `/construction-financing-ontario` around `construction financing`, `construction mortgage`, and Ontario/Toronto variants.
2. Refresh `/garden-suite` for `garden suites Toronto` with cost, ROI, eligibility, and current City sources.
3. Expand `/garden-suite-financing-gta` and `/multiplex-financing-gta` around qualification and case evidence.
4. Upgrade `/construction-draw-financing`; cancel or consolidate the proposed duplicate draw-schedule resource.
5. Confirm whether `/mli-select` is a CMS route. Create one canonical hub if it is not.

### Days 31–60: add information gain

1. Publish the MLI Select requirements/points estimator.
2. Publish the multiplex feasibility guide.
3. Publish the Toronto permit/zoning navigator as a supporting authority asset.
4. Add structured FAQ only for visible questions and add appropriate service, breadcrumb, and software/application schema where eligible.
5. Add contextual links across all five layers and remove conflicting target anchors.

### Days 61–90: capture urgent intent and prove outcomes

1. Publish the construction rescue page and cost-to-complete intake.
2. Add at least three anonymized, compliance-reviewed case studies to construction, garden-suite, multiplex, and MLI clusters.
3. Build expert review and last-reviewed metadata for municipal and program-sensitive content.
4. Re-run Search Console query-to-page analysis and split a cluster only when distinct SERPs or sustained impressions prove separate intent.

## Measurement plan

Track performance by page and funnel layer, not by raw ranking count alone:

- non-brand impressions and clicks for each qualified traffic anchor;
- top-10 and top-3 coverage for P0 clusters;
- calculator starts, completions, exports, and assisted applications;
- qualified project submissions by originating page and funnel layer;
- internal-link progression from L1/L2 to L4;
- rescue submissions with complete minimum viable files;
- query cannibalization where more than one FairLend URL receives impressions for the same normalized term;
- content freshness for every rule, fee, and program statement.

Do not set traffic targets by adding the volume of close synonyms. Establish baselines after indexing, then forecast with unique query families, observed rank, CTR, and lead quality.

## Evidence and limitations

- Volume and KD values come from the repository's OpenSEO trial dated 2026-07-16 and expansion dated 2026-07-17, plus explicitly labelled historical rows in the July 19 landing-service package.
- The current provider flow did not return fresh metrics for most long-tail terms. Those values remain blank and `unavailable-not-zero` or an equivalent exact-request status.
- Live SERP checks on 2026-07-20 confirmed authority-heavy municipal and CMHC intent and commercial construction pages with exact-match/local alignment. SERPs remain volatile and should be revalidated before changing titles or splitting URLs.
- Search volume does not measure lead quality. Multiplex, rescue, and garden-suite financing terms may be commercially valuable at low or unreported volume.
- Legal, zoning, CMHC, rate, fee, and underwriting content requires dated primary sources and qualified review.

## Deliverables

- [`traffic-prioritized-keyword-universe.csv`](traffic-prioritized-keyword-universe.csv) — 85 normalized keywords with funnel, traffic, evidence, priority, and canonical URL fields.
- [`page-cluster-map.csv`](page-cluster-map.csv) — 12 page clusters with page jobs and cannibalization boundaries.
- [`coverage-qa.csv`](coverage-qa.csv) — machine-readable quality checks.
- [`research-summary.json`](research-summary.json) — compact package metadata and decisions.

