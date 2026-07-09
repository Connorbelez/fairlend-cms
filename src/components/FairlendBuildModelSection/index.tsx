import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { DrawFlowInterestBadge } from '@/components/FairlendLandingOverviewSection/DrawFlowInterestBadge'
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

const dossierTabs = [
  {
    id: 'parcel',
    label: 'Parcel',
    code: 'PL',
    title: 'Parcel sketch',
    summary: 'Lot, form, frontage, and the first buildable-area pass.',
  },
  {
    id: 'budget',
    label: 'Budget',
    code: 'BG',
    title: 'Capital test',
    summary: 'Land basis, hard costs, contingency, borrower capital, and room to move.',
  },
  {
    id: 'permit',
    label: 'Permit',
    code: 'PM',
    title: 'Approval path',
    summary: 'Zoning fit, consultants, document gaps, and MLI readiness where it applies.',
  },
  {
    id: 'draw',
    label: 'Draw',
    code: 'DR',
    title: 'Milestone funding',
    summary: 'A release schedule tied to actual site progress instead of calendar guesswork.',
  },
  {
    id: 'takeout',
    label: 'Takeout',
    code: 'TO',
    title: 'Exit file',
    summary: 'Sale, refinance, rental stabilization, or insured takeout direction.',
  },
] as const

type DossierTabId = (typeof dossierTabs)[number]['id']
type BuildVariable = (typeof variables)[number]

type BoardState = {
  id: string
  status: string
  count: string
  title: string
  variables: readonly BuildVariable[]
  dossierTab: DossierTabId
  theme: 'ivory' | 'builder-blueprint' | 'forest' | 'ink'
}

type Station = BoardState & {
  num: string
  name: string
  services: readonly string[]
  testimonial: {
    quote: string
    author: string
    context: string
  }
}

const introState = {
  id: 'intro',
  status: 'Model open',
  count: '03',
  title: 'Property to equation',
  variables: ['Land', 'Scope', 'Capital'],
  dossierTab: 'parcel',
  theme: 'ivory',
} as const satisfies BoardState

const stations = [
  {
    id: 'plan',
    status: '01 / Plan',
    count: '01',
    title: 'Land + scope',
    variables: ['Land', 'Scope'],
    dossierTab: 'parcel',
    theme: 'builder-blueprint',
    num: '01',
    name: 'Plan',
    services: [
      'Site search & feasibility review',
      'Land basis & acquisition price the project can support',
      'Zoning path, housing form, unit mix, buildable area',
      'Construction budget pressure-testing',
    ],
    testimonial: {
      quote:
        'They showed us what the site could actually support before we tied up more capital in the acquisition.',
      author: 'Toronto infill buyer',
      context: 'Land feasibility file',
    },
  },
  {
    id: 'finance',
    status: '02 / Finance',
    count: '02',
    title: 'Capital + draw plan',
    variables: ['Capital', 'Draw plan'],
    dossierTab: 'budget',
    theme: 'forest',
    num: '02',
    name: 'Finance',
    services: [
      'Construction budget & borrower capital position',
      'Private financing & capital structure',
      'Draw schedule (milestone-based, DrawFlow)',
      'Working-capital planning',
    ],
    testimonial: {
      quote:
        'FairLend put the capital stack, draws, and borrower equity into one model we could make decisions from.',
      author: 'Small-scale builder',
      context: 'Construction financing borrower',
    },
  },
  {
    id: 'support',
    status: '03 / Build support',
    count: '03',
    title: 'Professional path',
    variables: ['Professional path', 'Permit & MLI readiness'],
    dossierTab: 'permit',
    theme: 'ink',
    num: '03',
    name: 'Build support',
    services: [
      'Contractor, consultant & professional network — introductions where appropriate',
      'Permit strategy & documentation gap analysis',
      'CMHC MLI Select readiness support (where applicable)',
      'Milestone/draw administration & site monitoring',
    ],
    testimonial: {
      quote:
        'The introductions and permit-readiness work saved weeks of back-and-forth before our lender package went out.',
      author: 'Laneway developer',
      context: 'Consultant and approval path',
    },
  },
  {
    id: 'takeout',
    status: '04 / Takeout',
    count: '04',
    title: 'Exit + takeout',
    variables: ['Exit', 'Permit & MLI readiness'],
    dossierTab: 'takeout',
    theme: 'ivory',
    num: '04',
    name: 'Takeout',
    services: [
      'Sale, refinance, or rental stabilization',
      'Insured (MLI Select) takeout preparation',
      'Long-term financing direction',
    ],
    testimonial: {
      quote:
        'They kept the refinance path visible while the build was still moving, so the exit did not become an afterthought.',
      author: 'Rental project owner',
      context: 'Takeout planning file',
    },
  },
] as const satisfies readonly Station[]

const drawFlowTestimonial = {
  quote:
    'The draw schedule matched the way the job actually progressed. We were not paying for idle capital between milestones.',
  author: 'GTA residential builder',
  context: 'Milestone draw borrower',
} as const

const drawFlowState = {
  id: 'drawflow',
  status: 'Powered by DrawFlow',
  count: '15',
  title: 'Fund work, not wait',
  variables: ['Capital', 'Draw plan', 'Professional path'],
  dossierTab: 'draw',
  theme: 'builder-blueprint',
} as const satisfies BoardState

const thesisState = {
  id: 'thesis',
  status: 'Builder Consulting',
  count: '→',
  title: 'Outcome',
  variables,
  dossierTab: 'takeout',
  theme: 'forest',
} as const satisfies BoardState

const progressItems = [
  { id: introState.id, label: 'Intent' },
  { id: 'drawflow', label: 'DrawFlow' },
  { id: 'plan', label: 'Plan' },
  { id: 'finance', label: 'Finance' },
  { id: 'support', label: 'Support' },
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

const thesisCells = ['Single family', 'Land', 'Build cost', 'Exit value', 'Profit'] as const

function stateData(state: BoardState) {
  return {
    'data-bm-step': state.id,
    'data-bm-status': state.status,
    'data-bm-count': state.count,
    'data-bm-title': state.title,
    'data-bm-variables': state.variables.join('|'),
    'data-bm-dossier-tab': state.dossierTab,
    'data-bm-theme': state.theme,
  }
}

function DossierParcelSketch() {
  return (
    <div className="bm-parcel-canvas">
      <div className="bm-parcel-art" aria-hidden="true">
        <Image
          alt=""
          className="bm-parcel-art-image"
          height={1024}
          priority
          sizes="(max-width: 768px) 84vw, 360px"
          src="/assets/visual-assets/build-model-parcel-sketch/build-model-parcel-sketch.webp"
          width={1536}
        />
      </div>
      <dl className="bm-dossier-mini-stats">
        <div>
          <dt>Housing form</dt>
          <dd>Multiplex + laneway option</dd>
        </div>
        <div>
          <dt>First decision</dt>
          <dd>Can the site carry the scope?</dd>
        </div>
      </dl>
    </div>
  )
}

function DossierBudgetSheet() {
  const rows = [
    ['Land ceiling', '$1.18M'],
    ['Hard-cost range', '$340-390 / sf'],
    ['Contingency', '8-12%'],
    ['Capital check', 'LTC fit'],
  ] as const

  return (
    <div className="bm-budget-sheet">
      <div className="bm-budget-total">
        <span>Supportable basis</span>
        <strong>$2.74M</strong>
      </div>
      <dl className="bm-budget-ledger">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function DossierPermitMatrix() {
  const rows = [
    ['Zoning path', 'Reviewing'],
    ['Survey + drawings', 'Gap list'],
    ['Consultant bench', 'Matched'],
    ['MLI readiness', 'If applicable'],
  ] as const

  return (
    <div className="bm-permit-matrix">
      {rows.map(([label, status], index) => (
        <div className="bm-permit-row" key={label}>
          <span className="bm-permit-index">{String(index + 1).padStart(2, '0')}</span>
          <span>{label}</span>
          <strong>{status}</strong>
        </div>
      ))}
    </div>
  )
}

function DossierDrawSchedule() {
  const nodes = ['Foundation', 'Frame', 'Roof', 'MEP', 'Drywall', 'Finish'] as const

  return (
    <div className="bm-dossier-draw">
      <div className="bm-dossier-draw-head">
        <span>DrawFlow track</span>
        <strong>15 draws</strong>
      </div>
      <div className="bm-dossier-draw-line" aria-hidden="true">
        {nodes.map((node, index) => (
          <span className={index < 4 ? 'is-funded' : index === 4 ? 'is-current' : ''} key={node}>
            {node}
          </span>
        ))}
      </div>
      <p>
        Release capital as the work is verified, then reshape the schedule when the site changes.
      </p>
    </div>
  )
}

function DossierTakeoutPlan() {
  const exits = ['Sale', 'Refi', 'Rental', 'MLI'] as const

  return (
    <div className="bm-takeout-file">
      <div className="bm-takeout-routes" aria-hidden="true">
        {exits.map((exit, index) => (
          <span className={index === 2 ? 'is-preferred' : ''} key={exit}>
            {exit}
          </span>
        ))}
      </div>
      <div className="bm-takeout-note">
        <span>Primary model</span>
        <strong>Stabilized rental refinance</strong>
        <p>Keep the takeout visible before drawings, debt, and scope become fixed.</p>
      </div>
    </div>
  )
}

function DossierTabCard({ tab }: { tab: (typeof dossierTabs)[number] }) {
  return (
    <article
      className={['bm-dossier-tab', tab.id === introState.dossierTab ? 'is-active' : '']
        .filter(Boolean)
        .join(' ')}
      data-bm-dossier-card
      data-bm-dossier-tab={tab.id}
      data-bm-dossier-code={tab.code}
    >
      <div className="bm-dossier-tab-top">
        <span className="bm-dossier-tab-code">{tab.code}</span>
        <span className="bm-dossier-tab-label">{tab.label}</span>
      </div>
      <div className="bm-dossier-tab-body">
        <h3>{tab.title}</h3>
        <p>{tab.summary}</p>
        {tab.id === 'parcel' ? <DossierParcelSketch /> : null}
        {tab.id === 'budget' ? <DossierBudgetSheet /> : null}
        {tab.id === 'permit' ? <DossierPermitMatrix /> : null}
        {tab.id === 'draw' ? <DossierDrawSchedule /> : null}
        {tab.id === 'takeout' ? <DossierTakeoutPlan /> : null}
      </div>
    </article>
  )
}

function BuildModelBoard({ className }: { className?: string }) {
  return (
    <aside
      className={['bm-board-wrap', className].filter(Boolean).join(' ')}
      aria-label="Build model status and consultation shortcut"
    >
      <div className="bm-board">
        <div className="bm-board-inner">
          <div className="bm-board-header">
            <span aria-hidden="true" className="bm-board-status" data-bm-board-status>
              {introState.status}
            </span>
            <DrawFlowInterestBadge className="bm-board-drawflow-badge" compact />
            <span aria-hidden="true" className="bm-board-count" data-bm-board-count>
              {introState.count}
            </span>
          </div>
          <div className="bm-board-visual" aria-hidden="true">
            <div className="bm-board-title">
              <span className="bm-board-label">Live deal file</span>
              <span className="bm-board-active" data-bm-board-title>
                {introState.title}
              </span>
            </div>

            <div className="bm-dossier-stack" data-bm-dossier-stack>
              {dossierTabs.map((tab) => (
                <DossierTabCard key={tab.id} tab={tab} />
              ))}
            </div>

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
        <p>
          Keep your focus on the site. We help carry the financing and business equation around it.
        </p>
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
    <article
      className={['bm-scroll-step', className].filter(Boolean).join(' ')}
      {...stateData(state)}
    >
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
      <BuildModelTestimonial testimonial={station.testimonial} />
    </ScrollStep>
  )
}

function BuildModelTestimonial({
  testimonial,
}: {
  testimonial: {
    quote: string
    author: string
    context: string
  }
}) {
  return (
    <figure className="bm-proof">
      <span className="bm-proof-label">
        <span aria-hidden="true" />
        Client signal
      </span>
      <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <figcaption>
        <strong>{testimonial.author}</strong>
        <span>{testimonial.context}</span>
      </figcaption>
    </figure>
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

        <BuildModelTestimonial testimonial={drawFlowTestimonial} />
      </section>
    </ScrollStep>
  )
}

function ThesisStrip() {
  return (
    <section className="bm-thesis bm-scroll-step" {...stateData(thesisState)}>
      <div className="bm-thesis-inner">
        <div className="bm-ts-label-row">
          <span className="bm-ts-label">Builder Consulting</span>
          <span className="bm-ts-rule" aria-hidden="true" />
        </div>
        <div className="bm-thesis-copy">
          <h3 className="bm-ts-head">Building shouldnt be the easy part</h3>
          <p className="bm-ts-body">
            A successful build is not only a construction problem, it is a business equation.
          </p>
        </div>
        <div
          className="bm-ts-grid"
          aria-label="2019 build equation inputs: single family, land, build cost, exit value, profit"
        >
          {thesisCells.map((cell) => (
            <span className="bm-ts-cell" key={`bm-thesis-cell-${cell}`}>
              {cell}
            </span>
          ))}
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
      id="build-model"
    >
      <BuildModelMotion />

      <div className="bm-scroll-grid">
        <BuildModelBoard className="bm-board-wrap--desktop" />

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

          <DrawFlowStep />

          {stations.map((station) => (
            <StationStep key={`bm-step-${station.id}`} station={station} />
          ))}
        </div>
      </div>

      <ThesisStrip />
    </section>
  )
}
