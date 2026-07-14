import type { ReactElement } from 'react'

import './investor-regulator-band.css'

/**
 * Section 9 — Built Around What Regulators Are Watching (Concept C band).
 *
 * Deliberately under-designed: a slim full-width band, one confident
 * sentence, and a link to how capital is protected. Reads as confidence, not
 * defensiveness. Compliance: never imply endorsement by FSRA.
 */
export function FairlendInvestorRegulatorBand(): ReactElement {
  return (
    <section
      aria-labelledby="investor-regulator-title"
      className="investor-regulator"
      data-investor-regulator
      id="investor-regulation"
    >
      <div className="investor-regulator__inner">
        <p className="investor-regulator__eyebrow">FSRA-aligned administration discipline</p>
        <h2 className="investor-regulator__title" id="investor-regulator-title">
          We welcome the scrutiny private mortgages are under.
        </h2>
        <p className="investor-regulator__lede">
          It rewards exactly the discipline we&apos;ve built our platform around: documented
          underwriting, transparent files, administration agreements, payment and disbursement
          tracking, portal reporting, plain-language conflict disclosure, and recovery readiness.
        </p>
        <a className="investor-regulator__link" href="#investor-protection-stack">
          See how capital is protected
          <span aria-hidden="true" className="investor-regulator__link-arrow">→</span>
        </a>
      </div>
    </section>
  )
}
