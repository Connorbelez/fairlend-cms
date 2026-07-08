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
  body: 'Target 3-day application-to-commitment path for complete private mortgage files, subject to underwriting, appraisal, and lender fit.',
  // COMPLIANCE: approved wording. Fallback: "A clear answer quickly once the file is complete."
  compliance: true,
  icon: Gauge,
  id: 'clear-answer',
  label: 'Anchor',
  title: 'Clear answer, quickly',
}

const supportingCells: readonly MosaicCell[] = [
  {
    body: 'Rate, fees, conditions, payout terms, renewal considerations, default charges, material risks, and exit are discussed in plain language.',
    icon: FileText,
    id: 'transparent-structure',
    label: 'Terms',
    title: 'Transparent structure',
  },
  {
    body: 'Leaving for better financing should not become the expensive option.',
    // COMPLIANCE: approved wording. Fallback: "Payout terms discussed before you commit."
    compliance: true,
    icon: LogOut,
    id: 'payout-fees',
    label: 'Payout',
    title: '$0 payout fees where applicable',
  },
  {
    body: 'Servicing should solve payment issues early, not turn stress into a fee spiral.',
    // COMPLIANCE: approved wording. Fallback: "Low missed-payment administration fees instead of punitive fee spirals."
    compliance: true,
    icon: Receipt,
    id: 'missed-payment',
    label: 'Servicing',
    title: 'Missed-payment fees built for administration',
  },
  {
    body: 'The material mortgage economics should be visible in the commitment, with third-party closing costs disclosed separately where applicable.',
    icon: ShieldCheck,
    id: 'no-hidden-economics',
    label: 'Disclosure',
    title: 'No hidden legal-doc economics',
  },
  {
    body: 'Refinance, sale, renewal, income stabilization, debt cleanup, or another realistic route is discussed before funding.',
    icon: CalendarClock,
    id: 'exit-first',
    label: 'Exit',
    title: 'Exit-first planning',
  },
  {
    body: 'Appraisal review and valuation discipline help determine what the property can realistically support.',
    icon: Building2,
    id: 'real-value',
    label: 'Value',
    title: 'Real property value',
  },
  {
    body: 'Digital closing, PAD payments, servicing, renewals, payouts, borrower coordination, and administration continue after funding.',
    icon: Wallet,
    id: 'support-after-closing',
    label: 'Lifecycle',
    title: 'Support after closing',
  },
]

/**
 * Section 3 — Solution (whole-file mosaic).
 *
 * Asymmetric grid: one large anchor cell carrying the qualified 3-day target,
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
            A fairer way to structure private mortgage financing.
          </h2>
          <p className="borrower-solution__intro">
            FairLend reviews the borrower, property, current mortgage position, documentation,
            timing, available equity, payment capacity, fee exposure, payout terms, renewal path,
            and exit strategy together. The goal is a financing structure that fits the situation,
            not a one-size-fits-all private mortgage.
          </p>
        </header>

        <div className="borrower-solution__mosaic" data-borrower-mosaic>
          <MosaicCellCard cell={anchorCell} anchor />
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
          AI can assist analysis and workflow. Experienced mortgage professionals make the judgment
          calls.
        </p>

        <div className="borrower-solution__cta">
          <FairlendBorrowerCta
            href={borrowerSolutionIntakeHref}
            label="See What Your Property Can Support"
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
