import type { ReactElement } from 'react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendConsultationHref, buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './investor-process.css'

const reviewBookingHref = buildFairlendConsultationHref('investor-process-review')
const accessHref = buildFairlendIntakeHref({
  intent: 'invest',
  source: 'investor-process-cta',
})

type Step = {
  id: string
  number: string
  title: string
  detail: string
  owner: 'you' | 'fairlend'
}

const steps: readonly Step[] = [
  {
    detail:
      'We review your profile, goals, experience, and fit before presenting any opportunity.',
    id: 'access',
    number: '01',
    owner: 'you',
    title: 'Request investor access',
  },
  {
    detail:
      'Examine deal summaries, valuation support, LTV, borrower profile, security, and risks.',
    id: 'review',
    number: '02',
    owner: 'you',
    title: 'Review curated opportunities',
  },
  {
    detail: 'Documentation is coordinated through the platform and dedicated platform lawyers.',
    id: 'close',
    number: '03',
    owner: 'fairlend',
    title: 'Close digitally',
  },
  {
    detail:
      'PAD collection, automated disbursements, servicing, renewals, payouts, and portal reporting.',
    id: 'track',
    number: '04',
    owner: 'fairlend',
    title: 'Track payments & reporting',
  },
  {
    detail:
      'If a borrower defaults, we coordinate communication, legal escalation, and recovery strategy.',
    id: 'recover',
    number: '05',
    owner: 'fairlend',
    title: 'Recovery support if needed',
  },
]

/**
 * Section 10 — How Investing Works (Concept A + C hybrid).
 *
 * A five-step vertical stepper. Each step is tagged with who owns it: the two
 * "you" steps are short, the three "fairlend" steps are long. The visual
 * division of labor proves the pitch: you decide, we operate.
 */
export function FairlendInvestorProcess(): ReactElement {
  return (
    <section
      aria-labelledby="investor-process-title"
      className="investor-process"
      data-investor-process
      id="investor-process"
    >
      <div className="investor-process__inner">
        <header className="investor-process__header">
          <p className="investor-process__eyebrow">Investor access → administered mortgage</p>
          <h2 className="investor-process__title" id="investor-process-title">
            A clear path from investor review to administered mortgage.
          </h2>
          <p className="investor-process__lede">
            Your work is really steps one and two: get reviewed, and choose an opportunity. From
            digital closing onward, the collection, disbursement, reporting, and recovery are ours
            to run and yours to watch.
          </p>
        </header>

        <ol
          aria-label="Five-step path from investor review to administered mortgage"
          className="investor-process__steps"
        >
          {steps.map((step) => (
            <li className="investor-process__step" data-owner={step.owner} key={step.id}>
              <div className="investor-process__step-rail" aria-hidden="true">
                <span className="investor-process__step-number">{step.number}</span>
                <span className="investor-process__step-line" />
              </div>
              <div className="investor-process__step-body">
                <div className="investor-process__step-top">
                  <h3 className="investor-process__step-title">{step.title}</h3>
                  <span
                    aria-label={step.owner === 'you' ? 'You do this' : 'FairLend does this'}
                    className="investor-process__step-tag"
                    data-owner={step.owner}
                  >
                    {step.owner === 'you' ? 'You' : 'FairLend'}
                  </span>
                </div>
                <p className="investor-process__step-detail">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="investor-process__cta-row">
          <FairlendBorrowerCta
            href={accessHref}
            label="Request Investor Access"
            variant="primary"
          />
          <FairlendBorrowerCta
            as="a"
            href={reviewBookingHref}
            label="Book an Investor Review"
            variant="secondary"
          />
        </div>
      </div>
    </section>
  )
}
