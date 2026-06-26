```js
{
  pass: false,
  severity: "P1",
  scoreResponsive0to4: 3,
  concreteFindings: [
    {
      severity: "P1",
      category: "Accessibility / Responsive",
      finding: "Application placeholder is both clipped and below AA contrast at 430px. Screenshot shows `Enter your property addre...`; `#7f8081` on near `#fffdf9` is ~3.89:1, below 4.5:1.",
      evidence: "mobile-430.png form row; mobile-430.json application width=384; src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:248,269",
      impact: "Mobile users lose full field instruction; low-vision users get weak input hint before starting application.",
      fix: "Shorten mobile placeholder (`Property address`), darken placeholder token, or give input column more room without shrinking 44px submit target."
    },
    {
      severity: "P2",
      category: "Responsive / Visual hierarchy",
      finding: "Process stack reads as steps 1-3; step 4 (`Completion`) is ghosted/partially buried in card cascade.",
      evidence: "mobile-430.png top map cluster; src/components/FairlendLandingHero/FairlendHeroProcess.tsx:61-88,204",
      impact: "Guided route promise weakens; completion phase looks disabled instead of final destination.",
      fix: "Reposition mobile anchors/card stack or alter z/opacity timing so all 4 steps are legible in captured/resting state."
    },
    {
      severity: "P2",
      category: "Responsive / Typography",
      finding: "Trust stats use 8-9.6px mobile text across four columns.",
      evidence: "mobile-430.png bottom strip; src/components/FairlendLandingHero/index.tsx:84,123-125",
      impact: "Proof points exist but are hard to read at normal phone distance; weakest item crowding hurts premium feel.",
      fix: "Use 2x2 stats, drop to 3 stats, or raise mobile min size to ~10.5-11px with shorter labels."
    },
    {
      severity: "P3",
      category: "Performance / Motion",
      finding: "Mobile hero uses multiple blur/filter/shadow animations plus GSAP scroll transform. Reduced-motion path exists, but visual state can be timing-sensitive in screenshots.",
      evidence: "src/components/FairlendLandingHero/FairlendHeroTransition.client.tsx:25-85; globals.css:851-863; FairlendHeroProcess.tsx:160,204",
      impact: "Low-end devices or early screenshots may catch unfinished card opacity/blur states.",
      fix: "Keep content readable at default opacity, reduce mobile stagger, and verify after animation settle."
    }
  ],
  preserve: [
    "No horizontal overflow: bodyScrollWidth=430 and scrollWidth=430.",
    "Metric failures empty; map, compactPanel, copy, title, and application all visibleRatio=1.",
    "Hero title fits 384px copy width without word overflow; strong brand typography survives mobile.",
    "Primary tabs and submit target meet 44px mobile touch floor (`hero-mobile:h-11`, `size-11`).",
    "Reduced-motion handling present for hero scroll pin/progress."
  ],
  nextFixGuidance: [
    "[P1] /impeccable-adapt-ui — fix mobile form placeholder length/contrast while preserving 44px submit and tab targets.",
    "[P2] /impeccable-layout-ui — rebalance process-card stack so all four steps are readable at 430px.",
    "[P2] /impeccable-typeset-ui — redesign stats strip labels for readable mobile proof points.",
    "[P3] /impeccable-polish-ui — final pass after fixes; re-run mobile-360/390/430 screenshots and metrics."
  ],
  regressionRisks: [
    "Raising stats text may push compactPanel past 932px viewport; retest mobile-short and 360px.",
    "Shortening input copy must not remove accessible label/description or break autocomplete intent handling.",
    "Moving process cards can cover CN tower, route markers, or hero title; compare visual balance against current screenshot.",
    "Changing panel width/margins can reintroduce horizontal scroll; keep scrollWidth === viewport width.",
    "Reducing animation stagger must preserve reduced-motion behavior and avoid blank opacity defaults."
  ]
}
```
