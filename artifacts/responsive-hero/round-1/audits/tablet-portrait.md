```js
{
  pass: false,
  severity: "P1",
  scoreResponsive0to4: 2,
  auditHealth: {
    accessibility: 2,
    performance: 3,
    theming: 3,
    responsive: 2,
    antiPatterns: 3,
    total: "13/20",
    rating: "Acceptable"
  },
  antiPatternsVerdict: {
    pass: true,
    looksAIGenerated: false,
    notes: [
      "Map-led miniature Toronto scene feels specific to Fairlend, not generic SaaS/fintech AI slop.",
      "Only notable tell: bottom credibility stats strip (`25+`, `$2B+`) is familiar hero-metric grammar, but secondary here."
    ]
  },
  evidence: {
    route: "/fairlend-landing-hero",
    screenshot: "artifacts/responsive-hero/round-1/tablet-portrait.png",
    metrics: "artifacts/responsive-hero/round-1/tablet-portrait.json",
    viewport: "768x1024",
    metricFailures: [],
    scrollWidth: 768,
    bodyScrollWidth: 768,
    currentImage: "/assets/mobileHero.png"
  },
  issueCounts: { P0: 0, P1: 1, P2: 3, P3: 1 },
  concreteFindings: [
    {
      severity: "P1",
      issue: "Fourth process step is missing/late in tablet screenshot",
      location: "FairlendHeroProcess.tsx:143-235; screenshot top route area",
      category: "Responsive / Accessibility / Anti-Pattern",
      impact: "Hero promises permit → acquisition → construction → completion, but tablet capture shows only first 3 cards. Core route story reads incomplete above fold. Because process cards use base `opacity-0` plus `motion-safe:animate-*`, reduced-motion users can also lose these cards entirely.",
      standard: "WCAG 1.3.1; reduced-motion best practice; impeccable rule: reveal animations must not gate content visibility",
      recommendation: "Make all process labels visible by default; animate transform/opacity only when motion allowed. Shorten tablet stagger so all 4 route cards are visible before normal screenshot/read time, or keep Completion label in static panel copy.",
      suggestedCommand: "/impeccable-animate-ui"
    },
    {
      severity: "P2",
      issue: "Process cards and map labels compete with busy skyline",
      location: "FairlendHeroProcess.tsx:203-235; index.tsx:50-63",
      category: "Responsive / Accessibility",
      impact: "Construction card, North York, and Scarborough labels sit over detailed buildings; small text loses scan speed on 768px portrait.",
      standard: "WCAG 1.4.3 where text is informational",
      recommendation: "For tablet only, reduce secondary city labels, increase process card opacity/contrast, and position cards off highest-detail skyline zones.",
      suggestedCommand: "/impeccable-adapt-ui"
    },
    {
      severity: "P2",
      issue: "Lower compact panel is dense for tablet portrait",
      location: "index.tsx:208; metrics compactPanel top 441.6 bottom 977.6 height 536",
      category: "Responsive / Layout",
      impact: "No clipping, but panel consumes most lower fold. Title, copy, form, and stats all fit by compression, making stats and form area feel tight.",
      standard: "Responsive readability; touch-first spacing",
      recommendation: "Trim 40-60px from tablet panel stack: reduce h1 max or copy gap slightly, keep form visible, and give stats more breathing room or a two-row tablet layout.",
      suggestedCommand: "/impeccable-layout-ui"
    },
    {
      severity: "P2",
      issue: "Form status/error text hidden on tablet",
      location: "FairlendApplicationForm.client.tsx:300-301",
      category: "Accessibility / Responsive",
      impact: "Tablet users may not see or hear save/error status because `aria-live` line is `hero-tablet:hidden` while field references it with `aria-describedby`.",
      standard: "WCAG 3.3.1, 4.1.3",
      recommendation: "Keep a compact visible/screen-reader-live status row on tablet, or move errors into an always-present visually hidden live region plus visible inline message when needed.",
      suggestedCommand: "/impeccable-clarify-ui"
    },
    {
      severity: "P3",
      issue: "Bottom stats are legible but near minimum useful size",
      location: "index.tsx:84-123",
      category: "Responsive / Typography",
      impact: "Four stats fit cleanly, but 8.8-10.5px labels reduce confidence readability on tablet, especially at distance.",
      standard: "Readable type sizing; 44px touch not applicable because non-interactive",
      recommendation: "Raise tablet stat label floor to ~11px or simplify copy per stat.",
      suggestedCommand: "/impeccable-typeset-ui"
    }
  ],
  preserve: [
    "No horizontal overflow: `scrollWidth` and `bodyScrollWidth` both 768.",
    "Metric pass: title, copy, application, compact panel, map, and stage all visibleRatio 1.0.",
    "Tablet uses portrait-specific `mobileHero.png`, visually correct for 768x1024.",
    "H1 does not overflow; line breaks are strong and brand-forward.",
    "Tabs and submit CTA meet practical touch target size; primary action stays visible above fold.",
    "Warm map + construction route art direction feels distinctive and on-brief. Preserve this."
  ],
  nextFixGuidance: [
    {
      severity: "P1",
      command: "/impeccable-animate-ui",
      guidance: "Fix gated process-card reveal. Completion step must be visible by default and under reduced motion."
    },
    {
      severity: "P2",
      command: "/impeccable-adapt-ui",
      guidance: "Retune 768px tablet route-card placement/contrast and reduce city-label competition."
    },
    {
      severity: "P2",
      command: "/impeccable-layout-ui",
      guidance: "Reduce lower panel density without losing form visibility; target clearer stat readability."
    },
    {
      severity: "P2",
      command: "/impeccable-clarify-ui",
      guidance: "Make tablet form feedback visible/announced in error and saving states."
    },
    {
      severity: "P3",
      command: "/impeccable-polish-ui",
      guidance: "Final visual pass after fixes at 768x1024 plus nearby tablets 820x1180 and 834x1112."
    }
  ],
  regressionRisks: [
    "Changing tablet stage min/max height can break sticky scroll rhythm; remeasure `stage`, `map`, `compactPanel`, and `application` visible ratios.",
    "Moving process cards can collide with header at top or title panel at y≈441; verify all 4 labels at capture time and after 2s.",
    "Increasing stats type may force wrapping; test 768 width and 577px breakpoint edge.",
    "Removing `opacity-0` must not create flash/jump on load; prefer visible base state plus motion-safe transform.",
    "Keep `scrollWidth === 768`; tablet fixes must not reintroduce horizontal overflow."
  ]
}
```
