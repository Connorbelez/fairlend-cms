import type { ReactElement } from 'react'

import { ETHOS_COPY } from '../content'

export function OperatingStandardBlock(): ReactElement {
  return (
    <section
      aria-labelledby="fairlend-ethos-operating-title"
      className="fairlend-ethos__operating"
      data-ethos-block="operating-standard"
      id="ethos-operating-standard"
    >
      <div className="fairlend-ethos__operating-file">
        <header className="fairlend-ethos__operating-header">
          <p>02 / Operating clause</p>
          <h3 id="fairlend-ethos-operating-title">How we operate</h3>
          <p>Borrower relationship standard / Permanent</p>
        </header>

        <div className="fairlend-ethos__operating-body">
          <p className="fairlend-ethos__operating-statement">{ETHOS_COPY.operatingStandard}</p>

          <dl className="fairlend-ethos__fee-register">
            <div>
              <dt>Hidden charges</dt>
              <dd>Excluded</dd>
            </div>
            <div>
              <dt>Predatory fees</dt>
              <dd>Excluded</dd>
            </div>
            <div>
              <dt>Repeat trust</dt>
              <dd>Required</dd>
            </div>
          </dl>
        </div>

        <div className="fairlend-ethos__relationship-clause">
          <p>{ETHOS_COPY.relationshipStandard}</p>
          <p className="fairlend-ethos__clause-status">
            <span aria-hidden="true" />
            Verified operating standard
          </p>
        </div>
      </div>
    </section>
  )
}
