import type { ReactElement } from 'react'
import { BadgeCheck, Landmark } from 'lucide-react'

import { lenderFitSignals } from './data'

export function LenderFitMatrix(): ReactElement {
  return (
    <section className="im-fit" id="lender-fit" aria-labelledby="im-fit-title">
      <div className="im-fit__lead">
        <Landmark aria-hidden="true" />
        <h2 id="im-fit-title">Institutions do not underwrite one number.</h2>
        <p>
          A credit score or rate quote cannot explain the whole decision. Institutional approval
          comes from the way borrower, property, structure, and transaction fit one lender’s policy
          at the same time.
        </p>
      </div>
      <div className="im-fit__matrix">
        {lenderFitSignals.map(({ detail, evidence, icon: Icon, title }, index) => (
          <article className="im-fit__cell" key={title}>
            <div className="im-fit__cell-head">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <Icon aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{detail}</p>
            <small>{evidence}</small>
          </article>
        ))}
      </div>
      <div className="im-fit__annotation">
        <BadgeCheck aria-hidden="true" />
        <p>
          <strong>FairLend’s job:</strong> make the file legible before asking a lender to judge it.
        </p>
      </div>
    </section>
  )
}
