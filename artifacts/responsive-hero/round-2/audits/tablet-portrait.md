```js
{
  pass: true,
  severity: "P2",
  scoreResponsive0to4: 3,
  evidence: {
    viewport: "768x1024",
    screenshot: "artifacts/responsive-hero/round-2/tablet-portrait.png",
    metrics: "artifacts/responsive-hero/round-2/tablet-portrait.json",
    metricFailures: [],
    scrollWidth: 768,
    bodyScrollWidth: 768,
    visibleRatios: {
      stage: 1,
      map: 1,
      compactPanel: 1,
      title: 1,
      copy: 1,
      application: 1
    },
    round1Comparison: "Round 1 P1 fixed visually: Completion card now visible and process story reads 1-4. Metrics unchanged, so screenshot review still required."
  },
  remainingFindings: [
    {
      severity: "P2",
      category: "Responsive / Accessibility",
      issue: "Compact stats strip still reads tiny on tablet portrait.",
      location: "src/components/FairlendLandingHero/index.tsx:80-94,125-131",
      evidence: "Stats use hero-tablet text clamp 8.8-10.5px, line-height 1.12, max-width 92px; screenshot bottom row legible but strained.",
      impact: "Credibility proof can be missed or require zoom, especially on 768px tablet held at distance.",
      recommendation: "Raise stat text to ~11-12px, shorten labels, or use 2-row tablet treatment before claiming score 4.",
      suggestedCommand: "/impeccable-typeset-ui"
    },
    {
      severity: "P2",
      category: "Responsive / Visual clarity",
      issue: "Process cards and map labels compete with detailed skyline.",
      location: "src/components/FairlendLandingHero/FairlendHeroProcess.tsx:53-83,169-211; src/components/FairlendLandingHero/index.tsx:51-72",
      evidence: "All four cards fit, but Construction/Completion plus NORTH YORK/SCARBOROUGH sit over tower/building detail.",
      impact: "Route story is complete now, but scan speed remains lower than ideal.",
      recommendation: "For tablet only, mute or hide secondary map labels and reserve cleaner skyline zones for process cards.",
      suggestedCommand: "/impeccable-adapt-ui"
    },
    {
      severity: "P3",
      category: "Audit / Regression coverage",
      issue: "Metrics do not catch process-card visibility/opacity regression.",
      location: "artifacts/responsive-hero/round-1/tablet-portrait.json and round-2/tablet-portrait.json",
      evidence: "Metrics are identical across rounds while screenshot changed from missing/faded Completion to visible Completion.",
      impact: "Future animation/content regressions can pass JSON checks.",
      recommendation: "Add per-step card bounding boxes + opacity/text assertions for Permit/Acquisition/Construction/Completion.",
      suggestedCommand: "/harden"
    }
  ],
  preserved: [
    "No horizontal overflow: scrollWidth/bodyScrollWidth both 768.",
    "All measured key elements visible: stage, map, compactPanel, title, copy, application = 1.0.",
    "Round 1 P1 resolved: four process steps now visible in screenshot.",
    "Compact panel stays inside viewport: top 441.6, bottom 977.6; ~46px viewport clearance.",
    "Application form touch targets preserved: tabs ~46-52px, submit 44px.",
    "Fairlend-specific Toronto map art direction preserved; no generic AI-slop regression."
  ],
  nextFixGuidance: [
    "[P2] /impeccable-typeset-ui — make bottom stats readable at tablet portrait without increasing panel height much.",
    "[P2] /impeccable-adapt-ui — reduce skyline label/card competition on tablet; keep all 4 cards visible.",
    "[P3] /harden — extend responsive metrics to assert process-card visibility/opacity/text.",
    "[P3] /impeccable-polish-ui — final pass after targeted fixes."
  ],
  regressionRisks: [
    "Increasing stats size can push application/stats below compactPanel bottom; current bottom is 977.6 of 1024.",
    "Widening process cards can collide with CN tower/right edge; Completion currently fits but tight.",
    "Changing object-position/crop can lose Toronto skyline/route identity; current image is mobileHero.png with tablet object position.",
    "Animation timing changes can reintroduce opacity-gated missing cards; default/reduced-motion state must show all 4 steps.",
    "Panel height changes can reduce map breathing room; stage bottom already near viewport bottom at 996."
  ]
}
```
