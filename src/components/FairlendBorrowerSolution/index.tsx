import type { ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  Building2,
  CalendarClock,
  FileText,
  Gauge,
  LogOut,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './borrower-solution.css'

type MosaicCell = {
  id: string
  label: string
  title: string
  body: string
  icon: LucideIcon
  /** Whether this cell carries a compliance-sensitive fee/timing claim. */
  compliance?: boolean
}

const borrowerSolutionIntakeHref = buildFairlendIntakeHref({
  intent: 'mortgage',
  source: 'borrower-solution-property-support',
})

const anchorCell: MosaicCell = {
  body: 'Target 24-hour application-to-commitment path for complete private mortgage files, subject to lender review, appraisal, and lender fit.',
  // COMPLIANCE: approved wording. Fallback: "A clear answer quickly once the file is complete."
  compliance: true,
  icon: Gauge,
  id: 'clear-answer',
  label: 'Anchor',
  title: 'Know quickly if private financing can work',
}

const supportingCells: readonly MosaicCell[] = [
  {
    body: 'Rate, fees, conditions, payout terms, renewal considerations, default charges, material risks, and exit are discussed in plain language.',
    icon: FileText,
    id: 'transparent-structure',
    label: 'Terms',
    title: 'See the full cost picture',
  },
  {
    body: 'Leaving for better financing should not become the expensive option.',
    compliance: true,
    icon: LogOut,
    id: 'payout-fees',
    label: 'Payout',
    title: 'Low payout fees where applicable',
  },
  {
    body: 'Servicing should solve payment issues early, not turn stress into a fee spiral.',
    // COMPLIANCE: approved wording. Fallback: "Low missed-payment administration fees instead of punitive fee spirals."
    compliance: true,
    icon: Receipt,
    id: 'missed-payment',
    label: 'Servicing',
    title: 'Payment support that stays practical',
  },
  {
    body: 'The material mortgage economics should be visible in the commitment, with third-party closing costs disclosed separately where applicable.',
    icon: ShieldCheck,
    id: 'no-hidden-economics',
    label: 'Disclosure',
    title: 'Important terms visible before closing',
  },
  {
    body: 'Refinance, sale, renewal, income stabilization, debt cleanup, or another realistic route is discussed before funding.',
    icon: CalendarClock,
    id: 'exit-first',
    label: 'Exit',
    title: 'A path back out of private money',
  },
  {
    body: 'Appraisal review and valuation discipline help determine what the property can realistically support.',
    icon: Building2,
    id: 'real-value',
    label: 'Value',
    title: 'Property value checked carefully',
  },
  {
    body: 'Digital closing, PAD payments, servicing, renewals, payouts, borrower coordination, and administration can continue after funding.',
    icon: Wallet,
    id: 'support-after-closing',
    label: 'Lifecycle',
    title: 'Help after the mortgage funds',
  },
]

const reviewDocket = [
  ['Borrower', 'documentation, payment capacity, timing'],
  ['Property', 'value, appraisal, available equity'],
  ['Mortgage position', 'current balance, payout terms, renewal path'],
  ['Exit strategy', 'refinance, sale, renewal, debt cleanup'],
] as const

/**
 * Section 3 — Solution (whole-file mosaic).
 *
 * Asymmetric grid: one large anchor cell carrying the qualified 24-hour target,
 * surrounded by supporting cells with document-style labels and small lucide
 * line marks. Deliberately NOT eight equal rounded SaaS cards — the anchor
 * cell's size carries the hierarchy.
 *
 * Copy locked from the page section breakdown.
 */
export function FairlendBorrowerSolution(): ReactElement {
  return (
    <section
      aria-labelledby="borrower-solution-title"
      className="borrower-solution"
      data-borrower-solution
    >
      {/* Decorative topographic contours, low contrast, away from text. */}
      <svg
        aria-hidden="true"
        className="borrower-solution__contours"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-40 120 C 240 80, 420 200, 640 160 S 1120 80, 1480 140"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M-40 200 C 260 160, 460 280, 660 240 S 1160 160, 1480 220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M-40 480 C 240 440, 420 560, 640 520 S 1120 440, 1480 500"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <div className="borrower-solution__inner">
        <header className="borrower-solution__header">
          <h2 className="borrower-solution__title" id="borrower-solution-title">
            Private mortgage options built around your next move.
          </h2>
          <div className="borrower-solution__header-copy">
            <p className="borrower-solution__intro">
              FairLend reviews your property, current mortgage, deadline, available equity,
              documentation, payment capacity, fee exposure, payout terms, renewal path, and exit
              together. The goal is a private mortgage structure that solves the pressure you are
              facing without leaving you stuck at maturity.
            </p>
            <dl className="borrower-solution__review-docket" aria-label="Private mortgage review">
              {reviewDocket.map(([label, value]) => (
                <div className="borrower-solution__review-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="borrower-solution__mosaic" data-borrower-mosaic>
          <MosaicCellCard cell={anchorCell} anchor />
          <div className="borrower-solution__standards-band">
            <span>What the review covers</span>
            <p>
              Pricing, payout, servicing, disclosure, exit, valuation, and after-closing support are
              reviewed before you decide.
            </p>
          </div>
          {supportingCells.map((cell) => (
            <MosaicCellCard cell={cell} key={cell.id} />
          ))}
        </div>

        <p className="borrower-solution__ai-note">
          <Sparkles
            aria-hidden="true"
            className="borrower-solution__ai-icon"
            size={16}
            strokeWidth={1.75}
          />
          Technology helps organize the review. Experienced mortgage professionals still make the
          judgment calls.
        </p>

        <div className="borrower-solution__cta">
          <p className="borrower-solution__cta-context">
            Bring the property, deadline, current mortgage, and preferred exit into one review so
            you can see whether private financing is a fit before you commit.
          </p>
          <FairlendBorrowerCta
            href={borrowerSolutionIntakeHref}
            label="See What My Property Can Support"
            size="md"
            variant="primary"
          />
        </div>
      </div>
    </section>
  )
}

function MosaicCellCard({
  cell,
  anchor = false,
}: {
  cell: MosaicCell
  anchor?: boolean
}): ReactElement {
  const Icon = cell.icon
  return (
    <article
      className="borrower-solution__cell"
      data-borrower-solution-cell
      data-anchor={anchor ? 'true' : undefined}
      data-compliance={cell.compliance ? 'true' : undefined}
    >
      <div className="borrower-solution__cell-top">
        <span aria-hidden="true" className="borrower-solution__cell-icon">
          <Icon aria-hidden="true" strokeWidth={1.6} />
        </span>
        <span className="borrower-solution__cell-label">{cell.label}</span>
      </div>
      <h3 className="borrower-solution__cell-title">{cell.title}</h3>
      {anchor && (
        <div className="borrower-solution__anchor-proof" aria-label="Qualified commitment target">
          <span>Complete info</span>
          <strong>24 hr target</strong>
        </div>
      )}
      <p className="borrower-solution__cell-body">{cell.body}</p>
      {anchor && (
        <BadgeCheck
          aria-hidden="true"
          className="borrower-solution__cell-badge"
          size={20}
          strokeWidth={1.6}
        />
      )}
    </article>
  )
}
