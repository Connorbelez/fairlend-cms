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

- The hero and service selector remain server-rendered in the initial document.
- The overview, build model, builder consulting, leadership, team, and FAQ sections load when their boundary is within 1,200 px of the viewport.
- The global GSAP choreography enhancement loads during browser idle time instead of competing with initial hydration.
- The landing-rail pointer effect uses CSS transitions instead of loading `motion/react` for four decorative dots.
- Browsers without `IntersectionObserver` immediately render all deferred sections as a compatibility fallback.

## Validation

- Targeted ESLint validation passes for every changed TypeScript/TSX file.
- The root route returns HTTP 200 after the change.
- The initial document intentionally excludes deferred section markup; the sections are fetched and rendered by the near-viewport boundary.
- No build, Playwright, E2E, or test suite was run, per the repository instructions for landing-page-only changes.
