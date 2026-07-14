export const ETHOS_COPY = {
  eyebrow: 'Our Ethos',
  headline: 'The name on the sign is the standard inside.',
  opening:
    'FairLend was built around a straightforward belief: fair lending is not only good for society. It is good business.',
  alignmentHeading: 'The strongest mortgages align the interests of everyone involved.',
  operatingStandard:
    'That is why we do not believe in hidden charges or predatory fees that profit from a borrower’s moment of need.',
  relationshipStandard:
    'We want borrowers to return because we treated them fairly—and, one day, to trust us when they have capital of their own to lend.',
  housingHeading: 'The same alignment can change what gets built.',
  capitalTrap:
    'Private capital is still concentrated at two weak ends of the market: investor-first condominiums that sacrifice family utility, and luxury single-family projects whose economics no longer support the build.',
  housingOpportunity:
    'We see a better opportunity in medium-density housing: multiplexes, garden suites, laneway suites, and purpose-built rentals designed to be attainable, sustainable, spacious, and good enough to raise a family in.',
  alignedEconomics:
    'When these projects are properly selected, underwritten, and financed, private investors can pursue attractive returns while helping capable builders create homes ordinary Canadians actually need. Social value and commercial value do not have to compete. With the right incentives, each makes the other stronger.',
  pullQuote: 'Fair lending is not charity. It is an operating model built around shared success.',
  officeCaption:
    'The FairLend office in Toronto — our name on the wall and our team accountable for the standard behind it.',
  vision:
    'Our vision is to point private capital toward better outcomes: strong mortgages, repeat relationships, attractive opportunities for investors, and more homes Canadians can afford to live—and raise a family—in.',
} as const

export type AlignedInterest = {
  audience: string
  code: string
  copy: string
  fields: readonly string[]
}

export const ALIGNED_INTERESTS = [
  {
    audience: 'Borrowers',
    code: '01',
    copy: 'Borrowers get clear terms, a realistic exit, and financing that solves the problem without creating a larger one.',
    fields: ['Clear terms', 'Realistic exit', 'Problem solved'],
  },
  {
    audience: 'Investors',
    code: '02',
    copy: 'Investors get disciplined underwriting, transparent information, and professionally administered private mortgage opportunities.',
    fields: ['Disciplined underwriting', 'Transparent information', 'Professional administration'],
  },
  {
    audience: 'Builders',
    code: '03',
    copy: 'Builders get capital structured around how projects are actually built.',
    fields: ['Draw logic', 'Build sequence', 'Takeout path'],
  },
  {
    audience: 'FairLend',
    code: '04',
    copy: 'FairLend earns relationships that last beyond a single transaction.',
    fields: ['Repeat borrower', 'Repeat investor', 'Long-term desk'],
  },
] as const satisfies readonly AlignedInterest[]

export const CAPITAL_TRAP_AUDIT = [
  {
    code: 'A',
    dimension: 'Household outcome',
    finding: 'Too small for family life',
    subject: 'Investor-first condominiums',
  },
  {
    code: 'B',
    dimension: 'Project viability',
    finding: 'Economics no longer support the build',
    subject: 'Luxury single-family projects',
  },
] as const

export const HOUSING_TYPES = [
  {
    asset: '/assets/about-webp/webp/finance-icon-multiplex-financing.webp',
    code: '01',
    label: 'Multiplexes',
  },
  {
    asset: '/assets/about-webp/webp/finance-icon-garden-suites.webp',
    code: '02',
    label: 'Garden + laneway suites',
  },
  {
    asset: '/assets/about-webp/webp/finance-icon-purpose-built-rentals.webp',
    code: '03',
    label: 'Purpose-built rentals',
  },
] as const

export const VISION_OUTCOMES = [
  'Strong mortgages',
  'Repeat relationships',
  'Attractive investor opportunities',
  'More homes Canadians can afford',
] as const

export const ETHOS_ASSETS = {
  auditSpecimen: '/assets/fairlend-ethos/capital-allocation-audit-specimen.webp',
  manifestoHousing:
    '/assets/visual-assets/small-residential-construction/small-residential-construction-04.webp',
  office: '/assets/fairlend-ethos/office-sign-placeholder.webp',
  skyline: '/assets/fairlend-route-selector/investor-skyline-engraving.webp',
} as const
