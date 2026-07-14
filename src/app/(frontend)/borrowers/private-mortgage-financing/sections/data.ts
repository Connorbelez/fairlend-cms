export const decisionQuestions = [
  'Can it work?',
  'What will it cost?',
  'How fast can it close?',
  'How do I get out?',
] as const

export const proofPoints = [
  ['Fast answer target', 'Target 24-hour commitment on complete private mortgage files.'],
  ['Options compared', 'First, second, bridge, renewal, and equity-based structures reviewed.'],
  ['Payout terms', 'Low payout fees where applicable.'],
  ['Costs upfront', 'Material mortgage economics discussed before signing.'],
  ['Local review', 'Led by experienced Southern Ontario mortgage professionals.'],
] as const

export const scenarios = [
  {
    body: 'A maturity date is close and the bank answer is not ready yet. The review starts with the term, cost, and a credible route back to cheaper financing.',
    focus: 'Term cost + refinance path',
    signal: 'My renewal is coming up',
    title: 'Renewal pressure',
  },
  {
    body: 'A purchase, sale, refinance, or private payout has a hard date. FairLend checks whether the money can close on time and how it gets repaid.',
    focus: 'Repayment event + deadline',
    signal: 'I have a fixed closing date',
    title: 'Closing deadline',
  },
  {
    body: 'High-interest debt, tax arrears, or scattered payments may be consolidated when equity, capacity, fees, and the exit path support it.',
    focus: 'Equity + total cost',
    signal: 'My payments are scattered',
    title: 'Debt consolidation',
  },
  {
    body: 'If the bank process is too slow or too rigid, FairLend reviews whether the requested amount, available equity, payment capacity, costs, and exit align.',
    focus: 'Equity + amount needed',
    signal: 'I need to access equity',
    title: 'Equity access',
  },
  {
    body: 'Bridge financing can help when one transaction depends on another. The key question is whether the repayment event is real and timed properly.',
    focus: 'Bridge amount + repayment event',
    signal: 'I need short-term bridge money',
    title: 'Bridge financing',
  },
  {
    body: 'A second mortgage can solve a specific need when the valuation, current mortgage position, payment plan, and exit make the added risk workable.',
    focus: 'Position + payment plan',
    signal: 'I need capital behind my first',
    title: 'Second mortgage',
  },
  {
    body: 'Bruised credit or non-traditional income is not an automatic no. The review still needs a current valuation, clear mortgage position, documentation, capacity, and a realistic exit.',
    focus: 'Documents + mortgage position',
    signal: 'The bank said no',
    title: 'Bank decline',
  },
  {
    body: 'An existing private mortgage can be reviewed for payout rights, renewal pressure, fee exposure, maturity plan, and whether a better structure exists.',
    focus: 'Payout rights + maturity plan',
    signal: 'I already have private money',
    title: 'Existing private mortgage',
  },
] as const

export const comparisonRows = [
  [
    'Cost visibility',
    'Fees show up late, after you already feel committed.',
    'Costs are discussed before signing.',
  ],
  [
    'Exit terms',
    'Payout penalties make refinancing or selling harder.',
    'Low payout fees where applicable.',
  ],
  [
    'Payment issues',
    'A missed payment turns into escalating charges.',
    'Administration-focused servicing, not punishment.',
  ],
  [
    'Renewal path',
    'You reach maturity with no clear next move.',
    'Maturity and renewal options are discussed up front.',
  ],
  [
    'Key terms',
    'The real deal is scattered across dense documents.',
    'Material mortgage economics are visible in the commitment.',
  ],
  [
    'Next step',
    'You get funds, but no plan to leave private money.',
    'The exit path is reviewed before funding.',
  ],
] as const

export const processSteps = [
  {
    body: 'Share the address, current mortgage, timeline, and why you need financing.',
    phase: 'Intake',
    title: 'Tell us what is happening',
  },
  {
    body: 'FairLend reviews valuation, equity, documentation, payment capacity, mortgage position, and lender fit together.',
    phase: 'Assessment',
    title: 'Review what can work',
  },
  {
    body: 'Rate, fees, payout terms, renewal considerations, risks, and material conditions are discussed in plain language.',
    phase: 'Terms',
    title: 'Map the terms',
  },
  {
    body: 'The maturity path is considered before funding: refinance, sale, renewal, stabilization, debt cleanup, or another realistic route.',
    phase: 'Exit route',
    title: 'Plan the way out',
  },
  {
    body: 'If the structure makes sense, support can continue through closing, PAD payments, servicing, renewals, payouts, and borrower coordination.',
    phase: 'Support',
    title: 'Stay supported after funding',
  },
] as const

export const reviewRegisters = [
  ['Borrower', 'Documentation, payment capacity, timing'],
  ['Valuation', 'Appraisal, available equity, market context'],
  ['Mortgage position', 'Current balance, payout terms, renewal path'],
  ['Exit strategy', 'Refinance, sale, renewal, debt cleanup'],
] as const

export const operatingStandards = [
  [
    'Connected file review',
    'Valuation, mortgage position, documentation, lender fit, and exit are reviewed together before a structure is recommended.',
  ],
  [
    'Tradeoffs made visible',
    'Cost, timing, maturity path, and funding conditions are explained before the file moves forward.',
  ],
  [
    'Professional judgment',
    'Technology helps organize the work, but experienced mortgage professionals make the judgment calls.',
  ],
  [
    'Whole-file review',
    'Need, address, valuation, current mortgage, documents, lender fit, and exit are reviewed as one file.',
  ],
  [
    'Valuation and equity check',
    'Valuation, mortgage position, available equity, payment capacity, and the exit route are tested against the requested amount and total costs.',
  ],
  [
    'Closing and renewal support',
    'Support can continue after funding through payment questions, renewals, payouts, coordination, and administration.',
  ],
] as const

export const reviewInputs = [
  'Current valuation',
  'Available equity',
  'Amount needed',
  'Deadline',
  'Current mortgage',
  'Exit path',
] as const

export const faqs = [
  [
    'Is a private mortgage right for me?',
    'It depends on the valuation, equity, current mortgage, amount needed, payment capacity, timeline, costs, and exit path. FairLend reviews those pieces together so you can see whether private financing solves the problem or creates a bigger one.',
  ],
  [
    'How fast can I get an answer?',
    'FairLend targets a 24-hour application-to-commitment path for complete private mortgage files. Timing depends on complete information, borrower cooperation, valuation and appraisal requirements, lender review, available capital, and lender fit.',
  ],
  [
    'What happens in the free review?',
    'The first review looks at the address, timeline, current mortgage, available equity, amount needed, likely costs, payout considerations, and exit path. After that, FairLend can tell you what documents are needed for a clearer answer.',
  ],
  [
    'Can bruised credit or non-traditional income work?',
    'Often, yes. Bruised credit, self-employment, irregular income, or a bank decline do not automatically end the conversation. Approval is never automatic, though. Equity, valuation, payment capacity, documentation, timing, and a realistic exit still matter.',
  ],
  [
    'Do you guarantee approval?',
    'No. Responsible private mortgage financing still requires lender review, documentation, valuation, appraisal requirements where applicable, lender fit, available capital, and a realistic repayment or exit path.',
  ],
  [
    'What fees should I expect?',
    'You should expect a plain-language discussion of the full cost picture: rate, broker or lender fees, administration charges, renewal considerations, payout terms, default charges, closing costs, material conditions, and material risks.',
  ],
  [
    'Are there payout fees?',
    'Where the structure allows it, FairLend works to keep payout fees low so leaving for better financing is not treated as the expensive option. Either way, payout terms should be understood before you commit.',
  ],
  [
    'Will legal documents include fees I did not see in the commitment?',
    'You should know the material mortgage economics before closing. The commitment should disclose rate, fees, term, payment structure, payout terms, renewal considerations, default charges, material conditions, and material risks. Third-party legal, appraisal, registration, government, and closing costs may still apply where relevant.',
  ],
  [
    'What is an exit strategy?',
    'An exit strategy is the realistic plan for what happens at maturity: refinance, sale, renewal, income stabilization, credit repair, debt cleanup, construction completion, or another defined path. It should be discussed before funding, not when the term is about to expire.',
  ],
  [
    'What happens after closing?',
    'Support can continue through digital closing workflows, PAD payment collection, servicing, renewals, payouts, borrower coordination, and administration. The goal is practical communication after funding, not a disappearing broker experience.',
  ],
] as const
