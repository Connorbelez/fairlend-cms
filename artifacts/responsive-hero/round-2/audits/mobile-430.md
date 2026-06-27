```js
{
  pass: true,
  severity: "P2",
  scoreResponsive0to4: 3,
  remainingFindings: [
    {
      severity: "P2",
      category: "Responsive / Typography",
      finding: "Trust stats remain compressed into 4 columns at 430px; labels render ~8-9.6px with max width 72px.",
      evidence: "mobile-430.png bottom strip; src/components/FairlendLandingHero/index.tsx:84,126-130",
      impact: "Proof points are visible but hard to read at phone distance; text scaling likely causes wrap/crop.",
      fix: "Use 2x2 stats, shorten labels, or raise mobile stat text to >=10.5-11px."
    },
    {
      severity: "P2",
      category: "Performance",
      finding: "430px mobile still loads `mobileHero.png` (941x1672, 2.4MB) as current hero image.",
      evidence: "mobile-430.json currentImage=/assets/mobileHero.png; public/assets/mobileHero.png; src/components/FairlendLandingHero/index.tsx:174-184",
      impact: "Oversized PNG hurts first hero paint on slow mobile networks.",
      fix: "Ship responsive AVIF/WebP width candidates; keep 430px transfer budget near 300-500KB."
    },
    {
      severity: "P2",
      category: "Accessibility / Form feedback",
      finding: "Submit status/error live region is hidden on mobile variants.",
      evidence: "src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:299-302 (`hero-mobile:hidden`)",
      impact: "Mobile users may miss saving/error/transition feedback after submit.",
      fix: "Expose compact visible status or accessible toast without increasing form height too much."
    },
    {
      severity: "P3",
      category: "Responsive",
      finding: "Compact panel ends at y=924 in 932px viewport, leaving only 8px spare.",
      evidence: "mobile-430.json compactPanel.bottom=924; stage.bottom=924; viewport.height=932",
      impact: "Browser chrome, larger text, or localized copy could crop stats/application on shorter 430-class devices.",
      fix: "Add bottom breathing room or mobile-short variant; retest 360/390/430."
    }
  ],
  preserved: [
    "Round 1 P1 fixed: placeholder no longer clipped; screenshot shows `Property address`; source placeholder shortened at FairlendApplicationForm.client.tsx:21.",
    "Round 1 process-card issue fixed: steps 1-4 are legible; `Completion` no longer ghosted.",
    "No horizontal overflow: scrollWidth=430 and bodyScrollWidth=430.",
    "Metric failures empty; title/copy/application/compactPanel/map/stage visibleRatio=1.",
    "Primary mobile targets preserved: tabs h-11 and submit size-11 (44px floor).",
    "Anti-pattern verdict: pass. Map-led Fairlend composition still distinctive; no gradient-text/AI-slop hero failure."
  ],
  nextFixGuidance: [
    "[P2] /impeccable-typeset-ui — Rework mobile stats for legibility and text scaling.",
    "[P2] /impeccable-optimize-ui — Replace oversized mobile PNG with responsive AVIF/WebP sources.",
    "[P2] /impeccable-clarify-ui — Make mobile submit/saving/error feedback visible and announced.",
    "[P3] /impeccable-adapt-ui — Add bottom tolerance for mobile-short/text-scale cases.",
    "[P3] /impeccable-polish-ui — Final screenshot pass after fixes."
  ],
  regressionRisks: [
    "Larger stats text or 2x2 layout can push compactPanel past 932px; retest mobile-360/390/430 and mobile-short.",
    "Image source/order changes can re-break tablet/iPad landscape crop; verify all Round 2 viewports.",
    "Process-card moves can cover CN Tower/map focal area or headline; preserve step 4 visibility.",
    "Visible form status can add height and crop stats; reserve space carefully."
  ]
}
```
