import { CopySection, DossierChapter, FileCard } from '../DossierChapter'

const readinessGroups = [
  ['Property', 'Title, existing mortgage statements and property details.'],
  ['Borrower', 'Income, credit, liquidity and obligations.'],
  ['Plans and permits', 'Drawings, permit status and professional reports.'],
  ['Budget', 'Line items, contingency, contracts, quotes and deposits.'],
  ['Team', 'Builder, contractor, trade and supplier commitments.'],
  ['DrawFlow', 'Schedule and milestone evidence.'],
  ['Insurance and site', 'Coverage and site documentation.'],
  ['Appraisal and rent', 'Value and rental evidence.'],
  ['Completion', 'Takeout plan and end-state financing.'],
] as const

const failureModes = [
  'Insufficient equity or working capital.',
  'An incomplete budget or missing contingency.',
  'Builder/trade deposits that do not align with lender draws.',
  'Access, servicing, tree or permit uncertainty.',
  'Unsupported cost, rent or value assumptions.',
  'A lender/product mismatch.',
  'Draw evidence that is incomplete or late.',
  'A dependency delay that blocks downstream trades.',
  'Cost overruns or change orders.',
  'No viable completion/takeout path.',
] as const

export function ChapterReadiness() {
  return (
    <DossierChapter
      chapter="05"
      description="Prepare the evidence file—or surface the reason a live project is stuck."
      label="Prepare + rescue"
      tone="ink"
    >
      <CopySection
        file="CHECKLIST / GS-11 — FILE READINESS"
        heading="What to gather — grouped so you can start anywhere"
        id="section-17"
        intro={
          <p>
            You do not need everything before talking to FairLend; the checklist shows what a
            complete file eventually contains.
          </p>
        }
      >
        <div className="gs-readiness">
          {readinessGroups.map(([label, body], index) => (
            <details key={label} open={index === 0}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {label}
              </summary>
              <p>{body}</p>
            </details>
          ))}
        </div>
        <a
          className="gs-cta-link"
          download
          href="/downloads/fairlend-garden-suite-readiness-checklist.txt"
        >
          Download the readiness checklist
        </a>
      </CopySection>

      <CopySection
        file="URGENT / GS-12 — PROJECT RECOVERY"
        heading="Already building, or already stuck? This is rescue territory."
        id="section-18"
        intro={
          <p>
            FairLend&apos;s process is designed to surface these problems early — or help
            restructure them when they&apos;ve already hit.
          </p>
        }
      >
        <FileCard className="gs-failure-board">
          <ul>
            {failureModes.map((mode) => (
              <li key={mode}>{mode}</li>
            ))}
          </ul>
        </FileCard>
        <p>
          Some files can be restructured; some cannot. An urgent review tells you which you have.
        </p>
        <a className="gs-urgent-cta" href="#garden-suite-assessment">
          My Garden Suite Project Is Already Underway
          <span aria-hidden="true">↗</span>
        </a>
      </CopySection>
    </DossierChapter>
  )
}
