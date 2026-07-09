import type { ReactElement } from 'react'
import {
  ArrowUpRight,
  Banknote,
  Clock3,
  FileWarning,
  Home,
  Landmark,
  Repeat2,
  Scale,
  WalletCards,
} from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './borrower-scenarios.css'

type Scenario = {
  title: string
  signal: string
  review: string
  body: string
  icon: typeof Clock3
}

const scenarioCtaHref = buildFairlendIntakeHref({
  intent: 'mortgage',
  source: 'borrower-scenarios-review',
})

const scenarios: readonly Scenario[] = [
  {
    body: 'A maturity date is close and the bank answer is not ready yet. The review starts with the term, cost, and a credible route back to cheaper financing.',
    icon: Repeat2,
    review: 'Term cost + refinance path',
    signal: 'My renewal is coming up',
    title: 'Renewal pressure',
  },
  {
    body: 'A purchase, sale, refinance, or private payout has a hard date. FairLend checks whether the money can close on time and how it gets repaid.',
    icon: Clock3,
    review: 'Repayment event + deadline',
    signal: 'I have a fixed closing date',
    title: 'Closing deadline',
  },
  {
    body: 'High-interest debt, tax arrears, or scattered payments may be consolidated when equity, capacity, fees, and the exit path support it.',
    icon: WalletCards,
    review: 'Equity + total cost',
    signal: 'My payments are scattered',
    title: 'Debt consolidation',
  },
  {
    body: 'If you have equity but the bank process is too slow or too rigid, FairLend reviews what your property can responsibly support.',
    icon: Banknote,
    review: 'Equity + amount needed',
    signal: 'I need to access equity',
    title: 'Equity access',
  },
  {
    body: 'Bridge financing can help when one transaction depends on another. The key question is whether the repayment event is real and timed properly.',
    icon: Landmark,
    review: 'Bridge amount + repayment event',
    signal: 'I need short-term bridge money',
    title: 'Bridge financing',
  },
  {
    body: 'A second mortgage can solve a specific need when the property value, current mortgage position, and payment plan make the added risk workable.',
    icon: Home,
    review: 'Position + payment plan',
    signal: 'I need capital behind my first',
    title: 'Second mortgage',
  },
  {
    body: 'Bruised credit or non-traditional income is not an automatic no. The review still needs property strength, documentation, capacity, and a realistic exit.',
    icon: FileWarning,
    review: 'Docs + property strength',
    signal: 'The bank said no',
    title: 'Bank decline',
  },
  {
    body: 'An existing private mortgage can be reviewed for payout rights, renewal pressure, fee exposure, maturity plan, and whether a better structure exists.',
    icon: Scale,
    review: 'Payout rights + maturity plan',
    signal: 'I already have private money',
    title: 'Existing private mortgage',
  },
]

const reviewInputs = [
  { code: '01', label: 'Property value' },
  { code: '02', label: 'Available equity' },
  { code: '03', label: 'Amount needed' },
  { code: '04', label: 'Deadline' },
  { code: '05', label: 'Current mortgage' },
  { code: '06', label: 'Exit path' },
]

/**
 * Section 4 - Borrower Scenarios.
 *
 * Lets borrowers self-identify without implying automatic fit. The visual is a
 * route ledger, not a card grid: one strong explanatory column, one dense list
 * of situations, and a quiet review-input strip that points toward the form.
 */
export function FairlendBorrowerScenarios(): ReactElement {
  return (
    <section
      aria-labelledby="borrower-scenarios-title"
      className="borrower-scenarios"
      data-borrower-scenarios
    >
      <div className="borrower-scenarios__inner">
        <div className="borrower-scenarios__copy">
          <p className="borrower-scenarios__kicker">Find your situation</p>
          <h2 className="borrower-scenarios__title" id="borrower-scenarios-title">
            When private mortgage financing may fit.
          </h2>
          <p className="borrower-scenarios__body">
            Timing, documentation, credit, income, equity, or property complexity can push you
            outside a conventional bank process. These are common reasons to ask about private
            money. FairLend reviews whether the cost, term, risk, and exit plan fit the reason you
            need financing.
          </p>

          <div className="borrower-scenarios__cta-row">
            <FairlendBorrowerCta
              href={scenarioCtaHref}
              label="Get a Private Mortgage Review"
              size="md"
              variant="primary"
            />
            <span className="borrower-scenarios__small-note">
              No guaranteed approval. A clear yes or no is the point.
            </span>
          </div>
        </div>

        <div className="borrower-scenarios__list-wrap">
          <div className="borrower-scenarios__ledger-head" aria-hidden="true">
            <span>Borrower signal</span>
            <span>Scenario</span>
            <span>Review focus</span>
          </div>
          <ul className="borrower-scenarios__list">
            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon
              return (
                <li className="borrower-scenarios__item" key={scenario.title}>
                  <span className="borrower-scenarios__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="borrower-scenarios__signal">
                    <span className="borrower-scenarios__micro-label">Borrower signal</span>
                    <span className="borrower-scenarios__signal-text">{scenario.signal}</span>
                  </span>
                  <span aria-hidden="true" className="borrower-scenarios__icon">
                    <Icon strokeWidth={1.6} />
                  </span>
                  <span className="borrower-scenarios__text">
                    <span className="borrower-scenarios__item-title">{scenario.title}</span>
                    <span className="borrower-scenarios__item-body">{scenario.body}</span>
                  </span>
                  <span className="borrower-scenarios__review-focus">
                    <span className="borrower-scenarios__micro-label">Review focus</span>
                    <span className="borrower-scenarios__review-focus-text">{scenario.review}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="borrower-scenarios__arrow"
                    strokeWidth={1.6}
                  />
                </li>
              )
            })}
          </ul>

          <div className="borrower-scenarios__review-strip" aria-label="What FairLend reviews">
            <div className="borrower-scenarios__review-head">
              <span className="borrower-scenarios__review-headline">
                <Landmark aria-hidden="true" size={16} strokeWidth={1.7} />
                What we review
              </span>
              <span className="borrower-scenarios__review-note">
                Used together to give you a practical private mortgage answer.
              </span>
            </div>
            <ul className="borrower-scenarios__review-list">
              {reviewInputs.map((input) => (
                <li key={input.label}>
                  <span>{input.code}</span>
                  <strong>{input.label}</strong>
                </li>
              ))}
            </ul>
            <Banknote aria-hidden="true" className="borrower-scenarios__review-mark" />
          </div>
        </div>
      </div>
    </section>
  )
}
