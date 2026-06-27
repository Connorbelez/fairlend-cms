{
pass: false,
severity: "P1",
scoreResponsive0to4: 2,
auditHealthScore0to20: "13/20 (Acceptable)",
dimensionScores0to4: {
accessibility: 3,
performance: 3,
theming: 2,
responsiveDesign: 2,
antiPatterns: 3
},
evidence: {
route: "/fairlend-landing-hero",
viewport: "1194x834 ipad-landscape",
screenshot: "artifacts/responsive-hero/round-1/ipad-landscape.png",
metrics: "artifacts/responsive-hero/round-1/ipad-landscape.json",
metricFailures: [],
scrollWidthMatchesViewport: true,
keyVisibleRatios: { stage: 1, map: 1, copy: 1, title: 1, application: 1 },
currentImage: "/assets/mobileHero.png"
},
concreteFindings: [
{
severity: "P1",
category: "Responsive / visual hierarchy",
location: "src/components/FairlendLandingHero/index.tsx:189,208; src/components/FairlendLandingHero/FairlendHeroProcess.tsx:138-204",
finding: "Tablet process layer bleeds under translucent compact panel. Screenshot shows ghosted `Permit / Plan approval` card behind hero copy near top-left.",
impact: "Primary offer competes with route UI; map stops feeling quiet/useful. Metrics pass because boxes are visible, but composition reads accidental.",
recommendation: "For 1024-1279 landscape, hide mobile process cards under panel, reposition route layer outside panel footprint, or add mask/opacity rule so cards never ghost through copy.",
suggestedCommand: "/impeccable-adapt-ui"
},
{
severity: "P2",
category: "Responsive / art direction",
location: "src/components/FairlendLandingHero/index.tsx:163-177; src/app/(frontend)/globals.css:17-23",
finding: "1194px landscape matches tablet CSS and loads mobileHero.png.",
impact: "Scene feels like enlarged phone crop: tall map, visible route clutter, compact panel covers focal path.",
recommendation: "Add iPad-landscape art direction (~1024-1279 landscape): desktop/bridge crop, quieter route positions, same compact form proportions.",
suggestedCommand: "/impeccable-layout-ui"
},
{
severity: "P2",
category: "Accessibility / contrast",
location: "src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:248,269",
finding: "Placeholder uses #8d8d8d on near-white panel in landscape branch.",
impact: "Visible field hint likely misses 4.5:1 AA contrast; users may miss expected input on bright tablets.",
recommendation: "Use darker muted ink token for placeholder at tablet/landscape, not neutral gray.",
suggestedCommand: "/impeccable-colorize-ui"
},
{
severity: "P3",
category: "Anti-pattern",
location: "src/components/FairlendLandingHero/index.tsx:208; src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:186",
finding: "Glass panel + metric strip are close to common AI-fintech hero grammar, though map-led concept keeps identity distinctive.",
impact: "Not generic overall, but translucent stacked panels amplify ghosting issue and reduce premium restraint.",
recommendation: "Keep map-led idea; quiet translucency where it hurts legibility. Avoid adding more cards/metrics.",
suggestedCommand: "/impeccable-quieter-ui"
}
],
preserve: [
"No horizontal overflow: scrollWidth/bodyScrollWidth = 1194.",
"Hero title, application form, map, and compact panel all fully visible in first viewport.",
"Heading scale and 16px title-to-form gap work at 1194px; no text overflow detected.",
"Header clearance works; nav does not collide with map or compact panel.",
"CTA button and tabs meet practical touch target size."
],
nextFixGuidance: [
"[P1] /impeccable-adapt-ui — create specific 1024-1279 landscape behavior for process layer vs compact panel.",
"[P2] /impeccable-layout-ui — tune iPad-landscape crop/composition so map route supports, not competes.",
"[P2] /impeccable-colorize-ui — darken placeholder/muted text roles on warm panel.",
"[P3] /impeccable-quieter-ui — reduce glass/metric-template tells without removing Fairlend map identity.",
"Final: /impeccable-polish-ui"
],
regressionRisks: [
"Do not hide desktop process cards at >=1280; issue is tablet-landscape overlap only.",
"Do not break portrait tablet/mobile route cards; they likely need separate positions.",
"Changing image source at <=1279 can affect LCP and crop; recheck 1024x768, 1112x834, 1194x834, 1279x900.",
"Making compact panel fully opaque may fix ghosting but kill map-led premium feel; prefer targeted mask/reposition.",
"Breakpoint mismatch risk: CSS tablet <=1279, GSAP desktop >=1024. Test scroll pin behavior after layout changes."
]
}
