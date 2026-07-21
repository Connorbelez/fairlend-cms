# FairLend technical SEO specialist lane

- Analyzed: `2026-07-15T01:31:11Z`
- Production origin: `https://www.fairlend.ca/`
- Requested URL: `https://fairlend.ca`
- Cached context used: `.seo-cache/site-meta.json` from `2026-07-14T21:38:27Z` for business classification only. All technical findings below were refreshed from production and supersede prior cached technical state.
- Business: Ontario online-first mortgage brokerage / mortgage administrator (financial YMYL)
- Crawl policy: `robots.txt` respected; bounded at 500 pages, one-second request delay; 55 discovered HTML URL variants exhausted the queue.

## Scores

| Area | Score | Status | Evidence summary |
|---|---:|---|---|
| Technical SEO | **85/100** | warn | Strong crawl/index/schema implementation; mobile performance and a few protocol/header details remain. |
| Crawlability | 98 | pass | Valid robots + sitemap; crawl queue completed; no errors or blocked public URLs. |
| Indexability | 95 | pass | All 17 indexable pages are 200, self-canonical, and in the sitemap. |
| Security | 80 | warn | HTTPS/TLS and major headers pass; CSP is report-only and HSTS is not preload-ready. |
| URL structure | 86 | warn | Canonical URLs are clean; HTTP apex takes two redirects and internal intake links create parameter variants. |
| Mobile | 88 | pass/warn | Viewport and Lighthouse SEO pass; mobile performance fails separately. |
| Core Web Vitals / performance | **56** | **fail** | Three-run mobile median: LCP 9.44s, TBT 394ms, CLS 0.00006. No field INP available. |
| Structured data | 98 | pass | 17/17 pages have parseable server-rendered JSON-LD; sampled Schema.org validator checks have zero errors/warnings. |
| JavaScript rendering | 92 | pass | Critical copy/tags/schema are in initial HTML; default and Googlebot bodies are identical in length. |
| IndexNow | 68 | warn/info | No implementation signal detected; optional for Bing-family discovery. |
| Sitemap | **100** | pass | 17 candidates, all 200/canonical/indexable; valid index + child files. |

## Executive result

There are **no critical indexing blockers** in the refreshed production state. The 17 indexable canonical pages are completely aligned with the sitemap, render SEO-critical content server-side, return 200, and expose valid schema. The dominant high-severity issue is throttled mobile performance: LCP remained between 8.9s and 9.6s across all three Lighthouse runs, with a median performance score of 56/100. CLS is excellent, but first-party JS/DOM/CSS volume and volatile main-thread work materially weaken LCP and interaction readiness.

## Findings by severity

### Critical

None observed.

### High — mobile LCP and main-thread execution

Three isolated Lighthouse 13.4.0 mobile runs (`simulate` throttling) produced:

| Run UTC | Performance | FCP | LCP | TBT | CLS | Main thread | JS execution |
|---|---:|---:|---:|---:|---:|---:|---:|
| 01:21:38 | 35 | 3.55s | 9.63s | 2,784ms | 0.00006 | 12.50s | 8.10s |
| 01:24:32 | 59 | 3.27s | 8.91s | 330ms | 0.00006 | 3.59s | 1.64s |
| 01:27:46 | 56 | 3.50s | 9.44s | 394ms | 0.00006 | 4.38s | 1.37s |
| **Median** | **56** | **3.50s** | **9.44s** | **394ms** | **0.00006** | **4.38s** | **1.64s** |

Desktop is also only 56/100: FCP 0.84s, LCP 2.35s, TBT 611ms, CLS 0, main-thread work 3.01s. LCP passes narrowly on desktop, but blocking time does not.

The stable payload from the third mobile run is 1.93 MB over 59 requests: 768 KB JS (21 requests), 734 KB images (24), 152 KB CSS (6), 149 KB document, and 129 KB fonts (5). Lighthouse estimates 383 KB unused JS and 119 KB unused CSS. The rendered DOM has 3,573 elements, depth 19, and 175 direct children on `body`. In the worst run, first-party chunk `/_next/static/chunks/36-7uqfsjqd4r.js` consumed 8.23s bootup time and generated a 3.26s long task; third-party transfer/main-thread cost was zero in these consent-state runs.

The LCP element is the Toronto skyline hero image. Lighthouse confirms it is initial-HTML discoverable, eager, and `fetchpriority="high"`, so the remaining win is not another preload: reduce homepage render/hydration cost, avoid delaying hero paint behind animation/state, shrink first-party chunks, defer below-fold interactive sections, remove unused CSS/JS, and simplify the 3,573-node DOM. Responsive image sizing/compression offers another measured ~87 KB mobile saving.

### High — document restart / redirect observed by Chrome

Every Lighthouse mobile trace records an initial same-URL `307` followed by the `200` document. The third run attributes 159ms to it (other runs were higher under throttling). The production response sends both `Accept-CH` and `Critical-CH: Sec-CH-Prefers-Color-Scheme`; the same-URL browser restart is consistent with Critical Client Hints negotiation. Confirm in a Chrome Network trace, then remove `Critical-CH` unless the server truly needs that hint before rendering. CSS `prefers-color-scheme` does not require a critical client hint.

### Medium — security policy is not enforced

HTTPS is enforced; the current Let's Encrypt certificate covers `fairlend.ca` and `*.fairlend.ca`, valid `2026-07-12` through `2026-10-10`. Responses include HSTS (`max-age=63072000`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive Permissions Policy. No active HTTP subresources were found across the 17 sitemap pages.

However, the content policy is only `Content-Security-Policy-Report-Only`, so it records violations but does not block them. The policy also permits `'unsafe-inline'` scripts/styles. Promote a tested policy to enforced `Content-Security-Policy` after reviewing `/api/csp-report` telemetry. HSTS lacks `includeSubDomains; preload`; `hstspreload.org` returned `status: unknown`. Add those directives only after confirming every subdomain is permanently HTTPS-capable.

### Medium — HTTP apex redirect chain

`http://fairlend.ca/` returns `308 Location: https://fairlend.ca/`, then `https://fairlend.ca/` returns `308 Location: https://www.fairlend.ca/`. Configure the HTTP apex to go directly to the canonical WWW HTTPS URL in one hop. `http://www.fairlend.ca/` already redirects directly to the canonical origin.

### Medium — contradictory 404 metadata

A nonexistent route correctly returns HTTP 404, but its initial HTML contains both `<meta name="robots" content="noindex">` and `<meta name="robots" content="index, follow">`, plus a homepage canonical. The non-200 status prevents normal indexing, but the directives are internally contradictory. Emit one `noindex, follow` directive on 404s and omit the homepage canonical (or use a self-referential URL only if the framework requires one).

### Low — parameter crawl surface is controlled but noisy

The link crawl visited 55 URL variants: 17 indexable canonical pages and 38 `noindex, follow` variants. Those 38 collapse to only `/intake` (37 variants including the base) and `/start/builder` (1). Every `/intake?...` URL canonicals to `/intake`; none appears in the sitemap. This is deliberate and safe at current scale, but query-string CTA tracking makes crawlers fetch many identical pages. Prefer event attributes/client-side analytics or a smaller normalized parameter set if the variant count grows.

### Low / informational — schema and sitemap refinements

- The homepage `FAQPage` is syntactically valid, but a commercial mortgage site should not expect Google FAQ rich results. Retaining it for semantic/AI uses is reasonable; do not report it as a Google SERP enhancement.
- The helper flagged `ContactPage` as missing `WebPage`; that is a false positive because `ContactPage` is a `WebPage` subtype. No implementation change is required.
- `posts-sitemap.xml` is valid but empty. Remove the empty child sitemap until the first post is indexable, or leave it as harmless generated overhead.
- No `priority` or `changefreq` tags are present. The 17 `lastmod` values use two dates (`2026-07-09`, `2026-07-14`), not a blanket identical timestamp.
- IndexNow was not found in HTML or robots. It is optional; add it only if faster Bing/Yandex discovery justifies the publishing integration.

## Crawlability, indexability, and rendering evidence

- `robots.txt`: HTTP 200; `Allow: /` for `*`, Googlebot, Bingbot, DuckDuckBot, Applebot, and OAI-SearchBot; blocks `/admin/`, `/api/`, `/next/preview`, `/exit-preview`; declares the sitemap index and both child sitemaps. GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot, and other unlisted agents inherit the permissive `*` group.
- Sitemap: valid `sitemapindex`; `pages-sitemap.xml` has 17 URLs; `posts-sitemap.xml` has 0; all 17 checked URLs return 200, do not redirect, are not noindex, and match their final canonical.
- Crawl: 55/500 pages, queue exhausted, depths 0–3, 55 status 200, no request errors. All indexable pages are within two clicks; only noindexed intake variants reached depth 3.
- Initial HTML: all 17 indexable pages have a canonical, one H1, an index/follow directive, and substantive server-rendered text. The homepage decoded HTML is 1,257,797 bytes and contains its title, description, canonical, robots, H1/body copy, and JSON-LD before JavaScript.
- Googlebot comparison: default and Googlebot fetches both return 200 with exactly 1,257,538 characters; no cloaking/dynamic-render branch detected. `X-Nextjs-Prerender: 1` confirms prerendering.
- Error handling: unknown routes return a real 404, not a soft 200.

## Structured-data evidence

All 17 sitemap pages were fetched and parsed with `analyze_schema.py`: 0 invalid JSON-LD blocks, no Microdata/RDFa dependency, and server-rendered types including `Organization`, `FinancialService`, `WebSite`, `Person`, `WebPage`, `ContactPage`, `Service`, `BreadcrumbList`, and homepage `FAQPage`. No deprecated types were detected; URLs and dates inspected were absolute/ISO-formatted; no placeholders were found.

The live Schema.org validator was POSTed the homepage and `/borrowers/private-mortgage-financing`; every returned node reported `numErrors: 0` and `numWarnings: 0` (67 and 46 node-result instances respectively). The graph uses stable absolute `@id` references, licensed principal-broker `Person`, service `provider`, `areaServed`, breadcrumbs, and a resolvable logo. Both regulatory `sameAs` URLs and the SVG logo returned 200.

## Prioritized implementation sequence

1. **Performance:** profile `chunks/36-7uqfsjqd4r.js`; remove/defer hydration and below-fold interaction work, reduce DOM, unused JS/CSS, and oversized images. Target mobile LCP <2.5s and TBT <200ms lab proxy.
2. **Critical-CH:** remove the same-URL navigation restart if `Sec-CH-Prefers-Color-Scheme` is not required server-side.
3. **Redirects:** make HTTP apex redirect directly to `https://www.fairlend.ca/`.
4. **404 metadata:** eliminate conflicting robots directives and homepage canonical on 404s.
5. **Security:** graduate CSP from report-only to enforced; separately evaluate HSTS subdomain/preload readiness.
6. **Crawl hygiene:** normalize intake tracking URLs if variant count grows; remove empty posts sitemap when convenient.

## Commands and data sources

Key commands (run from `/Users/connor/Dev/fairlend-cms`):

```text
python3 /Users/connor/.codex/skills/seo/scripts/fetch_page.py https://fairlend.ca --json
python3 /Users/connor/.codex/skills/seo/scripts/fetch_page.py https://www.fairlend.ca/ --googlebot --json
python3 /Users/connor/.codex/skills/seo/scripts/analyze_sitemap.py https://www.fairlend.ca/ --check-limit 500 --json
python3 .seo-cache/work/crawl_fairlend.py
python3 /Users/connor/.codex/skills/seo/scripts/analyze_schema.py <each sitemap URL> --json
curl -X POST --data-urlencode 'url=https://www.fairlend.ca/' https://validator.schema.org/validate
npx --yes lighthouse@latest https://www.fairlend.ca/ --form-factor=mobile --throttling-method=simulate --output=json
npx --yes lighthouse@latest https://www.fairlend.ca/ --preset=desktop --throttling-method=simulate --output=json
python3 /Users/connor/.codex/skills/seo/scripts/google_auth.py --check
python3 /Users/connor/.codex/skills/seo/scripts/pagespeed_check.py https://www.fairlend.ca/ --json
python3 /Users/connor/.codex/skills/seo/scripts/crux_history.py https://www.fairlend.ca/ --json
openssl s_client -servername www.fairlend.ca -connect www.fairlend.ca:443 | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
curl 'https://hstspreload.org/api/v2/status?domain=fairlend.ca'
```

Raw evidence is under `.seo-cache/work/raw/`, notably:

- `internal-crawl.json`, `internal-crawl-summary.json`
- `sitemap-analysis.json`, `pages-sitemap.xml`, `posts-sitemap.xml`
- `schema-sitewide.json`, `schema-validator-home.html`, `schema-validator-service.html`
- `lighthouse-mobile.json`, `lighthouse-mobile-2.json`, `lighthouse-mobile-3.json`, `lighthouse-mobile-summary.json`, `lighthouse-desktop.json`
- `homepage.html`, `homepage-headers.txt`, `redirect-headers-matrix.txt`, `404.html`, `404-headers.txt`
- `pagespeed-check.json`, `crux-history.err`, `hsts-preload.json`

## Limitations

- No Google API credentials were configured. The keyless PageSpeed endpoint returned HTTP 429, and CrUX History requires an API key; therefore no field LCP/INP/CLS or 75th-percentile CWV assessment is available. **INP is reported as unavailable and was not inferred from TBT.**
- Lighthouse is lab data and varied materially on TBT/main-thread work, so three mobile trials are reported with a median rather than presenting one run as field truth.
- The 55-URL crawl follows links present in initial HTML. A browser-only route invisible to raw HTML could be absent, although the identical Googlebot/default responses and complete SSR content materially reduce that risk.
- Schema.org Validator checks were performed on the homepage and one representative service page; all 17 pages received local JSON syntax/type checks.
- Findings are point-in-time production observations from `2026-07-15T01:20Z`–`01:31Z`.
