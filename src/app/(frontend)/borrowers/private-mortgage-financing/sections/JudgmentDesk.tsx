import Image from 'next/image'
import { type ReactElement } from 'react'
import { MapPinned, ShieldCheck } from 'lucide-react'

import { operatingStandards, reviewRegisters } from './data'

export function JudgmentDesk(): ReactElement {
  return (
    <section className="pm-judgment" aria-labelledby="pm-judgment-title">
      <div className="pm-judgment__image" aria-hidden="true">
        <Image
          alt=""
          fill
          sizes="(max-width: 60rem) 100vw, 52vw"
          src="/assets/fairlend-principal-broker-background-halftone-key.webp"
        />
      </div>

      <div className="pm-judgment__copy">
        <p className="pm-label pm-label--dark">The judgment desk</p>
        <h2 id="pm-judgment-title">Talk to people who structure private mortgages every day.</h2>
        <p>
          FairLend treats private mortgage financing as accountable brokerage work, not a rushed
          search for a rate quote. The decision still needs human review, plain-language disclosure,
          and a maturity path you can actually use.
        </p>
        <p className="pm-judgment__whole-file">
          FairLend reviews the address, valuation, current mortgage, deadline, available equity,
          documentation, payment capacity, fee exposure, payout terms, renewal path, and exit
          together. The goal is a structure that solves the pressure without leaving you stuck at
          maturity.
        </p>

        <dl className="pm-judgment__register">
          {reviewRegisters.map(([label, value], index) => (
            <div key={label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="pm-judgment__standards">
        <div className="pm-judgment__local">
          <MapPinned aria-hidden="true" />
          <p className="pm-micro">Southern Ontario mortgage context</p>
          <h3>Local mortgage judgment, explained in borrower language.</h3>
          <p>
            Understand the file, avoid weak structures, explain the tradeoffs, and make the exit
            visible before funding.
          </p>
        </div>

        <ul>
          {operatingStandards.map(([title, body]) => (
            <li key={title}>
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
