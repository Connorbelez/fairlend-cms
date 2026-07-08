export type FairlendFaqItem = {
  answer: string
  id: string
  question: string
}

export type FairlendFaqGroup = {
  anchorId: string
  audience: string
  id: string
  items: FairlendFaqItem[]
  label: string
  questionCountLabel: string
  routeLabel: string
  summary: string
}

export const fairlendFaqGroups = [
  {
    id: 'borrowers',
    anchorId: 'fairlend-faq-borrowers',
    label: 'Borrowers',
    audience: 'Private mortgage borrowers',
    questionCountLabel: '4 questions',
    routeLabel: 'Fit, cost, and exit.',
    summary:
      'For homeowners and property owners weighing a private mortgage, bridge loan, renewal, equity takeout, or second mortgage.',
    items: [
      {
        id: 'borrowers-private-mortgage-fit',
        question: 'Is a private mortgage right for me?',
        answer:
          'Sometimes yes, sometimes no. FairLend reviews the borrower, property, current mortgage position, available equity, payment capacity, documentation, timing, fees, and exit path together. The goal is a clear read on whether private financing solves the problem or creates a bigger one.',
      },
      {
        id: 'borrowers-commitment-speed',
        question: 'How quickly can I get a commitment?',
        answer:
          'FairLend targets a 3-day application-to-commitment path for complete private mortgage files. Timing depends on file completeness, borrower cooperation, property review, appraisal requirements, underwriting, available capital, and lender fit.',
      },
      {
        id: 'borrowers-fees-and-payout',
        question: 'Will I get trapped in payout or renewal fees?',
        answer:
          'The structure should make the cost and exit visible before you commit. FairLend discusses rate, broker or lender fees, renewal considerations, payout terms, missed-payment administration, closing costs, and material conditions in plain language. Payout fees are $0 where applicable, and third-party closing costs may still apply.',
      },
      {
        id: 'borrowers-approval-guarantee',
        question: 'Do you guarantee approval?',
        answer:
          'No. Responsible private mortgage financing still requires underwriting, documentation, property review, valuation, lender fit, and a realistic repayment or exit path. The value of the review is a practical answer, not a rushed promise.',
      },
    ],
  },
  {
    id: 'investors',
    anchorId: 'fairlend-faq-investors',
    label: 'Investors',
    audience: 'Private mortgage investors',
    questionCountLabel: '4 questions',
    routeLabel: 'Risk, review, and administration.',
    summary:
      'For investors looking at mortgage-backed private credit with professional underwriting, administration, and reporting.',
    items: [
      {
        id: 'investors-bank-account',
        question: 'Is this like putting money in a bank account?',
        answer:
          'No. Private mortgage investments are not bank deposits, are not CDIC-insured, are not guaranteed, and may not be liquid on demand. FairLend frames private mortgage investing as mortgage-backed private credit: investors review a real file, accept private-credit and liquidity risk, and rely on disciplined underwriting, documented security, administration, reporting, servicing, and recovery support rather than a deposit guarantee.',
      },
      {
        id: 'investors-capital-protection',
        question: 'How is my investment protected?',
        answer:
          'Protection starts before a file is placed. FairLend reviews the borrower, property, mortgage position, valuation support, real LTV, payment capacity, documentation quality, legal structure, and exit path. Where a file proceeds, the investment is supported by mortgage security, conservative collateral discipline, professional closing, ongoing administration, payment tracking, investor coordination, and default escalation where required. These controls are designed to manage risk; they do not eliminate it or guarantee repayment.',
      },
      {
        id: 'investors-review-before-funding',
        question: 'Can I review the deal before my capital moves?',
        answer:
          'Yes. Investor access is built around visibility before commitment, not blind allocation. Investors review the available deal package before funding, including property details, mortgage position, valuation support, LTV, borrower profile, term, rate, fees, material risks, security, closing requirements, and the administration structure. Opportunities remain subject to investor review, deal availability, documentation, suitability considerations, and final underwriting.',
      },
      {
        id: 'investors-payment-admin',
        question: 'Who handles payments, reporting, and disbursements?',
        answer:
          'FairLend operates the administration layer after funding. That can include digital closing coordination, dedicated platform lawyers, PAD collection, payment tracking, investor disbursements, servicing, renewals, payouts, legal and document workflow, reporting, borrower coordination, investor coordination, and default escalation where required. The investor portal is the visibility layer for reviewing deal status, documentation, payment administration, reporting, and communication with the FairLend team.',
      },
    ],
  },
  {
    id: 'builders',
    anchorId: 'fairlend-faq-builders',
    label: 'Builders',
    audience: 'Builders and project owners',
    questionCountLabel: '4 questions',
    routeLabel: 'Draws, permits, and execution.',
    summary:
      'For builders, owners, and small developers planning multiplexes, infill builds, garden suites, laneway suites, renovations, and rental projects.',
    items: [
      {
        id: 'builders-construction-different',
        question: 'How is construction financing different from a regular mortgage?',
        answer:
          'Construction financing has to account for land value, build scope, permits, budget drift, draw timing, working capital, appraisal support, documentation, site progress, and exit strategy. FairLend structures the financing around how the build actually happens, not just the completed property value.',
      },
      {
        id: 'builders-drawflow',
        question: 'What is DrawFlow?',
        answer:
          "DrawFlow is FairLend's milestone-based draw workflow. As approved milestones are completed and verified, draw availability can unlock. The goal is to align capital with verified progress and working-capital needs, not to force every project into a rigid preset draw calendar.",
      },
      {
        id: 'builders-before-site',
        question: 'Can FairLend help before I have a final site or permit package?',
        answer:
          'Yes. Early is often better. FairLend can help think through site strategy, acquisition price, project type, unit mix, budget assumptions, working capital, permit path, documentation gaps, CMHC MLI Select readiness where applicable, and the takeout plan before expensive decisions harden.',
      },
      {
        id: 'builders-project-risk',
        question: 'Does financing guarantee the project will finish on time or on budget?',
        answer:
          'No. Financing cannot guarantee contractor performance, cost control, permit timing, market conditions, or completion. FairLend can support draw planning, milestone review, site visibility, administration, and recovery resources where needed.',
      },
    ],
  },
  {
    id: 'partners',
    anchorId: 'fairlend-faq-partners',
    label: 'Partners',
    audience: 'Brokers and build ecosystem partners',
    questionCountLabel: '4 questions',
    routeLabel: 'Roles, clients, and early support.',
    summary:
      'For mortgage brokers, agents, architects, planners, engineers, builders, consultants, trades, suppliers, and professional advisors.',
    items: [
      {
        id: 'partners-who',
        question: 'Who is the FairLend Partner Program for?',
        answer:
          'The program is for the broader build ecosystem: mortgage brokers, broker owners, real-estate professionals, architects, planners, engineers, builders, project managers, cost consultants, technical consultants, trades, suppliers, and advisors involved early enough to influence project outcomes.',
      },
      {
        id: 'partners-client-relationship',
        question: 'If I am a broker, do I lose the client?',
        answer:
          'No. For broker-originated relationships, the client remains your client. FairLend acts as a specialist private mortgage and construction financing desk that supports the complex parts of the file with clear role boundaries.',
      },
      {
        id: 'partners-late-stage-check',
        question: 'Do you just tell us whether a site or project is financeable?',
        answer:
          'No. A late-stage approval opinion is too small. FairLend helps partners and clients shape the project earlier: site strategy, acquisition price, unit mix, budget, capital structure, draw planning, execution support, and exit path.',
      },
      {
        id: 'partners-guarantee',
        question: 'Can FairLend guarantee funding for partner projects?',
        answer:
          'No. Financing remains subject to underwriting, file completeness, project economics, borrower capacity, property value, available capital, documentation, and legal review. The program creates better structure and earlier clarity, not guaranteed approvals.',
      },
    ],
  },
] satisfies FairlendFaqGroup[]

export const fairlendFaqDefaultItemId = fairlendFaqGroups[1].items[1].id

export const fairlendFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: fairlendFaqGroups.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  ),
}
