import Image from 'next/image'
import type { ReactElement } from 'react'

import { CAPITAL_TRAP_AUDIT, ETHOS_COPY } from '../content'

type CapitalTrapsBlockProps = {
  auditSpecimenImageSrc: string
  skylineImageSrc: string
}

export function CapitalTrapsBlock({
  auditSpecimenImageSrc,
  skylineImageSrc,
}: CapitalTrapsBlockProps): ReactElement {
  return (
    <section
      aria-labelledby="fairlend-ethos-housing-title"
      className="fairlend-ethos__capital-audit"
      data-ethos-block="capital-audit"
      id="ethos-capital-audit"
    >
      <div className="fairlend-ethos__capital-audit-copy">
        <p className="fairlend-ethos__block-code fairlend-ethos__block-code--inverse">
          03 / Capital allocation diagnosis
        </p>
        <h3 id="fairlend-ethos-housing-title">{ETHOS_COPY.housingHeading}</h3>
        <p>{ETHOS_COPY.capitalTrap}</p>
      </div>

      <div className="fairlend-ethos__capital-audit-plate">
        <header className="fairlend-ethos__capital-audit-plate-header">
          <span>Existing allocation pattern</span>
          <span>Toronto / Current market</span>
        </header>

        <figure className="fairlend-ethos__capital-audit-specimen">
          <Image
            alt="Engraved compact condominium floor plan above an unfinished luxury single-family construction site"
            fill
            loading="lazy"
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1080px) 52vw, 25rem"
            src={auditSpecimenImageSrc}
          />
          <span
            aria-hidden="true"
            className="fairlend-ethos__capital-audit-marker fairlend-ethos__capital-audit-marker--a"
          >
            <span className="fairlend-ethos__capital-audit-leader" />A
          </span>
          <span
            aria-hidden="true"
            className="fairlend-ethos__capital-audit-marker fairlend-ethos__capital-audit-marker--b"
          >
            <span className="fairlend-ethos__capital-audit-leader" />B
          </span>
          <figcaption>Two capital patterns / One constrained housing market</figcaption>
        </figure>

        <ol className="fairlend-ethos__capital-findings">
          {CAPITAL_TRAP_AUDIT.map((item) => (
            <li data-audit-code={item.code} key={item.code}>
              <span className="fairlend-ethos__capital-finding-code">{item.code}</span>
              <div>
                <small>Capital pattern</small>
                <strong>{item.subject}</strong>
              </div>
              <div>
                <small>{item.dimension}</small>
                <p>{item.finding}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="fairlend-ethos__reallocation-bridge">
        <span aria-hidden="true" className="fairlend-ethos__reallocation-trace" />
        <span className="fairlend-ethos__reallocation-label">Reallocate toward</span>
        <strong>Family-sized, medium-density housing</strong>
        <span aria-hidden="true" className="fairlend-ethos__reallocation-arrow">
          ↘
        </span>
      </div>

      <figure className="fairlend-ethos__capital-skyline">
        <Image
          alt="Engraved Toronto skyline and active construction sites"
          fill
          loading="lazy"
          sizes="(max-width: 760px) 100vw, 62vw"
          src={skylineImageSrc}
        />
        <figcaption>Toronto housing supply / Reallocation target</figcaption>
      </figure>
    </section>
  )
}
