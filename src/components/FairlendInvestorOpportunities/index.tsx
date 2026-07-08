import type { ReactElement } from 'react'
import { Check } from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './investor-opportunities.css'

const reviewHref = buildFairlendIntakeHref({
  intent: 'invest',
  source: 'investor-opportunities-review',
})

const dealPackage = [
  'Property summary',
  'Mortgage position',
  'Loan amount',
  'LTV',
  'Valuation support',
  'Borrower profile',
  'Income / payment review',
  'Liens',
  'Term, rate & fees',
  'Exit strategy',
  'Material risks',
  'Legal / security structure',
  'Administration agreement',
  'Recovery path',
] as const

/**
 * Section 7 — Curated, Pre-Vetted Opportunities (Concept A + B hybrid).
 *
 * A curated shelf (not a firehose) of one expanded deal card revealing the
 * full review package. Position: curation is a benefit — the work is done for
 * you, and you review the file before any capital moves.
 *
 * Compliance: opportunity availability described honestly; not overstated as
 * continuous supply. Numbers shown are illustrative and clearly marked.
 */
export function FairlendInvestorOpportunities(): ReactElement {
  return (
    <section
      aria-labelledby="investor-opportunities-title"
      className="investor-opportunities"
      data-investor-opportunities
    >
      <div className="investor-opportunities__inner">
        <header className="investor-opportunities__header">
          <p className="investor-opportunities__eyebrow">Curated opportunities</p>
          <h2 className="investor-opportunities__title" id="investor-opportunities-title">
            A curated shelf, not a firehose.
          </h2>
          <p className="investor-opportunities__lede">
            You don&apos;t sift through raw deal flow. You review a short list of opportunities that
            already cleared underwriting, valuation, and documentation review. Each one arrives with
            the file attached — documented, not rushed. You make a decision with the file in front
            of you, every time.
          </p>
        </header>

        <div className="investor-opportunities__stage">
          <article className="investor-opportunities__deal" aria-label="Illustrative deal package">
            <header className="investor-opportunities__deal-head">
              <div>
                <span className="investor-opportunities__deal-tag">Illustrative example</span>
                <h3 className="investor-opportunities__deal-title">
                  Refinance · first mortgage · GTA
                </h3>
              </div>
              <span className="investor-opportunities__deal-status">
                Cleared underwriting · available for review
              </span>
            </header>

            <dl className="investor-opportunities__deal-stats">
              <div className="investor-opportunities__deal-stat">
                <dt>Loan</dt>
                <dd>$420,000</dd>
              </div>
              <div className="investor-opportunities__deal-stat">
                <dt>LTV</dt>
                <dd>68%</dd>
              </div>
              <div className="investor-opportunities__deal-stat">
                <dt>Term</dt>
                <dd>12 mo.</dd>
              </div>
              <div className="investor-opportunities__deal-stat">
                <dt>Position</dt>
                <dd>1st</dd>
              </div>
              <div className="investor-opportunities__deal-stat">
                <dt>Valuation</dt>
                <dd>Double-reviewed</dd>
              </div>
            </dl>

            <p className="investor-opportunities__deal-section-title">
              What you see before your capital moves
            </p>
            <ul className="investor-opportunities__package">
              {dealPackage.map((item) => (
                <li className="investor-opportunities__package-item" key={item}>
                  <span aria-hidden="true" className="investor-opportunities__package-mark">
                    <Check strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <footer className="investor-opportunities__deal-foot">
              <p>
                Subject to investor review, deal availability, documentation, and suitability.
                Illustrative — not a current offer.
              </p>
              <FairlendBorrowerCta
                href={reviewHref}
                label="Review Opportunities"
                size="md"
                variant="primary"
              />
            </footer>
          </article>
        </div>

        <p className="investor-opportunities__tail">
          We do the vetting so you can do the deciding. Decades of GTA pattern recognition go into
          rejecting weak files and structuring the strong ones. What reaches you is curated,
          pre-vetted, and fully documented.
        </p>
      </div>
    </section>
  )
}
