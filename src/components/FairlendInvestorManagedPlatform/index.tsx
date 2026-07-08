import type { ReactElement } from 'react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './investor-managed-platform.css'

const accessHref = buildFairlendIntakeHref({
  intent: 'invest',
  source: 'investor-managed-platform',
})

const diyRows: readonly string[] = [
  'Find deals, then vet every one yourself',
  'Paper the closing with your own lawyer',
  'Chase monthly cheques by hand',
  'Reconcile payments in your own spreadsheet',
  'Build or hire a servicing and management team',
  'Assemble your own tax paperwork each year',
  'Handle default alone if a file goes wrong',
]

const fairlendRows: readonly string[] = [
  'Curated opportunities, pre-vetted',
  'Digital closing coordinated on platform',
  'PAD collection from borrowers',
  'Automated disbursements to you',
  'Live investor portal, full transparency',
  'Tax-ready exports + QuickBooks sync',
  'A dedicated legal recovery team on file',
]

/**
 * Section 5 — One Platform, Fully Managed, End to End (Concept A, before/after).
 *
 * Two columns: "Investing privately on your own" vs "Investing with FairLend."
 * The left column is effortful (square bullets, plain rows); the right is
 * handled (lime check marks). Carries the emotional payoff: "I don't have to
 * run this myself."
 */
export function FairlendInvestorManagedPlatform(): ReactElement {
  return (
    <section
      aria-labelledby="investor-managed-title"
      className="investor-managed"
      data-investor-managed
    >
      <div className="investor-managed__inner">
        <header className="investor-managed__header">
          <p className="investor-managed__eyebrow">One platform, end to end</p>
          <h2 className="investor-managed__title" id="investor-managed-title">
            One platform. End to end. Nothing left on your desk.
          </h2>
          <p className="investor-managed__lede">
            FairLend replaces collecting cheques by hand and recruiting your own servicing team.
            Brokerage, underwriting, digital closing, payment administration, investor reporting,
            and legal recovery operate as one managed layer.
          </p>
        </header>

        <div className="investor-managed__columns">
          <article className="investor-managed__column investor-managed__column--diy">
            <header className="investor-managed__column-head">
              <span className="investor-managed__column-tag">On your own</span>
              <h3 className="investor-managed__column-title">
                Investing privately, by yourself
              </h3>
            </header>
            <ul className="investor-managed__list">
              {diyRows.map((row) => (
                <li className="investor-managed__list-item" key={row}>
                  <span aria-hidden="true" className="investor-managed__mark investor-managed__mark--diy" />
                  <span>{row}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="investor-managed__column investor-managed__column--fairlend">
            <header className="investor-managed__column-head">
              <span className="investor-managed__column-tag investor-managed__column-tag--lime">
                With FairLend
              </span>
              <h3 className="investor-managed__column-title">
                One fully managed platform
              </h3>
            </header>
            <ul className="investor-managed__list">
              {fairlendRows.map((row) => (
                <li className="investor-managed__list-item" key={row}>
                  <span aria-hidden="true" className="investor-managed__mark investor-managed__mark--lime">
                    <CheckMark />
                  </span>
                  <span>{row}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="investor-managed__cta-row">
          <FairlendBorrowerCta
            href={accessHref}
            label="Request Investor Access"
            size="md"
            variant="primary"
          />
        </div>
      </div>
    </section>
  )
}

function CheckMark(): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 7.5L6 10.5L11 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
