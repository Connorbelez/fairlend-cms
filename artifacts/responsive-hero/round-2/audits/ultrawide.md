<!-- markdownlint-disable MD013 -->

# Round 2 ultrawide audit

```js
{
  pass: true,
  severity: "P2",
  scoreResponsive0to4: 3,
  auditHealthScore: "14/20 Good",
  dimensionScores0to4: {
    accessibility: 3,
    performance: 3,
    responsive: 3,
    theming: 2,
    antiPatterns: 3
  },
  antiPatternsVerdict: "Pass. Does not read as generic AI finance hero: Toronto map/route is distinctive. Minor risk remains from proof metrics + process cards, but not slop-gallery level.",
  evidence: {
    viewport: "3440x1440 ultrawide",
    screenshot: "artifacts/responsive-hero/round-2/ultrawide.png",
    metrics: "artifacts/responsive-hero/round-2/ultrawide.json",
    metricFailures: [],
    scrollWidth: 3440,
    bodyScrollWidth: 3440,
    noHorizontalScroll: true,
    currentImage: "fairlend-desktop-hero.webp",
    visibleRatios: { stage: 1, title: 1, copy: 1, application: 1, map: 1, hero: 0.408 },
    overlaps: { "copy:application": 0, "title:application": 0, "application:compactPanel": 0 },
    derived: {
      copyMapGapPx: 793.7,
      copyMapGapViewportPct: 0.231,
      applicationRightGutterPx: 75.7,
      applicationRightGutterViewportPct: 0.022,
      proofStripMaxWidthPx: 1280,
      proofStripViewportPct: 0.372
    },
    round1Comparison: "Round 2 ultrawide geometry is effectively unchanged from Round 1. Placeholder/process visuals improved, but Round 1 P2 ultrawide composition + proof-strip guidance remains open."
  },
  remainingFindings: [
    {
      severity: "P2",
      category: "Responsive / Ultrawide composition",
      location: "artifacts/responsive-hero/round-2/ultrawide.png; ultrawide.json boxes.copy/map/application; src/components/FairlendLandingHero/index.tsx:153-170; FairlendApplicationForm.client.tsx:185-188",
      finding: "Stage spans full 3440px with copy pinned far left and map/form pinned far right. Measured copy-to-map gap is ~794px (23.1vw); application card right gutter is only ~76px (2.2vw).",
      impact: "Eye path stretches across excessive dead space. CTA feels detached from headline on ultrawide monitors even though all elements are technically visible.",
      recommendation: "At >=1920px, cap/center active stage or shift map + form inward while preserving 1440/1920 behavior and map-led identity."
    },
    {
      severity: "P2",
      category: "Responsive / Proof-strip scale",
      location: "artifacts/responsive-hero/round-2/ultrawide.png bottom strip; src/components/FairlendLandingHero/index.tsx:109-118",
      finding: "Desktop proof strip still maxes at 1280px, only ~37% of ultrawide viewport. Round 1 brief explicitly called for enlarged proof strip at ultrawide.",
      impact: "Trust/compliance proof becomes tiny bottom microcopy instead of supporting premium credibility at 3440px.",
      recommendation: "Add >=1920px proof-strip max width/column rhythm, e.g. 1600-1840px cap with slightly larger gaps/type; do not increase bottom density on laptop."
    },
    {
      severity: "P2",
      category: "Typography / Copy polish",
      location: "artifacts/responsive-hero/round-2/ultrawide.png left intro; src/components/FairlendLandingHero/index.tsx:255-260",
      finding: "Desktop intro still reads `completion,(and beyond)` with no visible space before emphasized phrase.",
      impact: "Premium editorial finish breaks at most visible hero text block.",
      recommendation: "Insert explicit whitespace before `<strong>` or rewrite sentence so emphasis has natural spacing."
    },
    {
      severity: "P3",
      category: "Theming / Token consistency",
      location: "src/components/FairlendLandingHero/index.tsx; FairlendApplicationForm.client.tsx; FairlendHeroProcess.tsx",
      finding: "Hero uses many hard-coded rgb/hex values beside Fairlend tokens. Light theme looks coherent here; theme switching would not fully update this surface.",
      impact: "Future palette/dark-mode changes require manual hunting and can create contrast drift.",
      recommendation: "Extract stable Fairlend hero tokens for panel, line, ink, muted, route glow, and warm surfaces before broader theme work."
    },
    {
      severity: "P3",
      category: "Audit / Regression coverage",
      location: "artifacts/responsive-hero/round-1/ultrawide.json vs round-2/ultrawide.json",
      finding: "Metrics show no geometry change between rounds, so JSON pass did not verify Round 1 ultrawide composition guidance.",
      impact: "Future ultrawide regressions can pass `failures=[]` while screenshot still feels edge-pinned or under-scaled.",
      recommendation: "Add ultrawide assertions for copy-map gap, application gutter, proof-strip width ratio, and process-card visibility/overlap."
    }
  ],
  preserved: [
    "No horizontal overflow: failures=[], scrollWidth=3440, bodyScrollWidth=3440.",
    "Primary blocks fully visible: title/copy/application/map/stage all visibleRatio=1.",
    "No measured collisions: copy/application=0, title/application=0, application/compactPanel=0.",
    "Round 2 fixed visible application placeholder: `Property address` now fits on ultrawide.",
    "Round 2 process cards/leaders now display on desktop route and communicate permit → completion flow.",
    "Map-led Fairlend identity remains strong; no gradient text, generic identical card grid, or decorative glassmorphism dominating hero.",
    "A11y basics present in source: labelled hero section, h1, form labels/descriptions, tablist/tab/tabpanel states, decorative map image alt empty.",
    "Performance basics acceptable: desktop WebP selected, hero image async/high priority, motion mostly transform/opacity via motion-safe classes."
  ],
  nextFixGuidance: [
    "[P2] /impeccable-adapt-ui — Add >=1920 ultrawide stage cap/inset rules; reduce 794px copy-map dead zone without harming 1440/1920.",
    "[P2] /impeccable-layout-ui — Rework ultrawide proof strip width/rhythm so credibility content scales beyond 1280px.",
    "[P2] /impeccable-clarify-ui — Fix desktop intro spacing around `(and beyond)` and verify line fit at wide widths.",
    "[P3] /harden — Extend responsive metrics with ultrawide composition thresholds and OCR/DOM checks for visible text.",
    "[P3] /impeccable-polish-ui — Final ultrawide screenshot pass after targeted fixes."
  ],
  regressionRisks: [
    "Capping/centering stage too aggressively can shrink map drama and weaken Fairlend identity.",
    "Moving map/form inward can collide with Toronto/water/property focal area or route markers.",
    "Widening proof strip can collide with application card or increase bottom visual noise on laptop heights.",
    "Scaling process cards can compete with city labels and property focal point; keep route legibility primary.",
    "Changing `--hero-stage-height/width` can affect pinned transition timing and lower breakpoints.",
    "Tokenizing hard-coded hero colors globally can alter map-matched warm surfaces; snapshot 1440, 1920, 3440 before/after."
  ]
}
```
