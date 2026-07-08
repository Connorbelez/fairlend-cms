import type { ReactElement } from 'react'
import { BadgeCheck, FileText, HandCoins, Landmark, LogOut, ShieldCheck } from 'lucide-react'

import './borrower-differentiators.css'

type Standard = {
  title: string
  body: string
  status: 'qualified' | 'principle'
  statusLabel: string
  rule: string
  checks: readonly string[]
}

const standards: readonly Standard[] = [
  {
    body: 'Once the core information is complete, FairLend targets a fast application-to-commitment path while still checking lender review, property review, appraisal needs, available capital, and lender fit.',
    checks: [
      'complete info',
      'lender review',
      'property review',
      'appraisal',
      'capital',
      'lender fit',
    ],
    rule: 'Timing',
    status: 'qualified',
    statusLabel: 'Qualified target',
    title: 'A fast answer without pretending every request is instant.',
  },
  {
    body: 'Rate, broker or lender fees, administration charges, renewal considerations, payout terms, default charges, closing costs, material risks, and conditions are reviewed as one cost picture.',
    checks: ['rate', 'fees', 'conditions', 'renewal', 'payout', 'default', 'closing costs'],
    rule: 'Cost',
    status: 'principle',
    statusLabel: 'Borrower standard',
    title: 'You see the full cost, not just the rate.',
  },
  {
    body: 'Payout terms should be discussed before you commit. Where the structure allows it, FairLend uses $0 payout fees so leaving for better financing is not punished.',
    checks: ['payout terms', 'before commitment', 'where structure allows', '$0 payout fees'],
    rule: 'Payout',
    status: 'qualified',
    statusLabel: 'Qualified target',
    title: 'Your exit should not be punished.',
  },
  {
    body: 'The material mortgage economics should be visible in the commitment, with third-party legal, appraisal, registration, and closing costs identified separately where relevant.',
    checks: ['commitment', 'legal', 'appraisal', 'registration', 'closing costs', 'where relevant'],
    rule: 'Disclosure',
    status: 'principle',
    statusLabel: 'Borrower standard',
    title: 'The commitment should carry the important economics.',
  },
  {
    body: 'Credit and income matter, but they are reviewed with property value, equity, payment capacity, documentation, timing, mortgage position, and the exit path.',
    checks: ['credit', 'income', 'equity', 'payment capacity', 'documentation', 'exit path'],
    rule: 'Fit',
    status: 'principle',
    statusLabel: 'Borrower standard',
    title: 'Your property and exit matter too.',
  },
]

const costItems = [
  'rate',
  'fees',
  'conditions',
  'payout',
  'renewal',
  'default',
  'closing costs',
  'exit',
]

/**
 * Section 5 - Differentiators.
 *
 * Converts "fair" into operational standards. The composition mirrors an
 * underwriting worksheet: a cost equation on one side, ruled standards on the
 * other. No generic icon card grid.
 */
export function FairlendBorrowerDifferentiators(): ReactElement {
  return (
    <section
      aria-labelledby="borrower-differentiators-title"
      className="borrower-differentiators"
      data-borrower-differentiators
    >
      <div className="borrower-differentiators__inner">
        <div className="borrower-differentiators__cost-board">
          <div className="borrower-differentiators__cost-board-topline">
            <p className="borrower-differentiators__label">Why borrowers choose FairLend</p>
            <span className="borrower-differentiators__stamp">Before you sign</span>
          </div>
          <h2 className="borrower-differentiators__title" id="borrower-differentiators-title">
            Understand the full private mortgage deal.
          </h2>
          <p className="borrower-differentiators__body">
            A private mortgage can look simple when the conversation starts with rate. The real
            decision is whether the full cost, term, fees, payout path, and exit plan make sense
            together.
          </p>

          <div className="borrower-differentiators__equation" aria-label="Total cost ingredients">
            <span className="borrower-differentiators__equation-result">
              Total private mortgage cost
            </span>
            <span aria-hidden="true" className="borrower-differentiators__equation-equals">
              =
            </span>
            {costItems.map((item, index) => (
              <span className="borrower-differentiators__equation-item" key={item}>
                <span>{item}</span>
                {index < costItems.length - 1 && <b aria-hidden="true">+</b>}
              </span>
            ))}
          </div>

          <p className="borrower-differentiators__cost-board-rule">
            Rate is one input. The decision is the full structure.
          </p>
        </div>

        <div className="borrower-differentiators__standards" aria-label="FairLend standards">
          {standards.map((standard, index) => (
            <article
              className="borrower-differentiators__standard"
              data-status={standard.status}
              key={standard.title}
            >
              <div className="borrower-differentiators__standard-index">
                <span>Rule</span>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="borrower-differentiators__standard-copy">
                <div className="borrower-differentiators__standard-meta">
                  <span className="borrower-differentiators__standard-status">
                    {standard.statusLabel}
                  </span>
                  <span className="borrower-differentiators__standard-rule">{standard.rule}</span>
                </div>
                <h3>{standard.title}</h3>
                <p>{standard.body}</p>
                <ul className="borrower-differentiators__standard-checks" aria-label="Rule checks">
                  {standard.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </div>
              <span aria-hidden="true" className="borrower-differentiators__standard-icon">
                {index === 0 && <BadgeCheck strokeWidth={1.55} />}
                {index === 1 && <HandCoins strokeWidth={1.55} />}
                {index === 2 && <LogOut strokeWidth={1.55} />}
                {index === 3 && <FileText strokeWidth={1.55} />}
                {index === 4 && <ShieldCheck strokeWidth={1.55} />}
              </span>
            </article>
          ))}
        </div>

        <div className="borrower-differentiators__footer">
          <Landmark aria-hidden="true" size={18} strokeWidth={1.7} />
          <span>
            Responsible private financing still requires lender review, documentation, valuation,
            lender fit, available capital, and a realistic repayment or exit path.
          </span>
        </div>
      </div>
    </section>
  )
}
