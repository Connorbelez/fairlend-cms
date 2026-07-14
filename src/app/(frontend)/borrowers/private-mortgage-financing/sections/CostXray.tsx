import { type ReactElement } from 'react'
import { BadgeCheck } from 'lucide-react'

import { comparisonRows } from './data'

export function CostXray(): ReactElement {
  return (
    <section className="pm-xray" aria-labelledby="pm-xray-title">
      <header className="pm-xray__header">
        <p className="pm-label pm-label--light">Cost X-ray</p>
        <h2 id="pm-xray-title">A fast yes is not enough.</h2>
        <p>
          Speed matters. But a private mortgage is still a higher-cost tool. If the costs, payment
          plan, payout rules, renewal path, and exit are unclear, the fast answer can become the
          expensive answer.
        </p>
      </header>

      <div className="pm-xray__equation" aria-label="Total private mortgage cost equation">
        <span>Total private mortgage cost</span>
        <strong aria-hidden="true">=</strong>
        <p>rate + fees + conditions + payout + renewal + default + closing costs + exit</p>
      </div>

      <div
        className="pm-xray__ledger"
        role="table"
        aria-label="Private mortgage structure comparison"
      >
        <div className="pm-xray__ledger-head" role="row">
          <span role="columnheader">Review axis</span>
          <span role="columnheader">Rushed private money</span>
          <span role="columnheader">Clear private mortgage plan</span>
        </div>
        {comparisonRows.map(([axis, rushed, clear]) => (
          <div className="pm-xray__row" role="row" key={axis}>
            <strong role="rowheader">{axis}</strong>
            <p role="cell">
              <span className="pm-xray__cell-label">Rushed private money</span>
              {rushed}
            </p>
            <p role="cell">
              <span className="pm-xray__cell-label">Clear private mortgage plan</span>
              <BadgeCheck aria-hidden="true" /> {clear}
            </p>
          </div>
        ))}
      </div>

      <p className="pm-xray__closing">
        The deadline may be real. The mortgage still has to make sense before it is signed.
      </p>
    </section>
  )
}
