# FairLend editorial, data, and authority moat

## Executive recommendation

FairLend should not try to win by publishing a high volume of generic mortgage articles. The site should become the most useful Ontario reference for decisions that sit between property development, private mortgage structure, construction cash flow, and insured takeout.

The defensible model has four connected layers:

1. **A reviewed editorial corpus** that answers the questions already present on FairLend's commercial pages in much greater depth.
2. **Decision tools** that model costs, timing, capital gaps, and exits rather than merely calculating a monthly payment.
3. **Versioned datasets and benchmarks** built from official sources plus privacy-safe aggregates from FairLend's own files and partner network.
4. **Real third-party corroboration** from regulators, professional associations, partners, authors, media, and community participation—not self-created profiles whose only purpose is a `sameAs` link.

The first objective is not “publish a blog.” It is to build a small information institution with transparent methods, named expertise, citable findings, and tools that professionals actually send to clients.

## What the audit and repository actually show

The audit's criticism is accurate at the production-content layer, but the implementation foundation is stronger than the wording implies.

- Production has 17 indexable sitemap URLs but **zero published post URLs**. `/posts` has roughly 39 main-content words.
- No live page currently emits `Article` or `BlogPosting` because no post is published.
- Five core YMYL pages already have a named licensed reviewer, current review dates, primary sources, and concise answer-first passages.
- The Payload `posts` collection already supports authors, drafts, scheduled publishing, related posts, SEO fields, standard articles, and full-width “money page” layouts.
- The post route already emits `BlogPosting`, `WebPage`, `BreadcrumbList`, and `Person` JSON-LD.
- A reusable comparison block already renders an accessible HTML table with fit-check, route-comparison, and decision-matrix variants.
- Reusable proof/case-file and editorial-review components already exist.
- The major author gap is that the current user model contains only a name. It does not yet hold a public profile URL, biography, credentials, licence identifier, headshot, specialties, external profiles, or reviewed articles.
- Thin production pages include `/borrowers`, `/investing`, `/garden-suite`, `/garden-suite-financing-gta`, and `/multiplex-financing-gta`. These are immediate consolidation or expansion opportunities.
- External entity discovery is weak. The current audit found regulatory corroboration but no clearly discoverable FairLend Ontario company presence on LinkedIn, YouTube, Reddit, or Wikipedia, and one legacy directory listing associates the principal's current phone number with an older brand.

This means the fastest path is to publish and operationalize what is already scaffolded, then add data and tool primitives—not rebuild the CMS.

## The strategic position to own

Use a consistent editorial thesis:

> FairLend explains the complete financing decision: property, capital stack, cash-flow timing, downside, and exit.

That is narrower and more defensible than “mortgage advice,” but broad enough to connect four commercially valuable audiences:

- Ontario borrowers considering institutional, B-lender, or private routes
- small builders and missing-middle developers
- private mortgage investors
- brokers, agents, architects, planners, lawyers, builders, and other referral partners

The editorial promise should be equally clear:

- show the assumptions;
- show the total cost, not only the rate;
- show when cash is needed, not only how much can be borrowed;
- show what can fail;
- distinguish official source data from FairLend analysis;
- never imply approval, a rate, a return, or a legal outcome;
- state who wrote, reviewed, and last materially updated the work.

## Recommended information architecture

Because there are no published posts, this is the cheapest possible moment to replace the generic public-facing `/posts` model before URLs accumulate links.

```text
/resources/                         Editorial and tool hub
  /guides/                          Durable reviewed explainers
  /comparisons/                     Decision tables and route comparisons
  /tools/                           Calculators, estimators, checklists
  /research/                        Data stories, benchmarks, surveys
  /datasets/                        Canonical dataset landing pages and downloads
  /case-studies/                    Anonymized, permissioned file narratives
  /authors/                         Public author/reviewer profiles
  /methodology/                     Research, calculator, and corrections policies
```

Commercial pages remain where they are and act as cluster pillars. Each resource supports one primary commercial pillar and links naturally to two or three sibling resources. Commercial pages link back to every relevant resource.

If changing post routes is not desirable, keep the underlying Payload collection named `posts` and change only the public URL and navigation language. Redirect `/posts` to `/resources`. There is effectively no article migration risk because the published corpus is empty.

## P0 quick wins: use assets and copy that already exist

These are not speculative new initiatives. They are editorial packaging work using content, blocks, illustrations, and subject-matter framing already in the repository.

| Quick win | Existing source | Publishable asset | Additional work | Strategic value |
|---|---|---|---|---|
| Turn the private-mortgage “hard questions” into a durable cost-and-exit guide | `/borrowers/private-mortgage-financing` | **Private Mortgage Cost and Exit Checklist for Ontario Borrowers** | Add worked examples, primary citations, reviewer, downloadable checklist | First real article; highly shareable by lawyers and brokers |
| Expand the existing exit-strategy section | Same page | **Seven Private Mortgage Exit Routes—and What Can Break Each One** | Scenario table and timeline | Owns an underserved decision, not a generic definition |
| Convert the page's fee discussion into a table | Same page | **Ontario Private Mortgage Cost Table: Interest, Lender Fee, Brokerage Fee, Legal, Appraisal, Renewal, Discharge** | Compliance-reviewed definitions and variable/range labels | Strong featured-snippet and AI citation structure |
| Reuse the institutional/private comparison | `/borrowers/institutional-mortgage` | **Institutional Mortgage vs B Lender vs Private Mortgage** | Add a third route, worked scenarios, qualification caveats | High-intent comparison asset |
| Expand “A bank no is a finding, not a diagnosis” | Same page | **Why a Mortgage Application Was Declined: Income, Property, Structure, or Timing?** | Decision tree and source links | Useful to borrowers without promising an approval route |
| Convert “How a draw should move” into a downloadable process | `/construction-draw-financing` | **Ontario Construction Draw Evidence Checklist** | Inspector/lawyer review; printable PDF and HTML version | Builders, PMs, brokers, and lenders can link and share it |
| Reuse existing draw-roadmap visual assets | Construction page and DrawFlow assets | **Construction Draw Timeline: Budget → Work → Evidence → Review → Release** | Replace marketing labels with an instructional diagram and alt text | Original visual asset with strong embed potential |
| Turn milestone/evidence copy into a table | Construction page | **What Evidence Is Commonly Requested at Each Construction Draw Stage?** | Clarify lender-specific variation | Long-tail search coverage and practical utility |
| Expand the existing “six layers” investor framework | `/investing/private-mortgage-lending` | **Six-Layer Private Mortgage Due-Diligence Framework** | Methodology, sample file, risks, downloadable worksheet | A branded framework others can cite |
| Reuse “rate is not the product; underwriting is” | Same page | **Why LTV Alone Does Not Define Private Mortgage Risk** | Loss-severity scenarios and valuation caveats | Differentiated investor education |
| Publish the recovery-process material separately | Same page | **What Happens When a Private Mortgage Borrower Misses a Payment in Ontario?** | Legal review; clearly distinguish education from legal advice | High-value, high-trust guide |
| Expand “what kills a garden-suite deal” | `/garden-suite-financing-gta` | **Garden Suite Financing Failure Modes: Equity, Permits, Budget, Utilities, and Draw Timing** | Toronto sources and scenario table | Links builders, architects, and homeowners |
| Consolidate duplicate/thin garden-suite routes | `/garden-suite` and `/garden-suite-financing-gta` | One authoritative financing pillar plus tools/resources | Select canonical intent and 301 the redundant page | Removes thinness and concentrates authority |
| Expand multiplex capital architecture | `/multiplex-financing-gta` | **Toronto Multiplex Capital Stack: Acquisition, Construction, Bridge, and Takeout** | Worked 2/3/4-unit examples | Connects missing-middle policy to real finance |
| Turn partner workflow into a reference | `/partners` | **When to Bring Financing Into a Small Residential Development** | Stage-gate checklist by profession | Partners can link from their own client resources |
| Reuse homepage “2023 costs / 2026 density” story | Homepage | **Toronto Residential Construction Cost and Density Timeline** | Replace internal narrative with sourced Statistics Canada and Toronto data | First original chart/data story |
| Reuse the homepage project-equation motif | Homepage | **Small-Builder Project Feasibility Worksheet** | Editable worksheet plus instructions | Lead-independent utility and partner shareability |
| Convert existing FAQs into source material, not 30 thin posts | Multiple pages | Four substantive guides with FAQ sections | Merge overlapping questions by intent | Avoids cannibalization and scaled-content signals |
| Replace the empty resource hub | `/posts` | A real resource index with four lanes: Borrow, Build, Invest, Partner | Hub copy, filters, featured resources | Removes the clearest “no corpus” signal immediately |
| Publish a methodology and corrections policy | Existing reviewed-content practices | **How FairLend Research and Mortgage Guidance Is Produced** | Formalize author, reviewer, source, update, corrections, and conflicts policy | Trust and citation readiness across the whole corpus |

## The first ten resources to publish

Publish a coherent cluster rather than eight unrelated posts.

1. **Private Mortgage Cost and Exit Checklist for Ontario Borrowers**  
   Primary pillar: private mortgage financing. Include the first reusable cost table and a printable one-page checklist.

2. **Private Mortgage Total-Cost Calculator**  
   Include interest by payment type, lender fee, brokerage fee, appraisal, legal estimate, renewal fee, discharge/payout assumptions, and holding period. Output both dollars and an explicitly defined “effective annualized cost” metric without presenting it as a statutory APR unless counsel confirms the methodology.

3. **Institutional vs B Lender vs Private Mortgage Decision Table**  
   Compare borrower/income fit, property fit, documentation, time, term, amortization, prepayment, fee model, exit requirement, and failure modes.

4. **Ontario Construction Draw Evidence Checklist**  
   Publish HTML, PDF, and spreadsheet formats. Each row should show stage, common evidence, who normally provides it, review dependency, cash-flow risk, and lender-specific caveat.

5. **Construction Draw Working-Capital Gap Calculator**  
   Model contractor deposits, work completed before inspection, holdbacks where applicable, evidence/review lag, lender release lag, contingency, change orders, and interest carry.

6. **Toronto Multiplex Capital Stack Guide**  
   Show acquisition, permits/pre-construction, construction, stabilization, and takeout. Use multiple scenarios, not one implied “typical” deal.

7. **FairLend MLI Select Points and Flexibility Calculator**  
   Screen basic program eligibility, calculate current affordability/energy/accessibility points, show the gap to the next 50/70/100-point flexibility tier, calculate affordable-unit and rent-threshold requirements, and generate the corresponding document-readiness plan. Make every result preliminary, versioned, and traceable to current CMHC material.

8. **Toronto Development Potential and Planning Context Explorer**  
   Let a user search an address and inspect official zoning context, residential-zone category, overlays, exceptions/legacy-by-law warnings, multiplex/garden/laneway-suite screening paths, permit/development activity, and the financing decisions each path creates. It must expose uncertainty and link to formal City review rather than issue a zoning opinion.

9. **Six-Layer Private Mortgage Due-Diligence Framework**  
   Convert the existing investor narrative into a branded, citable framework with a sample blank worksheet.

10. **FairLend Ontario Construction Finance Conditions Index: inaugural edition**  
   Combine official rate, construction-cost, permit, and housing-start series into a transparent index or dashboard. Publish the methodology and the underlying normalized CSV.

The first six create immediate utility. The seventh and eighth create repeat-use interactive discovery products. The ninth establishes branded expertise. The tenth begins the original-data and citation moat.

## High-value calculator and interactive-tool backlog

### Flagship product: Toronto Development Potential and Planning Context Explorer

This should be a major product, not a decorative map embedded in a blog post. The distinctive idea is to combine **official zoning context + visible uncertainty + project path + finance implications**.

The City of Toronto says most properties are governed by Zoning By-law 569-2013, but some remain subject to former municipal by-laws; Chapter 900/site-specific exceptions, amendments, appeals, and not-yet-consolidated changes can alter the result. The City also says the interactive map and office consolidation are convenience tools and that formal compliance should be confirmed through a zoning review and, where appropriate, a Zoning Applicable Law Certificate. FairLend's product therefore cannot truthfully return “approved,” “eligible,” or “you can build.” It should return a **screening status** and a verification path.

#### Product promise

> Enter a Toronto address to understand the property's published zoning context, which missing-middle paths may warrant professional review, what uncertainty is present, and what each path means for budget, timing, capital, and takeout.

This is the interactive zoning-map concept, deliberately named around **planning context** rather than “zoning eligibility” or “feasibility.”

#### MVP: useful without overclaiming

| Surface | MVP behaviour |
|---|---|
| Address search | Resolve a Toronto address or map point and show the matched geography/source timestamp |
| Published zone | Show the zone label/category and link directly to the official City map and applicable by-law chapter |
| Coverage status | Clearly distinguish 569-2013 coverage, former-municipality/grey-area coverage, and unresolved/no-data results |
| Overlays | Display available height and lot-coverage context plus any published policy/overlay layers the source data supports |
| Exceptions | Flag a Chapter 900 or site-specific exception and link to the official exception text; do not attempt to summarize every legal effect automatically |
| Missing-middle paths | Screen for multiplex, garden-suite, and laneway-suite paths using conservative published-zone/category rules |
| Uncertainty panel | Show recent/not-yet-consolidated amendment notices, legacy by-law warnings, data timestamp, and “professional confirmation required” items |
| Finance panel | Explain likely pre-construction, construction, draw, contingency, stabilization, and takeout questions for the selected project path |
| Next actions | Link to City information, Toronto Building, formal zoning review/Zoning Applicable Law Certificate, and relevant FairLend guide/calculator |
| Share/export | Create a dated, source-linked screening report URL/PDF with no statement of approval or compliance |

#### Advanced layers

1. Active and cleared building permits, filterable by work/project type and year.
2. Development Pipeline records, clearly separated from parcel-level zoning and geocoded only with a documented method.
3. Multiplex, garden-suite, laneway-suite, major-street, five-/sixplex, and other EHON policy/amendment layers where authoritative geometries exist.
4. Official Plan land-use designation and secondary-plan flags.
5. Height, lot coverage, policy-area, ravine/tree-protection, heritage, flood/environmental, transit, and other due-diligence prompts where licensed official data is reliable.
6. Nearby comparable permit activity—not property valuation or an implication that nearby permits establish entitlement.
7. Ward/neighbourhood summaries showing permits, applications, housing units, construction-cost conditions, and financing-model sensitivities.
8. A project-path toggle: duplex/triplex/fourplex, garden suite, laneway suite, small rental, acquisition/conversion.
9. “What changed?” version comparison for zoning and policy releases.
10. A finance handoff that carries only user-approved, non-sensitive scenario inputs into the multiplex/garden-suite pro forma.

#### The uncertainty model is the feature

Use explicit status labels:

- **Published candidate path:** the published zone/category appears to support further investigation.
- **Additional rule review required:** overlays, exceptions, lot/site facts, or project design control the answer.
- **Legacy by-law coverage:** the City map indicates a former municipal by-law or incomplete 569-2013 coverage.
- **Recent amendment check required:** a relevant amendment may not be consolidated in the current text/map.
- **Formal confirmation required:** only Toronto Building and the applicable formal process can confirm compliance.
- **Not enough data:** the tool cannot reliably match the address or required source layer.

Never use a green “eligible” badge. A carefully explained amber result is more trustworthy and more professionally useful than false certainty.

#### Data architecture and freshness

- Integrate only supported official/open-data downloads, APIs, or licensed map services. Do not scrape the City's interactive map UI.
- Toronto's official open-data stack includes downloadable zoning geometry/overlays, municipal address points, property boundaries, building outlines, active/cleared building permits, heritage and ravine layers; City Planning also exposes queryable ArcGIS services for zoning and planning context. Validate the licence and metadata of each resource separately.
- Treat mapped parcel boundaries and building dimensions as planning estimates, never a substitute for a legal survey. Do not depend on a City object ID remaining stable across refreshes.
- Store the source URL, licence, resource identifier, retrieved time, effective date when known, and checksum/version for every layer.
- Treat by-law text and amendment status as separately versioned sources from map geometry.
- Run automated freshness checks, but require human review before a rule/configuration change affects screening logic.
- Preserve the ruleset/version on every saved report so an old result can be reproduced.
- Toronto should be the first municipality. Do not market a uniform “GTA zoning map” until each municipality's data, rules, update cadence, and legal limitations are handled independently.
- For Open Government Licence – Toronto data, retain the applicable licence snapshot and use the required attribution; do not use City logos or imply that the City endorses FairLend's derived product.

#### SEO and linkability

- Index the canonical explorer landing page, methodology, data catalogue, change log, and substantive curated reports.
- Do **not** index arbitrary address-result URLs; they would create thin, duplicative, privacy-sensitive programmatic pages.
- Provide an accessible HTML result table and text summary for every map state.
- Publish embeddable ward/neighbourhood charts and downloadable aggregate datasets under clear reuse terms.
- Create companion guides: how to read a Toronto zone label, what Chapter 900 exceptions mean, 569-2013 versus former municipal by-laws, multiplex screening versus formal approval, and how zoning uncertainty changes a financing contingency.
- Pitch the tool to architects, planners, builders, realtor teams, housing-policy groups, journalism/data programs, and Toronto Open Data's project gallery after it demonstrates real utility.

#### Commercial connection without wrecking the utility

The map should give the useful result before asking for contact information. Optional actions can be:

- open the multiplex/garden-suite feasibility model with the screened path selected;
- generate a dated project-question list for an architect/planner;
- estimate the construction/draw capital gap;
- request a financing review;
- subscribe to zoning/data changes for a saved area without exposing a saved private address publicly.

### Private mortgage decision tools

| Tool | Inputs | Outputs | Defensible hook |
|---|---|---|---|
| **Private Mortgage Total-Cost Calculator** | Principal, rate, compounding/payment basis, term, fees, legal/appraisal, prepaid interest, renewal, discharge, holding period | Monthly payment if applicable, interest dollars, cash required at closing, total cost, annualized cost, exit sensitivity | Shows the cost stack that rate-only calculators hide |
| **Private Mortgage Exit Runway Calculator** | Closing date, term, extension assumptions, milestones for sale/refinance/construction, buffer | Latest safe start dates, risk flags, renewal exposure timeline | Treats exit as a project plan |
| **Blended Cost of a Second Mortgage** | First and second balances/rates/payments/fees | Weighted rate, blended monthly debt service, total dollars over holding period | Explains the whole debt position |
| **Refinance vs Second Mortgage Break-Even Tool** | Existing mortgage penalty, replacement rate, new fees, second-mortgage terms, expected hold | Break-even month and scenario comparison | Decision support instead of lead-capture bait |
| **Equity and LTV Cushion Visualizer** | Property-value range, mortgages, costs to sell/enforce, requested advance | LTV range, dollar cushion, sensitivity to valuation decline | Makes valuation uncertainty visible |
| **Renew or Exit a Private Mortgage?** | Current balance, renewal fee/rate, alternative financing costs, sale timing | Scenario matrix and break-even | Targets an urgent, linkable borrower problem |
| **Private Mortgage Commitment Comparator** | User enters two or three commitments | Normalized cost/term/prepayment/condition table | Vendor-neutral comparison worksheet; no lender ranking required |
| **Private Mortgage Document Readiness Checker** | Scenario and documents on hand | Missing-information checklist, not an approval score | High utility with low regulatory risk |
| **Power-of-Sale Cost Sensitivity Model** | Balance, property-value range, arrears, legal/carry/sale assumptions | Illustrative loss-severity waterfall | Valuable investor education; requires legal/compliance review |
| **Debt Consolidation Cost Horizon** | Debts, current payments/rates, proposed mortgage cost, behaviour assumptions | 12/24-month cash flow and total debt sensitivity | Avoids misleading monthly-payment-only claims |

### Construction and small-builder tools

| Tool | Inputs | Outputs | Defensible hook |
|---|---|---|---|
| **Construction Draw Working-Capital Gap Calculator** | Budget by trade/stage, deposits, billing timing, draw percentages, inspection/release lag, holdbacks, contingency | Peak cash gap, timing, interest carry, minimum liquidity buffer | Likely FairLend's strongest tool concept |
| **Draw Schedule Builder** | Stages, budget, completion thresholds, draw rules | Editable draw table, milestone calendar, PDF/CSV | Produces an artifact a builder can use with a team |
| **Interest Carry by Draw Calculator** | Draw dates/amounts, rate changes, term, fees | Monthly accrued/paid interest and total carry | More accurate than interest on full commitment |
| **Cost-to-Complete Stress Test** | Remaining budget, funds available, approved undrawn amount, contingency, overruns | Surplus/shortfall under base/downside cases | Directly useful for stalled or squeezed builds |
| **Change-Order Impact Calculator** | Change order, timing, margin/contingency, financing cost, schedule delay | Total project and financing impact | Turns a construction choice into a capital decision |
| **Construction Delay Carry Calculator** | Monthly soft costs, debt, rental/exit assumptions, delay | Cost per week/month and break-even impact | Highly quotable and easy to share |
| **Builder Liquidity Waterfall** | Cash, receivables, committed funds, deposits, payables, draws | Week-by-week liquidity position | Models timing rather than static net worth |
| **Construction Draw Evidence Pack Generator** | Stage and lender requirements | Customized checklist with upload manifest | Operationally useful to brokers and builders |
| **Project Feasibility Sensitivity Grid** | Land, hard/soft costs, units, rents/sale values, cap rate, debt | Scenario heatmap, margin, DSCR, equity need | Reuses the homepage equation as a real tool |
| **Stalled Build Triage Tool** | Stage, remaining work, liens/arrears, permit status, budget, available funds | Issue map and professional next-step checklist | Supports the Build Recovery positioning without promising funding |

### Garden suite, laneway suite, and multiplex tools

| Tool | Inputs | Outputs | Defensible hook |
|---|---|---|---|
| **Garden Suite Financing Stack Calculator** | Hard/soft costs, equity, existing debt, rent, rates, draw timing | Cash gap, debt service, indicative rent coverage, refinance/takeout scenarios | Focuses on finance, where existing cost calculators are weak |
| **Garden Suite Cost-to-Rent Break-Even Tool** | All-in cost, rent, vacancy, expenses, financing | Cash flow and simple payback/sensitivity | Must state that it is not an appraisal or investment recommendation |
| **Garden Suite Site-and-Finance Readiness Checklist** | Municipality, property facts, utilities, access, equity | Questions for planner/architect/lender; no automated zoning conclusion | Useful without pretending to replace zoning review |
| **Toronto Multiplex Pro Forma** | 2/3/4-unit configuration, rents, costs, timeline, financing | Development cost, stabilized NOI, DSCR, capital need | Connects zoning permission to feasibility |
| **Density Uplift Scenario Tool** | Existing property, proposed units, costs, rents/value | Incremental cost, income, and capital requirement | Original missing-middle decision layer |
| **Bridge-to-Takeout Calculator** | Construction debt, stabilized NOI, cap/rate assumptions, DSCR, amortization | Potential takeout range and remaining equity gap | Valuable even when MLI Select is not applicable |
| **Permit and Financing Timeline Planner** | Municipality, project type, current status, target start | Dependency-based planning timeline | Use official steps plus clearly labelled observed timing data |
| **Utility/Servicing Allowance Stress Test** | Service lengths, allowances, quotes, contingency | Budget sensitivity, not a cost quote | Addresses a common garden-suite surprise |

### MLI Select and rental-housing tools

FairLend should build the points calculator. The points calculation itself is a useful search and link asset; the durable differentiation is to connect it to **eligibility, the next achievable tier, affordable-rent/unit math, published flexibilities, documents, and the complete capital stack**.

#### Flagship product: FairLend MLI Select Points and Flexibility Calculator

The first release should answer seven questions in one flow:

1. Is this project within the basic published program scope?
2. Is it new construction or an existing property?
3. Which affordability, energy-efficiency, and accessibility pathways is the user modeling?
4. How many points does the current scenario produce?
5. What is missing to reach the next 50-, 70-, or 100-point tier?
6. What published LTV/LTC, amortization, recourse, and DCR framework corresponds to that tier?
7. What evidence and professional work would be required to support the modeled commitments?

The result is a **preliminary scenario**, not an eligibility decision, approval, insurance quote, term sheet, or confirmation that a commitment can be achieved. MLI Select currently requires at least 50 total points; below 50 should remain a useful scenario with an explicit gap-to-entry result.

#### Current scoring model to encode as versioned configuration

As of the July 2026 source review, CMHC's published framework includes:

| Category | New construction | Existing property | Points |
|---|---|---|---:|
| Affordability level 1 | At least 10% of units at no more than 30% of median renter income | At least 40% of units at no more than 30% of median renter income | 50 |
| Affordability level 2 | At least 15% of units at no more than 30% of median renter income | At least 60% of units at no more than 30% of median renter income | 70 |
| Affordability level 3 | At least 25% of units at no more than 30% of median renter income | At least 80% of units at no more than 30% of median renter income | 100 |
| Longer affordability commitment | 20 years or more rather than the 10-year minimum | 20 years or more rather than the 10-year minimum | +30 |
| Energy level 1 | At least 25% better than NECB Tier 1 or 20% better than NBC Tier 1 | At least 15% reduction from the current energy/GHG baseline | 20 |
| Energy level 2 | At least 50% better than NECB Tier 1 or 40% better than NBC Tier 1 | At least 25% reduction from the current energy/GHG baseline | 35 |
| Energy level 3 | At least 60% better than NECB Tier 1 or 70% better than NBC Tier 1 | At least 40% reduction from the current energy/GHG baseline | 50 |
| Accessibility level 1 | Published qualifying pathways plus 100% visitability/common-area baseline | Same | 20 |
| Accessibility level 2 | Published higher qualifying pathways plus 100% visitability/common-area baseline | Same | 30 |

For an existing property, score the tier achieved by both energy-consumption and greenhouse-gas reductions—the lower supported tier—not whichever input produces more points. The accessibility UI must reproduce the current qualifying pathways precisely and make the baseline explicit: CMHC currently states that all units must be 100% visitable under CSA B651:23 and common areas barrier-free under B651:23 for accessibility points. Do not reduce this to a vague “accessible building” checkbox.

The product rules are time-sensitive. CMHC identifies transition dates for energy attestation materials and publishes annual affordability/rent-increase inputs. Store rules in a reviewed configuration with `effectiveFrom`, `effectiveTo`, official source URL, document version, verified-at time, reviewer, and change note rather than hard-coding them in presentation components.

#### Basic scope/eligibility screen

Before points, ask:

- new construction or existing property;
- property/shelter model;
- total residential units;
- non-residential gross-floor-area and lending-value shares;
- market/location;
- whether the scenario relies on affordability, energy, accessibility, or a combination;
- whether the relevant commitments and evidence are planned, already achieved, or unknown.

The current official page states a five-unit minimum for eligible projects, except retirement homes with a 50-unit/bed minimum; it also says student housing can qualify only through energy efficiency and accessibility, and non-residential space must not exceed 30% of gross floor area or 30% of total lending value. These should be transparent screen rules with source links, not hidden rejection logic.

#### Affordability calculator

Do not ask users to determine affordability points themselves. Let them enter:

- market/CMA or accepted comparable-market scenario;
- unit count;
- unit mix if thresholds vary in the source data;
- proposed affordable-unit count;
- proposed rents;
- 10-year or 20+-year commitment.

Then calculate:

- minimum affordable units required at each tier, with ceiling/rounding logic shown;
- official median-renter-income source and vintage;
- the modeled maximum affordable rent under the published 30% test;
- which units/rents currently fit;
- revenue difference versus the user's non-committed scenario;
- 50/70/100 affordability points plus the 20+-year bonus only when an affordability level earns points and the longer commitment is selected;
- annual compliance/update obligations and the current source for permitted rent-increase treatment.

The median-income dataset and its market matching must be versioned. If CMHC has no data for a market, the tool should not silently choose a comparable centre; it should explain that an approved-lender/CMHC determination is required.

#### Energy and accessibility flows

These should be guided evidence flows, not self-certification:

- ask which code/model baseline applies;
- show the threshold for each point level;
- ask whether a qualified report/model/certificate exists;
- show the applicable official attestation/document route;
- mark user-entered targets as **planned**, **documented**, or **unknown**;
- prevent “planned” from being displayed as “achieved”;
- identify the professional review or certification needed.

#### Results screen

Show:

- points by category and total;
- current 50/70/100 tier;
- exact gap to the next tier;
- two or three possible gap-closing combinations, framed as scenarios rather than recommendations;
- published new-construction or existing-property LTV/LTC ceiling;
- published maximum amortization for the tier;
- published recourse framework and premium-discount tier, carefully phrased as subject to current CMHC/lender rules and underwriting;
- applicable published minimum DCR category: currently 1.10 for standard rental, 1.20 for other shelter models, and 1.40 for non-residential space;
- required documents, timing, and owner/professional for each commitment;
- unresolved assumptions and disqualifying/uncertain inputs;
- source version and “verified against CMHC on” date;
- save/share PDF and scenario link;
- a handoff to the capital-stack model.

Current published flexibilities should be represented as a separate sourced table:

| Points tier | New construction | Existing property | Published maximum amortization | Recourse | Current premium discount |
|---|---|---|---|---|---:|
| 50–69 | Up to 95% LTC | Up to 85% LTV | Up to 40 years | Full | 10% |
| 70–99 | Up to 95% LTC | Up to 95% LTV | Up to 45 years | Full | 20% |
| 100+ | Up to 95% LTC | Up to 95% LTV | Up to 50 years | Limited | 30% |

Use “up to” everywhere. The amortization cannot exceed remaining economic life, and points do not establish loan amount, value, cost eligibility, borrower capacity, experience, net worth, guarantee, final premium, approval, or lender appetite. The current 10%/20%/30% discount applies to the base premium plus applicable surcharges; it is not a percentage-point reduction in the premium rate.

#### What makes this better than a points quiz

1. **Gap-to-next-tier:** show whether 20 points, 30 points, or a different combination changes the published flexibility.
2. **Rent and unit math:** calculate the actual number of committed units and modeled rent threshold.
3. **Capital impact:** carry the tier, NOI, cost/value, rate, and amortization into DSCR/loan/equity scenarios.
4. **Commitment burden:** show documentation, timing, annual affordability compliance, and professional dependencies.
5. **Version history:** preserve the result under the rules and data vintage used on that date.
6. **Evidence state:** distinguish a target from a qualified professional's report/certification.
7. **Scenario comparison:** compare affordability-only, energy/accessibility, and blended paths side by side.

#### SEO and distribution package

- Canonical calculator page with server-rendered explanation and current threshold tables.
- Separate methodology and change-log pages.
- Current median-renter-income dataset landing page with source/vintage, market coverage, and download or official-source link as licensing permits.
- “MLI Select points explained” guide.
- “What 50 vs 70 vs 100 points changes” comparison.
- “How many affordable units do I need?” table by project size.
- Document-readiness matrix.
- Energy and accessibility evidence guides reviewed by qualified practitioners.
- Embeddable tier/points table with attribution.
- Saved user scenarios set to `noindex`; only the substantive canonical pages should be indexed.
- Outreach to rental-housing groups, developers, energy/accessibility consultants, accountants, architects, and mortgage professionals.

#### Companion MLI Select tools

| Tool | Inputs | Outputs | Differentiation |
|---|---|---|---|
| **MLI Select Points and Flexibility Calculator** | Project type, units, market/rents, commitment length, documented or planned energy/accessibility performance | Eligibility flags, point total, tier, next-tier gap, published flexibilities, evidence checklist | The authoritative front door to the full tool suite |
| **MLI Select Capital Stack Model** | Points/tier, project cost, NOI, bridge debt, rate, insurance premium assumptions | Construction-to-term capital stack, equity gap, carry | Goes beyond points to financeability |
| **MLI Select Affordability Commitment Model** | Units, market-specific threshold data, proposed rents, commitment term | Qualifying-unit count, revenue trade-off, sensitivity | Makes the commitment's operating impact visible |
| **MLI Select DSCR and Maximum-Loan Explorer** | NOI, rate, amortization, DSCR threshold | Debt-service capacity and constrained loan amount | Shows which constraint controls the result |
| **Energy Upgrade Finance Trade-off** | Upgrade cost, energy performance, points impact, financing terms | Incremental capital, potential financing benefit, payback sensitivity | Connects technical choice to capital structure |
| **Accessibility Upgrade Finance Trade-off** | Units/features/cost, points impact | Incremental cost and financing sensitivity | Same, with explicit accessibility-professional caveat |
| **MLI Select Document Readiness Matrix** | New/existing, affordability/energy/accessibility route | Required-document map, owner, timing, dependencies | Strong professional share asset |
| **Insured Takeout Readiness Tracker** | Construction, lease-up, documents, performance | Milestone status and unresolved conditions | Supports builders through the transition, not just application |

### Private mortgage investor tools

| Tool | Inputs | Outputs | Defensible hook |
|---|---|---|---|
| **Investor Net-Yield Stress Test** | Coupon, fees paid/received, servicing, arrears, delay, legal/recovery cost, loss | Base/downside net yield and capital timeline | Demonstrates why stated rate is not the return |
| **LTV vs Loss-Severity Explorer** | Value range, priority claims, sale costs, time, interest/legal costs | Recovery waterfall and sensitivity | Teaches risk more honestly than an LTV badge |
| **Mortgage Portfolio Concentration Heatmap** | Positions by geography, borrower, property type, maturity, lien position | Concentration and maturity flags | Useful as a downloadable spreadsheet even before software |
| **Maturity Ladder and Liquidity Planner** | Mortgage maturities and extension assumptions | Monthly capital-return ranges | Makes illiquidity visible |
| **First vs Second Mortgage Risk Comparator** | Deal facts | Structured diligence differences, not a universal score | A professional education tool |
| **Investor File Review Worksheet** | Mortgage/file details | Printable decision record and missing-items log | Reinforces documented decision discipline |

## Original charts and recurring data stories

Every chart should have:

- a permanent canonical URL;
- a one-sentence takeaway above the visualization;
- visible source, extraction date, geography, units, seasonal-adjustment status, and revision note;
- downloadable CSV and high-resolution PNG/SVG;
- alt text and an accessible HTML table;
- an embed or reuse policy with attribution wording;
- a methodology link;
- a “last updated” timestamp that changes only when data or analysis materially changes.

### Official-data-derived charts FairLend can publish quickly

These are original analysis or presentation, not original raw data. Attribute the underlying sources precisely.

1. Toronto residential building construction cost index since 2017.
2. Residential construction cost components by MasterFormat division in Toronto.
3. Toronto construction costs versus Ontario building-permit value trends.
4. Bank of Canada policy rate versus chartered-bank mortgage lending rates.
5. Rate changes translated into maximum debt supported by a fixed NOI and DSCR.
6. Ontario housing starts, completions, and units under construction over time.
7. Toronto building permits by project/work type and ward.
8. Toronto development-pipeline units by application status.
9. Garden-suite and multiplex permit counts over time, where the City data supports reliable classification.
10. Estimated garden-suite construction cost distribution from Toronto permit records, with strong caveats about declared/estimated permit values.
11. Months from application to permit for relevant Toronto permit classes, if dates and exclusions are reliable.
12. Missing-middle units proposed versus units completed.
13. Rental vacancy and average rent alongside construction-cost and interest-rate changes.
14. New-housing price index versus residential construction price index.
15. Ontario private-lending market statistics published in FSRA's annual/supervision material.
16. CMHC MLI Select affordability thresholds by market and year.
17. MLI Select points-to-incentive matrix as a versioned reference chart.
18. Construction-delay carry cost at different project-debt levels and rates.
19. Interest carry on a staged draw versus full-balance borrowing.
20. How a 5%, 10%, and 15% cost overrun changes equity need and takeout gap.
21. How cap-rate and NOI sensitivity changes maximum takeout proceeds.
22. Small project “capital stack over time” Sankey or waterfall examples.
23. Private mortgage total-cost composition across illustrative 6-, 12-, and 18-month holds.
24. Private mortgage exit runway by strategy: sale, institutional refinance, construction completion, estate resolution, debt paydown.
25. What happens to lender/investor equity cushion as valuation and enforcement costs change.

### First-party data charts that can become genuinely proprietary

Only publish when sample size and privacy thresholds are defensible. Label the sample as FairLend files or partner-submitted observations; never imply it represents all Ontario mortgages.

1. Median and distribution of days from complete file to commitment.
2. Median and distribution of days from commitment to funding.
3. Application-document gaps that most often delay review.
4. Reasons files do not proceed, grouped into income, property, leverage, timing, documentation, exit, and client-choice categories.
5. Private mortgage intended-use mix.
6. Requested versus funded amount bands.
7. First versus second mortgage mix.
8. LTV bands by property/project type.
9. Planned exit-route mix and how often the plan changes before funding.
10. Renewal/extension incidence and primary cause categories.
11. Construction-draw review and release-time distributions.
12. Draw-package deficiencies by stage.
13. Peak builder working-capital gap as a share of project budget.
14. Construction cost-overrun distribution by project type and stage discovered.
15. Change-order frequency and magnitude bands.
16. Time lost to incomplete evidence versus third-party review versus lender authorization.
17. Project stage at which FairLend or a financing professional was first engaged.
18. Multiplex/garden-suite budget composition by hard, soft, servicing, financing, and contingency costs.
19. Bridge-to-takeout duration distribution.
20. Investor opportunity rejection reasons.
21. Mortgage administration event frequencies: late payment, extension request, payout, enforcement referral.
22. Difference between stated coupon and realized timing-adjusted yield, only where calculation and disclosure are compliant.

### Partner and market surveys

These create external participation before publication, which makes distribution and links much easier.

1. **Ontario Small Builder Working-Capital Survey**—deposits, draw lag, contingency, change orders, and biggest cash-flow surprises.
2. **GTA Construction Draw Timing Benchmark**—anonymous responses from builders, brokers, quantity surveyors, appraisers, and lawyers.
3. **Toronto Missing-Middle Finance Barriers Survey**—architects, planners, builders, homeowners, and brokers.
4. **Garden Suite Permit and Financing Experience Survey**—budget, permit duration, utilities, funding route, and completion outcome.
5. **Mortgage Broker Complex-File Friction Survey**—why institutional files fall outside policy and when specialist support is engaged.
6. **Private Mortgage Exit Planning Survey**—borrower understanding before closing and which milestones cause delays.
7. **Ontario Private Mortgage Investor Due-Diligence Survey**—which documents and risk factors are actually reviewed.
8. **Construction Cost Contingency Survey**—budgeted versus consumed contingency by project type.
9. **Professional Handoff Survey**—where financing, design, permits, valuation, and legal work lose time between teams.

## Dataset products worth building

### 1. Ontario Construction Finance Conditions Index

**Purpose:** A monthly or quarterly pulse of how difficult it is to carry and finance small residential construction.

**Candidate components:** Bank of Canada rates, chartered-bank mortgage lending rates, Toronto/Ontario residential construction price indexes, building permits, housing starts, rental indicators, and FairLend's anonymized draw-lag observations when sufficient.

**Publication package:** Methodology, time series, normalized component table, interactive chart, quarterly interpretation, CSV, changelog.

**Link audiences:** builders, architects, planners, appraisers, housing reporters, economists, municipal-policy researchers.

**Important:** Do not create an arbitrary composite until weighting has a defensible rationale. It is acceptable to launch as a dashboard first and introduce a composite index after expert review.

### 2. GTA Construction Draw Timing Benchmark

**Purpose:** Show elapsed time from request preparation through evidence, inspection/review, authorization, and release.

**Data:** FairLend administration/draw events plus partner submissions. Store each phase separately so the analysis can identify where time is spent.

**Privacy controls:** Minimum cell sizes, date bucketing, no property addresses, no lender-level comparison without permission and counsel review.

**Link audiences:** builders, project managers, construction lawyers, lenders, brokers, quantity surveyors.

### 3. Toronto Missing-Middle Permit and Capital Tracker

**Purpose:** Connect permitted/proposed units to the financing and construction conditions that determine whether they get built.

**Data:** City of Toronto open permit/development-pipeline data, zoning/policy milestones, official rate and cost series, and clearly separate FairLend analysis.

**Link audiences:** planning organizations, councillors and staff, housing journalists, architects, neighbourhood groups, academics.

### 4. Ontario Private Mortgage Cost Benchmark

**Purpose:** Report total borrower cost by term, lien position, use, and loan-size band—not “best rates.”

**Data:** Anonymized funded files or a structured quarterly quote survey. Record rate, lender/broker fees, legal/appraisal, payment method, term, and actual holding period where available.

**Risk:** High compliance and selection-bias risk. Launch only with a strong methodology, sample disclosure, suppression policy, and clear statement that results are historical observations, not offers or market-wide pricing.

### 5. Small Residential Project Budget Library

**Purpose:** Publish anonymized budget structures for garden suites, multiplexes, single-family builds, and conversions.

**Data:** Percentage shares and broad bands are safer and more reusable than exact project/address data. Separate hard cost, soft cost, permits, servicing, contingency, financing, and taxes.

**Link audiences:** homeowners, builders, architects, planners, appraisers, real-estate publications.

### 6. Mortgage File Readiness Dataset

**Purpose:** Quantify the information gaps that delay or stop complex mortgage files.

**Data:** Controlled taxonomy of missing/deficient items at intake and review. Publish only aggregate counts and time impact.

**Link audiences:** brokerages, training providers, compliance teams, borrower education publishers.

## Large editorial idea bank

### Private mortgage borrower cluster

1. What a private mortgage is—and what it is not—in Ontario.
2. Private mortgage total cost: a line-by-line worked example.
3. Private mortgage rate versus total dollar cost.
4. First private mortgage versus second private mortgage.
5. Private mortgage versus B-lender mortgage.
6. Private mortgage versus refinancing the existing first mortgage.
7. Private mortgage exit strategies ranked by dependency and time risk.
8. How much exit runway is enough?
9. What happens if the exit is not ready at maturity?
10. Renewal and extension fees: questions to ask before signing.
11. Open, closed, and minimum-interest terms in private mortgages.
12. How appraised value, market value, and lender value can differ.
13. LTV explained with a valuation range instead of one number.
14. How private lenders evaluate non-traditional income.
15. Financing an urgent closing without creating an impossible exit.
16. Using home equity for debt consolidation: monthly relief versus total cost.
17. Bridge financing when a sale has not closed.
18. Private mortgages for tax or estate-related deadlines: what professionals must coordinate.
19. Documents needed for a private mortgage review.
20. A plain-language guide to a private mortgage commitment.
21. Questions to ask the broker, lender, appraiser, and lawyer.
22. Why a fast approval is not the same as a good structure.
23. Common reasons a private mortgage file does not fund.
24. Timeline from first review to funding.
25. What changes after the mortgage closes?

### Institutional and alternative lending cluster

1. Why an institutional lender declines a mortgage application.
2. Income-policy mismatch versus affordability failure.
3. Property-policy mismatch: rural, mixed-use, condition, and unusual properties.
4. Lowest rate versus best total commitment.
5. Comparing prepayment, portability, term, amortization, and conditions.
6. How multiple credit inquiries and lender submissions work.
7. Self-employed borrower document map.
8. Rental-income treatment: why lender calculations differ.
9. When to repair the file and reapply versus use a bridge.
10. Institutional refinance exit plan after a private mortgage.
11. A lender-route decision tree with no approval promises.
12. What “complete file” means for an institutional application.

### Construction financing cluster

1. Construction draw financing from commitment to final draw.
2. Draw schedule example for a small Ontario residential build.
3. What work must be completed before a draw request?
4. Construction draw evidence checklist.
5. Who prepares, reviews, and authorizes each draw document?
6. Why completed work and released cash rarely occur on the same day.
7. How to calculate the working-capital gap between draws.
8. Contractor deposits and materials ordered before draw eligibility.
9. Construction lien holdbacks and financing cash flow—legal-review edition.
10. Interest carry on progressive draws.
11. Cost-to-complete analysis explained.
12. How lenders treat contingency.
13. Change orders: project decision, cash-flow event, and financing event.
14. Budget overruns discovered before versus after framing.
15. Inspection, quantity-surveyor, appraisal, invoice, and photo evidence.
16. What causes a draw request to be delayed?
17. Draw request package template.
18. Construction delay cost per week.
19. Stalled-build triage: budget, title, liens, permits, contractor, and capital.
20. Rescue financing without pretending financing fixes project execution.
21. Construction loan maturity and extension planning.
22. From final draw to occupancy, stabilization, and takeout.
23. Building a lender-ready construction budget.
24. A first-time builder's financing readiness guide.
25. Why a preset calendar is not a draw schedule.

### Garden suite, laneway suite, and multiplex cluster

1. Garden suite total project cost categories.
2. Financing a Toronto garden suite: refinance, HELOC, second mortgage, construction facility, or cash.
3. Garden suite cost-versus-rent sensitivity.
4. Garden suite site constraints to raise with qualified planning/design professionals.
5. Utilities and servicing as a budget and timing risk.
6. Garden suite permit-to-financing dependency map.
7. Why cost-per-square-foot estimates fail on small detached units.
8. Garden suite draw schedule example.
9. Garden suite financing document checklist.
10. Toronto garden-suite permit and cost data report.
11. Multiplex zoning permission versus financeability.
12. Two-, three-, and four-unit capital-stack examples.
13. Multiplex acquisition plus construction financing.
14. Stabilized NOI, valuation, and takeout for a multiplex.
15. Converting a house into multiple units: budget and finance decision map.
16. The missing-middle financing gap.
17. Construction bridge to insured or conventional takeout.
18. What happens if rents, costs, rates, or completion dates miss the base case?
19. Architects' guide to early-stage financing inputs.
20. Realtors' guide to recognizing a site that needs financing review before offer.

### MLI Select and rental-housing cluster

1. MLI Select points explained with official-source citations.
2. What the MLI Select score does—and does not—determine.
3. Affordability commitments and the operating pro forma.
4. Energy-efficiency commitments and documentation dependencies.
5. Accessibility commitments and project-team dependencies.
6. MLI Select document-readiness matrix.
7. Insurance premium, amortization, DSCR, and maximum-loan interaction.
8. Construction financing before MLI Select takeout.
9. Bridge-to-takeout timeline and carry.
10. Five-plus-unit versus small-multiplex financing routes.
11. New construction versus existing-property requirements.
12. Rental project financeability: NOI, DSCR, value, cost, equity, and execution.
13. Operating-cost stress testing for purpose-built rental.
14. Rent, vacancy, cap rate, and rate sensitivity table.
15. Why a high MLI Select score does not guarantee a financeable project.

### Private mortgage investor cluster

1. Private mortgage investing structure in Ontario.
2. Registered mortgage security in plain language.
3. Stated rate versus realized investor return.
4. LTV versus loss severity.
5. First and second mortgage risk differences.
6. Property valuation: appraisal, review, and sensitivity.
7. Borrower capacity and exit analysis.
8. Title, priority, taxes, and other claims.
9. Mortgage documentation and independent legal advice.
10. Mortgage administration after funding.
11. Arrears, default, enforcement, and recovery timeline.
12. Interest accrual does not create liquidity.
13. Extension risk and maturity ladders.
14. Geographic, borrower, property, and maturity concentration.
15. Whole-loan versus fractional/syndicated participation considerations.
16. Investor file-review checklist.
17. Questions to ask a brokerage and administrator.
18. Historical case file: performing mortgage from review to payout.
19. Historical case file: extension with a changed exit plan.
20. Historical case file: enforcement/recovery with all outcomes and caveats.

### Partner-facing cluster

1. Broker handoff checklist for construction finance.
2. Realtor pre-offer development-finance checklist.
3. Architect/planner feasibility inputs lenders will eventually need.
4. Builder draw-package checklist.
5. Lawyer closing-readiness checklist for complex mortgage files.
6. Appraiser information package for construction and private mortgage files.
7. When a quantity surveyor or cost consultant may be required.
8. Client ownership, consent, compensation, and role clarity in referral relationships.
9. How to hold a project finance kickoff with all advisors.
10. The project decision log: scope, cost, capital, timing, and exit.

### Timely analysis without becoming a news treadmill

1. Bank of Canada rate decision: what changed in the model, not a generic recap.
2. Quarterly Toronto construction-cost update.
3. Quarterly permit and missing-middle pipeline update.
4. Annual FSRA private-mortgage sector findings explained.
5. CMHC MLI Select program-update change log.
6. Toronto zoning/by-law changes: financing implications after legal/planning review.
7. Annual FairLend Construction Finance Conditions report.
8. Annual Ontario Private Mortgage Cost Benchmark.

## Make every asset citation-ready

### Article anatomy

Every substantive guide should contain:

1. A direct, self-contained answer in the opening 40–60 words.
2. A “What this guide covers” box.
3. A named author and a separately named licensed reviewer when appropriate.
4. Visible published and materially updated dates.
5. A concise “Key findings” block with specific, attributable statements.
6. At least one useful table, diagram, worked example, or downloadable artifact.
7. Inline primary-source citations attached to the claim they support.
8. A “What varies by lender/file/municipality” section.
9. A limitations and non-advice disclosure appropriate to the topic.
10. Three to five contextual internal links per roughly 1,000 words.
11. A sources list and a correction/contact route.
12. A reviewer sign-off and next review date for fast-changing material.

Do not manufacture 134–167-word passages just to hit an AI-citation heuristic. Write self-contained sections that can stand alone, then edit them for clarity and attribution.

### Author and reviewer system

Extend the author model to include:

- public slug/profile URL;
- full name and role;
- biography focused on relevant experience;
- licence/certification names, identifiers, regulator URLs, and validity date where applicable;
- specialties and geographic scope;
- headshot and accessible alt text;
- LinkedIn and other verified professional profiles;
- disclosure/conflict statement;
- articles authored and articles reviewed;
- profile creation and modification dates.

Create `/resources/authors/elie-soberano` and equivalent pages only for real contributors. Link article authors to these pages. The current name-only `Person` nodes are technically valid but weak for entity disambiguation.

### Structured data plan

Use structured data to describe visible truth, not to compensate for missing content.

| Page type | Recommended types/properties | Notes |
|---|---|---|
| Editorial guide | `BlogPosting` or `Article`, `WebPage`, `BreadcrumbList`, `Person`, `Organization` | Include author URL, publisher, headline, representative images, `datePublished`, `dateModified`, and canonical entity IDs |
| Author/reviewer profile | `ProfilePage` with `mainEntity: Person` | Add verified `sameAs`, licence identifier, job title, image, works-for relationship where visible |
| Dataset landing page | `Dataset` plus `DataDownload` distributions | Include name, description, creator, licence, version, temporal/spatial coverage, variables, methodology, `isBasedOn`, and CSV URL |
| Calculator | `WebApplication` and `WebPage` where truthful | Describe functionality; do not invent ratings, offers, or prices to chase a rich result |
| Original chart | `ImageObject` linked to the article/dataset | Include caption, creator, copyright/licence, content URL, representative alt text in HTML |
| Explainer video | `VideoObject` | Include upload date, thumbnail, duration, description, and content/embed URL |
| Commercial service page | Existing `Service`, `FinancialService`, `WebPage`, breadcrumbs | Keep claims synchronized with visible text |

Google's current official documentation supports Article, ProfilePage, and Dataset structured data. Dataset markup belongs on a canonical landing page with explicit provenance and downloads; it is not a licence to copy an official dataset and call it proprietary.

Visible FAQ sections remain useful, but FairLend should not treat `FAQPage` markup as a major Google rich-result opportunity for a commercial mortgage site. It is not the strategic fix for the missing corpus.

## Dataset and research governance

This is what turns “original data” from a marketing claim into a credible asset.

### Required metadata for every release

- dataset title and stable identifier;
- version and release date;
- coverage period and geography;
- unit of observation;
- inclusion and exclusion criteria;
- source systems and collection method;
- variable definitions and data dictionary;
- missing-data handling;
- revision policy;
- privacy/suppression policy;
- known biases and limitations;
- author, analyst, and reviewer;
- licence/reuse terms;
- citation format;
- CSV/XLSX download and checksum if practical;
- changelog.

### Privacy and compliance guardrails

- Never publish names, addresses, exact property combinations, lender identities, or dates that enable re-identification without explicit permission and legal review.
- Use bands for loan size, LTV, project cost, geography, and time.
- Establish a minimum publishable cell size; start conservatively at 10–20 records depending on sensitivity.
- Suppress complementary cells when totals could reveal a hidden value.
- Separate borrower marketing consent from research-data use and document the lawful basis for aggregation.
- Have the principal broker/compliance owner approve taxonomies and narrative interpretations.
- For legal-process guides, use a qualified Ontario lawyer as a named reviewer.
- For zoning or planning tools, state that site-specific confirmation belongs with the municipality and qualified planning/design professionals.
- For calculators, version formulas and assumptions, and regression-test outputs when data or rules change.

## Third-party entity corroboration plan

The objective is not “create more profiles.” It is to make the same real-world entity legible across independent, reputable sources.

### P0: repair and normalize

1. Correct the legacy Mortgage Intelligence directory listing that uses the current phone number under the old brand.
2. Standardize the legal name, authorized operating name, Unit 2 address, phone, domain, licences, and principal-broker naming everywhere.
3. Confirm the website, FSRA records, Google Business Profile, LinkedIn company page, principal's LinkedIn, Bing Places, Apple Business Connect, and major professional directories use compatible facts.
4. Add `sameAs` only after a profile is live, public, controlled, and factually complete.
5. Create a source-of-truth entity record internally so future listings do not drift.

### P1: credible owned profiles

1. A complete LinkedIn company page with legal/operating identity, services, address/service area, licences, website, and actual recurring publications.
2. A complete principal-broker LinkedIn profile with current brokerage, licence, experience, speaking, research authorship, and accurate prior affiliations.
3. A YouTube channel for short, substantive explainers. Each research release should have one five-minute methodology/finding video and several short excerpts.
4. A properly maintained Google Business Profile with appointment-only context, accurate category, photos, services, and a compliant review process.
5. Bing/Apple business listings where applicable.

Owned profiles help disambiguation, but they are not independent corroboration. The next layer matters more.

### P1–P2: independent corroboration

1. **Regulator:** Keep FSRA brokerage, administrator, and individual licence records prominent and accurate.
2. **Associations:** Maintain profiles and contribute resources through legitimate memberships such as mortgage-broker, builder, rental-housing, or local business organizations that FairLend actually qualifies for.
3. **Partner profiles:** Ask real partner firms to list FairLend in team/resource/referral pages where the relationship genuinely exists. Provide them with useful co-authored resources, not reciprocal-link boilerplate.
4. **Expert review:** Invite Ontario lawyers, planners, appraisers, quantity surveyors, energy consultants, accessibility professionals, and builders to review assets within their scope. Give each reviewer a public credit and link to their real profile/firm.
5. **Media:** Pitch findings, not the company. “GTA draw requests spend X days in evidence/review/release phases” is pitchable; “FairLend launched a blog” is not.
6. **Podcasts/webinars:** Principal-broker or builder/operator appearances should teach one concrete framework and point to a public worksheet or dataset.
7. **Municipal/housing groups:** Offer reusable charts and data notes to planning organizations, affordable-housing groups, missing-middle advocates, and municipal-policy communities without demanding a commercial endorsement.
8. **Academic and student use:** Publish clean CSVs, methodology, and citation instructions so housing, planning, and construction-management programs can reference the work.
9. **Professional education:** Turn the draw checklist and capital-stack model into accredited or association-hosted education only if FairLend can meet the relevant standards.
10. **Community answers:** Participate under real identities in Reddit, LinkedIn discussions, webinars, and forums with useful answers. Do not seed fake questions, conceal affiliation, or mass-drop links.

### Wikipedia and Wikidata

Do not treat Wikipedia as an SEO listing. A FairLend article is appropriate only after the organization has sustained, independent, reliable-source coverage that satisfies notability; routine directories, press releases, and sponsored pieces do not establish that. If notability does not exist, the correct strategy is to do notable work and earn coverage—not create an article.

Wikidata should likewise describe a genuinely supported entity, not act as a fabricated corroboration endpoint.

## Link-earning design

### Build a link reason into each asset

Every major asset needs at least one explicit reason another site would cite it:

- **reference utility:** a canonical table or definition;
- **workflow utility:** a checklist/template used in a real process;
- **calculation utility:** a model unavailable elsewhere;
- **new fact:** a proprietary benchmark or survey result;
- **local specificity:** Toronto/Ontario data or rules assembled cleanly;
- **visual reuse:** a chart or diagram offered under clear attribution terms;
- **expert consensus:** a multi-professional guide with transparent reviewers;
- **freshness:** a recurring series with stable URLs and dependable updates.

### Pre-publication distribution loop

1. Choose one audience and one decision the asset resolves.
2. Recruit three to eight qualified contributors/reviewers before writing.
3. Ask what data/table/tool they already wish existed.
4. Produce the asset and give contributors a factual preview, not editorial veto over conclusions.
5. Publish a canonical HTML page plus downloadable formats.
6. Give contributors a concise launch note, chart image, citation, and embed code.
7. Pitch journalists and organizations with the finding and methodology.
8. Publish a LinkedIn carousel/video that points to the canonical asset.
9. Answer relevant community questions transparently and link only when the asset directly resolves the question.
10. Update the same URL on a published cadence instead of creating a new thin page every month.

### Likely link audiences by asset

| Asset | Natural citing audiences |
|---|---|
| Private mortgage total-cost calculator | consumer-finance writers, mortgage brokers, real-estate lawyers, credit counsellors, borrower educators |
| Construction draw checklist | builders, PMs, brokers, QS firms, appraisers, construction lawyers, building associations |
| Working-capital gap calculator | builders, accountants, suppliers, construction-management educators, lenders |
| Missing-middle permit/capital tracker | planners, architects, housing journalists, municipal-policy groups, academics |
| Garden-suite finance model | architects, design-build firms, homeowner publications, realtor teams, city-policy discussions |
| MLI Select capital-stack model | rental-housing groups, developers, energy/accessibility consultants, brokers, accountants |
| Investor due-diligence framework | investor educators, lawyers, accountants, mortgage-industry publications |
| Quarterly conditions dashboard | media, associations, research newsletters, economic-development and housing groups |

## What not to do

- Do not publish 100 generic “what is a mortgage?” posts to fill the empty archive.
- Do not create one article per FAQ when several questions share the same search intent.
- Do not use unsourced “average private mortgage rate” or cost ranges.
- Do not label analysis built on government data as “FairLend proprietary data.” Call it FairLend analysis of named sources.
- Do not scrape competitor rates or rank lenders without permissions, methodology, and legal/compliance review.
- Do not publish address-level mortgage or construction data.
- Do not gate the only useful version of a linkable asset behind a lead form. Offer the valuable HTML/tool openly; make saving, exporting, or requesting help optional.
- Do not change `dateModified` for trivial template edits or automated refreshes with no material content change.
- Do not fabricate reviews, contributors, Reddit conversations, awards, media logos, Wikipedia notability, or association memberships.
- Do not rely on schema alone. Markup describes authority signals; it does not create them.
- Do not promise a calculator is an approval, appraisal, quote, legal opinion, or investment recommendation.

## 30/60/90-day execution plan

### Days 1–14: establish the publication system

1. Decide public resource URLs and redirect `/posts` before publishing.
2. Extend authors to real public profiles with credentials and external identifiers.
3. Publish methodology, corrections, conflicts, calculator-disclaimer, and data-privacy policies.
4. Create reusable source-note, data-note, worked-example, table, chart, download, reviewer, and changelog components.
5. Validate live `BlogPosting`, `Person/ProfilePage`, breadcrumbs, dates, images, and canonical URLs.
6. Publish the private-mortgage cost/exit guide.
7. Publish the institutional/B/private comparison table.
8. Publish the construction draw evidence checklist in HTML and PDF/CSV.
9. Replace the empty resource hub with real navigation and cross-links.
10. Correct the legacy old-brand listing and normalize public entity facts.

### Days 15–30: ship the first utility moat

1. Launch the Private Mortgage Total-Cost Calculator.
2. Launch the Construction Draw Working-Capital Gap Calculator.
3. Launch the MLI Select Points and Flexibility Calculator MVP using versioned CMHC rules and median-income data.
4. Publish the Six-Layer Investor Due-Diligence Framework.
5. Publish author/reviewer profiles and verified LinkedIn/company profiles.
6. Add downloadable worksheets and reuse terms.
7. Recruit the first external professional reviewers, including energy/accessibility expertise for the MLI Select flow.
8. Instrument tool starts, completions, exports, citations/referrers, and consultation handoffs without collecting unnecessary sensitive data.

### Days 31–60: build local data authority

1. Publish the Toronto residential construction-cost chart and methodology.
2. Publish the Toronto multiplex capital-stack guide and pro forma.
3. Launch the garden-suite financing-stack tool rather than another generic cost calculator.
4. Release the Toronto Development Potential and Planning Context Explorer beta with zoning context, uncertainty states, official links, and permit/development layers.
5. Publish the map data catalogue, methodology, coverage limitations, and change log.
6. Connect the MLI Select points result to affordability math, DSCR/maximum-loan sensitivity, and the document-readiness matrix.
7. Start collecting structured draw-timing events and file-readiness taxonomies internally.
8. Convene a five-to-ten-person professional review panel for the first benchmark.
9. Begin a quarterly YouTube/LinkedIn research explanation cadence.

### Days 61–90: release the first original benchmark

1. Publish the first GTA Construction Draw Timing Benchmark or Small Builder Working-Capital Survey—whichever reaches a defensible sample first.
2. Release methodology, CSV, chart pack, and citation/reuse instructions on permanent URLs.
3. Pitch the findings to targeted housing, planning, construction, and mortgage publications.
4. Publish two anonymized, permissioned case files that show assumptions, process, outcome, and limitations.
5. Review GSC query/page data, earned links, downloads, tool completion, and assisted consultations.
6. Refresh the next-quarter editorial roadmap based on actual user questions and citations, not raw publishing volume.

## Prioritization scorecard

Score proposed work from 1–5 on each dimension:

- commercial relevance;
- user decision value;
- link/citation potential;
- data defensibility;
- FairLend-specific expertise;
- maintenance feasibility;
- compliance risk, reverse-scored;
- production effort, reverse-scored.

Suggested first-wave ranking:

| Asset | Decision value | Linkability | Defensibility | Effort | Priority |
|---|---:|---:|---:|---:|---|
| Construction Draw Working-Capital Gap Calculator | 5 | 5 | 5 | 4 | P0 |
| Private Mortgage Total-Cost Calculator | 5 | 4 | 4 | 3 | P0 |
| Ontario Construction Draw Evidence Checklist | 5 | 5 | 4 | 2 | P0 |
| Institutional/B/Private Decision Table | 5 | 3 | 4 | 1 | P0 |
| MLI Select Points and Flexibility Calculator | 5 | 5 | 5 | 3 | P0 |
| Six-Layer Investor Due-Diligence Framework | 4 | 4 | 5 | 2 | P0 |
| Toronto Multiplex Capital Stack Guide | 5 | 4 | 4 | 3 | P1 |
| Garden Suite Financing Stack Calculator | 5 | 4 | 4 | 4 | P1 |
| Toronto Development Potential and Planning Context Explorer | 5 | 5 | 4 | 5 | P1 flagship |
| Construction Finance Conditions Dashboard | 4 | 5 | 5 | 4 | P1 |
| GTA Draw Timing Benchmark | 5 | 5 | 5 | 5 | P1/P2 once sample is valid |
| Ontario Private Mortgage Cost Benchmark | 5 | 5 | 5 | 5 | P2 after compliance/data maturity |

## Measurement

Track outcomes at the asset and cluster level.

### Search and discovery

- indexed canonical resource URLs;
- non-branded impressions and clicks by cluster;
- queries that reach tools, research, and comparison pages;
- rich-result/structured-data validity;
- Bing and Google crawl/index status;
- AI citation/brand-mention sampling across Google AI features, ChatGPT, Perplexity, and Copilot, documented as directional rather than exhaustive.

### Authority

- new referring domains to resources, not only the homepage;
- percentage from Ontario, housing, construction, finance, legal, academic, government, or professional sources;
- unlinked brand mentions;
- chart embeds, dataset citations, and partner-resource links;
- independent profiles with consistent entity facts;
- journalist/researcher requests.

### Product utility

- calculator starts and completions;
- planning-context map address searches, completed screening reports, layer usage, and official-review click-throughs;
- MLI Select scenarios completed, next-tier comparisons, document plans, and capital-model handoffs;
- CSV/PDF/worksheet downloads;
- repeat visits to dashboards;
- copy/share/embed actions;
- percentage of tool users who request a review after receiving a useful result;
- qualitative questions and corrections submitted.

### Editorial quality

- percentage with named author and qualified reviewer;
- percentage reviewed within the promised cadence;
- primary-source coverage;
- correction turnaround;
- internal link coverage and orphan count;
- content consolidated or retired when obsolete.

Do not use word count or number of posts as success metrics.

## Official source library

These are strong starting points for reproducible assets. Confirm terms/licences and the exact series before automating redistribution.

### Housing and construction

- [Statistics Canada construction statistics](https://www.statcan.gc.ca/en/subjects-start/construction)
- [Statistics Canada Building Construction Price Index table 18-10-0289-02](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810028902)
- [Statistics Canada technical guide for the Building Construction Price Index](https://www150.statcan.gc.ca/n1/pub/62f0014m/62f0014m2025001-eng.pdf)
- [CMHC Housing Market Information Portal](https://www03.cmhc-schl.gc.ca/hmip-pimh/en/Help/Toc)
- [CMHC data table export guidance](https://www03.cmhc-schl.gc.ca/hmip-pimh/en/Help/tables)
- [CMHC MLI Select official page](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)
- [CMHC MLI Select required-document guide](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-required-document-en.pdf)
- [CMHC MLI Select at-a-glance PDF](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)
- [CMHC MLI Select median renter income workbook](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/median-income-before-tax-renter-total-en.xlsx)
- [CMHC multi-unit fees and premiums sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf)

### Rates and mortgage-sector context

- [Bank of Canada statistics](https://www.bankofcanada.ca/rates/)
- [Bank of Canada Valet API guide](https://www.bankofcanada.ca/valet-api-how-to/)
- [Bank of Canada interest rates for new and existing chartered-bank lending](https://www.bankofcanada.ca/rates/banking-and-financial-statistics/interest-rates-for-new-and-existing-lending-by-chartered-banks/)
- [FSRA mortgage-brokering consumer information](https://www.fsrao.ca/consumers/mortgage-brokering)
- [FSRA mortgage-brokering sector supervision plan](https://www.fsrao.ca/industry/mortgage-brokering/regulatory-framework/supervision/mortgage-brokering-sector-supervision-plan-2025-26)

### Toronto and Ontario planning/open data

- [City of Toronto Development Pipeline dataset](https://open.toronto.ca/dataset/development-pipeline/)
- [City of Toronto note on cleared building-permit data](https://open.toronto.ca/exploring-cleared-building-permits/)
- [City of Toronto Zoning By-law open dataset](https://open.toronto.ca/dataset/zoning-by-law/)
- [City Planning ArcGIS map service](https://gis.toronto.ca/arcgis/rest/services/cot_geospatial11/MapServer)
- [City of Toronto municipal address points](https://open.toronto.ca/dataset/address-points-municipal-toronto-one-address-repository/)
- [City of Toronto property boundaries](https://open.toronto.ca/dataset/property-boundaries/)
- [City of Toronto building outlines](https://open.toronto.ca/dataset/topographic-mapping-building-outlines/)
- [Open Government Licence – Toronto](https://open.toronto.ca/open-data-licence/)
- [City of Toronto Zoning By-law 569-2013 and interactive-map limitations](https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/zoning-by-law-569-2013-2/)
- [City of Toronto multiplex considerations and formal-confirmation guidance](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/considerations-when-building-multiplexes/)
- [City of Toronto garden-suite rules and source links](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/)
- [City of Toronto multiplex study and amendments](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/multiplex-study-2-4-units/)
- [City of Toronto open-data gallery](https://open.toronto.ca/gallery/)
- [Ontario land-use planning resources](https://www.ontario.ca/page/land-use-planning)
- [Ontario land registry overview](https://www.ontario.ca/page/overview-land-registry)

### Search and structured data

- [Google Article structured-data documentation](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google ProfilePage structured-data documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google Dataset structured-data and provenance guidance](https://developers.google.com/search/docs/appearance/structured-data/dataset)
- [Google byline date guidance](https://developers.google.com/search/docs/appearance/publication-dates)
- [Google general structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

## The durable end state

Within six to twelve months, the site should not look like a brokerage with a blog. It should look like the source a borrower, builder, investor, broker, lawyer, planner, or journalist uses when they need to understand an Ontario financing decision.

The clearest signs that the strategy is working will be:

- partner firms send clients to a FairLend worksheet before the first call;
- journalists reuse a FairLend chart because the source and method are clean;
- builders use the draw-gap model in project planning;
- other mortgage professionals cite the cost and exit tables even when they are not referring a deal;
- search and AI systems can identify who produced and reviewed each claim;
- FairLend's entity is corroborated by real regulator, professional, partner, media, and community sources;
- new research compounds on stable URLs instead of disappearing into a dated post archive.

That is the moat: not content volume, but useful decisions, attributable expertise, and evidence other people can safely cite.
