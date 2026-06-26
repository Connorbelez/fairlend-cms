{
pass: true,
severity: "P2",
scoreResponsive0to4: 3,
concreteFindings: [
{
severity: "P2",
location: "mobile-390.png y≈140-270; src/components/FairlendLandingHero/FairlendHeroProcess.tsx:61-97,202-204",
finding: "Process cards crowd top map. Steps 1-3 read; step 4 Completion not legible in first fold.",
impact: "Guided route promise feels incomplete on mobile, despite metrics passing. User sees construction path, not full completion path."
},
{
severity: "P2",
location: "mobile-390.png y≈706-756; src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:238-287",
finding: "Application input is tight. Placeholder truncates before full address prompt while CTA halo competes for width.",
impact: "Primary conversion control remains usable, but scan clarity drops at 390px."
},
{
severity: "P2",
location: "mobile-390.png y≈780-830; src/components/FairlendLandingHero/index.tsx:43-48,75-95,123-126",
finding: "Trust stat labels are very small and compressed into four columns.",
impact: "Credibility badges are present but low-legibility; likely worse with text zoom or smaller browser chrome."
},
{
severity: "P3",
location: "mobile-390.json boxes.compactPanel.bottom=836 in 844 viewport; src/components/FairlendLandingHero/index.tsx:141-145,208",
finding: "First fold passes with only ~8px bottom breathing room. Hero/panel stack is visually dense.",
impact: "390x844 screenshot works, but shorter mobile viewport can feel clipped or rushed."
}
],
preserve: [
"No horizontal overflow: bodyScrollWidth=390, scrollWidth=390, failures=[].",
"Core hero, map, compact panel, copy, title, and application all have visibleRatio=1 in evidence.",
"Header chrome fits 390px; logo, expert CTA, and menu stay readable.",
"Headline line breaks are strong: Financing / Multiplex / Single Family / Land Purchase, no word overflow.",
"Primary submit button remains 44px touch target and visually discoverable."
],
nextFixGuidance: [
"Use /impeccable-adapt-ui: rebalance mobile process layer so all four steps read, or compress into a clearer 1-4 route strip above copy.",
"Use /impeccable-layout-ui: give application field more text width by reducing CTA glow footprint or shortening placeholder for mobile.",
"Use /impeccable-typeset-ui: increase stat label legibility or switch stats to 2x2 / carousel / fewer badges on mobile.",
"End with /impeccable-polish-ui after responsive fixes; keep metric invariants: no horizontal scroll, title/application visible."
],
regressionRisks: [
"Moving process anchors may crop cards at 360px or collide with CN Tower/map focal point.",
"Shrinking hero min-height may break sticky scroll behavior and reveal next section too early.",
"Increasing stat text can overflow four-column strip; test 360, 390, 430, text zoom.",
"Changing form width/CTA can break Google autocomplete positioning and 44px submit target.",
"Reducing visual density must not hide application entry point above fold."
]
}
