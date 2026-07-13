# Landing Hero Load Performance

Date: 2026-07-13

## Scope and acceptance target

The landing-page first viewport should be visually complete and stable within 1.5 seconds on a representative Fast 4G connection, with cumulative layout shift at or below 0.1 and without a multi-second staged reveal.

The repository instructions prohibit builds, Playwright, E2E, and test runs for landing-page-only changes. Verification therefore uses the existing Next.js dev server, a dependency-free Chrome DevTools Protocol profiler, fixed viewport/network settings, source inspection, and browser-native screenshots. Absolute production timing must be confirmed after deployment because dev-mode Next.js payloads are intentionally unoptimized.

## Recorded failure timeline

The supplied 7.84-second, 99-frame recording showed:

- 0.0 seconds: header and application card were visible, but the primary proposition was blank.
- Approximately 2.0 seconds: the skyline and authority artwork appeared.
- Approximately 5.0 seconds: the headline and offering copy became readable.
- Approximately 6–7 seconds: the first viewport was still changing.

## Root causes

1. `FairlendTorontoHeroParallax` blocked the hero reveal on both `document.fonts.ready` and skyline image decoding, with a 2.2-second fallback.
2. After that gate opened, the title/copy added another 120–980ms delay plus 760–780ms blur and clip-path animations.
3. Eleven cloud instances were all marked `priority`, competing with the full-canvas contour map and skyline for critical network bandwidth.
4. GSAP and `ScrollTrigger` were part of the initial hydration path even though they only add scroll parallax.
5. The hero underline used a client-only Motion/Rough Notation component for a decorative effect that can be rendered in CSS.
6. A global Google Fonts `@import` duplicated Inter and made four additional display families dependent on an external stylesheet.
7. During the first fix pass, profiling showed that lazy-loading the 64KB full-canvas contour map made it a late LCP candidate. It must be preloaded because it occupies nearly the entire viewport.
8. The root stylesheet imported approximately 312KB of source CSS for the builder intake, full lead-intake, and About Story flows, forcing unrelated routes to parse those styles.

## Permanent fixes

- Removed the font/image/hydration reveal gate. Hero copy is present in server-rendered HTML and visible from first paint.
- Reduced the initial motion to a low-amplitude 420ms title settle, 360ms copy settle, and a maximum 420ms cloud stagger. No initial element begins fully invisible.
- Explicitly preloaded the full-canvas contour map and skyline while making all eleven cloud instances lazy and low-priority.
- Deferred GSAP and `ScrollTrigger` imports to idle time while retaining the existing scroll-parallax behavior.
- Replaced the client-only headline underline with an equivalent CSS treatment.
- Replaced the external Google Fonts import with self-hosted `next/font` families. Noncritical display faces use `preload: false` and `display: swap`.
- Moved the builder-intake, lead-intake, and About Story stylesheets from the root stylesheet to their existing owning components so route-level CSS can be split correctly in production.
- Added `scripts/profile-hero-load.mjs` so the same cold-cache profile can be repeated without Playwright or Lighthouse.

## Verification evidence

Profiler configuration:

- Chrome headless via the DevTools Protocol
- 1440×900 viewport at 1× device scale
- fresh browser profile and disabled cache for each run
- Fast 4G: 4 Mbps down, 3 Mbps up, 20ms RTT
- three consecutive runs

Post-fix results on the existing dev server:

| Run | CLS | FCP | LCP | Hero complete | Settle after FCP |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 0 | 3816ms | 3816ms | 4093ms | 277ms |
| 2 | 0 | 4136ms | 4136ms | 4373ms | 237ms |
| 3 | 0 | 3860ms | 3860ms | 4106ms | 246ms |
| Average | 0 | 3937ms | 3937ms | 4191ms | 253ms |

The absolute dev-server navigation is not a deployable performance result: the current dev response is approximately 949KB of unoptimized HTML/RSC/debug data before its development JavaScript, which dominates a 4 Mbps throttle. The important code-path result is that LCP now occurs at FCP in all three runs, the full hero settles 237–277ms later, and CLS remains zero. The removed production-only delays previously added approximately 3–4 seconds after first paint by themselves.

Run the same profile against the deployed URL after release:

```bash
node scripts/profile-hero-load.mjs https://DEPLOYMENT_URL/ 3
```

Production acceptance remains: all three `lcpMs` and `heroCompleteMs` values at or below 1500ms, with `cls` at or below 0.1.
