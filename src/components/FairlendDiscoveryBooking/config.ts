import type { FairlendBookingType } from '@/lib/fairlend-bookings'
import { fairlendPrincipalBrokerClaims } from '@/lib/fairlend-claims'

export type DiscoveryFaqItem = {
  answer: string
  id: string
  question: string
}

export type DiscoveryPainPath = {
  concern: string
  outcome: string
  response: string
  title: string
}

export type DiscoveryPersona = {
  audience: string
  bookingType: FairlendBookingType
  callOutcome: string
  description: string
  faqCtaLabel: string
  faqFeaturedId: string
  faqIntro: string
  faqItems: DiscoveryFaqItem[]
  faqTitle: string
  heroImage: {
    alt: string
    height: number
    src: string
    width: number
  }
  meetingSteps: readonly [string, string, string]
  meetingTitle: string
  ledgerHeadings: readonly [string, string, string]
  offerEyebrow: string
  offerIntro: string
  offerTitle: string
  painPaths: DiscoveryPainPath[]
  preparation: string[]
  proof: string
  seoDescription: string
  seoTitle: string
  title: string
}

export const discoveryPersonas: Record<FairlendBookingType, DiscoveryPersona> = {
  partners: {
    audience: 'Guidance for brokers and professional partners',
    bookingType: 'partners',
    callOutcome: 'Leave with a working model for the relationship and the next useful step.',
    title: 'Book a partner discovery call.',
    description:
      'Bring an anonymized client scenario, live project, or recurring financing question. We’ll clarify fit, role boundaries, and the cleanest next move—without displacing your relationship.',
    offerTitle: 'A specialist financing desk that protects the relationship.',
    offerEyebrow: 'Relationship architecture',
    offerIntro:
      'FairLend helps brokers, agents, architects, planners, engineers, builders, and advisors solve the financing questions that can stall an otherwise viable project. Your relationship stays yours; we add construction and private-credit depth where it is useful.',
    preparation: [
      'Your role, the relationship you want FairLend to protect, and how we should collaborate.',
      'An anonymized or hypothetical scenario is enough; no client address is required.',
      'The financing question, constraint, or deadline creating friction.',
      'What the client has already explored and where specialist clarity is missing.',
    ],
    proof: `Principal-broker-led collaboration backed by ${fairlendPrincipalBrokerClaims.experienceLabel} and ${fairlendPrincipalBrokerClaims.volumeLabel}.`,
    painPaths: [
      {
        title: 'Unclear role boundaries',
        concern: 'Specialist help can feel like handing away the client relationship.',
        response:
          'We define ownership, communication, and responsibilities before touching the file.',
        outcome: 'A clear collaboration model that keeps you central.',
      },
      {
        title: 'Financing enters too late',
        concern: 'A site, design, budget, or offer can harden before the capital plan is tested.',
        response:
          'We pressure-test financeability while important project decisions are still movable.',
        outcome: 'Fewer late surprises and a better-prepared client.',
      },
      {
        title: 'Complex files consume the desk',
        concern:
          'Construction draws, private credit, and unusual income can overwhelm a general workflow.',
        response:
          'FairLend handles the specialist structure, underwriting narrative, and administration path.',
        outcome: 'More confidence without building a specialist team in-house.',
      },
    ],
    meetingSteps: [
      'Frame the opportunity',
      'Define the working roles',
      'Agree on the next useful step',
    ],
    meetingTitle: 'Build the working agreement',
    ledgerHeadings: [
      'Where the relationship gets exposed',
      'How FairLend protects it',
      'What the partner keeps',
    ],
    faqTitle: 'Protecting the relationship, in plain terms.',
    faqCtaLabel: 'Discuss a partner fit',
    faqFeaturedId: 'partner-client-ownership',
    faqIntro:
      'Straight answers about client ownership, referrals, fit, compensation, and what happens after an introduction.',
    faqItems: [
      {
        id: 'partner-sales-call',
        question: 'What is the purpose of the discovery call?',
        answer:
          'It is a working fit conversation about your practice, the files you encounter, and whether specialist FairLend support would be useful. We will explain how we can help, but there is no obligation to refer a client or proceed with a file.',
      },
      {
        id: 'partner-client-ownership',
        question: 'Will I lose control of my client relationship?',
        answer:
          'No. For partner-originated relationships, the client remains your client. We agree on communication, responsibilities, and handoffs before work begins so the client experiences one coordinated team.',
      },
      {
        id: 'partner-who-fits',
        question: 'Which partner relationships are a good fit?',
        answer:
          'FairLend is most useful to professionals who encounter construction, private mortgage, bridge, infill, multiplex, garden-suite, or other files where project execution and capital structure need to be considered together.',
      },
      {
        id: 'partner-live-deal',
        question: 'Do I need a live deal to book?',
        answer:
          'No. A live scenario makes the discussion concrete, but a hypothetical file or a recurring client problem is enough for a useful first conversation.',
      },
      {
        id: 'partner-compensation',
        question: 'How are referrals and compensation handled?',
        answer:
          'Any referral arrangement, disclosure, fee sharing, and regulatory obligation is discussed transparently and documented before it applies. Nothing is assumed from booking a discovery call.',
      },
      {
        id: 'partner-next-step',
        question: 'What happens after the discovery call?',
        answer:
          'If there is a fit, we document roles and the next action—such as reviewing a scenario, joining a client conversation, or setting a repeatable referral workflow. If there is no immediate fit, the call ends there without pressure.',
      },
    ],
    heroImage: {
      alt: 'Toronto skyline for FairLend real estate financing partner consultations',
      height: 818,
      src: '/assets/partners/partner-toronto-skyline-ink.webp',
      width: 1570,
    },
    seoDescription:
      'Book a FairLend partner discovery call about specialist construction, private mortgage, and project-financing support for your clients.',
    seoTitle: 'Partner Discovery Call',
  },
  lenders: {
    audience: 'Guidance for private and institutional lenders',
    bookingType: 'lenders',
    callOutcome: 'Leave with a clear view of mandate fit, file quality, and next diligence.',
    title: 'Book a lender discovery call.',
    description:
      'A focused fit conversation about your credit box, deployment priorities, file quality, and the origination or administration support you expect. You keep underwriting and approval authority.',
    offerTitle: 'Better-aligned files before they reach your desk.',
    offerEyebrow: 'Capital-fit ledger',
    offerIntro:
      'FairLend originates, structures, and administers real-estate credit with a practical understanding of the property and the project. The first call is about whether our borrower pipeline, underwriting discipline, and servicing posture fit the way you deploy capital.',
    preparation: [
      'Your target geography, asset classes, loan sizes, and mortgage position.',
      'Current appetite, exclusions, pricing parameters, and target return profile.',
      'Documentation or underwriting standards that make a file actionable.',
      'Funding, legal, servicing, reporting, renewal, and deployment constraints.',
    ],
    proof: `Origination and administration judgment backed by ${fairlendPrincipalBrokerClaims.experienceLabel} and ${fairlendPrincipalBrokerClaims.volumeLabel}.`,
    painPaths: [
      {
        title: 'Files miss the credit box',
        concern:
          'Time is lost reviewing opportunities that fail on basic structure or documentation.',
        response:
          'We qualify the borrower, property, amount, use of funds, security, and exit before presenting a file.',
        outcome: 'A cleaner first look and fewer avoidable declines.',
      },
      {
        title: 'Project risk is underexplained',
        concern:
          'Construction and transitional assets arrive without a credible execution narrative.',
        response:
          'We connect budget, permits, draws, working capital, valuation, and takeout in one underwriting story.',
        outcome: 'A file your credit team can evaluate in context.',
      },
      {
        title: 'Administration absorbs attention',
        concern:
          'Closing coordination, payments, renewals, draws, and borrower communication add operational drag.',
        response:
          'We define the administration and reporting layer before funding, with clear escalation boundaries.',
        outcome: 'Deployment without an ambiguous servicing handoff.',
      },
    ],
    meetingSteps: [
      'Map the credit box',
      'Compare workflow expectations',
      'Define a pilot opportunity',
    ],
    meetingTitle: 'Test the mandate fit',
    ledgerHeadings: [
      'What creates origination friction',
      'What FairLend standardizes',
      'What reaches the lender',
    ],
    faqTitle: 'Credit control stays with you.',
    faqCtaLabel: 'Compare lending mandates',
    faqFeaturedId: 'lender-control',
    faqIntro:
      'The practical questions behind lender fit, file quality, control, servicing, and the first opportunity.',
    faqItems: [
      {
        id: 'lender-sales-call',
        question: 'What is the purpose of the discovery call?',
        answer:
          'It is an introductory fit discussion about mandate, workflow, and where FairLend may be useful. We will not ask you to commit capital, approve a facility, or accept a specific mortgage during the call.',
      },
      {
        id: 'lender-types',
        question: 'What types of lenders does FairLend work with?',
        answer:
          'We speak with private individuals and entities, mortgage investment corporations, funds, family offices, banks, credit unions, trust companies, and other institutional capital providers where the mandate and regulatory framework fit the opportunity.',
      },
      {
        id: 'lender-control',
        question: 'Do we retain underwriting and approval control?',
        answer:
          'Yes. Your organization keeps its own credit, diligence, legal, valuation, documentation, and funding authority. FairLend prepares and coordinates the file; it does not replace your approval process.',
      },
      {
        id: 'lender-package',
        question: 'What does a FairLend file package include?',
        answer:
          'The package is tailored to your requirements and can include the borrower and ownership profile, property and mortgage position, amount and use of funds, valuation support, income or project economics, construction budget and draws, material risks, conditions, and exit strategy.',
      },
      {
        id: 'lender-servicing',
        question: 'Can FairLend support administration after funding?',
        answer:
          'Yes, where agreed. The scope can include closing coordination, payment administration, reporting, renewals, payouts, construction-draw workflow, borrower communication, and default escalation. Responsibilities are documented before closing.',
      },
      {
        id: 'lender-next-step',
        question: 'What happens after the discovery call?',
        answer:
          'If there is a potential fit, we exchange credit-box and process requirements, complete any necessary compliance steps, and identify a representative opportunity to test the workflow. There is no obligation to fund a file.',
      },
    ],
    heroImage: {
      alt: 'Toronto skyline and bridge for private mortgage lender consultations',
      height: 424,
      src: '/assets/fairlend-route-selector/investor-skyline-engraving.webp',
      width: 900,
    },
    seoDescription:
      'Book a FairLend lender discovery call about credit appetite, qualified mortgage opportunities, underwriting packages, and administration support.',
    seoTitle: 'Lender Discovery Call',
  },
  borrowers: {
    audience: 'Guidance for homeowners and property investors',
    bookingType: 'borrowers',
    callOutcome: 'Leave knowing which financing routes deserve a closer look—and which do not.',
    title: 'Book a borrower discovery call.',
    description:
      'A free 30-minute fit conversation about your property, deadline, and realistic financing routes. Booking does not create an application, credit inquiry, or mortgage obligation.',
    offerTitle: 'A financing answer built around the situation—not a product label.',
    offerEyebrow: 'Scenario triage',
    offerIntro:
      'FairLend helps Ontario borrowers compare private, institutional, bridge, refinance, equity-takeout, purchase, and construction financing. The discovery call is designed to clarify fit, cost, timing, and exit before you spend energy on the wrong route.',
    preparation: [
      'Property address and type, ownership status, and purchase price or estimated value.',
      'Requested amount, existing mortgages, and intended use of funds.',
      'Target closing, renewal, payout, or project milestone date.',
      'Rough figures are enough for the first call; documents are not required to book.',
    ],
    proof: `Your first review is grounded in ${fairlendPrincipalBrokerClaims.experienceLabel} and ${fairlendPrincipalBrokerClaims.volumeLabel} by the principal broker.`,
    painPaths: [
      {
        title: 'The bank route does not fit',
        concern:
          'Income, credit, property condition, or timing falls outside a conventional approval box.',
        response:
          'We compare private and institutional options against the actual property, equity, and exit path.',
        outcome: 'A realistic route—or a clear explanation of what must change.',
      },
      {
        title: 'The true cost is unclear',
        concern:
          'Rate headlines hide lender fees, broker fees, legal costs, renewal terms, and payout conditions.',
        response: 'We surface the material costs and conditions that should inform your decision.',
        outcome: 'A decision based on the whole structure, not one number.',
      },
      {
        title: 'The deadline is moving faster',
        concern:
          'A closing, renewal, tax issue, renovation, or opportunity cannot wait for an open-ended process.',
        response:
          'We identify the critical documents, lender fit, and decisions that control timing.',
        outcome: 'A clearer path to commitment and closing.',
      },
    ],
    meetingSteps: [
      'Understand the property and need',
      'Compare realistic financing routes',
      'Confirm documents and next steps',
    ],
    meetingTitle: 'Find the decision path',
    ledgerHeadings: [
      'What is making the file hard',
      'What we will test',
      'What you will know next',
    ],
    faqTitle: 'Clear answers before paperwork.',
    faqCtaLabel: 'Talk through my scenario',
    faqFeaturedId: 'borrower-approval-credit',
    faqIntro:
      'Plain answers about approval, documents, costs, credit, confidentiality, and what the call can actually resolve.',
    faqItems: [
      {
        id: 'borrower-sales-call',
        question: 'What is the purpose of the discovery call?',
        answer:
          'It is a fit and options conversation. We will explain where FairLend may help, where it may not, and what a sensible next step would be. Booking does not commit you to an application or mortgage.',
      },
      {
        id: 'borrower-documents',
        question: 'Do I need every document ready?',
        answer:
          'No. Start with the property, amount, use of funds, timing, current mortgage position, and any known income or credit constraints. We will tell you which documents matter next instead of asking you to assemble everything blindly.',
      },
      {
        id: 'borrower-approval-credit',
        question: 'Do you guarantee approval or run my credit when I book?',
        answer:
          'No. Booking is not an approval, lender submission, or credit inquiry. Any later application, consent, or credit check is explained before it occurs. Financing remains subject to underwriting, documentation, property value, borrower capacity, lender approval, and available capital.',
      },
      {
        id: 'borrower-fees',
        question: 'Are there fees or obligations for the discovery call?',
        answer:
          'There is no fee or obligation for the introductory discovery call. If you proceed, all applicable rates, lender fees, brokerage fees, legal costs, appraisal costs, and material conditions are disclosed before commitment.',
      },
      {
        id: 'borrower-confidentiality',
        question: 'Is my information confidential?',
        answer:
          'FairLend handles your information for the purpose of evaluating and arranging financing, subject to its privacy obligations and applicable consent. We do not ask you to send sensitive documents through the booking form.',
      },
      {
        id: 'borrower-next-step',
        question: 'What happens after the discovery call?',
        answer:
          'If a route looks viable, we send a focused document list and explain the next underwriting step. If the file is not ready or the structure is not responsible, we will say what needs to change or why another path is better.',
      },
    ],
    heroImage: {
      alt: 'Toronto-area detached home for private and institutional mortgage consultations',
      height: 378,
      src: '/assets/fairlend-route-selector/private-mortgage-house-engraving.webp',
      width: 900,
    },
    seoDescription:
      'Book a FairLend borrower discovery call to review private, institutional, bridge, refinance, purchase, or construction financing options.',
    seoTitle: 'Borrower Discovery Call',
  },
  builders: {
    audience: 'Guidance for builders and project owners',
    bookingType: 'builders',
    callOutcome: 'Leave with the next capital decision tied to the project stage.',
    title: 'Book a builder discovery call.',
    description:
      'Bring the site, scope, budget, or current constraint—even if the project is early. We’ll connect acquisition, permits, draws, cash between advances, and the completion plan into one practical financing path.',
    offerTitle: 'Capital planned around how the build actually happens.',
    offerEyebrow: 'Project capital path',
    offerIntro:
      'FairLend supports builders and project owners from early feasibility through construction and completion. The financing conversation covers the whole execution path—land, soft costs, permits, hard costs, draw timing, contingencies, and the exit—not only the completed value.',
    preparation: [
      'Property address, project type, unit count, and current stage.',
      'Acquisition terms, land value, or existing mortgage position.',
      'Current budget, sources and uses, and equity invested or available.',
      'Available plans, permits, appraisal, schedule, or contractor details—and the draw, timing, or takeout problem to solve.',
    ],
    proof: `Construction-financing judgment backed by ${fairlendPrincipalBrokerClaims.experienceLabel} and ${fairlendPrincipalBrokerClaims.volumeLabel}.`,
    painPaths: [
      {
        title: 'The budget and loan do not move together',
        concern:
          'Equity, land value, soft costs, and hard costs are treated as separate conversations.',
        response:
          'We map sources and uses across acquisition, pre-construction, the build, and completion.',
        outcome: 'A capital plan grounded in the full project path.',
      },
      {
        title: 'Draw timing strains cash flow',
        concern:
          'Work is complete, trades need payment, and inspection or advance timing creates a gap.',
        response:
          'We plan milestones, verification, working capital, and draw administration before construction pressure peaks.',
        outcome: 'Fewer surprises between progress and available capital.',
      },
      {
        title: 'The exit is treated as future-you’s problem',
        concern: 'Takeout assumptions are left vague until the project is nearly complete.',
        response:
          'We test sale, refinance, rental stabilization, or insured-financing readiness at the front end.',
        outcome: 'A build strategy with a credible destination.',
      },
    ],
    meetingSteps: [
      'Map the project and capital stack',
      'Pressure-test draws and execution',
      'Define the financing workplan',
    ],
    meetingTitle: 'Sequence the next stage gate',
    ledgerHeadings: [
      'Where the project can stall',
      'What we will sequence',
      'What becomes actionable',
    ],
    faqTitle: 'Pressure-test the project before the package.',
    faqCtaLabel: 'Pressure-test the project',
    faqFeaturedId: 'builder-fees-guarantees',
    faqIntro:
      'Direct answers about project stage, equity, permits, draws, guarantees, fees, and what FairLend can establish on the first call.',
    faqItems: [
      {
        id: 'builder-sales-call',
        question: 'What is the purpose of the discovery call?',
        answer:
          'The purpose is to understand the project and decide whether a responsible financing path exists. We may identify private, institutional, insured, staged, or later financing work—or conclude that the project needs more planning first. Booking is not an approval or funding commitment.',
      },
      {
        id: 'builder-stage',
        question: 'How early should I speak with FairLend?',
        answer:
          'Earlier is usually more useful. We can discuss site strategy, acquisition, unit mix, preliminary budget, equity, permit path, draw structure, and takeout before those decisions become expensive to change.',
      },
      {
        id: 'builder-permits',
        question: 'Do I need permits and a final budget before booking?',
        answer:
          'No. Bring what is available. The discovery call can identify which plans, permits, estimates, contracts, appraisal work, and contingency assumptions are needed for the next financing stage.',
      },
      {
        id: 'builder-equity',
        question: 'How much equity will the project require?',
        answer:
          'There is no responsible universal percentage. Equity depends on land value and debt, project type, budget, stage, loan-to-cost, loan-to-value, presales or rents where relevant, borrower strength, contingencies, lender appetite, and exit strategy.',
      },
      {
        id: 'builder-fees-guarantees',
        question: 'Does booking create fees, guarantees, or an obligation?',
        answer:
          'No. The discovery call is free and creates no financing obligation. Any later brokerage fees, lender fees, personal guarantees, third-party costs, conditions, or commitments depend on the proposed structure and are disclosed before you decide whether to proceed.',
      },
      {
        id: 'builder-next-step',
        question: 'What happens after the discovery call?',
        answer:
          'If the project is ready, we send a focused workplan covering documents, valuation, budget review, capital structure, lender path, and immediate decisions. If it is early, we identify the feasibility questions to resolve before underwriting.',
      },
    ],
    heroImage: {
      alt: 'Toronto residential construction site for builder financing consultations',
      height: 452,
      src: '/assets/fairlend-route-selector/construction-building-engraving.webp',
      width: 882,
    },
    seoDescription:
      'Book a FairLend builder discovery call about acquisition, construction financing, draw planning, working capital, and project takeout.',
    seoTitle: 'Builder Discovery Call',
  },
}
