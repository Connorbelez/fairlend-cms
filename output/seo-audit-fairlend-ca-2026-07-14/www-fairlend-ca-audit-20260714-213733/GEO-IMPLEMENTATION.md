# FairLend AI Search / GEO Implementation

**Implemented:** July 14, 2026  
**Source audit:** `FULL-AUDIT-REPORT.md`  
**Baseline GEO score:** 56/100  
**Status:** Source-complete; deployment validation remains

## Outcome

The source now exposes a curated AI discovery file, answer-first passages, semantic comparison tables, visible licensed review evidence, current primary sources, and a connected Organization/Person/WebPage/Service schema graph on FairLend's principal mortgage pages.

This implementation does not claim a new production score before deployment and recrawl. The audit's directional 72-80 GEO range is reasonable only after the deployed checks below pass.

## Implemented

### 1. Curated `llms.txt`

- Added a force-static `/llms.txt` route with `text/plain` output and CDN-friendly caching.
- Identifies the legal and operating names, Principal Broker, FSRA licences, service area, contact details, claim methodology, and material risk qualifications.
- Links only to complete authoritative company, borrower, construction, investing, partner, disclosure, and contact pages.
- Excludes the retired resource shells and does not expose drafts, admin routes, APIs, or intake data.

### 2. Citation-ready answer blocks

Added a reusable server-rendered answer component with a question heading, self-contained answer, and accessible semantic table. It is used for:

- `/borrowers/private-mortgage-financing` — private mortgage definition and private-versus-institutional comparison;
- `/borrowers/institutional-mortgage` — institutional mortgage definition and lender-category comparison;
- `/investing/private-mortgage-lending` — private mortgage investing definition and risk-review framework;
- `/construction-draw-financing` — draw mechanics and evidence/decision sequence;
- `/affordable-sustainable-rental-housing` — project financeability and evidence framework.

The passages state scope, decision ownership, underwriting dependencies, and material risk instead of promising approval, funding, rates, returns, or recovery.

### 3. Visible YMYL review and sources

The five pages above now display:

- reviewer name and role: Elie Soberano, Principal Broker;
- broker, brokerage, and administrator licence identifiers;
- last-reviewed date;
- claim methodology;
- primary-source links relevant to the page.

Sources include the FSRA licence registry, current FSRA mortgage consumer guidance, Ontario's Construction Act, and CMHC's current multi-unit rental housing insurance guidance.

### 4. Entity and provenance graph

- Added a stable Principal Broker `Person` entity linked to the FairLend `Organization`.
- Added the FSRA broker credential and explicit mortgage expertise topics to the Person node.
- Added stable `@id` values for Organization, WebSite, WebPage, Service, BreadcrumbList, BlogPosting, and Person nodes.
- Connected reviewed service-page WebPage nodes to the visible Principal Broker review.
- Added CMS post author Person nodes while intentionally withholding per-article reviewer schema because the CMS has no explicit reviewer approval field.

### 5. Crawl and resource hygiene already incorporated

- Public `robots.txt` allows public crawling and explicitly permits OAI-SearchBot while blocking admin, API, and preview routes.
- The two audited noindex resource shells are retired to complete destination pages through permanent redirects.
- Misleading footer destination labels were replaced with accurate links and descriptions.

## Primary sources verified during implementation

- [FSRA mortgage brokering](https://www.fsrao.ca/consumers/mortgage-brokering)
- [FSRA mortgage application process](https://www.fsrao.ca/consumers/mortgage-brokering/mortgage-application-process)
- [FSRA working with a mortgage professional](https://www.fsrao.ca/consumers/mortgage-brokering/working-mortgage-professional)
- [FSRA brokerage and administrator licensing](https://www.fsrao.ca/licensing/mortgage-brokerage/about-mortgage-brokerage-and-mortgage-administrator-licences)
- [Ontario Construction Act](https://www.ontario.ca/laws/statute/90c30)
- [CMHC multi-unit and rental housing mortgage loan insurance](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance)

## Validation completed

| Check | Result |
|---|---|
| Prettier on changed GEO files | Pass |
| ESLint on changed GEO files | Pass |
| Git whitespace/error check | Pass |
| `llms.txt` required sections and curated links | Pass by source assertion |
| Visible review block matches reviewed WebPage schema | Pass by source assertion |
| Answer blocks are server components with semantic headings/tables | Pass by source assertion |
| New component design hook | Pass after replacing off-ramp literal type sizes with design-system steps |

Per repository instructions for marketing-page work, no build, Playwright, or E2E run was performed. The optional `impeccable audit` shell executable is not installed; hook findings in pre-existing bespoke page CSS and fluid hero typography were not introduced or modified by this GEO change.

## Deployment validation remaining

1. Confirm `https://www.fairlend.ca/llms.txt` returns `200`, `text/plain`, production-domain URLs, and no shell/draft route.
2. Validate representative service pages in Schema.org Validator and Google's Rich Results Test after deployment.
3. Fetch deployed HTML without JavaScript and confirm the answer, table, reviewer, review date, and sources remain present.
4. Recrawl the five revised pages and rescore GEO against the 56/100 baseline.
5. Add an explicit CMS reviewer field and approval workflow before adding `reviewedBy` to BlogPosting schema.
6. Decide content licensing terms before publishing an RSL policy; no licensing rights were inferred in this implementation.
7. Publish substantive, author-reviewed resource articles and build third-party entity authority through verified GBP, directories, citations, and editorial mentions.

## Files central to the implementation

- `src/app/(frontend)/llms.txt/route.ts`
- `src/components/SEO/FairlendGeoAnswerBlock.tsx`
- `src/components/SEO/FairlendEditorialReview.tsx`
- `src/components/SEO/FairlendRouteSeo.tsx`
- `src/utilities/structuredData.ts`
- `src/lib/fairlend-editorial.ts`
- the five reviewed page routes listed above
