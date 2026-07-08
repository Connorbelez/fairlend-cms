import type { ReactElement } from 'react'

import './borrower-problem.css'

type LedgerRow = {
  /** The underwriting lens for the row. */
  axis: string
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
 * Ledger claims preserve the approved page-section wording.
 */
const ledgerRows: readonly LedgerRow[] = [
  {
    axis: 'Cost visibility',
    rushed: 'Fees show up late, after you already feel committed.',
    structured: 'Costs are discussed before signing.',
  },
  {
    axis: 'Exit terms',
    rushed: 'Payout penalties make refinancing or selling harder.',
    // COMPLIANCE: approved wording. Fallback: "Payout terms discussed before you commit."
    structured: '$0 payout fees where applicable.',
    compliance: true,
  },
  {
    axis: 'Payment issues',
    rushed: 'A missed payment turns into escalating charges.',
    // COMPLIANCE: approved wording. Fallback: "Low missed-payment administration fees instead of punitive fee spirals."
    structured: 'Administration-focused servicing, not punishment.',
    compliance: true,
  },
  {
    axis: 'Renewal path',
    rushed: 'You reach maturity with no clear next move.',
    structured: 'Maturity and renewal options are discussed up front.',
  },
  {
    axis: 'Key terms',
    rushed: 'The real deal is scattered across dense documents.',
    structured: 'Material mortgage economics are visible in the commitment.',
  },
  {
    axis: 'Next step',
    rushed: 'You get funds, but no plan to leave private money.',
    structured: 'The exit path is reviewed before funding.',
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
            A fast yes is not enough.
          </h2>
          <p className="borrower-problem__intro">
            Most borrowers look at private financing because something is urgent: a renewal problem,
            a closing date, tax or debt pressure, bruised credit, non-traditional income, or a need
            to access equity. Speed matters. But a private mortgage is still a higher-cost tool. If
            the costs, payment plan, payout rules, renewal path, and exit are unclear, the fast
            answer can become the expensive answer.
          </p>
        </header>

        <div className="borrower-problem__ledger" data-borrower-ledger>
          <div className="borrower-problem__ledger-head" aria-hidden="true">
            <span className="borrower-problem__col-label borrower-problem__col-label--rushed">
              Rushed private money
            </span>
            <span className="borrower-problem__col-label borrower-problem__col-label--structured">
              Clear private mortgage plan
            </span>
          </div>

          <ul className="borrower-problem__rows">
            {ledgerRows.map((row) => (
              <li className="borrower-problem__row" key={row.rushed}>
                <span className="borrower-problem__row-axis">{row.axis}</span>
                <div className="borrower-problem__cell borrower-problem__cell--rushed">
                  <span className="borrower-problem__cell-label">Rushed private money</span>
                  <span className="borrower-problem__cell-body">{row.rushed}</span>
                </div>
                <div
                  className="borrower-problem__cell borrower-problem__cell--structured"
                  data-compliance={row.compliance ? 'true' : undefined}
                >
                  <span className="borrower-problem__cell-label">
                    <span aria-hidden="true" className="borrower-problem__marker" />
                    Clear answer
                  </span>
                  <span className="borrower-problem__cell-body">{row.structured}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="borrower-problem__support">
          The deadline may be real. The mortgage still has to make sense before it is signed.
        </p>
      </div>
    </section>
  )
}
