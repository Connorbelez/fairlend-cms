import type { ReactNode } from 'react'
import Link from 'next/link'

import { CopySection, DossierChapter, EvidenceGate, FileCard } from '../DossierChapter'

const evidenceIndex = [
  [
    'Principal Broker: 28 years mortgage-broker experience and 30 years build experience',
    '#section-4',
    'credentials',
  ],
  ['In-house build advisory team', '#section-4', 'credentials'],
  ['In-house specialist legal team with 10+ years of experience', '#section-4', 'credentials'],
  [
    'Established network of professionals, builders, contractors and suppliers',
    '#section-11',
    'network',
  ],
  ['Proprietary DrawFlow software trained on thousands of Toronto builds', '#section-6', 'engine'],
  [
    'Up to 15 borrower-controlled draws with FairLend-controlled releases',
    '#drawflow-claims-methodology',
    'claims and methodology',
  ],
  [
    'Case studies demonstrating up to 50% construction-interest savings',
    '#case-ledger',
    'case ledger',
  ],
  ['Approximately $12,000 modelled illustration', '#12k-model', 'worked comparison'],
  [
    'Daily drone capture, weekly walkthroughs/inspections and milestone reviews',
    '#section-10',
    'field oversight',
  ],
  ['Shared SSO workspace with role-based least-privilege access', '#section-9', 'workspace'],
  [
    'Planning through construction, takeout and CMHC qualification strategy',
    '#section-3',
    'journey',
  ],
] as const

const faqs: readonly { answer: ReactNode; question: string }[] = [
  {
    question: 'Can FairLend help if I do not have a builder yet?',
    answer: (
      <>
        Yes. Start with the property, budget and goal. FairLend helps identify the team your project
        requires and connects you to builders, contractors and suppliers from its established
        network. Introductions are optional. See <a href="#section-3">the project journey</a>.
      </>
    ),
  },
  {
    question: 'Can FairLend help with planning and permits?',
    answer: (
      <>
        FairLend supports the planning and permit pathway and connects you to planning and permit
        professionals. It does not replace municipal authorities, architects or engineers —
        approvals remain the municipality&apos;s decision. See{' '}
        <a href="#section-3">the project journey</a>.
      </>
    ),
  },
  {
    question: 'How does FairLend help me find builders, contractors and suppliers?',
    answer: (
      <>
        Through its established network of planning professionals, builders, general contractors,
        trades, suppliers, appraisers, legal professionals and capital providers. FairLend explains
        how participants are identified and any relationships involved; you choose who to engage.
        See <a href="#section-11">the network</a>.
      </>
    ),
  },
  {
    question: "What does FairLend's in-house legal team do?",
    answer: (
      <>
        The specialist legal team, with 10+ years of experience, works on FairLend&apos;s
        agreements, lender authority and project structure so risk is considered early. It does not
        act as your lawyer; independent legal advice remains yours. See{' '}
        <a href="#section-4">the team</a>.
      </>
    ),
  },
  {
    question: 'What is DrawFlow?',
    answer: (
      <>
        DrawFlow is FairLend&apos;s proprietary software for planning and operating construction
        schedules, project cash flow, evidence and milestone-based funding. It plans the build,
        optimizes capital, runs a shared workspace and adapts when reality changes. See{' '}
        <a href="#section-5">DrawFlow</a>.
      </>
    ),
  },
  {
    question: 'How does DrawFlow create and update the construction schedule?',
    answer: (
      <>
        It converts scope, budget and dependencies into sub-milestones, analyzes the dependency
        graph, and recalculates downstream milestones, cash requirements and draw plans when actual
        progress differs from plan. See <a href="#section-6">the engine</a>.
      </>
    ),
  },
  {
    question: 'What does “AI trained on thousands of Toronto builds” mean?',
    answer: (
      <>
        DrawFlow&apos;s schedule and cost estimation uses AI trained on thousands of Toronto builds,
        combined with evidence-backed construction heuristics and dependency-graph analysis. The
        dataset definition and methodology require approved public documentation. See{' '}
        <a href="#section-6">the engine</a>.
      </>
    ),
  },
  {
    question: 'Can I request my own construction draws?',
    answer: (
      <>
        Yes. Draw timing is borrower-controlled — you or your builder lead when to request funds,
        within the approved facility and evidence requirements. See{' '}
        <a href="#drawflow-claims-methodology">claims and release authority</a>.
      </>
    ),
  },
  {
    question: 'How many draws can I receive?',
    answer: (
      <>
        Every DrawFlow facility supports up to 15 borrower-controlled milestone draws. See{' '}
        <a href="#drawflow-claims-methodology">claims and methodology</a>.
      </>
    ),
  },
  {
    question: 'Who decides when funds are released?',
    answer: (
      <>
        FairLend has authority under the lender agreement to review, approve and release funds when
        the milestone, evidence and file conditions are satisfied. The lender does not give ad hoc
        permission for each release. See{' '}
        <a href="#drawflow-claims-methodology">release authority</a>.
      </>
    ),
  },
  {
    question: 'How can more precise draws reduce interest?',
    answer: (
      <>
        You pay interest only on released capital. Drawing when the project needs funds — rather
        than borrowing the full budget on day one — limits interest to outstanding funded capital.
        Case studies demonstrate up to 50% construction-period interest savings. See{' '}
        <a href="#case-ledger">the evidence</a>.
      </>
    ),
  },
  {
    question: 'How does DrawFlow keep builders and trades funded?',
    answer: (
      <>
        Funding is planned around actual deposits, materials, labour and milestones. Up to 15 draws,
        shared evidence requirements and adaptive scheduling help prevent one delayed sub-milestone
        from jamming the whole build. See <a href="#section-7">capital efficiency</a>.
      </>
    ),
  },
  {
    question: 'Who can access the DrawFlow workspace?',
    answer: (
      <>
        Homeowners, builders, contractors, suppliers, lenders and FairLend — each with
        least-privilege, role-based access through the SSO client portal. Everyone sees what their
        role requires and nothing more. See <a href="#section-9">the workspace</a>.
      </>
    ),
  },
  {
    question: 'What is captured by daily drone footage and weekly inspections?',
    answer: (
      <>
        Daily drone footage records site progress; weekly walkthroughs and progress inspections
        review the work; milestone reviews attach evidence to the corresponding DrawFlow milestone.
        These are FairLend progress inspections, distinct from municipal inspections. See{' '}
        <a href="#section-10">field oversight</a>.
      </>
    ),
  },
  {
    question: 'Can I use a HELOC or refinance instead?',
    answer: (
      <>
        Possibly — both use existing equity and may fit smaller or earlier costs. A HELOC&apos;s
        limit may not cover a full build, and a refinance often means interest on the full balance
        upfront. See <a href="#section-13">the comparison</a>.
      </>
    ),
  },
  {
    question: 'Can projected rent help me qualify?',
    answer: (
      <>
        Sometimes, but never automatically. Treatment varies by lender, property, suite status,
        appraisal methodology and lease evidence. An appraisal or market-rent opinion is evidence,
        not a guarantee. See <a href="#section-15">appraisal and rent</a>.
      </>
    ),
  },
  {
    question: 'What happens after construction is complete?',
    answer: (
      <>
        Completion evidence, appraisal/rent support and deficiency resolution — then the takeout
        mortgage FairLend planned before construction began, so the end state is qualified, not
        improvised. See <a href="#section-15">takeout planning</a>.
      </>
    ),
  },
  {
    question: 'Can FairLend plan for CMHC-insured financing?',
    answer: (
      <>
        Yes — FairLend plans the qualification path using current program sources, where the project
        may be eligible. CMHC eligibility and insurance decisions remain CMHC&apos;s and the
        lender&apos;s. See <a href="#section-15">CMHC planning</a>.
      </>
    ),
  },
  {
    question: 'What is different about Laneway Suite financing?',
    answer: (
      <>
        The financing routes overlap, but a Laneway Suite depends on the lane relationship, access
        and servicing — which can change budget, staging, appraisal context and required evidence.
        See <a href="#section-16">Laneway Suite financing</a>.
      </>
    ),
  },
  {
    question: 'Can FairLend help if my project has already stalled?',
    answer: (
      <>
        Yes — stalled draws, cost overruns, appraisal gaps and completion shortfalls are exactly
        what an urgent review covers. Some files can be restructured; some cannot. See{' '}
        <a href="#section-18">failure modes</a> or use the urgent CTA.
      </>
    ),
  },
  {
    question: 'Is there a federal loan program for building a Garden Suite?',
    answer: (
      <>
        Federal secondary-suite loan programs have existed, but availability, terms and eligibility
        change. Do not assume qualification from an announcement. For current, dated program status,
        see{' '}
        <Link href="/garden-suite-financing-gta#garden-suite-faq-budget">
          Toronto Garden Suite costs and feasibility
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Does Toronto offer forgivable loans or incentives for Garden Suites?',
    answer: (
      <>
        City incentive and forgivable-loan programs open, close and change. Check current status
        before planning around any program. Dated coverage:{' '}
        <Link href="/garden-suite-financing-gta#garden-suite-faq-budget">
          Toronto Garden Suite costs and feasibility
        </Link>
        .
      </>
    ),
  },
]

export function ChapterProofAndConversion() {
  return (
    <DossierChapter
      chapter="06"
      description="Trace every claim back to its evidence, clear the objections, then start the file."
      label="Consolidate + act"
      tone="paper"
    >
      <CopySection
        file="INDEX / GS-13 — EVIDENCE LEDGER"
        heading="Everything above, on one index card"
        id="section-19"
        intro={
          <p>
            Every claim on this list is proven earlier on this page — each line links to its
            evidence.
          </p>
        }
      >
        <FileCard>
          <ol className="gs-evidence-index">
            {evidenceIndex.map(([claim, href, label], index) => (
              <li key={claim}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{claim}</p>
                <a href={href}>See {label} →</a>
              </li>
            ))}
          </ol>
        </FileCard>
        <p>
          <Link href="/about">Meet FairLend&apos;s mortgage and construction team</Link> · Fairlend
          Management Inc. o/a FairLend Mortgage · FSRA Licence #13827
        </p>
      </CopySection>

      <CopySection
        file="REGISTER / GS-14 — QUESTIONS"
        heading="Garden Suite financing questions"
        id="section-20"
        intro={
          <p>
            Direct answers to the questions that usually determine whether a project moves forward.
          </p>
        }
      >
        <div className="gs-faq">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {faq.question}
              </summary>
              <div>{faq.answer}</div>
            </details>
          ))}
        </div>
        <EvidenceGate owner="Mortgage · compliance">
          Federal and Toronto program answers require approved visible last-reviewed dates before
          indexing. No current benefit, term or eligibility is assumed on this page.
        </EvidenceGate>
      </CopySection>

      <CopySection
        className="gs-final-cta"
        file="ACTION / GS-15 — OPEN PROJECT FILE"
        heading="Turn Your Garden Suite Plan Into an Operating Plan"
        id="section-21"
        intro={
          <p>
            Tell FairLend where the property and project stand. The team will identify the next
            planning, team, financing and DrawFlow decisions required to move forward.
          </p>
        }
      >
        <div className="gs-final-cta__actions">
          <a className="gs-cta-link gs-cta-link--primary" href="#garden-suite-assessment">
            Plan My Garden Suite Project
          </a>
          <a className="gs-cta-link" href="tel:+14165360168">
            Speak With the Garden Suite Team
          </a>
        </div>
        <p>
          No builder yet? You&apos;re still welcome — the assessment starts from your property,
          budget and goal.
        </p>
        <small>
          Starting an assessment is not an approval, a rate commitment or a savings guarantee.
        </small>
      </CopySection>
    </DossierChapter>
  )
}
