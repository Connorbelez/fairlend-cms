# FairLend SEO Action Plan

**Source audit:** 2026-07-14  
**Current weighted score:** 68/100  
**Priority rule:** Critical blocks indexing or creates a verified penalty condition; High materially affects rankings, trust, security, or conversion; Medium is a meaningful optimization; Low is backlog.

## Critical - Immediate

No verified critical issue. The site is crawlable, canonical, indexable, and free of broken internal routes in the tested scope.

## High - Complete Within One Week

### H1. Reduce mobile first-party rendering and hydration cost

**Owners:** Frontend engineering, performance  
**Effort:** 3-5 engineering days for the first pass  
**Evidence:** Lighthouse mobile 33-35, 10.89 s LCP, 3.10 s TBT; desktop 56; high-cost first-party deployment chunk; 518 KB below-fold footer image.

Actions:

1. Enable the Next.js bundle analyzer for a production build and map `36-7uqfsjqd4r.js` to source modules.
2. Dynamically import below-fold animation, calculators, carousels, and interaction-heavy sections.
3. Remove duplicate responsive DOM where one semantic source can be laid out with CSS.
4. Recompress and responsive-size the footer waterfront image; defer it until near viewport.
5. Audit eager images and JavaScript requested before the first conversion action.
6. Preserve the current server-rendered title, content, canonical, and schema behavior.

Acceptance criteria:

- median of three Lighthouse mobile runs >= 70;
- mobile LCP <= 2.5 s and TBT <= 200 ms in the agreed lab profile;
- no regression in server-rendered SEO content;
- no horizontal scroll or broken hero/application behavior at 375 x 812, 390 x 844, 768 x 1024, and 1365 x 768.

### H2. Resolve the two resource shells and destination-label mismatches

**Owners:** Content, compliance, frontend/CMS  
**Effort:** 2-5 days per resource if publishing; under 1 day if redirecting/removing  
**Routes:** `/cmhc-mli-select-multiplex-financing`, `/resources/construction-draws-small-builders`

Choose one outcome per route:

- publish a complete server-rendered resource with one H1, useful body content, licensed review, update date, primary sources, schema, and contextual links; or
- remove the promotional link and 301 to the closest complete page until the resource is ready.

Also fix the labels "Rate Sheet," "Track Record," "Reports & Data," "Builder Draw Guide," and "Mezzanine Capital" so each destination fulfills the promise.

Acceptance criteria:

- no internally promoted route returns a 66-word/no-H1 shell;
- every promotional anchor has a destination-specific section or accurately describes the target;
- any page switched to `index, follow` is added to the sitemap only after content/schema review.

### H3. Add a licensed editorial trust system for YMYL pages

**Owners:** Principal broker/compliance, content, frontend  
**Effort:** 2-4 days for the reusable pattern plus page review

Actions:

1. Add written-by, reviewed-by, last-reviewed, and source-note components.
2. Create a substantive principal-broker profile with role, experience, licences, areas of expertise, and regulator links.
3. Add relevant FSRA, CMHC, municipal, or statutory citations beside material program/regulatory claims.
4. Standardize `$1B+`, `more than $2B`, `24 hrs`, and `28+ years` claims with scope, methodology, and as-of date.
5. Add compliance-safe worked examples and case studies that disclose assumptions and do not imply guaranteed outcomes.
6. Connect Person/WebPage/Article/Organization entities with stable `@id` values.

First pages:

- `/borrowers/private-mortgage-financing`
- `/borrowers/institutional-mortgage`
- `/investing/private-mortgage-lending`

Acceptance criteria:

- every material financial page shows a named licensed reviewer and review date;
- primary claims have adjacent source/method notes;
- schema validates with no broken entity links;
- compliance signs off before deployment.

### H4. Fix the mobile first-visit consent and CTA path

**Owners:** Product design, frontend, privacy/compliance  
**Effort:** 2-3 days

Actions:

1. Convert consent to a compact accessible bottom sheet with concise copy and equally valid accept/reject choices; keep Manage secondary.
2. Cap initial height so a labelled primary CTA remains visible.
3. Add a persistent labelled mobile CTA such as "Book consultation" or "Start application."
4. Pull a compact trust row above the fold: FSRA licensed, Ontario, and one supportable experience signal.
5. Make header, carousel, tabs, and CTA targets at least 44 x 44 px.
6. Reduce mobile hero size/leading enough to show a conversion action without losing the visual identity.

Acceptance criteria:

- first-visit consent does not cover the primary CTA at 360 x 800 or 390 x 844;
- keyboard/screen-reader flow remains correct;
- consent event semantics and privacy behavior are unchanged;
- one labelled conversion action and one trust signal are visible in the first mobile viewport.

### H5. Add response security headers safely

**Owners:** Platform/security, frontend  
**Effort:** 1-3 days including report-only observation

Actions:

1. Add `X-Content-Type-Options: nosniff`.
2. Add a restrictive `Referrer-Policy`.
3. Introduce Content-Security-Policy in report-only mode, collect violations, then enforce.
4. Protect framing with CSP `frame-ancestors` and/or `X-Frame-Options` where appropriate.
5. Add a minimal `Permissions-Policy` for actually used features.
6. Remove `X-Powered-By`.

Acceptance criteria:

- headers appear on HTML and error responses;
- no Payload admin, media, analytics, maps/address autocomplete, booking, or intake workflow is broken;
- CSP is enforced only after report-only violations are resolved.

## Medium - Complete Within One Month

### M1. Correct headings, descriptions, and semantic landmarks

**Owners:** Frontend, content  
**Effort:** 1-2 days

- Change the embedded intake-flow H1 to H2/form heading on the institutional, private mortgage, and investor pages.
- Shorten high-value descriptions to about 145-160 characters on institutional mortgage, partners, private mortgage, investor mortgage, and borrowers.
- Ensure visible primary homepage content sits inside a single `<main>` landmark.
- Avoid duplicated desktop/mobile content trees when CSS can lay out one semantic source.

Acceptance criteria: one H1 on every indexable page; no duplicate metadata; primary content inside one main landmark.

### M2. Repair the internal-link and sitemap relationship

**Owners:** Information architecture, frontend/CMS  
**Effort:** 1-2 days

- Add normal crawlable links to `/borrowers` and `/investing` from primary navigation, breadcrumbs, and relevant deep pages.
- Add contextual links to `/affordable-sustainable-rental-housing` and `/garden-suite` or consolidate them if they duplicate stronger pages.
- Source accurate sitemap `lastmod` values from CMS `updatedAt`; currently 16 of 17 omit them.
- Collapse the HTTP apex redirect to one direct hop.

Acceptance criteria: every indexable sitemap URL has at least one meaningful inbound link; accurate `lastmod` values; no sitemap URL redirects or noindexes.

### M3. Extend the entity/schema graph

**Owners:** SEO/frontend, content  
**Effort:** 1-2 days

- Add linked WebPage/subtype nodes to standard pages.
- Add Person author/reviewer nodes and connect future Article nodes.
- Retain Organization + FinancialService, WebSite, Service, ContactPage, and BreadcrumbList.
- Treat FAQPage as semantic markup, not a Google rich-result promise.

Acceptance criteria: Schema.org Validator and Google Rich Results Test complete without syntax/entity errors.

### M4. Build answer-first GEO assets and `llms.txt`

**Owners:** Content, SEO, compliance  
**Effort:** 3-5 days after resource publication

- Add semantic comparison tables for private vs institutional, first vs second mortgage, cost components, draw steps, and investment structures.
- Write self-contained source-backed answers with dates and licensed review.
- Publish `llms.txt` linking only to complete authoritative borrower, investor, construction, disclosure, and leadership pages.
- Add downloadable checklists/calculators where they materially help the decision.

Acceptance criteria: cited passages make sense out of context; every numeric/regulatory claim has a source/date; `llms.txt` returns 200 and contains no draft/shell URL.

### M5. Establish local search and review operations

**Owners:** Marketing/operations, compliance  
**Effort:** 2-4 days plus ongoing review management

- Verify GBP ownership, category, service-area/public-office model, services, hours, photos, and review process.
- If the North York address is not customer-facing, keep the SAB address hidden and do not fabricate a storefront.
- Normalize Apple Business Connect, Bing Places, and credible Canadian mortgage/local directory profiles.
- Add verified social/directory profiles to `sameAs`.
- Strengthen Ontario/GTA language in service-page H1s naturally.

Acceptance criteria: business identity and phone are consistent; address policy matches reality; verified profile links are visible; reviews are handled policy-compliantly.

## Low / 30-90 Day Growth Work

### L1. Publish the resource cluster

Create licensed, cited clusters for private mortgages, construction draws, multiplex/garden suite/MLI Select, and investor education. Each resource needs a clear intent, stable URL, author/reviewer/date, Article/WebPage schema, primary sources, and links to the relevant commercial path.

### L2. Establish a scoreable backlink baseline

Connect Moz plus Bing Webmaster, or DataForSEO. Capture referring domains, quality distribution, anchors, toxic indicators, follow/nofollow mix, geographic relevance, and new/lost velocity. Do not disavow links without verified link-level evidence.

### L3. Earn authority through useful evidence

Turn DrawFlow, construction-draw guidance, multiplex/GTA research, Ontario financing datasets, worked scenarios, and licensed expert commentary into citation-worthy assets for builders, architects, planners, real-estate professionals, housing publications, and mortgage associations.

## Validation Checklist

After each release:

1. Crawl all sitemap and internally linked routes; confirm status, robots, canonical, H1, and inbound links.
2. Run three Lighthouse mobile tests and use the median; record desktop as a secondary diagnostic.
3. Capture first-visit mobile, tablet, laptop, and desktop screenshots with consent visible and dismissed.
4. Validate schema with Schema.org Validator and Google's live test.
5. Inspect response headers on homepage, error, intake, media, API, and admin routes.
6. Re-check robots and all sitemaps.
7. Once credentials exist, record GSC index coverage/query data, CrUX CWV, GA4 organic conversion, GBP visibility/reviews, and backlink baselines.

## Expected Score Movement

This is directional, not a ranking guarantee:

| Work completed | Likely category movement | Weighted effect |
|---|---|---:|
| Performance first pass | 39 -> 65-75 | +2.6 to +3.6 |
| YMYL editorial system + resource fixes | Content 61 -> 75-82 | +3.2 to +4.8 |
| Heading/link/metadata cleanup | On-page 70 -> 82-88 | +2.4 to +3.6 |
| WebPage/Person graph | Schema 90 -> 95 | +0.5 |
| GEO answer/source system | GEO 56 -> 72-80 | +1.6 to +2.4 |
| Meaningful image-alt cleanup | Images 72 -> 82 | +0.5 |

Completing the High and Medium tracks should move the weighted score from 68 into roughly the low-to-mid 80s, assuming validation passes and no new regressions are introduced.
