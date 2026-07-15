import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  FileText,
  FileCheck2,
  House,
  Layers3,
  LogOut,
  SlidersHorizontal,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'

import { BuildModelMotion } from './BuildModelMotion.client'
import { BuildSensitivityConsole } from './BuildSensitivityConsole.client'
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
  'Draw schedule',
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
    id: 'recovery',
    label: 'Recovery',
    code: 'RC',
    title: 'Contingency file',
    summary: 'Early drift detection, root-cause diagnosis, and a coordinated recovery path.',
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

const variableDetails = {
  Land: {
    description: 'Lot, form, frontage, and the first buildable-area pass.',
    icon: House,
    presentation: 'ledger',
  },
  Scope: {
    description: 'Housing form: Multiplex + laneway option.',
    icon: Layers3,
    presentation: 'ledger',
  },
  Capital: {
    description: 'First decision: Can the site carry the scope?',
    icon: CircleDollarSign,
    presentation: 'ledger',
  },
  'Draw schedule': {
    description: 'Milestone releases',
    icon: CalendarDays,
    presentation: 'utility',
  },
  'Professional path': {
    description: 'Project team',
    icon: UserRound,
    presentation: 'utility',
  },
  'Permit & MLI readiness': {
    description: 'Approval file',
    icon: FileCheck2,
    presentation: 'utility',
  },
  Exit: {
    description: 'Takeout path',
    icon: LogOut,
    presentation: 'utility',
  },
} as const satisfies Record<
  BuildVariable,
  { description: string; icon: LucideIcon; presentation: 'ledger' | 'utility' }
>

const ledgerVariables = variables.filter(
  (variable) => variableDetails[variable].presentation === 'ledger',
)

const utilityVariables = variables.filter(
  (variable) => variableDetails[variable].presentation === 'utility',
)

type BoardState = {
  id: string
  status: string
  count: string
  title: string
  variables: readonly BuildVariable[]
  dossierTab: DossierTabId
  theme: 'ivory' | 'builder-blueprint' | 'electric-lime' | 'forest' | 'ink'
}

type Station = BoardState & {
  num: string
  name: string
  headline: string
  body: string
  comparison: {
    selfManaged: string
    fairlendLed: string
  }
  note?: string
}

const introState = {
  id: 'intro',
  status: 'Model open',
  count: '03',
  title: 'Property to equity',
  variables: ['Land', 'Scope', 'Capital'],
  dossierTab: 'parcel',
  theme: 'ivory',
} as const satisfies BoardState

const stations = [
  {
    id: 'plan',
    status: '01 / Plan',
    count: '01',
    title: 'Feasibility before commitment',
    variables: ['Land', 'Scope'],
    dossierTab: 'parcel',
    theme: 'electric-lime',
    num: '01',
    name: 'Plan',
    headline: 'Work with FairLend to test whether the site and project economics support a financeable build.',
    body: 'Before you commit more capital to land or design, FairLend works with you to review the acquisition basis, zoning and housing form, unit mix, buildable area, hard and soft costs, contingency, timeline, expected value, and intended exit.',
    comparison: {
      selfManaged:
        'Source and brief a planner, designer, builder or project manager, cost consultant, and permit specialists—then reconcile their advice with the budget, financing, and exit.',
      fairlendLed:
        'Bring us the site or early idea. FairLend helps assemble the required specialists and turns their inputs into one financeable project plan.',
    },
    note: 'Complimentary project review and consulting are available on approved credit (OAC) and file acceptance.',
  },
  {
    id: 'finance',
    status: '02 / Finance',
    count: '02',
    title: 'Capital + interest control',
    variables: ['Capital', 'Draw schedule'],
    dossierTab: 'budget',
    theme: 'forest',
    num: '02',
    name: 'Finance',
    headline:
      'FairLend provides the construction financing and works with you to structure it around your specific build.',
    body: 'Together, we align the land basis, construction budget, borrower equity, working-capital needs, project milestones, and exit. FairLend stages advances around the work, helping keep enough capital available so the build is not squeezed without advancing funds earlier than needed and increasing interest carry.',
    comparison: {
      selfManaged:
        'Find a construction lender, compare structures, and coordinate the appraisal, legal, insurance, budget review, draw requirements, and working-capital plan.',
      fairlendLed:
        'FairLend leads the capital plan, construction financing, diligence, and milestone draw structure through one financing relationship.',
    },
  },
  {
    id: 'support',
    status: '03 / Build support',
    count: '03',
    title: 'Draw schedule that moves with the build',
    variables: ['Capital', 'Draw schedule', 'Professional path'],
    dossierTab: 'draw',
    theme: 'ink',
    num: '03',
    name: 'Build support',
    headline: 'Adjust the draw schedule mid-build as the work and capital requirements change.',
    body: 'Builds do not always follow the original sequence. FairLend works with you to revise the draw schedule as the work shifts, subject to the financing terms, so capital is available when the project needs it without being advanced earlier than necessary and adding avoidable interest carry.',
    comparison: {
      selfManaged:
        'Carry more capital than the current work requires or pause the build while a rigid draw schedule catches up—adding avoidable interest, idle cash, and coordination pressure.',
      fairlendLed:
        'FairLend helps put the right project team around the build, then keeps the draw process, project milestones, and capital plan working from one coordinated file.',
    },
  },
  {
    id: 'takeout',
    status: '04 / Takeout',
    count: '04',
    title: 'CMHC-insured takeout',
    variables: ['Exit', 'Permit & MLI readiness'],
    dossierTab: 'takeout',
    theme: 'ivory',
    num: '04',
    name: 'Takeout',
    headline:
      'FairLend helps you qualify for CMHC-insured takeout and provides the takeout financing itself.',
    body: 'FairLend works with you early to shape the project, documentation, and operating plan toward CMHC-insured takeout eligibility. As completion approaches, we prepare the application together and FairLend provides the takeout financing for eligible projects. MLI Select is one of multiple available CMHC-insured program options.',
    comparison: {
      selfManaged:
        'Leave takeout planning until late in the build and risk discovering eligibility, valuation, occupancy, income, or documentation gaps when the construction loan is nearing maturity.',
      fairlendLed:
        'Plan the takeout requirements early with FairLend, prepare the application together, and pursue eligible CMHC-insured financing with fewer late-stage surprises.',
    },
  },
  {
    id: 'contingency',
    status: '05 / Build recovery',
    count: '05',
    title: 'Recovery path',
    variables: ['Capital', 'Draw schedule', 'Professional path'],
    dossierTab: 'recovery',
    theme: 'builder-blueprint',
    num: '05',
    name: 'Build Recovery Program',
    headline:
      'The Build Recovery Program helps you diagnose what stalled the build and coordinate a recovery plan.',
    body: 'The program reviews schedule, budget, trades, working capital, draw requirements, and documentation with you to identify the root constraints. FairLend then helps coordinate an appropriate recovery path and the resources required to pursue it.',
    comparison: {
      selfManaged:
        'Call the project manager, trades, consultants, quantity surveyor, and lender separately, piece together competing diagnoses, and coordinate a recovery plan while the project is stalled.',
      fairlendLed:
        'Bring the whole problem to one escalation point. FairLend diagnoses the connected schedule, budget, trade, documentation, and capital constraints, then coordinates a prioritized recovery path.',
    },
    note: 'Recovery support is a resource, not a guarantee of completion, timelines, cost control, contractor performance, or full recovery.',
  },
] as const satisfies readonly Station[]

const drawFlowState = {
  id: 'drawflow',
  status: 'Powered by DrawFlow',
  count: '15',
  title: 'Fund work, not wait',
  variables: ['Capital', 'Draw schedule', 'Professional path'],
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
  { id: 'contingency', label: 'Contingency' },
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
      <div className="bm-parcel-art">
        <Image
          alt="Parcel feasibility sketch for a multiplex and laneway housing site"
          className="bm-parcel-art-image"
          height={1024}
          priority
          sizes="(max-width: 768px) 84vw, 360px"
          src="/assets/visual-assets/build-model-parcel-sketch/build-model-parcel-sketch.webp"
          width={1536}
        />
      </div>
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

function DossierRecoveryPlan() {
  const rows = [
    ['Drift signals', 'Monitoring'],
    ['Root cause', 'Diagnosing'],
    ['Recovery path', 'Coordinating'],
    ['Outcome', 'Not guaranteed'],
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
        <span className="bm-dossier-tab-label">{tab.title}</span>
      </div>
      <div className="bm-dossier-tab-body">
        {tab.id === 'parcel' ? null : <p className="bm-dossier-tab-summary">{tab.summary}</p>}
        {tab.id === 'parcel' ? <DossierParcelSketch /> : null}
        {tab.id === 'budget' ? <DossierBudgetSheet /> : null}
        {tab.id === 'permit' ? <DossierPermitMatrix /> : null}
        {tab.id === 'draw' ? <DossierDrawSchedule /> : null}
        {tab.id === 'recovery' ? <DossierRecoveryPlan /> : null}
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
        <BackgroundImageTexture
          className="bm-board-texture"
          opacity={0.18}
          variant="groovepaper"
        />
        <div className="bm-board-inner">
          <div className="bm-board-header">
            <span className="bm-board-authority">Authority file</span>
            <span aria-hidden="true" className="bm-board-status" data-bm-board-status>
              {introState.status}
            </span>
            <span aria-hidden="true" className="bm-board-count" data-bm-board-count>
              {introState.count}
            </span>
          </div>
          <div className="bm-board-visual" aria-hidden="true">
            <div className="bm-board-title">
              <span className="bm-board-active" data-bm-board-title>
                {introState.title}
              </span>
              <span className="bm-board-verified">Verified</span>
            </div>

            <div className="bm-dossier-stack" data-bm-dossier-stack>
              {dossierTabs.map((tab) => (
                <DossierTabCard key={tab.id} tab={tab} />
              ))}
            </div>

            <div className="bm-board-equation">
              <div className="bm-board-chips" aria-label="Core build variables">
                {ledgerVariables.map((variable) => {
                  const detail = variableDetails[variable]
                  const VariableIcon = detail.icon

                  return (
                    <span
                      className="bm-board-chip"
                      data-bm-variable={variable}
                      key={`bm-board-${variable}`}
                    >
                      <span className="bm-board-chip-icon" aria-hidden="true">
                        <VariableIcon />
                      </span>
                      <strong>{variable}</strong>
                      <small>{detail.description}</small>
                    </span>
                  )
                })}
              </div>
              <div className="bm-board-utilities" aria-label="Build file utilities">
                {utilityVariables.map((variable) => {
                  const detail = variableDetails[variable]
                  const VariableIcon = detail.icon

                  return (
                    <span
                      className="bm-board-utility"
                      data-bm-variable={variable}
                      key={`bm-board-${variable}`}
                    >
                      <VariableIcon aria-hidden="true" />
                      <strong>{variable}</strong>
                      <small>{detail.description}</small>
                    </span>
                  )
                })}
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
            data-analytics-build-model-cta=""
            data-analytics-cta-id="build-model-consultation"
            data-analytics-cta-location="build-model-status"
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

function AudiencePaths() {
  return (
    <div className="bm-audience-ledger" aria-label="How FairLend supports different builders">
      <div className="bm-audience-ledger-head" aria-hidden="true">
        <span>Your starting point</span>
        <span>FairLend carries forward</span>
      </div>

      <article className="bm-audience-row bm-audience-row--builders">
        <div className="bm-audience-origin">
          <span className="bm-audience-code" aria-hidden="true">
            01
          </span>
          <div>
            <h3>Already building</h3>
            <p>Keep your focus on the site.</p>
          </div>
        </div>

        <ArrowRight className="bm-audience-route" aria-hidden="true" />

        <div className="bm-audience-scope">
          <span className="bm-audience-scope-label">Capital path</span>
          <p>We offer the financing and help model the business equation around it.</p>
        </div>
      </article>

      <article className="bm-audience-row bm-audience-row--first-time">
        <div className="bm-audience-origin">
          <span className="bm-audience-code" aria-hidden="true">
            02
          </span>
          <div>
            <h3>First-time builder</h3>
            <p>Bring a property and a down payment.</p>
          </div>
        </div>

        <ArrowRight className="bm-audience-route" aria-hidden="true" />

        <div className="bm-audience-scope">
          <span className="bm-audience-scope-label">Full project team</span>
          <p>
            We can refer an experienced builder or project manager and help plan the financing path
            across permits, draw schedules and takeout.
          </p>
        </div>
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
        <div>
          <span className="bm-station-phase">{station.name}</span>
          <h3>{station.headline}</h3>
        </div>
      </div>
      <p className="bm-station-body">{station.body}</p>
      <div className="bm-station-comparison">
        <article className="bm-station-comparison-panel bm-station-comparison-panel--without">
          <span className="bm-station-comparison-label">Without FairLend</span>
          <p>{station.comparison.selfManaged}</p>
        </article>
        <article className="bm-station-comparison-panel bm-station-comparison-panel--with">
          <span className="bm-station-comparison-label">With FairLend</span>
          <p>{station.comparison.fairlendLed}</p>
        </article>
      </div>
      {station.note ? <p className="bm-station-note">{station.note}</p> : null}
    </ScrollStep>
  )
}

function DrawFlowStep() {
  return (
    <ScrollStep state={drawFlowState} className="bm-drawflow-step">
      <section className="bm-drawflow" aria-labelledby="bm-drawflow-title">
        <span className="bm-df-revision" aria-hidden="true">
          <span>FL-LOCREDIT</span>
          <span>REV-01</span>
          <span>05.14.2026</span>
        </span>
        <span className="bm-df-corner-cross" aria-hidden="true" />
        <div className="bm-df-meta">
          <span className="bm-df-label">
            <span className="pip" aria-hidden="true" />
            Powered by DrawFlow
          </span>
          <span className="bm-df-dossier">Technical financing dossier</span>
        </div>
        <h3 className="bm-df-head" id="bm-drawflow-title">
          A milestone <em>line of credit</em> for your build.
        </h3>
        <p className="bm-df-sub">
          More draws. Less interest. <b>Fund the work, not the wait.</b>
        </p>

        <div className="bm-df-milestone-block">
          <span className="bm-df-section-label">Construction milestones</span>
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
                  node === 'Flooring' ? 'bm-milestone--continuation' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={`bm-ms-${node}`}
              >
                {node}
              </span>
            ))}
          </div>
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
          <span className="lbl">
            <strong>Illustrative interest saved</strong>
            <span>over a typical build.</span>
          </span>
          <span className="caveat">
            *Illustrative only.
            <br /> Every project
            <br /> differs.
          </span>
        </div>

        <div className="bm-df-flex">
          <article className="bm-tile">
            <span className="tile-icon" aria-hidden="true">
              <CalendarDays />
            </span>
            <div className="tile-copy">
              <span className="tile-title">
                Your schedule,
                <br /> not ours
              </span>
              <p>
                Build your own draw schedule. Tie releases to the milestones that match how your
                project actually goes up.
              </p>
            </div>
          </article>
          <article className="bm-tile">
            <span className="tile-icon" aria-hidden="true">
              <SlidersHorizontal />
            </span>
            <div className="tile-copy">
              <span className="tile-title">
                Modify it
                <br /> mid-build
              </span>
              <p>
                Builds don&apos;t always go as planned. Adjust the draw schedule as the work shifts so
                capital is there when you need it, and not costing interest when you don&apos;t.
              </p>
            </div>
          </article>
        </div>

        <div className="bm-df-more">
          <span className="tile-icon" aria-hidden="true">
            <FileText />
          </span>
          <div className="tile-copy">
            <b>More than capital.</b>
            <p>
              Complimentary access to our Southern Ontario build specialists and a deep supplier
              &amp; trade network. When a project needs one, we can refer an experienced building
              project manager to work alongside the financing team.
            </p>
          </div>
        </div>

      </section>
    </ScrollStep>
  )
}

function ThesisStrip() {
  return (
    <section className="bm-thesis bm-scroll-step" {...stateData(thesisState)}>
      <BackgroundImageTexture className="bm-thesis-texture" opacity={0.24} variant="groovepaper">
        <div className="bm-thesis-inner">
          <div className="bm-ts-label-row">
            <span className="bm-ts-label">Builder Consulting</span>
            <span className="bm-ts-rule" aria-hidden="true" />
          </div>
          <div className="bm-thesis-copy">
            <h3 className="bm-ts-head">You focus on building. We help model the deal.</h3>
            <p className="bm-ts-body">
              You manage the build, budget, and execution. FairLend helps model and structure the
              financing and business equation around it.
            </p>
          </div>
          <BuildSensitivityConsole />
        </div>
      </BackgroundImageTexture>
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
              Your complete path from site selection to CMHC takeout.
            </h2>
            <p className="bm-lead">
              We bring financing and development expertise together—helping you secure permits, plan
              construction, access trusted contractors and suppliers, keep the build on track, and
              arrange construction and takeout financing.
            </p>

            <VariableRibbon />

            <p className="bm-shared-lead">
              Instead of finding and coordinating every party yourself, bring FairLend the
              property, plan, or early idea. We help assemble the right team and keep the project,
              financing, draws, and takeout moving through one coordinated plan.
            </p>

            <AudiencePaths />

            <div className="bm-cta-row" data-bm-primary-cta>
              <Link
                className="bm-cta"
                data-analytics-build-model-cta=""
                data-analytics-cta-id="build-model-consultation"
                data-analytics-cta-location="build-model-footer"
                href={ctaHref}
              >
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
