import type { ReactElement } from 'react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { getFairlendMicrosoftBookingsUrl } from '@/lib/fairlend-bookings'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import { BorrowerDossier } from './BorrowerDossier'
import {
  borrowerDossierRows,
  borrowerHeroComplianceQualifier,
  borrowerHeroProofPoints,
} from './dossier-data'
import './borrower-hero.css'

const borrowerConsultationBookingHref = getFairlendMicrosoftBookingsUrl()
const borrowerMortgageIntakeHref = buildFairlendIntakeHref({
  intent: 'mortgage',
  source: 'borrower-hero-specialist',
})

/**
 * Section 1 — Hero.
 *
 * Editorial dossier hero: serif H1 promise on the left, borrower mortgage file
 * on the right, and a rail-to-rail proof strip with a visible compliance
 * qualifier at the bottom. The dossier makes "see the economics before signing"
 * the page's first visual object instead of a stock-photo promise.
 *
 * Copy locked from the page section breakdown.
 */
export function FairlendBorrowerHero(): ReactElement {
  return (
    <section aria-labelledby="borrower-hero-title" className="borrower-hero" data-borrower-hero>
      {/* Decorative topographic contour lines; aria-hidden, very low contrast. */}
      <svg
        aria-hidden="true"
        className="borrower-hero__contours"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 720"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-40 520 C 220 470, 380 580, 620 540 S 1080 470, 1480 520"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M-40 560 C 240 510, 420 620, 640 580 S 1120 510, 1480 560"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M-40 600 C 260 550, 460 660, 660 620 S 1160 550, 1480 600"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <div className="borrower-hero__grid">
        <div className="borrower-hero__copy">
          <p className="borrower-hero__kicker">Private mortgage financing</p>
          <h1 className="borrower-hero__title" id="borrower-hero-title">
            Fair private mortgage financing with a clear exit plan.
          </h1>
          <p className="borrower-hero__subhead">
            FairLend helps Ontario homeowners and property owners access flexible first, second,
            bridge, renewal, and equity-based mortgage financing with transparent terms, disciplined
            underwriting, and a practical plan for what happens next.
          </p>

          <div className="borrower-hero__cta-row">
            <FairlendBorrowerCta
              href={borrowerConsultationBookingHref}
              label="Request a Free Consultation"
              rel="noreferrer"
              target="_blank"
              variant="primary"
            />
            <FairlendBorrowerCta
              href={borrowerMortgageIntakeHref}
              label="Speak With a Mortgage Specialist"
              variant="secondary"
            />
          </div>
        </div>

        <div className="borrower-hero__dossier-slot">
          <BorrowerDossier rows={borrowerDossierRows} />
        </div>
      </div>

      <div className="borrower-hero__proof" data-borrower-proof>
        <ul className="borrower-hero__proof-list">
          {borrowerHeroProofPoints.map((point) => (
            <li className="borrower-hero__proof-item" key={point}>
              <span aria-hidden="true" className="borrower-hero__proof-mark" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="borrower-hero__qualifier">{borrowerHeroComplianceQualifier}</p>
      </div>
    </section>
  )
}
