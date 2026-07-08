import type { ReactElement } from 'react'
import { Check } from 'lucide-react'

import './investor-rate-reframe.css'

const verificationChecks = [
  'The value is real (double valuation review)',
  'The LTV stays conservative (under 75%)',
  'Borrower capacity is underwritten beyond a credit score',
  'Income, fraud, and documentation hold up to ~7,000 data points',
  'The exit path is real before the money moves',
  'The recovery position is planned before stress occurs',
] as const

/**
 * Section 3 — The rate is not the product. The underwriting is. (Concept A.)
 *
 * Oversized statement on the left; on the right, a "what we do before you ever
 * see a deal" checklist with verification chips. This is the strategic pivot
 * away from rate-chasing and toward process discipline.
 */
export function FairlendInvestorRateReframe(): ReactElement {
  return (
    <section
      aria-labelledby="investor-rate-title"
      className="investor-rate"
      data-investor-rate
    >
      <div className="investor-rate__inner">
        <div className="investor-rate__statement">
          <p className="investor-rate__eyebrow">The reframing</p>
          <h2 className="investor-rate__title" id="investor-rate-title">
            The rate is not the product.
            <span className="investor-rate__title-rule" aria-hidden="true" />
            The underwriting is.
          </h2>
        </div>

        <div className="investor-rate__panel">
          <p className="investor-rate__panel-lede">
            A high rate can hide a weak file. We start from the opposite principle: if the value,
            LTV, borrower capacity, documentation, fraud profile, exit path, or recovery position
            doesn&apos;t make sense, the deal never reaches you.
          </p>
          <p className="investor-rate__panel-subhead">
            What we do before you ever see a deal
          </p>
          <ul className="investor-rate__checks">
            {verificationChecks.map((item) => (
              <li className="investor-rate__check" key={item}>
                <span aria-hidden="true" className="investor-rate__check-mark">
                  <Check strokeWidth={2.6} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="investor-rate__panel-foot">
            You see opportunities that have already survived the hard &ldquo;no.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}
