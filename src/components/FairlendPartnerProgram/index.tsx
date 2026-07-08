import type { ReactElement } from 'react'
import Image from 'next/image'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from '@/components/ui/timeline'

import { FairlendPartnerConstructionChart } from './FairlendPartnerConstructionChart.client'
import { FairlendPartnerFaq } from './Faq'
import { faqSegments } from './faq-data'
import { HeroLifecycleColumns } from './HeroLifecycleColumns'
import './partner-program.css'

const APPLY_HREF = buildFairlendIntakeHref({
  intent: 'partner-apply',
  source: 'partner-apply-cta',
})
const BRING_PROJECT_HREF = buildFairlendIntakeHref({
  intent: 'partner-project',
  source: 'partner-bring-project-cta',
})
const SCENARIO_HREF = buildFairlendIntakeHref({
  intent: 'partner-scenario',
  source: 'partner-scenario-cta',
})

export function FairlendPartnerHero(): ReactElement {
  return (
    <section
      aria-labelledby="partner-hero-title"
      className="fairlend-partner partner-hero"
      data-fairlend-partner-hero
    >
      <div className="partner-hero__grid">
        <div className="partner-hero__copy">
          <p className="partner-hero__kicker">FairLend Partner Program</p>
          <h1 className="partner-hero__title" id="partner-hero-title">
            From site search to takeout, <em>build with financing in the room.</em>
          </h1>
          <p className="partner-hero__subhead">
            For the professionals clients rely on before a build begins. FairLend helps partners
            find the right site, shape the project strategy, structure the financing, support the
            build, and plan the exit across GTA residential construction.
          </p>

          <div className="partner-hero__cta-row">
            <FairlendBorrowerCta
              href={APPLY_HREF}
              label="Apply to Become a Partner"
              variant="primary"
            />
            <FairlendBorrowerCta
              href={BRING_PROJECT_HREF}
              label="Bring Us a Project"
              variant="secondary"
            />
          </div>

          <div className="partner-hero__broker-strip">
            <span aria-hidden="true" className="partner-hero__broker-strip-mark" />
            <p className="partner-hero__broker-strip-text">
              <strong>Broker partner?</strong> Your client remains your client. FairLend acts as the
              specialist construction financing desk behind the file.
            </p>
          </div>
        </div>
        <HeroLifecycleColumns />
      </div>
    </section>
  )
}

/* ============================================================
   Section 2 — Strategic Problem (fragmentation grid)
   ============================================================ */
const fragmentationCards = [
  { role: 'The agent', text: 'finds sites without knowing the financing equation.' },
  { role: 'The client', text: 'buys land before knowing what the project can support.' },
  { role: 'The architect', text: 'designs beyond the capital structure.' },
  { role: 'The broker', text: 'avoids construction files they’ve never placed.' },
  { role: 'The builder', text: 'starts with draw assumptions that don’t match the build.' },
  { role: 'The consultant', text: 'solves their piece while the capital stack stays unresolved.' },
] as const

export function FairlendPartnerProblem(): ReactElement {
  return (
    <section
      aria-labelledby="partner-problem-title"
      className="fairlend-partner partner-problem"
      data-fairlend-partner-problem
    >
      <div className="partner-section">
        <header className="partner-problem__header">
          <p className="partner-kicker">The Real Enemy</p>
          <h2 className="partner-display" id="partner-problem-title">
            Fragmented build planning is the real enemy.
          </h2>
          <p className="partner-subhead">
            Not just slow banks. The stronger enemy is a project where each professional optimizes
            their piece while the financing equation stays unresolved — until it’s too expensive to
            fix.
          </p>
        </header>

        <div className="partner-problem__grid">
          {fragmentationCards.map((card) => (
            <article className="partner-problem__card" key={card.role}>
              <span className="partner-problem__card-role">{card.role}</span>
              <p className="partner-problem__card-text">{card.text}</p>
            </article>
          ))}
        </div>

        <div className="partner-problem__answer">
          <span className="partner-problem__answer-label">FairLend’s answer</span>
          <p className="partner-problem__answer-text">
            Put construction financing judgment in the room before the project is committed — not
            after.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Section 3 — The Program (horizontal pillar rail)
   ============================================================ */
type Pillar = {
  number: string
  tag: string
  title: string
  body: string
  compliance?: boolean
}

const pillars: readonly Pillar[] = [
  {
    number: '01',
    tag: 'Site & acquisition',
    title: 'Find the site',
    body: 'Location, lot, zoning, acquisition price, project type — before the offer hardens.',
  },
  {
    number: '02',
    tag: 'Build equation',
    title: 'Shape the plan',
    body: 'Build type, unit mix, scope, permit path, and exit logic reconciled with capital.',
  },
  {
    number: '03',
    tag: 'Capital structure',
    title: 'Structure the capital',
    body: 'Private mortgage, bridge, acquisition, construction, and draw structures matched to the real project.',
  },
  // COMPLIANCE: describe DrawFlow as a workflow model, not a guarantee or funded product capability.
  {
    number: '04',
    tag: 'DrawFlow',
    title: 'Plan the draws',
    body: 'Milestone-based draw availability aligned with verified project progress.',
    compliance: true,
  },
  {
    number: '05',
    tag: 'File packaging',
    title: 'Package the file',
    body: 'Documents, budget review, narrative, valuation support — gaps found before they cost time.',
  },
  {
    number: '06',
    tag: 'Execution',
    title: 'Support the build',
    body: 'Milestones, draw workflow, progress review, recovery resources. Engaged after funding, not absent.',
  },
  // COMPLIANCE: "insured takeout where available" — do not imply guaranteed qualification.
  {
    number: '07',
    tag: 'Exit',
    title: 'Plan the exit',
    body: 'Refinance, sale, rental stabilization, or insured takeout where available.',
    compliance: true,
  },
]

export function FairlendPartnerProgram(): ReactElement {
  return (
    <section
      aria-labelledby="partner-program-title"
      className="fairlend-partner partner-program"
      data-fairlend-partner-program
    >
      <div className="partner-section">
        <header className="partner-program__header">
          <div>
            <p className="partner-kicker">The Program</p>
            <h2 className="partner-display" id="partner-program-title">
              Seven ways FairLend works behind your file.
            </h2>
          </div>
          <p className="partner-subhead">
            Not a referral form. An operating relationship. Bring us in when the client is looking
            for a site, shaping a project, preparing a file, arranging capital, or trying to keep a
            build moving — we help build the equation around it.
          </p>
        </header>

        <div className="partner-program__rail" role="list" aria-label="Program pillars">
          {pillars.map((p) => (
            <article className="partner-program__pillar" key={p.number} role="listitem">
              <span className="partner-program__pillar-number">{p.number}</span>
              <span className="partner-program__pillar-tag">{p.tag}</span>
              <h3 className="partner-program__pillar-title">{p.title}</h3>
              <p className="partner-program__pillar-body">{p.body}</p>
              {p.compliance && (
                <span className="partner-program__compliance-flag">Where applicable</span>
              )}
            </article>
          ))}
        </div>
        <p className="partner-microcopy">
          Scroll the rail → &nbsp; Financing is subject to underwriting, documentation, project
          economics, and available capital.
        </p>
      </div>
    </section>
  )
}

/* ============================================================
   Section 4 — Who For (you bring / we add ledger)
   ============================================================ */
type LedgerRow = {
  role: string
  bring: string
  add: string
}

const ledgerRows: readonly LedgerRow[] = [
  {
    role: 'Brokers',
    bring: 'Client relationship, borrower context, file origin.',
    add: 'Specialist construction financing desk, structuring, draw strategy, administration.',
  },
  {
    role: 'Agents',
    bring: 'Buyers, sellers, site pipeline, investor clients.',
    add: 'Financeability logic, acquisition price discipline, financing path.',
  },
  {
    role: 'Architects & planners',
    bring: 'Design vision, zoning-aware concepts, feasibility.',
    add: 'Capital constraints, budget realism, takeout strategy.',
  },
  {
    role: 'Builders & PMs',
    bring: 'Execution plan, real build constraints, trades.',
    add: 'Construction financing, draw planning, working-capital discipline.',
  },
  {
    role: 'Trades, suppliers & advisors',
    bring: 'Early visibility into forming projects.',
    add: 'A referral path to proper structure and execution support.',
  },
]

export function FairlendPartnerWhoFor(): ReactElement {
  return (
    <section
      aria-labelledby="partner-whofor-title"
      className="fairlend-partner partner-whofor"
      data-fairlend-partner-whofor
    >
      <div className="partner-section">
        <header className="partner-whofor__header">
          <p className="partner-kicker">Who It’s For</p>
          <h2 className="partner-display" id="partner-whofor-title">
            The partnership, stated plainly.
          </h2>
          <p className="partner-subhead">
            Built for the people clients turn to before and during a residential construction
            project — brokers, agents, architects, designers, planners, engineers, builders, project
            managers, cost consultants, specialists, trades, suppliers, and professional advisors.
          </p>
        </header>

        <div className="partner-ledger">
          <div className="partner-ledger__head" aria-hidden="true">
            <span className="partner-ledger__head-label">Role</span>
            <span className="partner-ledger__head-label">What you bring</span>
            <span className="partner-ledger__head-label partner-ledger__head-label--accent">
              What FairLend adds
            </span>
          </div>
          {ledgerRows.map((row) => (
            <div className="partner-ledger__row" key={row.role}>
              <h3 className="partner-ledger__role">{row.role}</h3>
              <p className="partner-ledger__cell" data-mobile-label="You bring">
                {row.bring}
              </p>
              <p
                className="partner-ledger__cell partner-ledger__cell--ink"
                data-mobile-label="We add"
              >
                {row.add}
              </p>
            </div>
          ))}
        </div>

        <p className="partner-ledger__closer">
          No one is asked to become a construction financing expert. That’s the point of the
          program.
        </p>
      </div>
    </section>
  )
}

/* ============================================================
   Section 5 — End-to-End Lifecycle (vertical, scroll choreography)
   ============================================================ */
type Station = {
  number: string
  title: string
  body: string
  compliance?: boolean
}

const lifecycleStations: readonly Station[] = [
  {
    number: '1',
    title: 'Find the site',
    body: 'Location, lot, zoning, acquisition price, project type — and whether the site can support the intended outcome.',
  },
  // COMPLIANCE: "MLI Select readiness where applicable" — never imply guaranteed qualification.
  {
    number: '2',
    title: 'Shape the plan',
    body: 'Build type, unit mix, design scope, rental or sale strategy, permit path, and MLI Select readiness where applicable.',
    compliance: true,
  },
  {
    number: '3',
    title: 'Build the equation',
    body: 'Pressure-test land cost, construction budget, soft costs, contingency, working capital, draw timing, financing costs, and projected takeout.',
  },
  {
    number: '4',
    title: 'Structure the financing',
    body: 'Private mortgage, bridge, acquisition, construction, draw, and takeout structures where appropriate.',
  },
  {
    number: '5',
    title: 'Support the build',
    body: 'Draw planning, documentation, milestone review, site visibility, and recovery resources where needed.',
  },
  // COMPLIANCE: insured takeout "where available" — subject to program eligibility and underwriting.
  {
    number: '6',
    title: 'Plan the exit',
    body: 'Refinance, sale, rental stabilization, or CMHC-insured takeout where available.',
    compliance: true,
  },
]

export function FairlendPartnerLifecycle(): ReactElement {
  return (
    <section
      aria-labelledby="partner-lifecycle-title"
      className="fairlend-partner partner-lifecycle"
      data-fairlend-partner-lifecycle
    >
      <div className="partner-section">
        <header className="partner-lifecycle__header">
          <p className="partner-kicker">End-to-End Support</p>
          <h2 className="partner-display" id="partner-lifecycle-title">
            From site search to takeout, FairLend helps structure the project around reality.
          </h2>
          <p className="partner-lifecycle__lede">
            The work is not a late-stage approval opinion. It is a sequence of financing decisions
            made early enough to change the project.
          </p>
        </header>

        <div className="partner-lifecycle__grid">
          <div className="partner-lifecycle__sticky">
            <p className="partner-lifecycle__map-label">Operating sequence</p>
            <p className="partner-lifecycle__map-copy">
              Site logic, project scope, capital stack, draw rhythm, execution support, and exit
              path stay connected instead of being solved in isolation.
            </p>

            <div className="partner-lifecycle__closer">
              <p className="partner-lifecycle__closer-label">Why it matters</p>
              <p className="partner-lifecycle__closer-text">
                The value is helping design the path that makes the project financeable, executable,
                and exit-ready.
              </p>
            </div>
          </div>

          <Timeline
            activeIndex={5}
            aria-label="FairLend end-to-end lifecycle"
            className="partner-lifecycle__rail"
            role="list"
          >
            {lifecycleStations.map((s) => (
              <TimelineItem className="partner-lifecycle__station" key={s.number} role="listitem">
                <TimelineDot className="partner-lifecycle__station-dot">
                  <span>{s.number.padStart(2, '0')}</span>
                </TimelineDot>
                <TimelineConnector className="partner-lifecycle__station-connector" />
                <TimelineContent className="partner-lifecycle__station-content">
                  <TimelineHeader className="partner-lifecycle__station-header">
                    <span className="partner-lifecycle__station-phase">Phase {s.number}</span>
                    <TimelineTitle className="partner-lifecycle__station-title">
                      {s.title}
                      {s.compliance && (
                        <span
                          aria-label="where applicable"
                          className="partner-program__compliance-flag"
                        >
                          Where applicable
                        </span>
                      )}
                    </TimelineTitle>
                  </TimelineHeader>
                  <TimelineDescription asChild>
                    <p className="partner-lifecycle__station-body">{s.body}</p>
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Section 6 — Broker module (your relationship / our desk)
   ============================================================ */
const brokerUseCases = [
  'A private mortgage file that needs responsible structuring.',
  'A borrower exploring a garden suite, laneway, multiplex, infill, renovation, or conversion.',
  'A client looking for land or comparing sites.',
  'A construction file that’s promising but disorganized.',
  'A project with incomplete documentation.',
  'A file with uncertain budget, draw, or takeout assumptions.',
  // COMPLIANCE: never imply guaranteed MLI Select qualification.
  'A potential MLI Select–oriented project that needs early planning. [COMPLIANCE]',
] as const

export function FairlendPartnerBroker(): ReactElement {
  return (
    <section
      aria-labelledby="partner-broker-title"
      className="fairlend-partner partner-broker"
      data-fairlend-partner-broker
    >
      <div className="partner-section">
        <div className="partner-broker__grid">
          <div>
            <p className="partner-kicker partner-kicker--lime">For Mortgage Brokers</p>
            <h2 className="partner-display" id="partner-broker-title">
              Keep the client. Add the specialist desk.
            </h2>
            <p className="partner-subhead">
              Construction financing is not just another rate quote. It involves land value, build
              scope, permits, budget, draw timing, working capital, appraisals, documentation, and
              exit strategy. You remain the client’s broker. FairLend supports the file.
            </p>

            <ul className="partner-broker__use-cases">
              {brokerUseCases.map((uc) => (
                <li className="partner-broker__use-case" key={uc}>
                  {uc}
                </li>
              ))}
            </ul>

            <div className="partner-cta-row">
              <FairlendBorrowerCta
                href={SCENARIO_HREF}
                label="Talk Through a Client Scenario"
                variant="primary"
                size="md"
              />
            </div>
            <p className="partner-microcopy">
              Roles, communication flow, and compensation where applicable are clarified during
              onboarding.
            </p>
          </div>

          <div className="partner-broker__diagram" aria-hidden="true">
            <div className="partner-broker__layer partner-broker__layer--top">
              <span className="partner-broker__layer-tag">Yours</span>
              <h3 className="partner-broker__layer-title">Your client relationship</h3>
              <p className="partner-broker__layer-body">
                The trust, the borrower context, the advice relationship. Always yours.
              </p>
            </div>
            <span className="partner-broker__bracket">supports, never replaces</span>
            <div className="partner-broker__layer partner-broker__layer--bottom">
              <span className="partner-broker__layer-tag">FairLend</span>
              <h3 className="partner-broker__layer-title">
                Specialist construction financing desk
              </h3>
              <p className="partner-broker__layer-body">
                Structuring · private placement · draw planning · administration · execution
                support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Section 7 — Real-estate (dark offer-clock band)
   ============================================================ */
export function FairlendPartnerRealEstate(): ReactElement {
  return (
    <section
      aria-labelledby="partner-realestate-title"
      className="fairlend-partner partner-realestate"
      data-fairlend-partner-realestate
    >
      <div className="partner-realestate__inner">
        <div>
          <p className="partner-kicker">For Real-Estate & Acquisition Partners</p>
          <h2 className="partner-display" id="partner-realestate-title">
            An accepted offer is the most expensive decision in the project.{' '}
            <span className="partner-realestate__underline">
              Make it with the financing in the room.
            </span>
          </h2>
          <p className="partner-realestate__body">
            Once the land closes, the acquisition price is locked into every downstream number —
            budget, capital stack, rental math, exit. FairLend helps your client test the equation
            while it can still be walked away from.
          </p>
          <div className="partner-cta-row">
            <FairlendBorrowerCta
              href={BRING_PROJECT_HREF}
              label="Bring Us a Project"
              variant="primary"
            />
          </div>
          <p className="partner-realestate__clock-microcopy">
            Early strategy conversations are part of the program. No file required yet.
          </p>
        </div>

        <aside className="partner-realestate__clock" aria-label="The irreversibility window">
          <span className="partner-realestate__clock-label">Before the offer</span>
          <p className="partner-realestate__clock-statement">
            The wrong land price can destroy the project before design or financing begins.
          </p>
        </aside>
      </div>
    </section>
  )
}

/* ============================================================
   Section 8 — Design (drafting-sheet overlay)
   ============================================================ */
const designAnnotations = [
  {
    number: '01',
    term: 'Unit mix',
    body: 'Affects rental income, valuation, and MLI Select readiness. [COMPLIANCE]',
  },
  {
    number: '02',
    term: 'Scope & spec',
    body: 'Sets the budget the capital stack must carry — and the draw rhythm that follows.',
  },
  {
    number: '03',
    term: 'Permit path',
    body: 'Drives timing, carrying costs, and draw structure. Discovered late, it re-prices the file.',
  },
] as const

export function FairlendPartnerDesign(): ReactElement {
  return (
    <section
      aria-labelledby="partner-design-title"
      className="fairlend-partner partner-design"
      data-fairlend-partner-design
    >
      <div className="partner-section">
        <div className="partner-design__sheet">
          <div className="partner-design__title-block">
            <span>Sheet</span>
            <strong>01 / Partner</strong>
            <span>Scale</span>
            <strong>NTS</strong>
            <span>Revision</span>
            <strong>—</strong>
          </div>

          <div className="partner-design__grid">
            <div>
              <p className="partner-kicker partner-kicker--lime">
                For Architects, Planners & Technical Consultants
              </p>
              <h2 className="partner-heading" id="partner-design-title">
                Design with the capital structure in view.
              </h2>
              <p className="partner-subhead">
                Great design still needs a financing path. FairLend works with architects, planners,
                engineers, energy and accessibility consultants, cost consultants, and project teams
                to align project ambition with budget, capital, draw timing, regulatory path, and
                exit strategy.
              </p>

              <div className="partner-design__annotations">
                {designAnnotations.map((a) => (
                  <div className="partner-design__annotation" key={a.number}>
                    <span className="partner-design__annotation-number">{a.number}</span>
                    <p className="partner-design__annotation-text">
                      <strong>{a.term}</strong>
                      {a.body}
                    </p>
                  </div>
                ))}
              </div>

              <p className="partner-keyline" style={{ marginTop: '24px' }}>
                The earlier financing logic enters the design conversation, the fewer expensive
                reversals the client faces later.
              </p>
            </div>

            <div className="partner-design__plan" aria-hidden="true">
              <Image
                alt=""
                className="partner-design__plan-image"
                height={805}
                sizes="(max-width: 1024px) 100vw, 50vw"
                src="/assets/partners/partner-design-blueprint-plate.webp"
                width={1120}
              />
              <div className="partner-design__plan-card partner-design__plan-card--budget">
                <span>Budget fit</span>
                <strong>Early</strong>
              </div>
              <div className="partner-design__plan-card partner-design__plan-card--exit">
                <span>Exit path</span>
                <strong>Mapped</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Section 9 — Construction (draw-rhythm chart)
   ============================================================ */
const constructionCapabilities = [
  'Draw planning',
  'Milestone review',
  'Budget and working-capital pressure testing',
  'Contractor and documentation readiness review',
  'Site and progress visibility',
  'Recovery support where needed',
  'Introductions to experienced trades and professionals where appropriate',
] as const

export function FairlendPartnerConstruction(): ReactElement {
  return (
    <section
      aria-labelledby="partner-construction-title"
      className="fairlend-partner partner-construction"
      data-fairlend-partner-construction
    >
      <div className="partner-section">
        <header>
          <p className="partner-kicker partner-kicker--lime">For Builders, GCs & Project Teams</p>
          <h2 className="partner-display" id="partner-construction-title">
            Capital only helps if the draw plan matches the build.
          </h2>
          <p className="partner-subhead">
            Construction files fail when the financing treats the project like a completed-property
            mortgage. FairLend helps align financing with milestones, documentation, working
            capital, site progress, and trade payment realities.
          </p>
        </header>

        <FairlendPartnerConstructionChart />

        {/* COMPLIANCE: describe DrawFlow as a workflow model, not a guarantee. */}
        <p className="partner-keyline">
          FairLend’s DrawFlow model is designed around milestone-based draw availability — aligning
          capital with verified project progress rather than forcing every build into a rigid preset
          calendar.{' '}
          <span className="partner-microcopy" style={{ display: 'inline', marginLeft: '6px' }}>
            [Workflow model, not a guarantee of availability or timing.]
          </span>
        </p>

        <div className="partner-construction__capabilities">
          {constructionCapabilities.map((cap) => (
            <div className="partner-construction__capability" key={cap}>
              {cap}
            </div>
          ))}
        </div>
        <p className="partner-microcopy" style={{ marginTop: '20px' }}>
          Support is designed to help projects stay on plan; it does not guarantee completion,
          timelines, or cost control.
        </p>
      </div>
    </section>
  )
}

/* ============================================================
   Section 10 — How it works (two-phase stepper)
   ============================================================ */
type Step = { number: string; name: string; body: string }

const joiningSteps: readonly Step[] = [
  {
    number: '01',
    name: 'Apply',
    body: 'Tell us who you work with, what projects you see, and where FairLend can support your clients.',
  },
  {
    number: '02',
    name: 'Onboard',
    body: 'We clarify fit, process, role boundaries, project types, documentation, compensation where applicable, and communication.',
  },
]

const workingSteps: readonly Step[] = [
  {
    number: '03',
    name: 'Bring us in early',
    body: 'Introduce FairLend when there’s a client, site, design concept, build plan, or financing question.',
  },
  {
    number: '04',
    name: 'Build the equation',
    body: 'We help map site, scope, budget, financing, draws, working capital, takeout, and execution risks.',
  },
  {
    number: '05',
    name: 'Move the file forward',
    body: 'If the project is viable and underwriting supports it, FairLend helps structure and support the financing path.',
  },
  {
    number: '06',
    name: 'Stay aligned',
    body: 'Partners stay informed according to role, licensing, privacy, and client-consent requirements.',
  },
]

export function FairlendPartnerHowItWorks(): ReactElement {
  return (
    <section
      aria-labelledby="partner-how-title"
      className="fairlend-partner partner-how"
      data-fairlend-partner-how
    >
      <div className="partner-section">
        <header>
          <p className="partner-kicker">How Partnership Works</p>
          <h2 className="partner-display" id="partner-how-title">
            A short onboarding. A relationship after that.
          </h2>
          <p className="partner-subhead">
            Onboarding is a practical orientation — project types, financing criteria,
            documentation, role boundaries, and how we communicate. After that, you bring
            situations; we bring structure.
          </p>
        </header>

        <div className="partner-how__phases">
          <div className="partner-how__phase partner-how__phase--joining">
            <p className="partner-how__phase-label">Joining</p>
            <div className="partner-how__steps">
              {joiningSteps.map((s) => (
                <article className="partner-how__step" key={s.number}>
                  <span className="partner-how__step-number">{s.number}</span>
                  <h3 className="partner-how__step-name">{s.name}</h3>
                  <p className="partner-how__step-body">{s.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="partner-how__phase partner-how__phase--working">
            <p className="partner-how__phase-label">Working together</p>
            <div className="partner-how__steps">
              {workingSteps.map((s) => (
                <article className="partner-how__step" key={s.number}>
                  <span className="partner-how__step-number">{s.number}</span>
                  <h3 className="partner-how__step-name">{s.name}</h3>
                  <p className="partner-how__step-body">{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="partner-cta-row">
          <FairlendBorrowerCta
            href={APPLY_HREF}
            label="Apply to Become a Partner"
            variant="primary"
          />
          <span className="partner-microcopy" style={{ margin: 0 }}>
            No volume commitments. Bring the files that fit.
          </span>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Section 11 — Project types (type specimen wall)
   ============================================================ */
const projectTypes = [
  'Multiplexes',
  'Garden suites',
  'Laneway suites',
  'Infill builds',
  'Single-family',
  'Renovations',
  'Conversions',
  'Rental',
  'Purpose-built rental',
  'MLI Select-oriented*',
  'Private mortgage & construction',
] as const

export function FairlendPartnerProjectTypes(): ReactElement {
  return (
    <section
      aria-labelledby="partner-types-title"
      className="fairlend-partner partner-types"
      data-fairlend-partner-types
    >
      <div className="partner-section">
        <header className="partner-types__header">
          <p className="partner-kicker">Project Types</p>
          <h2 className="partner-display" id="partner-types-title">
            Built for complex residential construction and private mortgage scenarios.
          </h2>
        </header>

        <div className="partner-types__wall" aria-label="Project types FairLend supports">
          {projectTypes.map((t, i) => (
            <p
              className={`partner-types__type${i === 8 ? ' partner-types__type--accent' : ''}`}
              key={t}
            >
              {t}
            </p>
          ))}
        </div>

        {/* COMPLIANCE: MLI Select "where applicable" — never imply guaranteed qualification. */}
        <p className="partner-types__qualifier">
          *MLI Select–oriented projects supported where applicable. Qualification is not guaranteed
          and is subject to CMHC eligibility and underwriting. FairLend is most useful when the
          project can’t be solved by a simple rate quote — land, zoning, design, budget, working
          capital, appraisal, permits, draws, and exit all have to fit together.
        </p>
      </div>
    </section>
  )
}

/* ============================================================
   Section 12 — Credibility (one operating layer stack)
   ============================================================ */
const credibilityLayers = [
  { tag: '01', name: 'Mortgage brokerage & administration' },
  { tag: '02', name: 'Private mortgage placement & structuring' },
  { tag: '03', name: 'Construction financing specialization' },
  // COMPLIANCE: DrawFlow described as a workflow model only.
  { tag: '04', name: 'DrawFlow milestone-based draws' },
  { tag: '05', name: 'Build planning & execution support' },
  { tag: '06', name: 'Specialist legal & recovery resources' },
] as const

export function FairlendPartnerCredibility(): ReactElement {
  return (
    <section
      aria-labelledby="partner-credibility-title"
      className="fairlend-partner partner-credibility"
      data-fairlend-partner-credibility
    >
      <div className="partner-section">
        <div className="partner-credibility__grid">
          <div>
            <p className="partner-kicker">Why Trust Us</p>
            <h2 className="partner-display" id="partner-credibility-title">
              Most of these capabilities exist somewhere. Rarely in one place.
            </h2>
            {/* COMPLIANCE: $2B+ and "nearly three decades" must be substantiated before publishing. */}
            <p className="partner-credibility__body">
              FairLend combines mortgage brokerage, private lending, construction financing,
              mortgage administration, draw planning, build support, and local GTA market judgment —
              led by <strong>Elie Soberano</strong>, with <strong>nearly three decades</strong> in
              mortgage brokerage and <strong>more than $2B funded</strong> [COMPLIANCE], supported
              by a team spanning technology, operations, construction, appraisal, legal, and
              recovery.
            </p>
            <p className="partner-credibility__footnote">
              Human-led judgment, AI-assisted workflow. Technology supports underwriting; people
              make the calls.
            </p>
          </div>

          <div className="partner-credibility__stack" aria-label="FairLend operating layers">
            <div className="partner-credibility__layers">
              {credibilityLayers.map((l) => (
                <div className="partner-credibility__layer" key={l.tag}>
                  <span>{l.name}</span>
                  <span className="partner-credibility__layer-tag">{l.tag}</span>
                </div>
              ))}
            </div>
            <div className="partner-credibility__stack-bracket" aria-hidden="true" />
            <span className="partner-credibility__stack-bracket-label">
              One team behind your file
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Section 13 — FAQ (delegated to client component for tab/accordion state)
   ============================================================ */
export function FairlendPartnerFaqWrapper(): ReactElement {
  return <FairlendPartnerFaq segments={faqSegments} />
}

/* ============================================================
   Section 14 — Final CTA (full-bleed closing)
   ============================================================ */
export function FairlendPartnerFinalCta(): ReactElement {
  return (
    <section
      aria-labelledby="partner-final-title"
      className="fairlend-partner partner-final"
      data-fairlend-partner-final
    >
      <div className="partner-final__inner">
        <p className="partner-final__kicker">Before It Hardens</p>
        <h2 className="partner-final__title" id="partner-final-title">
          Bring FairLend in before the project is locked.
        </h2>
        <p className="partner-final__body">
          Whether your client is looking for land, planning a garden suite, designing a multiplex,
          arranging construction financing, or trying to keep a build moving — FairLend can help
          shape the financing and execution path around the real project.
        </p>
        <div className="partner-final__cta-row" id="apply">
          <FairlendBorrowerCta
            href={APPLY_HREF}
            label="Apply to Become a Partner"
            variant="primary"
          />
          <FairlendBorrowerCta
            href={BRING_PROJECT_HREF}
            id="bring-a-project"
            label="Bring Us a Project"
            variant="secondary"
          />
        </div>
        <p className="partner-final__microcopy" id="talk-scenario">
          Broker partner? Keep the client relationship. Add the specialist desk.
        </p>
      </div>
    </section>
  )
}
