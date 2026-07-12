import type { ReactElement } from 'react'

import './investor-fractional.css'

/**
 * Section 8 — Fractional Access (Concept A, whole vs fractional illustration).
 *
 * A single mortgage represented as a whole, then divided into participation
 * slices, with a short caption on diversification. Kept restrained — no
 * celebratory graphics, no risk-reduction implication.
 *
 * Compliance: fractional/syndicated structures carry the same risks; never
 * presented as risk reduction or a guarantee. Structure and minimums are
 * opportunity- and suitability-dependent.
 */
export function FairlendInvestorFractional(): ReactElement {
  return (
    <section
      aria-labelledby="investor-fractional-title"
      className="investor-fractional"
      data-investor-fractional
      id="investor-fractional"
    >
      <div className="investor-fractional__inner">
        <header className="investor-fractional__header">
          <h2 className="investor-fractional__title" id="investor-fractional-title">
            Participate by the slice, not only the whole.
          </h2>
          <p className="investor-fractional__lede">
            Where a deal supports it, fractional participation lets you commit to a portion of a
            mortgage rather than funding the entire loan — so you can spread capital across multiple
            curated files instead of concentrating it in one. The same documented underwriting and
            administration sits behind every fraction.
          </p>
        </header>

        <div className="investor-fractional__visual">
          <figure className="investor-fractional__figure">
            <figcaption className="investor-fractional__caption">
              One mortgage, whole
            </figcaption>
            <div className="investor-fractional__bar investor-fractional__bar--whole" aria-hidden="true">
              <span className="investor-fractional__bar-fill" />
            </div>
          </figure>

          <span aria-hidden="true" className="investor-fractional__arrow">→</span>

          <figure className="investor-fractional__figure">
            <figcaption className="investor-fractional__caption">
              The same mortgage, fractionalized
            </figcaption>
            <div className="investor-fractional__bar investor-fractional__bar--split" aria-hidden="true">
              <span className="investor-fractional__slice" />
              <span className="investor-fractional__slice" />
              <span className="investor-fractional__slice" />
              <span className="investor-fractional__slice" />
              <span className="investor-fractional__slice investor-fractional__slice--yours" title="Your participation" />
            </div>
          </figure>
        </div>

        <div className="investor-fractional__notes">
          <p className="investor-fractional__note">
            <strong>Spread, don&apos;t concentrate.</strong> Fractional access makes it practical
            to hold positions across several mortgages — different properties, positions, and terms
            — all tracked in one portal, all collected and disbursed automatically.
          </p>
          <p className="investor-fractional__risk">
            Diversification is a tool for managing exposure; it does not remove private-credit risk.
            Fractional and syndicated structures carry the same risks as whole mortgages.
            Availability and minimums depend on the specific opportunity and investor review.
          </p>
        </div>
      </div>
    </section>
  )
}
