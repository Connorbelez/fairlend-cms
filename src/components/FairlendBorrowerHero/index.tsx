import { Suspense, type ReactElement } from 'react'

import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'

import {
  borrowerHeroDecisionPoints,
  borrowerHeroComplianceQualifier,
  borrowerHeroProofPoints,
} from './dossier-data'
import './borrower-hero.css'

/**
 * Section 1 — Hero.
 *
 * Conversion hero: serif H1 thesis on the left and the live private-mortgage
 * review on the right. The same intake component powers `/construction-financing`, so answers,
 * autosave, validation, submission, and success behavior stay identical.
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

          <p className="borrower-hero__form-cue">
            Start with the situation. Approximate answers are enough, and no documents are needed
            right now.
          </p>
        </div>

        <div className="borrower-hero__form-slot">
          <Suspense fallback={null}>
            <FairlendLeadIntake
              intentOverride="mortgage"
              mortgageVariant="hero"
              sourceOverride="borrower-hero-inline-review"
            />
          </Suspense>
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
