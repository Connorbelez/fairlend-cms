# CTA Hoist Hero Concepts

Eight CTA Hoist variants generated with the built-in image-generation workflow and the supplied FairLend references. Every concept uses the same low-complexity animation contract: the static scene remains anchored; the hook/cable and complete form move as rigid elements.

| File | Static backdrop | Hoisted CTA treatment |
| --- | --- | --- |
| `01-blueprint-hoist.png` | Blueprint cutaway and technical route | Portrait project-assessment form centred between copy and suite |
| `02-ivory-dossier-hoist.png` | Overhead property survey on ivory paper | Project file pulled upward from the site plan |
| `03-laneway-hoist.png` | Full-width engraved backyard and completed suite | Dark form lifted from behind the landscape |
| `04-field-board-hoist.png` | Forest construction field and site elevation | Wide landscape form suspended as a technical site board |
| `05-foundation-file-hoist.png` | Architectural section, utilities and soil strata | Financing form pulled through the foundation line |
| `06-milestone-form-hoist.png` | Four static construction stages | Compact form positioned above the completed build state |
| `07-ink-minimal-hoist.png` | Minimal deep-ink field and small cutaway model | Oversized lime assessment form in open negative space |
| `08-team-file-hoist.png` | Static homeowner, planner, builder and suite | Central coordination form hoisted into the team composition |

## Implementation contract

- Hook and cable: one narrow asset wrapper; animate `translateY`; extend the cable with `scaleY` from a top transform origin.
- CTA form: one rigid wrapper containing live HTML fields and button; animate only `translateY` and opacity.
- Verification marker: optional independent element using scale and opacity.
- Do not animate straps, hooks, fields, people, buildings, landscaping or drawing details internally.
- Use exponential ease-out with no bounce. Under `prefers-reduced-motion`, render the form directly in its final usable position.
- Recreate all form controls as live HTML. Generated form typography and field content are composition references only.

## Prompt set

All prompts used the `ui-mockup` taxonomy, identified the DrawFlow Atlas image as the primary reference, treated the remaining supplied images as supporting FairLend brand references, required one horizontal hero, preserved the approved Garden Suite value proposition, and prohibited skeuomorphism, glass, gradients, glow, soft shadows and articulated Lottie-style motion.
