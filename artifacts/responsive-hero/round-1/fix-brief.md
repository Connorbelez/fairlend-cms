# Responsive Hero Round 1 Fix Brief

## 1) Verdict

**FAIL — P1 workflow fail.** 7/11 visual audits fail despite every metrics JSON showing `failures=[]` and `scrollWidth === bodyScrollWidth === viewport.width`.

Pass: `mobile-390`, `desktop-900`, `desktop-wide`, `ultrawide`.
Fail: `golden-portrait`, `mobile-430`, `tablet-portrait`, `ipad-landscape`, `small-laptop`, `laptop`, `large-wide`.

Metrics blind spot: JSON validates visibility/overflow, not visual fill, text clipping, opacity-gated content, contrast, or header clipping.

## 2) Grouped root causes

### A. Breakpoint/art-direction gaps

- `hero-portrait-wide` exists but unused: `src/app/(frontend)/globals.css:26`.
- 1080x1920 portrait uses `hero-tablet:max-h-[900px]` at `src/components/FairlendLandingHero/index.tsx:145`; stage ends at y=996, leaving 924px blank first fold.
- Sticky/pin CSS only applies `max-width:1023px` (`globals.css:840-849`), missing 1080px portrait.
- 1194x834 iPad landscape falls into tablet/mobile layout and loads `mobileHero.png`; compact panel/process cards conflict.
- 1280px hard switch triggers desktop header + desktop hero before enough width.
- 3440px ultrawide has island gap: copy x=112-849, map x=1643-3440.

### B. Process cards gated by animation and poorly placed

- Mobile leaders/cards start `opacity-0`: `FairlendHeroProcess.tsx:160,204`.
- Desktop cards start `opacity-0`: `FairlendHeroProcess.tsx:279`; leaders scale from 0 at `:264`.
- Result: completion missing on mobile/tablet, large-wide labels absent, reduced-motion users risk never seeing route story.
- iPad landscape shows ghosted process card under compact panel.

### C. Primary form prompt too narrow / low contrast

- Placeholder text long: `FairlendApplicationForm.client.tsx:21`.
- Hero landscape card: `w-[min(32.8vw,560px)] min-w-[462px]` at `:186`; input row allocates icon + flexible input + CTA at `:238`.
- Google autocomplete input lacks local `w-full min-w-0` in hero call (`:269`); component wrapper/input at `GoogleAddressAutocomplete.tsx:242,248-249` can also be hardened.
- Placeholder colors `#7f8081` / `#8d8d8d` at `:248,269` fail or likely fail AA on warm near-white panel.
- Status/error row hidden across responsive variants: `:301`.

### D. Dense proof/stat/compliance strips

- Mobile/tablet stats are 4 columns with ~8-10.5px labels: `index.tsx:82-123`.
- Desktop stats/disclosure strip maxes at `min(1280px,88vw)` and 64-92px height: `index.tsx:109-116`; cramped at 720/768 heights, too tiny at ultrawide.

### E. Asset/performance

- `public/assets/mobileHero.png` is 2.4MB and used for all `max-width:1279px` due source order at `index.tsx:163-172`.
- `fairlend-toronto-map-transparent@2x.webp` source is effectively shadowed for <=1279px by earlier PNG source.

## 3) Prioritized fixes

### P0

1. **Remove opacity-gated route content.** Make process cards/labels visible without motion; animate transform/filter only. Add reduced-motion visible fallback. Targets: `FairlendHeroProcess.tsx:160,204,264,279`; reduced-motion CSS in `globals.css:851-865`.

### P1

1. **Fix golden portrait fill without breaking mobile/tablet.** Use `hero-portrait-wide` on stage/panel/map at `index.tsx:145,153,155,208`; extend sticky/full-height only for portrait-wide/min-height in `globals.css:840-849`. Do not remove `hero-tablet:max-h-[900px]` globally.
2. **Fix form placeholder clipping and contrast.** Shorten mobile/constrained placeholder (`Property address`), darken placeholder token, add `w-full min-w-0` to Google input path, rebalance row/card only if needed. Targets `FairlendApplicationForm.client.tsx:21,186,238,248,269,287` and optionally `GoogleAddressAutocomplete.tsx:242,248-249`.
3. **Add iPad-landscape-specific behavior.** Add custom variant near `globals.css:23-26` (e.g. 1024-1279 landscape). Use desktop/bridge crop or quiet route layer; prevent process cards from ghosting behind compact panel. Targets `index.tsx:153-177,208`; `FairlendHeroProcess.tsx:61-102,138-204`.
4. **Fix 1280-1360 header.** Compact desktop header or keep condensed nav longer. Targets `header.css:433-438,488-505,542-552,592-616`; optional remove duplicate `Contact` nav at `header.tsx:162-183` when CTA exists.

### P2

1. **Improve stats/proof rhythm.** Mobile/tablet: 2x2, fewer stats, or larger labels. Desktop: reduce bottom density at 1280/1366; enlarge proof strip max width at ultrawide. Targets `index.tsx:82-123`.
2. **Tune wide/ultrawide composition.** At >=1920 shift map/form inward or cap stage max width; keep 1440/1920 safe. Targets `index.tsx:145,153,155,210,219`; `FairlendApplicationForm.client.tsx:186`.
3. **Optimize portrait asset.** Convert `mobileHero.png` to AVIF/WebP width candidates; fix `<source>` ordering/media at `index.tsx:163-172`.
4. **Copy polish.** Desktop intro missing visual space before `(and beyond)`: `index.tsx:250-254`.

## 4) Preservation constraints

### Golden portrait

- Preserve no horizontal overflow (`1080/1080`).
- Preserve all key elements visible: title/copy/application/panel/map visibleRatio 1.0.
- Preserve centered compact panel, readable headline, visible form, Fairlend Toronto map route identity.
- Fill viewport only for portrait-wide/tall screens; do not make 768x1024 tablet overly tall.

### Mobile 390/430

- Preserve no horizontal overflow (`390/390`, `430/430`).
- Preserve title/application/copy/map visible above fold.
- Preserve current strong mobile headline line breaks.
- Preserve 44px tab and submit targets.
- Do not let process cards cover CN Tower/map focal area or push compact panel past fold.
- Improve placeholder clarity/contrast without hiding primary application entry.

## 5) Next writer prompt

Implement Round 2 responsive hero fixes. Focus P0/P1 first: process content visible without animation; golden portrait full-height portrait-wide layout; constrained form placeholder/contrast/input width; iPad-landscape route/panel behavior; 1280 header compacting. Preserve mobile/golden invariants above. Keep map-led Fairlend identity; avoid generic finance hero metrics/card clutter. Do not rely on metrics-only pass; compare screenshots.

## 6) Validation commands

```bash
pnpm lint
ROUND=2 pnpm exec playwright test --config=playwright.config.ts tests/e2e/fairlend-hero-responsive.spec.ts --project=chromium
python3 - <<'PY'
import json, pathlib
base=pathlib.Path('artifacts/responsive-hero/round-2')
for p in sorted(base.glob('*.json')):
    d=json.load(open(p))
    vp=d['viewport']
    print(p.stem, f"{vp['width']}x{vp['height']}", d['failures'], d['scrollWidth'], d['bodyScrollWidth'], d.get('currentImage','').split('/')[-1])
PY
```

Also inspect `artifacts/responsive-hero/round-2/*.png`; Round 1 metrics all passed while visual audit failed.
