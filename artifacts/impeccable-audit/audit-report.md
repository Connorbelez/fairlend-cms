# Impeccable Audit Report

Date: 2026-06-22
Scope: `/`, `/intake`, `/fairlend-landing-hero`, `/posts`, `/search`, and 404 at desktop `1440x900` and mobile `390x844`.

Raw evidence: `artifacts/impeccable-audit/audit-results.json`
Screenshots: `artifacts/impeccable-audit/*.png`

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|---:|---:|---|
| 1 | Accessibility | 3 | Repeated orange accent text fails AA contrast on cream backgrounds. |
| 2 | Performance | 3 | App compiles, but Drawflow still uses many raw `<img>` elements flagged by Next lint. |
| 3 | Responsive Design | 4 | No horizontal overflow across audited desktop/mobile routes. |
| 4 | Theming | 2 | Brand colors are heavily hard-coded and no `DESIGN.md` token contract exists. |
| 5 | Anti-Patterns | 3 | Mostly distinctive; remaining card grids and hard-coded accent usage are the main tells. |
| **Total** |  | **15/20** | **Good: releaseable with targeted fixes.** |

## Anti-Patterns Verdict

Pass, with caveats. The site does not read like a generic AI finance template: the map-led hero, construction path framing, Drawflow intake, and Fairlend-specific copy give it a real point of view. The remaining AI-adjacent tells are mostly implementation/system issues rather than composition: repeated card-grid structures, a single orange accent used below contrast thresholds, and a large amount of hard-coded color.

## Executive Summary

- Audit Health Score: **15/20** (Good)
- Issues found: **0 P0**, **1 P1**, **4 P2**, **1 P3**
- Verified strengths: all audited routes return expected status, no horizontal overflow, no missing image alt attributes, no unnamed controls, no unlabeled visible inputs, reduced motion disables audited decorative animations.

## Detailed Findings

### [P1] Orange accent text fails WCAG AA contrast

- Location: `src/components/FairlendLandingHero/index.tsx:214`, `src/components/FairlendTestimonialsMarquee/index.tsx:56`, `src/components/FairlendServicesSection/index.tsx:350`, `src/components/FairlendServicesSection/index.tsx:395`, `src/components/FairlendServicesSection/index.tsx:779`, `src/app/(frontend)/posts/page.tsx:34`
- Category: Accessibility
- Impact: Small orange text and links sit around `2.99:1` to `3.45:1` against cream backgrounds. Large display orange is borderline acceptable, but small labels, emphasized inline copy, and CTA text miss the 4.5:1 AA threshold.
- WCAG/Standard: WCAG 2.2 SC 1.4.3 Contrast (Minimum)
- Recommendation: Darken the orange used for text-only accent roles, or split the accent token into display orange and text orange.
- Suggested command: `impeccable colorize`

### [P2] Several visible desktop controls are under the preferred 44px target

- Location: `src/components/directional-hover-header/header.css:106`, `src/components/directional-hover-header/header.css:139`, `src/components/directional-hover-header/header.css:542`, `src/components/directional-hover-header/header.css:566`, `src/components/FairlendServicesSection/index.tsx:350`, `src/components/FairlendServicesSection/index.tsx:395`
- Category: Accessibility / Responsive
- Impact: Desktop header controls measure 40-42px tall, the `FR` language link is only 15px wide, service text links measure about 23px tall, and some service detail triggers are 36px high on large screens. This is usable with a mouse but brittle for touch laptops, zoomed UIs, and motor-impaired users.
- WCAG/Standard: WCAG 2.2 SC 2.5.8 Target Size (Minimum), plus project target of 44px where practical.
- Recommendation: Normalize header/action/link hit areas to at least 44px in both axes using padding/min dimensions without changing visual density.
- Suggested command: `impeccable adapt`

### [P2] Shared CMS header links render as short text-height targets

- Location: `src/Header/Nav/index.tsx:17`, `src/components/Link/index.tsx:45`, `src/components/Link/index.tsx:59`
- Category: Accessibility / Component System
- Impact: On non-home pages, `Posts` and `Contact` render as roughly 20px-tall controls through `appearance="link"` and `Button` size `clear`. The search icon is 40px. This creates inconsistent interactive affordances in the same nav.
- WCAG/Standard: WCAG 2.2 SC 2.5.8 Target Size (Minimum)
- Recommendation: Add a nav-specific class/variant for CMS links or make `appearance="link"` preserve a minimum interactive height when used in navigation.
- Suggested command: `impeccable extract`

### [P2] Drawflow image-heavy screen is still not fully optimized

- Location: `src/components/DrawflowIntake/DrawflowIntake.client.tsx:630`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx:787`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx:799`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx:852`, plus the remaining lint-reported `<img>` lines in the same file.
- Category: Performance
- Impact: `pnpm lint` reports 23 raw `<img>` warnings in the Drawflow intake. The route works, but it leaves LCP/bandwidth optimization to manual image sizing/loading.
- WCAG/Standard: Next.js performance guidance, Core Web Vitals risk.
- Recommendation: Convert non-decorative and high-impact raster assets to `next/image`, keep truly decorative/complex layered assets only where the conversion would break composition.
- Suggested command: `impeccable optimize`

### [P2] Theme/token system is incomplete

- Location: `src/app/(frontend)/globals.css`, `src/components/FairlendLandingHero/index.tsx:118`, `src/components/FairlendServicesSection/index.tsx:747`, `src/components/DrawflowIntake/buildpath.css`
- Category: Theming
- Impact: Static scan found hundreds of hard-coded `#`, `rgb()`, and `oklch()` values in public surface files. Some are appropriate for a bespoke brand page, but without `DESIGN.md` and extracted role tokens, contrast/theming fixes require hunting through components.
- WCAG/Standard: Maintainability and theme consistency.
- Recommendation: Run `impeccable document`, then extract role tokens for text accent, display accent, panel, border, and muted copy.
- Suggested command: `impeccable document`, then `impeccable extract`

### [P3] Browser console reports one 404 resource during route sweep

- Location: Runtime, captured in `artifacts/impeccable-audit/audit-results.json`
- Category: Performance / Robustness
- Impact: The audited pages render correctly, but the browser logged `Failed to load resource: the server responded with a status of 404 (Not Found)`. This is likely a missing ancillary asset, favicon, or dev route resource. It is not currently blocking the page.
- WCAG/Standard: N/A
- Recommendation: Inspect the network panel or extend the audit script to capture failed request URLs.
- Suggested command: `impeccable harden`

## Positive Findings

- All audited routes returned expected statuses.
- No horizontal overflow on desktop or mobile.
- No missing `alt` attributes on rendered images.
- No visible form controls without labels.
- No interactive controls without accessible names.
- Reduced-motion emulation worked: Fairlend reveal/card animations and Drawflow page animations were disabled.
- TypeScript passed: `pnpm exec tsc --noEmit`.
- Lint passed with `0 errors`; warnings are performance/type hygiene, not build blockers.

## Recommended Actions

1. **[P1] `impeccable colorize`**: Split accent color roles and fix orange-on-cream text contrast without flattening the brand.
2. **[P2] `impeccable adapt`**: Normalize header, nav, service, and inline CTA target sizes to at least 44px where practical.
3. **[P2] `impeccable optimize`**: Convert high-impact Drawflow images to optimized image handling.
4. **[P2] `impeccable document` + `impeccable extract`**: Formalize `DESIGN.md` and extract reusable Fairlend color roles.
5. **[P3] `impeccable harden`**: Identify the 404 resource URL and clean up the remaining runtime warning.
6. **Final pass: `impeccable polish`** after fixes.

Re-run `impeccable audit` after fixes to see the score improve.
