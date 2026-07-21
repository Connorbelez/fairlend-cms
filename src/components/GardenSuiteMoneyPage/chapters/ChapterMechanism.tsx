import Image from 'next/image'
import Link from 'next/link'

import { CopySection, DossierChapter, EvidenceGate, FileCard, RouteArrow } from '../DossierChapter'

const drawflowLayers = [
  {
    body: 'Convert scope, budget and dependencies into sub-milestones.',
    label: 'Plan',
  },
  {
    body: 'Model parallel work, daily burn, minimum cash on hand, interest exposure and draw timing.',
    label: 'Optimize',
  },
  {
    body: 'Give homeowners, builders, contractors and authorized capital participants a shared workspace.',
    label: 'Operate',
  },
  {
    body: 'Recalculate downstream milestones, cash requirements and draw plans when actual progress differs from plan.',
    label: 'Adapt',
  },
] as const

const engineColumns = [
  {
    body: 'Project scope, plans, budget and contingency · builder/trade sequencing and lead times · material, supplier and deposit requirements · milestone/sub-milestone dependencies · existing equity, facility constraints and minimum cash on hand · actual progress, invoices, evidence and schedule changes.',
    label: 'Inputs',
  },
  {
    body: 'Evidence-backed construction heuristics · static analysis of sub-milestone dependency graphs · AI trained on thousands of Toronto builds for schedule and cost estimation · optimization of parallel execution, daily burn, interest exposure and draw planning.',
    label: 'Analysis',
  },
  {
    body: 'Baseline and current construction schedule · critical/dependent sub-milestones · recommended execution sequence · minimum cash-on-hand requirement · draw amount and timing plan · interest-exposure model · risk, delay and cost-change flags.',
    label: 'Outputs',
  },
] as const

const builderBenefits = [
  'Funding is planned around actual deposits, materials, labour and milestone requirements.',
  'Up to 15 draws reduce the pressure created by a rigid small number of large advances.',
  'The shared plan and evidence requirements reduce ambiguity around the next release.',
  'Adaptive scheduling helps prevent one delayed sub-milestone from jamming the entire build.',
] as const

const homeownerBenefits = [
  'Capital is drawn when the project needs it.',
  'Interest exposure is limited to outstanding funded capital rather than the entire project budget from day one.',
  'DrawFlow tracks daily burn, cash on hand and upcoming obligations.',
  'You can see progress, funding status and next requirements at any time.',
] as const

const comparisonRows = [
  ['Draw dates and balances', 'Evidence required', 'Evidence required'],
  ['Days outstanding by tranche', 'Evidence required', 'Evidence required'],
  ['Interest calculation by tranche', 'Evidence required', 'Evidence required'],
  ['Fees that differ', 'Evidence required', 'Evidence required'],
  ['Minimum working capital required', 'Evidence required', 'Evidence required'],
  ['Total construction-period interest', 'Evidence required', 'Evidence required'],
  ['Difference', '—', '≈ $12,000 saved'],
] as const

export function ChapterMechanism() {
  return (
    <DossierChapter
      chapter="02"
      description="The build becomes a schedule, a capital plan and a controlled release system."
      label="DrawFlow operating model"
      tone="forest"
    >
      <CopySection
        file="SYSTEM / DF-01 — FOUR-LAYER LOOP"
        heading="What DrawFlow is"
        id="section-5"
        intro={
          <p>
            DrawFlow is FairLend&apos;s proprietary software for planning and operating construction
            schedules, project cash flow, evidence and milestone-based funding.
          </p>
        }
      >
        <p>
          It is software FairLend built and runs — not a branded draw procedure. Four connected
          layers run your project:
        </p>
        <div className="gs-build-model">
          <div className="gs-build-model__image">
            <Image
              alt="DrawFlow construction schedule and capital plan arranged over a Garden Suite blueprint"
              fill
              sizes="(min-width: 900px) 42vw, 100vw"
              src="/assets/garden-suite/drawflow-construction-evidence.webp"
            />
          </div>
          <ol>
            {drawflowLayers.map((layer, index) => (
              <li key={layer.label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{layer.label}</strong>
                  <p>{layer.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p>
          Want the deeper product mechanics? See{' '}
          <Link href="/construction-draw-financing">How DrawFlow construction financing works</Link>
          .
        </p>
      </CopySection>

      <CopySection
        file="ENGINE / DF-02 — INPUTS TO OUTPUTS"
        heading="How DrawFlow plans, prices and re-plans the build"
        id="section-6"
        intro={
          <p>
            DrawFlow turns your project&apos;s real inputs into a schedule, a cash plan and a draw
            plan — then keeps recalculating them as the build progresses.
          </p>
        }
      >
        <RouteArrow />
        <div className="gs-engine-grid">
          {engineColumns.map((column) => (
            <FileCard key={column.label}>
              <h4>{column.label}</h4>
              <p>{column.body}</p>
            </FileCard>
          ))}
        </div>
        <p>
          <strong>The continuous loop:</strong> when a milestone moves or a cost changes, DrawFlow
          updates the affected dependency graph and recalculates the schedule and funding plan.
        </p>
        <EvidenceGate owner="DrawFlow product · engineering · data governance">
          The public methodology still requires the approved dataset definition, project count,
          geography, governance, dependency-graph example and one real adaptive before/after plan.
          These are launch-critical evidence items and are not fabricated here.
        </EvidenceGate>
      </CopySection>

      <CopySection
        file="CAPITAL / DF-03 — BUILDER + HOMEOWNER"
        heading="Builders stay funded. You stop paying for idle capital."
        id="section-7"
        intro={
          <p>
            The differentiator is coordinated construction liquidity plus interest efficiency — not
            simply &ldquo;more draws.&rdquo;
          </p>
        }
      >
        <div className="gs-capital-split">
          <FileCard>
            <p className="gs-file-label">For the builder and trades</p>
            <ul>
              {builderBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </FileCard>
          <FileCard>
            <p className="gs-file-label">For the homeowner</p>
            <ul>
              {homeownerBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </FileCard>
        </div>
        <div
          aria-label="Capital steps up as milestone draws are released instead of being advanced all at once"
          className="gs-capital-chart"
          role="img"
        >
          <span>Day-one advance</span>
          <div className="gs-capital-chart__baseline" />
          <span>Milestone capital</span>
          <div className="gs-capital-chart__steps">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </CopySection>

      <CopySection
        file="PROOF / DF-04 — CLAIMS + METHODOLOGY"
        heading="Three claims we publish — and how funds actually move"
        id="section-8"
        intro={
          <p>
            Every DrawFlow facility supports up to 15 borrower-controlled milestone draws, case
            studies demonstrate up to 50% construction-period interest savings, and a worked
            illustration models approximately $12,000 saved.
          </p>
        }
      >
        <div className="gs-claims-grid">
          <div className="gs-lime-slip">
            <span>Claim 01</span>
            <strong>Up to 15</strong>
            <p>borrower-controlled milestone draws.</p>
          </div>
          <div className="gs-lime-slip">
            <span>Claim 02</span>
            <strong>Up to 50%</strong>
            <p>
              construction-period interest savings demonstrated — a maximum, not an average unless
              the case ledger proves otherwise.
            </p>
          </div>
          <div className="gs-lime-slip">
            <span>Claim 03</span>
            <strong>≈ $12,000</strong>
            <p>illustrative construction-period interest saved under published assumptions.</p>
          </div>
        </div>
        <FileCard id="drawflow-claims-methodology">
          <h4>How release works</h4>
          <p>
            FairLend has authority under the lender agreement to review, approve and release funds
            when the milestone, evidence and file conditions are satisfied. The lender does not
            provide ad hoc permission for every release. You or your builder lead draw timing within
            the approved facility and evidence requirements.
          </p>
          <EvidenceGate owner="Legal · product">
            Standard lender-agreement clauses and the approved release workflow require publication
            approval.
          </EvidenceGate>
        </FileCard>
        <div id="case-ledger">
          <h4 className="gs-subhead">Case studies</h4>
          <p>
            Each approved case file will disclose project type and privacy-appropriate location,
            facility size, construction period, baseline and DrawFlow schedules, interest
            assumptions, relevant fees, result, documented liquidity outcome, date range and
            methodology version.
          </p>
          <EvidenceGate owner="Finance · evidence owner">
            Multi-case ledger, case count, comparison baseline, range/distribution, maximum observed
            result, dates and methodology version are required before indexing.
          </EvidenceGate>
        </div>
        <div id="12k-model">
          <h4 className="gs-subhead">The ~$12,000 worked comparison</h4>
          <p>
            Identical project, rate and timeline assumptions in both scenarios — only the draw
            strategy changes.
          </p>
          <div className="gs-table-wrap">
            <table className="gs-table">
              <caption>Construction-period interest comparison</caption>
              <thead>
                <tr>
                  <th scope="col">Line item</th>
                  <th scope="col">Baseline schedule</th>
                  <th scope="col">DrawFlow schedule</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([item, baseline, drawflow]) => (
                  <tr key={item}>
                    <th scope="row">{item}</th>
                    <td>{baseline}</td>
                    <td>{drawflow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <EvidenceGate owner="Finance · product">
            Reproducible model inputs, version, reviewer and review date must replace every evidence
            marker before publication.
          </EvidenceGate>
        </div>
      </CopySection>
    </DossierChapter>
  )
}
