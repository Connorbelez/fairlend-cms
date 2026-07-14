import Image from 'next/image'
import type { ReactElement } from 'react'

import { ETHOS_COPY } from '../content'
import { FairlendOfficeMap } from './FairlendOfficeMap.client'

type EthosProofBlockProps = {
  officeImageSrc: string
}

export function EthosProofBlock({ officeImageSrc }: EthosProofBlockProps): ReactElement {
  return (
    <header className="fairlend-ethos__proof" data-ethos-block="proof">
      <figure className="fairlend-ethos__proof-exhibit">
        <div className="fairlend-ethos__proof-photo">
          <div className="fairlend-ethos__proof-office-panel">
            <Image
              alt="FairLend Toronto office exterior with the company sign above the entrance"
              aria-describedby="fairlend-ethos-office-caption"
              className="fairlend-ethos__proof-image"
              fill
              loading="lazy"
              sizes="(max-width: 760px) 100vw, 58vw"
              src={officeImageSrc}
            />
            <span aria-hidden="true" className="fairlend-ethos__proof-screen" />
          </div>
          <FairlendOfficeMap />
          <span aria-hidden="true" className="fairlend-ethos__proof-registration" />
          <p className="fairlend-ethos__proof-index">FL–ETHOS / TORONTO / EXHIBIT 001</p>
        </div>

        <div className="fairlend-ethos__proof-docket">
          <p className="fairlend-ethos__eyebrow">{ETHOS_COPY.eyebrow}</p>
          <h2 id="fairlend-ethos-title">
            <span className="sr-only">{ETHOS_COPY.headline}</span>
            <span aria-hidden="true">The name on the sign</span>
            <span aria-hidden="true">is the standard inside.</span>
          </h2>
        </div>

        <figcaption className="fairlend-ethos__office-caption" id="fairlend-ethos-office-caption">
          {ETHOS_COPY.officeCaption}
        </figcaption>
      </figure>

      <div className="fairlend-ethos__proof-ledger">
        <div className="fairlend-ethos__proof-ledger-meta" aria-label="Exhibit status">
          <span>Subject</span>
          <strong>FairLend standard</strong>
          <span>Status</span>
          <strong>Accountable</strong>
        </div>
        <p className="fairlend-ethos__proof-thesis">{ETHOS_COPY.opening}</p>
      </div>
    </header>
  )
}
