# FairLend search indexing and maximum-visibility launch runbook

**Site:** `https://fairlend.ca` → canonical host `https://www.fairlend.ca`  
**Audit date:** 2026-07-14  
**Audience:** technical operator with no prior SEO operations experience  
**Objective:** get every legitimate FairLend page discovered, rendered, evaluated, and monitored across Google, Bing, DuckDuckGo, Apple search surfaces, and ChatGPT search—without poisoning the new domain with demo content, duplicate routes, or low-value mass pages.

> Indexing and ranking are different systems. This runbook first makes pages eligible and discoverable, then builds the local/entity/authority signals needed to earn visibility. No submission mechanism guarantees indexing or rankings.

## The short answer

FairLend is technically crawlable today, but **do not submit the current sitemap yet**. The production sitemap currently advertises one QA page and three generic Payload demo posts as real content, while omitting one legitimate mortgage page. Clean that corpus first. Then verify the domain in Google Search Console, submit the clean sitemap, inspect/request the handful of highest-value URLs once, import the property into Bing Webmaster Tools, and connect IndexNow to Payload's publish lifecycle.

Public Google spot checks on 2026-07-14 returned no FairLend pages. That is a strong indication that the site has no visible Google index footprint yet, but `site:` searches are not authoritative. Google Search Console's URL Inspection and Page indexing reports are the source of truth.

## Current production verdict

| Check | Result | What it means |
|---|---:|---|
| `fairlend.ca` → `www.fairlend.ca` | PASS | Apex permanently redirects with HTTP `308`; one canonical host is being used. |
| Homepage | PASS | `200`, `index, follow`, self-canonical, meaningful title/description and rendered content. |
| Googlebot/Bingbot/Applebot/OAI-SearchBot access | PASS | All received `200`; no `X-Robots-Tag` block was observed. |
| `robots.txt` | PASS | Public site allowed; `/admin/*` disallowed; sitemap declared. |
| XML sitemap availability | PASS | Root sitemap and both child sitemaps return `200`. |
| Sitemap HTTP/canonical integrity | PASS | All 16 advertised URLs return `200`, are indexable, and self-canonical. |
| Sitemap content quality | **FAIL** | One QA page and three generic demo posts are being advertised to search engines. |
| Sitemap completeness | **FAIL** | `/borrowers/institutional-mortgage` is indexable but missing. `/terms` also needs an explicit index/noindex decision. |
| Contact page quality | IMPROVE | Indexable but titled only “Contact,” with no H1 and a generic description. |
| Retired/test route hygiene | IMPROVE | `/fairlend-landing-hero` and `/r/test` serve homepage content with a homepage canonical instead of a clean redirect/404. |
| Search Console/Bing verification | UNKNOWN | No visible verification tag/TXT was found; provider-integrated verification may still exist. |
| IndexNow | NOT DETECTED | No key or implementation was found. |
| Public Google index footprint | NOT OBSERVED | Search spot checks found no FairLend result; confirm with Search Console. |

### URLs to remove before submission

These are currently `index, follow` and present in the sitemap:

- `/money-page-blocks-qa-2026-07-12`
- `/posts/dollar-and-sense-the-financial-forecast`
- `/posts/global-gaze`
- `/posts/digital-horizons`

They are QA/demo material, not defensible FairLend resources. Their presence tells a search engine that the new domain publishes generic, unrelated content. Remove them before asking crawlers to evaluate the site.

### Priority commercial launch set

These are the first URLs to inspect after the cleanup deploy:

1. `https://www.fairlend.ca/`
2. `https://www.fairlend.ca/borrowers/private-mortgage-financing`
3. `https://www.fairlend.ca/borrowers/institutional-mortgage`
4. `https://www.fairlend.ca/construction-draw-financing`
5. `https://www.fairlend.ca/multiplex-financing-gta`
6. `https://www.fairlend.ca/garden-suite-financing-gta`
7. `https://www.fairlend.ca/investing/private-mortgage-lending`

## Phase 0 — Clean the source set before notifying any engine

**Owner:** engineering/content operator  
**Target time:** today, 60–120 minutes  
**Exit gate:** every sitemap URL is a production canonical page worth showing to a prospective borrower, investor, regulator, or referral partner.

### 0.1 Remove QA and demo content

In Payload CMS:

1. Open the page collection and unpublish/delete `money-page-blocks-qa-2026-07-12`.
2. Open the posts collection and unpublish/delete the three demo posts listed above.
3. Remove every internal link, card, relationship, search index record, and related-content reference to them.
4. Deploy/revalidate production.
5. Confirm each deleted URL returns a real `404` or `410` and is absent from all sitemaps.

Use a `301` only if a removed URL already has legitimate backlinks or a true one-to-one replacement. Do not redirect unrelated demo posts to the homepage; that creates soft-404 behaviour and preserves no useful relevance.

### 0.2 Fix sitemap membership

1. Add `/borrowers/institutional-mortgage` to the pages sitemap.
2. Decide whether `/terms` should be searchable:
   - **Index it:** keep `index, follow`, give it a self-canonical, and include it in the sitemap.
   - **Do not index it:** use `noindex, follow` and leave it out of the sitemap.
3. Keep `/search`, `/intake`, `/start/builder`, and workflow/landing variants out while they are `noindex`.
4. Include only production HTTPS canonical URLs returning `200`.
5. Emit `<lastmod>` only when primary content, important links, or structured data materially changed. Do not rewrite every timestamp on every deploy.

Google treats a sitemap as a hint, not a command. It recommends absolute preferred-canonical URLs and ignores sitemap `priority` and `changefreq`. [Google sitemap construction guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en) and [Google sitemap `lastmod` guidance](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)

### 0.3 Upgrade or suppress the contact page

Preferred action: make `/contact` a real branded/local trust page rather than suppressing it.

Add:

- a unique title such as `Contact FairLend Mortgage | Ontario Private Financing`;
- one visible H1;
- phone, monitored email, hours, service area, brokerage/legal name, and applicable licence disclosures;
- a concise explanation of who should contact FairLend and what information to prepare;
- links to the borrower, builder, investor, privacy, and terms pages;
- matching Organization/FinancialService data where factually correct.

If the page cannot yet meet that standard, set `noindex, follow` and remove it from the sitemap until it can.

### 0.4 Fix duplicate/test route behaviour

- Permanently redirect retired `/fairlend-landing-hero` to its true replacement, probably `/`.
- Make unknown `/r/*` paths return `404`/`410`. Only configured campaign codes should redirect.
- Never serve the homepage body at arbitrary paths with a homepage canonical. Canonical tags are signals, not guaranteed directives.
- Keep Payload previews, drafts, admin, APIs, search results, form success pages, and internal workflow routes out of the sitemap and index.

### 0.5 Run the production release gate

After the Vercel deployment, verify every sitemap URL meets all of these conditions:

- [ ] public without authentication;
- [ ] final response is HTTP `200`;
- [ ] no redirect in the sitemap;
- [ ] no HTML or HTTP-header `noindex`;
- [ ] crawl allowed by `robots.txt`;
- [ ] CSS/JavaScript/images needed to render are crawlable;
- [ ] declared canonical exactly matches the sitemap URL;
- [ ] meaningful title, visible H1, primary body copy, and internal links exist in rendered HTML;
- [ ] no draft, demo, preview, QA, parameter, duplicate, search, or thin permutation URL;
- [ ] reachable through an ordinary `<a href>` internal link from the homepage or a relevant hub.

Google's minimum technical eligibility is crawl permission, HTTP `200`, and indexable content. That creates eligibility, not guaranteed inclusion. [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical?hl=en)

**Do not proceed until this gate passes.**

## Phase 1 — Establish Google Search Console as the source of truth

**Owner:** domain/DNS administrator plus SEO operator  
**Exit gate:** Domain property verified, clean sitemap accepted, and launch-set live tests pass.

### 1.1 Create a Domain property

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Click **Add property**.
3. Select **Domain**.
4. Enter exactly `fairlend.ca`—no protocol, path, or `www`.
5. Copy Google's TXT record.
6. Add it at the authoritative DNS provider.
7. Return to Search Console and click **Verify**.
8. Leave the TXT record permanently.
9. Add at least one additional trusted owner/full user under **Settings → Users and permissions** so the property is not tied to one person.

A Domain property covers HTTP/HTTPS, apex, `www`, and all subdomains; it requires DNS verification. [Google property verification documentation](https://support.google.com/webmasters/answer/34592?hl=en)

### 1.2 Check for penalties and security problems first

Before requesting anything:

1. Open **Security & Manual Actions → Manual actions**.
2. Confirm there are no actions.
3. Open **Security & Manual Actions → Security issues**.
4. Confirm there are no issues.
5. Record a screenshot/date in the launch log.

If either report contains an issue, stop submission work and resolve it first.

### 1.3 Submit one authoritative sitemap

The canonical host is `www`, so submit:

`https://www.fairlend.ca/sitemap.xml`

1. Paste that URL into the Search Console inspection bar first.
2. Run **Test live URL** and confirm the page fetch succeeds.
3. Go to **Indexing → Sitemaps**.
4. Enter the root sitemap URL and click **Submit**.
5. Wait for status **Success**.
6. Open the row if Google reports a fetch or parse error and correct the root cause.

The root sitemap already references the pages/posts child sitemaps, so submitting each child separately is unnecessary. Sitemap acceptance proves Google can read the file; it does not prove the pages are indexed. [Google Search Console Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en)

### 1.4 Inspect and request the priority launch set

For each launch-set URL listed near the top of this runbook:

1. Paste the complete `https://www...` URL into Search Console's top inspection bar.
2. Click **Test live URL**.
3. Confirm **URL is available to Google**.
4. Open **View tested page**.
5. Check the HTTP response, rendered screenshot, HTML, and loaded resources.
6. Confirm the money-page headline, offer, important explanatory text, and ordinary links are present in the rendered output.
7. Confirm indexing is allowed.
8. Confirm the declared canonical is the exact inspected URL.
9. Click **Request indexing** once.
10. Log the URL, test result, request date, and operator.

Do not request every URL and do not repeat requests. Google applies quotas and says repetition does not accelerate crawling; discovery/crawling can take days to weeks. Use inspection for the small priority set and the sitemap for the corpus. [Google URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en) and [Google recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)

### 1.5 Interpret what Search Console says

Use this decision tree for each priority page:

```text
Is “URL is on Google” shown?
├─ YES
│  ├─ Google-selected canonical is the intended URL?
│  │  ├─ YES → Indexing works. Move to query relevance, authority, CTR, and conversion.
│  │  └─ NO  → Align redirects, canonical, internal links, sitemap, and duplicate content.
│  └─ No impressions after 2–6 weeks?
│     └─ This is primarily a ranking/demand problem, not an indexing problem.
└─ NO
   ├─ “URL is unknown to Google” / not discovered?
   │  ├─ Confirm it is in the clean sitemap.
   │  ├─ Add prominent contextual internal links.
   │  ├─ Confirm sitemap was fetched successfully.
   │  └─ Request once, then wait for crawling.
   ├─ “Discovered – currently not indexed”?
   │  ├─ Check server reliability, crawl responses, render cost, and crawlable resources.
   │  ├─ Strengthen internal links and remove low-value URL inventory.
   │  └─ Improve unique value; wait and inspect again after a material change.
   ├─ “Crawled – currently not indexed”?
   │  ├─ Treat it as a quality/duplication/canonical problem.
   │  ├─ Compare against other pages targeting the same intent.
   │  ├─ Add original, expert-reviewed information and concrete local evidence.
   │  └─ Consolidate or remove thin/overlapping pages.
   ├─ Excluded by noindex/robots/HTTP error?
   │  └─ Fix the exact directive/status, live-test, then request once.
   └─ Duplicate / alternate canonical?
      ├─ Decide which URL should win.
      ├─ 301 true duplicates to it where possible.
      └─ Make canonical, sitemap, navigation, hreflang (if used), and links agree.
```

### 1.6 Do not use Google's Indexing API

Google's Indexing API is limited to `JobPosting` and livestream `BroadcastEvent` pages. FairLend's mortgage, service, location, and editorial pages are not eligible. [Google Indexing API limitations](https://developers.google.com/search/apis/indexing-api/v3/using-api?hl=en)

There is also no separate submission for Google AI Overviews or AI Mode. A page must already be indexed and eligible for a normal Search snippet. Google requires no special AI schema or `llms.txt`. [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)

## Phase 2 — Bing Webmaster Tools and IndexNow

**Owner:** SEO operator plus application engineer  
**Exit gate:** Bing property verified, sitemap processed, launch set inspected, Site Scan clean, and Payload publication events notify IndexNow.

### 2.1 Import from Google Search Console

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters/).
2. Sign in with the operational business account.
3. Choose **Import from Google Search Console**.
4. Authorize the verified FairLend property.
5. Select FairLend and import it.
6. Confirm the root sitemap appears.
7. Wait up to 48 hours for initial reporting.

Import is the quickest path because Bing imports the property and known sitemaps and verifies it automatically. Manual alternatives are DNS verification, Bing's XML file, homepage meta tag, or DNS CNAME. [Bing add and verify a site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)

### 2.2 Inspect Bing's view

For the same priority launch set:

1. Open **URL Inspection**.
2. Review **Index**, **SEO**, and **Markup** cards.
3. Use **Live URL** to see Bingbot's current response.
4. Inspect the final `www` URL directly; Bing's tester reports a redirect but does not follow it.
5. Request indexing only after correcting any fault.
6. Run **Site Scan** against the root sitemap/full site.
7. Fix errors first, then warnings.
8. Use **Site Explorer** to monitor indexed, excluded, redirect, `noindex`, robots-blocked, warning, and error states.

[Bing URL Inspection](https://www.bing.com/webmasters/help/URL-Inspection-55a30305), [Bing Site Scan](https://www.bing.com/webmasters/help/site-scan-623520c9), and [Bing Site Explorer](https://www.bing.com/webmasters/help/site-explorer-c680da37)

### 2.3 Wire IndexNow into Payload's production lifecycle

IndexNow should be an automatic publication side effect, not a button someone remembers to press.

1. Generate a random 8–128 character key.
2. Host a UTF-8 file at `https://www.fairlend.ca/{key}.txt` containing only the key.
3. Store the key as a Vercel production environment variable; do not commit it if operational policy treats it as a secret.
4. Add an idempotent server-side notification job that runs **after a successful production transaction** when a document is:
   - first published;
   - materially updated while published;
   - unpublished or deleted.
5. Resolve the Payload document to its final canonical `www` URL.
6. For a batch, POST JSON with `host`, `key`, optional `keyLocation`, and up to 10,000 same-host URLs.
7. Log URL, change type, Payload collection/document/version, deployment, timestamp, response code, and retry count.
8. Retry transient `429`/`5xx` responses with bounded exponential backoff.
9. Monitor Bing Webmaster Tools' **IndexNow** report.

Guardrails:

- never notify a draft, autosave, preview, staging URL, parameter variant, or unchanged redeploy;
- submit the final canonical URL, not the apex redirect source;
- submit a deletion/unpublish event after the URL returns `404`/`410` or the intended removal state;
- deduplicate events and do not spam repeated updates;
- treat HTTP `200` as receipt only, not proof of crawl or indexation.

Participating engines share IndexNow submissions. The protocol defines `200` as received, `202` as key validation pending, and `400`/`403`/`422`/`429` as errors requiring correction or throttling. [IndexNow protocol](https://www.indexnow.org/documentation)

## Phase 3 — Cover other discovery and answer surfaces

### 3.1 DuckDuckGo

DuckDuckGo maintains DuckDuckBot and some of its own indexes, while its traditional links/images are largely sourced from Bing. Therefore:

1. Complete the Bing and IndexNow work above.
2. Keep `DuckDuckBot` allowed in `robots.txt` and at the Vercel Firewall/WAF layer.
3. Verify suspicious crawler traffic against DuckDuckGo's published IP list instead of trusting a spoofable user-agent string.
4. Monitor DuckDuckGo referrals separately; Bing inclusion does not guarantee DuckDuckGo inclusion.

[DuckDuckGo result sources](https://duckduckgo.com/duckduckgo-help-pages/results/sources) and [DuckDuckBot identification](https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot)

### 3.2 Apple search surfaces

Apple says Applebot data powers search in Spotlight, Siri, and Safari and can provide current context for AI-generated answers.

1. Keep `Applebot` allowed and ensure required render resources are accessible.
2. Avoid `noindex` and `nosnippet` on pages intended for maximum discovery/answer visibility.
3. Control `Applebot-Extended` separately if model-training consent differs from search consent; blocking it does not block Applebot search inclusion.
4. Verify bot traffic using Apple's published CIDR data or reverse/forward DNS checks if edge rules are added.
5. Claim the legitimate business in [Apple Business Connect](https://businessconnect.apple.com/) if eligible and keep name, phone, website, hours, logo, and service details consistent.

### 3.3 ChatGPT search

OpenAI exposes independent crawler controls:

- `OAI-SearchBot`: automatic discovery for ChatGPT search; this is the search-visibility control.
- `GPTBot`: potential model-training use; decide this separately.
- `ChatGPT-User`: user-triggered fetches; not the automatic search inclusion control.

For maximum ChatGPT search discoverability:

1. Keep `OAI-SearchBot` allowed in `robots.txt`.
2. Ensure Vercel Firewall/WAF does not block OpenAI's current published ranges from `https://openai.com/searchbot.json`.
3. Keep important page content public, canonical, internally linked, and understandable as text.
4. Avoid `noindex` on pages intended to appear.
5. Allow roughly 24 hours after changing crawler rules.
6. Track referrals containing `utm_source=chatgpt.com` in analytics.
7. Make a separate governance decision about `GPTBot`; search visibility does not require training permission.

[OpenAI crawler overview](https://developers.openai.com/api/docs/bots)

`Google-Extended` is also a model-use control, not a Google Search indexing control. Do not confuse training/grounding consent with search eligibility.

## Phase 4 — Establish the local business entity everywhere it legitimately belongs

Website indexing alone does not maximize local visibility. Search engines need a consistent real-world entity that corroborates the website.

### 4.1 Google Business Profile

Create/claim a profile only if FairLend meets Google's eligibility rules for a customer-facing location or a legitimate service-area business. Do not invent an office, virtual office, staffed hours, or extra city locations.

1. Claim and verify the profile with an authorized company account.
2. Use the exact public business name—no keyword stuffing.
3. Select the most specific truthful primary category and only relevant secondary categories.
4. Use the same canonical website, monitored phone, hours, service area, logo, and business description as the site.
5. Hide the address if customers are not served there and the business qualifies as a service-area operation.
6. Add services and original photos that accurately represent the operation.
7. Establish an operational review process: ask real clients neutrally, never gate, buy, fabricate, or keyword-script reviews; respond without disclosing private financial information.
8. Link the profile to the most useful canonical landing page, normally the homepage.

### 4.2 Bing Places and Apple Business Connect

1. Claim or import the verified Google Business Profile into [Bing Places](https://www.bingplaces.com/).
2. Claim the organization in Apple Business Connect.
3. Keep the legal/public name, phone, website, service area, hours, and branding consistent.
4. Audit these records quarterly and immediately after business-data changes.

### 4.3 Authoritative Canadian/industry citations

Maintain correct profiles where FairLend is legitimately listed: applicable regulator/licensing directories, professional associations, business registries, partner directories, and credible local organizations. Use the legally correct entity name and licence details. These are verification surfaces, not places to manufacture exact-match anchor text.

## Phase 5 — Make the website worth indexing and ranking

Once discovery plumbing works, visibility is governed by usefulness, intent match, internal structure, real-world authority, and competitive strength.

### 5.1 Create a deliberate internal-link graph

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

### 5.2 Make each money page the best answer for one intent

Each commercial page should have:

- one primary user intent and one canonical URL;
- a precise title/H1 describing product + audience + geography where genuinely relevant;
- who the product is for/not for;
- eligible property/project types;
- typical process and decision timeline;
- required documents and underwriting factors;
- transparent constraints, risks, fees/rate caveats, and regulatory disclosures;
- specific Ontario/GTA context rather than swapped city names;
- FAQ answers sourced from real sales/underwriting questions;
- a named qualified author/reviewer, reviewed date, and claim owner;
- a clear next action and conversion path;
- links to evidence, regulators, related resources, and adjacent services.

For financial services, human review and factual accountability are non-negotiable. Do not let an agent invent rates, approval probabilities, licensing claims, testimonials, borrower outcomes, or legal/tax advice.

### 5.3 Build question-led supporting content

Use first-party question sources:

- sales calls and intake-form language;
- broker/partner questions;
- Search Console query data once it accumulates;
- underwriting objections and document requests;
- customer-service email themes;
- legitimate public forums as research input, never as a place to spam links.

For each recurring high-intent question:

1. Decide whether it belongs as an FAQ section on an existing money page or deserves a standalone resource.
2. Answer it directly in the first paragraph.
3. Explain conditions, trade-offs, examples, and next steps.
4. Add original evidence: process detail, calculation, decision rubric, anonymized pattern, or named expert commentary.
5. Link naturally to the matching commercial page.
6. Add review/expiry dates for time-sensitive claims.

Do not mass-produce thin local pages. A Toronto, Mississauga, or Hamilton page must contain genuinely distinct local demand, property, zoning/process, market, example, partner, and service information—not the same body copy with a city token replaced.

### 5.4 Strengthen entity and structured-data signals

The homepage already exposes Organization/FinancialService structured data. Improve it with only verified facts:

- approved canonical logo;
- `sameAs` links to official regulator, business, and social profiles;
- public address only if it is legitimate and consistent with the business-profile policy;
- stable `@id` values reused across pages;
- matching visible phone, email, service area, legal name, and public brand name.

Structured data must describe visible content and does not guarantee a rich result. Validate after every template change with Google's Rich Results Test and Schema.org validator.

### 5.5 Earn legitimate discovery links

A new domain needs references from already discovered, relevant sites. Prioritize:

- official business/regulatory/association profiles;
- genuine partners and referral relationships;
- expert contributions to reputable Canadian real-estate/finance publications;
- original local data, calculators, checklists, or explainers others have a reason to cite;
- useful answers to journalists, brokers, builders, landlords, and housing organizations.

Do not buy bulk links, run private-blog-network schemes, spam Reddit/forums, exchange sitewide exact-match links, or publish fake statistics. These create risk without durable authority.

## Phase 6 — Monitoring and operating cadence

### Launch-day record

Create a simple launch log with:

| Field | Example |
|---|---|
| Production deployment | Vercel deployment URL + commit SHA |
| Sitemap URL/count | root sitemap + intended canonical count |
| Google property | verified domain owner and date |
| Google sitemap | submitted/success timestamp |
| Google inspections | launch URL, live-test result, request date |
| Bing property/sitemap | imported and processed timestamps |
| Bing inspections/scan | results and defects |
| IndexNow | key location, event/job version, last response |
| Business profiles | owner, verification state, canonical data |
| Known exclusions | intentional `noindex`, redirects, 404/410 routes |

### Days 0–3

- Confirm Google and Bing fetched the root sitemap.
- Confirm crawler requests appear in Vercel logs without `403`, `429`, or `5xx` spikes.
- Confirm the homepage and at least one money page were discovered/fetched.
- Confirm IndexNow notifications are received and contain only canonical production URLs.
- Fix infrastructure errors immediately; do not repeatedly resubmit healthy URLs.

### Days 4–14

- Inspect each launch-set URL in Google and Bing.
- Review Google **Page indexing** reasons, not just the aggregate chart.
- Compare submitted canonical URLs with indexed/excluded URLs.
- Investigate canonical mismatches, soft 404s, crawled-not-indexed pages, and render failures.
- Confirm demo/QA URLs are gone from sitemaps and returning their intended removal status.
- Watch for first branded and non-branded impressions.

### Weeks 2–6

- Expect a gradual crawl/index/ranking process, not an overnight switch.
- Track indexed launch-set URLs, non-brand impressions, queries, country/device, clicks, and conversion quality.
- If a page is indexed but invisible, move from indexing work to intent/content/authority/CTR analysis.
- Publish only genuinely reviewed supporting content and connect it into the site graph.

### Weekly during growth

- Google Search Console: performance, priority URL status, sitemap processing, Page indexing changes.
- Bing: search performance, Site Explorer, IndexNow errors.
- Analytics: organic landing pages, qualified leads, `utm_source=chatgpt.com`, Bing/DuckDuckGo referrals.
- Vercel: crawler `4xx`/`5xx`/latency and WAF blocks.
- Payload: drafts accidentally published, expired claims, broken relationships, orphan pages.

### Monthly

- Run Bing Site Scan.
- Review Google Crawl Stats, Security issues, and Manual actions.
- Crawl the production sitemap and validate status/index/canonical/render/internal-link rules.
- Review Core Web Vitals and field performance; the homepage HTML is currently approximately 1 MB, so measure and optimize rather than guessing.
- Compare intended sitemap inventory with indexed/excluded classifications.

### Quarterly

- Audit business-profile consistency and licence/entity details.
- Review bot policy (`OAI-SearchBot`, `GPTBot`, `Applebot`, `Applebot-Extended`, DuckDuckBot) and WAF allowlists against current official machine-readable ranges.
- Review location/content inventory for duplication and low-value pages.
- Refresh claims whose review dates have expired.

## Success criteria

Do not use “all URLs indexed” as the sole KPI. A search engine is not obligated to index every page.

Track:

1. **Corpus integrity:** 100% of sitemap URLs are canonical, `200`, indexable, useful, and internally linked.
2. **Priority index coverage:** all seven launch-set URLs show the intended Google/Bing canonical or have a documented remediation.
3. **Discovery reliability:** sitemap fetch and IndexNow job success; zero sustained crawler-blocking `403`/`429`/`5xx` defects.
4. **Search demand:** growth in non-brand impressions for commercial and question-led topics.
5. **Entity visibility:** accurate Google/Bing/Apple business records and branded search presentation.
6. **Business outcome:** qualified organic enquiries, not raw indexed-page count or vanity traffic.
7. **Quality control:** zero live QA/demo/draft pages and zero fabricated local permutations.

Evidence priority is:

1. Google URL Inspection and Page indexing reports;
2. Bing URL Inspection and Site Explorer;
3. Search Console/Bing impressions and indexed-page reporting;
4. verified server/crawler logs for fetching evidence;
5. manual `site:` searches only as a spot check.

A bot hit proves fetching, not indexing. Indexed status proves eligibility to appear, not ranking for a particular query, user, device, or location.

## Copy/paste launch checklist

### Before search-engine submission

- [ ] Unpublish/delete the QA page.
- [ ] Unpublish/delete all three generic demo posts.
- [ ] Remove internal references to those URLs.
- [ ] Confirm removed URLs return `404`/`410` and leave all sitemaps.
- [ ] Add `/borrowers/institutional-mortgage` to the sitemap.
- [ ] Make an explicit index/noindex decision for `/terms`.
- [ ] Upgrade `/contact` or temporarily noindex/remove it.
- [ ] Redirect `/fairlend-landing-hero` appropriately.
- [ ] Make unknown `/r/*` routes return `404`/`410`.
- [ ] Confirm sitemap contains only canonical `200` indexable production URLs.
- [ ] Confirm all sitemap pages have meaningful rendered content and internal links.
- [ ] Deploy and re-run the production release gate.

### Google

- [ ] Create `fairlend.ca` Domain property.
- [ ] Add and retain DNS TXT verification.
- [ ] Add backup owner/full user.
- [ ] Check Manual actions and Security issues.
- [ ] Submit `https://www.fairlend.ca/sitemap.xml`.
- [ ] Wait for sitemap status **Success**.
- [ ] Live-test each priority launch URL.
- [ ] Verify rendered content, resources, indexing permission, and declared canonical.
- [ ] Request indexing once per priority URL.
- [ ] Log every inspection/request.

### Bing and IndexNow

- [ ] Import the site from Google Search Console.
- [ ] Confirm sitemap import/processing.
- [ ] Inspect each priority launch URL.
- [ ] Run Site Scan and fix errors/warnings.
- [ ] Generate and host the IndexNow key file.
- [ ] Connect publish/update/unpublish/delete events in Payload.
- [ ] Deduplicate, log, retry, and monitor IndexNow notifications.

### Entity and other search surfaces

- [ ] Keep Googlebot, Bingbot, DuckDuckBot, Applebot, and OAI-SearchBot unblocked at robots/WAF layers.
- [ ] Decide GPTBot and Applebot-Extended consent separately.
- [ ] Claim a policy-compliant Google Business Profile if eligible.
- [ ] Claim/import Bing Places.
- [ ] Claim Apple Business Connect.
- [ ] Add verified logo and `sameAs` properties to Organization schema.
- [ ] Align public name, phone, website, service area, hours, and licence data everywhere.

### Visibility growth

- [ ] Ensure every money page is linked from a hub/navigation and has one clear intent.
- [ ] Add named expert author/reviewer and review dates.
- [ ] Publish answers to real borrower/broker/builder questions.
- [ ] Build legitimate regulator, partner, association, and editorial citations.
- [ ] Monitor weekly and run the not-indexed decision tree before changing anything.

## What not to do

- Do not pay an “instant indexing” service or accept guaranteed Google inclusion claims.
- Do not use Google's Indexing API for these pages.
- Do not call Google's deprecated sitemap ping endpoint.
- Do not repeatedly request indexing.
- Do not treat a sitemap **Success**, IndexNow `200`, or successful live test as proof of indexing.
- Do not block a URL in `robots.txt` when you need the crawler to see `noindex`; use the correct removal status/process.
- Do not submit redirects, parameters, previews, drafts, search results, or thin city permutations.
- Do not fabricate `lastmod` freshness.
- Do not add unofficial “AI schema” or `llms.txt` expecting Google AI Overview inclusion.
- Do not conflate OAI-SearchBot with GPTBot, Applebot with Applebot-Extended, or Google Search with Google-Extended.
- Do not mass-generate financial pages without factual, compliance, and expert review.

## Official operator references

- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical?hl=en)
- [Google property verification](https://support.google.com/webmasters/answer/34592?hl=en)
- [Google sitemap construction](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en)
- [Google Search Console Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en)
- [Google URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en)
- [Google recrawl requests](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Google robots meta and X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Bing add and verify a site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)
- [Bing URL Inspection](https://www.bing.com/webmasters/help/URL-Inspection-55a30305)
- [Bing Site Scan](https://www.bing.com/webmasters/help/site-scan-623520c9)
- [Bing Site Explorer](https://www.bing.com/webmasters/help/site-explorer-c680da37)
- [IndexNow protocol](https://www.indexnow.org/documentation)
- [DuckDuckGo result sources](https://duckduckgo.com/duckduckgo-help-pages/results/sources)
- [DuckDuckBot identification](https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot)
- [Applebot documentation](https://support.apple.com/en-ca/119829)
- [OpenAI crawler overview](https://developers.openai.com/api/docs/bots)

---

**Immediate order of operations:** clean the four bad URLs → fix sitemap membership/contact/test routes → deploy and validate → verify Google Domain property → submit root sitemap → inspect/request the seven launch URLs → import into Bing → run Bing inspection/scan → ship Payload-driven IndexNow → establish business/entity profiles → publish expert-reviewed question-led content and earn legitimate citations.
