# FairLend route selector GIF diagnosis

Date: 2026-07-14  
Source: `CleanShot 2026-07-14 at 15.16.31.gif`  
Logical canvas: 800 × 420  
Frames: 13  
Frame delay: 70 ms  
Observed span: 0–840 ms

## Frame-by-frame breakdown

| Frame | Time | Observed state | Failure point |
| ---: | ---: | --- | --- |
| 0 | 0 ms | The selector is fully rendered. The Construction CTA and complete process track are visible. | This is the correct server-rendered frame that should have remained stable. |
| 1 | 70 ms | Visually equivalent to frame 0. The GIF stores this as a smaller optimized delta, but the logical canvas is unchanged. | No application defect yet; this is the hydration boundary. |
| 2 | 140 ms | Card ink fades, cards shift, and the lower Construction CTA is clipped away even though it was already visible. | The client entrance controller has applied/restarted the card reveal after first paint. |
| 3 | 210 ms | The clipped/translated state advances unevenly across cards. Illustration and process content do not settle together. | Independent delays for cards, illustrations, lines, and dots produce internal tearing. |
| 4 | 280 ms | The section remains partially clipped and lower actions are still absent. | `clip-path` is hiding real interactive content during a decorative animation. |
| 5 | 350 ms | The viewport anchor changes enough for the preceding section heading to appear while the selector is still unsettled. | Scroll/paint state is no longer visually anchored during the hydration animation. |
| 6 | 420 ms | The Private mortgage service cell receives its direct hover background while the parent card is still in its entrance sequence. | Native link hover and section entrance motion are running concurrently. |
| 7 | 490 ms | Process dots begin changing independently of the card reveal. | The preview signal adds a third staggered timeline to the same card. |
| 8 | 560 ms | The Residential card begins acquiring lime preview treatment while Construction remains the configured selected route. | Proximity targeting creates a second, visually selected route. |
| 9 | 630 ms | More process dots turn lime and the Residential border/shadow continues transitioning. | A pointer in the section—not necessarily on the card—drives route selection state. |
| 10 | 700 ms | The Construction CTA abruptly returns while Residential still carries preview selection. | The clipped CTA popping back in exposes the delayed entrance completion; dual selection is now visible. |
| 11 | 770 ms | Residential lift/border/button settle later than its internal service and step states. | Parent and child transitions have different owners and durations. |
| 12 | 840 ms | The section is nearly settled but still presents Construction as selected and Residential as preview-selected. | Final state remains ambiguous even after the entrance sequence completes. |

## Root cause

The section had two client-owned state machines layered over server-rendered markup:

1. `FairlendRouteSelectorMotion` measured visibility after hydration and wrote `data-route-motion-state`. Global CSS then clipped, faded, transformed, and staggered the map, paper, heading, cards, illustrations, step lines, dots, and helper. The server initially emitted the complete frame, so attaching the client behavior could visually move the UI backward before replaying the entrance.
2. `FairlendRouteSelectorArrow` installed a section-wide pointer listener through `DynamicArrowCanvas`. Its target was `closest-to-pointer`, which selected a route even when the pointer was in whitespace. Target changes mutated card attributes and launched another border/lift/shadow/dot sequence.

These systems also competed with each card's normal Tailwind hover and selected variants. The result was multiple concurrent visual authorities for `transform`, `translate`, border, shadow, opacity, clip path, and step-dot color.

## Permanent fix

- Removed both route-selector client leaves.
- Removed the observer, scroll/resize listeners, timeout fallback, match-media listeners, requestAnimationFrame signaling, section-wide pointer targeting, and route-preview DOM mutation.
- Removed the route-selector animation keyframes, global state selectors, reduced-motion cleanup overrides, and motion-only data attributes/CSS variables.
- Removed the now-unused `DynamicArrowCanvas.onTargetChange` extension that existed only for route preview mutation.
- Preserved the existing server-rendered card composition, explicit desktop grid, semantic links, selected-route variant, and direct link/card hover/focus behavior.

## Verification contract

The selector now has one visual state source: server props plus direct CSS pseudo-classes. A settled first paint cannot regress into a hidden state because no client code can write an entrance or preview attribute, and whitespace cannot select a route because no section-wide pointer listener exists.

## Verification performed

- Source invariant passed: no route animation controller, preview attribute, preview keyframe, motion-state selector, or canvas target-change callback remains under `src`.
- Server-only invariant passed: `FairlendRouteSelector` contains no client directive, effect, observer, pointer listener, or animation-frame loop.
- Scoped ESLint passed for the changed TypeScript/TSX files.
- Prettier check passed for the changed TypeScript/TSX and documentation files.
- `git diff --check` passed.
- The landing-page repository rule explicitly prohibits builds, Playwright, E2E, and test-suite runs, so none were run.
- The design hook's existing dense-card font-size advisories remain intentional, previously documented route-selector type exceptions; this fix does not alter typography or palette tokens.
