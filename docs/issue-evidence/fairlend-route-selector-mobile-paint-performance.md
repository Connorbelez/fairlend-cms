# FairLend route selector mobile paint performance

Date: 2026-07-14  
Source: `CleanShot 2026-07-14 at 19.17.42.gif`  
Canvas: 377 × 800  
Frames: 116  
Duration: 8.26 seconds

## Observed failure

The hero is complete before the route selector enters the viewport. During the fast mobile scroll:

- 4.76–6.02s: the hero hands off to the selector and its topographic paper plus “Find your fit” kicker paint.
- 6.44–6.86s: the viewport becomes almost entirely paper-white even though the selector heading is server-rendered and CSS-visible.
- 7.28s: the heading and description paint after the fling settles.

This is paint checkerboarding, not delayed Next.js rendering. `FairlendRouteSelector` is a Server Component with static copy and no fetch, Suspense boundary, effect, observer, or hydration-owned visibility state.

## Root cause

On a settled 390 × 844 mobile viewport, the selector is 4,257 CSS pixels tall. Its topographic image previously used `background-size: cover` on a full-height absolute layer inside an `isolation: isolate; overflow: hidden` rounded section.

Covering that tall, narrow box scales the 4:3 source to approximately 5,676 × 4,257 CSS pixels before device scaling. At a 3× device scale, that creates an unnecessarily large raster/compositing workload. Mobile WebKit can defer painting the content layer during a fast fling, while desktop remains unaffected because its route-selector surface is much shorter and wider.

## Fix

- Merged the paper overlay and topographic image into the section's native background, removing two full-section absolute layers.
- Replaced the mobile `cover` raster with a reusable 720px-high vertical background tile.
- Preserved the existing desktop `cover` composition at the `md` breakpoint and above.
- Removed the section-wide isolation, hidden overflow, and content `z-index` stacking surface.
- Kept the selector fully server-rendered. No client animation, observer, timeout, or hydration visibility state was added.

## Regression signal

`pnpm profile:route-selector -- http://localhost:4975/` uses Chrome DevTools Protocol directly—without Playwright or Lighthouse—to inspect the production-shaped mobile paint topology.

Before:

```text
isolation: isolate
overflowY: hidden
sectionHeightPx: 4257
mobilePaintRisk: true
verdict: FAIL
```

After:

```text
backgroundRepeat: no-repeat, repeat-y
backgroundSize: 100% 100%, auto 720px
isolation: auto
overflowY: visible
sectionHeightPx: 4257
mobilePaintRisk: false
serverFrameReady: title, description, card
verdict: PASS
```

The same profiler accepts `--desktop` to confirm the desktop background remains `cover` and the complete server frame remains present.

## Verification constraints

The landing-page repository rules prohibit builds, Playwright, E2E, and test-suite runs, so none were run. Scoped ESLint, Prettier, `git diff --check`, mobile/desktop CDP profiles, and source inspection are the verification surface.

The local browser-native screenshot attempt was excluded from evidence because an unrelated pre-existing Next.js development error overlay covered the page.
