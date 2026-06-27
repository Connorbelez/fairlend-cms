{
pass: false,
severity: "P1",
scoreResponsive0to4: 2,
concreteFindings: [
{
severity: "P1",
category: "Responsive / Motion",
issue: "Process step cards absent in captured large-wide state; route shows orange markers/leader lines with no Permit/Acquisition/Construction/Completion labels.",
evidence: "large-wide.png; FairlendHeroProcess.tsx:278-279 uses opacity-0 plus delayed motion-safe animation.",
impact: "Hero loses guided-project-path story; vertical ticks read unfinished/decorative. Reduced-motion users risk never seeing cards.",
recommendation: "Make cards visible by default; animate transform/filter only, or add reduced-motion visible fallback. If cards crowd map, remove leaders too or use quieter inline labels."
},
{
severity: "P2",
category: "Responsive / Form clarity",
issue: "Primary form placeholder clips: visible text reads `Enter your property addi` inside 560px card.",
evidence: "large-wide.png application crop; form box 1944x1091, 560x210. FairlendApplicationForm.client.tsx:186,238,269.",
impact: "Primary CTA affordance looks broken and slightly lowers trust at flagship viewport.",
recommendation: "Give Google autocomplete input/wrapper `min-w-0 w-full`, reduce hero-landscape placeholder font, or rebalance grid columns before widening whole card."
},
{
severity: "P2",
category: "Responsive / Composition",
issue: "Hero title and map boundary too tight for 2560px canvas: title right=820px, map left=763px; visible slab nearly kisses `Land Purchase`.",
evidence: "large-wide.json title/map boxes; index.tsx:145,153,155,219.",
impact: "Premium wide layout feels compressed despite available space; conflicts with anti-reference against cramped hero type.",
recommendation: "At ≥1920px, shift/scale map right 2-4% or cap H1 around 116-120px while preserving left hero dominance."
}
],
preserve: [
"No horizontal overflow: bodyScrollWidth=scrollWidth=2560.",
"Copy, map, application, and stage all visible: visibleRatios=1 for tracked boxes.",
"Map-led art direction strong; route/property focal point lands well on right side.",
"Application card stays clear of title/copy and stats strip; CTA target size strong.",
"Stats strip and registration disclosure stay readable without stealing hero focus."
],
nextFixGuidance: [
"[P1] /impeccable-animate-ui — remove opacity-gated process cards; add reduced-motion visible state.",
"[P2] /impeccable-layout-ui — fix application input truncation and wide-screen title/map gutter.",
"[P2] /impeccable-polish-ui — re-capture 2560x1440 and verify labels, placeholder, and no horizontal scroll."
],
regressionRisks: [
"Process cards visible by default may crowd city labels; test after animation and with reduced motion.",
"Widening form can collide with route/property or stats at 1280-1500 landscape; prefer input sizing first.",
"Shrinking H1 too far weakens brand hierarchy; tune map offset before reducing type scale heavily.",
"Changing stage/grid vars can reintroduce horizontal overflow; keep bodyScrollWidth equal viewport."
]
}
