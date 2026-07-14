import type { ReactElement } from 'react'
import { Check, ShieldCheck } from 'lucide-react'

import { termSheetRows } from './data'

export function TermSheet(): ReactElement {
  return (
    <section className="im-terms" aria-labelledby="im-terms-title">
      <div className="im-terms__lead">
        <p className="im-system-label im-system-label--lime">
          Mortgage economics / compare line by line
        </p>
        <h2 id="im-terms-title">The lowest rate can still be the wrong commitment.</h2>
        <p>
          Approval certainty, prepayment rights, fees, conditions, and timing can change the real
          value of a mortgage. Compare the document, not the headline.
        </p>
      </div>
      <div className="im-terms__sheet">
        <header>
          <div>
            <span>Institutional term sheet</span>
            <strong>Comparison copy</strong>
          </div>
          <ShieldCheck aria-hidden="true" />
        </header>
        <div className="im-terms__rows">
          {termSheetRows.map(([label, detail], index) => (
            <div key={label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{label}</h3>
              <p>{detail}</p>
              <Check aria-hidden="true" />
            </div>
          ))}
        </div>
        <footer>
          <span>Rate is one field.</span>
          <strong>The commitment is the product.</strong>
        </footer>
      </div>
    </section>
  )
}
