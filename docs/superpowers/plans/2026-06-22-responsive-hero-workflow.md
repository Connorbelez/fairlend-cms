<!-- markdownlint-disable MD013 -->

# Responsive Hero Audit Loop Implementation Plan

> **For agentic workers:** REQUIRED ORCHESTRATION: Use pi-subagents staged orchestration to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the Fairlend landing hero responsively without degrading the golden `1080x1920` composition or currently-good mobile layouts.

**Architecture:** Use a single-writer iteration loop. Each round captures viewport evidence, fans out read-only `/impeccable audit` subagents per screen size, synthesizes their findings into one fix brief, then hands only that brief to one worker. Repeat until all required viewports pass or the loop reaches the round cap.

**Tech Stack:** Next.js, React, Tailwind v4 custom variants, Playwright, `agent-browser`/screenshots, Pi subagents with `impeccable` audit/adapt guidance.

---

## Preflight already checked

`node /Users/connor/.agents/skills/impeccable/scripts/load-context.mjs` reports:

- `PRODUCT.md`: present, brand register.
- `DESIGN.md`: present.
- Brand goal: premium map-led Fairlend hero, not generic finance SaaS.
- Key invariant: the map, route, cards, boats, copy, and application entry point must support the financing story without clutter.

Implementation worker should state before mutating files:

```text
IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:responsive audit loop uses viewport screenshots mutation=open
```

---

## Files and responsibilities

**Likely modify:**

- `src/components/FairlendLandingHero/index.tsx`
  - Main hero stage sizing, map/copy/form composition, landscape and tablet layout rules.
  - Current pressure points include `--hero-stage-height`, `--hero-stage-width`, `hero-landscape:*`, and `hero-tablet:*` classes.
- `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx`
  - Form panel size, landscape placement, tab/input scaling, CTA target sizing.
- `src/components/FairlendLandingHero/FairlendHeroProcess.tsx`
  - Route/process overlay positioning at non-golden aspect ratios.
- `src/components/FairlendLandingHero/FairlendBoatLayer.client.tsx`
  - Boat scale/path if audits show visual-object drift.
- `src/components/FairlendLandingHero/FairlendRouteOverlay.client.tsx`
  - Route overlay alignment if map crop changes.
- `src/app/(frontend)/globals.css`
  - Custom hero variants and shared CSS variables only if class-level fixes become too brittle.

**Create or modify for verification:**

- `tests/e2e/fairlend-hero-responsive.spec.ts`
  - Playwright viewport matrix, screenshots, DOM metrics, overflow assertions.
- `artifacts/responsive-hero/round-N/`
  - Generated screenshots and metrics JSON for each loop round. Do not commit unless intentionally preserving evidence.

---

## Viewport matrix

Required audit targets:

| ID                |        Size | Purpose                                                 |
| ----------------- | ----------: | ------------------------------------------------------- |
| `golden-portrait` | `1080x1920` | Preserve the known-good composition.                    |
| `mobile-390`      |   `390x844` | Mobile smoke, already acceptable but must not regress.  |
| `mobile-430`      |   `430x932` | Large mobile smoke.                                     |
| `tablet-portrait` |  `768x1024` | Tablet portrait breakpoint stress.                      |
| `ipad-landscape`  |  `1194x834` | Tablet landscape below `1280px`; likely breakpoint gap. |
| `small-laptop`    |  `1280x720` | First `hero-landscape` breakpoint.                      |
| `laptop`          |  `1366x768` | Common failure aspect ratio.                            |
| `desktop-900`     |  `1440x900` | Standard desktop.                                       |
| `desktop-wide`    | `1920x1080` | Common wide desktop.                                    |
| `large-wide`      | `2560x1440` | Large monitor scaling.                                  |
| `ultrawide`       | `3440x1440` | Extreme width, map should not sprawl or bury copy/form. |

Optional if failures cluster near edges: `1024x768`, `1536x864`, `1728x1117`.

---

## Workflow loop

### Task 1: Add viewport evidence capture

- [ ] Create `tests/e2e/fairlend-hero-responsive.spec.ts` with a viewport loop.

Core selector contract:

```ts
const selectors = {
  hero: '[data-fairlend-hero-scroll]',
  stage: '[data-fairlend-hero-pin]',
  map: '[data-testid="hero-map-frame"]',
  compactPanel: '[data-testid="hero-compact-panel"]',
  copy: '[data-fairlend-hero-copy]',
  application: '[data-fairlend-hero-application]',
  title: '#fairlend-hero-title',
}
```

For each viewport, collect:

- Screenshot: `artifacts/responsive-hero/round-${ROUND}/${id}.png`.
- Metrics JSON: viewport size, document scroll width, element bounding boxes, visible ratios, overlap pairs, and whether the title/form/CTA are in viewport.
- Assertions:
  - `document.documentElement.scrollWidth <= viewport.width + 1`.
  - Title visible ratio `>= 0.98`.
  - Application form visible ratio `>= 0.95` for tablet/desktop, `>= 0.90` for mobile.
  - No severe copy/form overlap except intentional compact-panel containment on mobile/tablet.

Run:

```bash
ROUND=1 pnpm exec playwright test tests/e2e/fairlend-hero-responsive.spec.ts --project=chromium
```

Expected first run may fail. Keep the screenshots and metrics anyway because they feed the audit subagents.

### Task 2: Fan out `/impeccable audit` subagents per viewport

- [ ] For each viewport artifact, launch one read-only reviewer with `skill: ["impeccable", "agent-browser"]`.
- [ ] Each reviewer must inspect only one viewport so feedback stays concrete.
- [ ] Reviewers must not edit project files.

Subagent prompt template:

```text
Use the impeccable skill as `/impeccable audit` for the Fairlend landing hero at viewport {id} ({width}x{height}).

Route: /fairlend-landing-hero
Files to inspect if needed:
- src/components/FairlendLandingHero/index.tsx
- src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx
- src/components/FairlendLandingHero/FairlendHeroProcess.tsx
- src/app/(frontend)/globals.css

Evidence:
- Screenshot: artifacts/responsive-hero/round-{round}/{id}.png
- Metrics: artifacts/responsive-hero/round-{round}/{id}.json

Do not modify project/source files. Return JSON with:
- pass: boolean
- severity: P0/P1/P2/P3
- scoreResponsive0to4
- concreteFindings[] with screenshot/metric evidence
- preserve[] for what already works
- nextFixGuidance[] with exact component/layout area to change
- regressionRisks[]
```

### Task 3: Synthesize one fix brief

- [ ] Parent or a synthesis subagent groups audit findings by root cause, not by viewport.
- [ ] Output `artifacts/responsive-hero/round-${ROUND}/fix-brief.md`.

Synthesis rules:

1. Preserve `golden-portrait` and mobile first.
2. Prefer fluid CSS variables, `clamp()`, container-like constraints, and content-driven breakpoint splits over viewport-specific magic numbers.
3. Do not let the map compete with the offer; copy and application entry remain readable and visible.
4. Treat `1194x834` and `1280x720` as separate design contexts, not just scaled desktop.
5. If multiple viewports fail for one reason, fix the shared layout primitive once.

### Task 4: Single writer applies fixes

- [ ] Launch one worker only. No parallel writers.
- [ ] Worker reads the fix brief and applies the smallest responsive-layout patch.
- [ ] Worker uses `/impeccable adapt` principles: adaptation, not pixel scaling.

Acceptance contract for worker:

- Required viewports have no horizontal overflow.
- `1080x1920`, `390x844`, and `430x932` do not regress visually.
- Copy, map, process route, application form, and CTA are all legible at required desktop/tablet viewports.
- No new AI-slop patterns: no gradient text, decorative glassmorphism, generic hero-metric blocks, side-stripe cards, or cluttered map labels.
- Run `pnpm lint` and the focused Playwright responsive spec.
- Report changed files, commands, validation output, and residual risks.

### Task 5: Re-capture and re-audit

- [ ] Increment `ROUND` and rerun the Playwright capture spec.
- [ ] Fan out the same viewport audit reviewers.
- [ ] Synthesize remaining blockers.
- [ ] Stop if all required viewports pass with no P0/P1 responsive findings.
- [ ] Otherwise repeat Tasks 3-5, capped at 3 rounds.

### Task 6: Final polish gate

- [ ] Run one final `/impeccable polish`-style reviewer across the full hero, not per viewport.
- [ ] Run:

```bash
pnpm lint
pnpm exec playwright test tests/e2e/fairlend-hero-responsive.spec.ts --project=chromium
```

- [ ] Optional full check before handoff:

```bash
pnpm test:e2e
```

---

## Dynamic orchestrator shape

Use this as the parent-session algorithm, not as parallel writes:

```js
const maxRounds = 3
const requiredViewports = [
  /* table above */
]

for (let round = 1; round <= maxRounds; round++) {
  await runCaptureSpec(round, requiredViewports)

  const audits = await parallel(
    requiredViewports.map((v) => () => impeccableAuditSubagent({ round, viewport: v })),
  )

  const brief = await synthesizeFindings({ round, audits })
  if (brief.pass && brief.p0p1Count === 0) break

  await singleWriterWorker({ round, fixBriefPath: brief.path })
}

await finalPolishReview()
await runFinalValidation()
```

Stop and ask the user before continuing if the best fix requires removing the map, hiding the application form on desktop/tablet, changing hero copy, changing brand direction, or rewriting the landing page beyond the hero.
