import type { ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Building2, Landmark, Wallet } from 'lucide-react'

import './investor-primer.css'

type FlowNode = {
  id: string
  step: string
  title: string
  caption: string
  Icon: LucideIcon
}

const flowNodes: readonly FlowNode[] = [
  {
    Icon: Building2,
    caption:
      'A borrower obtains mortgage financing outside the traditional bank channel — usually for speed, bridge timing, or a complex file.',
    id: 'borrower',
    step: '01',
    title: 'The borrower',
  },
  {
    Icon: Landmark,
    caption:
      'Financing is secured against real estate as a registered mortgage — not an unsecured promise to pay. The collateral is the property.',
    id: 'mortgage',
    step: '02',
    title: 'Mortgage secured by property',
  },
  {
    Icon: Wallet,
    caption:
      'Investors earn income from the interest paid on that mortgage. Security, valuation, LTV, payment structure, and exit path determine whether it is worth considering.',
    id: 'investor',
    step: '03',
    title: 'The investor earns',
  },
]

/**
 * Section 2 — What a private mortgage investment is (Concept A, annotated flow).
 *
 * A three-node ledger flow: Borrower → Mortgage secured by property → Investor.
 * The collateral is the property; the discipline is the underwriting. Kept
 * calm, ledger-styled, no icons-as-drama.
 */
export function FairlendInvestorPrimer(): ReactElement {
  return (
    <section
      aria-labelledby="investor-primer-title"
      className="investor-primer"
      data-investor-primer
    >
      <div className="investor-primer__inner">
        <header className="investor-primer__header">
          <p className="investor-primer__eyebrow">What it is</p>
          <h2 className="investor-primer__title" id="investor-primer-title">
            A private mortgage is a loan secured against real estate.
          </h2>
          <p className="investor-primer__lede">
            The security, valuation, borrower quality, LTV, payment structure, and exit path
            determine whether an opportunity is worth considering. The collateral is the property —
            but the discipline is the underwriting.
          </p>
        </header>

        <ol className="investor-primer__flow" aria-label="How a private mortgage investment works">
          {flowNodes.map((node, index) => (
            <li className="investor-primer__node" data-investor-primer-node key={node.id}>
              <div className="investor-primer__node-top">
                <span className="investor-primer__node-step">{node.step}</span>
                <span aria-hidden="true" className="investor-primer__node-icon">
                  <node.Icon strokeWidth={1.6} />
                </span>
              </div>
              <h3 className="investor-primer__node-title">{node.title}</h3>
              <p className="investor-primer__node-caption">{node.caption}</p>
              {index < flowNodes.length - 1 && (
                <span aria-hidden="true" className="investor-primer__node-connector" />
              )}
            </li>
          ))}
        </ol>

        <p className="investor-primer__risk-note">
          Higher yield ≠ no risk. A private mortgage can pay more because it solves a harder
          financing problem — not because risk has disappeared. FairLend&apos;s role is to separate
          financeable complexity from unacceptable risk before any opportunity reaches you.
        </p>
      </div>
    </section>
  )
}
