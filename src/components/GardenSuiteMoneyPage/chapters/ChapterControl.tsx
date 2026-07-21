import { CopySection, DossierChapter, EvidenceGate, FileCard } from '../DossierChapter'

const workspaceActions = [
  'Review the current build plan and milestone status.',
  'See required evidence and upcoming funding needs.',
  'Upload and review documents within your permission scope.',
  'Communicate against the relevant project item.',
  'Request draws through the same SSO-enabled portal.',
  'Track review and release status.',
] as const

const roleRows = [
  [
    'Homeowner',
    'Full project, funding status, evidence requirements',
    'Draw requests, approvals in scope, documents',
  ],
  [
    'Builder / contractor',
    'Schedule, milestones, evidence requirements',
    'Progress updates, evidence uploads, draw proposals',
  ],
  ['Trades / suppliers', 'Their assigned milestones', 'Their evidence and documents'],
  [
    'Lender / capital participant',
    'Facility, milestone and release status',
    'Facility-level review items',
  ],
  ['FairLend', 'Full project', 'Review, approval and release workflow'],
] as const

const oversightCadence = [
  'Daily drone footage for progress capture.',
  'Weekly site walkthroughs and progress inspections.',
  'In-progress site reviews after each milestone.',
  'Evidence attached to the corresponding DrawFlow milestone.',
  'Schedule, cost and draw-plan recalculation when actual progress changes.',
] as const

const networkRoles = [
  'Planning + permits',
  'Builders + GCs',
  'Specialized trades',
  'Material suppliers',
  'Appraisers',
  'Legal professionals',
  'Capital providers',
] as const

export function ChapterControl() {
  return (
    <DossierChapter
      chapter="03"
      description="One controlled workspace, backed by evidence from the real site."
      label="Operate + verify"
      tone="blueprint"
    >
      <CopySection
        file="WORKSPACE / DF-05 — ROLE ACCESS"
        heading="One workspace. Everyone sees exactly what they should."
        id="section-9"
        intro={
          <p>
            The DrawFlow workspace gives you and every authorized project participant a single,
            permission-controlled view of the build.
          </p>
        }
      >
        <div className="gs-workspace">
          <FileCard>
            <div className="gs-workspace__chrome" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="gs-file-label">Current project workspace</p>
            <ol className="gs-workspace__milestones">
              <li data-state="complete">Foundation evidence reviewed</li>
              <li data-state="active">Framing draw ready for request</li>
              <li>Rough-ins documentation upcoming</li>
            </ol>
          </FileCard>
          <ul>
            {workspaceActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
        <EvidenceGate owner="Engineering · security">
          A redacted current workspace screenshot with the represented role identified is required
          before this semantic product frame can be replaced. No borrower, lender or
          project-sensitive data is included.
        </EvidenceGate>
        <div className="gs-table-wrap">
          <table className="gs-table">
            <caption>Least-privilege access by role</caption>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Sees</th>
                <th scope="col">Can act on</th>
              </tr>
            </thead>
            <tbody>
              {roleRows.map(([role, sees, acts]) => (
                <tr key={role}>
                  <th scope="row">{role}</th>
                  <td>{sees}</td>
                  <td>{acts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CopySection>

      <CopySection
        file="FIELD / GS-04 — OPERATING CADENCE"
        heading="The site is reviewed every day the project runs"
        id="section-10"
        intro={
          <p>
            FairLend&apos;s oversight cadence attaches real evidence to every DrawFlow milestone.
          </p>
        }
      >
        <div className="gs-cadence">
          <div className="gs-cadence__week" aria-label="Weekly oversight cadence">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <span data-walkthrough={index === 4 ? '' : undefined} key={day}>
                {day}
                <i>{index === 4 ? 'Walkthrough' : 'Capture'}</i>
              </span>
            ))}
          </div>
          <ul>
            {oversightCadence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p>
          These are FairLend progress inspections performed by approved construction operations
          reviewers. They are distinct from municipal and building-code inspections, which remain
          the municipality&apos;s role.
        </p>
        <EvidenceGate owner="Construction operations · privacy · legal">
          Consented and redacted daily drone media, a sample walkthrough report, reviewer
          identities, qualifications and the exact review scope remain launch-critical evidence.
        </EvidenceGate>
      </CopySection>

      <CopySection
        file="NETWORK / GS-05 — PROJECT PARTICIPANTS"
        heading="The team your project needs, without cold-calling strangers"
        id="section-11"
        intro={
          <p>
            FairLend connects homeowners to an established network across every role a Garden Suite
            needs.
          </p>
        }
      >
        <div
          className="gs-network-map"
          role="img"
          aria-label="Garden Suite project surrounded by seven participant categories"
        >
          <strong>YOUR PROJECT</strong>
          {networkRoles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
        <p>
          The network spans planning/design and permit professionals, builders and general
          contractors, specialized trades, material suppliers, appraisers, legal professionals, and
          construction and takeout capital providers.
        </p>
        <p>
          <strong>How it works:</strong> FairLend identifies network participants through prior
          project work and defined selection criteria. Introductions are optional — you choose who
          to engage, and you may bring your own team.
        </p>
        <EvidenceGate owner="Partnership owner">
          Network selection criteria, participant examples, role boundaries and any referral or
          commercial relationships require approved disclosure before indexing.
        </EvidenceGate>
      </CopySection>
    </DossierChapter>
  )
}
