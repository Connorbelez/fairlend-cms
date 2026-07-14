import type { ReactElement } from 'react'

import './investor-protection-stack.css'

type ProtectionLayer = {
  id: string
  number: string
  name: string
  promise: string
  question: string
}

const protectionLayers: readonly ProtectionLayer[] = [
  {
    id: 'rejection',
    name: 'Deal rejection discipline',
    number: '01',
    promise:
      'Most files are rejected before the investor stage. The opportunities that reach you have already survived the hard no.',
    question: '“Am I filtering raw deals?” No — we already did.',
  },
  {
    id: 'valuation',
    name: 'Double valuation review',
    number: '02',
    promise:
      'We pressure-test the valuation so the LTV is grounded in market reality, not optimistic assumptions.',
    question: '“Is the value real?”',
  },
  {
    id: 'ltv',
    name: 'Conservative LTVs under 75%',
    number: '03',
    promise:
      'A conservative LTV is one risk-control input. It does not eliminate valuation, market, borrower, or recovery risk.',
    question: '“Is there a margin of safety?”',
  },
  {
    id: 'verification',
    name: 'AI-assisted, human-led verification',
    number: '04',
    promise:
      'Approximately 7,000 data points across borrower, property, income, fraud, and documentation — with experienced people making the call.',
    question: '“Was this checked beyond a credit score?”',
  },
  {
    id: 'documentation',
    name: 'Mortgage documentation + power-of-sale path',
    number: '05',
    promise:
      'Documented mortgage terms, obligations, and a power-of-sale recovery path where applicable.',
    question: '“What if the borrower stops paying?”',
  },
  {
    id: 'recovery',
    name: 'Dedicated legal recovery team',
    number: '06',
    promise:
      'A battle-tested default playbook that exists before anything goes wrong. Borrower coordination, investor communication, enforcement, recovery.',
    question: '“Is there a plan if a file gets stressed?”',
  },
]

/**
 * Section 4 — Six Layers Designed to Protect Capital (Concept A, vertical stack).
 *
 * Six numbered bands forming a single column — defense in depth. Each band:
 * layer number, name, one-line promise, the investor question it answers.
 * Lime is used only on the layer number marker and the question-rule accent —
 * never on whole bands, never on paragraph copy.
 *
 * Compliance: "designed to protect," never "principal protected." A conservative
 * LTV reduces, not eliminates, risk. Power of sale is a recovery path, not a
 * guarantee of full or fast recovery.
 */
export function FairlendInvestorProtectionStack(): ReactElement {
  return (
    <section
      aria-labelledby="investor-protection-title"
      className="investor-protection"
      data-investor-protection-stack
      id="investor-protection-stack"
    >
      <div className="investor-protection__inner">
        <header className="investor-protection__header">
          <p className="investor-protection__eyebrow">The protection framework</p>
          <h2 className="investor-protection__title" id="investor-protection-title">
            Six layers, built before your capital is placed.
          </h2>
          <p className="investor-protection__lede">
            Each layer answers a specific investor question. Together they form a controlled process
            — not a guarantee that losses cannot occur. The point is that risk is priced,
            documented, monitored, and managed before you ever commit.
          </p>
        </header>

        <ol
          aria-label="Six layers designed to protect investor capital"
          className="investor-protection__stack"
        >
          {protectionLayers.map((layer) => (
            <li className="investor-protection__band" data-investor-protection-band key={layer.id}>
              <div className="investor-protection__band-number" aria-hidden="true">
                <span>{layer.number}</span>
              </div>
              <div className="investor-protection__band-body">
                <h3 className="investor-protection__band-name">{layer.name}</h3>
                <p className="investor-protection__band-promise">{layer.promise}</p>
                <p className="investor-protection__band-question">
                  <span aria-hidden="true" className="investor-protection__band-question-mark" />
                  {layer.question}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="investor-protection__foot-note">
          Designed to protect capital is not the same as &ldquo;principal protected.&rdquo; Private
          mortgage investments involve borrower, property, market, legal, liquidity, and recovery
          risk. These layers reduce and manage that risk; they do not promise it away.
        </p>
      </div>
    </section>
  )
}
