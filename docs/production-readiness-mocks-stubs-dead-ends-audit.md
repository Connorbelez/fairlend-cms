# Production Readiness Audit: Mocks, Stubs, Dead Ends

Date: 2026-07-08

Scope: all discoverable Next.js frontend pages, shared frontend chrome, frontend API routes, Payload dynamic pages/posts, sitemap routes, and route-linked source under `src/`.

Per project instructions, this audit did not run Playwright, E2E, tests, or `next build`. Evidence came from source route inventory, transitive page import scans, and targeted searches for mocks, stubs, placeholders, TODOs, no-op/dead links, demo data, localhost URLs, and route targets without matching source routes.

## Executive Summary

Production is not ready until the P0 items are fixed or explicitly proven safe in deployment:

1. `src/app/(frontend)/layout.tsx` injects `http://localhost:8400/live.js` into every frontend page.
2. The active marketing header links to source-missing or unproven routes, including `/investors`, `/backoffice`, multiple nested `/resources/...` URLs, `/leadership/elie-soberano`, and `/press`.
3. Sitemap routes fall back to `https://example.com` when production URL env vars are missing.

There are also real P1 launch-readiness issues: a public prototype route, Payload template fallback content, investor portal mock UI being marketed as a live capability, visible "coming soon" investor/MIC options, and partner/investor claims marked in source as requiring compliance substantiation.

## Route Inventory Reviewed

Frontend pages:

- `/` - `src/app/(frontend)/page.tsx`
- `/:slug` - `src/app/(frontend)/[slug]/page.tsx`
- `/affordable-sustainable-rental-housing` - `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`
- `/borrowers/private-mortgage-financing` - `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`
- `/cmhc-mli-select-multiplex-financing` - `src/app/(frontend)/cmhc-mli-select-multiplex-financing/page.tsx`
- `/construction-draw-financing` - `src/app/(frontend)/construction-draw-financing/page.tsx`
- `/fairlend-landing-hero` - `src/app/(frontend)/fairlend-landing-hero/page.tsx`
- `/garden-suite` - `src/app/(frontend)/garden-suite/page.tsx`
- `/garden-suite-financing-gta` - `src/app/(frontend)/garden-suite-financing-gta/page.tsx`
- `/construction-financing` - `src/app/(frontend)/construction-financing/page.tsx`
- `/investing/private-mortgage-lending` - `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`
- `/multiplex-financing-gta` - `src/app/(frontend)/multiplex-financing-gta/page.tsx`
- `/partners` - `src/app/(frontend)/partners/page.tsx`
- `/posts` - `src/app/(frontend)/posts/page.tsx`
- `/posts/:slug` - `src/app/(frontend)/posts/[slug]/page.tsx`
- `/posts/page/:pageNumber` - `src/app/(frontend)/posts/page/[pageNumber]/page.tsx`
- `/resources/construction-draws-small-builders` - `src/app/(frontend)/resources/construction-draws-small-builders/page.tsx`
- `/search` - `src/app/(frontend)/search/page.tsx`
- `/start/builder` - `src/app/(frontend)/start/builder/page.tsx`

Frontend routes/APIs:

- `/pages-sitemap.xml`
- `/posts-sitemap.xml`
- `/api/address-autocomplete`
- `/api/address-details`
- `/api/consultations/availability`
- `/api/consultations/book`
- `/api/leads`
- `/next/exit-preview`
- `/next/preview`
- `/next/seed`

Payload routes:

- `/admin/:segments*`
- `/api/:slug*`
- `/api/graphql`
- `/api/graphql-playground`

## Findings

### P0 - Shared Frontend Layout Ships Localhost Script

Evidence:

- `src/app/(frontend)/layout.tsx:61`
- `src/app/(frontend)/layout.tsx:62`
- `src/app/(frontend)/layout.tsx:63`

The frontend layout contains:

```tsx
{/* impeccable-live-start */}
<script src="http://localhost:8400/live.js"></script>
{/* impeccable-live-end */}
```

Impact: every public frontend page attempts to load a local development script in production. This is a visible production artifact, a console/network error, and a potential security/process failure.

Fix: remove it outright, or gate it behind a development-only check that cannot evaluate true in production.

### P0 - Active Header Contains Dead or Unproven Navigation Targets

Evidence:

- Active chrome uses the directional header for standalone landing pages: `src/app/(frontend)/FrontendChrome.client.tsx:3`, `src/app/(frontend)/FrontendChrome.client.tsx:13`, `src/app/(frontend)/FrontendChrome.client.tsx:22`
- Header action links use `/investors` and `/backoffice`: `src/components/directional-hover-header/header.tsx:105`, `src/components/directional-hover-header/header.tsx:115`
- Nav data defines `/backoffice`, `/investors`, `/leadership/elie-soberano`, `/press`, `/resources`, and nested resource URLs: `src/components/directional-hover-header/header/nav-data.ts:30`, `src/components/directional-hover-header/header/nav-data.ts:40`, `src/components/directional-hover-header/header/nav-data.ts:41`, `src/components/directional-hover-header/header/nav-data.ts:43`, `src/components/directional-hover-header/header/nav-data.ts:44`, `src/components/directional-hover-header/header/nav-data.ts:45`, `src/components/directional-hover-header/header/nav-data.ts:47`, `src/components/directional-hover-header/header/nav-data.ts:48`, `src/components/directional-hover-header/header/nav-data.ts:49`, `src/components/directional-hover-header/header/nav-data.ts:50`, `src/components/directional-hover-header/header/nav-data.ts:51`

Confirmed source-backed page exists for `/investing/private-mortgage-lending`, not `/investors`.

Dead or unproven targets:

- `/investors` - linked from header action and investor menu, but no static route. If this is meant to be the investor page, it should point to `/investing/private-mortgage-lending` or have a redirect.
- `/backoffice` - linked as mobile "Sign in" and "Platform sign in", but no static route or redirect.
- `/leadership/elie-soberano` - nested route; `[slug]` cannot catch it.
- `/resources/cmhc-mli-select-guide-for-multiplex-builds` - nested route; no source page.
- `/resources/financing-gap-gta-multiplex-builds` - nested route; no source page.
- `/resources/garden-suites-family-suitable-rental-supply` - nested route; no source page.
- `/resources/private-capital-affordable-housing` - nested route; no source page.
- `/resources/sustainable-rental-housing-investor-returns` - nested route; no source page.
- `/resources/multiplex-vs-garden-suite-vs-laneway-suite` - nested route; no source page.
- `/about`, `/press`, `/resources` - one-segment routes that depend on CMS `[slug]` content being present. No static route or redirect exists in source.

Impact: primary navigation can send production users into 404/redirect dead ends.

Fix: align header targets to existing routes, add explicit redirects, or create the missing static/CMS pages before launch. The investor language toggle labeled `FR` should not route to `/investors` unless that is intentional and live.

### P0 - Sitemap Routes Fall Back to `example.com`

Evidence:

- `src/app/(frontend)/(sitemaps)/pages-sitemap.xml/route.ts:9`
- `src/app/(frontend)/(sitemaps)/pages-sitemap.xml/route.ts:12`
- `src/app/(frontend)/(sitemaps)/posts-sitemap.xml/route.ts:9`
- `src/app/(frontend)/(sitemaps)/posts-sitemap.xml/route.ts:12`

Both sitemap routes use:

```ts
process.env.NEXT_PUBLIC_SERVER_URL ||
process.env.VERCEL_PROJECT_PRODUCTION_URL ||
'https://example.com'
```

Impact: if production env is misconfigured, the public sitemap advertises `example.com` URLs.

Fix: remove the `example.com` fallback. Fail closed with a clear server error or use a verified canonical FairLend origin.

### P1 - Public Prototype Route `/fairlend-landing-hero`

Evidence:

- Route exists: `src/app/(frontend)/fairlend-landing-hero/page.tsx:15`
- It renders only three landing sections: `src/app/(frontend)/fairlend-landing-hero/page.tsx:19`, `src/app/(frontend)/fairlend-landing-hero/page.tsx:23`, `src/app/(frontend)/fairlend-landing-hero/page.tsx:26`

Impact: this looks like a partial prototype/showcase route. It has production metadata, is wrapped in the public frontend chrome, and can be indexed unless blocked.

Fix: delete, redirect to `/`, or explicitly noindex if the team still needs it in production.

### P1 - Payload Template Fallback Still Present in Dynamic Page Route

Evidence:

- `src/app/(frontend)/[slug]/page.tsx:58`
- `src/app/(frontend)/[slug]/page.tsx:59`
- `src/app/(frontend)/[slug]/page.tsx:60`
- `src/endpoints/seed/home-static.ts:3`
- `src/endpoints/seed/home-static.ts:22`
- `src/endpoints/seed/home-static.ts:83`
- `src/endpoints/seed/home-static.ts:84`

The dynamic page route still says "Remove this code once your website is seeded" and can fall back to "Payload Website Template" content.

Impact: source still carries starter-template production fallback. The current `/` static page likely prevents the home fallback from being visible, but this should not ship as production-ready page logic.

Fix: remove the fallback and make missing CMS pages redirect/notFound explicitly.

### P1 - Investor Page Markets Mock Portal UI as Product Capability

Evidence:

- Hero renders `investor-portal-mock`: `src/components/FairlendInvestorHero/index.tsx:96`
- Mock file/status data appears in hero: `src/components/FairlendInvestorHero/index.tsx:100`, `src/components/FairlendInvestorHero/index.tsx:116`, `src/components/FairlendInvestorHero/index.tsx:122`, `src/components/FairlendInvestorHero/index.tsx:152`
- Portal section source describes itself as a mock: `src/components/FairlendInvestorPortal/index.tsx:52`, `src/components/FairlendInvestorPortal/index.tsx:55`
- Portal UI includes fake records and live/synced states: `src/components/FairlendInvestorPortal/index.tsx:85`, `src/components/FairlendInvestorPortal/index.tsx:102`, `src/components/FairlendInvestorPortal/index.tsx:117`, `src/components/FairlendInvestorPortal/index.tsx:153`, `src/components/FairlendInvestorPortal/index.tsx:157`

Impact: if the investor portal is not actually available in production, this is a product misrepresentation risk. The UI says "Live", "QuickBooks synced", "Tax-ready export", and "Open file" while the source calls it a mock.

Fix: either connect this to real product screenshots/capability, relabel as illustrative, or reduce the claims to roadmap-safe copy.

### P1 - Visible "Coming Soon" Investor/MIC Options

Evidence:

- Route selector bullet: `src/components/FairlendRouteSelector/route-data.tsx:39`
- Homepage application form disabled select item: `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:447`, `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:448`

Impact: production users see a disabled "FairLend MIC - coming soon" option and route-selector copy. If the MIC is not launch-ready or compliance-cleared, this is a public roadmap/compliance statement.

Fix: remove for launch, or replace with a compliant investor-intake option that does not advertise unavailable product state.

### P1 - Partner Page Contains Compliance Claims Marked "Must Be Substantiated"

Evidence:

- Page-level compliance warning: `src/app/(frontend)/partners/page.tsx:36`, `src/app/(frontend)/partners/page.tsx:37`, `src/app/(frontend)/partners/page.tsx:38`
- DrawFlow/guarantee warnings: `src/components/FairlendPartnerProgram/index.tsx:165`, `src/components/FairlendPartnerProgram/index.tsx:185`, `src/components/FairlendPartnerProgram/index.tsx:345`, `src/components/FairlendPartnerProgram/index.tsx:462`
- Rendered MLI Select qualifier: `src/components/FairlendPartnerProgram/index.tsx:886`, `src/components/FairlendPartnerProgram/index.tsx:888`
- Credibility claim says `$2B+` and "nearly three decades" must be substantiated before publishing: `src/components/FairlendPartnerProgram/index.tsx:925`, `src/components/FairlendPartnerProgram/index.tsx:929`, `src/components/FairlendPartnerProgram/index.tsx:930`

Impact: the code itself marks claims that need legal/compliance proof before launch. These are not mocks, but they are production gates.

Fix: attach substantiation, update copy, or remove the claim before go-live.

### P1 - Footer Has Source-Unproven `/terms` Link

Evidence:

- Footer compliance column defines `/terms`: `src/Footer/WatermelonFooter.client.tsx:84`, `src/Footer/WatermelonFooter.client.tsx:91`
- Footer renders `footerColumns`: `src/Footer/WatermelonFooter.client.tsx:322`, `src/Footer/WatermelonFooter.client.tsx:333`, `src/Footer/WatermelonFooter.client.tsx:337`

Impact: `/terms` depends on CMS `[slug]` content. No static source route or redirect exists. If CMS lacks a published `terms` page, this is a footer 404.

Fix: create/publish the CMS page, add a static route, or point to the current legal terms URL.

### P2 - Data-Driven Product Pages Have Prototype-Style Copy Residue

Evidence:

- `/affordable-sustainable-rental-housing`: title "The Right Project Get Funded" at `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx:37`
- `/construction-draw-financing`: all-caps section title/body style at `src/app/(frontend)/construction-draw-financing/page.tsx:71`
- `/garden-suite-financing-gta`: hero title is all-caps "WHO IT'S FOR" at `src/app/(frontend)/garden-suite-financing-gta/page.tsx:24`
- `/garden-suite-financing-gta`: panel title "No lane labels" exposes internal feedback language at `src/app/(frontend)/garden-suite-financing-gta/page.tsx:64`
- `/multiplex-financing-gta`: body begins with all-caps "MLI SELECT READINESS" at `src/app/(frontend)/multiplex-financing-gta/page.tsx:59`
- `/resources/construction-draws-small-builders`: "interest occurred" likely typo at `src/app/(frontend)/resources/construction-draws-small-builders/page.tsx:49`

Impact: not functional blockers, but these read like generated notes or internal feedback made it into public copy.

Fix: copy edit before launch.

### P2 - CMS Watermelon Layout Blocks Retain Demo Fallback Copy

Evidence:

- `src/blocks/WatermelonLayouts/Component.tsx:64`
- `src/blocks/WatermelonLayouts/Component.tsx:67`
- `src/blocks/WatermelonLayouts/Component.tsx:70`
- `src/blocks/WatermelonLayouts/Component.tsx:86`
- `src/components/watermelon/blocks/hero1/ui/Header.tsx:21`
- `src/components/watermelon/blocks/hero1/ui/Header.tsx:22`
- `src/components/watermelon/blocks/hero1/ui/Header.tsx:23`
- `src/components/watermelon/blocks/hero1/ui/Header.tsx:24`
- `src/components/watermelon/blocks/hero1/ui/Header.tsx:25`

Impact: these are reachable through CMS-rendered `[slug]` pages if editors use Watermelon layout blocks. Defaults include "Demo crashes" and dead `#` nav labels like "Pricing" and "Enterprise".

Fix: remove demo fallbacks or replace them with FairLend-safe fallback copy and real links.

### P2 - Homepage Services Section Has TODO Left in Source

Evidence:

- `src/components/FairlendServicesSection/index.tsx:2234`

Impact: source-only TODO, not visible. It still indicates a known unfinished media asset for the partner card.

Fix: replace the asset or remove the TODO before launch cleanup.

### P2 - Consultation Booking Is Env-Gated

Evidence:

- Google Calendar config detection: `src/lib/fairlend-consultations/google-calendar.ts:22`, `src/lib/fairlend-consultations/google-calendar.ts:24`, `src/lib/fairlend-consultations/google-calendar.ts:26`
- Missing config returns no Google busy intervals for availability: `src/lib/fairlend-consultations/google-calendar.ts:37`, `src/lib/fairlend-consultations/google-calendar.ts:38`
- Booking without Google Calendar mirrors a lead, then returns 503: `src/lib/fairlend-consultations/service.ts:125`, `src/lib/fairlend-consultations/service.ts:127`, `src/lib/fairlend-consultations/service.ts:142`

Impact: not a mock, but production booking depends on `GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_CALENDAR_PRIVATE_KEY`. Without them, users can see availability but cannot complete booking.

Fix: verify production env vars and service-account calendar access before launch.

### P2 - Lead Capture Depends on Database Env

Evidence:

- `/api/leads` persists through `upsertFairlendLead`: `src/app/(frontend)/api/leads/route.ts:15`
- Lead SQL requires `DATABASE_URL` or `POSTGRES_URL`: `src/lib/fairlend-leads.ts:309`, `src/lib/fairlend-leads.ts:312`
- Homepage form continues to `/construction-financing` even if initial lead save fails: `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:221`, `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:225`, `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:245`
- DrawFlow intake silently returns `null` on save failure: `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1808`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1827`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1833`

Impact: forms are real, not stubs, but production data capture depends on DB env. Some flows intentionally allow continuation after a failed draft save.

Fix: verify DB env and decide whether continuation after failed save is acceptable for production lead attribution.

## Page-by-Page Section Audit

### `/`

Source: `src/app/(frontend)/page.tsx`

Sections reviewed:

- Hero: `FairlendLandingHero`
- Route selector: `FairlendRouteSelector`
- Overview: `FairlendLandingOverviewSection`
- Build model: `FairlendBuildModelSection`
- Builder consulting: `FairlendBuilderConsultingSection`
- Leadership: `FairlendLeadershipSection`
- FAQ: `FairlendFaqSection`

Findings:

- Inherits P0 localhost script from layout.
- Standalone chrome uses active directional header with P0 dead/unproven nav targets.
- Route selector includes "FairLend MIC coming soon".
- Hero application form includes disabled "FairLend MIC - coming soon".
- Lead capture is real through `/api/leads`, but DB env must be present.

### `/:slug`

Source: `src/app/(frontend)/[slug]/page.tsx`

Sections reviewed:

- Payload redirects
- Hero renderer
- Block renderer
- Draft live preview listener

Findings:

- Contains starter-template seeded fallback and "Remove this code once your website is seeded" comment.
- CMS Watermelon layout blocks can render demo fallback copy/dead links if used.
- One-segment nav targets like `/about`, `/press`, `/resources`, and `/terms` depend on CMS content being published.

### `/affordable-sustainable-rental-housing`

Source: `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`

Sections reviewed:

- Hero: "Capital for rentals built to last"
- Section: "The Right Project Get Funded"
- Section: "From project inception to draw discipline"
- Final note/CTA

Findings:

- No form stub or dead section found.
- Copy issue: "The Right Project Get Funded" should be edited before launch.

### `/borrowers/private-mortgage-financing`

Source: `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`

Sections reviewed:

- Borrower hero
- Borrower problem
- Borrower solution
- Borrower consultation

Findings:

- No mock/stub/dead-end source hits in the route-linked scan.
- Page source comment says sections 4-8 "slot into rails" later, while the page currently renders sections 1-3 plus consultation. Confirm the reduced page is intentional before production.

### `/cmhc-mli-select-multiplex-financing`

Source: `src/app/(frontend)/cmhc-mli-select-multiplex-financing/page.tsx`

Sections reviewed:

- Hero: "Package the MLI Select File"
- Section: "THREE PATHWAYS TO MLI SELECT"
- Section: "Bring what changes the decision"
- Final note/CTA

Findings:

- No functional stub found.
- MLI Select language should be included in compliance copy review.

### `/construction-draw-financing`

Source: `src/app/(frontend)/construction-draw-financing/page.tsx`

Sections reviewed:

- Hero: "One place for roadmaps, draws and proof"
- Section: "How a draw should move"
- Section: "Roadmaps, draws and proof together"
- Section: "PROOF STAYS ATTACHED - EVEN WHEN GPS DOESN'T"
- Final note/CTA

Findings:

- No form stub or dead section found.
- Copy issue: all-caps section title reads like pasted internal concept copy.

### `/fairlend-landing-hero`

Source: `src/app/(frontend)/fairlend-landing-hero/page.tsx`

Sections reviewed:

- Hero
- Opportunity canvas
- Judgment section

Findings:

- Public prototype/partial route. Remove, redirect, or noindex.

### `/garden-suite`

Source: `src/app/(frontend)/garden-suite/page.tsx`

Sections reviewed:

- Hero: "Can the ground support it?"
- Section: "A usable form, not guesswork"
- Section: "What can block the file"
- Final note/CTA

Findings:

- No functional stub found.

### `/garden-suite-financing-gta`

Source: `src/app/(frontend)/garden-suite-financing-gta/page.tsx`

Sections reviewed:

- Hero: "WHO IT'S FOR"
- Section: "What the review pulls in"
- Section: "Funding planned before crews wait"
- Section: "What kills a deal"
- Final note/CTA

Findings:

- No functional stub found.
- Copy issue: hero title and "No lane labels" panel read like internal/prototype copy.

### `/construction-financing`

Source: `src/app/(frontend)/construction-financing/page.tsx`

Sections reviewed:

- `FairlendIntakeRouter`
- Build intent routes to `DrawflowIntake`
- Other intents route to `FairlendLeadIntake`

Findings:

- Not a stub. It routes to real intake components.
- Lead persistence depends on DB env.

### `/investing/private-mortgage-lending`

Source: `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`

Sections reviewed:

- Investor hero
- Primer
- Rate reframe
- Protection stack
- Managed platform
- Investor portal
- Opportunities
- Fractional
- Regulator band
- Process
- Leadership
- Fit
- FAQ
- Final CTA

Findings:

- Investor portal mock UI is route-visible and should be made real, relabeled, or softened.
- Internal anchor `#investor-protection-stack` is used by the hero and regulator band. This is valid only if `FairlendInvestorProtectionStack` renders that id. Confirm during implementation/QA.
- Compliance-safe investor language is present in several places, but claims around portal, QuickBooks, and tax export need proof if presented as current capability.

### `/multiplex-financing-gta`

Source: `src/app/(frontend)/multiplex-financing-gta/page.tsx`

Sections reviewed:

- Hero: "A practical path from site to terms"
- Section: "Who this is for"
- Section: "MLI Select readiness"
- Section: "What the review should produce"
- Final note/CTA

Findings:

- No functional stub found.
- Copy issue: body begins with all-caps "MLI SELECT READINESS".

### `/partners`

Source: `src/app/(frontend)/partners/page.tsx`

Sections reviewed:

- Partner hero
- Problem
- Program
- Who for
- Lifecycle
- Broker
- Real estate
- Design
- Construction
- How it works
- Project types
- Credibility
- FAQ
- Final CTA

Findings:

- Source explicitly says `$2B+ funded`, "nearly three decades", DrawFlow, and CMHC MLI Select language must be substantiated before publishing.
- Partner program comments correctly guard against guaranteed qualification language, but this is still a launch checklist item.

### `/posts`

Source: `src/app/(frontend)/posts/page.tsx`

Sections reviewed:

- Resources hero
- Page range
- Collection archive
- Pagination

Findings:

- No mock/stub/dead-end source hits.
- Depends on Payload posts collection.

### `/posts/page/:pageNumber`

Source: `src/app/(frontend)/posts/page/[pageNumber]/page.tsx`

Sections reviewed:

- Resources hero
- Page range
- Collection archive
- Pagination

Findings:

- No mock/stub/dead-end source hits.
- Possible pagination mismatch: `generateStaticParams` calculates `Math.ceil(totalDocs / 10)` while the page query uses `limit: 12`. This is not a mock, but it can generate too many/few paginated paths.

### `/posts/:slug`

Source: `src/app/(frontend)/posts/[slug]/page.tsx`

Sections reviewed:

- Payload redirects
- Post hero
- Rich text
- Related posts
- Draft live preview listener

Findings:

- No mock/stub/dead-end source hits.
- Depends on published Payload posts.

### `/resources/construction-draws-small-builders`

Source: `src/app/(frontend)/resources/construction-draws-small-builders/page.tsx`

Sections reviewed:

- Hero: "Construction draws for small builders"
- Section: "Where draw structures hurt builders"
- Section: "What a stronger file shows"
- Final note/CTA

Findings:

- No functional stub found.
- Copy issue: "interest occurred for the project" should likely be "interest accrued for the project".

### `/search`

Source: `src/app/(frontend)/search/page.tsx`

Sections reviewed:

- Search hero
- Search input
- Collection archive results
- No-results state

Findings:

- No mock/stub/dead-end source hits.
- Query routing is client-side and real. Depends on Payload `search` collection.

### `/start/builder`

Source: `src/app/(frontend)/start/builder/page.tsx`

Sections reviewed:

- DrawFlow intake

Findings:

- Not a stub. It renders the same `DrawflowIntake` used by build-intent `/construction-financing`.
- Lead persistence depends on DB env and draft-save failures can be silent.

## API/Route Audit

### `/api/leads`

Source: `src/app/(frontend)/api/leads/route.ts`

Status: real persistence route.

Production check:

- Requires `DATABASE_URL` or `POSTGRES_URL`.
- Creates/updates `fairlend.leads` and `fairlend_leads`.

### `/api/consultations/availability`

Source: `src/app/(frontend)/api/consultations/availability/route.ts`

Status: real availability route.

Production check:

- Falls back to default consultation settings if CMS global lookup fails.
- Returns availability without Google busy intervals if Google Calendar env is missing.

### `/api/consultations/book`

Source: `src/app/(frontend)/api/consultations/book/route.ts`

Status: real booking route.

Production check:

- Requires Google Calendar env to complete booking. Without it, it mirrors a lead then returns 503.

### `/pages-sitemap.xml` and `/posts-sitemap.xml`

Status: real sitemap routes with unsafe `example.com` fallback.

Fix before launch.

### `/next/seed`

Source: `src/app/(frontend)/next/seed/route.ts`

Status: public route exists under frontend route group.

Production check:

- Review whether this route is disabled/locked in production. Its presence is a launch risk unless gated.

## Dead-Code / Cleanup Candidates

These are not proven public-page blockers, but they are source debt that triggered the audit searches:

- `src/components/contact-section.tsx` contains `mail@example.com` and `+1 (555) 123-4567`.
- `src/components/blogs-section.tsx` contains repeated `href: '#'`.
- `src/components/kokonutui/card-stack.tsx` contains "Dummy Products Data".
- Many `src/components/ui/hero-*` files and `src/components/registry-assets/**` files contain dead `#` links and template copy.
- Watermelon dashboard components contain demo app routes like `/orders`, `/payments`, `/tasks`, `/settings`, etc. If those blocks are exposed to CMS editors, they need production-safe defaults or should be removed from the editable block set.

## Recommended Launch Blockers

Do not ship until these are resolved or explicitly accepted:

1. Remove localhost live script from `layout.tsx`.
2. Fix header routes: `/investors`, `/backoffice`, nested resources, leadership, press, and CMS-dependent one-segment targets.
3. Remove `example.com` sitemap fallback.
4. Decide fate of `/fairlend-landing-hero`.
5. Remove Payload starter fallback.
6. Prove or reframe investor portal/QuickBooks/tax-export capability.
7. Complete compliance substantiation for partner and investor claims.
8. Verify production DB and Google Calendar env.

## Commands/Checks Used

- Route inventory: `find src app pages -type f \( -name 'page.tsx' -o -name 'page.ts' -o -name 'route.ts' -o -name 'layout.tsx' -o -name 'loading.tsx' -o -name 'not-found.tsx' \)`
- Targeted source scan for `mock`, `stub`, `placeholder`, `dummy`, `demo`, `sample`, `fake`, `hardcoded`, `TODO`, `FIXME`, `coming soon`, `not implemented`, `disabled`, `noop`, `href="#"`, `localhost`, `example.com`, and console/alert usage.
- Transitive import scan from page files to separate route-reachable findings from unused template/source debt.
- Source route/link comparison against discovered frontend page routes.
