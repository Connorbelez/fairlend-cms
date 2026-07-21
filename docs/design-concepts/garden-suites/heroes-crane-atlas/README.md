# Crane Atlas Hero Concepts

Eight additional Garden Suite hero directions derived from the dark DrawFlow Atlas concept. Each render keeps the crane and its payload as separable motion assets rather than baking them into the static architectural base.

| File | Crane action | Static base | Animated groups | Reduced-motion state |
| --- | --- | --- | --- | --- |
| `01-roof-lift.png` | Seat the roof | Cutaway suite and ground plane | Tower crane, trolley, hook, cables, roof slab, BUILD node | Roof seated; BUILD verified |
| `02-wall-swing.png` | Install prefab wall | Timber frame and foundation | Mobile crane, boom, cable, wall panel, swing arc, alignment marks | Wall locked; VERIFY active |
| `03-foundation-drop.png` | Lower rebar cage | Excavation, formwork and soil section | Crawler crane, boom, winch, hook, cage, target box, seal | Cage seated; FOUNDATION verified |
| `04-milestone-gantry.png` | Advance material to build | Half-built suite and staging area | Gantry trolley, hook, timber bundle, plumb lines, BUILD node | Trolley parked; bundle staged |
| `05-window-set.png` | Place window unit | Blueprint panel and enclosed shell | Spider crane, articulated boom, cable, window, alignment corners | Window seated; ENCLOSURE verified |
| `06-module-join.png` | Join prefab halves | Shared foundation | Two cranes, hooks, two modules, alignment pins, seam, JOIN node | Modules joined; JOIN verified |
| `07-plot-the-build.png` | Trace the plan | Blueprint plan and site boundary | Crane, trolley, stylus, lime perimeter, rising wall group, PLOT seal | Outline complete; walls revealed |
| `08-exploded-build.png` | Assemble vertical layers | Foundation footprint and guide grid | Crane, hook, roof, interior pod, frame, floor, guide pins, COMPLETE seal | Full suite assembled |

## Motion rules

- Keep marketing copy and controls as live HTML. Rebuild labels, routes, nodes, dimensions and alignment marks as SVG/CSS.
- Export every crane component and payload as an isolated transparent asset. Use a fixed transform origin at the physical hinge, trolley or hook point.
- Sequence motion with exponential ease-out; no bounce or elastic easing. Cable length should update with hook travel rather than scaling the whole crane.
- Use lime only when the animation advances, aligns, funds, or verifies a real project state.
- Never animate the complete illustration as one floating layer. The architectural base remains anchored while the crane performs one legible job.
- Under `prefers-reduced-motion`, render the final assembled and verified state immediately.
