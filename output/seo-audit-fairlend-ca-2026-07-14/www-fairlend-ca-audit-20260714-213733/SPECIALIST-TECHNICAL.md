# FairLend Technical SEO, Sitemap, Schema & Performance Audit

**Target:** https://www.fairlend.ca/  
**Verified:** 2026-07-14 (America/Toronto)  
**Scope:** live robots/sitemaps, 17 sitemap URLs, 54 unique internal URLs, redirects, canonical/indexability signals, response security, server-rendered structured data, and fresh Lighthouse lab runs.

## Scores

| Area | Score | Status | Basis |
|---|---:|---|---|
| Technical SEO | **80/100** | Needs improvement | Strong crawlability, indexability, canonical hygiene, SSR, HTTPS and internal-link integrity; reduced by security-header gaps, one redirect chain, mobile performance, incomplete sitemap freshness data, and unverified IndexNow support. |
| Schema / structured data | **90/100** | Strong | Valid server-rendered JSON-LD across all 17 sitemap URLs with Organization/FinancialService and WebSite coverage, plus BreadcrumbList, Service and ContactPage where appropriate; page-entity coverage is incomplete and homepage FAQ markup is not Google-rich-result eligible. |
| Performance | **39/100** | Poor | Fresh Lighthouse: mobile 33–35/100 and desktop 56/100. Mobile LCP and main-thread blocking are the dominant risks. No CrUX field data was available, so CWV pass/fail and INP cannot be determined. |

### Technical category detail

| Category | Score | Evidence summary |
|---|---:|---|
| Crawlability | 96 | `robots.txt` is valid, permits public content, and references the sitemap index and child sitemaps. No broken internal URLs were found in the tested graph. |
| Indexability | 92 | All 17 sitemap URLs return 200, declare `index, follow`, and self-canonicalize. Four linked non-sitemap routes intentionally declare `noindex, follow`; intent should be confirmed. |
| Security | 56 | HTTPS/TLS and HSTS are present; CSP, X-Frame-Options, X-Content-Type-Options and Referrer-Policy are absent. |
| URL/redirect structure | 88 | Canonical host is consistent; only `http://fairlend.ca/` takes two redirects to the final URL. |
| Mobile technical setup | 78 | Responsive viewport is present and the page renders at mobile sizes, but severe mobile lab performance lowers practical mobile readiness. |
| Performance/CWV evidence | 39 | Poor lab LCP/TBT; no field INP or 75th-percentile CWV data. |
| Structured data | 90 | Broad, parseable JSON-LD coverage with two material opportunities described below. |
| JavaScript rendering | 95 | Critical title, description, robots, canonical, H1/content and JSON-LD are present in the initial HTML response. |
| IndexNow | 60 | No public implementation signal was detected; server-side submission cannot be proven externally. This does not affect Google indexing. |

## Executive technical finding

There is **no verified crawl or indexation blocker**. The canonical production URL returns 200, public content is allowed, the sitemap inventory is clean, and critical SEO content is server-rendered. The primary technical ranking risk is mobile performance, followed by defense-in-depth response-header gaps. Sitemap freshness and schema page-entity coverage are optimization issues, not blockers.

## Verified evidence

### Crawlability, robots and AI crawlers

- [`https://www.fairlend.ca/robots.txt`](https://www.fairlend.ca/robots.txt) returns **200**, `text/plain`, and allows `/` for `*`, Googlebot, Bingbot, DuckDuckBot, Applebot and OAI-SearchBot. It blocks `/admin/`, `/api/`, `/next/preview` and `/exit-preview`.
- The wildcard policy means GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot and other unspecified agents are not blocked. OAI-SearchBot is also explicitly allowed.
- Robots references [`sitemap.xml`](https://www.fairlend.ca/sitemap.xml), [`pages-sitemap.xml`](https://www.fairlend.ca/pages-sitemap.xml), and [`posts-sitemap.xml`](https://www.fairlend.ca/posts-sitemap.xml). Referencing both the index and its children is redundant but harmless.
- The non-standard `Host:` directive is ignored by Google and is harmless; host consolidation is correctly enforced by redirects and canonicals.
- A crawl of **54 unique internal URLs** found **0 non-200 responses** and **0 internal redirect links**. Thirty-five query-string CTA URLs resolve directly and canonicalize to `/intake`.

### Sitemap integrity and coverage

- [`sitemap.xml`](https://www.fairlend.ca/sitemap.xml) is valid XML and is a sitemap index containing the two expected child sitemaps.
- `pages-sitemap.xml` contains **17 HTTPS URLs**. Every URL returned **200**, had no redirect hop, declared `index, follow`, and emitted a matching self-canonical.
- `posts-sitemap.xml` is valid but empty. This is acceptable while there are no published post detail URLs; `/posts` itself is in the pages sitemap.
- No sitemap URL is redirected, non-canonical, noindexed, HTTP, broken, or over the protocol limit. No deprecated `<priority>` or `<changefreq>` fields are used.
- Live link discovery found four canonical routes not in the sitemap: `/cmhc-mli-select-multiplex-financing`, `/intake`, `/resources/construction-draws-small-builders`, and `/start/builder`. All four return 200 but declare **`noindex, follow`**, so their sitemap exclusion is technically correct. Confirm that the two content-like routes (`/cmhc-mli-select-multiplex-financing` and `/resources/construction-draws-small-builders`) are intentionally withheld from search.
- Freshness metadata is weak: only the homepage has `<lastmod>` (`2026-06-20T17:21:55.515Z`); **16/17 URLs have no `<lastmod>`**. Missing values are valid XML but reduce recrawl hints.

### Redirects, canonicals and indexability

- `https://www.fairlend.ca/` returns **200** with `index, follow` and canonical `https://www.fairlend.ca` (the slash difference is a normalized root-URL equivalent).
- `http://www.fairlend.ca/` redirects once (308) to the canonical HTTPS URL.
- `https://fairlend.ca/` redirects once (308) to the canonical HTTPS/www URL.
- `http://fairlend.ca/` takes two permanent redirects: HTTP apex → HTTPS apex → HTTPS/www. Collapse this to one hop.
- A random missing path returns a true **404**, not a soft 200 error page.
- Critical SEO elements are rendered in the initial response: title, meta description, robots, canonical, viewport, page content and JSON-LD. The homepage HTML response is large (about **1,005,628 uncompressed bytes**), but search engines do not depend on client-side JavaScript to discover the primary content.
- No hreflang is emitted. This is correct if the site targets only English Canada and has no alternate language/region URLs.

### HTTPS and response security

- TLS negotiates **TLS 1.3** using `TLS_AES_128_GCM_SHA256`; the observed certificate covers `fairlend.ca` and `*.fairlend.ca` and was valid from 2026-07-12 through 2026-10-10.
- `Strict-Transport-Security: max-age=63072000` is present.
- Missing on the homepage response: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- HSTS lacks `includeSubDomains` and `preload`. Only add those after confirming every subdomain is HTTPS-ready.
- `X-Powered-By: Next.js, Payload` exposes implementation details. Removing it is low-effort hardening, though it is not a direct ranking factor.

### Structured data

All 17 sitemap pages serve parseable JSON-LD in the initial HTML. No JSON syntax errors, placeholder values, non-HTTPS contexts, or relative top-level URLs were detected.

| Type | Pages detected | Assessment |
|---|---:|---|
| `Organization` + `FinancialService` | 17 | Strong reusable entity node with stable `@id`, name, legal name, URL, logo, telephone, email, hours, area served, contact point and licence-profile `sameAs` URLs. |
| `WebSite` | 17 | Correctly links the publisher to the organization node. |
| `BreadcrumbList` | 13 | Valid absolute item URLs and sequential positions on applicable interior pages. |
| `Service` | 9 | Includes name, description, URL, provider, area served and service type. |
| `ContactPage` | 1 | Correctly links `/contact` to the organization entity. |
| `FAQPage` | 1 | Syntactically valid and corresponds to visible homepage questions, but FairLend is not an eligible government/health authority for Google FAQ rich results. Treat as GEO/semantic markup only. |

Schema opportunities:

1. Add a stable `WebPage` node (or the appropriate subtype) to the homepage and standard interior pages, link it via `isPartOf` to `#website`, and link `about`/`mainEntity` to `#organization` or the page’s primary service. The contact page already models this pattern with `ContactPage`.
2. Do not pitch the homepage `FAQPage` as a Google rich-result tactic. Keeping it is informational/AI-search oriented; removal is not required.
3. Run the deployed graph through Schema.org Validator and Google Rich Results Test after changes. This audit validates syntax and core properties but does not substitute for Google’s live renderer.

## Performance evidence

### Fresh Lighthouse lab results

| Profile | Performance | FCP | LCP | CLS | TBT | Speed Index | Transfer / requests |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile, simulated throttling | **33/100** | 3.22 s | **10.89 s** | 0.000 | **3.10 s** | 7.00 s | 2.28 MB / 73 |
| Desktop, simulated throttling | **56/100** | 1.13 s | **2.95 s** | 0.004 | **425 ms** | 2.96 s | 2.67 MB / 111 |

A second fresh mobile diagnostic run scored **35/100**, confirming that the poor score is repeatable even though exact lab timings vary.

Key diagnostics:

- The mobile LCP element is the Toronto skyline hero image (`toronto-skyline-waterfront-16x10.webp`). It is already discoverable in initial HTML, eagerly loaded, dimensioned, and marked `fetchpriority="high"`; discovery is not the primary problem.
- Main-thread work was approximately **12.2 s** in the 33/100 mobile run. The current `36-7uqfsjqd4r.js` deployment chunk accounted for about **7.77 s** of boot-up work and produced a **2.69 s** long task in the diagnostic run. Map this hashed chunk back to source with the production bundle analyzer/source maps before changing code.
- Lighthouse identified roughly **92–94 KB of unused JavaScript** in the tested mobile load. One ~97.5 KB chunk was about 71% unused; the large long-task chunk was about 33% unused.
- The largest single transfer was the below-fold footer image `assets/footer/fairlend-toronto-waterfront.webp` at about **518 KB**. The compressed HTML document was about **121 KB transferred**, while the decoded HTML measured about 1.0 MB.
- No material third-party script cost appeared in Lighthouse; the bottleneck is first-party payload, rendering and hydration work.

**Field-data boundary:** PageSpeed Insights returned HTTP **429 quota exceeded** for both mobile and desktop. No Google credentials or CrUX data were available. Therefore:

- **INP is unknown.** TBT is shown only as a lab responsiveness proxy and is not relabelled as INP.
- **CWV pass/fail is unknown** because Google evaluates LCP, INP and CLS at the 75th percentile of real user visits.
- Fresh lab CLS was stable, but that does not prove field CLS passes.

## Severity-ranked issues

### Critical

None verified. There is no crawl, HTTPS, canonical, robots, sitemap, or indexability failure blocking the site.

### High — fix within one week

1. **Mobile performance is poor:** Lighthouse 33–35/100, with a measured 10.89 s mobile lab LCP and 3.10 s TBT. Reduce first-party main-thread/hydration work, split or defer the source behind the current `36-7uqfsjqd4r.js` chunk, and preserve server-rendered content.
2. **Security headers are incomplete:** add a tested CSP (start in report-only mode), `X-Content-Type-Options: nosniff`, a restrictive `Referrer-Policy`, and framing protection via CSP `frame-ancestors` and/or `X-Frame-Options`. Add `Permissions-Policy` appropriate to used browser features. This is primarily security hardening, not a direct ranking lever.

### Medium — fix within one month

1. **Heavy initial page payload:** optimize/lazy-load the ~518 KB footer image, audit why below-fold assets are requested on initial load, reduce the ~121 KB compressed/1.0 MB decoded document, and remove unused client JavaScript.
2. **Sitemap modification dates are incomplete:** source accurate CMS modification timestamps for all canonical indexable pages. Do not stamp every URL with the build time.
3. **Two content-like routes are `noindex`:** confirm whether the CMHC MLI Select and construction-draw guide pages are intentionally excluded. If they should rank, first complete their on-page content/H1/schema, switch to `index, follow`, and then add them to the sitemap.
4. **Page entity schema is incomplete:** add linked `WebPage` nodes to the homepage and standard content/service pages.

### Low / backlog

1. Collapse `http://fairlend.ca/` to one direct 308/301 hop to `https://www.fairlend.ca/`.
2. Remove `X-Powered-By`; consider HSTS `includeSubDomains; preload` only after subdomain validation.
3. IndexNow support was not publicly detectable. Add authenticated IndexNow submission for Bing-compatible engines if rapid non-Google discovery matters; absence does not affect Google.
4. Keep the empty posts sitemap only if it is automatically populated when posts publish; otherwise omit it until needed.

## Quick wins

1. Lazy-load and recompress `assets/footer/fairlend-toronto-waterfront.webp`; target a substantially smaller responsive source for mobile.
2. Use the Next.js bundle analyzer/source maps to identify `36-7uqfsjqd4r.js`, then defer non-critical animation/interaction code and dynamically import below-fold interactive sections.
3. Add `X-Content-Type-Options`, `Referrer-Policy`, framing protection and a CSP report-only policy at the platform layer.
4. Populate accurate sitemap `<lastmod>` values from CMS `updatedAt` data.
5. Add `WebPage` entity nodes while retaining the existing Organization/FinancialService, WebSite, Service and breadcrumb graph.
6. Point HTTP apex directly to the canonical HTTPS/www URL.

## Conflicts with baseline artifacts

1. The cached performance record and `lighthouse.json` report **35/100, LCP 4.15 s, INP 500 ms and CLS 0.310**, but the cache declares `data_source: heuristic`. Inspection of the installed fallback shows those values are formulas derived from HTML bytes, script count and missing image dimensions—not browser measurements. They must not be presented as CWV or lab results. Fresh browser Lighthouse results above replace them for lab evidence.
2. The cached claim “all sitemap lastmod values are identical” is inaccurate. Live XML shows one homepage `<lastmod>` and no `<lastmod>` on the other 16 URLs.
3. The baseline classifies the site as `publisher` / `media`; live content, title/description and the deployed `FinancialService` organization graph identify it as a mortgage/real-estate financing service. Scoring and conditional specialist selection should use the latter.

## Limitations

- No Google Search Console URL Inspection, GA4, CrUX, or PageSpeed API data was available. PSI attempts were quota-blocked with 429 responses.
- Lighthouse is controlled lab evidence and varies between runs; it does not establish field CWV status. Two mobile scores and one desktop score were captured to reduce single-run error.
- INP cannot be measured by a navigation-only Lighthouse run and was not inferred from TBT.
- Schema checks cover source visibility, JSON parsing, graph consistency and core properties; Google rich-result eligibility should be rechecked with Google’s live testing tool after deployment changes.
- IndexNow submissions are server-side and cannot be conclusively detected from public page responses.
- Security-header findings were sampled on the canonical homepage response; platform configuration should be verified across HTML, API, asset and error routes before rollout.
