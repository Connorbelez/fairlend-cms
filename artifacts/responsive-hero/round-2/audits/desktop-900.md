<!-- markdownlint-disable MD013 -->

# Round 2 desktop-900 audit

```js
{
  pass: true,
  severity: "P3",
  scoreResponsive0to4: 3,
  remainingFindings: [
    {
      severity: "P3",
      category: "Responsive",
      location: "artifacts/responsive-hero/round-2/desktop-900.png; desktop-900.json boxes.map",
      issue: "Map still bleeds 19.02px past right viewport edge.",
      evidence: "map.right=1459.02 > viewport.width=1440; visibleRatio=0.97749; scrollWidth/bodyScrollWidth remain 1440.",
      impact: "Looks intentional at 1440x900, but nearby desktop widths may clip route/property focal detail.",
      recommendation: "Keep immersive bleed, but add desktop safe-area guard or reduce right offset slightly. Use /impeccable-adapt-ui."
    },
    {
      severity: "P3",
      category: "Responsive / Layout",
      location: "artifacts/responsive-hero/round-2/desktop-900.png; desktop-900.json boxes.application",
      issue: "Application card remains tight to right edge while map also bleeds right.",
      evidence: "application.right=1408.33; right gutter=31.67px; width=472.31px; overlap copy/application=0.",
      impact: "Readable now, but right rail has little breathing room for longer labels or browser zoom.",
      recommendation: "Consider 40-48px desktop gutter or card max-width guard only if adjacent desktop audits show crowding. Use /impeccable-layout-ui."
    }
  ],
  preserved: [
    "No metric failures: failures=[].",
    "No horizontal overflow: scrollWidth=1440, bodyScrollWidth=1440, viewport.width=1440.",
    "Primary blocks fully visible: title=1, copy=1, application=1, stage=1.",
    "No measured overlaps: copy/application=0, title/application=0, application/compactPanel=0.",
    "Desktop composition still reads clean: left editorial claim, right map narrative, bottom-right application card, bottom proof strip.",
    "Round 2 desktop-900 metrics are effectively unchanged from Round 1; prior desktop pass preserved."
  ],
  nextFixGuidance: [
    "[P3] /impeccable-adapt-ui — Tune right-edge map bleed with safe-area check across 1366-1536 desktop widths.",
    "[P3] /impeccable-layout-ui — Add small right-gutter/card-width guard only if other desktop widths feel pinned.",
    "[P3] /impeccable-polish-ui — Final screenshot pass after any spacing changes."
  ],
  regressionRisks: [
    "Reducing map bleed too far can weaken immersive map-led identity and create empty right background.",
    "Moving application card left can collide with Toronto/water focal area and reduce image clarity.",
    "Shrinking title/card can dilute premium editorial hierarchy and CTA prominence.",
    "Changing desktop stage or hero height can affect sticky/pinned transition timing."
  ]
}
```
