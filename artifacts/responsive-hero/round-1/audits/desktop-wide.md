```js
{
  pass: true,
  severity: "P2",
  scoreResponsive0to4: 3,
  concreteFindings: [
    {
      severity: "P2",
      finding: "Metric pass, visual pass with minor wide-screen density risk. No horizontal overflow, no measured copy/application overlap, all key hero elements fully visible at 1920x1080.",
      evidence: "desktop-wide.json: failures=[], scrollWidth=1920, bodyScrollWidth=1920, visibleRatios copy/title/application/map=1"
    },
    {
      severity: "P2",
      finding: "Headline and map frame overlap in measured boxes by ~145px on x-axis. Current pale map keeps text legible, but city labels/detail under left headline can feel crowded at desktop-wide.",
      evidence: "title right=747.95, map left=602.67; src/components/FairlendLandingHero/index.tsx:153-155,219-249"
    },
    {
      severity: "P3",
      finding: "Bottom stats band is readable but dense. Registration disclosure plus four stat items fit inside ~92px strip; wide viewport still leaves little vertical breathing room near fold.",
      evidence: "stats strip clamp(64px,5.5vw,92px); src/components/FairlendLandingHero/index.tsx:107-120"
    },
    {
      severity: "P3",
      finding: "Application card sits cleanly above stats and away from viewport edge, but lower-right composition depends on fixed percentage offsets. Future tab copy or wider card could collide with stats band.",
      evidence: "application box x=1317.77 y=742.91 w=560 h=210.55; right margin ~42px; src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:184-188"
    }
  ],
  preserve: [
    "Strong wide-desktop hierarchy: oversized editorial headline left, detailed map right, form anchored near route endpoint.",
    "No actual overflow or visible clipping in screenshot.",
    "Hero CTA/form remains fully visible above fold; compact panel correctly absent on desktop.",
    "Map asset fills wide stage without dead right-edge whitespace."
  ],
  nextFixGuidance: [
    "P2 /impeccable-layout-ui: slightly reserve headline safe area or shift desktop map/frame right/down only if 1440-1920 regression shots show label/text crowding.",
    "P3 /impeccable-adapt-ui: give stats strip a little more vertical rhythm or reduce disclosure/stat density at 1920 without moving form below fold.",
    "P3 /impeccable-polish-ui: after layout tweaks, re-check route at 1440, 1600, 1920, and 2560 widths."
  ],
  regressionRisks: [
    "Moving map right may weaken headline-to-route connection and expose blank cream space.",
    "Raising application card may compete with route/house focal point; lowering it may collide with stats strip.",
    "Increasing stats height may cover more map/water and reduce above-fold hero drama.",
    "Reducing headline size may improve map label clarity but harm brand impact."
  ]
}
```
