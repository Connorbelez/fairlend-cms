# Root route load-time optimization

## Goal

Reduce the warm development-server document load time for `/` by at least 50% without changing the immediately visible hero or service-selector content.

## Measurement

Measurements were taken against the existing Next.js development server at `http://localhost:4318/` on July 12, 2026. The route was warmed before sampling. Response time includes fetching and consuming the complete HTML document. Initial asset bytes are the unique `/_next/static/` resources referenced by that HTML.

Development mode includes Turbopack and React development overhead, so absolute byte counts are not production bundle sizes. The before/after comparison uses the same server, route, machine, and measurement script.

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Warm median document load | 1,075 ms | 317.4 ms | -70.5% |
| Initial HTML | 885,863 B | 334,443 B | -62.2% |
| Initially referenced JavaScript | 8,721,565 B | 7,663,882 B | -12.1% |

The after latency is the median of 11 warm requests. The sample ranged from 167.1 ms to 966.7 ms; the larger sample prevents unrelated development-server activity from dominating the result.

## Implementation

- The hero and overview remain fully server-rendered in the initial document.
- The route selector, build model, builder consulting, leadership, team, ethos, and FAQ rails emit compact semantic Server Component fallbacks in the initial document; their rich visual modules load near the viewport.
- The global GSAP choreography enhancement loads during browser idle time instead of competing with initial hydration.
- The landing-rail pointer effect uses CSS transitions instead of loading `motion/react` for four decorative dots.
- Browsers without `IntersectionObserver` immediately render all deferred sections as a compatibility fallback.

## Validation

- Targeted ESLint validation passes for every changed TypeScript/TSX file.
- The root route returns HTTP 200 after the change.
- The initial document intentionally excludes the deferred rich section markup and client bundles while retaining crawlable headings, copy, and links in each rail's static fallback.
- No build, Playwright, E2E, or test suite was run, per the repository instructions for landing-page-only changes.

## July 15, 2026 production-preview follow-up

The homepage was subsequently split into a route-specific critical stylesheet and a deferred
homepage stylesheet. The route selector, long-form landing rails, footer, motion-enhanced
offering deck, and analytics integration no longer compete with the first visual response. The
decorative Toronto artwork is drawn to low-priority canvases so it cannot become the LCP
candidate, and the first-paint offering card no longer fetches the three hidden card images.

The last complete three-run cold-cache set before the presentation pass produced a desktop
median Lighthouse score of 99 and a mobile median of 78. The mobile set had a 4.591 s median
simulated LCP and a 2.299 s median observed LCP. A later single run against the exact optimized
source scored 89 with a 1.294 s observed LCP. The requested mobile/LCP thresholds therefore
remain unverified as medians; the current speed was explicitly accepted before the UI/UX pass.

The presentation pass fixed three loading-sequence defects without moving work back onto the
critical path:

- The financing-card deck now animates its depth with compositor transforms instead of
  `top`/`left`, eliminating the recurring layout shift on each 3.2-second rotation.
- Low-priority skyline canvases fade in after drawing instead of appearing in a single frame.
- Deferred rails and the footer retain their height reservation through the lazy-module and
  Suspense handoff. A pending chunk can no longer collapse its section, pull all later observers
  into range, and then expand the document in one burst.
- Every deferred homepage rail now paints a polished semantic fallback instead of blank reserved
  space. The fallback remains mounted through the Suspense handoff, is readable without
  JavaScript, and is replaced only when the richer section module is ready. The complete contract
  is documented in
  [`docs/architecture/llm-static-rendering.md`](../architecture/llm-static-rendering.md).

The final protected Vercel preview compiled successfully, completed TypeScript validation, and
generated all static routes. Browser inspection covered 390×844, 600×900, 768×1024, 1024×900,
and 1440×900 viewports, including long-scroll deferred hydration. No horizontal overflow or
application console errors were present. No local build, Playwright, E2E, or test suite was run,
per the repository instructions for marketing-page-only changes.

## July 15, 2026 comparable cold-cache Lighthouse matrix

Lighthouse 13.4.0 ran sequentially against the final presentation/static-rendering source on the
protected Vercel preview. Each trial used a new Chrome profile and Lighthouse's `simulate`
throttling. The Vercel bypass cookie was seeded against `/robots.txt`, Chrome was closed, and the
same otherwise-empty profile was relaunched before the audited homepage navigation. This keeps
the protected preview accessible without warming the homepage document or its resources.

| Form factor | Trial | Performance | FCP | Simulated LCP | Observed LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 1 | 94 | 1.335 s | 3.094 s | 0.349 s | 22 ms | 0.000031 |
| Mobile | 2 | 93 | 1.565 s | 3.099 s | 0.341 s | 7 ms | 0.000031 |
| Mobile | 3 | 97 | 1.226 s | 2.513 s | 0.331 s | 39 ms | 0.000031 |
| **Mobile median** | — | **94** | **1.335 s** | **3.094 s** | **0.341 s** | **22 ms** | **0.000031** |
| Desktop | 1 | 100 | 0.479 s | 0.711 s | 0.392 s | 0 ms | 0.000003 |
| Desktop | 2 | 99 | 0.386 s | 1.028 s | 0.429 s | 0 ms | 0.000003 |
| Desktop | 3 | 99 | 0.499 s | 0.844 s | 0.309 s | 0 ms | 0.000003 |
| **Desktop median** | — | **99** | **0.479 s** | **0.844 s** | **0.392 s** | **0 ms** | **0.000003** |

The desktop >90 and mobile >80 score gates pass. The mobile simulated-LCP <2.0 s gate does not:
its median is 3.094 s, even though the median browser-observed LCP is 0.341 s. All three mobile
traces identify the `Financing for:` hero-title line as the LCP element. Its observed paint is
already effectively immediate; Lighthouse's Lantern simulation extends the metric through the
custom Cormorant typography dependency.

Hero-font subsetting, preloading, and critical data-URI embedding were measured on isolated
preview deployments. None brought simulated LCP below 2.0 s, and each experiment was reverted.
The remaining direct ways to force the simulated metric below the threshold are to replace or
materially change the hero typography, or to change the benchmark to observed/devtools LCP. Both
cross the goal contract's stop conditions: the former is an intentional design regression and the
latter makes the result non-comparable with the original simulated-throttling baseline.
