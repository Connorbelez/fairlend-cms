import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { FairlendBuildPropertyTypes } from '@/components/FairlendBuildPropertyTypes'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import { BuildModelMotion } from './BuildModelMotion.client'
import './build-model.css'

/* ------------------------------------------------------------------ */
/* Locked copy - see SECTION-DESIGN.md §5                              */
/* ------------------------------------------------------------------ */

const ctaHref = buildFairlendIntakeHref({
  intent: 'consultation',
  source: 'build-model-consultation',
})

const variables = [
  'Land',
  'Scope',
  'Capital',
  'Draw plan',
  'Professional path',
  'Permit & MLI readiness',
  'Exit',
] as const

type BuildVariable = (typeof variables)[number]

type BoardState = {
  id: string
  status: string
  count: string
  title: string
  variables: readonly BuildVariable[]
  theme: 'ivory' | 'builder-blueprint' | 'forest' | 'ink'
}

type Station = BoardState & {
  num: string
  name: string
  services: readonly string[]
}

const introState = {
  id: 'intro',
  status: 'Model open',
  count: '03',
  title: 'Property to equation',
  variables: ['Land', 'Scope', 'Capital'],
  theme: 'ivory',
} as const satisfies BoardState

const stations = [
  {
    id: 'plan',
    status: '01 / Plan',
    count: '01',
    title: 'Land + scope',
    variables: ['Land', 'Scope'],
    theme: 'builder-blueprint',
    num: '01',
    name: 'Plan',
    services: [
      'Site search & feasibility review',
      'Land basis & acquisition price the project can support',
      'Zoning path, housing form, unit mix, buildable area',
      'Construction budget pressure-testing',
    ],
  },
  {
    id: 'finance',
    status: '02 / Finance',
    count: '02',
    title: 'Capital + draw plan',
    variables: ['Capital', 'Draw plan'],
    theme: 'forest',
    num: '02',
    name: 'Finance',
    services: [
      'Construction budget & borrower capital position',
      'Private financing & capital structure',
      'Draw schedule (milestone-based, DrawFlow)',
      'Working-capital planning',
    ],
  },
  {
    id: 'support',
    status: '03 / Build support',
    count: '03',
    title: 'Professional path',
    variables: ['Professional path', 'Permit & MLI readiness'],
    theme: 'ink',
    num: '03',
    name: 'Build support',
    services: [
      'Contractor, consultant & professional network — introductions where appropriate',
      'Permit strategy & documentation gap analysis',
      'CMHC MLI Select readiness support (where applicable)',
      'Milestone/draw administration & site monitoring',
    ],
  },
  {
    id: 'takeout',
    status: '04 / Takeout',
    count: '04',
    title: 'Exit + takeout',
    variables: ['Exit', 'Permit & MLI readiness'],
    theme: 'ivory',
    num: '04',
    name: 'Takeout',
    services: [
      'Sale, refinance, or rental stabilization',
      'Insured (MLI Select) takeout preparation',
      'Long-term financing direction',
    ],
  },
] as const satisfies readonly Station[]

const drawFlowState = {
  id: 'drawflow',
  status: 'Powered by DrawFlow',
  count: '15',
  title: 'Fund work, not wait',
  variables: ['Capital', 'Draw plan', 'Professional path'],
  theme: 'builder-blueprint',
} as const satisfies BoardState

const thesisState = {
  id: 'thesis',
  status: 'Builder Consulting',
  count: '→',
  title: 'Outcome',
  variables,
  theme: 'forest',
} as const satisfies BoardState

const progressItems = [
  { id: introState.id, label: 'Intent' },
  { id: 'plan', label: 'Plan' },
  { id: 'finance', label: 'Finance' },
  { id: 'support', label: 'Support' },
  { id: 'drawflow', label: 'DrawFlow' },
  { id: 'takeout', label: 'Takeout' },
] as const

const milestoneNodes = [
  'Foundation',
  'Framing',
  'Roof',
  'Windows',
  'Mechanical',
  'Plumbing',
  'Electrical',
  'Drywall',
  'Flooring',
] as const

const thesisVariables = [
  'Land',
  'Cost',
  'Capital',
  'Draws',
  'Policy',
  'Incentives',
  'Takeout',
] as const

function stateData(state: BoardState) {
  return {
    'data-bm-step': state.id,
    'data-bm-status': state.status,
    'data-bm-count': state.count,
    'data-bm-title': state.title,
    'data-bm-variables': state.variables.join('|'),
    'data-bm-theme': state.theme,
  }
}

function BuildModelBoard() {
  return (
    <aside className="bm-board-wrap" aria-label="Build model status and consultation shortcut">
      <div className="bm-board">
        <div className="bm-board-inner">
          <div className="bm-board-visual" aria-hidden="true">
            <div className="bm-board-top">
              <span className="bm-board-status" data-bm-board-status>
                {introState.status}
              </span>
              <span className="bm-board-count" data-bm-board-count>
                {introState.count}
              </span>
            </div>

            <div className="bm-board-title">
              <span className="bm-board-label">Active variable</span>
              <span className="bm-board-active" data-bm-board-title>
                {introState.title}
              </span>
            </div>

            <FairlendBuildPropertyTypes className="bm-board-property-types" variant="board" />

            <div className="bm-board-equation">
              <div className="bm-board-chips" aria-label="Build variables">
                {variables.map((variable) => (
                  <span
                    className="bm-board-chip"
                    data-bm-variable={variable}
                    key={`bm-board-${variable}`}
                  >
                    {variable}
                  </span>
                ))}
              </div>
              <div className="bm-progress" aria-label="Build model progress">
                {progressItems.map((item) => (
                  <span
                    className="bm-progress-item"
                    data-bm-progress={item.id}
                    key={`bm-progress-${item.id}`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            aria-hidden="true"
            className="bm-board-cta"
            data-bm-board-cta
            href={ctaHref}
            tabIndex={-1}
          >
            <span>
              Book a free consultation
              <small>Bring a property, plan, or early idea.</small>
            </span>
            <span className="arrow-box" aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </aside>
  )
}

function AudienceCards() {
  return (
    <div className="bm-audience-grid">
      <article className="bm-audience-card builders">
        <span className="bm-audience-tag">If you already build</span>
        <p>Keep your focus on the site. We help carry the financing and business equation around it.</p>
      </article>
      <article className="bm-audience-card">
        <span className="bm-audience-tag">First-time builder</span>
        <p>
          Bring a property and a down payment. We craft the design and specs with you, assign an
          experienced builder or project manager, and handle the rest — permits, draws, takeout,
          everything.
        </p>
      </article>
    </div>
  )
}

function VariableRibbon() {
  return (
    <div className="bm-ribbon" aria-label="The variables FairLend helps shape">
      {variables.map((variable) => (
        <span className="bm-chip" key={`bm-chip-${variable}`}>
          {variable}
        </span>
      ))}
    </div>
  )
}

function ScrollStep({
  state,
  children,
  className,
}: {
  state: BoardState
  children: ReactNode
  className?: string
}) {
  return (
    <article className={['bm-scroll-step', className].filter(Boolean).join(' ')} {...stateData(state)}>
      {children}
    </article>
  )
}

function StationStep({ station }: { station: Station }) {
  return (
    <ScrollStep state={station}>
      <div className="bm-station-head">
        <span className="bm-station-num">{station.num}</span>
        <h3>{station.name}</h3>
      </div>
      <ul className="bm-service-list">
        {station.services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </ScrollStep>
  )
}

function DrawFlowStep() {
  return (
    <ScrollStep state={drawFlowState}>
      <section className="bm-drawflow" aria-labelledby="bm-drawflow-title">
        <span className="bm-df-label">
          <span className="pip" />
          Powered by DrawFlow
        </span>
        <h3 className="bm-df-head" id="bm-drawflow-title">
          A milestone <em>line of credit</em> for your build.
        </h3>
        <p className="bm-df-sub">
          More draws. Less interest. <b>Fund the work, not the wait.</b>
        </p>

        <div
          className="bm-milestones"
          role="img"
          aria-label="Milestone draw track: foundation, framing, roof, windows, mechanical, plumbing, electrical, drywall, flooring"
        >
          {milestoneNodes.map((node, index) => (
            <span
              className={[
                'bm-milestone',
                index < 5 ? 'done' : '',
                node === 'Plumbing' ? 'active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={`bm-ms-${node}`}
            >
              {node}
            </span>
          ))}
        </div>

        <div className="bm-df-compare">
          <div className="bm-df-cmp">
            <div className="bm-df-cmp-tag">Traditional</div>
            <div className="bm-df-cmp-num">3 draws</div>
          </div>
          <div className="bm-df-cmp fairlend">
            <div className="bm-df-cmp-tag">FairLend</div>
            <div className="bm-df-cmp-num">up to 15 draws</div>
          </div>
        </div>

        <div className="bm-df-saved">
          <span className="amt">≈ $12,000</span>
          <span className="lbl">— Illustrative interest saved over a typical build.</span>
          <span className="caveat">*Illustrative only. Every project differs.</span>
        </div>

        <div className="bm-df-flex">
          <article className="bm-tile">
            <span className="tile-title">Your schedule, not ours</span>
            <p>
              Build your own draw schedule. Tie releases to the milestones that match how your
              project actually goes up.
            </p>
          </article>
          <article className="bm-tile">
            <span className="tile-title">Modify it mid-build</span>
            <p>
              Builds don&apos;t always go as planned. Adjust the draw plan as the work shifts so
              capital is there when you need it, and not costing interest when you don&apos;t.
            </p>
          </article>
        </div>

        <div className="bm-df-more">
          <p>
            <b>More than capital.</b> Complimentary access to our GTA build specialists and a deep
            supplier &amp; trade network — your project manager comes with the financing.
          </p>
        </div>
      </section>
    </ScrollStep>
  )
}

function ThesisStrip() {
  return (
    <section className="bm-thesis bm-scroll-step" {...stateData(thesisState)}>
      <div className="bm-thesis-inner">
        <div className="bm-thesis-copy">
          <span className="bm-ts-label">Builder Consulting</span>
          <h3 className="bm-ts-head">
            FairLend&apos;s thesis: profit lives in the <em>variables</em>.
          </h3>
          <p className="bm-ts-body">
            A profitable build is not only a construction problem. It is a business equation that
            changes with land, cost, capital, draws, policy, incentives, and takeout.
          </p>
        </div>
        <div
          className="bm-ts-eq"
          aria-label="Build equation: land plus cost plus capital plus draws plus policy plus incentives plus takeout yields outcome"
        >
          {thesisVariables.map((variable, index) => (
            <span className="bm-ts-term" key={`bm-eq-${variable}`}>
              <span className="bm-ts-var">{variable}</span>
              {index < thesisVariables.length - 1 ? <span className="bm-ts-op">+</span> : null}
            </span>
          ))}
          <span className="bm-ts-arrow">→</span>
          <span className="bm-ts-outcome">Outcome</span>
        </div>
      </div>
    </section>
  )
}

export function FairlendBuildModelSection() {
  return (
    <section
      className="build-model"
      aria-labelledby="fairlend-build-model-title"
      data-fairlend-motion="build-model"
      data-palette-theme="ivory"
      data-testid="fairlend-build-model-section"
    >
      <BuildModelMotion />

      <div className="bm-scroll-grid">
        <BuildModelBoard />

        <div className="bm-scroll-copy">
          <ScrollStep state={introState} className="bm-scroll-intro">
            <span className="bm-kicker">
              <span className="num">03</span>
              <span className="slash">/</span>
              Our Build Model
            </span>
            <h2 className="bm-headline" id="fairlend-build-model-title">
              Bring us the property. We&apos;ll help build the equation.
            </h2>
            <p className="bm-lead">
              From <span className="accent">early intent</span> to construction financing and
              takeout strategy, we shape one financeable project — end to end.
            </p>

            <VariableRibbon />

            <p className="bm-shared-lead">
              You don&apos;t need the whole team, a perfect plan, or prior build experience before
              you talk to us.
            </p>

            <AudienceCards />

            <div className="bm-cta-row" data-bm-primary-cta>
              <Link className="bm-cta" href={ctaHref}>
                Book a free consultation
                <span className="arrow-box" aria-hidden="true">
                  <ArrowRight />
                </span>
              </Link>
              <p className="bm-cta-micro">
                Bring a property, plan, or early idea — your first conversation is on us.
              </p>
            </div>
          </ScrollStep>

          {stations.slice(0, 3).map((station) => (
            <StationStep key={`bm-step-${station.id}`} station={station} />
          ))}

          <DrawFlowStep />

          <StationStep station={stations[3]} />
        </div>
      </div>

      <ThesisStrip />
    </section>
  )
}
