# FairLend SEO Action Plan

**Baseline:** 79/100 on July 14, 2026 EDT  
**Objective:** remove the performance/conversion ceiling, establish reviewed topical authority, and make FairLend's regulated local entity independently verifiable.

## Priority Definitions

- **Critical:** blocks indexing or creates penalty exposure; fix immediately.
- **High:** materially affects rankings, conversion, or entity trust; complete within 1–4 weeks.
- **Medium:** compounds authority/performance and prevents regression; complete within 1–2 months.
- **Low:** useful refinement after the main constraints are removed.

## Critical — Immediate

No critical indexing blocker or penalty condition was proven. Do not manufacture urgency from the empty public `site:` sample; verify indexation in Search Console and Bing Webmaster first.

## High — Complete Within 1–4 Weeks

### H1. Reduce homepage mobile LCP and hydration cost

**Why:** Median mobile Lighthouse is 56 with LCP 9.44s. The LCP asset is already discoverable/eager/high-priority; render and main-thread cost dominate.

**Implementation surface:**

- `src/app/(frontend)/page.tsx`
- `src/components/FairlendLandingHero/`
- `src/components/FairlendLandingSections.tsx`
- `src/components/FairlendRouteSelector/`
- large below-fold client components imported by the homepage section graph

**Work:**

1. Profile the first-party chunk responsible for the worst long task and map it to source modules.
2. Convert non-interactive sections to server components; isolate only controls requiring state/effects.
3. Defer or dynamically load below-fold calculators, motion, carousels, maps, and application helpers.
4. Remove duplicated desktop/mobile DOM when CSS can adapt one semantic structure.
5. Reduce the 3,573-element DOM and 175 body children.
6. Purge unused CSS and split page-specific styles/chunks.
7. Preserve the hero skyline's eager/high-priority discovery; optimize its selected mobile candidate and measured 87 KB opportunity.

**Acceptance criteria:**

- three cold mobile Lighthouse trials; median performance ≥80;
- median LCP ≤2.5s, TBT <200ms, CLS ≤0.1;
- no regression to title, H1, canonical, robots, JSON-LD, CTA visibility, or reduced-motion behavior;
- representative mobile transfer and hydrated JS materially lower than the baseline 1.93 MB / 768 KB JS;
- field CWV baseline added when CrUX/GSC data becomes available.

### H2. Publish the first reviewed resource cluster

**Why:** `/posts` is a 39-word placeholder, the post sitemap has zero URLs, and cluster maturity is 28/100.

**First cluster:** private mortgages in Ontario, anchored to `/borrowers/private-mortgage-financing`.

**Initial reviewed spokes:**

1. Private mortgage rates, fees, and total-cost illustrations in Ontario.
2. Exit strategies, renewals, and payout planning.
3. First versus second private mortgages.
4. Private mortgage versus B lender versus institutional mortgage.
5. Documents, appraisal, LTV, and time-to-commitment.
6. Missed payments, enforcement risk, and borrower questions.

**Publishing contract:**

- named author and licensed reviewer;
- publication and review dates;
- primary regulatory/legal sources;
- original example, table, checklist, or data point;
- plain-language summary plus explicit risk/limitation language;
- `Article`/`BlogPosting`, Person author/reviewer, breadcrumb, and WebPage schema;
- spoke → pillar, pillar → every spoke, and each spoke → 2–3 siblings;
- no generic bulk publishing or synthetic “2026 guide” churn.

**Acceptance criteria:**

- `/posts` lists at least one genuinely useful reviewed article;
- `posts-sitemap.xml` contains only published canonical 200 URLs with accurate `lastmod`;
- every post passes metadata/H1/canonical/schema/source/reviewer checks;
- Search Console/Bing submission and indexation state recorded per URL.

### H3. Expand and disambiguate thin YMYL pages

**Priority URLs:**

- `/garden-suite-financing-gta`
- `/garden-suite`
- `/multiplex-financing-gta`
- `/investing`
- `/borrowers`
- `/construction-draw-financing`

**Work:**

1. Give the two garden-suite URLs distinct jobs—commercial financing decision page versus eligibility/intake tool—or consolidate them.
2. Add eligibility, equity, budget, contingency, permit/approval dependencies, appraisal, mortgage position, first-draw working capital, draw evidence, and takeout paths.
3. Add reviewed-by/date/licence/source modules to garden-suite and multiplex content.
4. Add a stage-by-stage draw table, holdback/carrying-cost explanation, required evidence, verifier, timing, and working-capital guidance to construction finance.
5. Add one anonymized, compliance-reviewed case study to each priority commercial theme.
6. Make borrower/investor hubs useful decision maps rather than thin navigation shells.

**Acceptance criteria:**

- every indexed YMYL service page answers the primary decision questions without requiring a sales call;
- named licensed review, current date, and primary sources are visible;
- each page has 3–5 relevant body links and a unique intent statement;
- garden-suite URLs show no material keyword/intent cannibalization in GSC after reindexing.

### H4. Fix the mobile consent-to-application path

**Implementation surface:** `src/components/Analytics/AnalyticsProvider.client.tsx`, mobile header, and homepage hero/application layout.

**Work:**

1. Keep equal reject/accept prominence and access to granular management.
2. Reduce the consent panel's occupied mobile height or move the application entry above the obstruction.
3. Preserve focus management, keyboard access, screen-reader names, and consent persistence.
4. Increase header call/menu hit areas to at least 44×44 CSS pixels.
5. Raise critical proof, phone, and authority text from 7–11px to a legible size.
6. Add an obvious return-to-application affordance after users scroll through the long page.

**Acceptance criteria:**

- at 320, 375, and 390px widths, both consent choices and the application entry remain discoverable without overlap;
- no horizontal overflow;
- all touch targets ≥44×44 or equivalent spacing;
- focus order and dialog semantics pass keyboard/screen-reader review;
- CTA start/completion funnels are measurable without firing optional analytics before consent.

### H5. Normalize the regulated local entity

**Implementation surface:**

- visible contact/footer address components
- `src/components/FairlendOfficeMap/`
- `src/utilities/structuredData.ts`
- verified external business profiles

**Work:**

1. Add **Unit 2** everywhere the official address appears, including the Google directions destination.
2. Add `PostalAddress` and verified `GeoCoordinates` to `FinancialService` JSON-LD.
3. Reconcile visible “visits by appointment” copy with structured opening/service hours.
4. Claim/verify GBP, Bing Places, and Apple Business Connect using the exact legal/operating name, phone, address, categories, and appointment rules.
5. Correct the legacy directory that still associates the current phone with Mortgage Intelligence.
6. Establish a compliant, non-gated review request and response process.

**Acceptance criteria:**

- site, FSRA, schema, directions, and owned profiles match exactly;
- Google Rich Results/Schema validator shows no address/entity error;
- stable GBP Place ID/listing URL documented internally;
- review requests are neutral, policy-compliant, and auditable.

### H6. Instrument indexation, field performance, and authority evidence

**Work:**

1. Configure Search Console domain property access and inspect all 17 canonical URLs.
2. Submit/verify sitemap status in Google and Bing.
3. Configure GA4 organic landing/conversion reporting with consent-safe event semantics.
4. Configure a PageSpeed/CrUX API key and record field LCP/INP/CLS where eligible.
5. Configure Moz or another trusted backlink source plus Bing Webmaster links.
6. Capture the first accepted SEO drift baseline after the current remediation is deployed.

**Acceptance criteria:**

- every canonical URL has a recorded indexation/canonical result;
- field and lab performance are reported separately;
- organic lead conversion can be segmented by landing page and intent;
- backlink score is withheld until enough factors are observable;
- no monitoring secret or service credential enters the repository.

## Medium — Complete Within 1–2 Months

### M1. Eliminate protocol and error-page friction

**Work:**

- Remove `Critical-CH: Sec-CH-Prefers-Color-Scheme` unless pre-render selection genuinely depends on it.
- Redirect `http://fairlend.ca/` directly to `https://www.fairlend.ca/`.
- Emit one `noindex, follow` on 404s and remove the homepage canonical.
- Verify the deployed IndexNow key and publish/update hooks by recording accepted/failed submissions; do not describe it as absent merely because it is not advertised in HTML.

**Acceptance criteria:**

- no same-URL browser restart in Chrome network/Lighthouse traces;
- one-hop redirect from every HTTP host variant;
- 404 output has one consistent robots directive and no misleading canonical;
- IndexNow operational logs distinguish accepted, duplicate, disabled, and failed states.

### M2. Build contextual internal-link architecture

**Work:**

- Add 3–5 relevant body links per ~1,000 words.
- Connect private/institutional mortgage, construction, multiplex, garden-suite, affordable-rental, investor, disclosure, and resource nodes.
- Link every resource spoke to its commercial pillar and related siblings.
- Strengthen inbound body links to `/garden-suite` and `/affordable-sustainable-rental-housing`, which currently have only one discovered source page each.

**Acceptance criteria:**

- no indexable URL has fewer than three relevant internal source pages unless intentionally narrow;
- link labels describe the destination intent;
- no navigation-only pseudo-orphans;
- crawl-depth and inbound-link snapshot stored in the drift baseline.

### M3. Publish first-party proof and methodology

**Work:**

- 3–5 anonymized funded-file case studies;
- a methodology page for funded volume, LTV bands, review, commitment timing, and data limits;
- compliance-reviewed aggregate charts/tables by property/deal type, position, LTV band, turnaround, and exit outcome;
- correction policy and editorial review cadence.

**Acceptance criteria:** claims are reproducible from retained records, reviewed for privacy/compliance, date-bounded, and explicitly qualified.

### M4. Repair image semantics and layout guarantees

**Work:**

- Fix at least six meaningful blank-alt instances: Elie headshot, property-type illustrations, private-mortgage house, and build-model parcel sketch.
- Standardize semantics when the same asset is reused.
- Keep decorative layers `alt=""`.
- Add intrinsic dimensions or guaranteed aspect-ratio containers for fill images.
- Re-export partner lifecycle assets only if viewport traces confirm oversized selection.

**Acceptance criteria:** no informative image has empty/filename alt; no decorative image is keyword-stuffed; CLS remains ≤0.1; actual selected image bytes improve.

### M5. Graduate CSP safely

**Implementation surface:** `security-headers.ts` and `/api/csp-report` telemetry.

**Work:**

1. Aggregate report-only violations by directive/source/deployment.
2. Remove unnecessary allow-list entries and `'unsafe-inline'` through nonce/hash work where feasible.
3. Canary an enforced policy and preserve required analytics, booking, map, and application flows.
4. Evaluate HSTS `includeSubDomains; preload` separately after a complete subdomain inventory.

**Acceptance criteria:** enforced CSP blocks a controlled violation, required flows work, report volume is understood, and no subdomain is stranded by HSTS.

### M6. Establish off-site entity and review authority

**Work:**

- Add only verified LinkedIn/company/principal profiles to `sameAs`.
- Create useful video/visual explainers where they materially improve mortgage decisions.
- Earn builder, housing, local-news, association, and community citations.
- Build original resources that partners can cite rather than buying generic directory links.
- Monitor name/address/phone and legacy employment citations quarterly.

**Acceptance criteria:** exact-brand searches consistently resolve to the Ontario regulated entity; owned profiles match NAP; referring domains and linked-page distribution can be measured.

## Low / Backlog

1. Tighten two long meta descriptions and optionally enrich the short terms description.
2. Test longer construction/garden-suite/multiplex titles only with CTR/rank baselines.
3. Remove duplicate semantic homepage H2s generated by responsive presentation markup.
4. Remove the empty posts child sitemap once convenient, or populate it when the first post launches.
5. Reduce intake query crawl variants if the surface grows beyond the current 37 variants.
6. Decide an explicit training-crawler and optional RSL policy with legal ownership.
7. Consider HSTS preload only after every subdomain is inventoried and permanently HTTPS-capable.

## Validation Checklist

- [ ] 17/17 canonical URLs return 200, index/follow, one H1, and self-canonical.
- [ ] Sitemap contains only canonical 200 indexable pages with accurate `lastmod`.
- [ ] Googlebot/default HTML parity remains intact.
- [ ] Three-run mobile Lighthouse median meets performance thresholds.
- [ ] GSC URL Inspection and selected canonical recorded for all money pages.
- [ ] Thin YMYL pages have review/date/source/proof and distinct intent.
- [ ] `/posts` contains published reviewed resources and `Article` schema.
- [ ] Consent does not cover the application entry at 320–390px widths.
- [ ] All primary touch targets meet 44×44 guidance.
- [ ] Unit 2, phone, name, hours, schema, directions, and profiles match.
- [ ] 404 metadata is internally consistent.
- [ ] Critical-CH restart and two-hop apex redirect are removed.
- [ ] Informative images have meaningful alt and reserved layout space.
- [ ] CSP enforcement is telemetry-backed and canaried.
- [ ] Drift baseline captures metadata, robots, canonicals, headings, schema, status, and hashes.

## Expected Score Movement

| Work completed | Expected range | Rationale |
|---|---:|---|
| H1 performance only | 82–84 | Performance rises from 56 toward 80+ |
| H1–H4 | 85–88 | Adds content depth, cluster authority, and mobile SXO |
| H1–H6 + medium tracks | 89–93 | Adds field evidence, local/entity consistency, links, proof, and regression control |

These are directional, not guaranteed ranking outcomes. Re-score from production evidence after each deployment tranche.
