# Garden Suite Hero Concepts

Eight standalone desktop hero directions generated from `DESIGN.md`, the Garden Suite money-page production copy, and the supplied FairLend references.

All concepts preserve the same core system: ivory/ink paper fields, electric-lime action and verification, Cormorant/Inter/Oxanium typography, hard rules and offsets, and monochrome halftone/stipple illustration. Motion should use exponential ease-out, complete cleanly under `prefers-reduced-motion`, and communicate a financing verb such as trace, reveal, verify, advance, or complete.

| File | Concept | Static base | Separable motion layers |
| --- | --- | --- | --- |
| `01-laneway-horizon.png` | Laneway Horizon | Toronto lane, skyline, Garden Suite build | Three cloud groups, route, property pin, verification slip |
| `02-vertical-city-ledger.png` | Vertical City Ledger | Skyline, CN Tower, backyard suite | Four cloud groups, route segment, verification node, evidence tabs |
| `03-drawflow-atlas.png` | DrawFlow Atlas | Blueprint field, axonometric cutaway, residential strip | Cloud wisps, crane hook, milestone route, active nodes |
| `04-parcel-becomes-plan.png` | Parcel Becomes a Plan | Overhead property/site survey | Suite model, permit stack, route strip, compass, scale, footprint nodes |
| `05-build-assembly.png` | Build Assembly | Ivory technical field | Four construction states, worker, material lift, lumber, milestone progress |
| `06-capital-in-section.png` | Capital in Section | Forest field, architectural cutaway, soil strata | Draw bands, inspection seal, release nodes, document/tool overlays |
| `07-team-around-build.png` | Team Around the Build | Ivory/topographic field, central suite | Homeowner, planner, builder, advisor, documents, tools, coordinated route |
| `08-backyard-reveal.png` | Backyard Reveal | Matched backyard composition | Before/after clip reveal, tree/fence/path depth layers, route, verification stamps |

## Implementation notes

- Keep all copy and controls as live HTML; the generated typography is layout reference only.
- Rebuild route lines, nodes, labels, rules, and lime markers as SVG or CSS so they stay crisp and accessible.
- Export monochrome illustration groups independently with transparent backgrounds; do not bake moving assets into the paper field.
- Treat Toronto context as a static establishing device in concepts 01–03. Concepts 04–08 intentionally shift to parcel, construction, capital, team, and transformation narratives.
- Do not place grain over live type or controls. Texture belongs inside illustrations or the background paper material.
- Reduced motion should show the fully traced, verified, or revealed final state.
