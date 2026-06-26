```js
{
  pass: false,
  severity: "P1",
  scoreResponsive0to4: 3,
  viewport: "1366x768 laptop",
  route: "/fairlend-landing-hero",
  evidence: {
    screenshot: "artifacts/responsive-hero/round-1/laptop.png",
    metrics: "artifacts/responsive-hero/round-1/laptop.json",
    metricFailures: [],
    noHorizontalScroll: true,
    scrollWidth: 1366,
    bodyScrollWidth: 1366,
    visibleRatios: { copy: 1, title: 1, application: 1, map: 0.978 }
  },
  concreteFindings: [
    {
      severity: "P1",
      category: "Responsive / Form clarity",
      location: "src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:184-287",
      finding: "Primary form prompt clips at laptop. Screenshot reads `Enter your property addi`, not full `Enter your property address`. Metrics pass because box is visible, but usable input text area is too narrow after icon + 56px submit button + glow.",
      impact: "Lead-capture affordance feels cramped and less clear at core laptop size.",
      recommendation: "In 1280-1500 landscape band, widen application panel or input text track; shorten placeholder; keep submit target >=44px."
    },
    {
      severity: "P2",
      category: "Responsive / Fold rhythm",
      location: "src/components/FairlendLandingHero/index.tsx:109-116,145",
      finding: "Proof/registration strip is packed into bottom 64-92px of 768px viewport with small dense text. It survives, but reads squeezed against fold.",
      impact: "Credibility proof loses scan value and adds bottom-edge tension.",
      recommendation: "Give strip more optical breathing, reduce density, or simplify copy at 1366x768."
    },
    {
      severity: "P2",
      category: "Typography / Copy fit",
      location: "src/components/FairlendLandingHero/index.tsx:250-254",
      finding: "Desktop intro appears as `completion,(and beyond)` with no visible space before orange emphasis.",
      impact: "Premium hero copy looks mechanically joined and slightly careless.",
      recommendation: "Insert explicit visible spacing or rewrite line so emphasis breathes."
    },
    {
      severity: "P3",
      category: "Visual hierarchy",
      location: "src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:285-287",
      finding: "Glowing submit button competes with placeholder and route markers in same orange family.",
      impact: "CTA is clear, but glow contributes to form crowding at laptop.",
      recommendation: "Tone halo down if input width remains tight; preserve clear action affordance."
    }
  ],
  preserve: [
    "Overall laptop composition works: left copy, right map, floating application form all visible.",
    "No metric overlap: copy:application = 0, title:application = 0.",
    "No horizontal scroll despite intentional map bleed: bodyScrollWidth = scrollWidth = 1366.",
    "Map-led brand impression feels distinctive, not generic finance template.",
    "Header navigation fits 1366 width without collision.",
    "Decorative map image is alt-empty and form controls have labels/ARIA; accessibility baseline looks considered."
  ],
  nextFixGuidance: [
    "[P1] /impeccable-adapt-ui — tune 1280-1500 landscape form width/input grid so placeholder no longer clips.",
    "[P2] /impeccable-layout-ui — rebalance bottom proof strip density and fold breathing for 768px height.",
    "[P2] /impeccable-clarify-ui — fix desktop intro spacing and consider shorter placeholder copy.",
    "[P3] /impeccable-polish-ui — final visual pass after layout fixes."
  ],
  regressionRisks: [
    "Widening application panel can collide with map route or push right edge past viewport; keep no horizontal scroll.",
    "Reducing submit button/glow must preserve >=44px target and visible primary action.",
    "Moving proof strip upward can crowd application card; recheck application visibleRatio = 1.",
    "Shrinking title to gain space may weaken current premium hierarchy; preserve line breaks unless tested.",
    "Changing map crop/bleed can flatten distinctive Toronto-map brand moment."
  ]
}
```
