import type { CSSProperties } from 'react'
import Link from 'next/link'

import { CopySection, DossierChapter, EvidenceGate, FileCard, RouteArrow } from '../DossierChapter'

const strongSignals = [
  'You control a Toronto/GTA property suitable for assessment.',
  'You have a clear occupancy or rental goal.',
  'You have some combination of equity, income, liquidity or project capital.',
  'You want financing and construction cash flow planned together.',
  'You need help assembling or coordinating the project team.',
  'You want a defined milestone/evidence process rather than improvised funding requests.',
] as const

const worthAssessing = [
  'No builder has been selected.',
  'Plans or permits are not complete.',
  'The budget needs professional validation.',
  'Projected rent or takeout qualification is uncertain.',
  'Construction has started but the draw structure is failing.',
] as const

const financingRoutes = [
  [
    'Cash/existing liquidity',
    'Small gap or early costs',
    'Immediate',
    'No loan interest',
    'Liquidity and reserves',
    'Concentrates homeowner capital',
  ],
  [
    'HELOC',
    'Available revolving equity',
    'Flexible',
    'On used balance',
    'Equity, income, lender limit',
    'Limit/rate may not fit full build',
  ],
  [
    'Refinance',
    'Sufficient equity and supportable mortgage',
    'Upfront',
    'Often on full funded balance',
    'Property, income, appraisal',
    'Break costs and premature borrowing',
  ],
  [
    'Second mortgage',
    'Gap or speed-sensitive capital',
    'Usually upfront',
    'On advanced balance',
    'Equity and exit',
    'Higher carrying cost/fees may apply',
  ],
  [
    'Government programs (verify current status)',
    'Eligible projects where a current program applies',
    'Program-defined',
    'Program-defined',
    'Program eligibility and documentation',
    'Availability, terms and eligibility change; never assume qualification',
  ],
  [
    'DrawFlow construction financing',
    'Staged project with verifiable milestones',
    'Up to 15 borrower-controlled draws',
    'On released capital',
    'Budget, team, progress and evidence',
    'Setup and evidence workflow take longer than a simple upfront advance; best suited to staged builds, not small funding gaps',
  ],
] as const

const capitalItems = [
  'Design, consultants and permits',
  'Site preparation, servicing, access and trees',
  'Hard construction costs',
  'Builder, trade and supplier deposits',
  'Contingency and change orders',
  'Fees and construction-period interest',
  'Insurance, appraisal and professional costs',
  'Completion, lease-up and takeout costs',
] as const

const lenderViews = [
  ['Property', 'Ownership, existing mortgage, value/equity and title.'],
  ['Borrower', 'Income, credit, liquidity, obligations and experience/support.'],
  ['Project', 'Scope, Garden/Laneway type, plans, permits, budget, contingency and team.'],
  ['Construction', 'Sequencing, contracts/quotes, draw schedule, inspections and evidence.'],
  ['Exit', 'Completed value, rent support, debt service, sale/retention plan and takeout.'],
] as const

const takeoutItems = [
  'How as-is and as-complete value may enter the analysis.',
  'What rental evidence an appraiser or lender may request.',
  'Why projected rent is not automatically qualifying income.',
  'Why takeout qualification is modelled before construction begins.',
] as const

function FitList({ items, title }: { items: readonly string[]; title: string }) {
  return (
    <fieldset className="gs-fit-list">
      <legend>{title}</legend>
      {items.map((item) => (
        <label key={item}>
          <input type="checkbox" />
          <span aria-hidden="true" />
          {item}
        </label>
      ))}
    </fieldset>
  )
}

export function ChapterDecision() {
  return (
    <DossierChapter
      chapter="04"
      description="Judge the fit, compare the capital routes and plan the mortgage after construction."
      label="Assess + compare"
      tone="lime"
    >
      <CopySection
        file="FIT / GS-06 — SELF-ORIENTATION"
        heading="Check your own starting position"
        id="section-12"
        intro={<p>This checklist is a self-orientation tool, not an approval promise.</p>}
      >
        <div className="gs-fit-grid">
          <FitList items={strongSignals} title="Strong starting signals" />
          <FitList items={worthAssessing} title="Still worth assessing" />
        </div>
        <p className="gs-fit-note">
          No builder or permits yet? That is still a valid starting point.
        </p>
        <a className="gs-cta-link gs-cta-link--primary" href="#garden-suite-assessment">
          Plan My Garden Suite Project
        </a>
      </CopySection>

      <CopySection
        file="RATE SHEET / GS-07 — SIX ROUTES"
        heading="Six ways to fund the same project, compared honestly"
        id="section-13"
        intro={
          <p>
            There is no universally superior route — the comparison below uses one project scenario
            and consistent assumptions, and your assessment may combine routes.
          </p>
        }
      >
        <div className="gs-table-wrap">
          <table className="gs-table">
            <caption>Garden Suite project funding routes</caption>
            <thead>
              <tr>
                <th scope="col">Route</th>
                <th scope="col">Best fit</th>
                <th scope="col">Capital timing</th>
                <th scope="col">Interest exposure</th>
                <th scope="col">Typical evidence focus</th>
                <th scope="col">Key limitation</th>
              </tr>
            </thead>
            <tbody>
              {financingRoutes.map((row, index) => (
                <tr
                  data-highlight={index === financingRoutes.length - 1 ? '' : undefined}
                  key={row[0]}
                >
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th key={cell} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={cell}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Program status changes; for current federal and Toronto incentive status, see the dated
          coverage in{' '}
          <Link href="/garden-suite-financing-gta#garden-suite-faq-budget">
            Toronto Garden Suite costs and feasibility
          </Link>
          . For projects beyond a Garden or Laneway Suite,{' '}
          <Link href="/construction-financing">compare broader construction-financing options</Link>
          .
        </p>
      </CopySection>

      <CopySection
        file="CAPITAL / GS-08 — COST + UNDERWRITING"
        heading="What the project costs, and what lenders actually look at"
        id="section-14"
        intro={
          <p>
            Toronto Garden Suites commonly run $300K–$400K+ all-in depending on size, site and
            finishes.
          </p>
        }
      >
        <div className="gs-lime-slip">
          <span>Cost anchor · reviewed July 20, 2026</span>
          <strong>$300K–$400K+</strong>
          <p>
            Corpus benchmark. City permit records report a ~$260K average and ~$180K median, with
            known underreporting.
          </p>
          <Link href="/garden-suite-financing-gta#garden-suite-faq-budget">
            Review the full cost model and assumptions →
          </Link>
        </div>
        <p>Your financing requirement is the whole capital stack, not just the build quote:</p>
        <ol className="gs-capital-stack">
          {capitalItems.map((item, index) => (
            <li style={{ '--stack-index': index + 1 } as CSSProperties} key={item}>
              {item}
            </li>
          ))}
        </ol>
        <h4 className="gs-subhead">Lenders assess five views of the same project</h4>
        <div className="gs-lender-views">
          {lenderViews.map(([label, description], index) => (
            <FileCard key={label}>
              <span>0{index + 1}</span>
              <h4>{label}</h4>
              <p>{description}</p>
            </FileCard>
          ))}
        </div>
      </CopySection>

      <CopySection
        className="gs-takeout-section"
        file="EXIT / GS-09 — PLAN BACKWARDS"
        heading="Plan the mortgage you'll hold after the build — before the build"
        id="section-15"
        intro={
          <p>
            Takeout qualification must be modelled before construction begins, not discovered after
            completion.
          </p>
        }
      >
        <div className="gs-takeout-route">
          <span>Takeout mortgage</span>
          <RouteArrow reverse />
          <span>Before construction begins</span>
        </div>
        <ul>
          {takeoutItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            When <Link href="/resources/cmhc-multiplex">CMHC-insured financing options</Link> may be
            investigated, and which eligibility and qualification inputs are time-sensitive.
          </li>
        </ul>
        <EvidenceGate owner="Mortgage · compliance">
          Current official CMHC program sources and a visible last-reviewed date require approval.
          FairLend plans for qualification; it does not control municipal approval, appraisal
          conclusions, lender approval or CMHC eligibility decisions.
        </EvidenceGate>
      </CopySection>

      <CopySection
        file="SITE / GS-10 — GARDEN VS LANEWAY"
        heading="Laneway Suite financing in Toronto"
        id="section-16"
        intro={
          <p>
            Laneway Suite financing uses many of the same routes as Garden Suite financing, but the
            project facts differ — and lenders review project facts.
          </p>
        }
      >
        <div className="gs-lot-diagrams">
          <figure>
            <div className="gs-lot gs-lot--garden" aria-hidden="true">
              <span>Main home</span>
              <strong>Garden Suite</strong>
              <i>Street</i>
            </div>
            <figcaption>
              A Garden Suite is a detached ancillary dwelling on the same lot as the principal
              residence; it is not defined by public-lane access.
            </figcaption>
          </figure>
          <figure>
            <div className="gs-lot gs-lot--laneway" aria-hidden="true">
              <span>Main home</span>
              <strong>Laneway Suite</strong>
              <i>Public lane</i>
            </div>
            <figcaption>
              A Laneway Suite depends on the lane relationship and its planning and access
              requirements.
            </figcaption>
          </figure>
        </div>
        <ul>
          <li>
            Access, servicing, construction staging and appraisal context may change the budget and
            financing plan.
          </li>
          <li>
            The financing method may overlap, but the project evidence and site constraints can
            differ.
          </li>
        </ul>
        <p>
          For current municipality-specific rules, use the official-source navigator in{' '}
          <Link href="/garden-suite-financing-gta#garden-suite-faq-budget">
            Toronto Garden Suite costs and feasibility
          </Link>{' '}
          rather than any paraphrased zoning summary here.
        </p>
      </CopySection>
    </DossierChapter>
  )
}
