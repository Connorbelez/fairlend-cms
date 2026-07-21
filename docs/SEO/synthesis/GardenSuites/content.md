# Garden and Laneway Suite SEO Content Recommendations

> This is the consolidated implementation recommendation derived from the corpus. Source-era alternatives and conflicts remain visible; the final architecture is a synthesis, not a claim that every dated artifact made the same decision.

## Final information architecture

| Route | Role | Primary intent | Disposition |
|---|---|---|---|
| `/garden-suite-financing-gta` | Transactional Garden/Laneway financing money page | Commercial investigation and qualification | Retain, replace the thin implementation, self-canonicalize, and make it the financing conversion owner. |
| `/resources/garden-suite-cost-toronto` | Toronto cost, feasibility, permit, and official-source hub | Informational, local feasibility, cost research | Create as the authoritative resource and tool owner. The implementation plan is [authority-page-plan.md](authority-page-plan.md). |
| `/garden-suite` | Existing thin informational route | Overlapping informational intent | Merge unique content into the resource hub and 301 to `/resources/garden-suite-cost-toronto`. Remove from sitemap after redirect. |
| No standalone Laneway route in v1 | Explicit differentiated sections within both canonical pages | Shared feasibility and financing | Do not create a thin route without validated standalone demand; preserve terminology, permit, access, and financing distinctions within both pages. |

## Route-decision history and conflicts

| Source-era recommendation | Evidence/status | Resolution in this synthesis |
|---|---|---|
| Keep `/garden-suite` and `/garden-suite-financing-gta` only if one is an eligibility tool and one is financing; otherwise avoid overlap. | Audit identified both as thin and missing schema/social depth. [S267](../../strategy/seo-audit.md) | Separate the intents through a resource hub and financing owner; do not retain two thin commercial/ambiguous routes. |
| Replace `/garden-suite-financing-gta`; consolidate `/garden-suite` into `/garden-suite-financing-gta/feasibility`. | Trial page-opportunity decision, high confidence. [S158](../../research/openseo/trial-2026-07-16/deliverables/page-opportunities.csv) | Preserve the two-page intent model, but use the later `/resources/` convention and later cost-hub path. |
| Refresh existing `/garden-suite` as a P0 service/overview asset. | Landing-services funnel treated it as the target path. [S053](../../research/keyword-and-funnel/landing-services-funnel-2026-07-19/service-opportunities.csv) | Superseded by the stronger consolidation evidence; unique content is retained before redirect. |
| Create `/resources/garden-suite-cost-toronto/`. | Expansion defines a P1 cost/feasibility model and 25-keyword cluster. [S076](../../research/openseo/expansion-2026-07-17/deliverables/content-asset-map.csv) | Adopt as `/resources/garden-suite-cost-toronto`, using the site's no-trailing-slash canonical convention. The later `/resources/garden-suites/` placeholder remains a redirect alias only. |
| One authoritative financing pillar plus tools/resources; 301 the redundant route. | Editorial/data authority recommendation. [S016](../../authority-and-distribution/content-assets/seo-editorial-data-authority-brainstorm.md) | Adopt. |
| Include `/garden-suite-financing-gta` in the launch/indexing priority set. | Search-indexing runbook. [S026](../../measurement-and-indexing/fairlend-search-indexing-launch-runbook.md) | Retain as the transactional canonical and indexing priority. |

## Transactional money page: `/garden-suite-financing-gta`

### Search task and promise

Help Toronto/GTA homeowners and small project sponsors understand whether an eligible Garden or Laneway Suite project has a plausible financing route, what evidence lenders need, how funding options differ, and what must be resolved before a financing assessment. Do not promise property approval, program eligibility, rent acceptance, rate, leverage, or funding.

### Required page sections

1. Answer-first definition of the financing task and the Garden/Laneway distinction.
2. Fit checklist: property control, municipality, project type, existing mortgage/equity, budget, contingency, income/credit, permits/design stage, desired start date, and rental/occupancy plan.
3. Financing comparison using equivalent assumptions: refinance, HELOC, second mortgage, construction financing, and currently verified public programs.
4. Cost-to-capital bridge: soft costs, site/servicing, hard costs, contingency, financing/carry, lease-up, and ongoing debt service.
5. Appraisal and projected-rent evidence: what can be considered, what requires lender/appraiser confirmation, and why projected rent is not automatically qualifying income.
6. Process timeline: feasibility and budget → design/permit evidence → appraisal and application → deposits/equity → advances/draws → completion → long-term debt service or takeout.
7. Garden vs Laneway financing/permit differences, with direct official-source links.
8. Documents and evidence checklist: property, mortgage, borrower, plans, permits, budget, contracts/quotes, contingency, appraisal/rent, draw schedule, insurance, and exit/ongoing-payment plan.
9. Failure modes: insufficient equity, unsupported budget, access/servicing/tree constraints, permit uncertainty, missing contingency, lender/product mismatch, draw-timing gaps, and unsupported rent/value claims.
10. Reviewed FAQ content answering the corpus question bank; no FAQPage rich-result promise.
11. Primary CTA: `Get a project financing assessment`; secondary CTA to the cost/feasibility resource and printable readiness checklist.

### Suggested metadata

- **Title:** `Garden Suite Financing in Toronto & GTA | FairLend`.
- **H1:** `Garden and Laneway Suite Financing in Toronto and the GTA`.
- **Description:** explain equity, refinance/HELOC/second/construction options, project evidence, and a licensed financing assessment without approval language.
- **Canonical:** `https://www.fairlend.ca/garden-suite-financing-gta`.

## Informational resource: `/resources/garden-suite-cost-toronto`

### Required modules

1. Short dated answer with cost range basis and estimate disclaimer.
2. Input-driven cost model with visible assumptions and print/export view.
3. Cost categories: design/consultants, permits/charges, demolition/site work, utilities/servicing, hard construction, contingency, financing/carry, lease-up, and operating costs.
4. Cost drivers: size, storeys, access, trees, servicing, existing structures, soil/site conditions, finishes, procurement, and delivery method.
5. Toronto official-source navigator for zoning, preliminary review, permit guide, trees, variances, certified plans, permit status, development charges, and parkland context.
6. Garden-vs-Laneway comparison covering definitions, lane/access/fire route, geometry, structures, servicing, trees, and property-specific review.
7. Return model based on rent, operating expenses, incremental property-value uplift, or whole-property outcome—never generic standalone suite sale proceeds.
8. Long-term vs short-term rental status and caveats with current municipal, tax, lender, and insurer sources.
9. Financing timeline and link to the transactional money page.
10. Methodology, assumptions, update log, corrections policy, author/reviewer, and downloadable worksheet/checklist.

### Suggested metadata

- **Title:** `Toronto Garden Suite Cost & Feasibility Guide | FairLend`.
- **H1:** `Toronto Garden Suite Cost and Feasibility Guide`.
- **Canonical:** `https://www.fairlend.ca/resources/garden-suite-cost-toronto`.

## Redirect, canonical, and sitemap rules

- Inventory and merge every unique `/garden-suite` passage before redirecting.
- Implement one-hop `301 /garden-suite → /resources/garden-suite-cost-toronto`; update all internal links and remove the old URL from XML and HTML sitemaps. Treat `/garden-suites` and `/resources/garden-suites` as redirect aliases only.
- Both retained pages self-canonicalize and appear once in the appropriate sitemap with CMS-derived `lastmod`.
- Do not canonicalize a redirected or materially different page instead of redirecting it.
- Submit/index only after server-rendered content, metadata, canonicals, schema, internal links, analytics events, and redirect checks pass.

## Internal-link architecture

| Source | Destination | Context/anchor intent |
|---|---|---|
| Homepage and borrower hub | Financing page | Garden/Laneway project financing pathway. |
| Construction-draw financing | Financing page | Small residential project, draw timing, and completion funding. |
| Refinance, renovation, HELOC/home-equity content | Financing page | Compare existing-equity routes with project-specific financing. |
| Multiplex and rental-housing resources | Both pages | Distinguish ancillary-suite economics and 1–4-unit vs 5+ boundaries. |
| Resource hub and zoning/planning navigator | Cost/feasibility resource | Toronto property, permit, cost, and feasibility research. |
| Cost/feasibility resource | Financing page | Move from researched budget/property fit to financing assessment. |
| Financing page | Cost/feasibility resource | Resolve property, budget, permit, and cost questions before applying. |
| Partner/builder/architect resources | Both pages | Early-stage evidence checklist, failure modes, and referral timing. |

## Original assets and authority moat

- Garden-suite cost and feasibility calculator with source date, range assumptions, scenario inputs, and export.
- Address-aware Toronto planning-context explorer that screens rather than issues zoning opinions.
- Garden/Laneway property-fit checklist and financing-readiness worksheet.
- Permit and program status log with update dates, official links, jurisdiction, and open/closed/unknown status.
- Anonymized budget structures and case files with permission, cohort size, formulas, exclusions, and reviewer notes.
- Failure-mode guide covering equity, permits, budget, utilities, contingency, draw timing, and unsupported assumptions.
- Multi-format outputs: HTML, printable PDF, spreadsheet/export, diagrams, and short video only when the same reviewed evidence can be maintained.

## Structured data and review requirements

- Money page: `Service`, `WebPage`, `BreadcrumbList`, `Organization`, and reviewer/author `Person` relationships where supported by visible content.
- Resource: `Article` or appropriate `WebPage`, `BreadcrumbList`, `Person`, `Organization`, and visible `datePublished`/`dateModified`.
- Calculator: describe the interactive tool visibly and add applicable software/application markup only if the live functionality and fields support it.
- Never add `HowTo` schema. Keep FAQ material as visible page content; do not recommend new commercial `FAQPage` markup for Google rich-result benefit.
- Display author, licensed reviewer, licence identifier where appropriate, reviewed date, jurisdiction, methodology, primary sources, corrections path, and material limitations.

## Conversion and compliance

- Primary conversion is a project-financing assessment, not an instant quote or approval.
- Capture municipality/address, project type, stage, budget, contingency, existing mortgage/equity, timing, and contact details progressively.
- Gate rate, fee, leverage, program availability, qualification, projected rent, and property-permission claims behind current evidence and licensed review.
- Use `site-specific`, `screening only`, `subject to lender/appraiser/municipal review`, and dated-source language where applicable.
- Do not represent FairLend as the planner, designer, builder, appraiser, municipality, or legal/tax adviser.

## Rollout and measurement

1. **Prelaunch:** baseline GSC queries/pages, GA4 entrances/events, indexation, current internal links, and both existing Garden URLs.
2. **Content migration:** merge `/garden-suite`, publish both canonical pages, implement redirect, metadata, schema, review layer, and internal links.
3. **Technical launch:** verify status/canonical/robots/sitemap/rendered content, then request indexing for both retained pages.
4. **Weekly for 30 days:** indexation, canonical selection, redirect behavior, sitemap inclusion, internal links, structured data, event firing, and query mismatch.
5. **Days 28 and 56:** GSC query discovery, impressions, CTR, position distribution, page overlap/cannibalization, and emerging Garden-vs-Laneway demand.
6. **Day 90:** organic entrances, engaged sessions, resource-to-money-page clicks, assessment starts/completions, assisted conversions, and consolidate/refine/expand decision.
7. **Quarterly/material change:** revalidate zoning/program/cost/rate/fee/rent/tax and calculator inputs; update visible review dates only after review.

## Complete connected content records

Every non-empty structured field from URL, page, asset, linking, schema, conversion, and recommendation records is retained below.

| Record | Source locator(s) | Complete record |
|---|---|---|
| dist-001 | [S084](../../research/openseo/expansion-2026-07-17/deliverables/distribution-plan.csv) (row 2) | **id:** dist-001<br>**canonicalAsset:** Garden-suite cost model<br>**channel:** YouTube<br>**deliverable:** 8-12 minute assumptions walkthrough plus chapters<br>**purpose:** Compete in observed video surface and create quotable answer units<br>**publicationRule:** Publish only after canonical page sources and cost assumptions pass review<br>**measurement:** Video impressions \| engaged views \| page assists \| assessment starts |
| dist-002 | [S084](../../research/openseo/expansion-2026-07-17/deliverables/distribution-plan.csv) (row 3) | **id:** dist-002<br>**canonicalAsset:** Garden-suite cost model<br>**channel:** YouTube Shorts and social<br>**deliverable:** Three clips: cost categories \| site-condition surprises \| financing timeline<br>**purpose:** Create discovery hooks without duplicating unsupported ranges<br>**publicationRule:** Every number must match the reviewed canonical page<br>**measurement:** Qualified clicks \| saves \| assisted conversions |
| dist-003 | [S084](../../research/openseo/expansion-2026-07-17/deliverables/distribution-plan.csv) (row 4) | **id:** dist-003<br>**canonicalAsset:** Garden-suite cost model<br>**channel:** Reddit/forums<br>**deliverable:** Transparent expert answers to existing cost and feasibility questions<br>**purpose:** Build entity trust and learn language from real questions<br>**publicationRule:** No synthetic accounts no link drops no disguised promotion; disclose affiliation when relevant<br>**measurement:** Referral traffic \| branded searches \| question themes |
| dist-004 | [S084](../../research/openseo/expansion-2026-07-17/deliverables/distribution-plan.csv) (row 5) | **id:** dist-004<br>**canonicalAsset:** Garden-suite feasibility navigator<br>**channel:** Partner network<br>**deliverable:** Designer/realtor/builder review and checklist sharing<br>**purpose:** Earn expert validation and natural citations<br>**publicationRule:** No reciprocal-link requirement; request factual review not endorsement<br>**measurement:** Contributors \| citations \| qualified referrals |
| dist-012 | [S084](../../research/openseo/expansion-2026-07-17/deliverables/distribution-plan.csv) (row 13) | **id:** dist-012<br>**canonicalAsset:** Mississauga garden-suite module<br>**channel:** Local ecosystem<br>**deliverable:** Share with licensed builders designers and homeowner groups using City pre-approved plans<br>**purpose:** Capture municipality-specific demand without city-page cloning<br>**publicationRule:** Current City program source and transparent affiliation<br>**measurement:** Mississauga impressions \| model starts \| referrals |
| Garden Suite Eligibility Review \| FairLend | [S249](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/crawl-summary.json) (record 22) | **url:** https://www.fairlend.ca/garden-suite<br>**depth:** 2<br>**canonical:** https://www.fairlend.ca/garden-suite<br>**title:** Garden Suite Eligibility Review \| FairLend<br>**h1_count:** 1<br>**word_count:** 311 |
| Garden Suite Financing GTA \| FairLend | [S249](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/crawl-summary.json) (record 15) | **url:** https://www.fairlend.ca/garden-suite-financing-gta<br>**depth:** 1<br>**canonical:** https://www.fairlend.ca/garden-suite-financing-gta<br>**title:** Garden Suite Financing GTA \| FairLend<br>**h1_count:** 1<br>**word_count:** 365 |
| garden-laneway-suites-qualification-rescue | [S036](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/cluster-summary.json) (record 22) | **clusterId:** garden-laneway-suites-qualification-rescue<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Qualification / rescue<br>**primaryKeyword:** garden suite financing Toronto<br>**intent:** Transactional + urgent<br>**targetPath:** /garden-suite-financing-gta<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 4<br>**observedVolume:** 0<br>**numericMetricCount:** 0<br>**gscKeywordImpressions:** 0<br>**gscPageImpressions:** 0<br>**avgLeadScore:** 86<br>**avgAuthorityScore:** 39<br>**pageType:** Garden-suite financing service page<br>**boundary:** Maintain two pages only with strict roles: /garden-suite owns eligibility/feasibility; /garden-suite-financing-gta owns lender qualification and transaction intent.<br>**confidence:** Directional page boundary; representative service SERP validated, pairwise overlap unavailable. |
| garden-laneway-suites-qualification-rescue | [S038](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/google-cluster-validation-2026-07-20.csv) (row 21) | **clusterId:** garden-laneway-suites-qualification-rescue<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Qualification / rescue<br>**primaryKeyword:** garden suite financing Toronto<br>**targetPath:** /garden-suite-financing-gta<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 4<br>**googleValidationStatus:** rework-boundary<br>**decision:** hold-separate-url<br>**confidence:** moderate boundary warning; low sample<br>**evidence:** /garden-suite has 13 impressions at position 2.92. /garden-suite-financing-gta has no GSC or GA4 signal in the observed reports.<br>**rationale:** Google currently recognizes only the eligibility page. Keep the second URL out of the production roadmap unless it is sharply differentiated and earns independent query evidence; otherwise consolidate financing content into /garden-suite.<br>**validatedAt:** 2026-07-20T05:51:11Z<br>**gscFreshness:** Last update 3 hours ago; direct GSC snapshot unchanged at 67 impressions<br>**ga4Range:** 2026-06-22 to 2026-07-19 |
| garden-laneway-suites-qualification-rescue | [S040](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/google-validation-summary-2026-07-20.json) (record 25) | **clusterId:** garden-laneway-suites-qualification-rescue<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Qualification / rescue<br>**primaryKeyword:** garden suite financing Toronto<br>**targetPath:** /garden-suite-financing-gta<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 4<br>**status:** rework-boundary<br>**decision:** hold-separate-url<br>**confidence:** moderate boundary warning; low sample<br>**evidence:** /garden-suite has 13 impressions at position 2.92. /garden-suite-financing-gta has no GSC or GA4 signal in the observed reports.<br>**rationale:** Google currently recognizes only the eligibility page. Keep the second URL out of the production roadmap unless it is sharply differentiated and earns independent query evidence; otherwise consolidate financing content into /garden-suite.<br>**validatedAt:** 2026-07-20T05:51:11Z<br>**gscFreshness:** Last update 3 hours ago; direct GSC snapshot unchanged at 67 impressions<br>**ga4Range:** 2026-06-22 to 2026-07-19 |
| garden-laneway-suites-qualification-rescue | [S041](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/page-cluster-map.csv) (row 21) | **clusterId:** garden-laneway-suites-qualification-rescue<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Qualification / rescue<br>**primaryKeyword:** garden suite financing Toronto<br>**secondaryKeywords:** laneway suite construction loan Toronto \| garden suite financing shortfall Toronto \| urgent laneway house financing Toronto<br>**intent:** Transactional + urgent<br>**funnelStages:** financing-qualification \| immediate-transaction-problem<br>**targetPath:** /garden-suite-financing-gta<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 4<br>**observedVolume:** 0<br>**numericMetricCount:** 0<br>**gscKeywordImpressions:** 0<br>**gscPageImpressions:** 0<br>**avgLeadScore:** 86<br>**avgAuthorityScore:** 39<br>**pageType:** Garden-suite financing service page<br>**requiredSections:** Toronto eligibility, access, servicing, and permit inputs \| Cost, contingency, rent, and equity model \| Garden suite versus laneway house \| HELOC versus construction draw comparison \| Working-capital and draw-readiness checklist \| Financing-page and intake links<br>**internalLinks:** /garden-suite \| /construction-draw-financing<br>**boundary:** Maintain two pages only with strict roles: /garden-suite owns eligibility/feasibility; /garden-suite-financing-gta owns lender qualification and transaction intent.<br>**confidence:** Directional page boundary; representative service SERP validated, pairwise overlap unavailable. |
| garden-laneway-suites-research-decision | [S036](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/cluster-summary.json) (record 21) | **clusterId:** garden-laneway-suites-research-decision<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Research / decision<br>**primaryKeyword:** garden suites Toronto<br>**intent:** Informational + commercial investigation<br>**targetPath:** /garden-suite<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 6<br>**observedVolume:** 590<br>**numericMetricCount:** 1<br>**gscKeywordImpressions:** 0<br>**gscPageImpressions:** 13<br>**avgLeadScore:** 38<br>**avgAuthorityScore:** 81<br>**pageType:** Garden-suite eligibility and feasibility hub<br>**boundary:** Maintain two pages only with strict roles: /garden-suite owns eligibility/feasibility; /garden-suite-financing-gta owns lender qualification and transaction intent.<br>**confidence:** Directional page boundary; representative service SERP validated, pairwise overlap unavailable. |
| garden-laneway-suites-research-decision | [S038](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/google-cluster-validation-2026-07-20.csv) (row 20) | **clusterId:** garden-laneway-suites-research-decision<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Research / decision<br>**primaryKeyword:** garden suites Toronto<br>**targetPath:** /garden-suite<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 6<br>**googleValidationStatus:** partial-page-signal<br>**decision:** update-snippet-now<br>**confidence:** low sample; page signal only<br>**evidence:** /garden-suite: 13 impressions, average position 2.92, 0 clicks. No query string is exposed for this page in the current Search Console UI.<br>**rationale:** Google validates page discovery, not the proposed keyword mix. High position with zero clicks makes title/meta and SERP-promise alignment the first job.<br>**validatedAt:** 2026-07-20T05:51:11Z<br>**gscFreshness:** Last update 3 hours ago; direct GSC snapshot unchanged at 67 impressions<br>**ga4Range:** 2026-06-22 to 2026-07-19 |
| garden-laneway-suites-research-decision | [S040](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/google-validation-summary-2026-07-20.json) (record 24) | **clusterId:** garden-laneway-suites-research-decision<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Research / decision<br>**primaryKeyword:** garden suites Toronto<br>**targetPath:** /garden-suite<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 6<br>**status:** partial-page-signal<br>**decision:** update-snippet-now<br>**confidence:** low sample; page signal only<br>**evidence:** /garden-suite: 13 impressions, average position 2.92, 0 clicks. No query string is exposed for this page in the current Search Console UI.<br>**rationale:** Google validates page discovery, not the proposed keyword mix. High position with zero clicks makes title/meta and SERP-promise alignment the first job.<br>**validatedAt:** 2026-07-20T05:51:11Z<br>**gscFreshness:** Last update 3 hours ago; direct GSC snapshot unchanged at 67 impressions<br>**ga4Range:** 2026-06-22 to 2026-07-19 |
| garden-laneway-suites-research-decision | [S041](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/page-cluster-map.csv) (row 20) | **clusterId:** garden-laneway-suites-research-decision<br>**serviceId:** garden-laneway-suites<br>**serviceName:** Garden & Laneway Suite Financing<br>**clusterType:** Research / decision<br>**primaryKeyword:** garden suites Toronto<br>**secondaryKeywords:** what is a garden suite Toronto \| can I build a garden suite Toronto \| garden suite cost Toronto \| garden suite vs laneway house Toronto \| HELOC vs construction loan for garden suite<br>**intent:** Informational + commercial investigation<br>**funnelStages:** awareness-education \| project-feasibility \| planning-comparison<br>**targetPath:** /garden-suite<br>**targetStatus:** existing-update<br>**priority:** P0<br>**keywordCount:** 6<br>**observedVolume:** 590<br>**numericMetricCount:** 1<br>**gscKeywordImpressions:** 0<br>**gscPageImpressions:** 13<br>**avgLeadScore:** 38<br>**avgAuthorityScore:** 81<br>**pageType:** Garden-suite eligibility and feasibility hub<br>**requiredSections:** Toronto eligibility, access, servicing, and permit inputs \| Cost, contingency, rent, and equity model \| Garden suite versus laneway house \| HELOC versus construction draw comparison \| Working-capital and draw-readiness checklist \| Financing-page and intake links<br>**internalLinks:** /garden-suite-financing-gta \| /construction-draw-financing<br>**boundary:** Maintain two pages only with strict roles: /garden-suite owns eligibility/feasibility; /garden-suite-financing-gta owns lender qualification and transaction intent.<br>**confidence:** Directional page boundary; representative service SERP validated, pairwise overlap unavailable. |
| https://www.fairlend.ca/intake?intent=build&projectScope=garden-laneway-suites&source=landing-overview-garden-laneway-suites | [S249](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/crawl-summary.json) (record 37) | **url:** https://www.fairlend.ca/intake?intent=build&projectScope=garden-laneway-suites&source=landing-overview-garden-laneway-suites<br>**final_url:** https://www.fairlend.ca/intake?intent=build&projectScope=garden-laneway-suites&source=landing-overview-garden-laneway-suites<br>**canonical:** https://www.fairlend.ca/intake<br>**meta_robots:** noindex, follow |
| https://www.fairlend.ca/intake?intent=build&projectScope=garden-laneway-suites&source=route-selector-garden-laneway-suites | [S249](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/crawl-summary.json) (record 29) | **url:** https://www.fairlend.ca/intake?intent=build&projectScope=garden-laneway-suites&source=route-selector-garden-laneway-suites<br>**final_url:** https://www.fairlend.ca/intake?intent=build&projectScope=garden-laneway-suites&source=route-selector-garden-laneway-suites<br>**canonical:** https://www.fairlend.ca/intake<br>**meta_robots:** noindex, follow |
| https://www.fairlend.ca/intake?intent=build&source=garden-suite-eligibility | [S249](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/crawl-summary.json) (record 58) | **url:** https://www.fairlend.ca/intake?intent=build&source=garden-suite-eligibility<br>**final_url:** https://www.fairlend.ca/intake?intent=build&source=garden-suite-eligibility<br>**canonical:** https://www.fairlend.ca/intake<br>**meta_robots:** noindex, follow |
| https://www.fairlend.ca/intake?intent=build&source=garden-suite-financing-gta | [S249](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/crawl-summary.json) (record 57) | **url:** https://www.fairlend.ca/intake?intent=build&source=garden-suite-financing-gta<br>**final_url:** https://www.fairlend.ca/intake?intent=build&source=garden-suite-financing-gta<br>**canonical:** https://www.fairlend.ca/intake<br>**meta_robots:** noindex, follow |
| opportunity-garden-laneway-financing | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 745) | **id:** opportunity-garden-laneway-financing<br>**topic:** Toronto and GTA garden and laneway-suite financing<br>**persona:** garden-laneway-suite-homeowner<br>**personaTier:** tier-1<br>**financingTrigger:** garden-laneway-suite-construction<br>**funnelHeadline:** buying-signal<br>**funnelStage:** financing-qualification<br>**intent:** transactional<br>**urlDisposition:** replace<br>**existingUrl:** https://www.fairlend.ca/garden-suite-financing-gta<br>**proposedUrl:** /garden-suite-financing-gta<br>**pageType:** money-page<br>**primaryConversion:** project-financing-assessment<br>**internalLinkRole:** ancillary-suite-commercial-pillar<br>**leadCaptureScore:** 73<br>**authorityBuildScore:** 70<br>**confidence:** medium<br>**recommendedPriority:** critical<br>**nextHumanDecision:** Approve a combined garden-and-laneway replacement page and reject separate lexical-variant money pages. |
| opportunity-garden-suite-feasibility | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 746) | **id:** opportunity-garden-suite-feasibility<br>**topic:** Garden-suite feasibility and project-readiness guide<br>**persona:** garden-laneway-suite-homeowner<br>**personaTier:** tier-1<br>**financingTrigger:** garden-laneway-suite-construction<br>**funnelHeadline:** research<br>**funnelStage:** project-feasibility<br>**intent:** informational<br>**urlDisposition:** consolidate<br>**existingUrl:** https://www.fairlend.ca/garden-suite<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**pageType:** resource<br>**primaryConversion:** financing-strategy<br>**internalLinkRole:** ancillary-suite-authority-and-qualification-node<br>**leadCaptureScore:** 62<br>**authorityBuildScore:** 70<br>**confidence:** high<br>**recommendedPriority:** high<br>**nextHumanDecision:** Approve consolidation of the existing informational page into a sourced feasibility resource. |
| opportunity-homepage-pathways | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 741) | **id:** opportunity-homepage-pathways<br>**topic:** Homepage qualified-project pathways and trust evidence<br>**persona:** homeowner-citizen-developer<br>**personaTier:** tier-1<br>**financingTrigger:** construction-financing<br>**funnelHeadline:** research<br>**funnelStage:** planning-comparison<br>**intent:** commercial-investigation<br>**urlDisposition:** preserve<br>**existingUrl:** https://www.fairlend.ca/<br>**proposedUrl:** /<br>**pageType:** homepage<br>**primaryConversion:** project-financing-assessment<br>**internalLinkRole:** brand-root-and-qualified-pathway-router<br>**leadCaptureScore:** 82<br>**authorityBuildScore:** 74<br>**confidence:** medium<br>**recommendedPriority:** critical<br>**nextHumanDecision:** Approve pathway hierarchy, trust evidence, and routing requirements before any homepage copy proposal. |
| opportunity-suite-rental-comparison | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 747) | **id:** opportunity-suite-rental-comparison<br>**topic:** Long-term versus short-term ancillary-suite rental comparison<br>**persona:** garden-laneway-suite-homeowner<br>**personaTier:** tier-1<br>**financingTrigger:** garden-laneway-suite-construction<br>**funnelHeadline:** research<br>**funnelStage:** planning-comparison<br>**intent:** informational<br>**urlDisposition:** consolidate<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**pageType:** comparison<br>**primaryConversion:** financing-strategy<br>**internalLinkRole:** ancillary-suite-use-case-comparison-node<br>**leadCaptureScore:** 62<br>**authorityBuildScore:** 70<br>**confidence:** high<br>**recommendedPriority:** low<br>**nextHumanDecision:** Keep this as a comparison module inside the feasibility resource unless a future SERP sample validates a distinct URL. |
| record | [S076](../../research/openseo/expansion-2026-07-17/deliverables/content-asset-map.csv) (row 16) | **relationOwner:** asset-video-system<br>**secondaryQueries:** garden suite cost Toronto \| CMHC MLI Select requirements \| Toronto building permit \| Toronto zoning |
| record | [S076](../../research/openseo/expansion-2026-07-17/deliverables/content-asset-map.csv) (row 17) | **relationOwner:** asset-partner-readiness<br>**secondaryQueries:** MLI Select readiness for builders \| garden suite financing checklist for designers \| construction draw checklist for contractors |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 2) | **evidenceId:** evidence-homepage-pathways-external-source-pack<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-observation-live-home-response-2026-07-16 \| source-observation-audit-page-20<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 3) | **evidenceId:** evidence-homepage-pathways-original-1<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Verified licence and service-area identity<br>**status:** missing<br>**owner:** FairLend operations<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 4) | **evidenceId:** evidence-homepage-pathways-original-2<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Named partner-role map<br>**status:** missing<br>**owner:** FairLend compliance<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 5) | **evidenceId:** evidence-homepage-pathways-original-3<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Approved project-qualification matrix<br>**status:** missing<br>**owner:** FairLend Principal Broker<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 6) | **evidenceId:** evidence-homepage-pathways-mblaa-brokerage-identity<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** FSRA-verified authorized brokerage name and brokerage licence number for clear and prominent display on every public page<br>**status:** missing<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker validates the public registry record and page-level display before drafting and publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 7) | **evidenceId:** evidence-homepage-pathways-mblaa-individual-identity<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** FSRA-verified licensed names, prescribed licence-class titles, and brokerage attribution for every broker or agent who appears<br>**status:** pending-if-individual-named<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-individual-public-relations<br>**verificationGate:** Principal Broker validates each identity, title, and attribution or the page names no individual<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 8) | **evidenceId:** evidence-homepage-pathways-mblaa-rate-advertising<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** APR, term, equal-prominence, and representative-example control for any fixed-amount mortgage rate, payment, or non-interest-charge representation<br>**status:** pending-if-trigger-used<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-cost-of-borrowing-advertising<br>**verificationGate:** Principal Broker and compliance approve the calculation and rendered prominence or the page contains no triggering representation<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 9) | **evidenceId:** evidence-homepage-pathways-mblaa-misleading-guarantee-control<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Public-output control excluding guarantees, guaranteed approval or outcomes, false or misleading statements, and regulatory-endorsement framing<br>**status:** pending<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker and compliance complete a rendered-page review before publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 10) | **evidenceId:** evidence-homepage-pathways-approval<br>**opportunityId:** opportunity-homepage-pathways<br>**proposedUrl:** /<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Page-level financial, legal, privacy, planning, tax, and marketing review<br>**status:** pending<br>**owner:** FairLend compliance<br>**verificationGate:** All linked claim records and original-evidence requirements cleared for intended usage<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 11) | **evidenceId:** evidence-five-plus-mli-financing-external-source-pack<br>**opportunityId:** opportunity-five-plus-mli-financing<br>**proposedUrl:** /multiplex-financing-gta<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-toronto-sixplex \| source-public-serp-multiplex<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 21) | **evidenceId:** evidence-mli-select-planning-guide-external-source-pack<br>**opportunityId:** opportunity-mli-select-planning-guide<br>**proposedUrl:** /multiplex-financing-gta/mli-select<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-toronto-sixplex \| source-official-toronto-development-charges<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 31) | **evidenceId:** evidence-five-plus-financing-roadmap-external-source-pack<br>**opportunityId:** opportunity-five-plus-financing-roadmap<br>**proposedUrl:** /multiplex-financing-gta/project-financing-roadmap<br>**workstream:** five-plus-unit-multiplex-mli-select<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-toronto-sixplex \| source-official-toronto-multiplex-guide<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 41) | **evidenceId:** evidence-garden-laneway-financing-external-source-pack<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-toronto-garden-suites \| source-official-toronto-laneway-suites \| source-public-serp-garden<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 42) | **evidenceId:** evidence-garden-laneway-financing-original-1<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Approved suite-financing criteria<br>**status:** missing<br>**owner:** FairLend Principal Broker<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 43) | **evidenceId:** evidence-garden-laneway-financing-original-2<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Address-feasibility intake<br>**status:** missing<br>**owner:** FairLend operations<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 44) | **evidenceId:** evidence-garden-laneway-financing-original-3<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Financing-option decision table<br>**status:** missing<br>**owner:** FairLend Principal Broker<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 45) | **evidenceId:** evidence-garden-laneway-financing-original-4<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Partner-role and permit handoff map<br>**status:** missing<br>**owner:** FairLend compliance<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 46) | **evidenceId:** evidence-garden-laneway-financing-mblaa-brokerage-identity<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** FSRA-verified authorized brokerage name and brokerage licence number for clear and prominent display on every public page<br>**status:** missing<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker validates the public registry record and page-level display before drafting and publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 47) | **evidenceId:** evidence-garden-laneway-financing-mblaa-individual-identity<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** FSRA-verified licensed names, prescribed licence-class titles, and brokerage attribution for every broker or agent who appears<br>**status:** pending-if-individual-named<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-individual-public-relations<br>**verificationGate:** Principal Broker validates each identity, title, and attribution or the page names no individual<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 48) | **evidenceId:** evidence-garden-laneway-financing-mblaa-rate-advertising<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** APR, term, equal-prominence, and representative-example control for any fixed-amount mortgage rate, payment, or non-interest-charge representation<br>**status:** pending-if-trigger-used<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-cost-of-borrowing-advertising<br>**verificationGate:** Principal Broker and compliance approve the calculation and rendered prominence or the page contains no triggering representation<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 49) | **evidenceId:** evidence-garden-laneway-financing-mblaa-misleading-guarantee-control<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Public-output control excluding guarantees, guaranteed approval or outcomes, false or misleading statements, and regulatory-endorsement framing<br>**status:** pending<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker and compliance complete a rendered-page review before publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 50) | **evidenceId:** evidence-garden-laneway-financing-approval<br>**opportunityId:** opportunity-garden-laneway-financing<br>**proposedUrl:** /garden-suite-financing-gta<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Page-level financial, legal, privacy, planning, tax, and marketing review<br>**status:** pending<br>**owner:** FairLend compliance<br>**verificationGate:** All linked claim records and original-evidence requirements cleared for intended usage<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 51) | **evidenceId:** evidence-garden-suite-feasibility-external-source-pack<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-toronto-garden-suites \| source-official-toronto-preapproved-suites<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 52) | **evidenceId:** evidence-garden-suite-feasibility-original-1<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Address-feasibility checklist<br>**status:** missing<br>**owner:** FairLend operations<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 53) | **evidenceId:** evidence-garden-suite-feasibility-original-2<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Municipality-specific evidence standard<br>**status:** missing<br>**owner:** FairLend SEO operator and assigned professional reviewer<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 54) | **evidenceId:** evidence-garden-suite-feasibility-original-3<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Current incentive-status log<br>**status:** missing<br>**owner:** FairLend operations<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 55) | **evidenceId:** evidence-garden-suite-feasibility-original-4<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Expert-reviewed cost and document taxonomy<br>**status:** missing<br>**owner:** FairLend SEO operator and assigned professional reviewer<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 56) | **evidenceId:** evidence-garden-suite-feasibility-mblaa-brokerage-identity<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** FSRA-verified authorized brokerage name and brokerage licence number for clear and prominent display on every public page<br>**status:** missing<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker validates the public registry record and page-level display before drafting and publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 57) | **evidenceId:** evidence-garden-suite-feasibility-mblaa-individual-identity<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** FSRA-verified licensed names, prescribed licence-class titles, and brokerage attribution for every broker or agent who appears<br>**status:** pending-if-individual-named<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-individual-public-relations<br>**verificationGate:** Principal Broker validates each identity, title, and attribution or the page names no individual<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 58) | **evidenceId:** evidence-garden-suite-feasibility-mblaa-rate-advertising<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** APR, term, equal-prominence, and representative-example control for any fixed-amount mortgage rate, payment, or non-interest-charge representation<br>**status:** pending-if-trigger-used<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-cost-of-borrowing-advertising<br>**verificationGate:** Principal Broker and compliance approve the calculation and rendered prominence or the page contains no triggering representation<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 59) | **evidenceId:** evidence-garden-suite-feasibility-mblaa-misleading-guarantee-control<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Public-output control excluding guarantees, guaranteed approval or outcomes, false or misleading statements, and regulatory-endorsement framing<br>**status:** pending<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker and compliance complete a rendered-page review before publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 60) | **evidenceId:** evidence-garden-suite-feasibility-approval<br>**opportunityId:** opportunity-garden-suite-feasibility<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Page-level financial, legal, privacy, planning, tax, and marketing review<br>**status:** pending<br>**owner:** FairLend compliance<br>**verificationGate:** All linked claim records and original-evidence requirements cleared for intended usage<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 61) | **evidenceId:** evidence-suite-rental-comparison-external-source-pack<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-toronto-short-term-rentals \| source-official-toronto-garden-suites<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 62) | **evidenceId:** evidence-suite-rental-comparison-original-1<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Municipal-rule comparison<br>**status:** missing<br>**owner:** FairLend SEO operator and assigned professional reviewer<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 63) | **evidenceId:** evidence-suite-rental-comparison-original-2<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Tax and financing decision matrix<br>**status:** missing<br>**owner:** FairLend Principal Broker<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 64) | **evidenceId:** evidence-suite-rental-comparison-original-3<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Long-term rent methodology<br>**status:** missing<br>**owner:** FairLend operations<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 65) | **evidenceId:** evidence-suite-rental-comparison-original-4<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Professional review dates<br>**status:** missing<br>**owner:** FairLend operations<br>**verificationGate:** Artifact supplied, provenance recorded, limitations stated, and intended public use approved<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 66) | **evidenceId:** evidence-suite-rental-comparison-mblaa-brokerage-identity<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** FSRA-verified authorized brokerage name and brokerage licence number for clear and prominent display on every public page<br>**status:** missing<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker validates the public registry record and page-level display before drafting and publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 67) | **evidenceId:** evidence-suite-rental-comparison-mblaa-individual-identity<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** FSRA-verified licensed names, prescribed licence-class titles, and brokerage attribution for every broker or agent who appears<br>**status:** pending-if-individual-named<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-individual-public-relations<br>**verificationGate:** Principal Broker validates each identity, title, and attribution or the page names no individual<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 68) | **evidenceId:** evidence-suite-rental-comparison-mblaa-rate-advertising<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** APR, term, equal-prominence, and representative-example control for any fixed-amount mortgage rate, payment, or non-interest-charge representation<br>**status:** pending-if-trigger-used<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-cost-of-borrowing-advertising<br>**verificationGate:** Principal Broker and compliance approve the calculation and rendered prominence or the page contains no triggering representation<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 69) | **evidenceId:** evidence-suite-rental-comparison-mblaa-misleading-guarantee-control<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Public-output control excluding guarantees, guaranteed approval or outcomes, false or misleading statements, and regulatory-endorsement framing<br>**status:** pending<br>**owner:** FairLend Principal Broker and compliance<br>**sourceObservationRefs:** source-official-ontario-brokerage-public-relations<br>**verificationGate:** Principal Broker and compliance complete a rendered-page review before publication<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 70) | **evidenceId:** evidence-suite-rental-comparison-approval<br>**opportunityId:** opportunity-suite-rental-comparison<br>**proposedUrl:** /garden-suite-financing-gta/feasibility<br>**workstream:** garden-laneway-suite-financing<br>**requirement:** Page-level financial, legal, privacy, planning, tax, and marketing review<br>**status:** pending<br>**owner:** FairLend compliance<br>**verificationGate:** All linked claim records and original-evidence requirements cleared for intended usage<br>**refreshCadence:** before drafting and before publication |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 71) | **evidenceId:** evidence-drawflow-builder-financing-external-source-pack<br>**opportunityId:** opportunity-drawflow-builder-financing<br>**proposedUrl:** /construction-draw-financing<br>**workstream:** drawflow-builder-financing<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-ontario-construction-act \| source-public-serp-draw<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 81) | **evidenceId:** evidence-construction-draw-guide-external-source-pack<br>**opportunityId:** opportunity-construction-draw-guide<br>**proposedUrl:** /construction-draw-financing/how-construction-draws-work-ontario<br>**workstream:** drawflow-builder-financing<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-ontario-construction-act \| source-search-insight-draw-guide<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 91) | **evidenceId:** evidence-stalled-project-rescue-external-source-pack<br>**opportunityId:** opportunity-stalled-project-rescue<br>**proposedUrl:** /construction-draw-financing<br>**workstream:** drawflow-builder-financing<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-ontario-construction-act \| source-qualitative-construction-funding-ontario<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 101) | **evidenceId:** evidence-partner-referrals-external-source-pack<br>**opportunityId:** opportunity-partner-referrals<br>**proposedUrl:** /partners<br>**workstream:** b2b-partner-referral<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-fsra-referrals \| source-official-reco-financial-benefits \| source-public-serp-partners<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| record | [S148](../../research/openseo/trial-2026-07-16/deliverables/evidence-acquisition-register.csv) (row 111) | **evidenceId:** evidence-partner-readiness-resource-external-source-pack<br>**opportunityId:** opportunity-partner-readiness-resource<br>**proposedUrl:** /partners<br>**workstream:** b2b-partner-referral<br>**requirement:** Recorded external and local source observations supporting the page decision<br>**status:** available-general<br>**owner:** FairLend SEO operator<br>**sourceObservationRefs:** source-official-fsra-referrals \| source-official-toronto-multiplex-guide<br>**verificationGate:** Source URL, timestamp, jurisdiction, anchor, and freshness recorded<br>**refreshCadence:** 30 days for financial programs; 90 days for planning rules |
| site-borrowers | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 79); [S213](../../research/openseo/trial-2026-07-16/research-workspace/workspace/source-evidence/live-site-snapshot-2026-07-16.json) (record 8) | **id:** site-borrowers<br>**url:** https://www.fairlend.ca/borrowers<br>**sitemap:** pages<br>**lastmod:** 2026-07-14<br>**indexability:** unknown |
| site-garden-suite | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 87); [S213](../../research/openseo/trial-2026-07-16/research-workspace/workspace/source-evidence/live-site-snapshot-2026-07-16.json) (record 16) | **id:** site-garden-suite<br>**url:** https://www.fairlend.ca/garden-suite<br>**sitemap:** pages<br>**lastmod:** 2026-07-09<br>**indexability:** unknown |
| site-garden-suite-financing-gta | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 86); [S213](../../research/openseo/trial-2026-07-16/research-workspace/workspace/source-evidence/live-site-snapshot-2026-07-16.json) (record 15) | **id:** site-garden-suite-financing-gta<br>**url:** https://www.fairlend.ca/garden-suite-financing-gta<br>**sitemap:** pages<br>**lastmod:** 2026-07-14<br>**indexability:** unknown |
| site-home | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 77); [S188](../../research/openseo/trial-2026-07-16/research-workspace/workspace/fixtures/valid-research-package.json) (record 10); [S213](../../research/openseo/trial-2026-07-16/research-workspace/workspace/source-evidence/live-site-snapshot-2026-07-16.json) (record 6) | **id:** site-home<br>**url:** https://www.fairlend.ca/<br>**sitemap:** pages<br>**lastmod:** 2026-07-14<br>**indexability:** unknown |
| site-partners | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 91); [S213](../../research/openseo/trial-2026-07-16/research-workspace/workspace/source-evidence/live-site-snapshot-2026-07-16.json) (record 20) | **id:** site-partners<br>**url:** https://www.fairlend.ca/partners<br>**sitemap:** pages<br>**lastmod:** 2026-07-14<br>**indexability:** unknown |
| site-private-mortgage-financing | [S159](../../research/openseo/trial-2026-07-16/deliverables/research-package.json) (record 81); [S213](../../research/openseo/trial-2026-07-16/research-workspace/workspace/source-evidence/live-site-snapshot-2026-07-16.json) (record 10) | **id:** site-private-mortgage-financing<br>**url:** https://www.fairlend.ca/borrowers/private-mortgage-financing<br>**sitemap:** pages<br>**lastmod:** 2026-07-14<br>**indexability:** unknown |

## Source-backed content fragments

The expandable fragments preserve the full relevant sections of directly named briefs and all topic-positive recommendation sections. Exact duplicates are consolidated with every source attached.

<details>
<summary><strong>CF0001</strong> — 2.2 Canadian keyword-research fallback — [S004](../../authority-and-distribution/community-media-2026-07-18-to-19/fairlend-community-media-findings-ledger.md)</summary>

##### 2.2 Canadian keyword-research fallback

Source: configured OpenSEO/DataForSEO-related keyword research for Canada (`locationCode 2124`, English), observed 2026-07-17. These are platform estimates, not AnswerThePublic results. Keyword difficulty may be unavailable or zero for low-data terms.

| Seed/cluster | Highest relevant observed keywords | Estimated monthly volume | Intent | Recommended content use |
|---|---|---:|---|---|
| Mortgage renewal | `mortgage renewal calculator`; `mortgage renewal`; `mortgage renewal rates ontario`; `mortgage renewal calculator canada` | 9,900; 1,900; 1,600; 720 | Informational/commercial | Prioritize a renewal calculator/checklist that includes switching costs and contract terms, not rates alone |
| Private mortgage | `private lenders for mortgage`; `private mortgage`; `private mortgage lenders ontario`; `private mortgage lenders toronto` | 1,900; 1,000; 480; 210 | Commercial | Strengthen Ontario/private-lender pages with lender-selection, costs, exit, and suitability boundaries |
| Construction mortgage | `construction mortgage`; `construction loan ontario`; `construction mortgage ontario`; `construction mortgage calculator` | 590; 260; 170; 50 | Commercial/informational | Main construction-finance guide plus readiness/draw calculator or checklist |
| CMHC MLI Select | `mli select`; `cmhc mli select`; `cmhc mli select requirements`; `cmhc mli select calculator` | 1,600; 1,600; 30; 30 | Informational/navigational | Maintain an official-guidance-led requirements and points explainer; assess calculator feasibility |
| Garden-suite financing | `garden suite financing` | 10 | Commercial | Keep as a local subtopic inside infill/ADU financing; the broader suggestion set was noisy and used a fallback source |

</details>

<details>
<summary><strong>CF0002</strong> — 22. Garden Suite Cost-to-Rent Break-Even Tool — [S014](../../authority-and-distribution/content-assets/calculators-computation-research.md)</summary>

##### 22. Garden Suite Cost-to-Rent Break-Even Tool

**Inputs:** all-in incremental project cost; financing; rent; vacancy; operating expenses; maintenance/capital reserve; rent/cost growth scenarios; analysis horizon.

**Model:** `annualNOI = rent×12×(1-vacancy) + otherIncome - operatingExpenses`; `simplePayback = allInCost / annualNOI` only when NOI is positive. Also show leveraged cash flow, cumulative undiscounted payback, and NPV at a user-entered discount rate. Do not include property appreciation unless explicitly entered and separately displayed.

**Output label:** scenario estimate—not appraisal, market-rent opinion, tax advice, or investment recommendation.

</details>

<details>
<summary><strong>CF0003</strong> — Primary-source register — [S014](../../authority-and-distribution/content-assets/calculators-computation-research.md)</summary>

##### Primary-source register

- [Interest Act, s. 6](https://laws-lois.justice.gc.ca/eng/acts/I-15/section-6.html)
- [Criminal Code, s. 347](https://laws-lois.justice.gc.ca/eng/acts/c-46/section-347.html)
- [Criminal Interest Rate Regulations](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2024-114/FullText.html)
- [Mortgage Brokerages, Lenders and Administrators Act, 2006](https://www.ontario.ca/laws/statute/06m29)
- [O. Reg. 191/08 — Cost of Borrowing and Disclosure to Borrowers](https://www.ontario.ca/laws/regulation/r08191)
- [FSRA mortgage brokerage disclosure requirements](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements)
- [FSRA mortgage brokerage disclosure forms](https://www.fsrao.ca/industry/mortgage-brokering/forms-mortgage-brokering/mortgage-brokerage-disclosure-forms)
- [FSRA Form 1 — Investor/Lender Disclosure Statement](https://www.fsrao.ca/media/6536/download)
- [FCAC mortgage prepayment penalties](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reduce-prepayment-penalties.html)
- [Mortgages Act, R.S.O. 1990, c. M.40](https://www.ontario.ca/laws/statute/90m40)
- [Construction Act, R.S.O. 1990, c. C.30](https://www.ontario.ca/laws/statute/90c30)
- [Building Code Act, 1992](https://www.ontario.ca/laws/statute/92b23)
- [Ontario building-permit guide](https://www.ontario.ca/document/citizens-guide-land-use-planning/building-permits)
- [Toronto Building permit review streams](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-review-streams/)
- [Toronto garden suites](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/)
- [Toronto new garden-suite permit guide](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/renovation-and-new-house-guides/new-garden-suite/)
- [Toronto multiplex study](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/multiplex-study-2-4-units/)
- [Toronto multiplex considerations](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/considerations-when-building-multiplexes/)
- [CMHC MLI Select product page](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)
- [CMHC MLI Select fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)
- [CMHC Multi-unit Fees and Premiums](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf)
- [OSFI residential mortgage underwriting guideline B-20](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-2017)
- [Microsoft XIRR specification](https://support.microsoft.com/en-us/office/xirr-function-de1242ec-6477-445b-b11b-a303ad9adc9d)

</details>

<details>
<summary><strong>CF0004</strong> — Laneway suites — [S015](../../authority-and-distribution/content-assets/research-zoning-map-mli-select.md)</summary>

##### Laneway suites

Toronto's [Changing Lanes history](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/changing-lanes-laneway-suites-in-toronto/) records city-wide permissions in R, RD, RS, RT and RM zones, subject to the by-law. [Section 150.8](https://www.toronto.ca/zoning/bylaw_amendments/ZBL_NewProvision_Chapter150_8.htm) contains the actual use-specific rules. Toronto's [permit guide](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/renovation-and-new-house-guides/new-laneway-suite/) also makes clear that tree protection, principal access, fire access, drawings, and Building Code requirements matter.

Useful screen output:

- mapped lane adjacency and rear/side-lot-line relationship;
- estimated lane frontage and emergency-access travel route;
- existing rear structure/garage footprint;
- estimated separation, coverage, height-overlay and lot geometry;
- trees, ravine, heritage, and other constraint flags;
- nearby laneway-suite permits; and
- direct links to Section 150.8 and the permit/fire-access guidance.

Lane geometry and network routing are screening proxies only. The actual fire-access path, clearance, construction, property rights, and code compliance require plan/survey review.

</details>

<details>
<summary><strong>CF0005</strong> — MVP scope — [S015](../../authority-and-distribution/content-assets/research-zoning-map-mli-select.md)</summary>

##### MVP scope

**Toronto-only is the correct MVP.** It has the strongest official queryable stack and already presents enough freshness complexity to require disciplined provenance.

1. Address autocomplete from Toronto One Address Repository.
2. Address-to-parcel lookup with parcel and building-outline visualization.
3. Zone label/category and exact by-law links.
4. Essential zoning layers: 569-2013 inclusion/former-by-law flag, exceptions/holding signals, height, lot coverage, policy area/road, parking, and multi-tenant overlay where relevant.
5. Essential policy/constraint layers: Official Plan designation, Secondary Plan/SASP, heritage, ravine, and MTSA/PMTSA.
6. Typology tabs for multiplex, garden suite, laneway suite, and secondary suite/ARU. Each is a deterministic checklist of mapped facts, unknowns, and official sources—not a binary eligibility result.
7. Nearby active/cleared permits classified conservatively from permit type and work description, with links and status/date.
8. Shareable canonical parcel URL and downloadable one-page "Planning Context Snapshot" carrying source versions and assumptions.
9. Public methodology, data dictionary, update-status dashboard, corrections form, and source change log.
10. Analytics/events to learn which addresses, typologies, unknowns, and financing questions users most often explore.

</details>

<details>
<summary><strong>CF0006</strong> — What the product must never represent — [S015](../../authority-and-distribution/content-assets/research-zoning-map-mli-select.md)</summary>

##### What the product must never represent

Do **not** output any of the following as a definitive statement:

- "You can build a fourplex/sixplex/garden suite/laneway suite here."
- "This property is zoning compliant."
- "No variance, rezoning, heritage approval, conservation approval, or other permit is required."
- "The lot is X metres wide/deep" unless explicitly labelled a map-derived estimate; only a legal survey can establish it.
- "The parcel is not subject to an appeal, site-specific amendment, former by-law, easement, covenant, title issue, applicable law, or pending change."
- "This concept meets fire access, Building Code, tree, grading, servicing, stormwater, parking, or structural requirements."
- "The project is financially feasible" without a complete cost, revenue, timing, tax, financing, and professional review.
- "This nearby permit is a precedent" or guarantees equivalent approval.

Use a three-state vocabulary instead:

- **Potential signal found** — official mapped data indicates a criterion worth investigating.
- **Constraint/exception found** — an official source identifies an issue that needs interpretation.
- **Not determinable from available data** — professional documents or City confirmation are required.

Every result should carry: retrieval timestamp, source effective date where available, data/licence attribution, direct official links, assumptions, unresolved items, and a persistent banner that it is general information rather than planning, legal, architectural, engineering, surveying, appraisal, or lending advice.

For formal review, direct Toronto users to the City's [Zoning Applicable Law Certificate](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/preliminary-zoning-reviews-information/apply-for-a-zoning-review/zoning-applicable-law-certificate/), which is the preliminary review of dimensioned plans for zoning and applicable-law compliance. A [Property Information Report](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/preliminary-zoning-reviews-information/property-information-reports/) can report permits, inspections, outstanding orders, and a zoning designation, but does not outline permitted use.

</details>

<details>
<summary><strong>CF0007</strong> — 5. Small Residential Project Budget Library — [S016](../../authority-and-distribution/content-assets/seo-editorial-data-authority-brainstorm.md)</summary>

##### 5. Small Residential Project Budget Library

**Purpose:** Publish anonymized budget structures for garden suites, multiplexes, single-family builds, and conversions.

**Data:** Percentage shares and broad bands are safer and more reusable than exact project/address data. Separate hard cost, soft cost, permits, servicing, contingency, financing, and taxes.

**Link audiences:** homeowners, builders, architects, planners, appraisers, real-estate publications.

</details>

<details>
<summary><strong>CF0008</strong> — Advanced layers — [S016](../../authority-and-distribution/content-assets/seo-editorial-data-authority-brainstorm.md)</summary>

##### Advanced layers

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

</details>

<details>
<summary><strong>CF0009</strong> — Garden suite, laneway suite, and multiplex tools — [S016](../../authority-and-distribution/content-assets/seo-editorial-data-authority-brainstorm.md)</summary>

##### Garden suite, laneway suite, and multiplex tools

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

</details>

<details>
<summary><strong>CF0010</strong> — P0 quick wins: use assets and copy that already exist — [S016](../../authority-and-distribution/content-assets/seo-editorial-data-authority-brainstorm.md)</summary>

##### P0 quick wins: use assets and copy that already exist

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

</details>

<details>
<summary><strong>CF0011</strong> — The first ten resources to publish — [S016](../../authority-and-distribution/content-assets/seo-editorial-data-authority-brainstorm.md)</summary>

##### The first ten resources to publish

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

</details>

<details>
<summary><strong>CF0012</strong> — What the audit and repository actually show — [S016](../../authority-and-distribution/content-assets/seo-editorial-data-authority-brainstorm.md)</summary>

##### What the audit and repository actually show

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

</details>

<details>
<summary><strong>CF0013</strong> — 5. First Party Evidence — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md)</summary>

##### 5. First Party Evidence

**Canonical artifact:** `docs/SEO/research/keyword-and-funnel/landing-services-funnel-2026-07-19/first-party-evidence.csv`
**Format:** CSV · **Bytes:** 6,927 · **SHA-256:** `794617db6170622b4bd6c73a1c35520803471b457b766993c58c60579de247e0`

| source | dimension | item | clicks | impressions | ctr | averagePosition | sessions | engagedSessions | engagementRate | averageEngagementTime | events | keyEvents | dateRange | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GSC | property-total | sc-domain:fairlend.ca | 2 | 67 | 3% | 31.2 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | New property; four days of visible search data. |
| GSC | query | fairlend | 1 | 2 | 50% | 1 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | construction loan draw schedule | 0 | 3 | 0% | 91.3 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | elie soberano | 0 | 2 | 0% | 7 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | fairm | 0 | 2 | 0% | 29.5 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | fairview loans | 0 | 2 | 0% | 37.5 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | frendel | 0 | 2 | 0% | 49.5 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | flent | 0 | 2 | 0% | 50.5 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | private mortgage fund | 0 | 2 | 0% | 84.5 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | fair market value appraisal for private lending | 0 | 2 | 0% | 96.5 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | fairloans apply online | 0 | 1 | 0% | 41 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | firl | 0 | 1 | 0% | 43 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | private mortgage investment | 0 | 1 | 0% | 47 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | splend | 0 | 1 | 0% | 50 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | invest in private mortgages | 0 | 1 | 0% | 53 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | vierendeels | 0 | 1 | 0% | 63 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | fingler | 0 | 1 | 0% | 75 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | northlend financial | 0 | 1 | 0% | 76 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | feilding | 0 | 1 | 0% | 77 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | fruend | 0 | 1 | 0% | 78 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | halfern | 0 | 1 | 0% | 83 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | fairmile | 0 | 1 | 0% | 84 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | private mortgage investing | 0 | 1 | 0% | 90 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | query | vriend engineering | 0 | 1 | 0% | 96 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI; retain misspellings only as evidence, not target keywords. |
| GSC | page | https://www.fairlend.ca/ | 2 | 32 | 6.3% | 10 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | https://fairlend.ca/ | 0 | 21 | 0% | 40.8 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | /borrowers/private-mortgage-financing | 0 | 14 | 0% | 10.1 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | /investing/private-mortgage-lending | 0 | 14 | 0% | 39.4 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | /garden-suite | 0 | 13 | 0% | 2.9 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | /disclosures | 0 | 11 | 0% | 2.4 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | /partners | 0 | 5 | 0% | 5.4 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | /construction-draw-financing | 0 | 3 | 0% | 91.3 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GSC | page | /investing | 0 | 1 | 0% | 1 | — | — | — | — | — | — | 2026-07-14 to 2026-07-17 | Direct Search Console UI. |
| GA4 | property-total | fairlend-root (property 502729166) | — | — | — | — | 14 | 10 | 71.43% | 31s | 79 | 0 | 2026-06-21 to 2026-07-18 | Five active users; no configured/recorded key events. |
| GA4 | session-default-channel-group | Direct | — | — | — | — | 5 | 5 | 100% | 1m05s | — | 0 | 2026-06-21 to 2026-07-18 | Traffic acquisition report. |
| GA4 | session-default-channel-group | Unassigned | — | — | — | — | 4 | 2 | 50% | 28s | — | 0 | 2026-06-21 to 2026-07-18 | Traffic acquisition report. |
| GA4 | session-default-channel-group | Referral | — | — | — | — | 3 | 2 | 66.67% | 0s | — | 0 | 2026-06-21 to 2026-07-18 | Traffic acquisition report. |
| GA4 | session-default-channel-group | Organic Search | — | — | — | — | 2 | 1 | 50% | 3s | — | 0 | 2026-06-21 to 2026-07-18 | Traffic acquisition report. |
| GA4+GSC | linked-search-total | Google organic search traffic | 2 | 114 | 1.75% | 19.61 | 3 | 4 | 66.67% | 41s | 35 | 0 | 2026-06-21 to 2026-07-18 | Linked report differs from direct GSC because of date range, reporting thresholds, and anonymization. |
| Answer Socrates | question-discovery | Ontario real estate financing | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Canada/English; 59 questions after PAA expansion; Google Trends card +44% this month; directional only. |
| Answer Socrates | retained-query | Ontario construction financing | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Retained as construction-financing discovery term. |
| Answer Socrates | retained-query | Bridge financing real estate Canada | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Retained as bridge-financing discovery term. |
| Answer Socrates | retained-query | Home renovation financing Ontario | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Retained as renovation-financing discovery term. |
| Answer Socrates | retained-query | Mortgage on residential property | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Retained as residential-mortgage discovery term. |
| Answer Socrates | retained-query | Ontario home financing | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Retained as residential-mortgage discovery term. |
| Answer Socrates | retained-query | Real estate financing Toronto | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Broad supporting term; not assigned as a primary keyword. |
| Answer Socrates | retained-query | Real estate financing Canada | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Broad supporting term; not assigned as a primary keyword. |
| Google Ads | keyword-planner | FairLend account 359-082-4317 | — | — | — | — | — | — | — | — | — | — | 2026-07-19 | Unavailable: account redirects to campaign/payment onboarding. No campaign was created and no billing state was changed. |

<details>
<summary>Exact raw CSV source — 6,927 bytes · SHA-256 794617db6170622b4bd6c73a1c35520803471b457b766993c58c60579de247e0</summary>

```csv
source,dimension,item,clicks,impressions,ctr,averagePosition,sessions,engagedSessions,engagementRate,averageEngagementTime,events,keyEvents,dateRange,note
GSC,property-total,sc-domain:fairlend.ca,2,67,3%,31.2,,,,,,,2026-07-14 to 2026-07-17,New property; four days of visible search data.
GSC,query,fairlend,1,2,50%,1,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,construction loan draw schedule,0,3,0%,91.3,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,elie soberano,0,2,0%,7,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,fairm,0,2,0%,29.5,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,fairview loans,0,2,0%,37.5,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,frendel,0,2,0%,49.5,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,flent,0,2,0%,50.5,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,private mortgage fund,0,2,0%,84.5,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,fair market value appraisal for private lending,0,2,0%,96.5,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,fairloans apply online,0,1,0%,41,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,firl,0,1,0%,43,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,private mortgage investment,0,1,0%,47,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,splend,0,1,0%,50,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,invest in private mortgages,0,1,0%,53,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,vierendeels,0,1,0%,63,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,fingler,0,1,0%,75,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,northlend financial,0,1,0%,76,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,feilding,0,1,0%,77,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,fruend,0,1,0%,78,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,halfern,0,1,0%,83,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,fairmile,0,1,0%,84,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,private mortgage investing,0,1,0%,90,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,query,vriend engineering,0,1,0%,96,,,,,,,2026-07-14 to 2026-07-17,"Direct Search Console UI; retain misspellings only as evidence, not target keywords."
GSC,page,https://www.fairlend.ca/,2,32,6.3%,10,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,https://fairlend.ca/,0,21,0%,40.8,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,/borrowers/private-mortgage-financing,0,14,0%,10.1,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,/investing/private-mortgage-lending,0,14,0%,39.4,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,/garden-suite,0,13,0%,2.9,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,/disclosures,0,11,0%,2.4,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,/partners,0,5,0%,5.4,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,/construction-draw-financing,0,3,0%,91.3,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GSC,page,/investing,0,1,0%,1,,,,,,,2026-07-14 to 2026-07-17,Direct Search Console UI.
GA4,property-total,fairlend-root (property 502729166),,,,,14,10,71.43%,31s,79,0,2026-06-21 to 2026-07-18,Five active users; no configured/recorded key events.
GA4,session-default-channel-group,Direct,,,,,5,5,100%,1m05s,,0,2026-06-21 to 2026-07-18,Traffic acquisition report.
GA4,session-default-channel-group,Unassigned,,,,,4,2,50%,28s,,0,2026-06-21 to 2026-07-18,Traffic acquisition report.
GA4,session-default-channel-group,Referral,,,,,3,2,66.67%,0s,,0,2026-06-21 to 2026-07-18,Traffic acquisition report.
GA4,session-default-channel-group,Organic Search,,,,,2,1,50%,3s,,0,2026-06-21 to 2026-07-18,Traffic acquisition report.
GA4+GSC,linked-search-total,Google organic search traffic,2,114,1.75%,19.61,3,4,66.67%,41s,35,0,2026-06-21 to 2026-07-18,"Linked report differs from direct GSC because of date range, reporting thresholds, and anonymization."
Answer Socrates,question-discovery,Ontario real estate financing,,,,,,,,,,,2026-07-19,Canada/English; 59 questions after PAA expansion; Google Trends card +44% this month; directional only.
Answer Socrates,retained-query,Ontario construction financing,,,,,,,,,,,2026-07-19,Retained as construction-financing discovery term.
Answer Socrates,retained-query,Bridge financing real estate Canada,,,,,,,,,,,2026-07-19,Retained as bridge-financing discovery term.
Answer Socrates,retained-query,Home renovation financing Ontario,,,,,,,,,,,2026-07-19,Retained as renovation-financing discovery term.
Answer Socrates,retained-query,Mortgage on residential property,,,,,,,,,,,2026-07-19,Retained as residential-mortgage discovery term.
Answer Socrates,retained-query,Ontario home financing,,,,,,,,,,,2026-07-19,Retained as residential-mortgage discovery term.
Answer Socrates,retained-query,Real estate financing Toronto,,,,,,,,,,,2026-07-19,Broad supporting term; not assigned as a primary keyword.
Answer Socrates,retained-query,Real estate financing Canada,,,,,,,,,,,2026-07-19,Broad supporting term; not assigned as a primary keyword.
Google Ads,keyword-planner,FairLend account 359-082-4317,,,,,,,,,,,2026-07-19,Unavailable: account redirects to campaign/payment onboarding. No campaign was created and no billing state was changed.

```

</details>

---

</details>

<details>
<summary><strong>CF0014</strong> — Recommended publishing sequence — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md)</summary>

##### Recommended publishing sequence

1. Refresh Garden Suite and Private Mortgage pages for snippet fit, qualification depth, and conversion path.
2. Publish Construction Draw Schedule and Private Mortgage Investing decision content.
3. Launch the MLI Select pillar/service pair using CMHC citations.
4. Build HELOC, Bridge, Renovation, Multiplex, and Rental Acquisition/Refinance money pages.
5. Add Partner and Builder Consulting B2B clusters.
6. Add broad Residential and Institutional hubs after differentiated service architecture is in place.



---

</details>

<details>
<summary><strong>CF0015</strong> — Cannibalization and consolidation — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S037](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/fairlend-keyword-research-and-cluster-report.md)</summary>

##### Cannibalization and consolidation

| Risk | Canonical decision |
|---|---|
| Residential vs institutional vs private | Residential routes broad intent; institutional owns policy-fit; private owns exception/decline. |
| Borrowing vs private-mortgage investing | Separate audience, CTA, schema, and internal anchor text. |
| HELOC vs refinance vs renovation | HELOC owns revolving access; refinance owns mortgage replacement; renovation owns project-purpose financing. |
| Construction vs multiplex vs garden vs MLI | Construction owns draw mechanics; property pages own project feasibility; MLI owns the insured program. |
| Garden dual URLs | Keep only with strict roles: eligibility at `/garden-suite`; financing at `/garden-suite-financing-gta`. |
| Multiplex vs MLI Select | Summarize MLI on multiplex; canonicalize requirements and points to the MLI hub. |
| Rental acquisition vs refinance | Split by transaction state: buying versus restructuring an owned asset. |
| Builder consulting vs Partner | Builder targets project strategy; Partner targets introducers and handoff. |
| Affordable/sustainable rental vs MLI | Consolidate verified evidence into the new MLI architecture. |
| Institutional proposed slug | Do not create `/borrowers/institutional-mortgage-financing`; preserve the live canonical URL. |

Current GSC does not show one query splitting impressions across multiple FairLend URLs. Except for the visibly overlapping garden pages, these are preventive boundaries.

</details>

<details>
<summary><strong>CF0016</strong> — Cluster mapping — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S037](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/fairlend-keyword-research-and-cluster-report.md)</summary>

##### Cluster mapping

| Cluster | Primary keyword | Secondary keywords | Intent | Target | Status | Priority |
|---|---|---|---|---|---|---|
| residential-mortgages-research-decision | how much mortgage can I afford in Ontario | how do mortgages work in Ontario; mortgage on residential property; Ontario mortgage down payment requirements; mortgage broker vs bank Ontario; fixed vs variable mortgage Ontario | Informational + commercial investigation | `/resources/mortgage-affordability-ontario` | proposed-create | P2 |
| residential-mortgages-qualification-rescue | residential mortgage broker Ontario | mortgage pre approval Ontario; mortgage declined Ontario options; urgent mortgage approval Ontario | Transactional + urgent | `/borrowers/residential-mortgage-financing` | proposed-create | P2 |
| private-mortgages-research-decision | private mortgage costs Ontario | what is a private mortgage in Ontario; how private mortgage lending works Ontario; private mortgage appraisal requirements Ontario; private mortgage vs B lender Ontario; private mortgage vs second mortgage Ontario | Informational + commercial investigation | `/resources/private-mortgage-costs-ontario` | proposed-create | P0 |
| private-mortgages-qualification-rescue | private mortgage lenders Ontario | private mortgage broker Ontario; bank declined mortgage private lender Ontario; urgent private mortgage Ontario | Transactional + urgent | `/borrowers/private-mortgage-financing` | existing-update | P0 |
| institutional-mortgages-research-decision | institutional mortgage lenders Ontario | what is an institutional mortgage Canada; A lender mortgage requirements Ontario; institutional mortgage qualification Canada; institutional vs private mortgage Ontario; bank vs monoline mortgage lender Canada | Informational + commercial investigation | `/resources/institutional-mortgage-requirements-ontario` | proposed-create | P2 |
| institutional-mortgages-qualification-rescue | institutional mortgage broker Ontario | best institutional mortgage options Ontario; switch private mortgage to institutional lender; institutional mortgage closing deadline Ontario | Transactional + urgent | `/borrowers/institutional-mortgage` | existing-update | P2 |
| heloc-research-decision | what is a HELOC in Canada | how does a HELOC work in Ontario; how much HELOC can I get Ontario; HELOC equity requirements Ontario; HELOC vs refinance Ontario; HELOC vs home equity loan Canada | Informational + commercial investigation | `/resources/heloc-ontario-guide` | proposed-create | P1 |
| heloc-qualification-rescue | HELOC broker Ontario | home equity line of credit lender Ontario; HELOC declined alternatives Ontario; urgent home equity financing Ontario | Transactional + urgent | `/borrowers/heloc` | proposed-create | P1 |
| bridge-loans-research-decision | what is bridge financing in Canada | how does a bridge loan work Ontario; bridge loan eligibility Ontario; bridge financing cost Ontario; bridge loan vs HELOC Ontario; bridge loan vs private mortgage Ontario | Informational + commercial investigation | `/resources/bridge-financing-ontario-guide` | proposed-create | P1 |
| bridge-loans-qualification-rescue | bridge financing real estate Canada | bridge mortgage lender Ontario; urgent bridge financing Ontario; bridge loan without firm sale Ontario | Transactional + urgent | `/borrowers/bridge-financing` | proposed-create | P1 |
| residential-refinancing-research-decision | how mortgage refinancing works Ontario | what is cash out refinance Canada; mortgage refinance break even Ontario; how much equity to refinance Ontario; refinance vs renew mortgage Ontario; refinance vs HELOC Ontario | Informational + commercial investigation | `/resources/mortgage-refinancing-ontario-guide` | proposed-create | P1 |
| residential-refinancing-qualification-rescue | mortgage refinance broker Ontario | residential refinance lender Ontario; urgent mortgage refinance Ontario; refinance after bank decline Ontario | Transactional + urgent | `/borrowers/residential-refinancing` | proposed-create | P1 |
| renovation-financing-research-decision | home renovation financing Ontario | home renovation financing options Canada; how renovation loans work Ontario; renovation loan eligibility Ontario; HELOC vs refinance for renovations; renovation loan vs construction mortgage | Informational + commercial investigation | `/resources/home-renovation-financing-ontario` | proposed-create | P1 |
| renovation-financing-qualification-rescue | renovation financing lender Ontario | purchase plus improvements mortgage Ontario; renovation cost overrun financing Ontario; urgent home improvement loan Ontario | Transactional + urgent | `/borrowers/renovation-financing` | proposed-create | P1 |
| construction-financing-research-decision | construction loan draw schedule | how construction financing works Ontario; what is a construction draw mortgage; construction financing equity requirements Ontario; construction loan vs conventional mortgage; private vs institutional construction financing | Informational + commercial investigation | `/resources/construction-loan-draw-schedule` | proposed-create | P0 |
| construction-financing-qualification-rescue | construction financing Ontario | construction mortgage lender Toronto; stopped construction draw financing Ontario; construction lender replacement Ontario | Transactional + urgent | `/construction-draw-financing` | existing-update | P0 |
| multiplex-financing-research-decision | how to finance a fourplex in Toronto | what is multiplex financing Ontario; Toronto multiplex financing feasibility; sixplex financing requirements Ontario; fourplex vs five unit financing Canada; multiplex construction loan vs MLI Select | Informational + commercial investigation | `/resources/toronto-multiplex-financing-guide` | proposed-create | P1 |
| multiplex-financing-qualification-rescue | multiplex financing Toronto | fourplex mortgage lender Ontario; multiplex construction financing gap Ontario; urgent fourplex acquisition financing | Transactional + urgent | `/multiplex-financing-gta` | existing-update | P1 |
| garden-laneway-suites-research-decision | garden suites Toronto | what is a garden suite Toronto; can I build a garden suite Toronto; garden suite cost Toronto; garden suite vs laneway house Toronto; HELOC vs construction loan for garden suite | Informational + commercial investigation | `/garden-suite` | existing-update | P0 |
| garden-laneway-suites-qualification-rescue | garden suite financing Toronto | laneway suite construction loan Toronto; garden suite financing shortfall Toronto; urgent laneway house financing Toronto | Transactional + urgent | `/garden-suite-financing-gta` | existing-update | P0 |
| mli-select-research-decision | MLI Select | MLI Select points system; MLI Select requirements; MLI Select affordability criteria; MLI Select vs conventional financing; MLI Select vs standard rental housing insurance | Informational + commercial investigation | `/resources/mli-select-requirements-points` | proposed-create | P0 |
| mli-select-qualification-rescue | MLI Select financing | CMHC MLI Select lender Ontario; urgent MLI Select financing review; MLI Select takeout financing deadline | Transactional + urgent | `/mli-select` | proposed-create | P0 |
| rental-acquisition-research-decision | rental property down payment Ontario | how rental property financing works Ontario; investment property mortgage rules Ontario; rental income mortgage qualification Ontario; commercial vs residential rental property mortgage; rental property mortgage vs HELOC | Informational + commercial investigation | `/resources/rental-property-financing-ontario` | proposed-create | P1 |
| rental-acquisition-qualification-rescue | rental property financing Ontario | investment property mortgage broker Ontario; rental property closing financing Ontario; urgent rental acquisition bridge loan | Transactional + urgent | `/borrowers/rental-property-acquisition-financing` | proposed-create | P1 |
| rental-refinancing-research-decision | how to refinance a rental property Ontario | cash out refinance rental property Canada; rental property refinance equity requirements; rental income refinance qualification Ontario; rental mortgage renewal vs refinance; rental property refinance vs HELOC | Informational + commercial investigation | `/resources/rental-property-refinancing-ontario` | proposed-create | P1 |
| rental-refinancing-qualification-rescue | refinance rental property Ontario | rental portfolio refinance lender Ontario; urgent rental property refinance Ontario; rental mortgage lender replacement Ontario | Transactional + urgent | `/borrowers/rental-property-refinancing` | proposed-create | P1 |
| private-mortgage-investing-research-decision | how private mortgage investing works Ontario | private mortgage investment risks Canada; private mortgage investment returns Ontario; private mortgage due diligence checklist; direct private mortgage vs MIC; private mortgage fund vs direct lending | Informational + commercial investigation | `/resources/private-mortgage-investing-ontario` | proposed-create | P0 |
| private-mortgage-investing-qualification-rescue | private mortgage investing Ontario | invest in private mortgages Ontario; private mortgage investment opportunities Ontario; private mortgage fund opportunities Canada | Transactional + urgent | `/investing/private-mortgage-lending` | existing-update | P0 |
| partner-program-research-decision | mortgage referral fee rules Ontario | how mortgage referral programs work Ontario; who can refer a mortgage client Ontario; mortgage referral program requirements Ontario; mortgage referral program vs co brokering; construction financing referral partner | Informational + commercial investigation | `/resources/mortgage-referral-program-ontario` | proposed-create | P1 |
| partner-program-qualification-rescue | mortgage broker referral program Ontario | mortgage referral partner Ontario; refer a declined mortgage client Ontario; urgent construction financing referral | Transactional + urgent | `/partners` | existing-update | P1 |
| builder-consulting-research-decision | construction finance advisory Ontario | what does a builder financing consultant do; development feasibility consultant Toronto; construction budget review for financing; builder financing consultant vs mortgage broker; development capital stack consultant Ontario | Informational + commercial investigation | `/resources/builder-financing-readiness-ontario` | proposed-create | P1 |
| builder-consulting-qualification-rescue | builder financing consultant Toronto | construction financing strategy consultant Ontario; stalled construction project financing consultant; urgent builder capital shortfall Ontario | Transactional + urgent | `/builder-consulting` | proposed-create | P1 |

</details>

<details>
<summary><strong>CF0017</strong> — Executive recommendation — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S037](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/fairlend-keyword-research-and-cluster-report.md)</summary>

##### Executive recommendation

FairLend should not chase a generic “Ontario mortgage broker” universe first. Existing visibility already points to garden suites, private mortgages, construction draw schedules, and private-mortgage investing. Turn those signals into tightly bounded topic systems, then fill the missing commercial architecture for every other landing-page service.

The map resolves to:

- **24 pages to create**
- **8 existing pages to update**
- **16 research/decision clusters** for awareness, feasibility, and comparison
- **16 qualification/rescue clusters** for lender selection, applications, declines, cash gaps, and deadlines
- **10 P0, 18 P1, and 4 P2 clusters**

Act first on:

1. `/garden-suite`: 13 impressions at average position 2.9, zero clicks. Separate its eligibility promise from the financing page and fix title/meta fit.
2. `/borrowers/private-mortgage-financing`: 14 impressions at 10.1, zero clicks. Add cost, appraisal, qualification, exit, and bank-decline depth.
3. `/resources/construction-loan-draw-schedule`: the exact query has 3 impressions at position 91.3. Build the definitive draw toolkit and link it to DrawFlow.
4. `/investing/private-mortgage-lending`: 14 impressions at 39.4. Add direct-vs-MIC/fund, risk, and due-diligence coverage.
5. The MLI Select guide/service pair: this cluster contains the largest historical exact-query estimate in the universe.

</details>

<details>
<summary><strong>CF0018</strong> — Existing pages to update — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S037](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/fairlend-keyword-research-and-cluster-report.md)</summary>

##### Existing pages to update

| Page | Role | Required action |
|---|---|---|
| `/borrowers/private-mortgage-financing` | Private qualification/rescue | Add costs, appraisal, qualification, exit, and decline recovery. |
| `/borrowers/institutional-mortgage` | Institutional qualification | Preserve canonical URL; strengthen requirements and graduation paths. |
| `/construction-draw-financing` | Construction qualification/rescue | Position DrawFlow against conventional timing and stopped-draw failures. |
| `/multiplex-financing-gta` | Multiplex qualification | Keep property/capital intent; link out for full MLI rules. |
| `/garden-suite` | Garden research/decision | Own eligibility, site, cost, feasibility, and comparisons. |
| `/garden-suite-financing-gta` | Garden qualification | Own lender fit, draw readiness, working capital, and intake. |
| `/investing/private-mortgage-lending` | Investor opportunity | Separate structures, risks, due diligence, and opportunity intent. |
| `/partners` | Partner qualification | Clarify partner types, handoff, disclosure, and file requirements. |

</details>

<details>
<summary><strong>CF0019</strong> — garden-laneway-suites-qualification-rescue — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S037](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/fairlend-keyword-research-and-cluster-report.md)</summary>

##### garden-laneway-suites-qualification-rescue

- **Page type:** Garden-suite financing service page
- **Searcher problem:** Find a suitable financing/advisory path for a live file, qualification need, or deadline.
- **Primary keyword:** garden suite financing Toronto
- **Secondary keywords:** laneway suite construction loan Toronto; garden suite financing shortfall Toronto; urgent laneway house financing Toronto
- **Target:** `/garden-suite-financing-gta` — existing-update
- **Funnel coverage:** financing-qualification → immediate-transaction-problem
- **Required sections:**
  - Toronto eligibility, access, servicing, and permit inputs
  - Cost, contingency, rent, and equity model
  - Garden suite versus laneway house
  - HELOC versus construction draw comparison
  - Working-capital and draw-readiness checklist
  - Financing-page and intake links
- **Internal links:** `/garden-suite`, `/construction-draw-financing`
- **Boundary decision:** Maintain two pages only with strict roles: /garden-suite owns eligibility/feasibility; /garden-suite-financing-gta owns lender qualification and transaction intent.
- **Suggested tags:** `topic:garden-laneway-suites`, `intent:service`, `page:garden-suite-financing-gta`

</details>

<details>
<summary><strong>CF0020</strong> — garden-laneway-suites-research-decision — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S037](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/fairlend-keyword-research-and-cluster-report.md)</summary>

##### garden-laneway-suites-research-decision

- **Page type:** Garden-suite eligibility and feasibility hub
- **Searcher problem:** Understand feasibility, trade-offs, and the right route before committing.
- **Primary keyword:** garden suites Toronto
- **Secondary keywords:** what is a garden suite Toronto; can I build a garden suite Toronto; garden suite cost Toronto; garden suite vs laneway house Toronto; HELOC vs construction loan for garden suite
- **Target:** `/garden-suite` — existing-update
- **Funnel coverage:** awareness-education → project-feasibility → planning-comparison
- **Required sections:**
  - Toronto eligibility, access, servicing, and permit inputs
  - Cost, contingency, rent, and equity model
  - Garden suite versus laneway house
  - HELOC versus construction draw comparison
  - Working-capital and draw-readiness checklist
  - Financing-page and intake links
- **Internal links:** `/garden-suite-financing-gta`, `/construction-draw-financing`
- **Boundary decision:** Maintain two pages only with strict roles: /garden-suite owns eligibility/feasibility; /garden-suite-financing-gta owns lender qualification and transaction intent.
- **Suggested tags:** `topic:garden-laneway-suites`, `intent:research`, `page:garden-suite`

</details>

<details>
<summary><strong>CF0021</strong> — Highest-signal keyword shortlist — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S037](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/fairlend-keyword-research-and-cluster-report.md)</summary>

##### Highest-signal keyword shortlist

| Keyword | Service | Funnel | Volume | KD | CPC | GSC impr. | GSC pos. | Lead | Priority |
|---|---|---|---:|---:|---:|---:|---:|---:|---|
| MLI Select | MLI Select Insured Housing | awareness-education | 1600 | unknown | unknown | — | — | 23 | P0 |
| garden suites Toronto | Garden & Laneway Suite Financing | project-feasibility | 590 | unknown | unknown | — | — | 41 | P0 |
| MLI Select financing | MLI Select Insured Housing | financing-qualification | 20 | unknown | unknown | — | — | 81 | P0 |
| construction loan draw schedule | Construction Financing / DrawFlow | project-feasibility | 10 | unknown | unknown | 3 | 91.3 | 45 | P0 |
| construction financing Ontario | Construction Financing / DrawFlow | financing-qualification | 10 | unknown | unknown | — | — | 84 | P0 |
| private mortgage investment opportunities Ontario | Private Mortgage Investing | immediate-transaction-problem | unknown | unknown | unknown | 1 | 47 | 98 | P0 |
| invest in private mortgages Ontario | Private Mortgage Investing | financing-qualification | unknown | unknown | unknown | 1 | 53 | 82 | P0 |
| private mortgage investing Ontario | Private Mortgage Investing | financing-qualification | unknown | unknown | unknown | 1 | 90 | 82 | P0 |
| private mortgage appraisal requirements Ontario | Private Mortgages | project-feasibility | unknown | unknown | unknown | 2 | 96.5 | 42 | P0 |
| private mortgage fund opportunities Canada | Private Mortgage Investing | immediate-transaction-problem | unknown | unknown | unknown | 2 | 84.5 | 98 | P0 |
| private mortgage lenders Ontario | Private Mortgages | financing-qualification | unknown | unknown | unknown | — | — | 78 | P0 |
| garden suite financing Toronto | Garden & Laneway Suite Financing | financing-qualification | unknown | unknown | unknown | — | — | 78 | P0 |
| CMHC MLI Select lender Ontario | MLI Select Insured Housing | financing-qualification | unknown | unknown | unknown | — | — | 78 | P0 |
| multiplex financing Toronto | Multi-plex Financing | financing-qualification | unknown | unknown | unknown | — | — | 78 | P1 |
| home renovation financing Ontario | Renovation Financing | project-feasibility | unknown | unknown | unknown | — | — | 41 | P1 |
| bridge financing real estate Canada | Bridge Loans | financing-qualification | unknown | unknown | unknown | — | — | 81 | P1 |
| HELOC broker Ontario | Home Equity Line of Credit (HELOC) | financing-qualification | unknown | unknown | unknown | — | — | 78 | P1 |
| mortgage refinance broker Ontario | Residential Refinancing | financing-qualification | unknown | unknown | unknown | — | — | 78 | P1 |
| rental property financing Ontario | Existing Rental Property Acquisition Financing | financing-qualification | unknown | unknown | unknown | — | — | 78 | P1 |
| refinance rental property Ontario | Existing Rental Property Refinancing | financing-qualification | unknown | unknown | unknown | — | — | 78 | P1 |
| mortgage broker referral program Ontario | Partner / Referral Program | financing-qualification | unknown | unknown | unknown | — | — | 78 | P1 |
| builder financing consultant Toronto | Builder Consulting | financing-qualification | unknown | unknown | unknown | — | — | 78 | P1 |
| residential mortgage broker Ontario | Residential Mortgages | financing-qualification | unknown | unknown | unknown | — | — | 81 | P2 |
| institutional mortgage broker Ontario | Institutional Mortgages | financing-qualification | unknown | unknown | unknown | — | — | 78 | P2 |

</details>

<details>
<summary><strong>CF0022</strong> — Cluster-by-cluster validation — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S039](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/google-validation-report-2026-07-20.md)</summary>

##### Cluster-by-cluster validation

| Cluster | Google status | Decision | Evidence |
|---|---|---|---|
| residential-mortgages-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| residential-mortgages-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| private-mortgages-research-decision | topic-signal-target-unproven | hold-separate-guide-strengthen-existing-page | 'fair market value appraisal for private lending': 2 impressions at position 96.5; the existing private-mortgage page has 14 impressions at 10.07. Proposed /resources/private-mortgage-costs-ontario is not live. |
| private-mortgages-qualification-rescue | partial-page-signal | update-now | /borrowers/private-mortgage-financing: 14 impressions, position 10.07, 0 clicks. Related query 'fair market value appraisal for private lending': 2 impressions, position 96.5. |
| institutional-mortgages-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| institutional-mortgages-qualification-rescue | directional-no-google-signal | audit-indexation-and-retain-boundary | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| heloc-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| heloc-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| bridge-loans-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| bridge-loans-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| residential-refinancing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| residential-refinancing-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| renovation-financing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| renovation-financing-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| construction-financing-research-decision | topic-signal-target-unproven | create-with-strict-canonical-boundary | 'construction loan draw schedule': 3 impressions, position 91.3, currently associated by identical metrics with /construction-draw-financing. Proposed /resources/construction-loan-draw-schedule is not live. |
| construction-financing-qualification-rescue | validated-low-sample | update-now | Exact GSC query 'construction loan draw schedule': 3 impressions, position 91.3. /construction-draw-financing: 3 impressions, position 91.33. Identical metrics strongly associate the query with the existing page. |
| multiplex-financing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| multiplex-financing-qualification-rescue | directional-no-google-signal | audit-indexation-and-retain-boundary | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| garden-laneway-suites-research-decision | partial-page-signal | update-snippet-now | /garden-suite: 13 impressions, average position 2.92, 0 clicks. No query string is exposed for this page in the current Search Console UI. |
| garden-laneway-suites-qualification-rescue | rework-boundary | hold-separate-url | /garden-suite has 13 impressions at position 2.92. /garden-suite-financing-gta has no GSC or GA4 signal in the observed reports. |
| mli-select-research-decision | historical-only | retain-priority-not-google-validated | Historical repository estimate: 'MLI Select' 1,600 monthly searches (Canada-level, observed 2026-07-17). No current GSC or GA4 signal. |
| mli-select-qualification-rescue | historical-only | retain-priority-not-google-validated | Historical repository estimate: 'MLI Select financing' 20 monthly searches (Canada-level, observed 2026-07-17). No current GSC or GA4 signal. |
| rental-acquisition-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| rental-acquisition-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| rental-refinancing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| rental-refinancing-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| private-mortgage-investing-research-decision | topic-signal-target-unproven | create-after-page-brief-review | Private-investing query family totals 5 GSC impressions. The existing investing page has 14 impressions and one highly engaged GA4 visit; the proposed research URL is not live. |
| private-mortgage-investing-qualification-rescue | validated-low-sample | update-now | Private-investing query family: 5 GSC impressions across 'private mortgage fund', 'private mortgage investment', 'invest in private mortgages', and 'private mortgage investing'. Existing page: 14 impressions at position 39.36; GA4: 1 active user, 1 engaged session, 100% engagement, 3m47s average engagement, 15 events. |
| partner-program-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| partner-program-qualification-rescue | partial-page-signal | update-snippet-and-measurement | /partners: 5 impressions, position 5.40, 0 clicks; GA4: 1 active user, 1 engaged session, 100% engagement, 3s average engagement, 7 events. |
| builder-consulting-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| builder-consulting-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |

</details>

<details>
<summary><strong>CF0023</strong> — Page evidence — [S018](../../master-report/fairlend-seo-master-report-2026-07-20/fairlend-seo-master-report.md), [S039](../../research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/google-validation-report-2026-07-20.md)</summary>

##### Page evidence

| Page | Clicks | Impressions | CTR | Position | Decision |
|---|---:|---:|---:|---:|---|
| `https://www.fairlend.ca/` | 2 | 32 | 6.3% | 10.0 | Keep as a routing hub. |
| `https://fairlend.ca/` | 0 | 21 | 0% | 40.8 | Monitor host canonical normalization. |
| `/borrowers/private-mortgage-financing` | 0 | 14 | 0% | 10.1 | Update title/meta and deepen appraisal, costs, qualification, and exits. |
| `/investing/private-mortgage-lending` | 0 | 14 | 0% | 39.4 | Expand risk, structure, and opportunity passages. |
| `/garden-suite` | 0 | 13 | 0% | 2.9 | Highest-priority CTR/snippet correction. |
| `/disclosures` | 0 | 11 | 0% | 2.4 | Non-commercial; do not let it distort cluster prioritization. |
| `/partners` | 0 | 5 | 0% | 5.4 | Good visibility, weak engagement evidence. |
| `/construction-draw-financing` | 0 | 3 | 0% | 91.3 | Topic validated, authority insufficient. |
| `/investing` | 0 | 1 | 0% | 1.0 | Too little data to interpret. |

No query→multiple-page split is exposed by the authenticated UI, and the API credential tier is unavailable. Cannibalization remains preventive rather than empirically proven.

</details>

<details>
<summary><strong>CF0024</strong> — 5.1 Create a deliberate internal-link graph — [S026](../../measurement-and-indexing/fairlend-search-indexing-launch-runbook.md)</summary>

##### 5.1 Create a deliberate internal-link graph

1. Link every priority money page from the homepage, main navigation, or a clearly linked hub.
2. Add contextual links between closely related pages using descriptive, natural anchor text.
3. Link supporting resources upward to the relevant commercial page.
4. Add breadcrumbs where hierarchy is meaningful.
5. Ensure no intended indexable page is orphaned.
6. Do not add hundreds of repetitive footer links or city-keyword blocks.

The target architecture is:

```text
Homepage
├── Borrowers hub
│   ├── Private mortgage financing
│   ├── Institutional mortgage financing
│   ├── Construction draw financing
│   ├── Multiplex financing GTA
│   └── Garden suite financing GTA
├── Investors hub
│   └── Private mortgage lending
├── Partners
├── Expert resources / question answers
└── Trust pages: contact, privacy, terms, disclosures
```

</details>

<details>
<summary><strong>CF0025</strong> — Priority commercial launch set — [S026](../../measurement-and-indexing/fairlend-search-indexing-launch-runbook.md)</summary>

##### Priority commercial launch set

These are the first URLs to inspect after the cleanup deploy:

1. `https://www.fairlend.ca/`
2. `https://www.fairlend.ca/borrowers/private-mortgage-financing`
3. `https://www.fairlend.ca/borrowers/institutional-mortgage`
4. `https://www.fairlend.ca/construction-draw-financing`
5. `https://www.fairlend.ca/multiplex-financing-gta`
6. `https://www.fairlend.ca/garden-suite-financing-gta`
7. `https://www.fairlend.ca/investing/private-mortgage-lending`

</details>

<details>
<summary><strong>CF0026</strong> — Recommended publishing sequence — [S045](../../research/keyword-and-funnel/landing-services-funnel-2026-07-19/executive-findings.md)</summary>

##### Recommended publishing sequence

1. Refresh Garden Suite and Private Mortgage pages for snippet fit, qualification depth, and conversion path.
2. Publish Construction Draw Schedule and Private Mortgage Investing decision content.
3. Launch the MLI Select pillar/service pair using CMHC citations.
4. Build HELOC, Bridge, Renovation, Multiplex, and Rental Acquisition/Refinance money pages.
5. Add Partner and Builder Consulting B2B clusters.
6. Add broad Residential and Institutional hubs after differentiated service architecture is in place.

</details>

<details>
<summary><strong>CF0027</strong> — Acceptance criteria — [S078](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/construction-financing-readiness.md)</summary>

##### Acceptance criteria

- no universal qualification promise;
- scenarios are separated rather than collapsed into generic advice;
- checklists identify evidence owner and freshness;
- links connect to draw, MLI, multiplex, garden-suite, modular, and rescue resources without creating keyword-cannibalizing clones;
- tracking distinguishes builder, citizen developer, investor, partner, and stalled-project intent.

</details>

<details>
<summary><strong>CF0028</strong> — Acceptance criteria — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Acceptance criteria

- source and assumption register complete;
- calculator test cases pass;
- every numeric output names its input/date/range;
- no thin municipality clones;
- video/transcript/diagram requirements satisfied;
- compliance and professional reviewers approve;
- proposed tracking distinguishes calculator use, export, assessment start, and qualified submission.

</details>

<details>
<summary><strong>CF0029</strong> — Answer targets — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Answer targets

- How much does a garden suite cost in Toronto?
- What costs occur before construction?
- Can this property support a garden suite?
- What permits and professional drawings are required?
- How does financing work and when is cash needed?
- How much rent would make the project viable under the user's assumptions?
- How does a Toronto garden suite differ from a Mississauga pre-approved plan or a laneway suite?

</details>

<details>
<summary><strong>CF0030</strong> — Claims locked — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Claims locked

- “typical” cost, rent, ROI, approval time, rate, leverage, or savings without approved evidence;
- eligibility/permit/financing guarantee;
- claim that a garden suite is better than Airbnb, selling, or borrowing for every homeowner;
- fabricated testimonials or community quotes.

</details>

<details>
<summary><strong>CF0031</strong> — Multi-format requirements — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Multi-format requirements

- one long-form walkthrough video;
- three short clips;
- cost-stack diagram;
- property feasibility decision tree;
- calculator and downloadable assumptions worksheet;
- visible transcript and image alt text;
- FAQ only for questions answered visibly on the page.

</details>

<details>
<summary><strong>CF0032</strong> — Proposed structured data — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Proposed structured data

`Article` or `WebPage`, `BreadcrumbList`, `VideoObject`, and a clearly named interactive-tool entity if supported. FAQ markup only if current search guidelines permit and visible answers match exactly. No `FinancialProduct` claims should be inferred from the educational model.

</details>

<details>
<summary><strong>CF0033</strong> — Required evidence and reviewers — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Required evidence and reviewers

- EVIDENCE: current City of Toronto garden-suite and adding-units sources;
- EVIDENCE: reviewed local cost dataset with date, sample definition, and exclusions;
- EVIDENCE: financing assumptions approved by the brokerage/product reviewer;
- REVIEW: planner/designer, builder/QS, mortgage compliance, legal/tax/insurance where referenced;
- REVIEW: accessibility, calculator arithmetic, mobile layout, and print/export output.

</details>

<details>
<summary><strong>CF0034</strong> — Required modules — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Required modules

- REQUIREMENT: Give a short answer with a reviewed date, range basis, and estimate disclaimer.
- REQUIREMENT: Separate pre-construction/soft costs, site/servicing, hard construction, contingency, financing/carry, lease-up, and ongoing operating considerations.
- REQUIREMENT: Provide an input-driven model or calculator with visible assumptions and an export/print view.
- REQUIREMENT: Explain what changes with size, storeys, access, trees, servicing, existing structures, soil/site conditions, finishes, and delivery method.
- REQUIREMENT: Add a Toronto official-source navigator for zoning, preliminary review, permit guide, trees, variance, certified plans, permit status, and development-charge/parkland context.
- REQUIREMENT: Include a financing timeline showing acquisition/equity, deposits, construction draws, completion, rent/stabilization, and takeout/refinance decision.
- REQUIREMENT: Compare “garden suite,” “laneway suite,” internal additional unit, and “do nothing/sell” only at a decision level; do not force them into one cost range.
- REQUIREMENT: Include a rent/ROI scenario only with user-entered assumptions and explicit exclusions; do not claim a typical return.
- REQUIREMENT: Link to the separate financing path and property-screening assessment, not a generic contact CTA.

</details>

<details>
<summary><strong>CF0035</strong> — Requirements brief — Toronto garden-suite cost and feasibility model — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Requirements brief — Toronto garden-suite cost and feasibility model

**Status:** proposal only; not finished copy
**Priority:** P1
**Proposed canonical path:** `/resources/garden-suite-cost-toronto/`

</details>

<details>
<summary><strong>CF0036</strong> — Search task — [S079](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/garden-suite-cost-feasibility.md)</summary>

##### Search task

Help a Toronto homeowner/investor move from “could a garden suite create income?” to a property-specific estimate of feasibility, total project cost, funding need, rent assumptions, and next professional steps.

</details>

<details>
<summary><strong>CF0037</strong> — Required modules — [S082](../../research/openseo/expansion-2026-07-17/deliverables/content-briefs/toronto-permit-zoning-navigator.md)</summary>

##### Required modules

- REQUIREMENT: “Start with your address” workflow linking to zoning, Application Information Centre, permit/status, property information, garden/laneway/multiplex guides, and professional review.
- REQUIREMENT: Explain what each official tool can and cannot tell the user.
- REQUIREMENT: Add a unit-count/project-type decision tree: internal unit, garden suite, laneway suite, 2–4 multiplex, 5+ multi-unit/low-rise apartment.
- REQUIREMENT: Map municipal steps to financing evidence: property control, concept, zoning opinion/review, design, budget, approvals, appraisal, construction, inspections, lease-up, takeout.
- REQUIREMENT: Explain status labels by linking to the City glossary; never predict timing.
- REQUIREMENT: Include comparable-project/application research as a clue, not proof of approval.
- REQUIREMENT: Provide a property-screening checklist and professional-team handoff.

</details>

<details>
<summary><strong>CF0038</strong> — Next priority set — [S085](../../research/openseo/expansion-2026-07-17/deliverables/executive-findings.md)</summary>

##### Next priority set

| Order | Asset system | Why a new domain can compete | Lead bridge |
|---:|---|---|---|
| 1 | Garden-suite cost + feasibility model | Local specialty sites, Reddit, forums, calculators, and AI surfaces coexist; searchers need assumptions and financing | “Model my property/project” |
| 2 | Construction draw schedule + cash-flow template | Niche Ontario content outranks large institutions; downloadable utility and video are rewarded | “Review my schedule / compare DrawFlow” |
| 3 | MLI Select requirements + readiness checklist | Primary sources win, but implementation questions are fragmented | “Assess my 5+ unit takeout path” |
| 4 | Toronto adding-units feasibility navigator | Large measured awareness, official tools are hard for novices to connect | “Screen this property before I commit” |
| 5 | Ontario construction-financing requirements | Numeric demand around Canadian/Ontario construction loans; exact first-time-developer questions are under-served | “Build my financing-readiness file” |
| 6 | Mississauga garden-suite module | `garden suite mississauga` observed at 90 volume/difficulty 0; official pre-approved plans create a useful local source seam | “Price and finance this plan/property” |

</details>

<details>
<summary><strong>CF0039</strong> — Toronto adding-units and feasibility — [S089](../../research/openseo/expansion-2026-07-17/deliverables/primary-source-pack.md)</summary>

##### Toronto adding-units and feasibility

- [Adding New Units to Residential Properties — City of Toronto](https://www.toronto.ca/services-payments/building-construction/building-permit/adding-new-units-to-residential-properties/)
  Use for the official permit-guide paths covering garden suites, laneway suites, multiplex conversion, and secondary suites. Refresh within 90 days.
- [Considerations When Building Multiplexes — City of Toronto](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/considerations-when-building-multiplexes/)
  Use for Toronto's 2–4-unit multiplex definition, zoning-map workflow, setbacks, garden/laneway combinations, trees, and variance context. Do not apply this definition to 5+ unit financing pages without explaining the boundary.
- [Multiplex Conversion Permit Guide — City of Toronto](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/additional-dwelling-unit-guides/multiplex-conversion/)
  Use for current submission documents, related permits, and fee links. Refresh fees before every material update.
- [Garden Suites — City of Toronto](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/)
  Use for definitions, zones, current regulatory context, zoning review, minor variance, tree rules, certified plans, and exemptions. Always link to the current official page.
- [Application Information Centre — City of Toronto](https://www.toronto.ca/city-government/planning-development/application-information-centre/)
  Use for the address/application search workflow and comparable-project research. Make clear that records change and do not establish approval for the user's property.
- [Building Permit Application & Inspection Status — City of Toronto](https://www.toronto.ca/services-payments/building-construction/building-permit/after-you-apply-for-a-building-permit/search-the-status-of-a-building-permit-application/)
  Use for status terminology and property-information workflow. Never imply FairLend controls municipal timelines.

</details>

<details>
<summary><strong>CF0040</strong> — Purpose, audience, and trigger — [S140](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-laneway-financing.md)</summary>

##### Purpose, audience, and trigger

- REQUIREMENT: Define the decisions and evidence a future toronto and gta garden and laneway-suite financing page must cover.
- REQUIREMENT: Address garden laneway suite homeowner visitors who meet the stated qualification expectations.
- REQUIREMENT: Clarify the garden laneway suite construction trigger without assuming project eligibility.

</details>

<details>
<summary><strong>CF0041</strong> — section-garden-laneway-financing-decision — [S140](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-laneway-financing.md)</summary>

##### section-garden-laneway-financing-decision

- REQUIREMENT: Compare the relevant financing, program, use-case, or role decisions using equivalent and current assumptions.
- QUESTION: How can existing home equity be evaluated for garden-suite construction financing?
- EVIDENCE: Approved suite-financing criteria; Address-feasibility intake; Financing-option decision table
- EVIDENCE: Claim records claim-toronto-suite-definitions, claim-cmhc-refinance-up-to-four-units, claim-federal-secondary-suite-loan-available, claim-toronto-forgivable-suite-loan-available, claim-one-stop-end-to-end

</details>

<details>
<summary><strong>CF0042</strong> — section-garden-laneway-financing-fit — [S140](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-laneway-financing.md)</summary>

##### section-garden-laneway-financing-fit

- REQUIREMENT: Define the audience, project boundary, and disqualifying traffic before presenting a path.
- QUESTION: Can projected garden-suite rent be considered during mortgage qualification?
- EVIDENCE: Owns or is acquiring a GTA property; Has an address-specific feasibility path; Can document equity, budget, contingency, permits, rent assumptions, and intended use
- EVIDENCE: Approved suite-financing criteria

</details>

<details>
<summary><strong>CF0043</strong> — Target clusters and evidence status — [S140](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-laneway-financing.md)</summary>

##### Target clusters and evidence status

- cluster-garden-laneway-financing: Combined garden and laneway-suite financing; boundary validated-distinct; medium confidence; primary query garden suite financing Toronto.
- cluster-garden-suite-feasibility: Toronto and GTA garden-suite feasibility and rental strategy; boundary shared-support; high confidence; primary query garden suites Toronto.

</details>

<details>
<summary><strong>CF0044</strong> — Toronto and GTA garden and laneway-suite financing — requirements-only research brief — [S140](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-laneway-financing.md)</summary>

##### Toronto and GTA garden and laneway-suite financing — requirements-only research brief

- **Boundary:** requirements-only
- **Opportunity:** opportunity-garden-laneway-financing
- **Disposition:** replace
- **Existing URL:** https://www.fairlend.ca/garden-suite-financing-gta
- **Proposed URL:** /garden-suite-financing-gta
- **Priority:** critical
- **Lead Capture / Authority Build:** 73 / 70 (medium confidence)

</details>

<details>
<summary><strong>CF0045</strong> — Classification and qualification — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### Classification and qualification

- Funnel: research / project-feasibility
- Lifecycle: feasibility-capital-takeout-planning | pre-construction-readiness
- Search intent: informational
- Primary conversion specification: financing-strategy
- Qualification expectations: Toronto or confirmed GTA municipality property | Willingness to obtain survey, zoning, access, servicing, tree, permit, budget, and rent evidence

</details>

<details>
<summary><strong>CF0046</strong> — Garden-suite feasibility and project-readiness guide — requirements-only research brief — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### Garden-suite feasibility and project-readiness guide — requirements-only research brief

- **Boundary:** requirements-only
- **Opportunity:** opportunity-garden-suite-feasibility
- **Disposition:** consolidate
- **Existing URL:** https://www.fairlend.ca/garden-suite
- **Proposed URL:** /garden-suite-financing-gta/feasibility
- **Priority:** high
- **Lead Capture / Authority Build:** 62 / 70 (high confidence)

</details>

<details>
<summary><strong>CF0047</strong> — Purpose, audience, and trigger — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### Purpose, audience, and trigger

- REQUIREMENT: Define the decisions and evidence a future garden-suite feasibility and project-readiness guide page must cover.
- REQUIREMENT: Address garden laneway suite homeowner visitors who meet the stated qualification expectations.
- REQUIREMENT: Clarify the garden laneway suite construction trigger without assuming project eligibility.

</details>

<details>
<summary><strong>CF0048</strong> — section-garden-suite-feasibility-decision — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### section-garden-suite-feasibility-decision

- REQUIREMENT: Compare the relevant financing, program, use-case, or role decisions using equivalent and current assumptions.
- QUESTION: How does a long-term garden-suite rental compare with short-term rental use in Toronto?
- EVIDENCE: Address-feasibility checklist; Municipality-specific evidence standard; Current incentive-status log
- EVIDENCE: Claim records claim-toronto-suite-definitions, claim-federal-secondary-suite-loan-available, claim-toronto-forgivable-suite-loan-available, claim-ontario-enhanced-rental-rebate

</details>

<details>
<summary><strong>CF0049</strong> — section-garden-suite-feasibility-fit — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### section-garden-suite-feasibility-fit

- REQUIREMENT: Define the audience, project boundary, and disqualifying traffic before presenting a path.
- QUESTION: What property facts determine whether a Toronto garden suite is feasible and financeable?
- EVIDENCE: Toronto or confirmed GTA municipality property; Willingness to obtain survey, zoning, access, servicing, tree, permit, budget, and rent evidence
- EVIDENCE: Address-feasibility checklist

</details>

<details>
<summary><strong>CF0050</strong> — section-garden-suite-feasibility-process — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### section-garden-suite-feasibility-process

- REQUIREMENT: Describe the stage gates, documents, professional roles, risks, and handoffs without promising approval or outcomes.
- QUESTION: Is the federal secondary-suite loan available in 2026?
- EVIDENCE: Address-feasibility checklist; Municipality-specific evidence standard; Current incentive-status log; Expert-reviewed cost and document taxonomy
- EVIDENCE: Source observations source-official-toronto-garden-suites, source-official-toronto-preapproved-suites

</details>

<details>
<summary><strong>CF0051</strong> — section-garden-suite-feasibility-routing — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### section-garden-suite-feasibility-routing

- REQUIREMENT: Route only qualified users to the approved conversion and redirect adjacent or excluded intent.
- QUESTION: Which facts must the user submit, and which facts require a professional review?
- EVIDENCE: Approved financing strategy intake specification
- EVIDENCE: Privacy, consent, licensing, and compliance approval

</details>

<details>
<summary><strong>CF0052</strong> — Source observation references — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md)</summary>

##### Source observation references

- source-openseo-tracer-metrics
- source-openseo-garden-research
- source-official-toronto-garden-suites
- source-official-ontario-brokerage-public-relations
- source-official-ontario-individual-public-relations
- source-official-ontario-cost-of-borrowing-advertising

This artifact specifies research and evidence requirements only. It is not approved copy, a CMS payload, or an implementation diff.

</details>

<details>
<summary><strong>CF0053</strong> — Target clusters and evidence status — [S141](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/garden-suite-feasibility.md), [S147](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/suite-rental-comparison.md)</summary>

##### Target clusters and evidence status

- cluster-garden-suite-feasibility: Toronto and GTA garden-suite feasibility and rental strategy; boundary shared-support; high confidence; primary query garden suites Toronto.

</details>

<details>
<summary><strong>CF0054</strong> — Target clusters and evidence status — [S142](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/homepage-pathways.md)</summary>

##### Target clusters and evidence status

- cluster-mli-select-program: MLI Select five-plus-unit program and eligibility; boundary validated-distinct; high confidence; primary query MLI Select.
- cluster-garden-laneway-financing: Combined garden and laneway-suite financing; boundary validated-distinct; medium confidence; primary query garden suite financing Toronto.
- cluster-construction-financing-ontario: Ontario builder and project construction financing; boundary validated-distinct; high confidence; primary query construction mortgage Ontario.
- cluster-mortgage-realtor-referral: Mortgage-broker and realtor referral partnership; boundary validated-distinct; medium confidence; primary query mortgage broker for realtors Toronto.

</details>

<details>
<summary><strong>CF0055</strong> — Long-term versus short-term ancillary-suite rental comparison — requirements-only research brief — [S147](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/suite-rental-comparison.md)</summary>

##### Long-term versus short-term ancillary-suite rental comparison — requirements-only research brief

- **Boundary:** requirements-only
- **Opportunity:** opportunity-suite-rental-comparison
- **Disposition:** consolidate
- **Existing URL:** none
- **Proposed URL:** /garden-suite-financing-gta/feasibility
- **Priority:** low
- **Lead Capture / Authority Build:** 62 / 70 (high confidence)

</details>

<details>
<summary><strong>CF0056</strong> — Purpose, audience, and trigger — [S147](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/suite-rental-comparison.md)</summary>

##### Purpose, audience, and trigger

- REQUIREMENT: Define the decisions and evidence a future long-term versus short-term ancillary-suite rental comparison page must cover.
- REQUIREMENT: Address garden laneway suite homeowner visitors who meet the stated qualification expectations.
- REQUIREMENT: Clarify the garden laneway suite construction trigger without assuming project eligibility.

</details>

<details>
<summary><strong>CF0057</strong> — section-suite-rental-comparison-decision — [S147](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/suite-rental-comparison.md)</summary>

##### section-suite-rental-comparison-decision

- REQUIREMENT: Compare the relevant financing, program, use-case, or role decisions using equivalent and current assumptions.
- QUESTION: How does a long-term garden-suite rental compare with short-term rental use in Toronto?
- EVIDENCE: Municipal-rule comparison; Tax and financing decision matrix; Long-term rent methodology
- EVIDENCE: Claim records claim-toronto-short-term-rental-boundary, claim-cmhc-refinance-up-to-four-units

</details>

<details>
<summary><strong>CF0058</strong> — section-suite-rental-comparison-fit — [S147](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/suite-rental-comparison.md)</summary>

##### section-suite-rental-comparison-fit

- REQUIREMENT: Define the audience, project boundary, and disqualifying traffic before presenting a path.
- QUESTION: What property facts determine whether a Toronto garden suite is feasible and financeable?
- EVIDENCE: Toronto property and intended occupancy pattern; Willingness to obtain municipal, tax, lender, and insurer review
- EVIDENCE: Municipal-rule comparison

</details>

<details>
<summary><strong>CF0059</strong> — section-suite-rental-comparison-process — [S147](../../research/openseo/trial-2026-07-16/deliverables/content-briefs/suite-rental-comparison.md)</summary>

##### section-suite-rental-comparison-process

- REQUIREMENT: Describe the stage gates, documents, professional roles, risks, and handoffs without promising approval or outcomes.
- QUESTION: Is the federal secondary-suite loan available in 2026?
- EVIDENCE: Municipal-rule comparison; Tax and financing decision matrix; Long-term rent methodology; Professional review dates
- EVIDENCE: Source observations source-official-toronto-short-term-rentals, source-official-toronto-garden-suites

</details>

<details>
<summary><strong>CF0060</strong> — L1. Publish the resource cluster — [S219](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/ACTION-PLAN.md)</summary>

##### L1. Publish the resource cluster

Create licensed, cited clusters for private mortgages, construction draws, multiplex/garden suite/MLI Select, and investor education. Each resource needs a clear intent, stable URL, author/reviewer/date, Article/WebPage schema, primary sources, and links to the relevant commercial path.

</details>

<details>
<summary><strong>CF0061</strong> — M2. Repair the internal-link and sitemap relationship — [S219](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/ACTION-PLAN.md)</summary>

##### M2. Repair the internal-link and sitemap relationship

**Owners:** Information architecture, frontend/CMS
**Effort:** 1-2 days

- Add normal crawlable links to `/borrowers` and `/investing` from primary navigation, breadcrumbs, and relevant deep pages.
- Add contextual links to `/affordable-sustainable-rental-housing` and `/garden-suite` or consolidate them if they duplicate stronger pages.
- Source accurate sitemap `lastmod` values from CMS `updatedAt`; currently 16 of 17 omit them.
- Collapse the HTTP apex redirect to one direct hop.

Acceptance criteria: every indexable sitemap URL has at least one meaningful inbound link; accurate `lastmod` values; no sitemap URL redirects or noindexes.

</details>

<details>
<summary><strong>CF0062</strong> — Brief 5 - Construction Draws for Small Builders — [S220](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/CONTENT-PLAN.md)</summary>

##### Brief 5 - Construction Draws for Small Builders

**Route:** `/resources/construction-draws-small-builders`
**Primary intent:** Understand draw sequencing, inspections, evidence, reimbursement, and working capital
**Reader:** Small builder or infill developer
**Job to be done:** Plan enough cash and documentation to keep the project moving.

Required modules:

1. Answer-first explanation of construction draws.
2. Milestone-by-milestone example.
3. Evidence and inspection checklist.
4. Reimbursement timing and working-capital gap.
5. Budget drift, holdbacks, contingencies, change orders, and delay causes.
6. How DrawFlow supports visibility without guaranteeing completion.
7. Downloadable draw-readiness worksheet.

Evidence: current Ontario construction/holdback, lender, appraisal, and municipal sources selected by compliance.
Internal links: construction commercial page, working-capital guide, multiplex and garden-suite pages, partner page.
CTA: Review a draw plan with FairLend.
Schema: Article or TechArticle where appropriate + WebPage + Person reviewer + BreadcrumbList.

</details>

<details>
<summary><strong>CF0063</strong> — Cluster B - Construction, multiplex, and garden-suite financing — [S220](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/CONTENT-PLAN.md)</summary>

##### Cluster B - Construction, multiplex, and garden-suite financing

| Priority | Asset | Route | Intent | Conversion role |
|---:|---|---|---|---|
| 1 | Construction draws for small builders | Existing resource shell | Process/how-to | Fulfil the current footer promise and support DrawFlow. |
| 2 | Construction draw process in Ontario | `/posts/construction-draw-process-ontario` | Educational/commercial | Explain milestones, evidence, reimbursements, and delay risk. |
| 3 | Working-capital calculator/checklist | `/posts/construction-loan-working-capital` or interactive tool | Tool/task | Make reimbursement timing and cash needs concrete. |
| 4 | MLI Select multiplex financing | Existing resource shell | Program investigation | Fulfil the current Reports & Data promise with primary CMHC sources. |
| 5 | Multiplex financing feasibility | `/posts/multiplex-financing-feasibility-ontario` | Feasibility | Help builders evaluate site, budget, capital stack, and takeout. |
| 6 | Garden-suite financing, permits, and costs | `/posts/garden-suite-financing-permits-costs` | Local feasibility | Connect municipal requirements to financing readiness. |

</details>

<details>
<summary><strong>CF0064</strong> — Internal-link graph — [S221](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/FULL-AUDIT-REPORT.md)</summary>

##### Internal-link graph

The union of sitemap and link discovery produced 21 distinct routes: 17 indexable sitemap pages and four linked noindex routes. Four indexable sitemap pages were absent from the live internal-link graph:

- `/affordable-sustainable-rental-housing`
- `/borrowers`
- `/garden-suite`
- `/investing`

The two major hubs had zero parsed inbound anchors in the 17-page set. Add normal primary navigation, breadcrumb, and contextual links rather than relying on interface state or JavaScript interactions.

</details>

<details>
<summary><strong>CF0065</strong> — H3. The resource/topic cluster is effectively unpublished — [S224](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/SPECIALIST-CONTENT.md)</summary>

##### H3. The resource/topic cluster is effectively unpublished

`/posts` contains 44 parsed words and no articles. The two topical links described in C1 are empty in server HTML. Commercial pillars therefore lack supporting informational content and AI systems have little first-party material to cite.

Recommended cluster order:

1. **Private mortgage Ontario:** what it is, complete cost stack, first vs second position, exit strategies, bank-decline paths, renewals/payouts, and a worked borrower scenario.
2. **Construction draws:** reimbursement draw sequence, working-capital math, evidence checklist, common delay causes, budget contingencies, and a downloadable draw-readiness worksheet.
3. **Multiplex / garden suite / MLI Select:** feasibility inputs, municipality/permit links, CMHC program criteria with citations, affordability/accessibility/energy requirements, and project-stage checklists.
4. **Investor education:** direct mortgage vs MIC vs syndicated/fractional structures, LTV and mortgage position, liquidity, default/power-of-sale process, suitability, fees, tax-document workflow, and risk examples.

Every article should have licensed review, dates, primary citations, an Article/Person entity relationship, and contextual links into the appropriate service and consultation paths.

</details>

<details>
<summary><strong>CF0066</strong> — Internal linking — [S224](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/SPECIALIST-CONTENT.md)</summary>

##### Internal linking

- Shared navigation/footer links produce high raw internal-link counts, but contextual links are sparse.
- `/borrowers` and `/investing` had zero parsed inbound anchors from the 17-page HTML set.
- `/affordable-sustainable-rental-housing` and `/garden-suite` had only one parsed contextual inbound link each.
- The deepest investor page and `/partners` contained no crawlable links within their `<main>` content, despite mentioning related routes and concepts.
- Promised footer-resource anchors currently lead to empty shells or broader pages, undermining anchor relevance and trust.

</details>

<details>
<summary><strong>CF0067</strong> — Local page evidence — [S226](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260714-213733/SPECIALIST-VISUAL-LOCAL.md)</summary>

##### Local page evidence

| URL | Title | H1 | Assessment |
|---|---|---|---|
| https://www.fairlend.ca/ | `FairLend Mortgage \| Private Real Estate Financing Ontario` | `Fast Flexible Fair Financing for: multi-plex, single family, land, and private mortgage` | Strong Ontario title; generic/non-local H1. |
| https://www.fairlend.ca/contact | `Contact FairLend Mortgage \| Ontario Private Financing` | `Bring us the file. We’ll make the next move clear.` | Strong service-area copy and conversion path; H1 does not restate Ontario/Toronto. |
| https://www.fairlend.ca/multiplex-financing-gta | `Multiplex Financing GTA \| FairLend` | `A practical path from site to terms` | Good dedicated local-service URL/title; H1 misses `GTA` and `multiplex financing`. |
| https://www.fairlend.ca/garden-suite-financing-gta | `Garden Suite Financing GTA \| FairLend` | `Garden suite financing for real project constraints.` | Strong service intent; add GTA/Toronto context naturally near or in H1. |
| https://www.fairlend.ca/disclosures | `Regulatory and Website Disclosures \| FairLend Mortgage` | `Regulatory and website disclosures.` | Strong entity/licensing proof and links to the regulator. |

</details>

<details>
<summary><strong>CF0068</strong> — Low / Backlog — [S238](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/ACTION-PLAN.md)</summary>

##### Low / Backlog

1. Tighten two long meta descriptions and optionally enrich the short terms description.
2. Test longer construction/garden-suite/multiplex titles only with CTR/rank baselines.
3. Remove duplicate semantic homepage H2s generated by responsive presentation markup.
4. Remove the empty posts child sitemap once convenient, or populate it when the first post launches.
5. Reduce intake query crawl variants if the surface grows beyond the current 37 variants.
6. Decide an explicit training-crawler and optional RSL policy with legal ownership.
7. Consider HSTS preload only after every subdomain is inventoried and permanently HTTPS-capable.

</details>

<details>
<summary><strong>CF0069</strong> — 2. No published resource cluster — [S239](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/FULL-AUDIT-REPORT.md)</summary>

##### 2. No published resource cluster

[The resources hub](https://www.fairlend.ca/posts) contains only 39 main-content words and says the first field notes are being prepared. `posts-sitemap.xml` is valid but empty, and no crawled page emits `Article` or `BlogPosting` schema.

This prevents FairLend from:

- entering through informational questions before borrowers/investors become transactional;
- building topic clusters around private mortgages, construction draws, multiplexes, garden suites, and mortgage investing;
- earning links with non-commercial, evidence-rich assets;
- giving money pages reviewed supporting sources and contextual internal links;
- demonstrating sustained topical authority to search and answer engines.

</details>

<details>
<summary><strong>CF0070</strong> — Crawlability and indexability — [S239](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/FULL-AUDIT-REPORT.md)</summary>

##### Crawlability and indexability

- `robots.txt` returns 200, permits public content, blocks admin/API/preview paths, explicitly allows OAI-SearchBot, and declares the sitemap index and children.
- `sitemap.xml` is a valid sitemap index.
- `pages-sitemap.xml` contains 17 canonical HTTPS URLs; all 17 are 200, indexable, self-canonical, and non-redirecting.
- `posts-sitemap.xml` is valid and empty.
- The link crawl exhausted its queue at 55 HTML URL variants: 17 indexable pages and 38 expected `noindex, follow` variants, primarily `/intake?...` campaign/intent parameters.
- All indexable pages are within two crawl depths. The two least-linked topical routes, `/affordable-sustainable-rental-housing` and `/garden-suite`, each have only one inbound source page and need stronger contextual discovery.
- Default and Googlebot homepage bodies were identical in length; no cloaking or prerender branch was detected.
- Unknown routes return a real 404 rather than a soft 200.

</details>

<details>
<summary><strong>CF0071</strong> — Fresh-production changes that supersede the earlier cache — [S239](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/FULL-AUDIT-REPORT.md)</summary>

##### Fresh-production changes that supersede the earlier cache

The following earlier findings are resolved in the current deployment and are **not** carried forward as defects:

- `/affordable-sustainable-rental-housing` and `/garden-suite` now return `200`, `index, follow`, self-canonicals, and server-rendered content.
- [llms.txt](https://www.fairlend.ca/llms.txt) now returns `200` with verified identity, authoritative pages, regulatory sources, and citation guidance.
- HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, Permissions Policy, and report-only CSP are deployed.
- Five core YMYL pages now expose named review by Elie Soberano, current review dates, licence details, primary sources, and answer-first passages.
- An [IndexNow key endpoint](https://www.fairlend.ca/indexnow-key.txt) is live and the repository contains publish/update hooks. Submission acceptance is not externally verifiable, so this is treated as implemented but unproven operationally.

</details>

<details>
<summary><strong>CF0072</strong> — Current baseline — [S242](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/M2-INTERNAL-LINK-IMPLEMENTATION-PLAN.md)</summary>

##### Current baseline

- The audit sitemap contains 17 canonical indexable URLs.
- The posts sitemap contains zero URLs, so the resource-spoke layer does not yet exist.
- `/borrowers` is the only mature commercial hub: its body cards already link to all borrower/build paths.
- Most commercial spokes link only to themselves, a CTA, or their parent hub.
- `/garden-suite` and `/affordable-sustainable-rental-housing` each had one discovered inbound source page in the audit.
- The existing drift cache has no accepted baseline.

</details>

<details>
<summary><strong>CF0073</strong> — Expected inbound-source coverage after the first pass — [S242](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/M2-INTERNAL-LINK-IMPLEMENTATION-PLAN.md)</summary>

##### Expected inbound-source coverage after the first pass

These are distinct contextual body sources, excluding header, footer, logo, sitemap, breadcrumbs, and repeated global CTAs.

| Target | Minimum qualifying sources after implementation |
|---|---|
| `/garden-suite` | `/borrowers`, `/garden-suite-financing-gta`, `/multiplex-financing-gta` |
| `/affordable-sustainable-rental-housing` | `/borrowers`, `/borrowers/institutional-mortgage`, `/construction-draw-financing`, `/multiplex-financing-gta`, `/garden-suite` |
| `/garden-suite-financing-gta` | `/borrowers`, `/construction-draw-financing`, `/garden-suite`, `/partners` |
| `/construction-draw-financing` | `/`, `/borrowers`, `/borrowers/private-mortgage-financing`, `/borrowers/institutional-mortgage`, `/multiplex-financing-gta`, `/garden-suite-financing-gta`, `/garden-suite`, `/affordable-sustainable-rental-housing`, `/partners`, `/posts` |
| `/multiplex-financing-gta` | `/borrowers`, `/construction-draw-financing`, `/garden-suite-financing-gta`, `/garden-suite`, `/affordable-sustainable-rental-housing`, `/partners` |
| `/borrowers/private-mortgage-financing` | `/borrowers`, `/borrowers/institutional-mortgage`, `/investing`, `/investing/private-mortgage-lending` |
| `/borrowers/institutional-mortgage` | `/borrowers`, `/borrowers/private-mortgage-financing`, `/multiplex-financing-gta`, `/affordable-sustainable-rental-housing`, `/investing/private-mortgage-lending` |
| `/investing/private-mortgage-lending` | `/investing`, `/disclosures`, and the first investor resource spoke; until that spoke exists, add a contextual link from `/partners` |
| `/disclosures` | `/borrowers/private-mortgage-financing`, `/borrowers/institutional-mortgage`, `/construction-draw-financing`, `/garden-suite-financing-gta`, `/affordable-sustainable-rental-housing`, `/investing`, `/investing/private-mortgage-lending`, `/partners` |
| `/posts` | `/investing`, `/borrowers`, `/partners`, `/investing/private-mortgage-lending` after the first post is published |

The implementation crawler, not this forecast, determines final pass/fail.

</details>

<details>
<summary><strong>CF0074</strong> — Outcome — [S242](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/M2-INTERNAL-LINK-IMPLEMENTATION-PLAN.md)</summary>

##### Outcome

Build a crawlable, editorially relevant link graph in which:

- every indexable commercial URL has contextual body links from at least three distinct indexable source pages;
- each long-form page carries roughly 3–5 useful internal links per 1,000 words;
- commercial pillars, decision pages, trust content, and resource spokes reinforce one another;
- `/garden-suite` and `/affordable-sustainable-rental-housing` are no longer single-source pages;
- navigation/footer links are measured separately and never used to satisfy the contextual-link requirement;
- crawl depth, anchors, broken links, and distinct inbound body sources are stored in the SEO drift baseline.

</details>

<details>
<summary><strong>CF0075</strong> — Required source-to-target link matrix — [S242](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/M2-INTERNAL-LINK-IMPLEMENTATION-PLAN.md)</summary>

##### Required source-to-target link matrix

The table defines the first implementation pass. Anchors may be adjusted to fit sentence grammar, but must retain the stated destination intent.

| Source page | Insertion context | Destination and descriptive anchor |
|---|---|---|
| `/` | Deferred borrower/build/investor overview copy in `FairlendDeferredLandingSections.client.tsx` | `/borrowers` — “compare FairLend’s borrower financing paths”; `/construction-draw-financing` — “plan construction draws before work begins”; `/investing` — “review private mortgage investing paths” |
| `/borrowers` | Existing `FairlendPathHub` cards; add one supporting sentence beneath the grid | Retain all seven spoke links. Add `/posts` — “read FairLend’s mortgage financing guides” once the first post is published |
| `/borrowers/private-mortgage-financing` | `JudgmentDesk` policy-fit discussion | `/borrowers/institutional-mortgage` — “compare institutional mortgage qualification” |
| `/borrowers/private-mortgage-financing` | `ExitRoute` maturity/exit discussion | `/construction-draw-financing` — “plan construction draws and exit financing” |
| `/borrowers/private-mortgage-financing` | `CostXray` rates, fees, and commitment caveat | `/disclosures` — “review FairLend’s financing and commitment disclosures” |
| `/borrowers/institutional-mortgage` | `DeclineDecoder` alternatives after a policy decline | `/borrowers/private-mortgage-financing` — “review private mortgage financing alternatives” |
| `/borrowers/institutional-mortgage` | `MatchingRoute` property/program fit | `/affordable-sustainable-rental-housing` — “review affordable rental housing financing” |
| `/borrowers/institutional-mortgage` | `TermSheet` construction/takeout sequencing | `/construction-draw-financing` — “coordinate construction draws with takeout financing” |
| `/borrowers/institutional-mortgage` | `QuestionRegister` terms and availability caveat | `/disclosures` — “read FairLend’s mortgage brokerage disclosures” |
| `/construction-draw-financing` | “One place for roadmaps, draws and proof” section | `/multiplex-financing-gta` — “apply draw planning to a multiplex project”; `/garden-suite-financing-gta` — “plan garden suite construction financing” |
| `/construction-draw-financing` | Carrying-cost/takeout section | `/affordable-sustainable-rental-housing` — “review rental-project capital and takeout”; `/disclosures` — “review financing availability disclosures” |
| `/multiplex-financing-gta` | Feasibility/roadmap section | `/construction-draw-financing` — “map the construction draw sequence” |
| `/multiplex-financing-gta` | Rental and MLI Select discussion | `/affordable-sustainable-rental-housing` — “compare affordable rental financing paths” |
| `/multiplex-financing-gta` | Project-fit alternatives | `/garden-suite` — “check whether a garden suite project fits instead”; `/borrowers/institutional-mortgage` — “review institutional mortgage qualification” |
| `/garden-suite-financing-gta` | “What the review pulls in” section | `/garden-suite` — “check garden suite project eligibility” |
| `/garden-suite-financing-gta` | “Funding planned before crews wait” section | `/construction-draw-financing` — “review the full construction draw process” |
| `/garden-suite-financing-gta` | “What kills a deal” alternatives | `/multiplex-financing-gta` — “compare multiplex project financing”; `/disclosures` — “review financing limitations and disclosures” |
| `/garden-suite` | Results/readiness explanation | `/garden-suite-financing-gta` — “move from eligibility to a garden suite financing review” |
| `/garden-suite` | Budget/draw readiness explanation | `/construction-draw-financing` — “understand construction draw requirements” |
| `/garden-suite` | Alternative density path | `/multiplex-financing-gta` — “compare a multiplex financing path”; `/affordable-sustainable-rental-housing` — “explore rental housing project financing” |
| `/affordable-sustainable-rental-housing` | “Capital for rentals built to last” section | Retain `/multiplex-financing-gta` with anchor “review multiplex financing” |
| `/affordable-sustainable-rental-housing` | Development and capital-stack section | `/construction-draw-financing` — “plan construction draws and working capital”; `/borrowers/institutional-mortgage` — “review institutional mortgage options” |
| `/affordable-sustainable-rental-housing` | Eligibility/availability caveat | `/disclosures` — “review FairLend’s financing disclosures” |
| `/investing` | Existing investor path cards and supporting copy | Retain `/investing/private-mortgage-lending` and `/posts`; add `/disclosures` — “review investor and administrator disclosures”; add `/borrowers/private-mortgage-financing` — “see how private mortgage files are structured for borrowers” |
| `/investing/private-mortgage-lending` | File-evaluation/risk section | `/borrowers/private-mortgage-financing` — “see the borrower-side private mortgage process” |
| `/investing/private-mortgage-lending` | Existing institutional comparison | Retain `/borrowers/institutional-mortgage` with anchor “compare institutional mortgage underwriting” |
| `/investing/private-mortgage-lending` | Suitability, administration, and risk section | `/disclosures` — “review mortgage administrator and investor disclosures”; `/posts` — “read FairLend’s mortgage investment guides” once resources exist |
| `/disclosures` | After identity/licensing and service-limit sections | `/borrowers` — “review borrower financing paths”; `/investing/private-mortgage-lending` — “review the private mortgage lending process”; `/partners` — “see how FairLend works with professional partners” |
| `/partners` | Site-search, capital-structure, and takeout sections | `/construction-draw-financing` — “bring financing into construction draw planning”; `/multiplex-financing-gta` — “review multiplex project financing”; `/garden-suite-financing-gta` — “review garden suite financing constraints” |
| `/partners` | Relationship/licensing section | `/disclosures` — “verify FairLend’s licensing and service disclosures”; `/posts` — “share FairLend’s financing resources” once resources exist |
| `/posts` | Resource-hub introduction | `/borrowers` — “start with the borrower financing map”; `/construction-draw-financing` — “review construction draw financing”; `/investing` — “review investor paths” |

</details>

<details>
<summary><strong>CF0076</strong> — W5 — Validate and accept the drift baseline — [S242](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/M2-INTERNAL-LINK-IMPLEMENTATION-PLAN.md)</summary>

##### W5 — Validate and accept the drift baseline

Run after deployment:

```bash
pnpm seo:links --base-url https://www.fairlend.ca
```

Store in `.seo-cache/drift.json`:

```json
{
  "internal_links": {
    "captured_at": "ISO-8601",
    "indexable_urls": 17,
    "edges": [],
    "inbound_body_sources": {},
    "crawl_depth": {},
    "generic_anchors": [],
    "broken_internal_links": []
  }
}
```

Final hard gates:

- zero broken internal links;
- zero canonical targets reached through a redirect;
- zero generic anchors in M2 additions;
- commercial pillars and spokes at crawl depth 2 or less;
- resource posts at crawl depth 3 or less;
- every non-exempt indexable URL has at least three distinct inbound body sources;
- `/garden-suite` and `/affordable-sustainable-rental-housing` each have at least three;
- the accepted graph is written to the drift baseline.

</details>

<details>
<summary><strong>CF0077</strong> — Entity and mention evidence — [S244](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/SPECIALIST-CONTENT.md)</summary>

##### Entity and mention evidence

- Exact search for `"FairLend Mortgage" Ontario` did not surface the Ontario company in the sampled web results; ambiguous “FairLend” entities from Australia and unrelated credit-scoring projects appeared instead.
- `site:fairlend.ca FairLend Mortgage` and `site:fairlend.ca "private mortgage financing" Ontario` returned no results in the available search tool.
- No clear FairLend Ontario LinkedIn company, YouTube, Reddit, or Wikipedia result was found in sampled searches.

This is directional—not proof of deindexing. Verify every canonical target in Google Search Console URL Inspection and Bing Webmaster Tools. If indexed, the issue is weak discoverability/entity corroboration; if not indexed, resolve indexation before GEO promotion.

Highest-impact GEO changes:

1. Verify indexation in GSC/Bing and request indexing after any recent deployment/migration.
2. Publish reviewed, dated resource clusters with `Article`/`BlogPosting`, Person author/reviewer, primary citations, and unique data.
3. Build consistent sameAs/entity profiles: LinkedIn company and principal broker, YouTube explainers, regulator/association profiles, and legitimate partner mentions.
4. Add anonymized first-party datasets/case studies and self-contained charts/tables that others can cite.
5. Add “last reviewed,” reviewer methodology, and sources to garden-suite, multiplex, and other thin YMYL pages.

</details>

<details>
<summary><strong>CF0078</strong> — Existing cluster health — [S244](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/SPECIALIST-CONTENT.md)</summary>

##### Existing cluster health

| Metric | Current |
|---|---:|
| Published posts | 0 |
| URLs in post sitemap | 0 |
| Article/BlogPosting schema pages | 0 |
| Commercial pages with named review | 5 |
| Private-mortgage page contextual targets | 2 |
| Construction page contextual targets | 2 |
| Garden-suite-financing contextual targets | 1 |
| Orphan risk | Navigation prevents hard orphans, but body-level topical paths are sparse |

</details>

<details>
<summary><strong>CF0079</strong> — High — next 1–4 weeks — [S244](../../strategy/audits/fairlend-ca-2026-07-14/audit-runs/www-fairlend-ca-audit-20260715-013111/SPECIALIST-CONTENT.md)</summary>

##### High — next 1–4 weeks

1. Verify indexation for all 17 canonical URLs in GSC and Bing Webmaster Tools; investigate immediately if the empty `site:` sample reflects real exclusion.
2. Expand `/garden-suite-financing-gta`, `/garden-suite`, and `/multiplex-financing-gta`; add licensed review, dates, primary sources, and clear intent separation/consolidation.
3. Publish the first reviewed private-mortgage pillar/spoke cluster and replace the `/posts` placeholder with actual useful resources.
4. Add a detailed construction-stage/holdback/working-capital section and decision tool to `/construction-draw-financing`.
5. Add contextual internal links among every related service/resource page; do not rely on global navigation.
6. Publish compliance-reviewed case studies/original aggregate evidence to substantiate experience and funded-volume authority.

</details>

<details>
<summary><strong>CF0080</strong> — `/garden-suite` and `/garden-suite-financing-gta` — [S267](../../strategy/seo-audit.md)</summary>

##### `/garden-suite` and `/garden-suite-financing-gta`

Problems:

- Potential keyword/topic overlap.
- Both have metadata and canonicals, but no OG/Twitter/schema.

Recommendations:

- Decide whether one is an eligibility tool and one is a financing landing page.
- Internally link them clearly.
- Avoid duplicated title intent.
- Add Service schema and FAQ content.

</details>

<details>
<summary><strong>CF0081</strong> — Executive Summary — [S267](../../strategy/seo-audit.md)</summary>

##### Executive Summary

FairLend has a strong SEO base in one respect: most hardcoded route files define a `metadata` export, the site has robots and sitemap files, Payload SEO fields are enabled, and the home page includes FAQ JSON-LD through `FairlendFaqSection`.

The current implementation is still leaking major template defaults and is missing several high-impact SEO primitives:

- Dynamic CMS pages and posts can still publish titles like `Payload Website Template`.
- Global Open Graph defaults still identify the site as `Payload Website Template`.
- Global Twitter metadata still uses `@payloadcms`.
- The default social image is `public/website-template-OG.webp`.
- The frontend layout includes a live local development script from `http://localhost:8400/live.js`.
- Route-level Open Graph and Twitter metadata are not customized on any audited route.
- Dynamic CMS pages and posts do not emit explicit canonical URLs.
- The home page, posts listing, search page, and intake page are missing explicit canonicals.
- Structured data is thin: FAQPage exists on the home page, but Organization, FinancialService, WebSite, BreadcrumbList, Service, Article/BlogPosting, and LocalBusiness-style entity markup are missing.
- The sitemap architecture is split between static files, `next-sitemap`, and dynamic route handlers; several hardcoded App Router marketing routes are at risk of being omitted from submitted sitemaps.
- Metadata quality is inconsistent: several titles are too long, several descriptions are missing, and key commercial pages do not have page-specific social preview images.

The highest-return fix is not content volume. It is cleaning the technical metadata layer so every indexable URL has the correct brand, canonical, social metadata, sitemap inclusion, and schema. After that, FairLend should expand topical coverage around Ontario private mortgage financing, GTA multiplex financing, construction draw financing, garden suites, bridge financing, and investor/private lending trust signals.

</details>

<details>
<summary><strong>CF0082</strong> — P0: Hardcoded marketing routes may be missing from submitted sitemaps — [S267](../../strategy/seo-audit.md)</summary>

##### P0: Hardcoded marketing routes may be missing from submitted sitemaps

Evidence:

- `public/sitemap.xml` is a sitemap index pointing only to:
  - `https://fairlend.ca/pages-sitemap.xml`
  - `https://fairlend.ca/posts-sitemap.xml`
- `src/app/(frontend)/(sitemaps)/pages-sitemap.xml/route.ts` includes:
  - `/search`
  - `/en/brokerage/privacy-policy`
  - `/posts`
  - published Payload `pages` documents
- `src/app/(frontend)/(sitemaps)/posts-sitemap.xml/route.ts` includes published Payload posts.
- `next-sitemap.config.cjs` excludes `/*` and `/posts/*`, which means generated static route discovery is intentionally suppressed:
  - `exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*']`

Hardcoded routes found in source include:

- `/`
- `/affordable-sustainable-rental-housing`
- `/borrowers/private-mortgage-financing`
- `/cmhc-mli-select-multiplex-financing`
- `/construction-draw-financing`
- `/garden-suite-financing-gta`
- `/garden-suite`
- `/intake`
- `/investing/private-mortgage-lending`
- `/multiplex-financing-gta`
- `/partners`
- `/resources/construction-draws-small-builders`
- `/start/builder`

Impact:

- If these hardcoded App Router pages are not duplicated as published Payload Pages, they are not discoverable through the submitted sitemap index.
- Google can still discover them via internal links, but sitemap coverage should be complete for commercial service pages.
- Missing sitemap inclusion slows discovery and weakens operational visibility in Search Console.

Fix:

- Make one canonical sitemap source of truth.
- Recommended: create an App Router `sitemap.ts` or keep the dynamic sitemap route handlers, but explicitly include all hardcoded indexable routes.
- Keep the sitemap index if desired, but ensure every indexable URL appears in exactly one child sitemap.
- Exclude only true non-indexable routes, such as admin, previews, API endpoints, QR redirect routes, and internal utility pages.

</details>

<details>
<summary><strong>CF0083</strong> — P1: Canonical coverage is incomplete — [S267](../../strategy/seo-audit.md)</summary>

##### P1: Canonical coverage is incomplete

Confirmed missing explicit canonicals in route files:

- `/`
- `/[slug]`
- `/posts/[slug]`
- `/posts`
- `/posts/page/[pageNumber]`
- `/search`
- `/intake`
- `/fairlend-landing-hero`

Routes with explicit canonicals:

- `/affordable-sustainable-rental-housing`
- `/borrowers/private-mortgage-financing`
- `/cmhc-mli-select-multiplex-financing`
- `/construction-draw-financing`
- `/en/brokerage/privacy-policy`
- `/garden-suite-financing-gta`
- `/garden-suite`
- `/investing/private-mortgage-lending`
- `/multiplex-financing-gta`
- `/partners`
- `/resources/construction-draws-small-builders`
- `/start/builder`

Impact:

- Canonicals are especially important for Payload dynamic pages, paginated blog indexes, and URLs that could appear with tracking parameters.
- Missing canonical metadata makes duplicate URL consolidation less explicit.

Fix:

- Add `alternates: { canonical: '/' }` to the home page metadata.
- Add canonical generation to `generateMeta` for Payload Pages and Posts.
- For posts, canonical should be `/posts/${slug}`.
- For Payload pages, canonical should be `/` for `home`, otherwise `/${slug}`.
- For paginated posts, canonical should usually be the page URL itself unless intentionally consolidated.
- Add `robots: { index: false, follow: true }` to `/search` if it is meant as internal search only.

</details>

<details>
<summary><strong>CF0084</strong> — P1: Route-level Open Graph and Twitter metadata are not customized — [S267](../../strategy/seo-audit.md)</summary>

##### P1: Route-level Open Graph and Twitter metadata are not customized

Audit result:

- 20 frontend route files reviewed.
- 0 route files define route-specific `openGraph`.
- 0 route files define route-specific `twitter`.
- Global Open Graph exists, but it currently uses template defaults.

Impact:

- Social previews are generic or wrong.
- Shared links to commercial pages do not reinforce the exact service, location, or offer.
- Google and other consumers get less page-specific context.

Fix:

- Define a small `buildFairlendMetadata()` utility that standardizes:
  - title
  - description
  - canonical
  - Open Graph title
  - Open Graph description
  - Open Graph URL
  - Open Graph image
  - Twitter card
  - optional robots directive
- Use that utility for both hardcoded routes and Payload-generated metadata.
- Create one branded default OG image and at least service-specific OG images for:
  - private mortgage financing
  - construction draw financing / DrawFlow
  - multiplex financing
  - garden suite financing
  - investor private mortgage lending
  - partner program

</details>

<details>
<summary><strong>CF0085</strong> — P1: Structured data is underbuilt — [S267](../../strategy/seo-audit.md)</summary>

##### P1: Structured data is underbuilt

Current state:

- The home page imports `FairlendFaqSection`.
- `src/components/FairlendFaqSection/index.tsx` emits JSON-LD.
- `src/components/FairlendFaqSection/data.ts` defines a `FAQPage`.
- No other source-level `schema.org` or `application/ld+json` usage was found in the frontend route layer.

Impact:

- Search engines get limited entity clarity about FairLend as a business.
- Service pages do not declare the service, area served, provider, or page breadcrumbs.
- Blog posts do not emit Article/BlogPosting schema.
- The site misses trust signals that matter for financial services queries.

Fix:

Add a structured data layer with reusable helpers:

- `Organization` or `FinancialService`
  - Legal name: FairLend Management Inc., if that is the correct legal entity.
  - Brand name: FairLend Mortgage.
  - URL: `https://fairlend.ca`
  - Logo.
  - Contact phone and email.
  - Service area: Ontario, Greater Toronto Area, Toronto, depending on compliance review.
  - SameAs links for verified social and regulator profiles.
  - Licensing reference, if appropriate and compliant.
- `WebSite`
  - Site name and URL.
  - Optional `SearchAction` only if public search results are intended to be indexable and stable.
- `BreadcrumbList`
  - Service pages, posts, category pages, and nested content.
- `Service`
  - Private mortgage financing.
  - Construction draw financing.
  - Multiplex financing.
  - Garden suite financing.
  - Investor private mortgage lending.
  - Partner program.
- `Article` or `BlogPosting`
  - Posts should include headline, description, image, author, datePublished, dateModified, publisher, and canonical URL.
- Keep `FAQPage` only where the visible FAQ content exactly matches the JSON-LD.

</details>

<details>
<summary><strong>CF0086</strong> — P2: Metadata quality needs tightening — [S267](../../strategy/seo-audit.md)</summary>

##### P2: Metadata quality needs tightening

Route metadata matrix from source review:

| Route | Metadata | Canonical | OG | Twitter | Title length | Description length |
| --- | --- | --- | --- | --- | ---: | ---: |
| `/` | yes | no | no | no | 73 | 137 |
| `/[slug]` | dynamic | no | no | no | n/a | n/a |
| `/affordable-sustainable-rental-housing` | yes | yes | no | no | 67 | 143 |
| `/borrowers/private-mortgage-financing` | yes | yes | no | no | 84 | 168 |
| `/cmhc-mli-select-multiplex-financing` | yes | yes | no | no | 55 | 152 |
| `/construction-draw-financing` | yes | yes | no | no | 44 | 128 |
| `/en/brokerage/privacy-policy` | yes | yes | no | no | 41 | 168 |
| `/fairlend-landing-hero` | no | no | no | no | n/a | n/a |
| `/garden-suite-financing-gta` | yes | yes | no | no | 46 | 157 |
| `/garden-suite` | yes | yes | no | no | 51 | 141 |
| `/intake` | yes | no | no | no | 70 | 86 |
| `/investing/private-mortgage-lending` | yes | yes | no | no | 82 | 252 |
| `/multiplex-financing-gta` | yes | yes | no | no | 43 | 161 |
| `/partners` | yes | yes | no | no | 70 | 237 |
| `/posts` | dynamic | no | no | no | 64 | missing |
| `/posts/[slug]` | dynamic | no | no | no | n/a | n/a |
| `/posts/page/[pageNumber]` | dynamic | no | no | no | 45 | missing |
| `/resources/construction-draws-small-builders` | yes | yes | no | no | 57 | 124 |
| `/search` | dynamic | no | no | no | 25 | missing |
| `/start/builder` | yes | yes | no | no | 34 | 128 |

Recommended metadata rules:

- Keep most titles near 45 to 60 characters when possible.
- Keep descriptions around 120 to 160 characters, with room for natural language rather than keyword stuffing.
- Put the primary service and region early in title tags.
- Avoid titles that are too broad, such as lists of many financing categories.
- Make each description a useful search result pitch, not just an internal product summary.

Specific title and description improvements:

- Home title is long. Consider: `FairLend Mortgage | Private Real Estate Financing Ontario`
- `/borrowers/private-mortgage-financing` title is too long. Consider: `Private Mortgage Financing Ontario | FairLend`
- `/investing/private-mortgage-lending` title is too long. Consider: `Private Mortgage Investing Ontario | FairLend`
- `/partners` title is too long. Consider: `FairLend Partner Program | GTA Build Financing`
- `/intake` description is too short and the page lacks canonical. Either noindex it or rewrite as a branded request page.
- `/posts`, paginated posts, and `/search` need descriptions if they remain indexable.

</details>

<details>
<summary><strong>CF0087</strong> — P2: Search result quality and content depth can improve — [S267](../../strategy/seo-audit.md)</summary>

##### P2: Search result quality and content depth can improve

Current commercial coverage is directionally strong:

- Private mortgage financing.
- Construction draw financing.
- Multiplex financing.
- Garden suite eligibility.
- Affordable sustainable rental housing.
- Investor private mortgage lending.
- Partner program.

What is missing or underdeveloped:

- Clear topical clusters for Ontario/GTA search intent.
- Educational pages that explain underwriting, draws, bridge financing, private lending risk, lender expectations, and borrower documentation.
- Case-study style pages.
- Comparison pages.
- Glossary pages.
- Author/expert profile pages.
- Editorial policy and compliance review signals.
- Strong internal linking from informational content to commercial pages.

Content opportunities:

- `Private Mortgage Financing in Ontario`
- `Private Mortgage Financing in Toronto`
- `Second Mortgage Financing Ontario`
- `Bridge Financing for Property Owners`
- `Construction Draw Mortgage Financing Ontario`
- `Construction Draw Schedule Guide`
- `Multiplex Financing in Toronto`
- `CMHC MLI Select Readiness Checklist`
- `Garden Suite Financing Ontario`
- `Private Mortgage Investing Ontario`
- `Mortgage Investment Risk Guide`
- `Builder Working Capital and Draw Timing`
- `How Private Mortgage Underwriting Works`
- `What Documents Borrowers Need for Private Mortgage Financing`
- `Broker Referral Program for Private Mortgages`

Each page should have:

- One search intent.
- One primary keyword family.
- Strong internal links.
- Clear CTA.
- FAQ section.
- Schema where appropriate.
- Compliance-reviewed wording.

</details>

<details>
<summary><strong>CF0088</strong> — Phase 5: Improve content architecture — [S267](../../strategy/seo-audit.md)</summary>

##### Phase 5: Improve content architecture

1. Build location and service clusters around Ontario, Toronto, GTA, private mortgage, construction draw, multiplex, garden suite, investor lending, and broker/partner intent.
2. Add author/expert pages and editorial review signals.
3. Add case studies and scenario pages.
4. Link informational content back to commercial conversion pages.
5. Add comparison and checklist assets that naturally earn links and improve topical authority.

</details>

## Content reconciliation

- Unique connected content records: **78**.
- Unique content/recommendation Markdown fragments: **88**.
- Canonical retained routes: **2**; redirected legacy routes: **1**; standalone Laneway route: **deferred pending evidence**.
- FAQ recommendations are retained as page content, not converted into unsupported commercial rich-result claims.
