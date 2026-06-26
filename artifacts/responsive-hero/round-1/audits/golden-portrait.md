{
pass: false,
severity: "P1",
scoreResponsive0to4: 2,
concreteFindings: [
{
severity: "P1",
issue: "Golden-portrait hero under-fills viewport",
location: "artifacts/responsive-hero/round-1/golden-portrait.png; src/components/FairlendLandingHero/index.tsx:145",
evidence: "Viewport 1080x1920. Stage ends at y=996; 924px / 48% of first viewport is blank cream below map. Metrics still show failures=[] and visibleRatios=1, so metric pass hides visual fail.",
impact: "First fold feels unfinished on tall portrait devices; premium map-led hero collapses into top-half poster instead of full-screen landing moment.",
recommendation: "Use /impeccable-adapt-ui. Add portrait-wide rules so 901-1279px portrait fills calc(100svh - header) and does not cap stage at 900px."
},
{
severity: "P2",
issue: "Breakpoint gap misses 1080px portrait sticky behavior",
location: "src/app/(frontend)/globals.css:840-849; src/components/FairlendLandingHero/index.tsx:145",
evidence: "Sticky pin rule only runs at max-width:1023px, while golden portrait is 1080px. hero-tablet max-h-[900px] caps visual stage inside 1920px viewport.",
impact: "Large portrait tablets get long scroll spacer without pinned/full-height hero, creating dead vertical space before any next content appears.",
recommendation: "Scope sticky/full-height treatment to portrait-wide, not only max-width:1023px."
},
{
severity: "P2",
issue: "Large portrait LCP source is heavy PNG",
location: "src/components/FairlendLandingHero/index.tsx:162-167; public/assets/mobileHero.png",
evidence: "currentImage=mobileHero.png; asset size is 2.4MB.",
impact: "Tall portrait view uses expensive above-fold image; slower LCP on tablets/high-DPR mobile.",
recommendation: "Use /impeccable-optimize-ui. Serve AVIF/WebP with width candidates for portrait breakpoints."
}
],
preserve: [
"No horizontal overflow: bodyScrollWidth=1080 and scrollWidth=1080.",
"Hero internals are visible: map, stage, title, copy, application all visibleRatio=1.",
"Composition inside 900px stage works: centered compact panel, readable heading, visible application form, 44px-ish controls.",
"Map-led art direction feels specific to Fairlend; not generic AI finance hero. Keep miniature Toronto map, orange route signal, serif headline contrast."
],
nextFixGuidance: [
"[P1] /impeccable-adapt-ui — create hero-portrait-wide layout for 1080x1920: stage fills viewport height minus header; remove/raise 900px cap only for tall portrait.",
"[P2] /impeccable-optimize-ui — convert mobileHero.png to responsive AVIF/WebP sources; keep current crop/art direction.",
"[P3] /impeccable-polish-ui — re-run screenshots after adapt/optimize and tune vertical rhythm."
],
regressionRisks: [
"Do not remove max-h-[900px] globally; 768x1024 tablet currently fits well and could become too tall.",
"Changing sticky breakpoint to max-width:1279 may affect 1194x834 iPad landscape; gate by orientation: portrait or min-height threshold.",
"Raising stage height may bury form or process cards if map crop does not extend; verify title, form, route markers remain visible.",
"Scroll-transition spacer at globals.css:831-833 depends on hero pin behavior; verify reduced-motion path at globals.css:851-865."
]
}
