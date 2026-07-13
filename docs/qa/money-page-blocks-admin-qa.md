# Money page blocks: Payload admin QA

Date: 2026-07-12  
QA page: `/money-page-blocks-qa-2026-07-12`  
Payload document: Pages `51` (`Published`)

## Acceptance result

- 10/10 money-page block types were created manually in the Payload page editor.
- Every text, textarea, rich-text, upload, relationship/link, checkbox, select, group, and nested array field was authored through the admin UI.
- The saved Payload document was audited through the authenticated API view: zero simple-field, option, rich-text, or media mismatches.
- The published frontend rendered 10/10 block roots with the authored block type, variant, anchor, surface, spacing, content, links, and assets.
- Disclosure decision-path selection and FAQ expand/collapse interactions passed.
- `enableStructuredData=false` correctly omitted FAQPage JSON-LD.
- The frontend emitted no console warnings or errors during the final pass.

## Block matrix

| Block | Admin fields exercised | Frontend evidence | Result |
| --- | --- | --- | --- |
| Hero | variant, heading level, route label, heading, summary, proof array, two media fields, caption, action, anchor, presentation | H2, proof line, primary/mobile assets, caption, action, `#qa-hero` | Pass |
| Narrative | variant, system label, heading, intro, narrative, aside title/copy, action, anchor, presentation | narrative, field note, action, `#qa-narrative` | Pass |
| Media Split | video variant, headings/copy, points, action, media, poster, playback, caption, anchor, presentation | asset, point, action, video configuration data, `#qa-media-split` | Pass |
| Features | variant, headings, two items, route codes, rich copy, proof, nested media/action, anchor, presentation | two evidence rows, nested media/action, `#qa-features` | Pass |
| Process | variant, headings, two steps, rich copy, deliverables, nested media, action, anchor, presentation | ordered stages, media, action, `#qa-process` | Pass |
| Proof | variant, headings, quote, source group, portrait, outcome array, action, anchor, presentation | quote/source/portrait/outcome/action, `#qa-proof` | Pass |
| Comparison | variant, headings, two columns, recommendation flag, two criteria, four matrix values, action, anchor, presentation | complete decision matrix and action, `#qa-comparison` | Pass |
| Disclosure | decision-path variant, headings, two items, rich copy, signals, nested media/action, open-first toggle, anchor, presentation | no initial selection, Path B selection/content, `#qa-disclosure` | Pass |
| FAQ | variant, headings, two questions/answers, structured-data toggle, open-first toggle, anchor, presentation | initially closed answers, expansion works, JSON-LD absent, `#qa-faq` | Pass |
| CTA | variant, headings, body, two actions, media, trust note, disclosure, anchor, presentation | primary/secondary actions, media, trust/disclosure, `#qa-cta` | Pass |

## Issues fixed

1. Presentation fields after reload
   - Symptom: only the first money-page block retained editable nested presentation controls after a full admin reload.
   - Fix: flattened the controls to `presentationSurface`, `presentationTexture`, and `presentationSpacing`, retained the existing PostgreSQL column names, and assigned unique short enum aliases per block.
   - Verification: all three controls rendered after reload on every one of the ten block rows.

2. Repeated action enum aliases
   - Symptom/risk: action editors shared the same enum alias and exhibited the same post-reload schema-collision pattern.
   - Fix: assigned a unique short link-type enum alias to every action-bearing block and generated the corresponding migration.
   - Verification: saved custom action rows reopened with type, URL, label, and new-tab controls intact.

3. Disclosure `openFirst=false`
   - Symptom: tabs and decision paths always selected the first item, ignoring the Payload toggle.
   - Fix: omit the Tabs `defaultValue` when `openFirst` is false.
   - Verification: neither path is initially selected; selecting Path B reveals only the Path B panel.

## Commands intentionally not run

No build, Playwright, E2E, or test command was run, per the project instructions for marketing-page work. `pnpm generate:types` was run after the schema change.
