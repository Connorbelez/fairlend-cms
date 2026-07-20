# Payload + Vercel SEO implementation source notes

Research date: 2026-07-13  
Scope: the current `/Users/connor/Dev/fairlend-cms` implementation plus current official Payload, Next.js, Vercel, and Google documentation. The application was inspected read-only.

## Executive findings

The repository already contains a strong technical SEO base: Payload 3.82.1, the SEO and Redirects plugins, typed Page/Post metadata, canonical URL construction, Open Graph/Twitter metadata, draft/version support, scheduled publishing, dynamic XML sitemaps, cached redirects, ISR/on-demand revalidation, GA4/PostHog/advertising instrumentation, and Organization/Website/Article/Breadcrumb/FAQ JSON-LD.

It is **not launch-ready as an SEO operating system yet**. These are the material blockers:

1. **The intended production domain is not serving this application.** A live check on 2026-07-13 found `https://fairlend.ca/` returning `307 -> https://www.fairlend.ca/ -> /sign-in`, whose title is `FairLend - Location de maisons entre particuliers`. `robots.txt`, `sitemap.xml`, `pages-sitemap.xml`, and `posts-sitemap.xml` all returned 404. Do not verify Search Console, submit sitemaps, or start citation building until domain ownership/routing is corrected and the Payload site is actually deployed there.
2. **Draft preview is wired but the content query ignores Draft Mode.** The preview endpoint correctly requires both `PREVIEW_SECRET` and an authenticated Payload user, then enables Next.js Draft Mode (`fairlend-cms/src/app/(frontend)/next/preview/route.ts:21-56`). However, the Page and Post queries hard-code `draft: false` (`[slug]/page.tsx:98`, `posts/[slug]/page.tsx:126`), and the `LivePreviewListener` is not mounted anywhere. The current Preview/Live Preview UI cannot reliably show draft or unsaved agent output.
3. **The managed redirect frontend emits temporary redirects.** `PayloadRedirects` uses Next.js `redirect()` for every stored redirect (`src/components/PayloadRedirects/index.tsx`). Next.js documents that this produces 307, while `permanentRedirect()` produces 308. Published URL moves require a permanent one-hop redirect and status-aware frontend behavior ([Next.js redirect](https://nextjs.org/docs/app/api-reference/functions/redirect), [permanentRedirect](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect)).
4. **Two indexable static routes are absent from the page sitemap.** `/borrowers/institutional-mortgage` and `/terms` default to `index: true`, but neither appears in `staticIndexableRoutes` in `pages-sitemap.xml/route.ts:6-18`. Noindexed routes are correctly omitted. Replace the hand-maintained list with one canonical route registry or add a test that compares indexable route metadata with sitemap membership.
5. **Publishing automation is not yet implemented.** Payload `jobs.tasks` is empty (`src/payload.config.ts:117`). Vercel invokes `/api/payload-jobs/run` only once daily (`vercel.json`), so scheduled publish times and recurring SEO tasks can lag by almost 24 hours. Payload separates schedule handling from job execution on serverless platforms; both endpoints need secured cron invocations.
6. **Real-user Core Web Vitals collection is absent.** Neither `@vercel/speed-insights` nor its root-layout component is installed. Google recommends good LCP (<=2.5 s), INP (<200 ms), and CLS (<0.1), and Vercel Speed Insights provides field measurements for deployed routes ([Google CWV](https://developers.google.com/search/docs/appearance/core-web-vitals), [Vercel setup](https://vercel.com/docs/speed-insights/quickstart)).
7. **Structured data is useful but incomplete for authority/local SEO.** The root has Organization + FinancialService and WebSite; posts have BlogPosting and Breadcrumb; money-page FAQ blocks emit FAQPage. The organization graph lacks `logo`, `address`, and `sameAs`; BlogPosting lacks `author`. Google recommends applicable identity, real-world presence, online-presence, and article-author properties ([Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Article](https://developers.google.com/search/docs/appearance/structured-data/article)). FAQ markup is harmless but Google limits FAQ rich results mainly to authoritative government and health sites, so it should not be treated as a ranking lever ([FAQ change](https://developers.google.com/search/blog/2023/08/howto-faq-changes)).

## Current implementation inventory

### Payload content control plane

- `@payloadcms/plugin-seo` is installed and configured for Pages and Posts. It generates an editor title and preview URL (`src/plugins/index.ts:16-23,53-56`). The collections expose title, description, image, and preview fields (`src/collections/Pages/index.ts:100-124`; `Posts/index.ts:189-213`).
- Pages and Posts have versions, autosave, drafts, and scheduled publishing (`Pages/index.ts:140-148`; `Posts/index.ts:275-283`). Pages can render the `MoneyPageBlocks`; Posts have a dedicated `contentMode: moneyPage` contract with block validation.
- Page/Post access is `authenticated` for create/update/delete and `authenticatedOrPublished` for reads. Public frontend and sitemap queries correctly specify `overrideAccess: false` and `draft: false`.
- Vercel Postgres and Blob storage are configured. The Jobs run endpoint accepts either a logged-in user or `Authorization: Bearer $CRON_SECRET` (`src/payload.config.ts:101-117`).

### Metadata, robots, and sitemaps

- `buildFairlendMetadata` emits one absolute canonical, description, Open Graph, Twitter card, and index/follow or noindex/follow rules (`src/utilities/seo.ts:61-115`). It rejects localhost as the production canonical origin.
- Dynamic Payload routes call `generateMeta`, which uses Payload `meta` fields with title/description/image fallbacks and distinguishes article vs website metadata.
- `next-sitemap` generates `public/robots.txt` and a sitemap index at build time. Robots currently disallows `/admin/*` and advertises the sitemap index plus the two dynamic sitemaps (`next-sitemap.config.cjs`; generated `public/robots.txt`).
- Pages/Posts sitemap routes use absolute URLs; query only `_status: published`; set `draft: false` and `overrideAccess: false`; and cache with collection-specific tags. This matches Google's instruction to submit absolute canonical URLs that should appear in Search ([Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).
- Current dynamic sitemap queries use `limit: 1000`; add sitemap partitioning before either collection approaches 1,000 documents even though Google's protocol limit is 50,000 URLs. Otherwise later documents will silently disappear from this implementation.
- Canonical signals should agree: Google treats redirects and `rel=canonical` as strong signals and sitemap inclusion as weaker, stackable signals. Never publish a redirect target, HTML canonical, and sitemap URL that disagree ([Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).

### Rendering and cache invalidation

- Payload Page and Post routes are force-static with a 600-second fallback revalidation interval (`[slug]/page.tsx:16-17`; `posts/[slug]/page.tsx:20-21`).
- Publish/unpublish/delete hooks invalidate the document route and the corresponding sitemap tag (`revalidatePage.ts`; `revalidatePost.ts`). Next.js notes that `revalidatePath` invalidates a cached entry and regeneration occurs on the next request ([Next.js ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)).
- Current hooks do **not** invalidate `/posts`, paginated archives, service/location hubs, related-post consumers, header/footer modules, or pages whose internal-link blocks reference the changed document. Build explicit dependency tags and an integration test for every publishing side effect.
- Redirect documents are cached under a `redirects` tag and invalidated after change. The source collection is useful, but Payload's plugin only stores redirect rules; the application is responsible for emitting the correct HTTP behavior ([Payload Redirects plugin](https://payloadcms.com/docs/plugins/redirects)).

### Analytics and schema

- The root layout mounts the custom `AnalyticsProvider`. Configuration supports GA4, GTM, Google Ads, PostHog, LinkedIn, Meta, and Microsoft UET with consent required by default (`src/lib/analytics/config.ts`). Lead started/submitted/failed events and Google Ads conversion dispatch exist.
- The GA4 Measurement ID goes in `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Google says to verify receipt in Realtime after installing the web-stream tag ([GA4 setup](https://support.google.com/analytics/answer/14183469?hl=en)).
- Link the GA4 web stream to the verified Search Console property. This exposes organic queries and landing-page behavior; Google requires GA4 Editor permission and verified Search Console ownership ([GA4 + Search Console](https://support.google.com/analytics/answer/10737381?hl=en-EN)).
- Root JSON-LD includes Organization/FinancialService and WebSite; Payload Pages/Posts include BreadcrumbList; Posts include BlogPosting; service pages can emit Service; FAQ components emit FAQPage (`src/utilities/structuredData.ts`, `src/blocks/MoneyPage/Component.tsx`).
- Validate every template with Rich Results Test and generic schema.org validation. Google requires markup to describe visible, current page content and does not guarantee a rich result even when valid ([structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [testing tools](https://developers.google.com/search/docs/appearance/structured-data)).

## Payload agent-write safety contract

Do not give the SEO agent a raw Payload client. Put a narrow typed service in front of it, e.g. `createSeoDraft`, `updateSeoDraft`, `queueSeoAudit`, and `requestReview`.

Required controls:

1. Payload Local API defaults both `overrideAccess` and `overrideLock` to `true`. Every agent operation must pass `overrideAccess: false`, `overrideLock: false`, a least-privilege service `user`, and the existing `req` so access, locks, hooks, and transaction context behave as intended ([Payload Local API](https://payloadcms.com/docs/local-api/overview)).
2. Reject or strip caller-provided `_status`; set `_status: 'draft'` inside the trusted service. Payload explicitly documents that `data._status: 'published'` overrides `draft: true`, so `draft: true` is not a publication boundary ([Payload drafts](https://payloadcms.com/docs/versions/drafts#understanding-draft-parameter-and-status-field)).
3. Prefer valid drafts. `draft: true` may skip required-field validation unless `versions.drafts.validate` is enabled. Validate the complete typed money-page/page payload in the service even when Payload permits partial autosaves.
4. Pass a namespaced `context` containing the SEO run ID/source. Make every generation idempotent on `business + intent cluster + location + page type`; retries must update the intended draft instead of creating duplicates.
5. State machine: `researched -> brief-approved -> generated -> schema-validated -> draft-saved -> preview-QA -> human-approved -> published`. The service identity cannot execute the final transition.
6. The SEO plugin's generation callbacks are editor-click POST helpers, not lifecycle hooks, research hooks, or automatic metadata rendering. Do not hide unrestricted DataForSEO/LLM calls behind them. Any provider-backed button needs editor authorization, rate limits, budgets, caching, and audit logs ([Payload SEO plugin](https://payloadcms.com/docs/plugins/seo)).

## Jobs and schedules on Vercel

- Payload warns not to use `autoRun` on serverless infrastructure. Use external cron to call `/api/payload-jobs/handle-schedules` and `/api/payload-jobs/run` ([Payload Jobs Queue](https://payloadcms.com/docs/jobs-queue/overview#using-autorun-on-serverless-platforms)).
- Vercel automatically sends `CRON_SECRET` as `Authorization: Bearer ...`; it recommends a random value of at least 16 characters. Vercel Cron does not retry failures, so Payload workflows/tasks must own retry/idempotency behavior and alert on terminal failures ([Vercel Cron](https://vercel.com/docs/cron-jobs/manage-cron-jobs)).
- Use separate queues such as `seo-research`, `seo-generate`, `seo-audit`, and `seo-measure`. Serialize or supersede work per `collection/document/locale` to prevent concurrent rewrites.
- Run schedule handling at least every 5-15 minutes if editors expect scheduled publishing near the configured time. Run the worker often enough to drain within Vercel Function duration limits. Monitor queue age, failure count, provider spend, and draft throughput.

## Search and deployment control-plane setup

After the domain cutover passes the verification gate below:

1. Create a Google Search Console **Domain property** and verify it with DNS. A Domain property covers protocols and subdomains; Google generally recommends it when available ([Search Console property](https://support.google.com/webmasters/answer/34592?hl=en), [top tasks](https://support.google.com/webmasters/answer/10351509?hl=en)).
2. Submit the root `sitemap.xml` in Search Console. Submission is a hint, not an indexing guarantee, but the report exposes processing errors. For single urgent URLs use URL Inspection; for many URLs use the sitemap ([Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en), [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)).
3. Do **not** build a generic Google Indexing API integration. Google restricts it to `JobPosting` and `BroadcastEvent`/livestream pages ([Indexing API](https://developers.google.com/search/apis/indexing-api/v3/using-api?hl=en)).
4. Create one GA4 property/web stream, configure `NEXT_PUBLIC_GA_MEASUREMENT_ID`, verify Realtime, mark qualified lead submission as a key event, and link GA4 to Search Console.
5. Enable Vercel Speed Insights, install `@vercel/speed-insights`, mount `<SpeedInsights />` in the root layout, and monitor route-level field CWV. Current repository code does not do this ([Vercel Speed Insights](https://vercel.com/docs/speed-insights/quickstart)).
6. Vercel adds `X-Robots-Tag: noindex` to normal Preview and outdated Production deployment URLs. Verify it with `curl -I`. A custom domain assigned to a non-production branch does not get that default header, so explicitly emit `X-Robots-Tag: noindex` there ([Vercel preview indexing](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines), [response headers](https://vercel.com/docs/headers/response-headers)).
7. For local search, create/verify the Google Business Profile and keep business name, category, address/service area, phone, hours, and website consistent. Google says local results primarily use relevance, distance, and prominence; complete information, links, and reviews contribute ([Google local ranking](https://support.google.com/business/answer/7091?hl=en-en)).

## Deployment verification gate

Run this gate against the Vercel Preview URL first, then the final production hostname. A release fails if any required assertion fails.

### Preview deployment

- Build, lint, typecheck, integration tests, and Playwright tests pass.
- `curl -I $PREVIEW_URL/` shows `X-Robots-Tag: noindex` (or deployment protection blocks anonymous access).
- Authenticated Payload Preview shows the latest draft copy, metadata, blocks, links, and JSON-LD at mobile/tablet/desktop breakpoints without publishing it.
- Anonymous requests cannot read draft documents through REST, GraphQL, Local-API-backed frontend routes, sitemap routes, search, or previews.
- Generated content passes schema validation, internal-link validation, duplicate/cannibalization checks, title/description length policy, image-alt policy, and factual/compliance review.

### Production deployment

- Apex and `www` converge in one hop to the chosen canonical host using a permanent redirect; HTTPS is valid.
- The homepage and one Page, Post, and Money Page return 200 and emit exactly one self-referential absolute canonical; indexable pages have no `noindex` header/meta.
- `robots.txt`, `sitemap.xml`, `pages-sitemap.xml`, and `posts-sitemap.xml` return 200 XML/text and contain only production canonical URLs. Every sampled sitemap URL returns 200, is indexable, and self-canonicalizes.
- `/admin`, preview endpoints, search-results pages, intake/conversion endpoints, paginated archives, preview/staging hosts, and other non-search surfaces are noindex or protected as designed. Remember: a robots-disallowed URL cannot expose its page-level `noindex` to Google, because Google must crawl a page to read the meta directive ([Google robots meta](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)).
- Old slugs return a one-hop 308/301 to the new canonical. There are no chains, loops, 307s for permanent moves, redirected sitemap URLs, or internal links to redirects.
- Rich Results Test and Schema Markup Validator pass for Organization/FinancialService, WebSite, Breadcrumb, Article, Service, and applicable LocalBusiness markup. Structured data matches visible content.
- GA4 Realtime receives a consented page view and test lead; PostHog/Ads destinations receive only the events allowed by consent; no duplicate page views occur.
- Vercel Speed Insights is receiving production data. Search Console URL Inspection sees the expected rendered HTML, canonical, robots status, and schema.
- Publish a test draft, verify the document route plus every dependent hub/archive/internal-link surface updates, and confirm sitemap `lastmod` changes. Then unpublish/delete it and verify the old URL becomes 404 or redirects by policy and leaves the sitemap.
- Vercel Cron logs show both schedule handling and job execution returning success. Force one transient provider failure and verify retry/idempotency; confirm Vercel's lack of cron retries does not lose the workflow.

## Recommended implementation order

1. Fix domain/DNS/Vercel project assignment and confirm the Payload build on a protected Preview URL.
2. Repair Draft Mode queries and mount live-preview refresh; add anonymous draft-leak tests.
3. Add the narrow access-controlled agent draft service and human-only publish boundary.
4. Make redirect status explicit/permanent for slug moves; add loop/chain/404-target tests.
5. Replace or test the static sitemap registry, include all indexable routes, and add pagination before 1,000 docs.
6. Expand cache invalidation to archives, hubs, related content, and navigation.
7. Register Payload SEO tasks/workflows, secure both schedule/run endpoints, and increase cron frequency.
8. Complete identity/article/local schema; validate template output.
9. Enable GA4 + Search Console + Vercel Speed Insights and verify real events/field metrics.
10. Pass the complete Preview and Production deployment gates before submitting the sitemap or scaling page generation.

## Supporting Payload-only source memo

The focused official Payload 3.82.1 source review is in `.scratch/payload-seo-operator-official-sources.md`.
