import type { ReactElement } from 'react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import './investor-fit.css'

const accessHref = buildFairlendIntakeHref({
  intent: 'invest',
  source: 'investor-fit',
})

const forYou = [
  'Investors seeking mortgage-backed income',
  'Comfortable with private-credit risk',
  'Value documentation, reporting, and administration',
  'Prefer conservative LTV and collateral discipline',
  'Understand return potential comes with risk and illiquidity',
] as const

const notForYou = [
  'Investors who need daily liquidity',
  'Want a bank-deposit replacement',
  'Require guaranteed returns',
  'Won’t review risk disclosure',
  'Chase the highest rate regardless of file quality',
] as const

/**
 * Section 12 — Who This Is For — and Who It Isn't (Concept A).
 *
 * Two columns: For / Not for. The "Not for" is a feature, not an apology — it
 * signals integrity and reinforces the suitability-first, FSRA-aligned posture.
 */
export function FairlendInvestorFit(): ReactElement {
  return (
    <section
      aria-labelledby="investor-fit-title"
      className="investor-fit"
      data-investor-fit
      id="investor-fit"
    >
      <div className="investor-fit__inner">
        <header className="investor-fit__header">
          <h2 className="investor-fit__title" id="investor-fit-title">
            Built for investors who care as much about the file as the rate.
          </h2>
          <p className="investor-fit__lede">
            We qualify investors on purpose. If you want guaranteed, liquid, risk-free returns,
            this isn&apos;t it — and we&apos;d rather tell you now.
          </p>
        </header>

        <div className="investor-fit__columns">
          <article className="investor-fit__column">
            <h3 className="investor-fit__column-title">
              <span className="investor-fit__column-mark investor-fit__column-mark--for" aria-hidden="true">+</span>
              This fits if
            </h3>
            <ul className="investor-fit__list">
              {forYou.map((item) => (
                <li className="investor-fit__list-item" key={item}>
                  <span aria-hidden="true" className="investor-fit__bullet investor-fit__bullet--for" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="investor-fit__column">
            <h3 className="investor-fit__column-title">
              <span className="investor-fit__column-mark investor-fit__column-mark--not" aria-hidden="true">−</span>
              Not for
            </h3>
            <ul className="investor-fit__list">
              {notForYou.map((item) => (
                <li className="investor-fit__list-item" key={item}>
                  <span aria-hidden="true" className="investor-fit__bullet investor-fit__bullet--not" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="investor-fit__cta">
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
