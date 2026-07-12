import {
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
  leadership: { href: '/#leadership' },
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
            { label: 'Construction financing', link: fairlendNavLinks.intake },
            { label: 'Private mortgages', link: fairlendNavLinks.privateMortgages },
          ],
        },
        {
          accent: true,
          heading: 'Refinancing & acquisitions',
          items: [
            {
              description: 'Finance the purchase of an existing rental property.',
              label: 'Acquire a rental property',
              link: fairlendNavLinks.rentalPropertyAcquisition,
            },
            {
              description: 'Renew debt, unlock equity, or restructure the capital stack.',
              label: 'Refinance a rental property',
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
            { label: 'Leadership', link: fairlendNavLinks.leadership },
          ],
        },
      ],
    },
  },
]
