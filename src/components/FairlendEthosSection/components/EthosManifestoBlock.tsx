import Image from 'next/image'
import type { ReactElement } from 'react'

import { ETHOS_COPY, VISION_OUTCOMES } from '../content'

type EthosManifestoBlockProps = {
  housingImageSrc: string
}

export function EthosManifestoBlock({
  housingImageSrc,
}: EthosManifestoBlockProps): ReactElement {
  return (
    <footer
      className="fairlend-ethos__manifesto"
      data-ethos-block="manifesto"
      id="ethos-manifesto"
    >
      <div className="fairlend-ethos__manifesto-seal">
        <p>The FairLend standard / 05</p>
        <span aria-hidden="true" />
        <p>Shared success / Toronto</p>
      </div>

      <figure aria-hidden="true" className="fairlend-ethos__manifesto-housing">
        <Image
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 900px) 1px, 30vw"
          src={housingImageSrc}
        />
      </figure>

      <blockquote>
        <span className="sr-only">{ETHOS_COPY.pullQuote}</span>
        <span aria-hidden="true">Fair lending is not charity.</span>{' '}
        <span aria-hidden="true">It is an operating model built around shared success.</span>
      </blockquote>

      <div className="fairlend-ethos__vision-file">
        <p className="fairlend-ethos__vision">{ETHOS_COPY.vision}</p>
        <ol aria-label="FairLend vision outcomes" className="fairlend-ethos__vision-outcomes">
          {VISION_OUTCOMES.map((outcome, index) => (
            <li key={outcome}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {outcome}
            </li>
          ))}
        </ol>
      </div>
    </footer>
  )
}
