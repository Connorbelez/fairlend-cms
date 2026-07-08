import type { ReactElement } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './investor-hero.css'

const investorAccessHref = buildFairlendIntakeHref({
  intent: 'invest',
  source: 'investor-hero-request-access',
})

const proofChips = [
  'Curated, pre-vetted deals',
  'Target LTVs under 75%',
  'Double valuation review',
  'Administered reporting workflow',
  'Power-of-sale recovery path',
  'Dedicated legal recovery team',
] as const

const portalRows = [
  { label: 'Position', detail: 'First mortgage · registered' },
  { label: 'Loan-to-value', detail: '68% · double valuation' },
  { label: 'Term', detail: '12 months · interest only' },
  { label: 'Borrower', detail: 'Equity-based file · GTA' },
] as const

/**
 * Section 1 — Hero (Concept A, "Operations Desk" hybrid with the proof bar).
 *
 * Editorial split: serif H1 + subhead on the left, portal dossier on the
 * right, and a horizontal proof chip strip beneath. Credibility anchors
 * (~$2B / ~30 yrs / GTA) sit in the dossier header as a quiet stat line —
 * not as the hero-metric template. Lime is reserved for the disbursement
 * chip and the primary CTA only.
 */
export function FairlendInvestorHero(): ReactElement {
  return (
    <section
      aria-labelledby="investor-hero-title"
      className="investor-hero"
      data-investor-hero
    >
      {/* Decorative topographic contour lines; aria-hidden, very low contrast. */}
      <svg
        aria-hidden="true"
        className="investor-hero__contours"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 720"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-40 520 C 220 470, 380 580, 620 540 S 1080 470, 1480 520" stroke="currentColor" strokeWidth="1" />
        <path d="M-40 560 C 240 510, 420 620, 640 580 S 1120 510, 1480 560" stroke="currentColor" strokeWidth="1" />
        <path d="M-40 600 C 260 550, 460 660, 660 620 S 1160 550, 1480 600" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="investor-hero__grid">
        <div className="investor-hero__copy">
          <p className="investor-hero__kicker">Private mortgage investing</p>
          <h1 className="investor-hero__title" id="investor-hero-title">
            Mortgage-backed income, professionally underwritten — and fully managed for you.
          </h1>
          <p className="investor-hero__subhead">
            FairLend gives investors access to curated, pre-vetted mortgage-backed opportunities,
            then administers the lifecycle: digital closing coordination, PAD collection,
            disbursement tracking, investor reporting context, and tax-ready export workflow
            support. Conservative LTVs, double valuation review, and a dedicated legal recovery
            path sit behind every deal.
          </p>

          <div className="investor-hero__cta-row">
            <FairlendBorrowerCta
              href={investorAccessHref}
              label="Request Investor Access"
              variant="primary"
            />
            <FairlendBorrowerCta
              as="a"
              href="#investor-protection-stack"
              label="See the protection framework"
              variant="secondary"
            />
          </div>

          <p className="investor-hero__risk-line">
            Private mortgage investments involve risk and are not bank deposits or guaranteed-return
            products. FairLend reviews investor fit before presenting opportunities.
          </p>
        </div>

        <div className="investor-hero__portal-slot">
          <div className="investor-portal-mock" data-investor-portal-mock>
            <header className="investor-portal-mock__head">
              <div className="investor-portal-mock__title-cluster">
                <span className="investor-portal-mock__eyebrow">Reporting preview</span>
                <span className="investor-portal-mock__file">Illustrative mortgage file</span>
              </div>
              <div className="investor-portal-mock__stat-line">
                <span className="investor-portal-mock__stat">
                  <strong>~$2B</strong>
                  <em>funded</em>
                </span>
                <span className="investor-portal-mock__stat">
                  <strong>~30 yrs</strong>
                  <em>GTA</em>
                </span>
              </div>
            </header>

            <div className="investor-portal-mock__deal">
              <div className="investor-portal-mock__deal-top">
                <span className="investor-portal-mock__deal-stamp">Preview · first mortgage</span>
                <span className="investor-portal-mock__deal-chip">
                  <span aria-hidden="true" className="investor-portal-mock__deal-chip-dot" />
                  Disbursement tracked
                </span>
              </div>
              <dl className="investor-portal-mock__rows">
                {portalRows.map((row) => (
                  <div className="investor-portal-mock__row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.detail}</dd>
                  </div>
                ))}
              </dl>
              <div className="investor-portal-mock__payment" aria-label="Payment status timeline">
                <span className="investor-portal-mock__payment-label">PAD collection</span>
                <div className="investor-portal-mock__payment-track">
                  <span className="investor-portal-mock__payment-segment is-paid" title="Paid" />
                  <span className="investor-portal-mock__payment-segment is-paid" title="Paid" />
                  <span className="investor-portal-mock__payment-segment is-paid" title="Paid" />
                  <span className="investor-portal-mock__payment-segment is-current" title="Current" />
                  <span className="investor-portal-mock__payment-segment" title="Scheduled" />
                  <span className="investor-portal-mock__payment-segment" title="Scheduled" />
                </div>
              </div>
            </div>

            <footer className="investor-portal-mock__foot">
              <span className="investor-portal-mock__foot-item">
                <Check aria-hidden="true" size={14} strokeWidth={2.4} />
                Tax-ready export context
              </span>
              <span className="investor-portal-mock__foot-item">
                <Check aria-hidden="true" size={14} strokeWidth={2.4} />
                Bookkeeping handoff
              </span>
              <span className="investor-portal-mock__foot-cta">
                Preview file
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2.25} />
              </span>
            </footer>
          </div>
        </div>
      </div>

      <ul className="investor-hero__proof" aria-label="What sits behind every FairLend opportunity">
        {proofChips.map((chip) => (
          <li className="investor-hero__proof-chip" key={chip}>
            <span aria-hidden="true" className="investor-hero__proof-mark" />
            {chip}
          </li>
        ))}
      </ul>
    </section>
  )
}
