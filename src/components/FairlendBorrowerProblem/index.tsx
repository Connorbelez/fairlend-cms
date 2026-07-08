import type { ReactElement } from 'react'

import './borrower-problem.css'

type LedgerRow = {
  /** The trap behaviour on a rushed private mortgage. */
  rushed: string
  /** FairLend's structured counterpart. */
  structured: string
  /** Whether the structured cell carries a compliance-sensitive fee claim. */
  compliance?: boolean
}

/**
 * Section 2 — Problem / Foil.
 *
 * Names the real enemy: not just slow banks, but a rushed private mortgage that
 * hides cost, payout, renewal, default and maturity risk. Rendered as a paired
 * ledger ("A rushed yes" vs "A structured answer") with hairline rows — calm
 * and protective, not alarmist red.
 *
 * Copy locked from the page section breakdown.
 */
const ledgerRows: readonly LedgerRow[] = [
  {
    rushed: 'Fees discovered later, buried in dense legal documents.',
    structured: 'Costs discussed before signing.',
  },
  {
    rushed: 'Payout penalties that punish the exit.',
    // COMPLIANCE: approved wording. Fallback: "Payout terms discussed before you commit."
    structured: '$0 payout fees where applicable.',
    compliance: true,
  },
  {
    rushed: 'Missed-payment charges that spiral into a fee trap.',
    // COMPLIANCE: approved wording. Fallback: "Low missed-payment administration fees instead of punitive fee spirals."
    structured: 'Administration-focused servicing, not punishment.',
    compliance: true,
  },
  {
    rushed: 'Renewal pressure that quietly consumes equity.',
    structured: 'Maturity and renewal path discussed up front.',
  },
  {
    rushed: 'Legal documents that change the economics.',
    structured: 'Material mortgage economics belong in the commitment.',
  },
  {
    rushed: 'No practical plan for what happens next.',
    structured: 'Exit path reviewed before funding.',
  },
]

export function FairlendBorrowerProblem(): ReactElement {
  return (
    <section
      aria-labelledby="borrower-problem-title"
      className="borrower-problem"
      data-borrower-problem
    >
      <div className="borrower-problem__inner">
        <header className="borrower-problem__header">
          <h2 className="borrower-problem__title" id="borrower-problem-title">
            Private financing should solve pressure, not create a bigger problem.
          </h2>
          <p className="borrower-problem__intro">
            Most borrowers arrive under pressure: a renewal problem, a time-sensitive closing, debt or
            tax pressure, bruised credit, non-traditional income, or a need to access equity. A fast
            “yes” can feel like the only thing that matters. But a private mortgage is a higher-cost
            tool. If the costs, risks, payment plan, payout rules, renewal mechanics, default
            charges, and exit are not clear, speed can become expensive.
          </p>
        </header>

        <div className="borrower-problem__ledger" data-borrower-ledger>
          <div className="borrower-problem__ledger-head" aria-hidden="true">
            <span className="borrower-problem__col-label borrower-problem__col-label--rushed">
              A rushed yes
            </span>
            <span className="borrower-problem__col-label borrower-problem__col-label--structured">
              A structured answer
            </span>
          </div>

          <ul className="borrower-problem__rows">
            {ledgerRows.map((row) => (
              <li className="borrower-problem__row" key={row.rushed}>
                <div className="borrower-problem__cell borrower-problem__cell--rushed">
                  <span className="borrower-problem__cell-label">A rushed yes</span>
                  <span className="borrower-problem__cell-body">{row.rushed}</span>
                </div>
                <div
                  className="borrower-problem__cell borrower-problem__cell--structured"
                  data-compliance={row.compliance ? 'true' : undefined}
                >
                  <span className="borrower-problem__cell-label">
                    <span aria-hidden="true" className="borrower-problem__marker" />
                    A structured answer
                  </span>
                  <span className="borrower-problem__cell-body">{row.structured}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="borrower-problem__support">
          You should understand the mortgage before you sign it.
        </p>
      </div>
    </section>
  )
}
