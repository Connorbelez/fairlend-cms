# FairLend CMS SEO Optimization Audit

Audit date: 2026-07-08  
Repository: `/Users/connor/Dev/fairlend-cms`  
Stack reviewed: Next.js App Router, Payload CMS, Tailwind, ShadCN, `next-sitemap`

## Scope

This audit reviewed the local source code, not a rendered production crawl. It focused on:

- Site metadata, canonical tags, Open Graph, Twitter cards, robots directives, sitemap generation, and structured data.
- App Router routes under `src/app/(frontend)`.
- Payload CMS SEO configuration for Pages and Posts.
- Public SEO assets under `public/`.
- Technical SEO risks visible in source, including URL generation, crawler directives, social image defaults, and production leakage.

No build, Playwright, Lighthouse run, or live crawl was executed, in line with the project instruction not to run tests or builds for landing/marketing work.

## External References Used

- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central robots.txt guide: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Google Search Central sitemap guide: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Next.js Metadata and OG Images docs: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js robots.txt metadata file docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- Next.js sitemap metadata file docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

## Executive Summary

FairLend has a strong SEO base in one respect: most hardcoded route files define a `metadata` export, the site has robots and sitemap files, Payload SEO fields are enabled, and the home page includes FAQ JSON-LD through `FairlendFaqSection`.

The current implementation is still leaking major template defaults and is missing several high-impact SEO primitives:

- Dynamic CMS pages and posts can still publish titles like `Payload Website Template`.
- Global Open Graph defaults still identify the site as `Payload Website Template`.
- Global Twitter metadata still uses `@payloadcms`.
- The default social image is `public/website-template-OG.webp`.
- The frontend layout includes a live local development script from `http://localhost:8400/live.js`.
- Route-level Open Graph and Twitter metadata are not customized on any audited route.
- Dynamic CMS pages and posts do not emit explicit canonical URLs.
- The home page, posts listing, search page, and intake page are missing explicit canonicals.
- Structured data is thin: FAQPage exists on the home page, but Organization, FinancialService, WebSite, BreadcrumbList, Service, Article/BlogPosting, and LocalBusiness-style entity markup are missing.
- The sitemap architecture is split between static files, `next-sitemap`, and dynamic route handlers; several hardcoded App Router marketing routes are at risk of being omitted from submitted sitemaps.
- Metadata quality is inconsistent: several titles are too long, several descriptions are missing, and key commercial pages do not have page-specific social preview images.

The highest-return fix is not content volume. It is cleaning the technical metadata layer so every indexable URL has the correct brand, canonical, social metadata, sitemap inclusion, and schema. After that, FairLend should expand topical coverage around Ontario private mortgage financing, GTA multiplex financing, construction draw financing, garden suites, bridge financing, and investor/private lending trust signals.

## Implementation Status

Code-actionable audit items were addressed on 2026-07-08:

- Replaced Payload template SEO defaults with FairLend-specific metadata defaults.
- Removed the frontend `localhost:8400` live script from the production layout.
- Added shared FairLend metadata helpers for title, description, canonical URL, Open Graph, Twitter, robots, and canonical origin handling.
- Added a generated branded Open Graph image endpoint at `/opengraph-image`.
- Added sitewide Organization/FinancialService and WebSite JSON-LD.
- Added Service and BreadcrumbList JSON-LD to the main commercial service routes.
- Added BreadcrumbList JSON-LD to dynamic Payload pages.
- Added BreadcrumbList and BlogPosting JSON-LD to dynamic Payload posts.
- Added explicit canonicals and social metadata through the shared helper for all frontend routes.
- Classified thin/utility routes as `noindex, follow`.
- Removed noindex routes from static sitemap coverage.
- Added explicit sitemap coverage for intended indexable hardcoded public routes.
- Replaced template seed content that could reintroduce `Payload Website Template`.

Validation completed:

- `pnpm exec tsc --noEmit --project tsconfig.next.json` passed.
- Static leakage scan found no `Payload Website Template`, `website-template-OG.webp`, `localhost:8400`, or exact standalone `@payloadcms` social metadata leakage.
- Static route audit found 20/20 frontend routes using the shared metadata path.
- Static sitemap audit found every intended indexable hardcoded route included, with no noindex routes included.

Remaining non-code items:

- Submit and monitor the sitemap index in Google Search Console after deployment.
- Review legal/licensing wording before expanding Organization/FinancialService schema with regulator identifiers or licence-specific claims.
- Create richer service-specific OG art if the generated default card is not enough for campaign use.
- Build the recommended content clusters, case studies, author profiles, and compliance-reviewed educational pages.

## Priority Findings

### P0: Payload template branding is still in SEO metadata

Evidence:

- `src/utilities/mergeOpenGraph.ts` sets:
  - `description: 'An open-source website built with Payload and Next.js.'`
  - `siteName: 'Payload Website Template'`
  - `title: 'Payload Website Template'`
  - image: `/website-template-OG.webp`
- `src/utilities/generateMeta.ts` appends `| Payload Website Template` to dynamic document titles.
- `src/plugins/index.ts` uses the same `Payload Website Template` title generator for Payload SEO preview generation.
- `src/app/(frontend)/layout.tsx` sets `twitter.creator` to `@payloadcms`.
- `public/website-template-OG.webp` is the only obvious global OG asset.

Impact:

- CMS-driven pages and posts can show the wrong brand in search snippets, social previews, link unfurls, and browser tabs.
- Social sharing can present FairLend as a generic Payload template.
- This undercuts trust for a regulated financial services business.

Fix:

- Replace every `Payload Website Template` SEO default with FairLend-specific naming.
- Suggested default title:
  - `FairLend Mortgage`
- Suggested title template:
  - `%s | FairLend Mortgage`
- Suggested default description:
  - `FairLend helps Ontario borrowers, builders, partners, and private mortgage investors structure clear real-estate financing options.`
- Replace `twitter.creator: '@payloadcms'` with a real FairLend handle, or remove it if no official handle exists.
- Replace `website-template-OG.webp` with a branded 1200x630 FairLend social image.
- Update Payload SEO `generateTitle` and `generateMeta` together so CMS admin previews and production metadata match.

### P0: A localhost live script is present in the frontend layout

Evidence:

- `src/app/(frontend)/layout.tsx` includes:
  - `<Script src="http://localhost:8400/live.js" strategy="afterInteractive" />`
  - Comments: `impeccable-live-start` and `impeccable-live-end`

Impact:

- If shipped to production, browsers will try to request a local development script.
- This can create console errors, delay main-thread work, create a mixed-content/security smell, and look unprofessional in technical audits.
- Search engines will still render the page, but avoidable script failures are a technical quality issue.

Fix:

- Remove the script entirely, or gate it behind a strict development-only condition.
- Do not leave local tooling scripts in production layout files.

### P0: Hardcoded marketing routes may be missing from submitted sitemaps

Evidence:

- `public/sitemap.xml` is a sitemap index pointing only to:
  - `https://fairlend.ca/pages-sitemap.xml`
  - `https://fairlend.ca/posts-sitemap.xml`
- `src/app/(frontend)/(sitemaps)/pages-sitemap.xml/route.ts` includes:
  - `/search`
  - `/en/brokerage/privacy-policy`
  - `/posts`
  - published Payload `pages` documents
- `src/app/(frontend)/(sitemaps)/posts-sitemap.xml/route.ts` includes published Payload posts.
- `next-sitemap.config.cjs` excludes `/*` and `/posts/*`, which means generated static route discovery is intentionally suppressed:
  - `exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*']`

Hardcoded routes found in source include:

- `/`
- `/affordable-sustainable-rental-housing`
- `/borrowers/private-mortgage-financing`
- `/cmhc-mli-select-multiplex-financing`
- `/construction-draw-financing`
- `/garden-suite-financing-gta`
- `/garden-suite`
- `/intake`
- `/investing/private-mortgage-lending`
- `/multiplex-financing-gta`
- `/partners`
- `/resources/construction-draws-small-builders`
- `/start/builder`

Impact:

- If these hardcoded App Router pages are not duplicated as published Payload Pages, they are not discoverable through the submitted sitemap index.
- Google can still discover them via internal links, but sitemap coverage should be complete for commercial service pages.
- Missing sitemap inclusion slows discovery and weakens operational visibility in Search Console.

Fix:

- Make one canonical sitemap source of truth.
- Recommended: create an App Router `sitemap.ts` or keep the dynamic sitemap route handlers, but explicitly include all hardcoded indexable routes.
- Keep the sitemap index if desired, but ensure every indexable URL appears in exactly one child sitemap.
- Exclude only true non-indexable routes, such as admin, previews, API endpoints, QR redirect routes, and internal utility pages.

### P1: Canonical coverage is incomplete

Confirmed missing explicit canonicals in route files:

- `/`
- `/[slug]`
- `/posts/[slug]`
- `/posts`
- `/posts/page/[pageNumber]`
- `/search`
- `/intake`
- `/fairlend-landing-hero`

Routes with explicit canonicals:

- `/affordable-sustainable-rental-housing`
- `/borrowers/private-mortgage-financing`
- `/cmhc-mli-select-multiplex-financing`
- `/construction-draw-financing`
- `/en/brokerage/privacy-policy`
- `/garden-suite-financing-gta`
- `/garden-suite`
- `/investing/private-mortgage-lending`
- `/multiplex-financing-gta`
- `/partners`
- `/resources/construction-draws-small-builders`
- `/start/builder`

Impact:

- Canonicals are especially important for Payload dynamic pages, paginated blog indexes, and URLs that could appear with tracking parameters.
- Missing canonical metadata makes duplicate URL consolidation less explicit.

Fix:

- Add `alternates: { canonical: '/' }` to the home page metadata.
- Add canonical generation to `generateMeta` for Payload Pages and Posts.
- For posts, canonical should be `/posts/${slug}`.
- For Payload pages, canonical should be `/` for `home`, otherwise `/${slug}`.
- For paginated posts, canonical should usually be the page URL itself unless intentionally consolidated.
- Add `robots: { index: false, follow: true }` to `/search` if it is meant as internal search only.

### P1: Route-level Open Graph and Twitter metadata are not customized

Audit result:

- 20 frontend route files reviewed.
- 0 route files define route-specific `openGraph`.
- 0 route files define route-specific `twitter`.
- Global Open Graph exists, but it currently uses template defaults.

Impact:

- Social previews are generic or wrong.
- Shared links to commercial pages do not reinforce the exact service, location, or offer.
- Google and other consumers get less page-specific context.

Fix:

- Define a small `buildFairlendMetadata()` utility that standardizes:
  - title
  - description
  - canonical
  - Open Graph title
  - Open Graph description
  - Open Graph URL
  - Open Graph image
  - Twitter card
  - optional robots directive
- Use that utility for both hardcoded routes and Payload-generated metadata.
- Create one branded default OG image and at least service-specific OG images for:
  - private mortgage financing
  - construction draw financing / DrawFlow
  - multiplex financing
  - garden suite financing
  - investor private mortgage lending
  - partner program

### P1: Structured data is underbuilt

Current state:

- The home page imports `FairlendFaqSection`.
- `src/components/FairlendFaqSection/index.tsx` emits JSON-LD.
- `src/components/FairlendFaqSection/data.ts` defines a `FAQPage`.
- No other source-level `schema.org` or `application/ld+json` usage was found in the frontend route layer.

Impact:

- Search engines get limited entity clarity about FairLend as a business.
- Service pages do not declare the service, area served, provider, or page breadcrumbs.
- Blog posts do not emit Article/BlogPosting schema.
- The site misses trust signals that matter for financial services queries.

Fix:

Add a structured data layer with reusable helpers:

- `Organization` or `FinancialService`
  - Legal name: FairLend Management Inc., if that is the correct legal entity.
  - Brand name: FairLend Mortgage.
  - URL: `https://fairlend.ca`
  - Logo.
  - Contact phone and email.
  - Service area: Ontario, Greater Toronto Area, Toronto, depending on compliance review.
  - SameAs links for verified social and regulator profiles.
  - Licensing reference, if appropriate and compliant.
- `WebSite`
  - Site name and URL.
  - Optional `SearchAction` only if public search results are intended to be indexable and stable.
- `BreadcrumbList`
  - Service pages, posts, category pages, and nested content.
- `Service`
  - Private mortgage financing.
  - Construction draw financing.
  - Multiplex financing.
  - Garden suite financing.
  - Investor private mortgage lending.
  - Partner program.
- `Article` or `BlogPosting`
  - Posts should include headline, description, image, author, datePublished, dateModified, publisher, and canonical URL.
- Keep `FAQPage` only where the visible FAQ content exactly matches the JSON-LD.

### P1: Dynamic CMS metadata needs FairLend-specific fallbacks

Evidence:

- Pages and Posts collections include Payload SEO fields.
- Dynamic pages call `generateMeta`.
- `generateMeta` uses `doc?.meta?.description`, `doc?.meta?.image`, and `doc?.meta?.title`, but falls back to Payload template values.
- The Payload SEO plugin preview generator in `src/plugins/index.ts` also uses Payload template defaults.

Impact:

- Any CMS page or post without manually filled SEO fields can publish poor metadata.
- Admin previews can look acceptable to editors while production metadata still has incomplete canonical/social values.

Fix:

- Add FairLend-specific fallback generation:
  - title fallback: document title plus FairLend brand.
  - description fallback: excerpt from hero/body content, or a required SEO description field before publish.
  - image fallback: branded default OG image.
  - canonical fallback: derived from collection and slug.
- Add validation or admin guidance for SEO fields:
  - title length target.
  - description length target.
  - required OG image for commercial pages.

### P1: Some pages should probably be noindexed

Candidates:

- `/search`
- `/intake`
- `/start/builder`
- `/fairlend-landing-hero`

Reasoning:

- `/search` is an internal utility page and currently has no description or canonical.
- `/intake` and `/start/builder` are conversion workflow pages. They may be valuable for branded searches, but they are not strong organic landing pages unless intentionally written as such.
- `/fairlend-landing-hero` has no metadata and appears likely to be a component/demo route.

Fix:

- Decide which routes are intended organic landing pages.
- For utility/demo/workflow routes, add:
  - `robots: { index: false, follow: true }`
  - omit from sitemap
  - retain internal links only where needed
- For any route kept indexable, add full metadata, canonical, visible H1, content depth, and sitemap inclusion.

### P2: Metadata quality needs tightening

Route metadata matrix from source review:

| Route | Metadata | Canonical | OG | Twitter | Title length | Description length |
| --- | --- | --- | --- | --- | ---: | ---: |
| `/` | yes | no | no | no | 73 | 137 |
| `/[slug]` | dynamic | no | no | no | n/a | n/a |
| `/affordable-sustainable-rental-housing` | yes | yes | no | no | 67 | 143 |
| `/borrowers/private-mortgage-financing` | yes | yes | no | no | 84 | 168 |
| `/cmhc-mli-select-multiplex-financing` | yes | yes | no | no | 55 | 152 |
| `/construction-draw-financing` | yes | yes | no | no | 44 | 128 |
| `/en/brokerage/privacy-policy` | yes | yes | no | no | 41 | 168 |
| `/fairlend-landing-hero` | no | no | no | no | n/a | n/a |
| `/garden-suite-financing-gta` | yes | yes | no | no | 46 | 157 |
| `/garden-suite` | yes | yes | no | no | 51 | 141 |
| `/intake` | yes | no | no | no | 70 | 86 |
| `/investing/private-mortgage-lending` | yes | yes | no | no | 82 | 252 |
| `/multiplex-financing-gta` | yes | yes | no | no | 43 | 161 |
| `/partners` | yes | yes | no | no | 70 | 237 |
| `/posts` | dynamic | no | no | no | 64 | missing |
| `/posts/[slug]` | dynamic | no | no | no | n/a | n/a |
| `/posts/page/[pageNumber]` | dynamic | no | no | no | 45 | missing |
| `/resources/construction-draws-small-builders` | yes | yes | no | no | 57 | 124 |
| `/search` | dynamic | no | no | no | 25 | missing |
| `/start/builder` | yes | yes | no | no | 34 | 128 |

Recommended metadata rules:

- Keep most titles near 45 to 60 characters when possible.
- Keep descriptions around 120 to 160 characters, with room for natural language rather than keyword stuffing.
- Put the primary service and region early in title tags.
- Avoid titles that are too broad, such as lists of many financing categories.
- Make each description a useful search result pitch, not just an internal product summary.

Specific title and description improvements:

- Home title is long. Consider: `FairLend Mortgage | Private Real Estate Financing Ontario`
- `/borrowers/private-mortgage-financing` title is too long. Consider: `Private Mortgage Financing Ontario | FairLend`
- `/investing/private-mortgage-lending` title is too long. Consider: `Private Mortgage Investing Ontario | FairLend`
- `/partners` title is too long. Consider: `FairLend Partner Program | GTA Build Financing`
- `/intake` description is too short and the page lacks canonical. Either noindex it or rewrite as a branded request page.
- `/posts`, paginated posts, and `/search` need descriptions if they remain indexable.

### P2: Heading audit needs rendered verification

Source-level result:

- Many route files do not contain literal `<h1>` tags because they render imported components.
- Confirmed component-level H1s exist in:
  - `FairlendLandingHero`
  - `FairlendBorrowerHero`
  - `FairlendInvestorHero`
  - `FairlendPartnerProgram`
  - `FairlendFinancingRouteReference`
  - `FairlendFeedbackContentPage`
  - `PostHero`
  - `WatermelonRegistryHero`

Risk:

- Source-level route files alone cannot prove each rendered page has exactly one relevant H1.
- Some UI/demo/dashboard components also contain H1s and may create multiple H1s if included in public routes.

Fix:

- Add a lightweight rendered SEO smoke check for public routes:
  - exactly one primary H1 on organic landing pages.
  - H1 aligns with title intent.
  - no demo/dashboard H1s inside marketing pages unless intentional.
- This can be automated later with a route crawl, but was not run in this audit.

### P2: Image SEO and performance need a second pass

Source sweep:

- 156 `Image` or `img` usages found.
- 0 missing `alt` attributes found.
- 65 empty alt attributes found.
- 33 Next `Image` usages appear to lack `sizes`.

Interpretation:

- Empty alt is correct for decorative imagery, but some FairLend marketing images may carry meaning and should not be empty.
- Missing `sizes` can cause suboptimal image selection for responsive images.
- The global OG image is still a template asset.

Fix:

- Audit meaningful commercial images manually:
  - founder/leadership imagery
  - service diagrams
  - financing process visuals
  - trust/compliance visuals
  - DrawFlow screenshots or product visuals
- Keep decorative texture/ornament images as `alt=""`.
- Add `sizes` to all responsive `Image` usages with `fill`.
- Add descriptive filenames for key assets where practical.
- Create branded OG images in `/public` with stable, descriptive paths.

### P2: URL origin handling should be stricter for production

Evidence:

- `getServerSideURL()` falls back to `http://localhost:3000`.
- `next-sitemap.config.cjs` correctly refuses localhost/example origins.
- Runtime metadata does not have the same strict production guard.

Impact:

- If `NEXT_PUBLIC_SERVER_URL` and `VERCEL_PROJECT_PRODUCTION_URL` are misconfigured, metadata can emit localhost URLs in Open Graph images or canonical-related values.

Fix:

- Add a production-safe canonical origin helper.
- In production, throw if the canonical origin is missing or localhost.
- Use the same helper for:
  - `metadataBase`
  - sitemap routes
  - Open Graph image URLs
  - Payload SEO preview URL generation

### P2: Search result quality and content depth can improve

Current commercial coverage is directionally strong:

- Private mortgage financing.
- Construction draw financing.
- Multiplex financing.
- Garden suite eligibility.
- Affordable sustainable rental housing.
- Investor private mortgage lending.
- Partner program.

What is missing or underdeveloped:

- Clear topical clusters for Ontario/GTA search intent.
- Educational pages that explain underwriting, draws, bridge financing, private lending risk, lender expectations, and borrower documentation.
- Case-study style pages.
- Comparison pages.
- Glossary pages.
- Author/expert profile pages.
- Editorial policy and compliance review signals.
- Strong internal linking from informational content to commercial pages.

Content opportunities:

- `Private Mortgage Financing in Ontario`
- `Private Mortgage Financing in Toronto`
- `Second Mortgage Financing Ontario`
- `Bridge Financing for Property Owners`
- `Construction Draw Mortgage Financing Ontario`
- `Construction Draw Schedule Guide`
- `Multiplex Financing in Toronto`
- `CMHC MLI Select Readiness Checklist`
- `Garden Suite Financing Ontario`
- `Private Mortgage Investing Ontario`
- `Mortgage Investment Risk Guide`
- `Builder Working Capital and Draw Timing`
- `How Private Mortgage Underwriting Works`
- `What Documents Borrowers Need for Private Mortgage Financing`
- `Broker Referral Program for Private Mortgages`

Each page should have:

- One search intent.
- One primary keyword family.
- Strong internal links.
- Clear CTA.
- FAQ section.
- Schema where appropriate.
- Compliance-reviewed wording.

### P2: Trust, compliance, and E-E-A-T signals should be more explicit

FairLend is in a trust-heavy vertical. Organic search visibility depends on more than title tags.

Recommended additions:

- A dedicated licensing and compliance page, linked in footer.
- A dedicated leadership/about page with:
  - real names
  - credentials
  - licensing context
  - lending/investing experience
  - regulator links
- Author profile pages for blog content.
- Dates and update dates on educational articles.
- Clear disclaimers for:
  - financing subject to underwriting
  - rates/fees subject to file risk
  - investor risk
  - no guaranteed approval
- Internal review workflow for regulated claims.
- Organization schema that references legal name and licensing details only after compliance review.

## Robots and Indexation Review

Current `public/robots.txt`:

- Allows all user agents by default.
- Disallows `/admin/*`.
- Lists:
  - `https://fairlend.ca/sitemap.xml`
  - `https://fairlend.ca/pages-sitemap.xml`
  - `https://fairlend.ca/posts-sitemap.xml`

What is good:

- Admin is blocked from crawling.
- Sitemaps are discoverable from robots.txt.
- QR campaign redirect route has `X-Robots-Tag: noindex` in `src/app/(frontend)/r/[campaign]/route.ts`.

What to improve:

- Add explicit noindex metadata for utility/demo pages instead of relying on robots.txt.
- Keep robots.txt for crawl control, not index prevention. Google documents that robots.txt is not the correct mechanism for keeping a page out of Google; use noindex or authentication for that.
- Make robots generation dynamic or centrally configured so production origin, sitemap list, and route exclusions cannot drift.

## Sitemap Review

Current architecture:

- `public/sitemap.xml` is a sitemap index.
- `public/robots.txt` references sitemap URLs.
- `next-sitemap` runs in `postbuild`.
- Dynamic sitemap route handlers also exist:
  - `src/app/(frontend)/(sitemaps)/pages-sitemap.xml/route.ts`
  - `src/app/(frontend)/(sitemaps)/posts-sitemap.xml/route.ts`

Risks:

- Static generated files and dynamic route handlers can drift.
- `dateFallback = new Date().toISOString()` changes `lastmod` for default sitemap entries even when content has not changed.
- Hardcoded marketing pages are not obviously included in the dynamic page sitemap unless duplicated in Payload.
- `next-sitemap` excludes nearly everything, so it is mostly generating a robots/sitemap shell rather than a full route inventory.

Recommended sitemap policy:

- Use one canonical source of truth.
- Include all indexable static marketing pages explicitly.
- Include CMS pages and posts dynamically.
- Exclude noindex utility routes.
- Use stable `lastmod` values:
  - from git/build metadata for hardcoded static pages, or omit if not reliable.
  - from CMS `updatedAt` for Payload content.
- Submit only the sitemap index URL in Search Console once coverage is complete.

## Recommended Implementation Roadmap

### Phase 1: Stop the bleeding

1. Remove or gate the localhost live script in `src/app/(frontend)/layout.tsx`.
2. Replace all Payload template SEO defaults with FairLend defaults:
   - `src/utilities/mergeOpenGraph.ts`
   - `src/utilities/generateMeta.ts`
   - `src/plugins/index.ts`
   - `src/app/(frontend)/layout.tsx`
3. Replace `public/website-template-OG.webp` with a branded FairLend default OG image, or add a new branded image path and update all references.
4. Add a production-safe canonical origin helper and use it everywhere metadata URLs are generated.

### Phase 2: Make every route indexation decision explicit

1. Classify each route as `index` or `noindex`.
2. Add canonicals to:
   - home
   - Payload pages
   - Payload posts
   - blog listing
   - paginated blog listing
   - any commercial workflow route kept indexable
3. Noindex:
   - internal search, unless there is a strong reason to index it.
   - demo routes.
   - intake/workflow routes that are not written as organic landing pages.
4. Remove noindex routes from sitemaps.

### Phase 3: Rebuild sitemap coverage

1. Add all hardcoded public commercial routes to the sitemap source.
2. Keep dynamic Payload page and post inclusion.
3. Remove unstable fallback `lastmod` dates or make them stable.
4. Verify `robots.txt`, `/sitemap.xml`, `/pages-sitemap.xml`, and `/posts-sitemap.xml` return expected status and content type after deploy.
5. Submit the sitemap index in Search Console and monitor discovered/indexed counts.

### Phase 4: Add structured data

1. Add sitewide Organization or FinancialService JSON-LD.
2. Add WebSite JSON-LD.
3. Add BreadcrumbList JSON-LD for service pages and posts.
4. Add Service JSON-LD to commercial service pages.
5. Add Article/BlogPosting JSON-LD to posts.
6. Keep FAQPage only where the FAQ content is visible on the page.

### Phase 5: Improve content architecture

1. Build location and service clusters around Ontario, Toronto, GTA, private mortgage, construction draw, multiplex, garden suite, investor lending, and broker/partner intent.
2. Add author/expert pages and editorial review signals.
3. Add case studies and scenario pages.
4. Link informational content back to commercial conversion pages.
5. Add comparison and checklist assets that naturally earn links and improve topical authority.

### Phase 6: Add SEO regression checks

Recommended lightweight checks:

- Every indexable route has:
  - title
  - description
  - canonical
  - non-template OG image
  - no `Payload Website Template`
  - no `localhost`
  - exactly one primary H1 after render
- Sitemaps do not include noindex routes.
- No route emits `website-template-OG.webp`.
- `robots.txt` references reachable sitemap URLs.
- Production metadata origin is `https://fairlend.ca`.

## Route-by-Route Recommendations

### `/`

Problems:

- Missing explicit canonical.
- Title is long.
- Global Open Graph defaults are template-branded.
- FAQ JSON-LD exists, but Organization/WebSite schema is missing.

Recommendations:

- Add canonical `/`.
- Add page-specific OG/Twitter metadata.
- Add Organization/FinancialService and WebSite schema.
- Tighten title around private real estate financing in Ontario.

### `/borrowers/private-mortgage-financing`

Problems:

- Title is 84 characters.
- No page-specific OG/Twitter metadata.
- No Service or Breadcrumb schema.

Recommendations:

- Shorten title to focus on `Private Mortgage Financing Ontario`.
- Add Service schema for borrower/private mortgage financing.
- Add FAQ section if the visible page does not already include one.

### `/investing/private-mortgage-lending`

Problems:

- Title is 82 characters.
- Description is 252 characters, likely too long for a clean snippet.
- No investor-specific schema or social metadata.

Recommendations:

- Shorten title and description.
- Add investor risk/disclaimer content.
- Add Organization/FinancialService references and FAQ schema if visible.
- Add trust links to compliance/licensing pages.

### `/construction-draw-financing`

Problems:

- No page-specific OG/Twitter metadata.
- No Service schema.
- DrawFlow-specific positioning may need canonical relation to any product route if one exists.

Recommendations:

- Add DrawFlow-specific OG image.
- Add Service schema for construction draw financing.
- Add internal links to builder intake, construction draw guide, and budget/draw resources.

### `/multiplex-financing-gta`

Problems:

- No page-specific OG/Twitter metadata.
- No Service/Breadcrumb schema.

Recommendations:

- Add GTA/Toronto multiplex service schema.
- Add supporting pages for CMHC MLI Select, unit mix, refinancing, construction completion, and acquisition.

### `/garden-suite` and `/garden-suite-financing-gta`

Problems:

- Potential keyword/topic overlap.
- Both have metadata and canonicals, but no OG/Twitter/schema.

Recommendations:

- Decide whether one is an eligibility tool and one is a financing landing page.
- Internally link them clearly.
- Avoid duplicated title intent.
- Add Service schema and FAQ content.

### `/partners`

Problems:

- Title is 70 characters.
- Description is 237 characters.
- No page-specific social metadata.

Recommendations:

- Shorten metadata.
- Add Organization/PartnerProgram-like content structure, but use valid schema types only.
- Add partner qualification FAQ.

### `/posts` and `/posts/page/[pageNumber]`

Problems:

- Missing descriptions.
- Missing canonicals.
- No OG/Twitter metadata.
- Paginated archive indexation strategy is not explicit.

Recommendations:

- Add canonical per page.
- Add description.
- Add `robots` strategy for paginated archives.
- Add internal links to core service hubs.

### `/posts/[slug]`

Problems:

- Dynamic metadata lacks canonical generation.
- Template branding fallback exists.
- No Article/BlogPosting schema.

Recommendations:

- Add canonical `/posts/${slug}`.
- Add Article/BlogPosting JSON-LD.
- Require or generate meta descriptions.
- Include author, date published, date modified, and publisher data.

### `/search`

Problems:

- Missing description.
- Missing canonical.
- Likely should not be indexed.

Recommendations:

- Add `robots: { index: false, follow: true }`.
- Remove from sitemap if noindexed.

### `/intake`, `/start/builder`, and `/fairlend-landing-hero`

Problems:

- `/intake` is missing canonical.
- `/fairlend-landing-hero` has no metadata.
- These look like workflow/demo routes, not strong organic landing pages.

Recommendations:

- Noindex demo/internal workflow routes unless intentionally built as organic landing pages.
- If kept indexable, add full metadata, canonical, H1, content depth, and sitemap inclusion.

## Suggested Metadata Defaults

Use these as a starting point, subject to compliance review.

```ts
const fairlendSeoDefaults = {
  siteName: 'FairLend Mortgage',
  defaultTitle: 'FairLend Mortgage',
  titleTemplate: '%s | FairLend Mortgage',
  description:
    'FairLend helps Ontario borrowers, builders, partners, and private mortgage investors structure clear real-estate financing options.',
  url: 'https://fairlend.ca',
  ogImage: 'https://fairlend.ca/og/fairlend-default.jpg',
}
```

## Suggested Technical SEO Helper

Build a reusable helper rather than hand-writing metadata per route.

```ts
type FairlendMetadataInput = {
  title: string
  description: string
  path: string
  image?: string
  index?: boolean
}

export function buildFairlendMetadata({
  title,
  description,
  path,
  image = '/og/fairlend-default.jpg',
  index = true,
}: FairlendMetadataInput): Metadata {
  const url = new URL(path, getCanonicalOrigin()).toString()
  const imageUrl = new URL(image, getCanonicalOrigin()).toString()

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'FairLend Mortgage',
      title,
      description,
      url,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}
```

## Definition of Done for a Permanent SEO Fix

- No production metadata contains `Payload Website Template`.
- No production metadata contains `@payloadcms`.
- No production metadata points at `localhost`.
- No frontend layout loads local development scripts.
- Every indexable route has a title, description, canonical, OG metadata, Twitter metadata, and sitemap entry.
- Every noindex route is excluded from sitemaps.
- Dynamic Payload Pages and Posts generate correct FairLend metadata without manual SEO fields.
- Posts emit Article/BlogPosting schema.
- Commercial pages emit Service and BreadcrumbList schema.
- Sitewide Organization/FinancialService and WebSite schema exist.
- Search Console sitemap coverage matches the intended indexable route inventory.
- A regression check prevents template SEO values from returning.
