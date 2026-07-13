import Image from 'next/image'
import type { ReactElement } from 'react'

import { ETHOS_COPY } from '../content'

type EthosProofBlockProps = {
  officeImageSrc: string
}

export function EthosProofBlock({ officeImageSrc }: EthosProofBlockProps): ReactElement {
  return (
    <header className="fairlend-ethos__proof" data-ethos-block="proof">
      <figure className="fairlend-ethos__proof-exhibit">
        <div className="fairlend-ethos__proof-photo">
          <Image
            alt="FairLend Toronto office exterior with the company sign above the entrance"
            aria-describedby="fairlend-ethos-office-caption"
            className="fairlend-ethos__proof-image"
            fill
            loading="lazy"
            sizes="(max-width: 760px) 100vw, 92vw"
            src={officeImageSrc}
          />
          <span aria-hidden="true" className="fairlend-ethos__proof-screen" />
          <span aria-hidden="true" className="fairlend-ethos__proof-registration" />
          <p className="fairlend-ethos__proof-index">FL–ETHOS / TORONTO / EXHIBIT 001</p>
        </div>

        <div className="fairlend-ethos__proof-docket">
          <p className="fairlend-ethos__eyebrow">{ETHOS_COPY.eyebrow}</p>
          <h2 id="fairlend-ethos-title">
            <span>The name on the sign</span>
            <span>is the standard inside.</span>
          </h2>
        </div>

        <figcaption
          className="fairlend-ethos__office-caption"
          id="fairlend-ethos-office-caption"
        >
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
