import type { ReactElement } from 'react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendConsultationHref, buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './investor-final-cta.css'

const accessHref = buildFairlendIntakeHref({
  intent: 'invest',
  source: 'investor-final-cta',
})
const reviewHref = buildFairlendConsultationHref('investor-final-review')

/**
 * Section 14 — Final CTA (Concept C, reassurance close).
 *
 * Calm, institutional closing: headline + supporting line + single primary
 * CTA, paired directly with the honest risk line so the final impression is
 * confident AND candid. Generous whitespace.
 */
export function FairlendInvestorFinalCta(): ReactElement {
  return (
    <section
      aria-labelledby="investor-final-title"
      className="investor-final"
      data-investor-final
      id="investor-access"
    >
      <div className="investor-final__inner">
        <p className="investor-final__eyebrow">Investor review, not instant checkout.</p>
        <h2 className="investor-final__title" id="investor-final-title">
          A more disciplined way to evaluate private mortgage credit.
        </h2>
        <p className="investor-final__lede">
          See how FairLend curates and underwrites private mortgage opportunities, manages the full
          lifecycle on one platform, and determines whether private mortgage investing fits your
          goals.
        </p>

        <div className="investor-final__cta-row">
          <FairlendBorrowerCta
            href={accessHref}
            label="Request Investor Access"
            variant="primary"
          />
          <FairlendBorrowerCta
            as="a"
            href={reviewHref}
            label="Book an Investor Review"
            variant="secondary"
          />
        </div>

        <p className="investor-final__risk">
          Private mortgage investments involve risk. Opportunities are subject to investor review,
          deal availability, documentation, and suitability considerations — and are not bank
          deposits or guaranteed-return products.
        </p>
      </div>
    </section>
  )
}
