import { Building2, FileSearch, Network, Scale } from 'lucide-react'

export const lenderFitSignals = [
  {
    detail:
      'How income is earned, documented, and sustained matters as much as the headline number.',
    evidence: 'T4s · NOAs · business financials · leases',
    icon: FileSearch,
    title: 'Borrower income',
  },
  {
    detail:
      'Occupancy, marketability, condition, location, and property type shape the available lender set.',
    evidence: 'Use · appraisal · location · condition',
    icon: Building2,
    title: 'Property profile',
  },
  {
    detail:
      'The requested amount is reviewed against value, existing debt, debt service, and liquidity.',
    evidence: 'LTV · GDS/TDS · net worth · reserves',
    icon: Scale,
    title: 'Mortgage structure',
  },
  {
    detail:
      'A purchase, transfer, refinance, or equity take-out can land in different policies at the same lender.',
    evidence: 'Purpose · deadline · amortization · term',
    icon: Network,
    title: 'Transaction fit',
  },
] as const

export const declineReasons = [
  {
    finding:
      'The lender used a rigid income method that did not reflect the complete earning picture.',
    response:
      'Repackage income for a lender that accepts the applicable self-employed, rental, corporate, or multi-source documentation.',
    signal: 'Income does not fit the box',
  },
  {
    finding:
      'The property type, occupancy, location, or condition fell outside one lender’s policy.',
    response:
      'Match the property to an institution whose mandate and appraisal policy cover the actual asset.',
    signal: 'Property policy mismatch',
  },
  {
    finding: 'Debt-service ratios, leverage, or liquidity did not support the amount as submitted.',
    response:
      'Test a different amount, amortization, debt cleanup, borrower structure, or lender policy before reapplying.',
    signal: 'The structure is too tight',
  },
  {
    finding:
      'The deadline arrived before documents, valuation, underwriting, and conditions could be completed.',
    response:
      'Separate the immediate closing problem from the permanent mortgage and build a credible route between them.',
    signal: 'Timing, not credit',
  },
] as const

export const termSheetRows = [
  [
    'Interest rate',
    'The quoted rate and whether it is fixed, variable, insured, insurable, or conventional.',
  ],
  [
    'Term + amortization',
    'How long the rate is committed and how long the repayment schedule runs.',
  ],
  [
    'Prepayment',
    'Annual privileges, portability, and how penalties are calculated if you leave early.',
  ],
  [
    'Fees + costs',
    'Broker, lender, appraisal, legal, discharge, registration, and other applicable closing costs.',
  ],
  [
    'Conditions',
    'The income, property, valuation, insurance, legal, and funding evidence still required.',
  ],
  [
    'Funding date',
    'The commitment expiry, document deadlines, and the date funds must be available.',
  ],
] as const

export const matchSteps = [
  [
    'Normalize',
    'Build one coherent file from the property, income, credit, debt, purpose, and deadline.',
  ],
  [
    'Screen',
    'Remove programs that do not fit before they consume time or create unnecessary credit activity.',
  ],
  [
    'Match',
    'Place the complete file against applicable institutional lender policy and current appetite.',
  ],
  [
    'Compare',
    'Review rate, amortization, prepayment, fees, conditions, and execution risk together.',
  ],
  [
    'Close',
    'Coordinate the remaining evidence, valuation, legal work, conditions, and funding date.',
  ],
] as const

export const comparisonRows = [
  [
    'Primary use',
    'Stable purchase, renewal, transfer, or refinance',
    'Short-term timing, recovery, or qualification gap',
  ],
  [
    'Underwriting',
    'Income, credit, debt service, property, and policy fit',
    'Equity, property, capacity, timing, and exit path',
  ],
  [
    'Typical tradeoff',
    'Lower cost with more documentation and policy constraints',
    'More flexibility with materially higher cost',
  ],
  [
    'Best question',
    'Which institution fits the complete file?',
    'What specific event gets this mortgage repaid?',
  ],
] as const

export const faqs = [
  [
    'What is an institutional mortgage?',
    'An institutional mortgage is funded by a regulated or established lending institution such as a bank, credit union, trust company, monoline lender, or other institutional capital provider. Each lender applies its own underwriting, property, documentation, and risk policies.',
  ],
  [
    'Can FairLend help if my bank declined me?',
    'A decline from one bank does not automatically mean every institutional option is closed. The reason matters. FairLend can review whether the issue is lender policy, income documentation, debt service, credit, property type, valuation, leverage, or timing, then identify whether another institutional program is a credible fit.',
  ],
  [
    'Will applying with multiple lenders hurt my credit?',
    'Credit inquiries can affect a credit file, so the goal is not to submit everywhere. FairLend first screens the complete file against lender criteria and discusses consent before applications or credit checks are made.',
  ],
  [
    'What documents will I need?',
    'The exact list depends on the borrower, income type, property, and transaction. Common requests include identification, income evidence, notices of assessment, bank statements, business financials, mortgage statements, property tax information, purchase documents, leases, and an appraisal. You do not need to upload documents to start the review.',
  ],
  [
    'How long does an institutional mortgage take?',
    'Timing depends on the lender, completeness of the file, appraisal, income verification, legal work, and outstanding conditions. A clean file can move quickly, but institutional underwriting is document-driven. Share the real deadline at intake so execution risk is assessed early.',
  ],
  [
    'Is the lowest rate always the best mortgage?',
    'No. Rate matters, but so do prepayment penalties, amortization, portability, fees, conditions, approval certainty, and whether the lender can meet the closing date. FairLend compares the complete mortgage economics and execution requirements.',
  ],
  [
    'When would a private mortgage be considered instead?',
    'Private financing may be considered when the immediate timing, property, credit, or documentation picture does not fit institutional policy and there is enough transaction support plus a credible repayment or refinance path. It should be evaluated as a different cost-and-risk decision, not presented as the same product.',
  ],
  [
    'Do you guarantee approval or a specific rate?',
    'No. Approval, rate, terms, and funding remain subject to lender review, borrower consent, documentation, credit, property valuation, conditions, available programs, and final underwriting.',
  ],
] as const
