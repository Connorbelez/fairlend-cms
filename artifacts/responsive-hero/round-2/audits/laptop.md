# Laptop audit

<!-- markdownlint-disable MD013 -->

```js
{
  pass: true,
  severity: "P2",
  scoreResponsive0to4: 3,
  evidence: {
    viewport: "1366x768 laptop",
    screenshot: "artifacts/responsive-hero/round-2/laptop.png",
    metrics: "artifacts/responsive-hero/round-2/laptop.json",
    metricFailures: [],
    scrollWidth: 1366,
    bodyScrollWidth: 1366,
    noHorizontalScroll: true,
    currentImage: "fairlend-desktop-hero.webp",
    visibleRatios: { stage: 1, title: 1, copy: 1, application: 1, map: 0.978, hero: 0.408 },
    overlaps: { "copy:application": 0, "title:application": 0 },
    round1Comparison: "Round 1 P1 placeholder truncation fixed: screenshot now reads `Property address`; metrics stayed effectively identical, so visual review remains required."
  },
  remainingFindings: [
    {
      severity: "P2",
      category: "Responsive / Proof-strip density",
      location: "artifacts/responsive-hero/round-2/laptop.png y≈704-768; src/components/FairlendLandingHero/index.tsx:109-118",
      finding: "Bottom registration/proof strip still feels compressed at 768px height. Labels are readable, but packed into the fold edge with little breathing room.",
      impact: "Credibility proof loses scan value on core laptop viewport; users may ignore small dense trust copy.",
      recommendation: "Simplify desktop stats, reduce copy, or give strip more optical height/spacing without pushing application card upward."
    },
    {
      severity: "P2",
      category: "Typography / Copy fit",
      location: "src/components/FairlendLandingHero/index.tsx:255-258",
      finding: "Desktop intro still renders as `completion,(and beyond)` with no visible space before emphasized phrase.",
      impact: "Hero copy looks mechanically joined; premium polish suffers despite responsive fit passing.",
      recommendation: "Insert explicit whitespace before `<strong>` or rewrite sentence so emphasis breathes."
    },
    {
      severity: "P3",
      category: "Audit / Regression coverage",
      location: "artifacts/responsive-hero/round-1/laptop.json vs round-2/laptop.json",
      finding: "Metrics do not catch text truncation, proof-strip density, or inline copy spacing; Round 1 and Round 2 geometry is effectively unchanged.",
      impact: "Future laptop regressions can pass JSON checks while screenshot quality drops.",
      recommendation: "Add text/opacity assertions for placeholder, proof strip, and process cards; consider OCR or DOM text visibility checks."
    }
  ],
  preserved: [
    "Round 1 P1 fixed: application placeholder now fits and reads `Property address`.",
    "No horizontal overflow: failures=[], scrollWidth=1366, bodyScrollWidth=1366, map bleed does not create page scroll.",
    "Key elements visible: title/copy/application all 1.0 visible; map remains 0.978 with intentional right bleed.",
    "Header navigation fits 1366 width without collision; primary Get in touch remains clear.",
    "Application card keeps usable controls: tabs ~56px, input ~58px, submit >=44px with aria-label.",
    "Anti-pattern check mostly clean: distinctive Toronto route/map identity; no gradient text or generic SaaS card-grid hero."
  ],
  nextFixGuidance: [
    "[P2] /impeccable-layout-ui — rebalance bottom proof strip density for 1366x768 without crowding application card.",
    "[P2] /impeccable-clarify-ui — fix `completion,(and beyond)` spacing and verify desktop intro line fit.",
    "[P3] /harden — extend responsive metrics to catch placeholder text, proof-strip density, and copy spacing regressions.",
    "[P3] /impeccable-polish-ui — final laptop pass after targeted fixes."
  ],
  regressionRisks: [
    "Increasing proof-strip height can collide with application card bottom; current application bottom≈668, viewport bottom=768.",
    "Moving proof content upward can crowd map route and reduce strong left/right composition.",
    "Widening form is no longer needed; changing it can reintroduce overflow or route collision.",
    "Copy spacing fix can wrap the intro line differently; preserve current readable measure.",
    "Reducing orange halo/route emphasis too much can weaken current CTA and process identity."
  ]
}
```
