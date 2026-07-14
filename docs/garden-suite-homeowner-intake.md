# Garden and laneway homeowner intake

Last reviewed: 2026-07-14

## Routing contract

Any build intake URL whose normalized `projectScope` is `garden-laneway-suites` renders the
`garden-suite-homeowner` DrawFlow variant. Source attribution is preserved. Missing, invalid, and
other project scopes continue to render the builder intake.

The current Route Selector, landing overview, About, and header Garden/Laneway links already carry
the required project scope, so future links receive the same behavior by using
`buildFairlendIntakeHref` with that scope.

## Product behavior

The flow opens directly on a three-step property check:

1. Property address, ownership, occupancy, and intended suite type.
2. Starting stage, requested support, approximate cash/home-equity contribution, and timing.
3. Contact details, optional context, and acknowledgement.

Potentially ineligible ownership or occupancy answers never dead-end the lead. The success state
states that FairLend performs a human review and does not promise zoning, program, lending, or
financing eligibility.

The homeowner variant does not collect doors or units, generic build type, capital-stack sizing,
project team, borrower experience, professional role, or a permit filename. It requires full
completion and does not expose a partial-submission action.

## Persistence contract

- Top-level lead intent remains `build` and the originating `source` is retained.
- `intake.projectScope` is fixed to `Garden & laneway suites`.
- `intake.intakeVariant` is `garden-suite-homeowner`.
- `approximateEquity`, `timeline`, `projectStage`, `financingNeeds`, and `notes` use existing
  normalized admin/export fields; no database migration is required.
- Draft answers and lead IDs use Garden-specific versioned local-storage keys and never hydrate the
  builder wizard.
- URL-prefilled address and lead ID values override saved Garden draft values.
- Lead-ID autosaves remain `status: draft` with `completionStatus: partial`; the explicit final
  submission is `status: submitted` with `completionStatus: complete`.
