{
pass: true,
severity: "P3",
scoreResponsive0to4: 3,
concreteFindings: [
{
severity: "P3",
category: "Responsive",
location: "desktop-900.png; desktop-900.json boxes.map; src/components/FairlendLandingHero/index.tsx:153-155",
finding: "Map asset bleeds 19px past right viewport edge.",
evidence: "map.right=1459.02 > viewport.width=1440; visibleRatio=0.977; scrollWidth stays 1440.",
impact: "Current crop looks acceptable and intentional, but route/property detail has little safe area; nearby desktop widths could clip meaningful visual content.",
recommendation: "Keep bleed, but add 1440px safe-area check or reduce hero-landscape negative right offset slightly. Use /impeccable-adapt-ui."
},
{
severity: "P3",
category: "Responsive / Visual hierarchy",
location: "desktop-900.png; desktop-900.json boxes.application; src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:184-188",
finding: "Application card sits close to right edge while map also bleeds right.",
evidence: "application.right=1408.33, ~31.7px viewport gutter; card width=472.3px.",
impact: "Readable now, but composition feels tight on right rail; long active tab labels leave limited breathing room.",
recommendation: "At 1440 desktop, consider 40-48px right gutter or slightly smaller card max width. Use /impeccable-layout-ui."
},
{
severity: "P3",
category: "Visual responsive balance",
location: "desktop-900.png; src/components/FairlendLandingHero/index.tsx:217-250",
finding: "Hero title consumes heavy vertical mass but remains well within viewport.",
evidence: "title.height=296.5, title.bottom=540.0; copy.bottom=660.5; no overlap with application.",
impact: "Strong hierarchy; minor risk that text-size/browser zoom could push CTA/stats crowding at 900px height.",
recommendation: "Preserve scale; regression-test 125% text zoom and 1366x768 before changing. Use /impeccable-typeset-ui only if crowding appears."
}
],
preserve: [
"No metric failures.",
"No horizontal scroll: bodyScrollWidth=1440, scrollWidth=1440.",
"Primary elements fully visible: title=1.0, copy=1.0, application=1.0.",
"No copy/application or title/application overlap.",
"Desktop composition reads clearly: left claim, right map, bottom-right application, footer stats strip."
],
nextFixGuidance: [
"[P3] /impeccable-adapt-ui — tune right-edge map bleed with safe-area guard for 1440x900 and adjacent desktop widths.",
"[P3] /impeccable-layout-ui — add small right gutter/card-width guard if card feels pinned at 1440.",
"[P3] /impeccable-polish-ui — final visual pass after any spacing changes."
],
regressionRisks: [
"Reducing map bleed can weaken immersive hero and expose empty right background.",
"Moving application card left can collide visually with Toronto/water focal area.",
"Shrinking title or card may hurt premium editorial tone and CTA prominence.",
"Changing hero-stage height can affect scroll transition/pinned hero timing."
]
}
