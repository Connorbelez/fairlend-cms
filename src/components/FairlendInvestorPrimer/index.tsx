import type { ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Building2, Landmark, Wallet } from 'lucide-react'
import Image from 'next/image'

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
      'The registered mortgage records the financing terms, repayment obligations, and legal rights reviewed for the file.',
    id: 'mortgage',
    step: '02',
    title: 'The registered mortgage',
  },
  {
    Icon: Wallet,
    caption:
      'Investors earn income from the interest paid on that mortgage. Documentation, valuation, LTV, payment structure, and exit path determine whether it is worth considering.',
    id: 'investor',
    step: '03',
    title: 'The investor earns',
  },
]

/**
 * Section 2 — What a private mortgage investment is (Concept A, annotated flow).
 *
 * A three-node ledger flow: Borrower → Registered mortgage → Investor. Kept
 * calm and ledger-styled, with underwriting and documentation carrying the explanation.
 */
export function FairlendInvestorPrimer(): ReactElement {
  return (
    <section
      aria-labelledby="investor-primer-title"
      className="investor-primer"
      data-investor-primer
      id="investor-primer"
    >
      <div className="investor-primer__inner">
        <header className="investor-primer__header">
          <div className="investor-primer__header-copy">
            <h2 className="investor-primer__title" id="investor-primer-title">
              A private mortgage investment starts with a documented mortgage file.
            </h2>
            <p className="investor-primer__lede">
              FairLend reviews borrower quality, valuation, LTV, payment structure, legal
              documentation, and the exit path before presenting an opportunity for consideration.
            </p>
          </div>

          <figure className="investor-primer__dossier">
            <div className="investor-primer__dossier-image">
              <Image
                alt="Toronto-area detached home in a documented private mortgage investment file"
                fill
                loading="lazy"
                sizes="(max-width: 820px) 90vw, 36vw"
                src="/assets/fairlend-route-selector/private-mortgage-house-engraving.webp"
              />
            </div>
            <figcaption>
              <span>Illustrative mortgage file</span>
              <strong>Registered mortgage · reviewed documentation</strong>
            </figcaption>
          </figure>
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
