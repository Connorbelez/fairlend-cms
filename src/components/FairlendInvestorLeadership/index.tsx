import type { ReactElement } from 'react'
import Image from 'next/image'

import './investor-leadership.css'

const stats = [
  {
    detail: 'Across lending, private mortgages, construction, appraisal, and recovery in Southern Ontario.',
    label: 'Southern Ontario-focused',
    value: '~30 yrs',
  },
  {
    detail: 'One of Canada’s top mortgage brokers by volume — across lending and private mortgages.',
    label: 'Funded',
    value: '~$2B',
  },
  {
    detail: 'Permitting, appraisal dynamics, land values, neighbourhoods, and borrower profiles.',
    label: 'Local edge',
    value: 'LOCAL',
  },
] as const

const bench = [
  {
    name: 'Elie Soberano',
    role: 'Principal Broker · Founder',
    summary:
      'Nearly 30 years in mortgage brokerage and more than $2B funded, with deep Southern Ontario experience across lending, private mortgages, construction, appraisal, and recovery. Has built custom homes, managed major rental properties, and advised at the product-strategy level.',
  },
  {
    name: 'Connor Beleznay',
    role: 'CTO & MIC Director',
    summary:
      'Capital-markets and technology depth (ex-RBC Capital Markets). Leads the platform, AI-assisted underwriting, and the investor portal.',
  },
  {
    name: 'Bogdan Krystek',
    role: 'Operations & Finance',
    summary:
      'Former President of Barton Engineering, adding precision-manufacturing, high-volume production, and just-in-time operating discipline to underwriting and recovery work.',
  },
] as const

/**
 * Section 11 — Leadership & Track Record (Concept A + B hybrid).
 *
 * Credibility through pattern recognition, not celebrity. Founder-led profile
 * (Elie) leads, then a stat band (~$2B / ~30 yrs / GTA), then a brief bench.
 * The numbers land here hardest, alongside the recovery and technology bench.
 *
 * Compliance: "nearly 30 years" / "~$2B" used consistently. "Top 1% / top-volume"
 * framed conservatively. Recovery language stays sober — capability and process.
 */
export function FairlendInvestorLeadership(): ReactElement {
  return (
    <section
      aria-labelledby="investor-leadership-title"
      className="investor-leadership"
      data-investor-leadership
      id="investor-leadership"
    >
      <div className="investor-leadership__inner">
        <header className="investor-leadership__header">
          <div>
            <h2 className="investor-leadership__title" id="investor-leadership-title">
              Experienced people. Documented process. Technology where it actually helps.
            </h2>
          </div>
          <figure className="investor-leadership__ink-plate">
            <Image
              alt="Halftone architectural plans and key representing property-backed lending judgment"
              fill
              loading="lazy"
              sizes="(max-width: 820px) 90vw, 32vw"
              src="/assets/fairlend-principal-broker-background-halftone-key.webp"
            />
          </figure>
        </header>

        <div className="investor-leadership__stats">
          {stats.map((stat) => (
            <div className="investor-leadership__stat" key={stat.label}>
              <span className="investor-leadership__stat-value">{stat.value}</span>
              <span className="investor-leadership__stat-label">{stat.label}</span>
              <p className="investor-leadership__stat-detail">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="investor-leadership__bench">
          {bench.map((person) => (
            <article className="investor-leadership__person" key={person.name}>
              <h3 className="investor-leadership__person-name">{person.name}</h3>
              <p className="investor-leadership__person-role">{person.role}</p>
              <p className="investor-leadership__person-summary">{person.summary}</p>
            </article>
          ))}
        </div>

        <div className="investor-leadership__recovery">
          <h3 className="investor-leadership__recovery-title">
            And we plan for the hard files.
          </h3>
          <p className="investor-leadership__recovery-copy">
            Recovery isn&apos;t improvised after a default. FairLend maintains a dedicated,
            battle-tested legal recovery team and a defined default-response playbook — borrower
            coordination, investor communication, enforcement strategy, and power of sale where
            required. Recovery is a capability and a process, never a promise that we always
            recover in full or on time.
          </p>
        </div>
      </div>
    </section>
  )
}
