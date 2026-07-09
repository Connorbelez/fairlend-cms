import type { ReactElement } from 'react'
import { ClipboardList, FileCheck2, Headphones, Route, SearchCheck } from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './borrower-process.css'

type ProcessStep = {
  title: string
  body: string
  evidence: string
  phase: string
  icon: typeof ClipboardList
}

const processHref = buildFairlendIntakeHref({
  intent: 'mortgage',
  source: 'borrower-process-review',
})

const steps: readonly ProcessStep[] = [
  {
    body: 'Share the property, current mortgage, timeline, and why you need financing.',
    evidence: 'Property, mortgage balance, timing, purpose',
    phase: 'Intake',
    icon: ClipboardList,
    title: 'Tell us what is happening',
  },
  {
    body: 'FairLend reviews your equity, documentation, payment capacity, property context, and lender fit together.',
    evidence: 'Equity, documents, capacity, lender fit',
    phase: 'Assessment',
    icon: SearchCheck,
    title: 'Review what can work',
  },
  {
    body: 'Rate, fees, payout terms, renewal considerations, risks, and material conditions are discussed in plain language.',
    evidence: 'Rate, fees, payout terms, risk conditions',
    phase: 'Terms',
    icon: FileCheck2,
    title: 'Map the terms',
  },
  {
    body: 'The maturity path is considered before funding: refinance, sale, renewal, stabilization, debt cleanup, or another realistic route.',
    evidence: 'Refinance, sale, renewal, stabilization',
    phase: 'Exit route',
    icon: Route,
    title: 'Plan the way out',
  },
  {
    body: 'If the structure makes sense, support can continue through closing, PAD payments, servicing, renewals, payouts, and borrower coordination.',
    evidence: 'Closing, PAD, renewals, payouts, coordination',
    phase: 'Support',
    icon: Headphones,
    title: 'Stay supported after funding',
  },
]

/**
 * Section 6 - How It Works.
 *
 * An architectural path inspired by the root build model: one drawn route
 * with labelled steps, not a row of process cards.
 */
export function FairlendBorrowerProcess(): ReactElement {
  return (
    <section
      aria-labelledby="borrower-process-title"
      className="borrower-process"
      data-borrower-process
    >
      <div className="borrower-process__inner">
        <div className="borrower-process__lead">
          <p className="borrower-process__kicker">How the free review works</p>
          <h2 className="borrower-process__title" id="borrower-process-title">
            You should know the next move before you commit.
          </h2>
          <p className="borrower-process__body">
            A private mortgage review should give you a practical answer. If the structure does not
            fit, you should know early. If it does fit, the path from review to commitment should
            make the cost, conditions, and exit visible.
          </p>
          <p className="borrower-process__action-note">
            Start with the free review. A commitment only follows a structure that can be explained.
          </p>
          <div className="borrower-process__actions" aria-label="Borrower process actions">
            <FairlendBorrowerCta
              className="borrower-process__primary-action"
              href={processHref}
              label="Request My Free Review"
              size="md"
              variant="primary"
            />
            <FairlendBorrowerCta
              as="a"
              className="borrower-process__secondary-action"
              href="#consultation"
              label="See what to share"
              size="md"
              variant="text"
            />
          </div>
        </div>

        <ol className="borrower-process__path">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <li className="borrower-process__step" key={step.title}>
                <span className="borrower-process__step-marker">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </span>
                <span aria-hidden="true" className="borrower-process__step-icon">
                  <Icon strokeWidth={1.55} />
                </span>
                <span className="borrower-process__step-copy">
                  <span className="borrower-process__step-phase">{step.phase}</span>
                  <strong>{step.title}</strong>
                  <span className="borrower-process__step-body">{step.body}</span>
                  <span className="borrower-process__step-evidence">{step.evidence}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
