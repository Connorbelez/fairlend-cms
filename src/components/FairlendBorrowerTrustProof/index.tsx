import type { ReactElement } from 'react'
import { BadgeCheck, Building2, ClipboardCheck, Headset, MapPinned } from 'lucide-react'

import './borrower-trust-proof.css'

type Capability = {
  role: string
  title: string
  body: string
  icon: typeof BadgeCheck
}

const capabilities: readonly Capability[] = [
  {
    body: 'Your need, property condition, current mortgage, documents, lender fit, and exit are reviewed together.',
    icon: ClipboardCheck,
    role: 'Your situation',
    title: 'A whole-picture review',
  },
  {
    body: 'Property value, mortgage position, and equity are checked carefully so the proposed amount is grounded in what the property can support.',
    icon: Building2,
    role: 'Property value',
    title: 'Careful valuation review',
  },
  {
    body: 'Support can continue after funding through payment questions, renewals, payouts, coordination, and administration.',
    icon: Headset,
    role: 'After closing',
    title: 'Practical ongoing support',
  },
]

const proofMarkers = [
  {
    body: 'Property, mortgage position, documentation, lender fit, and exit are reviewed together before a structure is recommended.',
    label: 'One connected review',
  },
  {
    body: 'You see the practical tradeoffs: cost, timing, maturity path, and what needs to be ready before funding.',
    label: 'Plain-language tradeoffs',
  },
  {
    body: 'Technology helps organize the work, but experienced mortgage professionals make the judgment calls.',
    label: 'Human judgment',
  },
] as const

/**
 * Section 7 - Trust / Proof.
 *
 * Establishes who is reviewing the file without using unverified numeric proof.
 * Principal-broker statistics can be added only after the exact approved claims
 * are confirmed.
 */
export function FairlendBorrowerTrustProof(): ReactElement {
  return (
    <section aria-labelledby="borrower-trust-title" className="borrower-trust" data-borrower-trust>
      <div className="borrower-trust__inner">
        <div className="borrower-trust__statement">
          <p className="borrower-trust__label">Who helps you decide</p>
          <h2 className="borrower-trust__title" id="borrower-trust-title">
            Talk to people who structure private mortgages every day.
          </h2>
          <p className="borrower-trust__body">
            FairLend treats private mortgage financing as accountable brokerage work, not a rushed
            search for a rate quote. The decision still needs human review, plain-language
            disclosure, and a maturity path you can actually use.
          </p>
        </div>

        <div className="borrower-trust__proof-band" aria-label="FairLend proof guardrails">
          <div className="borrower-trust__proof-lead">
            <div className="borrower-trust__proof-kicker">
              <MapPinned aria-hidden="true" size={18} strokeWidth={1.7} />
              <span>Ontario and GTA mortgage context</span>
            </div>
            <h3>Local mortgage judgment, explained in borrower language.</h3>
            <p>
              The standard is simple: understand the property, avoid weak structures, explain the
              tradeoffs, and make the exit visible before funding.
            </p>
          </div>

          <div className="borrower-trust__proof-ledger">
            {proofMarkers.map((marker) => (
              <div className="borrower-trust__proof-row" key={marker.label}>
                <BadgeCheck aria-hidden="true" size={18} strokeWidth={1.8} />
                <div>
                  <strong>{marker.label}</strong>
                  <p>{marker.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="borrower-trust__capabilities">
          {capabilities.map((capability) => {
            const Icon = capability.icon
            return (
              <article className="borrower-trust__capability" key={capability.title}>
                <div className="borrower-trust__capability-head">
                  <Icon aria-hidden="true" strokeWidth={1.55} />
                  <span>{capability.role}</span>
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
