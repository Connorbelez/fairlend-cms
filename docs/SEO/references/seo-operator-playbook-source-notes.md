# Primary-source notes for a zero-to-advanced organic/local SEO operator playbook

Research date: 2026-07-13

Scope: rules, platform constraints, measurement gates, and decision logic for operating **NotFair + OpenSEO + DataForSEO + Google Search Console + GA4 + Google Business Profile + Google Ads Keyword Planner + Playwright**. Sources are limited to official Google documentation and upstream project repositories. These are research notes for the final playbook, not the playbook itself.

## How to read these notes

- **Policy / platform fact** means the linked owner of the platform says it.
- **Operator rule** is a conservative implementation decision derived from those facts. It is not represented as a Google ranking rule.
- Google explicitly says there are no secrets that automatically rank a site first, and meeting eligibility requirements does not guarantee indexing or ranking ([Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide); [technical requirements](https://developers.google.com/search/docs/essentials/technical)). The final guide should define success as a repeatable evidence-and-improvement loop, not a ranking guarantee.

## 1. Non-negotiable operating model

The stack should separate five responsibilities:

1. **Market evidence:** DataForSEO and, when available, Google Ads Keyword Planner.
2. **Owned search truth:** Search Console for actual query/page visibility and index state.
3. **Business outcomes:** GA4 for lead and revenue events.
4. **Reasoning and production:** OpenSEO holds live SEO state and NotFair supplies research, briefing, writing, audit, and QA workflows.
5. **Mutation:** typed first-party APIs first; browser automation only as a supervised fallback.

OpenSEO's upstream repository describes keyword research, rank tracking, domain insights, backlinks, site audits, an MCP server, and agent skills backed by DataForSEO. Its Docker mode is single-user and unauthenticated by default, and the project explicitly warns not to expose that default deployment to the internet ([OpenSEO README](https://github.com/every-app/open-seo#readme)). NotFair's upstream repository supplies the method layer—SEO analysis, keyword research, content writing, metadata, schema, and CMS-oriented skills—rather than authoritative live demand or rank data ([NotFair/toprank repository](https://github.com/nowork-studio/toprank#readme)).

**Operator rules:**

- Pin an audited OpenSEO commit; do not deploy `latest` blindly into a recurring production workflow.
- Keep the local Docker instance loopback-only unless authentication, TLS, backups, and secret management have been deliberately added.
- Give each connector the least privileges it needs. Separate read-only research credentials from mutating CMS/GBP credentials.
- Every generated artifact starts as a draft. A human owns factual, brand, legal/regulatory, and final-publish approval.
- Record the evidence behind every page: target intent, target location, source metrics, SERP snapshot date, unique business proof, reviewer, publish decision, and later outcome.

## 2. Google Search eligibility and the launch gate

Google's minimum technical requirements are deliberately small: Googlebot must not be blocked, the URL must return HTTP `200`, and the page must have indexable content. Eligibility still does not guarantee indexing ([Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)).

### Required launch gate for each indexable template

The final playbook should make the operator prove all of the following before publishing a page:

- The canonical production URL returns `200`, not a soft 404, redirect chain, login wall, or error document.
- Googlebot is not blocked by `robots.txt`; the page has no accidental `noindex`; required images and rendered content are crawlable.
- The page contains meaningful text in the initial/rendered HTML. Google renders JavaScript, but rendering is an additional stage and content that depends on it can be harder to diagnose ([how Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)).
- The page has a self-referencing absolute canonical unless it is intentionally a duplicate whose canonical points to the preferred URL.
- The preferred URL is the one linked internally and listed in the sitemap. Google treats redirects and `rel="canonical"` as strong canonical signals and sitemap inclusion as a weaker signal; conflicting signals should be eliminated ([canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).
- At least one crawlable `<a href>` internal link points to every page that matters. Anchor text is descriptive, concise, contextual, and natural—not stuffed. Google explicitly recommends that every important page receive a link from at least one other site page ([link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)).
- The `<title>` is unique, concise, descriptive, and aligned with the visible main heading. Google may create a different title link from the title, headings, visible text, and anchors; repeated boilerplate and keyword stuffing are specifically discouraged ([title-link guidance](https://developers.google.com/search/docs/appearance/title-link)).
- The meta description is a unique, accurate pitch for that page. It is an input, not a command: Google primarily builds snippets from page content and may use the description when it is more useful ([snippet guidance](https://developers.google.com/search/docs/appearance/snippet)).
- Structured data describes visible page content, is complete and truthful, and passes the applicable validator. Google recommends JSON-LD, does not guarantee rich-result display, and can apply a structured-data manual action for misleading markup ([general structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)).
- Mobile layout, forms, phone links, navigation, and primary CTA work without console/runtime errors.
- Lab performance is regression-tested and field data is later monitored. Google's current “good” Core Web Vitals targets are LCP at or below 2.5 s, INP below/at 200 ms, and CLS at/below 0.1, evaluated at the 75th percentile in field data ([Search Central Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals); [Web Vitals thresholds](https://web.dev/articles/vitals)).

### Sitemap rules

- Generate the sitemap from the production CMS state, not a hand-maintained list.
- Include only absolute, canonical URLs intended for Search. Exclude drafts, preview routes, `noindex` pages, redirects, parameter variants, and error URLs.
- Host the sitemap at the site root. A single sitemap is limited to 50 MB uncompressed or 50,000 URLs; larger sites require multiple sitemaps and optionally a sitemap index.
- Submission is only a hint, not an indexing guarantee. Keep discovery working through internal links too ([build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).

### Structured-data baseline

- Home page: `WebSite` with a consistent real brand `name`, canonical `url`, and optional `alternateName`; Google supports one site name per domain/subdomain and wants this markup on the home page ([site-name guidance](https://developers.google.com/search/docs/appearance/site-names)).
- Organization home/about/contact surface: applicable `Organization` properties that match the business's public facts ([Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization)).
- Physical local location page: the most specific applicable `LocalBusiness` subtype and required/recommended properties that genuinely exist. Google requires `name` and a physical `address` for LocalBusiness rich-result eligibility and says to define each business location separately ([LocalBusiness markup](https://developers.google.com/search/docs/appearance/structured-data/local-business)).
- Hierarchical pages: visible breadcrumbs plus `BreadcrumbList`; the breadcrumb should reflect a useful user path, not blindly mirror the URL ([breadcrumb markup](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)).
- Never manufacture aggregate ratings for the business itself. Pages controlled by a local business/organization are ineligible for self-serving review-star markup, including ratings embedded from Google or Facebook; marked-up reviews must be visible and genuinely sourced ([review-snippet rules](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)).

## 3. Content safety: the AI system must not become a doorway-page factory

Google's spam policy defines:

- **Doorway abuse:** pages/sites created to rank for similar queries that funnel users to an intermediate or common destination; examples include substantially similar city/region pages.
- **Scaled content abuse:** many pages produced primarily to manipulate rankings rather than help users, regardless of whether they were made by generative AI, humans, scraping, or transformations.
- **Keyword stuffing:** unnatural repetition, including blocks of cities/regions.
- **Link spam:** buying/selling links for ranking credit, excessive exchanges, automated link creation, low-quality directories, optimized comment links, or paid links without `nofollow`/`sponsored` qualification.
- **Machine-generated traffic:** automated queries to Google Search, including scraping for rank checking, without express permission.

All are documented in [Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies). Violations can cause lower ranking, exclusion, or manual action.

### Operator publish decision tree for any generated page

```text
Does this page answer a real user task within the business's actual scope?
├─ No -> reject the page.
└─ Yes
   Does it add first-party value that a generic model or competitor rewrite lacks?
   ├─ No -> keep as draft; collect proof or consolidate into an existing page.
   └─ Yes
      Is its search intent materially different from an existing page?
      ├─ No -> improve/merge the existing page; redirect obsolete duplicates if needed.
      └─ Yes
         Can every factual, commercial, legal, and local claim be sourced and reviewed?
         ├─ No -> do not publish.
         └─ Yes
            Does it pass technical, content, conversion, and editorial QA?
            ├─ No -> revise.
            └─ Yes -> publish in a small measured batch.
```

### Required first-party value inventory

Before the AI writes, collect reusable business evidence:

- exact services/products, exclusions, eligibility, service process, timelines, pricing model/ranges where legally and commercially permitted;
- staff expertise, licenses/accreditations, real biographies, and reviewer credentials;
- original photos, videos, diagrams, calculators, checklists, examples, and process artifacts;
- anonymized case studies with permission, actual outcomes, caveats, and methodology;
- real customer questions from sales/support and approved answers;
- policies, guarantees, terms, complaint/escalation paths, and contact details;
- location-specific logistics, regulations, service constraints, staff, proof of work, and community relevance.

Google's people-first guidance asks whether content provides original information/analysis, is substantial and complete, demonstrates first-hand expertise, has a clear author/reviewer, has a primary audience and purpose, and leaves the reader able to accomplish their goal. It warns against extensive automation across many topics, superficial summaries, arbitrary word counts, fake freshness, and producing content mainly for search visits ([creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).

Google recommends evaluating **Who, How, and Why**: show accurate authorship; explain methodology and the useful role of automation when readers would reasonably expect it; and ensure the purpose is helping people. AI disclosure is context-dependent, but automation used primarily to manipulate ranking violates spam policy ([Who/How/Why guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).

For health, financial-stability, safety, and other YMYL topics, Google's systems give greater weight to signals aligned with strong experience, expertise, authoritativeness, and trust. The final playbook should therefore require a credentialed subject-matter reviewer, named author/reviewer information, primary-source citations, approval records, and conservative claims for every YMYL money page ([YMYL note in Google's people-first guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).

## 4. Page architecture and keyword-to-page decisions

### Evidence order

1. Enumerate real services, customer jobs-to-be-done, buying objections, locations, and qualification criteria.
2. Use DataForSEO Labs/OpenSEO to expand seeds and attach search volume, CPC, competition, intent, trends, SERP competitors, and ranked domains.
3. Inspect fresh organic and local SERPs for the exact country/language/device/location. The result types reveal the likely intent: local pack, service pages, tools, product/category pages, guides, comparisons, or mixed intent.
4. If available, use Google Ads Keyword Planner with keyword + URL seeds and explicit language/location/network targeting. The official API can return ideas and historical metrics; Keyword Planning calls are rate-limited and Google recommends caching because historical metrics refresh monthly ([Keyword Ideas API](https://developers.google.com/google-ads/api/docs/keyword-planning/generate-keyword-ideas); [Keyword Planning overview](https://developers.google.com/google-ads/api/docs/keyword-planning/overview)).
5. After launch, let Search Console actual query/page evidence override pre-launch estimates.

Keyword Planner's UI requires completed billing setup for basic access. Forecasts are estimates affected by bids, budget, seasonality, historical ad quality, location, and account context; they are not organic-ranking predictions ([use Keyword Planner](https://support.google.com/google-ads/answer/7337243); [forecast limitations](https://support.google.com/google-ads/answer/3022575)). CPC and bid ranges are useful commercial-intent evidence, not proof that an organic landing page will rank or convert.

### One page or two?

```text
Do two keyword groups represent the same user task and show substantially the same result type/competitors?
├─ Yes -> one page; cover natural variants and subtopics without repetition.
└─ No
   Does each group require a different promise, page type, proof set, or conversion path?
   ├─ Yes -> separate pages with distinct content and internal-link roles.
   └─ Unclear -> keep one page, measure Search Console query-to-page data, split only on evidence.
```

“Substantial SERP overlap” should be implemented as an operator-configurable heuristic, not a Google rule. The important invariant is avoiding multiple pages that compete for the same task and contain only keyword/location substitutions.

### Local service-page decision tree

```text
Does the business actually serve this location under the advertised conditions?
├─ No -> do not create a page or claim a profile.
└─ Yes
   Is there location-specific demand or a real customer-navigation need?
   ├─ No -> cover the area on the broader service-area/location hub.
   └─ Yes
      Can the page provide unique local utility and first-party proof?
      ├─ No -> keep it in the hub; a city-name substitution page risks doorway abuse.
      └─ Yes
         Does the SERP show a distinct intent/page type from the existing hub?
         ├─ No -> strengthen the hub and its location section.
         └─ Yes -> draft a distinct service-location page and pass the full publish gate.
```

Minimum acceptable unique local utility should include several of: actual jobs/case evidence in or near the area; local staff or branch information; service logistics and availability; relevant municipal/provincial/state rules; location-specific pricing/eligibility variables; original local media; useful neighborhood/service-boundary detail; and FAQs sourced from real customers. A token swapped city name is not enough.

## 5. Google Business Profile: eligibility, truth, and consent

### Eligibility decision tree

Google says a business generally qualifies only if it makes in-person contact with customers during stated hours. Online-only brands, lead-generation companies, and various other categories are ineligible ([GBP eligibility and ownership](https://support.google.com/business/answer/13763036)).

```text
Does the business make in-person customer contact during stated hours?
├─ No -> no GBP. Build organic brand/entity presence without inventing a location.
└─ Yes
   Does it receive customers at a staffed location with permanent signage?
   ├─ Yes -> storefront or hybrid profile; show the accurate address.
   └─ No -> service-area profile; hide the address and define accurate served areas.
```

For a service-area business, Google says to use one profile for the central office/location, hide a residential/non-customer-facing address, avoid virtual offices unless genuinely staffed, use up to 20 specific service areas, and generally keep the overall boundary within about two hours' drive. Separate profiles are allowed for real, separately staffed locations with distinct service areas ([representation guidelines](https://support.google.com/business/answer/3038177); [service-area management](https://support.google.com/business/answer/9157481)).

### Profile truth rules

- Use the real-world business name exactly as used on signage, website, stationery, and by customers. Do not add keywords or location modifiers unless they are part of the real name.
- Choose the fewest categories that accurately describe the core business.
- Keep address/service area, hours, phone, website, services/products, and photos complete and current.
- Use one profile per business/eligible location; do not create duplicate or fake city profiles.
- The website and phone must authoritatively represent the individual business/location.

These rules come from Google's [guidelines for representing a business](https://support.google.com/business/answer/3038177). Local ranking is mainly based on relevance, distance, and prominence/popularity; complete information can improve relevance, while links and genuine reviews contribute to prominence. Google says there is no way to request or pay it for better local ranking ([local ranking guidance](https://support.google.com/business/answer/7091)).

### Review rules

- Ask real customers for honest reviews with Google's link/QR flow.
- Never offer a free/discounted product, money, contest entry, or other incentive to post, change, or remove a review.
- Do not review-gate by asking only satisfied customers.
- Respond conversationally and protect private information. Never feed customer-sensitive facts to an LLM merely to personalize a reply.

Google says reviews must reflect genuine experiences, prohibits selectively soliciting only positive reviews, and strictly prohibits incentives; policy violations can lead to removed/unpublished reviews, temporary inability to receive reviews, and profile warnings ([Maps fake-engagement and rating-manipulation policy](https://support.google.com/contributionpolicy/answer/7400114); [review guidance](https://support.google.com/business/answer/3474122); [review restrictions](https://support.google.com/business/answer/14114287)).

### Consent and automation rules

For a business operating its own profile, the approved Business Profile API may be used programmatically. For third-party/agency operation:

- The owner must provide express consent before the profile is claimed or managed; verbal consent is insufficient when there is a conflict, and written/digital proof must be available.
- Review replies and Q&A actions require authorization.
- An API tool must notify the end client of changes, preserve owner control, and allow disconnection/permission removal.
- The GBP API policy prohibits automating review replies, Q&A, listing creation, or edits without the user's **prior specific and express consent**.
- A tool provider cannot let clients indirectly automate through the provider's project to evade their own GBP project approval.
- Google-provided GBP API content may generally be cached only in limited amounts, securely, temporarily, and no more than 30 days.

See [GBP third-party policies](https://support.google.com/business/answer/7353941) and [Business Profile API policies](https://developers.google.com/my-business/content/policies).

The API requires project approval, enabled APIs, OAuth 2.0 for protected data, and has no sandbox; where supported, `validateOnly` should be used before mutation ([GBP API basic setup](https://developers.google.com/my-business/content/basic-setup)).

**Operator mutation decision:**

```text
Is there an official API endpoint for the action?
├─ Yes -> use it with least privilege, idempotency, validation, audit log, and approval.
└─ No
   Is the action read-only or safely reversible, and permitted by the platform?
   ├─ No -> manual owner action.
   └─ Yes -> supervised browser session; show exact proposed change before submit.

For any GBP write:
Do we have prior, action-specific, recorded owner approval?
├─ No -> draft only; do not execute.
└─ Yes -> execute once, capture before/after state, and notify the owner.
```

## 6. Search Console, indexing, and diagnostic decisions

### Initial setup

- Create a Search Console **Domain property** and verify it with DNS so all protocols and subdomains are included. Keep the DNS verification record in place ([add a Search Console property](https://support.google.com/webmasters/answer/34592); [verify ownership](https://support.google.com/webmasters/answer/9008080)).
- Submit the production sitemap after the launch gate passes.
- Use URL Inspection on the home page, each canonical template type, and the first pages in a new batch. URL Inspection shows Google's indexed state and can run a live test, but “URL is on Google” still does not guarantee that it is visibly ranking ([URL Inspection](https://support.google.com/webmasters/answer/9012289)).
- Do not request indexing for every routine edit. Use it for the initial critical sample or after correcting a specific indexing issue; discovery at scale belongs to sitemaps and internal links.

### Indexing decision tree

```text
Is the canonical URL known to Google?
├─ No -> verify sitemap inclusion, internal links, production URL, and robots access.
└─ Yes
   Is live URL inspection indexable and returning the intended rendered content?
   ├─ No -> fix HTTP/robots/noindex/rendering/canonical/security issue, retest, then request indexing.
   └─ Yes
      Did Google select a different canonical?
      ├─ Yes -> remove duplicate/conflicting signals; align redirects, rel=canonical, links, and sitemap.
      └─ No
         Is it crawled/discovered but not indexed?
         ├─ Yes -> evaluate duplication, soft-404 signals, thin/templated value, and site navigation.
         └─ No -> allow normal crawl/index processing; do not treat a sitemap as an indexing command.
```

Google says not-indexed is not inherently bad—duplicates, intentional `noindex`, blocked pages, and parameter variations may correctly remain excluded. It also says the home page should be indexed and comprehensive site navigation should let Google reach important pages ([Page Indexing report](https://support.google.com/webmasters/answer/7440203)).

## 7. Measurement: what must exist before content scale

### GA4 setup gate

- Create the GA4 property and production web data stream, install the Google tag or GTM container on every public template, and confirm collection in Realtime. Google says data can take up to 30 minutes to begin ([GA4 website setup](https://support.google.com/analytics/answer/14183469)).
- Implement Google's recommended `generate_lead` event at the actual success condition, not merely button click. Include stable event parameters such as form/CTA/service/location identifiers and monetary `value` plus `currency` when defensible ([GA4 recommended events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)).
- Mark true business outcomes as key events; separate micro-events (phone/email click, form start) from completed lead events so the operator cannot “optimize” vanity interactions.
- Verify once in browser/tag debugging and once in GA4 Realtime/DebugView. Test deduplication and confirmation-page reload behavior.
- Never send PII or sensitive financial/health information to GA4 ([Google Analytics privacy guidance](https://support.google.com/analytics/answer/9019185); [HIPAA/PII warning](https://support.google.com/analytics/answer/13297105)).
- Implement a lawful consent solution for the actual jurisdictions and company policy. Google's consent-mode documentation says the site is responsible for obtaining the choice, communicating it, and making tags honor it; default consent must be set before updates and consent mode v2 adds `ad_user_data` and `ad_personalization` ([consent-mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode); [website setup](https://developers.google.com/tag-platform/security/guides/consent)). This is not legal advice; the final guide should require legal/privacy review.

### Search Console data rules

- The Search Analytics API supports clicks, impressions, CTR, and average position by dimensions such as date, query, page, country, and device. Detailed query/page reports can omit some data; aggregate totals and dimensioned rows are not interchangeable ([Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query); [all performance data](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data)).
- Finalized data is typically available after two to three days. A daily extraction should paginate in 25,000-row pages; the API exposes at most 50,000 rows per day per search type, sorted by clicks ([getting performance data](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data)).
- Focus on trends in impressions and clicks more than average position. Position is the average topmost position and varies by location, device, history, result feature, and aggregation; it is not a universal live rank ([metric definitions](https://support.google.com/webmasters/answer/7042828); [performance-report use cases](https://support.google.com/webmasters/answer/17010961)).

### Recommended operator gates (explicitly heuristics, not Google rules)

| Gate | Evidence required | Decision |
|---|---|---|
| Instrumentation | GA4 Realtime works; `generate_lead` fires once with correct parameters; Search Console Domain property verified | Do not publish a content batch until this passes. |
| Technical launch | Every representative template passes the launch gate; sitemap contains only canonical production URLs | Fix platform defects before creating more pages. |
| Batch publish | 3–10 highest-value pages, each with unique first-party proof and human approval | Publish small enough that every page can be inspected and failures diagnosed. |
| Discovery/indexing | Google knows the sitemap and selected URLs; a representative sample renders/indexes correctly | If systemic failures exist, stop the pipeline; do not compensate by publishing more. |
| Demand match | A page accumulates impressions for intended or adjacent queries | Improve title/snippet/coverage and internal links; split only when query/intent evidence supports it. |
| Commercial outcome | Organic landing page sessions produce qualified key events/leads and downstream value | Scale clusters that create business value, not merely traffic. |
| Prune/consolidate | Repeated adequate observation windows show no unique demand, links, conversions, or business utility, or pages cannibalize the same task | Merge, redirect, rework, or intentionally noindex; do not delete solely to make the site look “fresh.” |

A practical comparison window is rolling 28 days versus the prior 28 days, segmented by page cluster, query intent, device, country/region, and branded/non-branded. That is an operator heuristic chosen to reduce daily noise, not a Google-prescribed period. Annotate deployments, GBP changes, promotions, outages, and major algorithm events so correlations are not misread.

## 8. Weekly and monthly closed-loop routines

### Weekly operator loop

1. Export finalized Search Console rows for query × page × country × device; preserve raw daily snapshots.
2. Join GA4 organic landing pages and `generate_lead`/qualified-lead/revenue outcomes.
3. Run OpenSEO/DataForSEO rank checks only for a bounded decision set; do not scrape Google Search directly.
4. Triage in this order: availability/indexing -> wrong canonical -> page/query mismatch -> declining impressions -> weak CTR with stable impressions -> traffic without conversion -> content opportunities.
5. Update existing pages before manufacturing near-duplicates.
6. Run a site audit and regression tests on representative templates, sitemap, canonicals, schema, internal links, forms, and mobile/CWV lab signals.
7. Produce a written decision log: evidence, change, owner, expected effect, rollback, and evaluation date.

### Monthly strategy loop

1. Re-run competitor/domain/keyword-gap research and local SERPs at the real service coordinates.
2. Recalculate opportunity by expected business value, not raw volume: relevance × intent × reachable geography × plausible CTR × lead rate × lead value × confidence.
3. Review query-to-page mappings for cannibalization and gaps.
4. Review GBP completeness, accuracy, photos, hours, reviews, owner access, and change log.
5. Review backlink gains/losses and pursue only legitimate, relevant, editorial/community/partner opportunities. Paid/sponsored links must be qualified; automated link creation is prohibited by Google's spam policy.
6. Refresh pages only when facts, evidence, user needs, or competitive gaps changed. Google explicitly warns that changing dates or adding/removing content merely to appear fresh is not useful ([people-first guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).

## 9. Safe browser automation boundary

Google's spam policies prohibit automated Google Search queries for rank checking. Use DataForSEO/OpenSEO for SERP evidence and the Search Console API for owned data; do not have Playwright imitate searches against google.com ([spam policy: machine-generated traffic](https://developers.google.com/search/docs/essentials/spam-policies#machine-generated-traffic)).

Playwright MCP supports isolated or persistent profiles, storage-state files, user-data directories, workspace file restrictions, and allowed/blocked origins. Its README cautions that allowed origins do not themselves form a security boundary and do not cover redirects ([Microsoft Playwright MCP README](https://github.com/microsoft/playwright-mcp#configuration)).

**Operator rules:**

- Prefer official APIs for Search Console, GA4, Ads, GBP, Payload, and DataForSEO.
- Use browser control for OAuth/bootstrap, read-only inspection, preview QA, or a one-off UI action lacking a suitable API.
- Use a dedicated browser profile and dedicated platform user; never reuse the operator's general personal browsing profile.
- Keep credentials in the platform/browser secret store, never in prompts, logs, screenshots, or generated page content.
- Allowlist exact origins and also enforce action-level checks because origin controls are not a complete security boundary.
- Default to read-only. Require a visible proposed diff and human confirmation immediately before irreversible/external actions such as publish, profile edits, review replies, account/user changes, verification, spend, deletion, or bulk submissions.
- Capture before/after screenshots or API representations, actor, timestamp, approval, and rollback information.
- Cap retries and mutation counts; stop on unexpected dialogs, CAPTCHA, reauthentication, account warnings, policy notices, changed UI, or ambiguous target state.
- For recurring actions, convert the successful exploratory flow into a versioned deterministic script with assertions and tests. Do not leave recurring production mutation as unconstrained LLM clicking.

## 10. High-value anti-patterns the final playbook must explicitly forbid

- Creating one page per keyword without validating intent or SERP overlap.
- Swapping city names into identical pages or listing city blocks to create apparent locality.
- Inventing local offices, staff, case studies, reviews, pricing, licenses, or service availability.
- Adding keywords to the legal business name in GBP.
- Creating multiple GBP profiles for one service-area business or using virtual offices.
- Incentivizing reviews, review-gating, or auto-posting replies without specific approval.
- Publishing AI drafts without first-party proof, fact checks, SME review, and preview QA—especially for YMYL topics.
- Using schema for hidden, misleading, self-serving, or nonexistent content.
- Treating sitemaps or manual indexing requests as a ranking tactic.
- Using average position as the north-star KPI or reporting DataForSEO estimates as owned-site truth.
- Buying ranking-credit links, mass directory submissions, automated comment links, or unqualified sponsored links.
- Browser-scraping Google SERPs or letting an agent autonomously mutate GBP, Ads, CMS publish state, credentials, or account access.
- Scaling publishing while analytics, indexing, canonicalization, or conversion tracking is broken.

## 11. Source-backed wording for realistic expectations

Recommended language for the final guide:

> The system can automate research, evidence collection, briefs, drafting, metadata/schema generation, audits, measurement, and proposed platform changes. It cannot automate legitimacy. Ranking growth still depends on an eligible and crawlable site, useful first-party content, accurate business information, real reputation, genuine customer outcomes, and disciplined iteration. Indexing and rich results are never guaranteed.

This framing follows Google's statements that Search inclusion is not guaranteed, structured data only makes a page eligible for features, and local ranking cannot be bought or requested ([technical requirements](https://developers.google.com/search/docs/essentials/technical); [structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies); [local ranking guidance](https://support.google.com/business/answer/7091)).
