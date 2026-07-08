export type FaqGroup = {
  id: string
  question: string
  answer: string
}

export type FaqSegment = {
  id: string
  label: string
  items: readonly FaqGroup[]
}

export const faqSegments: readonly FaqSegment[] = [
  {
    id: 'brokers',
    label: 'For Brokers',
    items: [
      {
        id: 'broker-lose-client',
        question: 'If I’m a broker, do I lose the client?',
        answer:
          'No. For broker-originated relationships, the client remains your client. FairLend acts as a specialist private mortgage and construction financing desk supporting the complex parts of the file — structuring, funding coordination, administration, draw planning, and execution support. We clarify roles early so the client experience is clean.',
      },
      {
        id: 'broker-never-placed',
        question: 'I’ve never sold a construction mortgage. Can I still partner?',
        answer:
          'Yes — that is the point of the program. You bring the client relationship and the borrower context. FairLend brings the construction financing specialization: private placement, structuring, draw planning, administration, and execution support. We help you say yes to complex files without pretending you need to underwrite the build alone.',
      },
      {
        id: 'broker-comp',
        question: 'How does partner compensation work?',
        answer:
          'Partner compensation, referral arrangements, and broker compensation depend on the partner role, licensing, applicable regulations, file type, disclosures, and the final program terms. The public page does not publish generic promises. We discuss compensation during onboarding so the arrangement is clear before any file moves.',
      },
      {
        id: 'broker-after-funding',
        question: 'What happens after funding?',
        answer:
          'FairLend can support draw planning, milestone review, documentation, administration, site and progress visibility, and recovery resources where needed. The goal is to remain engaged when execution matters — not to treat funding as the end of the relationship. Support is designed to help projects stay on plan; it does not guarantee completion, timelines, or cost control.',
      },
    ],
  },
  {
    id: 'ecosystem',
    label: 'For the Build Ecosystem',
    items: [
      {
        id: 'eco-only-three',
        question: 'Is this only for brokers, agents, and architects?',
        answer:
          'No. The program is for the broader build ecosystem: brokers, agents, architects, planners, engineers, builders, project managers, cost consultants, technical consultants, trades, suppliers, and professional advisors involved in the project early enough to influence outcomes. If your work shapes the build, FairLend can support the financing path.',
      },
      {
        id: 'eco-replace',
        question: 'Do you replace the architect, planner, or builder?',
        answer:
          'No. FairLend does not replace the professionals around the build. We help align financing and execution strategy with the work those professionals are already doing. You keep design authority, planning authority, and build authority. FairLend supplies the capital constraint set and execution support around it.',
      },
      {
        id: 'eco-before-site',
        question: 'Can FairLend help before the client has a site?',
        answer:
          'Yes. FairLend can help clients and partners think through what kind of site, land price, zoning path, project type, and capital structure may support the intended build. Site strategy is where the most expensive mistakes are still avoidable — it is one of the highest-leverage moments to bring financing judgment into the room.',
      },
      {
        id: 'eco-financeable',
        question: 'Do you just tell us whether a site or project is financeable?',
        answer:
          'No. A late-stage approval opinion is too small a frame. FairLend helps partners and clients shape the project earlier: site strategy, acquisition price, unit mix, budget, capital structure, draw planning, execution support, and exit path. The goal is to help create the structure that can pencil — not just grade one that already exists.',
      },
    ],
  },
  {
    id: 'how',
    label: 'How It Works',
    items: [
      {
        id: 'how-not-ready',
        question: 'What if the project isn’t ready for financing?',
        answer:
          'That can still be the right time to talk. FairLend can help identify missing documents, budget gaps, working-capital needs, permit issues, appraisal concerns, draw risks, or takeout assumptions before the project is locked. Gaps found early are cheap. Gaps found after closing are expensive.',
      },
      {
        id: 'how-guarantee',
        question: 'Can FairLend guarantee funding or approval?',
        answer:
          'No. Financing is subject to underwriting, file completeness, project economics, borrower capacity, property value, available capital, documentation, and legal review. The value of the program is better structure and earlier clarity — not guaranteed approvals. Refusing to promise outcomes is part of how we protect your client.',
      },
      {
        id: 'how-mli-select',
        question: 'Do you work on CMHC MLI Select–oriented projects?',
        answer:
          'Where applicable, FairLend can help partners think through CMHC MLI Select readiness, including project type, rental assumptions, affordability, accessibility, energy-efficiency considerations, documentation, and takeout planning. Qualification is not guaranteed and is subject to CMHC eligibility and underwriting.',
      },
      {
        id: 'how-onboarding',
        question: 'What does onboarding involve?',
        answer:
          'A practical orientation to FairLend’s project types, financing criteria, documentation needs, process, role boundaries, communication expectations, and compensation where applicable. After onboarding, you bring situations and we bring structure — no volume commitments, no file quotas. Bring the files that fit.',
      },
    ],
  },
]
