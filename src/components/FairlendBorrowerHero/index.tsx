import type { ReactElement } from 'react'

import { ArrowUpRight } from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { FairlendConsultationBookingDialog } from '@/components/FairlendConsultationBooking/FairlendConsultationBookingDialog.client'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import { BorrowerDossier } from './BorrowerDossier'
import {
  borrowerHeroDecisionPoints,
  borrowerDossierRows,
  borrowerHeroComplianceQualifier,
  borrowerHeroProofPoints,
} from './dossier-data'
import './borrower-hero.css'

const borrowerMortgageIntakeHref = buildFairlendIntakeHref({
  intent: 'mortgage',
  source: 'borrower-hero-specialist',
})

/**
 * Section 1 — Hero.
 *
 * Editorial dossier hero: serif H1 thesis on the left, borrower mortgage file
 * on the right, and a rail-to-rail proof strip with a visible compliance
 * qualifier at the bottom. The dossier makes "exit-first underwriting" the
 * page's first visual object instead of a stock-photo promise.
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
            Get a clear private mortgage answer before your deadline.
          </h1>
          <p className="borrower-hero__subhead">
            If a bank timeline, renewal problem, closing date, debt pressure, or equity need has you
            looking at private money, FairLend helps you understand what can work, what it may cost,
            and how you get back out.
          </p>

          <ul
            aria-label="Private mortgage review sequence"
            className="borrower-hero__decision-strip"
          >
            {borrowerHeroDecisionPoints.map((point) => (
              <li className="borrower-hero__decision-item" key={point}>
                {point}
              </li>
            ))}
          </ul>

          <div className="borrower-hero__cta-row">
            <FairlendConsultationBookingDialog
              className="fairlend-borrower-cta fairlend-borrower-cta--primary fairlend-borrower-cta--lg group inline-flex h-[55px] items-center justify-center gap-[12px] rounded-[9px] bg-[#96ec18] pl-[18px] pr-5 text-[17px] leading-none font-normal text-[#101010] shadow-[0_10px_24px_rgb(118_205_0/12%)] outline-none transition-[background-color,color,transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:bg-[#a4fb20] hover:shadow-[0_14px_32px_rgb(118_205_0/18%)] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f7f5]"
              leadershipCta={false}
              source="borrower-hero-consultation"
            >
              <span className="fairlend-borrower-cta__label">Book My Free Mortgage Review</span>
              <span aria-hidden="true" className="fairlend-borrower-cta__arrow-box">
                <ArrowUpRight className="fairlend-borrower-cta__arrow-icon" strokeWidth={2.25} />
              </span>
            </FairlendConsultationBookingDialog>
            <FairlendBorrowerCta
              href={borrowerMortgageIntakeHref}
              label="Start My Review Online"
              variant="secondary"
            />
          </div>
        </div>

        <div className="borrower-hero__dossier-slot">
          <BorrowerDossier rows={borrowerDossierRows} />
        </div>
      </div>

      <div className="borrower-hero__proof" data-borrower-proof>
        <div className="borrower-hero__proof-copy">
          <p className="borrower-hero__proof-kicker">Before you commit</p>
          <h2 className="borrower-hero__proof-title">
            Know the costs, timing, and exit before you move.
          </h2>
        </div>
        <ul className="borrower-hero__proof-list">
          {borrowerHeroProofPoints.map((point) => (
            <li className="borrower-hero__proof-item" key={point.label}>
              <span aria-hidden="true" className="borrower-hero__proof-mark" />
              <span className="borrower-hero__proof-text">
                <span className="borrower-hero__proof-label">{point.label}</span>
                <span className="borrower-hero__proof-detail">{point.detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="borrower-hero__qualifier">{borrowerHeroComplianceQualifier}</p>
      </div>
    </section>
  )
}
