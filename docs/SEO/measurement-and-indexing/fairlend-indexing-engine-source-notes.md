# FairLend indexing and search-engine discovery: primary-source notes

**Research date:** 2026-07-14  
**Target:** `https://fairlend.ca` (new Canadian financial-services website)  
**Scope:** Google Search and Search Console, Bing Webmaster Tools and IndexNow, DuckDuckGo, Applebot, and OpenAI search crawlers.  
**Source standard:** official search-engine/platform documentation only.

## Executive answer

There is no universal "submit my site everywhere" button, and no submission method guarantees indexing. Maximum legitimate discovery comes from five coordinated controls:

1. Every intended public canonical URL must be technically indexable: public, crawlable, HTTP `200`, self-canonical, free of `noindex`, useful in rendered HTML, and linked from the site's navigation or another indexed page.
2. Publish one accurate root sitemap containing only canonical, indexable URLs, reference it in `robots.txt`, and submit it in both Google Search Console and Bing Webmaster Tools.
3. Verify `fairlend.ca` in Google Search Console and Bing Webmaster Tools, then use their live inspection tools to test the homepage and priority commercial pages before requesting indexing once.
4. Trigger IndexNow only after a canonical URL is published, materially updated, or deleted. This accelerates notification to participating engines; it does not guarantee crawling or indexing.
5. Keep general search crawlers, Applebot, DuckDuckBot, and `OAI-SearchBot` unblocked at both `robots.txt` and CDN/WAF layers. Training crawlers (`GPTBot`, `Applebot-Extended`) are independent controls and can be blocked without opting out of their corresponding search surfaces.

Google's minimum eligibility rules are only that Googlebot is not blocked, the page returns HTTP `200`, and the page contains indexable content. Meeting them makes a page *eligible*, not guaranteed to be indexed. [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical?hl=en)

## 1. Production indexability gate

Run this gate before submitting anything. Submission cannot repair a blocked, erroneous, duplicate, or low-value page.

### 1.1 Required for every intended indexable URL

- The URL is public and does not require a login.
- The final URL returns HTTP `200`, not a redirect, `4xx`, `5xx`, or soft-404 response.
- `robots.txt` allows the crawler to fetch the page and the JavaScript, CSS, images, and XHR resources required to render it.
- Neither HTML nor response headers contain `noindex` (`<meta name="robots" content="noindex">` or `X-Robots-Tag: noindex`). A crawler must be allowed to fetch a URL before it can see and honour `noindex`; blocking the URL in `robots.txt` is not a reliable removal mechanism. [Google robots meta and X-Robots-Tag documentation](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) and [Bing blocking guidance](https://www.bing.com/webmasters/help/block-urls-from-bing-264e560a)
- The rendered page contains the primary text, meaningful title, and navigable links. Google documents JavaScript rendering limitations and warns that adding or removing a `noindex` directive with JavaScript can fail because Google may skip rendering after seeing `noindex`. [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- The URL declares the intended canonical in the HTML source, and internal links, redirects, and the sitemap all agree on the same HTTPS hostname and path. A canonical is a signal, not an instruction Google must accept. [Google canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- Every priority page is linked from the homepage, global navigation, a hub page, or another crawlable page. Google says comprehensive site navigation starting at the homepage should enable discovery of the remaining pages. [Google Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en)
- The page is substantive, unique, and useful. Thin, duplicated, doorway, keyword-stuffed, or scaled AI-generated pages can be excluded or penalized even when technically crawlable. [Google web spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

### 1.2 Canonical host consistency

Choose exactly one public form, expected here to be `https://fairlend.ca/...`, then enforce it everywhere:

- `http://fairlend.ca/*` -> permanent redirect to `https://fairlend.ca/*`
- `https://www.fairlend.ca/*` -> permanent redirect to `https://fairlend.ca/*`
- canonical elements -> `https://fairlend.ca/...`
- sitemap `<loc>` values -> `https://fairlend.ca/...`
- internal links -> `https://fairlend.ca/...` or clean relative paths that resolve there
- Open Graph URL and structured-data URLs -> the same canonical URL

Redirect source URLs are not indexed as separate pages; engines index the destination when it is otherwise eligible. Google explicitly reports redirects as not indexed and indexes the redirect target. [Google Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en)

### 1.3 Safe `robots.txt` baseline

For maximum search visibility, start with the smallest possible set of exclusions. Do not block frontend render assets such as `/_next/static/`.

```text
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://fairlend.ca/sitemap.xml
```

Add exclusions only for routes that are genuinely non-public or operational. Sensitive information must be protected by authentication, not merely `robots.txt`. If FairLend chooses to opt out of model training while retaining search visibility, the independent controls can be appended:

```text
User-agent: GPTBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /
```

Those two rules do **not** block `OAI-SearchBot` or `Applebot`, respectively. [OpenAI crawler controls](https://developers.openai.com/api/docs/bots) and [Applebot controls](https://support.apple.com/en-gb/119829)

## 2. Build one authoritative XML sitemap

Publish `https://fairlend.ca/sitemap.xml` (or a root sitemap index) and make it a direct, unauthenticated HTTP `200` response.

### 2.1 Include

- only production HTTPS canonical URLs intended to appear in search;
- the homepage, core service/money pages, location pages with genuinely distinct local value, about/team/trust pages, and useful editorial resources;
- fully qualified absolute URLs;
- an accurate `<lastmod>` only when the main content, structured data, or important links changed materially.

### 2.2 Exclude

- Payload drafts and preview URLs;
- admin, API, search-result, form-success, account, or internal workflow routes;
- redirects, `404`/`410`/`5xx` URLs, `noindex` pages, duplicates, tracking-parameter variants, and non-canonical URLs;
- fabricated city/keyword permutations that exist only to funnel users to the same destination.

Google limits one sitemap to 50 MB uncompressed or 50,000 URLs, recommends placing it at the site root, requires absolute URLs, and says to include preferred canonical URLs. Sitemap submission is only a hint and does not guarantee crawling or indexing. [Google sitemap construction guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en)

Google uses truthful `lastmod` values as a crawl-scheduling signal but ignores sitemap `priority` and `changefreq`. The deprecated Google sitemap ping endpoint returns `404`; use `robots.txt` and Search Console instead. [Google sitemap `lastmod` and ping guidance](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)

## 3. Google Search Console: exact launch workflow

### Step G1 — Create and retain a Domain property

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Choose **Add property** -> **Domain**.
3. Enter `fairlend.ca` without protocol, path, or `www`.
4. Add Google's DNS TXT verification record at the authoritative DNS provider.
5. Leave that TXT record in place permanently and add at least one additional trusted owner or full user under **Settings -> Users and permissions**.

A Domain property includes all protocols, subdomains, and paths and requires DNS verification. [Google: add a website property](https://support.google.com/webmasters/answer/34592?hl=en)

### Step G2 — Submit the sitemap

1. Confirm `https://fairlend.ca/sitemap.xml` returns `200` without authentication.
2. Inspect the sitemap URL and run a live test; **Page fetch** must say **Successful**.
3. Open **Indexing -> Sitemaps**.
4. Enter `https://fairlend.ca/sitemap.xml` and choose **Submit**.
5. Wait for **Success**. If it does not succeed, open the sitemap row and fix the reported parsing/fetch error.

Google says a sitemap may be fetched immediately, while crawling its URLs can still take time and not every listed URL will necessarily be crawled. [Google Search Console Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en)

### Step G3 — Inspect and request the priority launch set

For the homepage and the small set of highest-value canonical pages:

1. Paste the complete canonical URL into the Search Console inspection bar.
2. Choose **Test live URL**.
3. Confirm **URL is available to Google**.
4. Open **View tested page** and check:
   - HTTP response and rendered screenshot;
   - important text and links are present;
   - indexing is allowed;
   - resources are not blocked;
   - the declared canonical is correct.
5. Choose **Request indexing** once.

The live test proves only that the inspection crawler can access and parse the current page; it does not test every quality, security, legal-removal, manual-action, or canonical-selection condition. A positive result and a request do not guarantee indexing. [Google URL Inspection documentation](https://support.google.com/webmasters/answer/9012289?hl=en)

Do not repeatedly request the same URL. Google applies quotas and says repeated requests do not make recrawling faster. A crawl may take from days to weeks. Use URL Inspection for a few important URLs and the sitemap for the complete set. [Google recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)

### Step G4 — Diagnose from Search Console, not from guesswork

Check weekly during launch, then monthly and after major releases:

- **Page indexing**: confirm the homepage and intended canonical pages are indexed; open each unexpected reason row.
- **Crawl stats**: verify Googlebot reaches the site without DNS, connection, `robots.txt`, or server-error spikes.
- **Sitemaps**: compare submitted/discovered URL counts and fix fetch/parse errors.
- **Security issues** and **Manual actions**: both must be clean.
- **Performance**: impressions are the first visibility signal; clicks can remain zero on a new site.

Search Console may take up to a week to generate data for a newly added site, and ordinary performance data commonly lags by two to three days. [Google: About Search Console data](https://support.google.com/webmasters/answer/96568?hl=en-LI)

Use this failure tree for a priority URL:

```text
URL absent from Google
|
+-- Live test cannot fetch
|   +-- Fix DNS/TLS/CDN/WAF/server response
|   +-- Remove robots block for public page/resources
|   +-- Ensure final canonical returns 200
|
+-- Live test finds noindex
|   +-- Remove HTML or X-Robots-Tag noindex
|   +-- Deploy, retest live, request indexing once
|
+-- Redirect/duplicate/alternate canonical
|   +-- Inspect intended destination
|   +-- Align canonical, internal links and sitemap
|   +-- Remove duplicate URL from sitemap
|
+-- Soft 404
|   +-- Add real, page-specific value if page should exist
|   +-- Otherwise return an honest 404/410 and remove from sitemap
|
+-- Discovered or crawled but currently not indexed
    +-- Confirm it is internally linked and in the sitemap
    +-- Consolidate overlap; improve unique value, evidence and intent fit
    +-- Do not solve with repeated submission or mass near-duplicate pages
```

Google explicitly warns that 100% indexing is neither expected nor desirable: redirects, duplicates, intentionally blocked pages, and non-canonical variants should remain unindexed. [Google Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en)

### Step G5 — AI Overviews and AI Mode

There is no separate Google AI index submission. A page must already be indexed and eligible for a normal Search snippet to be eligible as an AI Overview or AI Mode supporting link. Google says there is no special schema, AI text file, or other machine-readable file required. Keep important content in text, crawlable, internally linked, and consistent with visible structured data. [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)

If the property receives the 2026 Generative AI performance reports, monitor impressions by page, country, device, and date. The report is still rolling out to a subset of properties; its data remains included in ordinary overall Search performance. [Google Search Generative AI performance reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports?hl=en)

## 4. Bing Webmaster Tools and IndexNow

### Step B1 — Add and verify FairLend

1. Sign in to [Bing Webmaster Tools](https://www.bing.com/webmasters/).
2. Prefer **Import from Google Search Console** after the Google Domain property is verified. Select FairLend and import; Bing imports the property and known sitemaps and verifies it automatically.
3. If import is not acceptable, add the site manually and verify using DNS auto-verification, the Bing XML file, a homepage meta tag, or a DNS CNAME.
4. Allow up to 48 hours for initial analytics and data generation.

Bing documents all four verification methods and the Search Console import flow. [Bing: add and verify a site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)

### Step B2 — Submit and validate the sitemap

1. Open **Sitemaps** in the verified site.
2. Submit `https://fairlend.ca/sitemap.xml` if it was not imported.
3. Wait for processing and open any warning or error for exact details.
4. Keep the `Sitemap:` directive in `robots.txt`; Bing can also discover it there.

Bing accepts XML, RSS, Atom, and plain-text sitemaps. [Bing sitemaps documentation](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed)

### Step B3 — Inspect the launch set and run a site scan

1. Open **URL Inspection** for the homepage and each priority money page.
2. Check the Index, SEO, and Markup cards.
3. Use **Live URL** to see the response Bingbot receives. Note that Bing's live tester reports a redirect but does not follow it; inspect the redirect destination separately.
4. Request indexing only after resolving any crawl/index issue.
5. Run **Site Scan** against the root sitemap or full website, fix errors first, then warnings.
6. Use **Site Explorer** to monitor indexed, error, warning, excluded, redirecting, `noindex`, and robots-blocked URLs.

[Bing URL Inspection](https://www.bing.com/webmasters/help/URL-Inspection-55a30305), [Bing Site Scan](https://www.bing.com/webmasters/help/site-scan-623520c9), and [Bing Site Explorer](https://www.bing.com/webmasters/help/site-explorer-c680da37)

### Step B4 — Implement IndexNow in the Payload publishing lifecycle

1. Generate a random key containing 8–128 permitted characters.
2. Host a UTF-8 text file at `https://fairlend.ca/{key}.txt` whose only content is that key. If hosted elsewhere on the same host, provide `keyLocation` in every notification.
3. After a production transaction succeeds, submit the canonical URL when a document is:
   - first published;
   - materially updated while published;
   - unpublished or deleted.
4. For one URL, call an IndexNow-compatible endpoint with the escaped URL and key. For batches, POST JSON containing the host, key, optional key location, and up to 10,000 same-host URLs.
5. Log the URL, change type, CMS document/version, timestamp, response code, and retry count.
6. Monitor the **IndexNow** report in Bing Webmaster Tools.

IndexNow participants share submitted URLs with other participating engines. HTTP `200` means only that the URL set was received; `202` means key validation is pending; `400`, `403`, `422`, and `429` require correcting the request, key/host relationship, or rate. [IndexNow protocol documentation](https://www.indexnow.org/documentation)

Publishing guardrails:

- Never notify for a Payload draft, autosave, preview, staging URL, or unchanged re-deployment.
- Send the final canonical URL, not a redirect source or parameter variant.
- Send meaningful changes once; do not spam the same URL repeatedly. IndexNow recommends at least five minutes between repeated updates to frequently changing pages.
- Keep the XML sitemap. IndexNow complements sitemaps; it does not replace them.
- Treat successful notification as delivery evidence, not indexing evidence. Every participating engine makes its own crawl and index decision.

[IndexNow FAQ](https://www.indexnow.org/faq) and [Bing URL submission guidance](https://www.bing.com/webmasters/help/URL-Submission-62f2860b)

### Step B5 — Measure Bing and Microsoft AI visibility

Use normal Search Performance for impressions/clicks and, where available, the **AI Performance** dashboard for citations, cited pages, grounding queries, and page-level citation activity across Microsoft Copilot, Bing AI summaries, and select integrations. A citation count does not indicate placement, ranking, authority, or a page's role in one answer. [Bing AI Performance public preview](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)

## 5. DuckDuckGo

DuckDuckGo officially says it maintains DuckDuckBot and several indexes, while traditional links and images are **largely** sourced from Bing. Therefore:

1. Complete the Bing verification, sitemap, inspection, and IndexNow workflow.
2. Do not block `DuckDuckBot` in `robots.txt`, CDN, or WAF.
3. Verify genuine DuckDuckBot traffic against DuckDuckGo's published JSON IP list rather than trusting a spoofable user-agent string.
4. Monitor actual DuckDuckGo referral visibility separately; do not assume Bing inclusion guarantees DuckDuckGo inclusion.

[DuckDuckGo result sources](https://duckduckgo.com/duckduckgo-help-pages/results/sources) and [official DuckDuckBot identification](https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot)

The official sources reviewed document no DuckDuckGo equivalent of Search Console or a general site-owner URL submission workflow. Bing coverage plus crawler accessibility is the available first-party-supported path; it is not a guarantee.

## 6. Applebot: Spotlight, Siri, Safari, and Apple web answers

Apple states that Applebot-crawled data powers search across Spotlight, Siri, and Safari and can provide current context for AI-generated answers.

1. Ensure the wildcard `robots.txt` group allows `Applebot`, or add a complete Applebot-specific group if special handling is required.
2. Do not block required CSS, JavaScript, images, or XHR resources. Applebot may browser-render pages and warns that blocking those resources can prevent proper rendering.
3. Do not use `noindex` on public pages: Apple says it prevents the page from appearing in Spotlight or Siri Suggestions.
4. Do not use `nosnippet` if maximum answer visibility is desired: Apple says it suppresses descriptions and web answers and prevents tagged content from being used as current AI context.
5. If model-training consent differs from search consent, control `Applebot-Extended` independently. Disallowing `Applebot-Extended` does not prevent Applebot search inclusion.
6. Applebot ignores `crawl-delay`; do not depend on that directive.
7. If bot identity must be verified at the edge, use reverse DNS under `*.applebot.apple.com` with a forward lookup, or Apple's published CIDR JSON.

Apple also says that when no Applebot-specific rule exists but Googlebot is named, Applebot follows the Googlebot instructions. Prefer an intentional, tested rule instead of relying on fallback behaviour. The official general-site documentation provides crawler controls and an Applebot contact address, not a public Webmaster Tools-style submission console. [About Applebot, published June 11, 2026](https://support.apple.com/en-gb/119829)

## 7. OpenAI / ChatGPT search

OpenAI exposes three independent user agents relevant here:

- `OAI-SearchBot`: automatic discovery for ChatGPT search results. This is the search visibility control.
- `GPTBot`: potential training of OpenAI generative foundation models. This is a separate training control.
- `ChatGPT-User`: a user-triggered visit, not automatic crawling and not the control for Search inclusion; because it is user-triggered, `robots.txt` may not apply.

For maximum ChatGPT search discoverability:

1. Ensure `OAI-SearchBot` is allowed by `robots.txt`.
2. Ensure the CDN/WAF allows requests from OpenAI's current published ranges at `https://openai.com/searchbot.json`; use the maintained JSON, not a copied static IP list.
3. Keep pages public, canonical, internally linked, and textually understandable.
4. Avoid `noindex` on public pages. OpenAI notes that even if a disallowed page is found through another provider, a title/link may sometimes be surfaced; `noindex` is the control to suppress that, and the crawler must be allowed to fetch it to read the tag.
5. Wait approximately 24 hours after changing `robots.txt` for OpenAI systems to adjust.
6. Track ChatGPT referrals using `utm_source=chatgpt.com`, which OpenAI automatically adds to referral URLs.
7. Decide `GPTBot` training consent separately; allowing search does not require allowing training.

[OpenAI crawler overview](https://developers.openai.com/api/docs/bots) and [OpenAI publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)

OpenAI documents no public Search Console equivalent, sitemap submission form, or guaranteed inclusion workflow. Allowing `OAI-SearchBot` makes a public page eligible for discovery; it does not promise appearance for any query.

## 8. Recommended Payload/Vercel automation contract

The CMS and deployment pipeline should make indexing state explicit rather than infer it from the existence of a document.

### Publish transaction

```text
Payload document approved + published
|
+-- Production page renders successfully at canonical URL?
|   +-- No: fail release; do not notify engines
|   +-- Yes
|
+-- HTTP 200, index allowed, canonical correct, substantive content?
|   +-- No: fail release; do not notify engines
|   +-- Yes
|
+-- Add/update canonical URL and truthful lastmod in sitemap
|
+-- Purge/revalidate production cache
|
+-- Send one IndexNow add/update notification
|
+-- Log notification; verify in Bing IndexNow report
|
+-- For exceptional priority launch pages only:
    inspect live in Google and Bing, then request indexing once
```

### Unpublish/delete transaction

```text
Payload document unpublished/deleted
|
+-- Remove URL from sitemap
|
+-- If permanent replacement exists: 301/308 to closest true replacement
|   Otherwise: return 404 or 410
|
+-- Send one IndexNow deletion notification
|
+-- Do not redirect every removed URL to the homepage
```

### Required CI assertions

- `/robots.txt` returns `200`, contains the production sitemap URL, and does not disallow the canonical pages or rendering assets.
- `/sitemap.xml` returns valid XML and contains no draft, preview, redirect, non-`200`, `noindex`, or non-canonical URL.
- each priority URL returns `200` after redirects and emits one correct canonical;
- no production page emits accidental `noindex`/`X-Robots-Tag: noindex`;
- title, primary text, navigation links, and structured data exist in rendered HTML;
- HTTP and `www` variants permanently redirect to the canonical HTTPS host;
- Vercel Firewall/bot controls do not challenge or block verified Googlebot, Bingbot, Applebot, DuckDuckBot, or `OAI-SearchBot` traffic;
- IndexNow events are emitted only for successful production publish/update/delete state transitions.

## 9. Launch and ongoing operating cadence

### First 24 hours

1. Pass the production indexability gate and CI assertions.
2. Publish and validate `robots.txt` and `sitemap.xml`.
3. Verify the Google Search Console Domain property.
4. Submit the sitemap in Search Console.
5. Live-inspect the homepage and priority pages and request indexing once.
6. Import FairLend into Bing Webmaster Tools and confirm sitemap processing.
7. Configure and test the IndexNow key and one production notification.
8. Live-inspect the same priority set in Bing and run Site Scan.
9. Confirm Applebot, DuckDuckBot, and `OAI-SearchBot` are not intentionally blocked at robots/CDN/WAF layers.

### Days 2–14

- Daily: review Google Page indexing/Sitemaps and Bing Site Explorer/IndexNow for launch blockers.
- Inspect individual URLs only when a report provides an unexpected status.
- Confirm bot access in edge/server logs using official verification methods and maintained IP lists.
- Fix systemic templates first: accidental `noindex`, canonical disagreement, missing internal links, render failures, duplicate/thin templates, or firewall blocks.
- Do not mass-resubmit unchanged URLs.

### Thereafter

- Weekly during active growth: review Google and Bing impressions, priority-page index status, sitemap processing, IndexNow failures, and crawler error rates.
- Monthly: run Bing Site Scan; review Google Crawl Stats, Page indexing, Security issues, and Manual actions; compare canonical sitemap URLs against indexed/excluded classes.
- On every material production publication: update accurate `lastmod` and issue one IndexNow event automatically.
- Quarterly: audit crawler policy decisions for search versus model training and refresh any WAF allowlist from official machine-readable IP sources.

## 10. What not to do

- Do not pay an "indexing service" for guaranteed Google inclusion. Google says inclusion costs nothing and is never guaranteed.
- Do not use Google's Indexing API for ordinary mortgage/service/editorial pages. Google limits it to pages with `JobPosting` or livestream `BroadcastEvent` markup. [Google Indexing API limitations](https://developers.google.com/search/apis/indexing-api/v3/using-api?hl=en)
- Do not call Google's deprecated sitemap ping endpoint; it returns `404` and does nothing useful.
- Do not request Google indexing repeatedly for the same URL; it does not accelerate crawling.
- Do not treat sitemap submission, an IndexNow `200`, or a successful live inspection as proof of indexing.
- Do not expect every known URL to be indexed. Track intended canonical URLs, not a vanity 100% coverage number.
- Do not block a URL in `robots.txt` when the goal is removal from results; use authentication or an accessible `noindex`/proper removal flow.
- Do not block CSS/JavaScript/render resources required by Googlebot or Applebot.
- Do not submit redirects, tracking parameters, previews, drafts, search results, or thin location permutations.
- Do not fabricate sitemap `lastmod` timestamps on every request or deploy. Google may stop trusting them.
- Do not add `llms.txt`, special "AI schema," or other unofficial files expecting Google AI Overview inclusion; Google explicitly says they are not required.
- Do not conflate `GPTBot` with `OAI-SearchBot`, or `Applebot-Extended` with `Applebot`. Training and search controls are independent.
- Do not copy crawler IP ranges into permanent source code. Consume the platform-maintained JSON and verify identity as documented.

## 11. Evidence hierarchy for the operator

When deciding whether FairLend is indexed, use evidence in this order:

1. Google URL Inspection indexed result and Page indexing report for Google.
2. Bing URL Inspection and Site Explorer for Bing.
3. Search Console/Bing performance impressions and indexed-page data.
4. Verified crawler/server logs for discovery and fetching only.
5. Manual search queries as a spot check, never as the primary index-status database.

A crawler hit proves fetching, not indexing. An indexed status proves eligibility to appear, not ranking or guaranteed display for a particular user, place, device, or query.

