import Image from 'next/image'
import type { ReactElement } from 'react'

import { CAPITAL_TRAP_AUDIT, ETHOS_COPY } from '../content'

type CapitalTrapsBlockProps = {
  skylineImageSrc: string
}

export function CapitalTrapsBlock({ skylineImageSrc }: CapitalTrapsBlockProps): ReactElement {
  return (
    <section
      aria-labelledby="fairlend-ethos-housing-title"
      className="fairlend-ethos__capital-audit"
      data-ethos-block="capital-audit"
      id="ethos-capital-audit"
    >
      <div className="fairlend-ethos__capital-audit-copy">
        <p className="fairlend-ethos__block-code fairlend-ethos__block-code--inverse">
          03 / Capital allocation audit
        </p>
        <h3 id="fairlend-ethos-housing-title">{ETHOS_COPY.housingHeading}</h3>
        <p>{ETHOS_COPY.capitalTrap}</p>
      </div>

      <figure className="fairlend-ethos__capital-skyline">
        <Image
          alt="Engraved Toronto skyline and active construction sites"
          fill
          loading="lazy"
          sizes="(max-width: 760px) 100vw, 62vw"
          src={skylineImageSrc}
        />
        <figcaption>Toronto capital allocation / Existing pattern</figcaption>
      </figure>

      <ol className="fairlend-ethos__capital-findings">
        {CAPITAL_TRAP_AUDIT.map((item) => (
          <li key={item.code}>
            <span>{item.code}</span>
            <strong>{item.subject}</strong>
            <p>{item.finding}</p>
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className="fairlend-ethos__reallocation-rule">
        <span />
      </div>
    </section>
  )
}
