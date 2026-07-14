# Partial intake submission contract

Last reviewed: 2026-07-13

The long-form intake keeps the full structured path available, but exposes **Skip and submit** once FairLend has enough information to identify the request and contact the lead.

## Minimum fields

| Flow | Required before early submission | Optional at this point |
| --- | --- | --- |
| Private or residential mortgage | Mortgage purpose, name, valid email | Phone, address, property, debt, amount, timing, notes |
| Rental acquisition/refinance | Transaction, acquisition/ownership status, ownership structure, name, valid email, phone | Address, property, rent, financing, timing, notes |
| Construction / DrawFlow | Project scope, current property status, name, valid email | Phone, address, permit, project economics, team, timing, notes |

The rental flow necessarily validates the transaction/ownership fields before step two, where early submission first becomes available. Continue always remains available for a complete structured intake.

## Downstream contract

- Partial payloads persist `intake.completionStatus: "partial"`.
- Mortgage/rental records prefix `intake.detail` with `[Partial intake]`.
- Construction records prefix `intake.notes` with `[Partial intake]`.
- The normalized admin record and CSV export retain that partial label through `intakeDetail`, while the raw intake JSON retains `completionStatus`.
- Lead analytics include `completion_status: "partial"` on partial-submit and lead-submit events.
- Partial submissions use the normal `submitted` lead status and API validation; they are not abandoned drafts.

## Product behavior

- The secondary action appears only after the applicable minimum fields are valid.
- The action is labelled **Skip and submit**, never “skip,” “close,” or “finish later.”
- Success messaging explicitly confirms that an initial/partial profile was saved.
