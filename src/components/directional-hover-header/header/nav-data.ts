import {
  buildFairlendIntakeHref,
  buildFairlendMortgageHref,
  fairlendRentalPropertyAcquisitionHeaderSource,
  fairlendRentalPropertyRefinanceHeaderSource,
} from '@/lib/fairlend-intake'

export type FairlendNavLinkOption = {
  href: string
  bookingSource?: string
}

export type NavItem = {
  label: string
  description?: string
  link: FairlendNavLinkOption
}

export type NavColumn = {
  heading: string
  items: NavItem[]
  accent?: boolean
}

export type NavMenu = {
  id: string
  columns: NavColumn[]
}

export type NavLink = {
  label: string
  link?: FairlendNavLinkOption
  menu?: NavMenu
}

export const fairlendNavLinks = {
  home: { href: '/' },
  backoffice: { href: '/#questions' },
  borrowers: { href: '/borrowers' },
  contact: { href: '/contact' },
  disclosures: { href: '/disclosures' },
  intake: { href: '/intake' },
  privateMortgages: { href: '/borrowers/private-mortgage-financing' },
  institutionalMortgages: { href: '/borrowers/institutional-mortgage' },
  constructionFinancing: { href: '/construction-draw-financing' },
  rentalPropertyAcquisition: {
    href: buildFairlendMortgageHref(fairlendRentalPropertyAcquisitionHeaderSource),
  },
  rentalPropertyRefinance: {
    href: buildFairlendMortgageHref(fairlendRentalPropertyRefinanceHeaderSource),
  },
  investing: { href: '/investing' },
  privateMortgageLending: { href: '/investing/private-mortgage-lending' },
  partners: { href: '/partners' },
  startFile: { href: '/intake' },
  about: { href: '/#overview' },
  ethos: { href: '/#ethos' },
  leadership: { href: '/#leadership' },
  resources: { href: '/posts' },
  builderResource: { href: '/resources/construction-draws-small-builders' },
  residentialMortgages: {
    href: buildFairlendMortgageHref('header-nav-residential-mortgages'),
  },
  bridgeLoans: { href: buildFairlendMortgageHref('header-nav-bridge-loans') },
  renovationFinancing: {
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'renovation-financing',
      source: 'header-nav-renovation-financing',
    }),
  },
  multiplexFinancing: {
    href: '/multiplex-financing-gta',
  },
  gardenLanewaySuites: {
    href: '/garden-suite-financing-gta',
  },
  mliSelectInsuredHousing: {
    href: '/cmhc-mli-select-multiplex-financing',
  },
} as const

/** Keep the existing dropdown interaction, with the polished sitemap only. */
export const NAV_LINKS: NavLink[] = [
  {
    label: 'Financing',
    menu: {
      id: 'financing',
      columns: [
        {
          heading: 'Financing options',
          items: [
            { label: 'Borrower financing overview', link: fairlendNavLinks.borrowers },
            { label: 'Residential Mortgages', link: fairlendNavLinks.residentialMortgages },
            { label: 'Bridge Loans', link: fairlendNavLinks.bridgeLoans },
            { label: 'Construction financing', link: fairlendNavLinks.constructionFinancing },
            { label: 'Private mortgages', link: fairlendNavLinks.privateMortgages },
            { label: 'Institutional mortgages', link: fairlendNavLinks.institutionalMortgages },
          ],
        },
        {
          accent: true,
          heading: 'Project financing',
          items: [
            { label: 'Renovation Financing', link: fairlendNavLinks.renovationFinancing },
            { label: 'Multi-plex Financing', link: fairlendNavLinks.multiplexFinancing },
            { label: 'Garden & Laneway Suites', link: fairlendNavLinks.gardenLanewaySuites },
            {
              label: 'MLI-Select Insured Housing',
              link: fairlendNavLinks.mliSelectInsuredHousing,
            },
          ],
        },
        {
          heading: 'Refinancing & acquisitions',
          items: [
            {
              description: 'Finance the purchase of an existing rental property.',
              label: 'Acquisition of Existing Rental Properties',
              link: fairlendNavLinks.rentalPropertyAcquisition,
            },
            {
              description: 'Renew debt, unlock equity, or restructure the capital stack.',
              label: 'Refinancing of Existing Rental Properties',
              link: fairlendNavLinks.rentalPropertyRefinance,
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Investing',
    menu: {
      id: 'investing',
      columns: [
        {
          heading: 'Private mortgage lending',
          items: [
            { label: 'Investor overview', link: fairlendNavLinks.investing },
            { label: 'Private mortgage lending', link: fairlendNavLinks.privateMortgageLending },
          ],
        },
      ],
    },
  },
  { label: 'Partners', link: fairlendNavLinks.partners },
  {
    label: 'Company',
    menu: {
      id: 'company',
      columns: [
        {
          heading: 'FairLend',
          items: [
            { label: 'About', link: fairlendNavLinks.about },
            { label: 'Our ethos', link: fairlendNavLinks.ethos },
            { label: 'Leadership', link: fairlendNavLinks.leadership },
            { label: 'Resources', link: fairlendNavLinks.resources },
            { label: 'Contact', link: fairlendNavLinks.contact },
            { label: 'Disclosures', link: fairlendNavLinks.disclosures },
          ],
        },
      ],
    },
  },
]
