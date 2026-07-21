# Fairlend Website Performance Bottleneck Audit

Date: 2026-07-08

Scope: static audit of the Next.js App Router frontend under `src/app/(frontend)`, shared chrome, marketing sections, Payload-rendered pages/posts, CSS, package imports, and public assets.

Validation note: I did not run `next build`, Playwright, Lighthouse, or E2E tests because the project instructions explicitly say not to run tests or builds when working on landing/marketing pages. Findings below are based on source analysis, route/component mapping, public asset inventory, and dependency/import scanning.

## Executive Summary

The biggest bottlenecks are not one-off image mistakes. They are architectural:

1. Shared frontend chrome loads client JavaScript, Motion, icons, analytics, and ad scripts on every route.
2. The `/start/builder` / intake experience is a 2,557-line client island with many images, form state, query-string logic, timeline UI, Google address autocomplete, and a 206 KB CSS file.
3. Several major landing sections mix server-renderable content with client-only animation/effects, pushing hydration cost into routes that should mostly be static.
4. CSS is globally heavy: 65 KB `globals.css`, 206 KB `DrawflowIntake/buildpath.css`, 44 KB `FairlendBuildModelSection/build-model.css`, plus many route section CSS imports.
5. Public assets contain about 116.3 MB of apparently unreferenced files, mostly large PNGs. Referenced assets are mostly WebP, but several are still oversized for their displayed roles.
6. Fonts are loaded through a global Google Fonts CSS `@import`, blocking early render and pulling five families with many weights.
7. Marketing pixels and PostHog/session recording are initialized from the global layout instead of being deferred behind consent, idle time, route allowlists, or dynamic imports.

## Route And Section Coverage

Routes found:

| Route | Primary sections/components | Performance risk |
| --- | --- | --- |
| `/` | `FairlendScrollChoreography`, `FairlendLandingRail`, `FairlendLandingHero`, `FairlendRouteSelector`, `FairlendLandingOverviewSection`, `FairlendBuildModelSection`, `FairlendBuilderConsultingSection`, `FairlendLeadershipSection`, `FairlendFaqSection` | Highest mixed content/animation/asset risk. |
| `/borrowers/private-mortgage-financing` | Borrower hero/problem/solution/scenarios/differentiators/process/trust/FAQ/consultation sections | Many CSS imports and client FAQ/form sections. |
| `/investing/private-mortgage-lending` | Investor hero/primer/rate/protection/platform/portal/opportunities/fractional/regulator/process/leadership/fit/FAQ/final CTA | Many section CSS imports and icon-heavy sections. |
| `/partners` | Partner hero/program/who-for/lifecycle/bridge sections | Large referenced lifecycle WebP assets. |
| `/start/builder` | `DrawflowIntake` | Largest page-level JS/CSS hydration risk. |
| `/construction-financing` | `FairlendIntakeRouter` | Client-routing and intake dependency risk. |
| `/garden-suite`, `/garden-suite-financing-gta`, `/construction-draw-financing`, `/multiplex-financing-gta`, `/affordable-sustainable-rental-housing` | `FairlendFeedbackContentPage` with route selector assets | Lower route JS, but still receives global chrome/analytics costs. |
| `/cmhc-mli-select-multiplex-financing`, `/resources/construction-draws-small-builders` | Under-construction/content pages | Low page-specific cost, still affected by global chrome. |
| `/:slug` | Payload page renderer: `RenderHero`, `RenderBlocks`, `LivePreviewListener` | CMS depth/cache and block-level client island risk. |
| `/posts`, `/posts/page/:pageNumber`, `/posts/:slug` | Payload post list/detail | Payload query/cache and hero image priority risk. |
| `/search` | Payload search page | Dynamic query risk; should avoid expensive default fetches. |
| `/en/brokerage/privacy-policy` | Static policy page | Should be nearly zero JS, currently still gets shared JS/scripts. |

## Findings And Recommended Fixes

### 1. Shared layout ships expensive client code to every frontend page

Evidence:

- `src/app/(frontend)/layout.tsx` imports `AnalyticsProvider`, `Footer`, `FrontendChrome.client`, and `next/script`.
- The layout renders `<FrontendChrome footer={<Footer />}>`, `<AnalyticsProvider />`, and a local live script.
- `src/Footer/Component.tsx` always renders `WatermelonFooter.client.tsx`.
- `src/Footer/WatermelonFooter.client.tsx` is 564 lines and imports `lucide-react`, `motion/react`, `ThemeSelector`, inputs, buttons, and state.
- `src/Header/Component.client.tsx` and `src/Header/Nav/index.tsx` make the header/navigation client-side.

Impact:

- Pages that should be static, such as privacy policy and simple content routes, still hydrate header, footer, theme, nav, analytics, dialogs, icons, and Motion.
- Motion and icon packages enter shared chunks more easily when used in global chrome.

Recommended fix:

- Convert footer markup to a server component by default. Extract only the newsletter/signup/theme interactions into tiny client islands.
- Replace Motion footer animation with CSS-only reduced animation, or lazy-load it below the fold with `dynamic(() => import(...), { ssr: false })` only if the animated footer is truly needed.
- Convert header/nav links to server-rendered markup. Keep only path/theme-specific behavior in a small client component.
- Keep the privacy policy and static content routes as close to zero client JS as possible.

Priority: P0.

### 2. Analytics and ad pixels are global and eager after hydration

Evidence:

- `src/components/Analytics/AnalyticsProvider.client.tsx` is 492 lines.
- It imports `posthog-js`, `next/script`, `usePathname`, `useSearchParams`, Radix dialog components, button/switch/label UI, and consent config.
- It initializes PostHog/session recording and renders Google consent, GTM, Google tag, Meta Pixel, LinkedIn Insight, and Microsoft UET scripts with `strategy="afterInteractive"`.
- It captures route changes through `usePathname` / `useSearchParams`.

Impact:

- Marketing pixels compete with interactive work immediately after hydration.
- The consent dialog UI is part of the analytics client bundle even for users who never see the dialog.
- Session recording can be a large runtime cost.

Recommended fix:

- Split analytics into:
  - a tiny server-rendered consent bootstrap,
  - a lazily imported consent dialog,
  - provider-specific loaders.
- Load nonessential pixels with `requestIdleCallback`, consent approval, and route allowlists.
- Dynamically import `posthog-js` only after consent/eligibility.
- Disable session recording by default, or sample it aggressively.
- Avoid `useSearchParams` in the root analytics component unless campaign attribution requires it; capture only the normalized path for ordinary pageviews.

Priority: P0.

### 3. `/start/builder` / `DrawflowIntake` is a massive client island

Evidence:

- `src/components/DrawflowIntake/DrawflowIntake.client.tsx` has 2,557 lines.
- It is marked `'use client'`.
- It imports `lucide-react`, `next/image`, `next/navigation`, `react-dom` `flushSync`, address autocomplete, timeline UI, many hooks, and a large set of image assets.
- It has multiple `useState`, `useEffect`, `useMemo`, and `useSearchParams` calls.
- It renders many `<Image>` instances and many staged milestone/timeline sections.
- `src/components/DrawflowIntake/buildpath.css` is 206.2 KB and 10,954 lines.
- The component references the largest live asset found: `public/assets/drawflow-intake/Property Site Plan Foreground-optimized.webp` at 941 KB, 1536x1024.

Impact:

- Initial route hydration is expensive before the user completes even the first step.
- All wizard steps, timeline graphics, icons, and later-stage imagery are likely bundled for the first screen.
- Large CSS is parsed upfront.

Recommended fix:

- Split `DrawflowIntake` into route-level and step-level components:
  - server shell,
  - step 1 address/project basics client island,
  - step 2+ wizard chunks dynamically imported,
  - heavy visual/timeline modules dynamically imported after the first interaction.
- Replace `flushSync` step changes with normal React state unless there is a measured layout correctness reason.
- Lazy-load below-the-fold milestone/timeline images and move late-step image constants into the step modules that use them.
- Split `buildpath.css` into CSS modules or route-local CSS loaded only by the relevant step/section.
- Audit the 941 KB property site plan foreground and resize/export multiple responsive WebP/AVIF variants.

Priority: P0.

### 4. Home page mixes static content with animation-heavy client behavior

Evidence:

- `/` imports `FairlendScrollChoreography`, `FairlendLandingHero`, `FairlendRouteSelector`, `FairlendBuildModelSection`, `FairlendBuilderConsultingSection`, and `FairlendFaqSection`.
- `FairlendBuilderConsultingSection/index.tsx` is 4,331 lines and imports `next/image`, many `lucide-react` icons, custom icon components, `useEffect`, `useRef`, and `FairlendBuilderConsultingMotion`.
- `FairlendBuilderConsultingSection/Motion.client.tsx` imports `gsap` and `gsap/ScrollTrigger`, registers ScrollTrigger, creates many timelines, and calls `ScrollTrigger.refresh()`.
- `FairlendBuildModelSection/BuildModelMotion.client.tsx` is a client motion helper.
- `FairlendFaqSection/FairlendFaqSection.client.tsx` imports `d3-shape` according to dependency scanning and renders images.

Impact:

- The home page has multiple independent animation systems: GSAP, client scroll choreography, Motion, CSS animations, and SVG/path work.
- Static marketing copy, cards, and timelines are coupled to client animation setup.
- ScrollTrigger and animated progress effects can cause main-thread work during scroll.

Recommended fix:

- Make each home section server-rendered by default.
- Keep motion in separate optional client islands mounted only when the section is near viewport via `IntersectionObserver`.
- Replace GSAP scroll-linked effects with CSS `animation-timeline` only where browser support is acceptable, or static/low-motion states where not.
- Split `FairlendBuilderConsultingSection/index.tsx` into smaller server components and a small motion controller.
- Dynamically import `d3-shape`/FAQ route drawing only when the FAQ visual is visible.

Priority: P0.

### 5. Global and route CSS volume is too high

Evidence:

- `src/app/(frontend)/globals.css` is 65.2 KB and 2,448 lines.
- `src/components/DrawflowIntake/buildpath.css` is 206.2 KB and 10,954 lines.
- `src/components/FairlendBuildModelSection/build-model.css` is 43.8 KB and 2,102 lines.
- `src/components/FairlendAboutStorySection/styles.css` is 21.5 KB.
- Borrower/investor/partner pages import many plain CSS files from section components.

Impact:

- CSS parsing and style recalculation cost grows across routes.
- Plain global CSS imports are easy to over-ship and hard to tree-shake.
- Large animation-heavy CSS files increase memory and style invalidation costs.

Recommended fix:

- Convert section CSS to CSS modules where possible.
- Split enormous CSS files by actual visible step/section.
- Delete generated/duplicate selectors in `buildpath.css`; 10,954 lines is not reasonable for one form experience.
- Move reusable primitives to Tailwind/cva where it reduces selector count.
- Add a simple CSS budget check script that reports file sizes over 20 KB and fails over agreed thresholds.

Priority: P0.

### 6. Font loading blocks early rendering and over-fetches families/weights

Evidence:

- `src/app/(frontend)/globals.css` starts with a Google Fonts CSS import:
  - Architects Daughter
  - DM Serif Display
  - Inter 400/500/600/700
  - League Gothic
  - Oxanium 400/500/600/700/800

Impact:

- CSS `@import` delays font discovery.
- Five families with many weights increase network and font layout work.
- Fonts are global even when only a subset of routes need them.

Recommended fix:

- Replace the CSS `@import` with `next/font/google` in the frontend layout.
- Limit weights per route/section.
- Use CSS variables from `next/font` and assign route-specific display fonts only where needed.
- Confirm all fonts use `display: swap`.

Priority: P1.

### 7. External texture images add avoidable requests and fragility

Evidence:

- `globals.css` references multiple `https://www.transparenttextures.com/patterns/...` URLs.
- `FairlendBuildModelSection/build-model.css` references `https://www.transparenttextures.com/patterns/fabric-of-squares.png`.

Impact:

- External texture requests add latency, DNS/TLS work, and privacy/cache variability.
- If the third-party host is slow or unavailable, visual rendering degrades unpredictably.

Recommended fix:

- Self-host any texture that must remain.
- Prefer CSS gradients/noise generated locally or remove the texture layers.
- For route-specific textures, load them only on the routes that use them.

Priority: P1.

### 8. Public asset folder contains substantial stale weight

Evidence:

- Static scan found 151 apparently unreferenced public assets totaling about 116.3 MB.
- Breakdown: 98.2 MB PNG, 17.3 MB WebP, 0.7 MB JPG.
- Top stale assets include:
  - `public/assets/drawflow-intake/Property Site Plan Foreground.png` - 3.1 MB
  - `public/assets/drawflow-intake/Build Progression Series.png` - 2.9 MB
  - `public/assets/drawflow-intake/Build Progression Series (1-4).png` - 2.6-2.9 MB each
  - `public/mobileHero.png` - 2.7 MB
  - `public/assets/mobileHero.png` - 2.4 MB
  - `public/assets/fairlend-hero-jun-26-2026.png` - 2.4 MB
  - many `public/assets/visual-assets/small-residential-construction/*.png` files at 1.7-2.2 MB each.

Impact:

- Public assets are not automatically downloaded unless referenced, but they increase deployment size, upload time, cache invalidation surface, and accidental future misuse risk.

Recommended fix:

- Move unreferenced raw/source images out of `public` into `artifacts/` or external design storage.
- Keep only production-ready responsive derivatives in `public`.
- Add an asset inventory script that fails if unreferenced public assets exceed a small threshold.

Priority: P1.

### 9. Referenced images still need responsive budgets

Largest referenced assets found:

| Asset | Size | Dimensions | Usage |
| --- | ---: | ---: | --- |
| `public/assets/drawflow-intake/Property Site Plan Foreground-optimized.webp` | 941 KB | 1536x1024 | `DrawflowIntake` |
| `public/assets/partners/partner-lifecycle-exit.webp` | 496 KB | 1678x937 | partner lifecycle |
| `public/assets/partners/partner-lifecycle-site.webp` | 442 KB | 1672x941 | partner lifecycle |
| `public/assets/partners/partner-lifecycle-build.webp` | 356 KB | 1672x941 | partner lifecycle |
| `public/assets/about-webp/webp/toronto-skyline-sketch-optimized.webp` | 347 KB | 1681x847 | about/overview |
| `public/assets/fairlend/toronto-hero-16x10/cloud-upper-east-large.webp` | 303 KB | 1721x695 | landing hero |
| `public/assets/right-house-estate.webp` | 262 KB | 1448x1086 | builder consulting |
| `public/assets/drawflow-intake/Milestone Blueprint Stack Trimmed.webp` | 250 KB | 641x1456 | intake |
| `public/assets/drawflow-intake/Multiplex Transparent Asset.webp` | 246 KB | 1418x987 | intake |
| `public/assets/drawflow-intake/Build Progress Lot/Foundation/Structure*.webp` | 235-237 KB each | 1536x1024 | intake |

Impact:

- Several images are bigger than their likely displayed size, especially decorative clouds, lifecycle images, and step illustrations.
- Large hero/section image stacks can delay LCP or compete with hydration.

Recommended fix:

- Generate AVIF and WebP responsive variants at realistic display widths.
- Use `sizes` precisely on all `next/image` usages.
- Keep only the one LCP image `priority`; ensure below-fold section images are lazy.
- Consider CSS/background simplification for decorative clouds and texture images.

Priority: P1.

### 10. Raw `<img>` tags bypass Next image optimization

Evidence:

- `src/components/FairlendAboutStorySection/index.tsx` uses raw `<img>`.
- `src/components/dynamic-arrow/dynamic-hero.tsx` uses raw `<img>`.
- `src/components/glow-card-grid.tsx` uses raw `<img>` for avatars.
- `src/components/Media/ImageMedia/index.tsx` supports optimized `next/image`, but legacy/raw tags still exist elsewhere.

Impact:

- Raw image tags do not get automatic sizing, lazy loading defaults, format negotiation, or layout stability from `next/image`.

Recommended fix:

- Replace production raw `<img>` usages with `next/image` or the existing `Media/ImageMedia` abstraction.
- Allow raw `<img>` only for known tiny icons/SVGs or generated canvas-like UI where optimization is not useful.

Priority: P1.

### 11. `lucide-react` is imported across too many client files

Evidence:

- Dependency scan found `lucide-react` imports in 350 source files.
- It appears in global footer/nav, intake, borrower/investor/partner sections, and many decorative components.

Impact:

- Lucide is usually tree-shakeable, but widespread use across client components increases shared chunk pressure and icon hydration work.
- Decorative icon-heavy sections become expensive when marked client-side.

Recommended fix:

- Keep icon-heavy sections server-rendered.
- Use inline server-rendered SVG or local icon wrappers for static decorative icons.
- Avoid importing icon libraries into global client chrome where a single inline SVG would do.

Priority: P2.

### 12. GSAP/ScrollTrigger should not be in critical route execution

Evidence:

- `FairlendBuilderConsultingSection/Motion.client.tsx` imports `gsap` and `gsap/ScrollTrigger`.
- It creates timelines, sets many elements, tracks scroll, and refreshes ScrollTrigger.

Impact:

- GSAP adds bundle weight and scroll-time main-thread work.
- This can hurt INP/scroll smoothness on mid-range devices.

Recommended fix:

- Dynamically import the motion controller only after the section is near viewport.
- Serve static markup first.
- Gate all ScrollTrigger setup behind reduced-motion, pointer/device checks, and visibility.
- Prefer transform/opacity only and avoid animating layout-affecting properties.

Priority: P1.

### 13. Payload CMS page/post routes need cache and query discipline

Evidence:

- `/:slug` and `/posts/:slug` use `draftMode`, `getPayload`, `payload.find`, `generateStaticParams`, and `cache(...)`.
- `/posts`, `/posts/page/:pageNumber`, and `/search` call `getPayload` and `payload.find`.
- CMS rendered pages include `RenderHero`, `RenderBlocks`, `LivePreviewListener`, and block components with their own client risks.

Impact:

- Dynamic Payload calls can become TTFB bottlenecks if query depth, select fields, or cache tags are not constrained.
- Live preview listeners should never ship to normal public traffic.

Recommended fix:

- Audit `payload.find` calls for `select`, `depth`, `limit`, and pagination.
- Keep `draftMode` / `LivePreviewListener` strictly draft-only.
- Ensure generated static params cover the high-traffic public pages.
- Add route revalidation tags for pages/posts and avoid uncached default queries.
- For `/search`, do not fetch heavy results before a real query exists.

Priority: P1.

### 14. Borrower and investor pages import many independent CSS/client sections

Evidence:

- Borrower route uses ten sections: hero, problem, solution, scenarios, differentiators, process, trust proof, FAQ, consultation, rail.
- Investor route uses fifteen sections.
- CSS import scan shows many section-level plain CSS files: `borrower-hero.css`, `borrower-solution.css`, `borrower-scenarios.css`, `investor-hero.css`, `investor-process.css`, `investor-faq.css`, and others.
- Several borrower/investor components import `lucide-react`; FAQ/form sections are client-side.

Impact:

- These pages can accumulate CSS and icon weight section by section.
- FAQ and form interactions may make whole sections client-side when only disclosure/form state needs hydration.

Recommended fix:

- Make content sections server components.
- Extract FAQ accordion triggers and form fields as small islands.
- Convert section CSS into scoped modules or Tailwind/cva patterns.
- Share one lightweight section primitive instead of separate large CSS files per section.

Priority: P1.

### 15. Partner page image lifecycle assets are large

Evidence:

- Partner lifecycle assets are among the largest referenced production images:
  - `partner-lifecycle-exit.webp` - 496 KB
  - `partner-lifecycle-site.webp` - 442 KB
  - `partner-lifecycle-build.webp` - 356 KB

Impact:

- If these appear near the top of `/partners`, they can compete with hero LCP and initial JS.

Recommended fix:

- Produce smaller responsive variants.
- Lazy-load lifecycle images unless they are above the fold.
- Consider art-directed mobile crops instead of serving 1670px-wide images to small screens.

Priority: P1.

### 16. Feedback content pages inherit unnecessary route selector/icon cost

Evidence:

- `/garden-suite`, `/garden-suite-financing-gta`, `/construction-draw-financing`, `/multiplex-financing-gta`, and `/affordable-sustainable-rental-housing` use `FairlendFeedbackContentPage`.
- Their dependency graph includes `FairlendRouteSelector` assets and `lucide-react` through `FairlendRouteSelector/types.ts`.

Impact:

- These pages are relatively simple but still risk importing route selector imagery/icons plus global chrome.

Recommended fix:

- Ensure `FairlendFeedbackContentPage` does not import route selector assets unless the route selector section is actually rendered.
- Move icon imports from shared types into render files or use serializable icon names mapped at the leaf.
- Keep the body server-rendered and lazy-load any route selector/CTA visual below the fold.

Priority: P2.

### 17. Search page should avoid default heavy work

Evidence:

- `/search` uses `getPayload` and `payload.find`.
- It also has a `search/page.client.tsx` header-theme effect.

Impact:

- Search pages often get crawled or loaded empty; default heavy queries waste TTFB.

Recommended fix:

- Return an empty lightweight shell when no query is present.
- Debounce client query input and hit a narrow search API.
- Limit selected fields and result count.
- Cache popular searches where appropriate.

Priority: P2.

### 18. Theme/header side effects exist as route-level client files

Evidence:

- Several route client files (`[slug]/page.client.tsx`, posts pages, search page) only use `useHeaderTheme` and `useEffect`.

Impact:

- Small individually, but these create unnecessary client boundaries for what appears to be visual chrome state.

Recommended fix:

- Move header theme decisions into server-rendered route metadata/context when possible.
- If runtime theme switching is required, consolidate this into one tiny chrome island rather than per-route client files.

Priority: P2.

### 19. Local live script is present in frontend layout

Evidence:

- `src/app/(frontend)/layout.tsx` renders `<Script src="http://localhost:8400/live.js" strategy="afterInteractive" />`.

Impact:

- If not guarded to development only, production users can pay a failed network request and console noise.

Recommended fix:

- Wrap this script with a strict development-only environment check.
- Prefer not to render it in production HTML at all.

Priority: P0 if production, P3 if dev-only through environment controls elsewhere.

### 20. Bundle visibility is missing

Evidence:

- No bundle analyzer configuration was found in `next.config.ts`.
- Current audit had to rely on static source/import analysis.

Impact:

- Regressions in shared chunks, route chunks, and third-party JS can land unnoticed.

Recommended fix:

- Add `@next/bundle-analyzer` gated by `ANALYZE=true`.
- Track budgets for:
  - shared first-load JS,
  - route JS for `/`,
  - route JS for `/start/builder`,
  - CSS per route,
  - image bytes above the fold.
- Add a documented `pnpm analyze` command.

Priority: P1.

## Recommended Fix Plan

### Phase 1: Stop global over-shipping

1. Split `AnalyticsProvider` into idle/consent/provider chunks.
2. Server-render footer and nav; isolate tiny interactive islands.
3. Guard or remove the localhost live script from production layout.
4. Replace global Google Fonts `@import` with `next/font`.

Expected result: lower first-load JS and less main-thread contention on every route.

### Phase 2: Fix the two heaviest routes

1. Refactor `DrawflowIntake` into step-level dynamic modules.
2. Split `DrawflowIntake/buildpath.css`.
3. Lazy-load or downsize intake imagery.
4. Split home page animation controllers from static sections.
5. Lazy-mount GSAP/ScrollTrigger only near viewport.

Expected result: major improvements to `/`, `/start/builder`, and `/construction-financing`.

### Phase 3: Clean assets and CSS

1. Remove/move 116.3 MB of apparently unreferenced public assets.
2. Generate responsive AVIF/WebP variants for the largest referenced images.
3. Convert heavy plain CSS files to scoped modules or smaller route-local imports.
4. Self-host or remove external texture images.

Expected result: smaller deploys, faster style parsing, more predictable image delivery.

### Phase 4: Add performance guardrails

1. Add bundle analyzer script.
2. Add asset inventory script.
3. Add CSS size budget script.
4. Document performance budgets per route.

Expected result: fewer regressions and a repeatable way to prove improvements.

## Suggested Budgets

Initial targets:

| Surface | Target |
| --- | ---: |
| Shared first-load JS for public static pages | under 120 KB gzip |
| `/` route additional JS | under 90 KB gzip excluding analytics |
| `/start/builder` first-step JS | under 120 KB gzip before later steps |
| Route CSS, excluding Tailwind base | under 40 KB parsed per route |
| Above-the-fold image bytes on mobile | under 250 KB |
| Largest single production image | under 300 KB unless it is confirmed LCP |
| Unreferenced `public` production assets | near 0 MB |

## Files To Inspect First During Implementation

- `src/app/(frontend)/layout.tsx`
- `src/components/Analytics/AnalyticsProvider.client.tsx`
- `src/Footer/Component.tsx`
- `src/Footer/WatermelonFooter.client.tsx`
- `src/Header/Component.client.tsx`
- `src/Header/Nav/index.tsx`
- `src/components/DrawflowIntake/DrawflowIntake.client.tsx`
- `src/components/DrawflowIntake/buildpath.css`
- `src/components/FairlendBuilderConsultingSection/index.tsx`
- `src/components/FairlendBuilderConsultingSection/Motion.client.tsx`
- `src/components/FairlendBuildModelSection/build-model.css`
- `src/app/(frontend)/globals.css`
- `src/app/(frontend)/[slug]/page.tsx`
- `src/app/(frontend)/posts/[slug]/page.tsx`
- `src/app/(frontend)/search/page.tsx`

## Measurement Checklist For The Follow-Up Fix PR

After implementing fixes, run these in a branch where builds/tests are allowed:

1. `ANALYZE=true pnpm build`
2. Lighthouse mobile for `/`, `/start/builder`, `/borrowers/private-mortgage-financing`, `/investing/private-mortgage-lending`, `/partners`, `/search`, and `/en/brokerage/privacy-policy`.
3. Compare first-load JS, route JS, CSS, LCP image bytes, Total Blocking Time, INP, and CLS.
4. Confirm analytics scripts do not load before consent/eligibility.
5. Confirm no production page requests `http://localhost:8400/live.js`.
6. Confirm all production images above the fold have correct `sizes`, dimensions, and priority only when they are actual LCP candidates.
