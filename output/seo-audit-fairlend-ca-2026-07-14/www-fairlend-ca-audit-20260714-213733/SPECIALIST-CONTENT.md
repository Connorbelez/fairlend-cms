# FairLend content, on-page, GEO, image, and SXO audit

**Audited:** 2026-07-14  
**Primary domain:** `https://www.fairlend.ca/`  
**Evidence set:** the supplied 17-URL crawl and homepage caches; fresh server-HTML fetches and standardized parsing for all 17 unique crawled URLs; two additional internally linked topical URLs; supplied desktop/mobile screenshots; and a non-personalized web-search sample for the query **private mortgage financing Ontario**.

## Executive assessment

FairLend has unusually substantive copy on its three deepest commercial pages, clear process knowledge, good risk disclosures, a real regulated identity, and strong technical foundations for images. The biggest problem is not generic writing quality. It is that the site is a **financial-services YMYL property** but does not yet expose enough reviewer identity, evidence, dated claims, primary-source citations, or crawlable educational depth to earn the level of trust its subject matter requires.

The supplied cache classifies the business as `publisher` / `media`. Fresh evidence contradicts that classification. Fairlend Management Inc. identifies itself as an Ontario mortgage brokerage and mortgage administrator; the site displays FSRA brokerage licence **#13827** and administrator licence **#13828**, promotes borrower and investor mortgage products, and uses `FinancialService` structured data. All content and trust recommendations below therefore apply the higher YMYL standard.

### Specialist scorecard

| Area | Score | Verdict |
|---|---:|---|
| Content quality / E-E-A-T | **61/100** | Strong domain fluency and disclosure language, but thin coverage across much of the site and weak page-level authorship/evidence for financial YMYL. |
| On-page SEO | **70/100** | Unique metadata and clean canonicals are good; multiple H1s, thin 200 pages, weak semantic landmarks, and internal-link gaps materially lower the crawl-wide result. |
| AI search / GEO readiness | **56/100** | AI crawlers are allowed and core content is server-visible, but `llms.txt`, source-backed answer blocks, dates, entity disambiguation, and crawlable topical resources are missing. |
| Images | **72/100** | Modern formats and optimized delivery are strong; many empty alts are valid decoration, but several content-bearing images and the principal-broker headshot are also empty. |
| SXO gap score | **64/100** | The core borrower page matches commercial intent and answers many objections, but cost comparison, proof, mobile first-visit conversion, and decision support lag the SERP sample. This score is separate from the SEO Health Score. |

### Conflicts with baseline heuristics

| Baseline | Fresh finding | Audit treatment |
|---|---|---|
| Business type `publisher`, industry `media` | Site is a regulated mortgage brokerage/administrator and therefore financial YMYL. | Override baseline classification. |
| On-page score `93` | Broader crawl found 3 pages with two H1s, 7 descriptions over 160 characters, 7 commercial/content pages under 300 parsed words, two hub URLs with no parsed inbound links, and two additional live 200 shells with no H1. | Use **70/100**. |
| Homepage content score `65`, word count `4,657` | Standardized fresh parse returned 4,421 body words, but only 119 words sit inside the first semantic `<main>` landmark. Much of the apparent depth is outside the primary landmark and includes interface/template text. | Do not treat raw homepage word count as 4,000+ words of coherent editorial depth. |
| Homepage image issue: 12 “weak or filename-like” alts | Full crawl found 98 image elements and 77 empty alt values. Most repeated logos/clouds/background engravings are plausibly decorative; several content-bearing files are not. | Do not label all empty alts as defects; fix the meaningful subset. |
| GEO score `66`; server rendering “weak without technical-cache support” | The 17 crawled pages expose content in HTML, but two linked topical URLs expose only a 66-word shell and no H1. | Core SSR is generally good; topical-resource SSR is materially broken or unpublished. |

## Highest-priority issues

### Critical

#### C1. Two internally linked topical URLs return 200 but expose no topic content in server HTML

- `https://www.fairlend.ca/cmhc-mli-select-multiplex-financing`
  - HTTP 200, canonical present, title and description present.
  - **66 parsed words, 0 H1, 0 topical H2s**; only shared navigation/footer headings are available.
- `https://www.fairlend.ca/resources/construction-draws-small-builders`
  - HTTP 200, canonical present, title and description present.
  - **66 parsed words, 0 H1, 0 topical H2s**; only shared navigation/footer headings are available.

Both URLs are promoted in the shared footer as **“Reports & Data”** and **“Builder Draw Guide.”** They were absent from the supplied 17-URL crawl despite being internally linked. This creates three risks at once: thin indexable pages, unmet user expectations, and no extractable content for AI crawlers that do not execute client-side JavaScript.

**Fix:** publish the complete content server-side with one descriptive H1, useful body copy, reviewer/date/source blocks, and contextual internal links. If either route is a draft, remove the link and return `noindex` or 301 it to the closest complete page until publication. Do not leave a crawlable 200 shell.

### High

#### H1. Page-level E-E-A-T is below the standard required for mortgage and investment decisions

Positive trust evidence exists:

- legal identity and two FSRA licence numbers;
- direct phone and email contact;
- privacy policy, terms, and regulatory disclosures;
- plain-language risk and no-guarantee language on borrower/investor pages;
- named principal broker Elie Soberano and experience/volume claims;
- specific descriptions of underwriting, draw, payout, renewal, suitability, and recovery processes.

However, the commercial pages do not visibly attribute content to a licensed author or reviewer, do not show `datePublished`/`dateModified`, rarely cite a primary source, and do not provide case-study evidence or externally verifiable outcome proof. On a financial YMYL site, an organization-wide footer licence is not a substitute for “reviewed by a licensed professional” at the claim.

**Fix first on:**

- `https://www.fairlend.ca/borrowers/private-mortgage-financing`
- `https://www.fairlend.ca/borrowers/institutional-mortgage`
- `https://www.fairlend.ca/investing/private-mortgage-lending`
- every future resource article.

Add a visible block such as: **“Written by [name]; reviewed by Elie Soberano, Principal Broker, licence [agent/broker identifier]; last reviewed [date]”**, linked to a substantive profile page and the relevant FSRA verification record. Cite FSRA, CMHC, municipal, or statutory sources next to regulatory, program, or market assertions.

#### H2. Large parts of the commercial/content footprint are too shallow to satisfy their promised intent

Word count is not a ranking factor; the issue is missing decision coverage. The following server-visible pages are all under 500 standardized parsed words:

| URL | Parsed words | Primary gap |
|---|---:|---|
| `/posts` | **44** | Empty resource hub: it says field notes are “being prepared.” |
| `/affordable-sustainable-rental-housing` | **182** | No program criteria, evidence, examples, source links, or project decision matrix. |
| `/investing` | **188** | Thin investor hub for a high-risk topic. |
| `/garden-suite` | **198** | Describes review inputs but not eligibility, permitting sources, or a usable decision flow. |
| `/garden-suite-financing-gta` | **249** | Limited qualification/cost/draw detail. |
| `/borrowers` | **286** | Useful routing copy but little comparative decision support. |
| `/multiplex-financing-gta` | **289** | Mentions MLI Select readiness without sourced program explanation. |
| `/construction-draw-financing` | **320** | Strong DrawFlow process framing but thin financing eligibility/cost/risk context. |

By contrast, `/borrowers/private-mortgage-financing` (1,305 words), `/borrowers/institutional-mortgage` (949), `/investing/private-mortgage-lending` (1,985), and `/partners` (1,696) show that FairLend can produce substantial, specific content.

**Fix:** expand only where the page promise requires it. Add source-backed eligibility, exclusions, documents, timeline, cost drivers, examples, decision tables, and next-step links. If two pages target the same need, consolidate rather than padding both.

#### H3. The resource/topic cluster is effectively unpublished

`/posts` contains 44 parsed words and no articles. The two topical links described in C1 are empty in server HTML. Commercial pillars therefore lack supporting informational content and AI systems have little first-party material to cite.

Recommended cluster order:

1. **Private mortgage Ontario:** what it is, complete cost stack, first vs second position, exit strategies, bank-decline paths, renewals/payouts, and a worked borrower scenario.
2. **Construction draws:** reimbursement draw sequence, working-capital math, evidence checklist, common delay causes, budget contingencies, and a downloadable draw-readiness worksheet.
3. **Multiplex / garden suite / MLI Select:** feasibility inputs, municipality/permit links, CMHC program criteria with citations, affordability/accessibility/energy requirements, and project-stage checklists.
4. **Investor education:** direct mortgage vs MIC vs syndicated/fractional structures, LTV and mortgage position, liquidity, default/power-of-sale process, suitability, fees, tax-document workflow, and risk examples.

Every article should have licensed review, dates, primary citations, an Article/Person entity relationship, and contextual links into the appropriate service and consultation paths.

#### H4. Internal links and anchor promises do not consistently match destinations

Across the 17 parsed pages, `/borrowers` and `/investing` received **zero parsed inbound internal links**. They appear discoverable as interface/menu states rather than stable crawlable anchor destinations. Several shared-footer anchors also promise something different from the destination:

- “Mezzanine Capital” links to the general institutional mortgage page.
- “Rate Sheet” links to private mortgage financing, which does not expose a rate sheet.
- “Track Record” links to the investor page without a discrete, independently substantiated track-record section.
- “Reports & Data” and “Builder Draw Guide” link to the empty 200 shells in C1.

**Fix:** make the two hubs normal crawlable anchors in primary navigation/breadcrumbs, add contextual links from deep pages, and either create the specifically promised section/resource or rename the anchor to describe the actual destination. Thin topical pages currently have only one or two contextual inbound links, so cluster publication must include deliberate hub-and-spoke linking.

#### H5. Mobile first-visit consent blocks the search-to-action path

The supplied 750×1,624 mobile screenshot shows the privacy-preferences panel occupying roughly the lower half of the viewport and covering the application/consultation content. The supplied visual analysis records overlap with **Build**, **Invest**, **Mortgage**, **Start your application**, **Project address**, **Start build application**, and **Book Consultation** controls. Desktop remains usable, but mobile search visitors cannot evaluate or act on the promise without first handling a large modal.

**Fix:** use a compact, accessible consent surface with the minimum legally required text, preserve equally prominent consent choices, and avoid covering the primary CTA/input. Re-test first visit at 360×800 and 390×844. This is an SXO/conversion issue, not only a visual one.

#### H6. Entity authority is weak and the brand name is ambiguous in web search

A 2026-07-14 exact-name web-search sample for `"FairLend Mortgage" Ontario Elie Soberano`, `"fairlend.ca" mortgage`, and `"FairLend Mortgage" "13827"` did not surface fairlend.ca. Searches for “Fairlend” instead surfaced unrelated UK peer-to-peer lending and unrelated software/hackathon projects. This is not a definitive indexation test, but it is strong evidence that the entity is not yet disambiguated in general web results.

**Fix:** create a substantive About/Leadership page; make legal name, operating name, location, regulated role, principal broker, and licence identifiers consistent everywhere; add verified `sameAs` profiles; obtain accurate organization profiles and relevant third-party mentions; and connect Organization/FinancialService/Person/WebPage/Article entities with stable `@id` values. Do not attempt a promotional Wikipedia page without independent notability.

### Medium

#### M1. Three high-value pages contain two H1 elements

- `/borrowers/institutional-mortgage`: “The right mortgage is a policy match.” and “Start with the decision in front of you.”
- `/borrowers/private-mortgage-financing`: “Get a clear private mortgage answer before your deadline.” and “What would you like this mortgage to solve?”
- `/investing/private-mortgage-lending`: “Put your capital to work. Through registered mortgage investments.” and “Start with how you invest.”

The second H1 is attached to an intake/decision interface. Retain one page-level H1 and change the embedded flow title to H2 or a labelled form heading. No H2→H4/H3→H5 heading skips were detected across the 17 crawled pages.

#### M2. Seven descriptions are likely to truncate

Descriptions over 160 characters:

- `/borrowers` — 164
- `/borrowers/institutional-mortgage` — 196
- `/borrowers/private-mortgage-financing` — 168
- `/en/brokerage/privacy-policy` — 168
- `/investing/private-mortgage-lending` — 166
- `/multiplex-financing-gta` — 161
- `/partners` — 177

Shorten the first, second, third, fifth, and seventh to roughly 145–160 characters while preserving audience, financing type, geography, and decision value. Legal-policy snippets are lower priority. Eleven titles are under 50 characters, but they are unique and mostly descriptive; add words only where the current title omits a useful qualifier, not to hit a quota. No duplicate title, description, or canonical values were found in the 17-URL set.

#### M3. The homepage has weak semantic content containment

The standardized parser counted 4,421 body words, 24 H2s, and 83 H3s, while only 119 words appeared inside the first `<main>` landmark. Complex tabs, duplicated responsive/interface states, and content outside the primary landmark inflate the apparent content depth.

**Fix:** ensure the visible primary page sections are contained by one `<main>` element, avoid duplicate desktop/mobile copies in the DOM where CSS/layout can reuse one semantic source, and use headings for document structure rather than interface labels. Keep the existing single H1.

#### M4. Claims need dates, definitions, and source context to become citable

The homepage authority card shows **$1B+ volume by principal broker**, **24 hrs commitment target**, and **28+ years experience**; `/partners` states **nearly three decades** and **more than $2B funded**. These are compelling first-party facts, but the page does not expose methodology, scope, or an “as of” date. “$1B+” and “more than $2B” are not logically contradictory, but inconsistent specificity makes the claim harder to quote or verify.

**Fix:** define whether volume is career funded volume, team volume, arranged volume, or another measure; provide the applicable time period; use one current figure site-wide; retain the commitment-timing qualification; and add evidence or a short methodology note.

#### M5. No `llms.txt`, no extractable data tables, and weak answer-block formatting

The GEO cache confirms:

- major search-oriented AI crawlers allowed: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot/Claude Search/User, and PerplexityBot;
- `/llms.txt` returns 404;
- 2 candidate passages, **0** optimal 134–167-word self-contained blocks;
- **0** answer-first blocks and **0** data-rich blocks;
- 0 HTML tables on the homepage.

The deep borrower pages have useful FAQs and comparison concepts, but important answers are distributed across cards/divs rather than self-contained, sourced passages or semantic tables.

**Fix:** first publish authoritative content; then add a concise `llms.txt` linking to the best borrower, investor, construction, regulatory, and leadership pages. Create answer-first definitions and semantic tables for institutional vs private, first vs second, cost components, draw steps, and investment structures. Do not add unsupported numbers merely to satisfy a format.

## Content quality and E-E-A-T

### E-E-A-T breakdown: 62/100

| Factor | Score | Evidence |
|---|---:|---|
| Experience | **13/20** | Specific process descriptions, DrawFlow evidence workflow, local Southern Ontario context, original office/team imagery, and concrete borrower/investor scenarios. Few documented outcomes or real case studies. |
| Expertise | **16/25** | Named principal broker, experience claims, FSRA-regulated roles, and technically accurate mortgage vocabulary. No page-level reviewer attribution, update dates, or formal source notes. |
| Authoritativeness | **11/25** | Regulator licence links and substantial commercial copy. Little independent recognition, citation, quoted expertise, original research, or visible editorial publication history. |
| Trustworthiness | **22/30** | Strong privacy/terms/disclosure pages, direct contact, licensing, suitability/no-guarantee/risk language. Credentials and claim provenance are too far from several decision points. |

### Strengths worth preserving

- `/borrowers/private-mortgage-financing` directly addresses renewal pressure, hard closings, debt consolidation, equity access, bridges, second mortgages, bank declines, fees, payout terms, maturity, and exit strategy.
- `/borrowers/institutional-mortgage` explains policy fit, debt service, property fit, documentation, prepayment, fees, timing, and private-bridge escalation.
- `/investing/private-mortgage-lending` repeatedly states that investments are not deposits, are not guaranteed, may be illiquid, and can lose principal; this is appropriate YMYL risk framing.
- `/partners` demonstrates real operating knowledge across acquisition, zoning, scope, capital stack, draws, working capital, and exit planning.
- Privacy, terms, disclosures, and contact pages are accessible and substantive.
- Five-word shingle comparison of page-specific `<main>` text found no material near-duplicate pairs among the 17 crawled pages.

### Content weaknesses

- No author/reviewer/date system for money-related pages.
- No visible case studies with inputs, constraints, structure, outcome, and compliance-safe caveats.
- Primary source links are largely limited to licence verification; CMHC/FSRA/municipal guidance is not cited inside relevant explanatory content.
- Many sections state a principle but stop before a worked example, decision rule, range, checklist, or document list.
- `/posts` promises reviewed guidance but publishes none.
- Some copy is sharp but dense: the cache found 57 long homepage sentences; deep pages also repeat card text in list/paragraph representations, reducing scan efficiency.

## On-page findings

### Metadata and document structure

- 17/17 crawled URLs returned 200 and had a title, meta description, and canonical.
- 17/17 canonical values matched the intended URL form; no duplicate canonicals were found.
- 0 duplicate titles and 0 duplicate descriptions in the crawl.
- 3/17 pages had two H1 elements; all other crawled pages had exactly one.
- No heading-level skips were detected.
- 7/17 descriptions exceed 160 characters; 1 (`/terms`, 94 characters) is notably short but low priority.
- Titles are generally clear; the weakest is `/construction-draw-financing`, titled **“Construction Draw Financing | DrawFlow”**, which underplays FairLend and reads partly as a software product rather than financing guidance.

### Internal linking

- Shared navigation/footer links produce high raw internal-link counts, but contextual links are sparse.
- `/borrowers` and `/investing` had zero parsed inbound anchors from the 17-page HTML set.
- `/affordable-sustainable-rental-housing` and `/garden-suite` had only one parsed contextual inbound link each.
- The deepest investor page and `/partners` contained no crawlable links within their `<main>` content, despite mentioning related routes and concepts.
- Promised footer-resource anchors currently lead to empty shells or broader pages, undermining anchor relevance and trust.

## Image audit

### Crawl-wide evidence

| Metric | Result | Interpretation |
|---|---:|---|
| Image elements | **98** | 60 occur on the homepage; other pages are comparatively light. |
| Missing `alt` attribute | **0** | Good baseline implementation. |
| Empty `alt=""` | **77** | Mixed: many are valid decoration, but several content-bearing images are suppressed from accessibility/image context. |
| Explicit width + height absent | **32** | Many use Next.js fill/layout behavior; verify CSS `aspect-ratio` before treating all as CLS defects. Lighthouse baseline CLS of 0.310 increases the importance of verification. |
| No `loading` attribute | **15** | Includes legitimate eager hero/LCP images; baseline sampling found one below-fold image not lazy-loaded. |
| Modern source format | **98/98** | Sources use WebP or SVG and Next.js optimization. |
| Oversized sampled image | **0** | Baseline sampled homepage assets were below the configured warning thresholds. |

### Alt-text treatment

Keep `alt=""` on truly decorative clouds, textures, topographic backgrounds, and repeated ornaments. The linked logo may remain empty because the link itself has the accessible name “FairLend.”

Review and add concise alts to content-bearing examples such as:

- `elie-headshot.webp` — identifies the principal broker and supports E-E-A-T;
- `build-model-parcel-sketch.webp` and `mobile-hero-property-path.webp` — appear to explain the project/property path;
- `fairlend-toronto-skyline-hero-21x9.webp` on institutional/private pages if it contributes location/context rather than decoration;
- property-type/route illustrations used as linked choices (`multiplex-building-engraving.webp`, `single-family-house-engraving.webp`, `land-parcel-plan-engraving.webp`, `private-mortgage-house-engraving.webp`, `investor-skyline-engraving.webp`);
- meaningful contact/team/construction visuals when they convey office, team, process, or location information.

Avoid stuffing service keywords into every engraving. If adjacent text already fully names a linked choice and the image adds no information, empty alt remains correct.

## GEO / AI-search readiness

### Scoring detail

| Dimension | Score | Evidence |
|---|---:|---|
| Passage citability | **10/25** | Useful statements exist, but the cache found no optimal self-contained answer block, no answer-first block, and no data-rich passage. Claims lack inline source/date context. |
| Structural readability | **14/20** | Strong H2/H3 use and FAQs on deep pages; no heading skips. Multiple H1s, content outside `<main>`, and zero semantic comparison tables reduce extractability. |
| Multi-modal content | **9/15** | Original illustrations and a product/process concept are present; little video, charting, calculator output, downloadable data, or sourced visual explanation. |
| Authority / brand | **9/20** | Licensing and named expertise are real; independent brand/entity signals and author entities are weak, and the name is ambiguous in web search. |
| Technical accessibility | **14/20** | Major AI crawlers allowed and core pages have HTML content; `llms.txt` is absent and two linked topical URLs expose shell-only HTML. |

### Highest-impact GEO actions

1. Fix or remove the two shell-only resource URLs.
2. Add licensed reviewer identity, dates, and primary-source citations to money pages.
3. Publish a real resource cluster with first-party examples/checklists/data.
4. Turn key answers into self-contained, source-backed passages and semantic tables.
5. Build a disambiguated organization/principal-broker entity footprint, then publish a substantive `llms.txt` that points only to complete authoritative pages.

## SXO analysis: private mortgage financing Ontario

**Target page:** `https://www.fairlend.ca/borrowers/private-mortgage-financing`  
**Target page type:** service/hybrid page with an embedded intake flow  
**SERP consensus:** service, lender, brokerage, landing, or hybrid commercial pages dominated **at least 8 of the first 10 sampled results**; one result emphasized an interactive calculator/pre-approval flow. FairLend’s page type is therefore **aligned**, not a strategic page-type mismatch.

### SERP sample reviewed

1. `stonefieldcapital.ca/` — lender/service landing page; same-day commitment, rates, portfolio proof.
2. `bestratesgta.ca/` — broker/service page; 24-hour approval, licensing, named broker, lender count.
3. `lendsimpl.ca/private-mortgage` — service/hybrid; definition, rate ranges, 48-hour framing, licence.
4. `360lending.ca/products/private-mortgage` — tool/hybrid; estimated amount/payment and pre-approval flow.
5. `dvcapitalcorp.com/` — service landing page; named positioning, testimonials, experience.
6. `stonefieldcapital.ca/borrowers` — borrower service page; LTV criteria and broker/lender role clarity.
7. `mortgageontario.ca/private-mortgages` — broker service/informational hybrid; named licensed professional and concise definition.
8. `thebroker.ca/private-mortgages/` — service/informational page.
9. `privatemortgagelending.ca/` — named-broker service page with experience and eligibility framing.
10. `hopewellmortgages.ca/` — mortgage brokerage hybrid page with multiple routes and CTAs.

The sampled results repeatedly surface **speed, starting/range rates, estimated payment, LTV/equity, licence, years/volume, reviews, and a direct CTA** near the top. FairLend is stronger than many in risk/exit-plan explanation but weaker in quickly answering cost and providing externally verifiable proof.

### SXO dimension score: 64/100

| Dimension | Score | Evidence |
|---|---:|---|
| Page type | **14/15** | Service/hybrid type matches the dominant result set. |
| Content depth | **14/15** | 1,305 parsed words with costs, timing, exits, use cases, and FAQs. |
| UX signals | **10/15** | Strong deadline framing and intake path; long page, duplicate H1, and first-visit mobile consent interfere. |
| Schema expectation | **7/15** | Organization/WebSite entities exist, but parsed page-level Service/WebPage/Breadcrumb/author relationships are weak or absent. |
| Media richness | **6/15** | Illustrations and intake UI, but no usable cost calculator, semantic comparison table, video, or worked visual example. |
| Authority signals | **9/15** | Regulated identity and process language; page-level reviewer, reviews/cases, and source proof are limited. |
| Freshness | **4/10** | No visible publish/update/review date. |

### Evidence-derived user stories

1. **Urgent borrower:** As a borrower with a hard closing or renewal deadline, I want to know whether a private mortgage can close in time, because delay is expensive, but I am blocked by uncertainty about documents and commitment timing.  
   *Signals: same-day/24-hour/48-hour language across Stonefield, Trillium, and lendsimpl; FairLend’s own deadline-focused H1.*
2. **Cost-conscious comparer:** As a borrower comparing private options, I want a realistic cost/payment range before sharing sensitive information, because private money is expensive, but I am blocked by pages that discuss “cost” without a worked scenario.  
   *Signals: starting/range rates in Stonefield/lendsimpl and the estimated-payment tool in 360Lending.*
3. **Risk-averse borrower:** As a borrower considering a non-bank lender, I want to verify licensing, fees, payout conditions, and the exit plan, because I fear an unsuitable or predatory structure, but I am blocked when proof is separated from the decision content.  
   *Signals: FSRA result in the broader query set, competitor licence callouts, and FairLend’s fee/exit FAQs.*
4. **Bank-declined borrower:** As a self-employed or credit-challenged homeowner, I want to know whether equity and property fit can overcome a bank decline, because I need a credible next route, but I am blocked by unclear qualification criteria.  
   *Signals: bank-decline/self-employed/equity framing across lendsimpl, Stonefield, and FairLend.*

### Persona scores for the target page

| Persona | Relevance | Clarity | Trust | Action | Total |
|---|---:|---:|---:|---:|---:|
| Urgent borrower | 23/25 | 20/25 | 17/25 | 22/25 | **82/100** |
| Bank-declined borrower | 22/25 | 18/25 | 18/25 | 21/25 | **79/100** |
| Risk-averse borrower | 22/25 | 17/25 | 15/25 | 18/25 | **72/100** |
| Cost-conscious comparer | 20/25 | 12/25 | 14/25 | 17/25 | **63/100** |

**Weakest persona:** the cost-conscious comparer. Add a compliance-reviewed, clearly qualified scenario table showing principal, mortgage position, term, illustrative interest, lender/broker/legal/appraisal costs, payment treatment, payout assumptions, and total dollars—without presenting it as a quote or guarantee. Follow it with the existing free-review CTA.

## Quick wins

1. Publish or de-index/redirect the two 66-word no-H1 resource shells.
2. Change the three intake-flow H1s to H2/form headings.
3. Add a visible reviewed-by/licence/date block to the three deep mortgage pages.
4. Rename or fix the misleading shared-footer anchors (“Rate Sheet,” “Track Record,” “Reports & Data,” “Builder Draw Guide”).
5. Add crawlable primary-nav/breadcrumb links to `/borrowers` and `/investing`.
6. Shorten the five high-value commercial descriptions over 160 characters.
7. Add meaningful alt text to the principal-broker headshot and content-bearing route/process images; leave true decoration empty.
8. Compress the mobile consent panel so it no longer covers the application/consultation path.
9. Standardize experience/funded-volume claims with scope, date, and methodology.
10. Convert the private-vs-institutional and financing-cost explanations into semantic, sourced tables/answer blocks.

## Limitations

- No Google Search Console, GA4, CrUX field data, Bing Webmaster Tools, DataForSEO, or rank-tracking dataset was available; indexation, clicks, impressions, and rankings were not verified.
- The SERP sample was a general web-search result set, not a controlled Toronto device/location capture. PAA, ads, local pack, AI Overview, and exact organic positions were unavailable; SXO conclusions are directional.
- Image byte size/content type was available only for the baseline homepage sample. Next.js `fill` images may prevent explicit HTML dimensions while still reserving space through CSS; each of the 32 dimensionless images requires rendered-layout verification before remediation.
- Empty alt values were classified conservatively. Decorative treatment depends on the visual/interactive role, not the filename alone.
- The two additional topical URLs may render more content after client-side JavaScript. That does not remove the GEO issue: the fetched server HTML supplied to non-JavaScript AI crawlers contains no topic content.
- The audit did not validate mortgage claims for legal/regulatory compliance; recommendations involving rates, fees, returns, MLI Select, suitability, case studies, or outcome claims require licensed/compliance review.

