import Image from 'next/image'
import type { ReactElement } from 'react'

import { ETHOS_COPY, HOUSING_TYPES } from '../content'

export function HousingOpportunityBlock(): ReactElement {
  return (
    <section
      aria-labelledby="fairlend-ethos-opportunity-title"
      className="fairlend-ethos__opportunity"
      data-ethos-block="housing-opportunity"
      id="ethos-housing-opportunity"
    >
      <header className="fairlend-ethos__opportunity-header">
        <div>
          <p className="fairlend-ethos__block-code">04 / Capital that builds</p>
          <h3 id="fairlend-ethos-opportunity-title">Medium density. Family scale.</h3>
        </div>
        <p className="fairlend-ethos__opportunity-proposition">{ETHOS_COPY.housingOpportunity}</p>
      </header>

      <div className="fairlend-ethos__site-plan">
        <div className="fairlend-ethos__site-plan-meta" aria-hidden="true">
          <span>Street frontage</span>
          <span>Attainable housing register</span>
          <span>Family-scale yield</span>
        </div>

        <ol className="fairlend-ethos__housing-types">
          {HOUSING_TYPES.map((housingType) => (
            <li key={housingType.label}>
              <figure>
                <div className="fairlend-ethos__housing-image">
                  <Image
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(max-width: 760px) 76vw, 28vw"
                    src={housingType.asset}
                  />
                </div>
                <figcaption>
                  <span>{housingType.code}</span>
                  {housingType.label}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>

      <div className="fairlend-ethos__economics-ledger">
        <div className="fairlend-ethos__economics-meta">
          <span>Method</span>
          <strong>Select / Underwrite / Finance</strong>
          <span>Outcomes</span>
          <strong>Investor return + needed housing</strong>
        </div>
        <p>{ETHOS_COPY.alignedEconomics}</p>
        <p className="fairlend-ethos__economics-reconciliation">
          Commercial value
          <span aria-hidden="true" />
          Social value
        </p>
      </div>
    </section>
  )
}
