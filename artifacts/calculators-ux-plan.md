# FairLend calculator suite — UX and interaction plan

## Product definition

**Subject:** an underwriting workbench for Ontario borrowers, small builders, rental-housing developers, mortgage professionals, and private-mortgage investors.

**Single job:** turn a user's assumptions into an inspectable preliminary scenario, while making the formula, evidence state, uncertainty, and next decision obvious.

The suite covers the 42 calculators and interactive decision tools enumerated in `seo-editorial-data-authority-brainstorm.md`. It is one product system with shared interaction rules, not 42 unrelated lead-generation forms.

## Information architecture

- `/calculators` — searchable, filterable tool directory grouped by five real user workflows.
- `/calculators/[slug]` — canonical page for each tool.
- Each tool page has the same four-part contract:
  1. inputs the user controls;
  2. results that update deterministically;
  3. methodology and source ledger;
  4. limitations and professional follow-up.
- Numerical calculators, timelines, checklists, comparators, and evidence-pack generators share one registry and shell but use model-specific fields and outputs.

## Design system extension

The suite stays inside the current FairLend brand tokens and existing header/footer. It uses the subject's own visual language: an underwriting file, ruled calculation sheets, stamped status, and a source ledger.

### Palette

The implementation uses the canonical tokens in `DESIGN.md`; the original exploratory orange/forest extension was removed during design review.

- **Landing paper** — `#F8F7F5`, continuous page and calculation-sheet surface.
- **White paper** — `#FFFDF9`, inputs and the brightest result cells.
- **Ink / deep ink** — `#08090A` / `#030405`, primary text, result anchors, and the limitations desk.
- **Muted / soft muted ink** — `#494944` / `#6C6C64`, instructions and utility labels.
- **Signal lime / signal soft / signal ink** — `#96EC18` / `#E8FF9B` / `#203500`, active workflow, focus, verification, and functional annotations.
- **Paper rule** — `#DEDED8`, structural separators and input rows.

### Type

- **Display:** Cormorant Garamond, used only for the suite thesis and tool titles.
- **Body/control:** Inter for instructions, inputs, and navigation.
- **Data/utility:** Oxanium for result values, source versions, formula labels, and model status.

### Layout

Directory:

```text
┌──────────────────────────────────────────────────────────────┐
│ thesis + tool count + search                                │
├──────────────┬───────────────────────────────────────────────┤
│ workflow     │ featured / all tool cards                    │
│ filters      │ cards encode output type + evidence burden   │
└──────────────┴───────────────────────────────────────────────┘
```

Tool workbench:

```text
┌──────────────────────────────────────────────────────────────┐
│ breadcrumb / model status / title / plain-language promise  │
├──────────────────┬──────────────────────┬────────────────────┤
│ INPUT DOCKET     │ RESULT SHEET         │ ASSUMPTION LEDGER  │
│ grouped fields   │ primary finding      │ formulas + sources │
│ scenario state   │ supporting results   │ version + caveats  │
├──────────────────┴──────────────────────┴────────────────────┤
│ interpretation / what this does not establish / next steps  │
└──────────────────────────────────────────────────────────────┘
```

At narrow widths, the columns become an ordered document: Inputs, Results, Method. Results remain an `aria-live="polite"` region; no output relies on colour alone.

## Signature interaction

Every result carries an **assumption ledger**. It distinguishes:

- `USER` — entered by the visitor;
- `PUBLISHED` — a versioned rule or threshold from an official source;
- `ILLUSTRATIVE` — a replaceable modeling assumption;
- `DERIVED` — computed directly from other values;
- `UNRESOLVED` — an input that requires a lender, lawyer, appraiser, planner, or qualified consultant.

This is the suite's intentional aesthetic risk: the page behaves like a transparent credit file rather than a friendly consumer quiz. The surrounding layout stays quiet so the ledger remains the one memorable device.

## Interaction rules

- Outputs recalculate as valid inputs change; invalid or incomplete values show actionable field errors and never display `NaN`, `Infinity`, or a fabricated zero.
- Currency defaults to CAD and percentage inputs are displayed as percentages while stored as decimals.
- Every tool ships with a realistic example scenario so the first render teaches the model.
- Result labels use decision language: “Peak cash gap,” “Debt-service constrained loan,” and “Next tier gap,” not generic “Result 1.”
- Scenario tools label base, downside, and user-defined cases; they do not label outcomes “safe” or “approved.”
- Checklists report missing evidence, not eligibility scores.
- Planned energy/accessibility work is never displayed as achieved or documented.
- Time-sensitive rules show an effective date, verification date, and source link.
- The permanent disclaimer is specific: preliminary educational model; not an approval, appraisal, quote, legal opinion, tax advice, or investment recommendation.

## Accessibility and responsive acceptance criteria

- All controls have persistent visible labels, descriptions where units or assumptions are non-obvious, and programmatic error association.
- Keyboard order follows the visible document; custom controls retain native semantics.
- Focus is always visible against ivory and forest surfaces.
- Result updates use polite announcements and never steal focus.
- Motion is limited to one result-change emphasis and is removed under `prefers-reduced-motion`.
- Content works at 320 px without horizontal page scrolling; wide tables scroll inside labeled regions.
- Minimum pointer target is 44 × 44 px for primary interactive controls on touch layouts.
- Contrast meets WCAG AA for body text, controls, error states, and focus indication.

## QA matrix

For every tool:

1. Load its canonical route directly and from the directory.
2. Verify the default scenario produces finite, labeled outputs.
3. Change each input type with keyboard only and confirm the result updates.
4. Exercise zero, minimum, maximum, empty, and invalid values.
5. Compare at least one deterministic output with a worked value independent of the implementation.
6. Verify methodology, source, version, and disclaimer are present.
7. Review at 320, 768, 1280, and 1440 CSS pixels.
8. Confirm the page does not imply approval, valuation, legal advice, zoning certainty, or an investment recommendation.
