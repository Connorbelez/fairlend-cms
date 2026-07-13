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
  intake: { href: '/intake' },
  privateMortgages: { href: buildFairlendMortgageHref('header-nav-private-mortgage') },
  rentalPropertyAcquisition: {
    href: buildFairlendMortgageHref(fairlendRentalPropertyAcquisitionHeaderSource),
  },
  rentalPropertyRefinance: {
    href: buildFairlendMortgageHref(fairlendRentalPropertyRefinanceHeaderSource),
  },
  investing: { href: '/investing/private-mortgage-lending' },
  partners: { href: '/partners' },
  startFile: { href: '/intake' },
  about: { href: '/#overview' },
  ethos: { href: '/#ethos' },
  leadership: { href: '/#leadership' },
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
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'multiplex-financing',
      source: 'header-nav-multiplex-financing',
    }),
  },
  gardenLanewaySuites: {
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'garden-laneway-suites',
      source: 'header-nav-garden-laneway-suites',
    }),
  },
  mliSelectInsuredHousing: {
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'mli-select-insured-housing',
      source: 'header-nav-mli-select-insured-housing',
    }),
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
            { label: 'Residential Mortgages', link: fairlendNavLinks.residentialMortgages },
            { label: 'Bridge Loans', link: fairlendNavLinks.bridgeLoans },
            { label: 'Construction financing', link: fairlendNavLinks.intake },
            { label: 'Private mortgages', link: fairlendNavLinks.privateMortgages },
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
          items: [{ label: 'Invest with FairLend', link: fairlendNavLinks.investing }],
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
          ],
        },
      ],
    },
  },
]
