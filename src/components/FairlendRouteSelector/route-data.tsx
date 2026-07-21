import { Handshake, HardHat, House, HousePlus, UsersRound } from 'lucide-react'

import { buildFairlendIntakeHref, buildFairlendMortgageHref } from '@/lib/fairlend-intake'

import { fairlendRouteSelectorAssets } from './assets'
import type {
  FairlendRouteChoice,
  FairlendRouteHelpBannerContent,
  FairlendRouteSelectorCopy,
} from './types'

export const fairlendRouteSelectorCopy = {
  kicker: 'Find your fit',
  title: (
    <>
      Where would you like
      <br className="xl:hidden" /> to go with FairLend?
    </>
  ),
  description: (
    <>
      Whether you&apos;re looking to build, borrow, invest, or partner,
      <br />
      start with the FairLend option that matches your goals.
    </>
  ),
} satisfies FairlendRouteSelectorCopy

export const fairlendRouteChoices = [
  {
    id: 'construction-financing',
    title: 'Get construction financing',
    description: 'Plan draws, capital, and takeout around how your project actually gets built.',
    bullets: [
      'Land, builds, and CMHC takeout planning',
      'Build your own draw schedule.',
      'Save up to 50% interest',
      'Construction guidance from planning to completion',
      'Structured for single homes through large multi-unit projects',
    ],
    steps: ['Plan', 'Build', 'Draw', 'Complete'],
    stepDescriptions: [
      'Map the capital and scope',
      'Start with a clear schedule',
      'Release funds by stage',
      'Finish and plan the takeout',
    ],
    ctaLabel: 'Get Approved',
    href: '/construction-financing',
    icon: HardHat,
    illustration: fairlendRouteSelectorAssets.constructionBuilding,
    badge: 'Priority',
  },
  {
    id: 'residential-mortgages',
    title: 'Residential mortgages',
    description:
      'Private, institutional, and home-equity financing—all structured by one experienced FairLend team.',
    bullets: [
      'Options when the banks say no',
      '24-hour commitment target for eligible private-mortgage files',
      'No hidden or predatory fees—pricing and exit terms disclosed upfront',
    ],
    steps: ['Apply', 'Compare', 'Structure', 'Fund'],
    ctaLabel: 'Start My Mortgage Review',
    href: buildFairlendMortgageHref('route-selector-residential-mortgages'),
    icon: House,
    illustration: fairlendRouteSelectorAssets.privateMortgageHouse,
    badge: 'Popular',
    services: [
      {
        title: 'Private mortgage',
        description: 'Flexible financing when a traditional lender is not the right fit.',
        href: buildFairlendMortgageHref('route-selector-private-mortgage'),
      },
      {
        title: 'Institutional mortgage',
        description: 'Competitive options across banks, credit unions, and monoline lenders.',
        href: '/borrowers/institutional-mortgage',
      },
      {
        title: 'HELOC',
        description: 'Revolving credit reviewed around the available equity in your home.',
        href: buildFairlendMortgageHref('route-selector-heloc'),
      },
    ],
  },
  {
    id: 'garden-laneway-suites',
    title: 'Build a backyard rental',
    description:
      'Bring us your property and down payment. FairLend coordinates the feasibility, permits, builder, construction financing, draws, and takeout—so your first build can become steady rental income.',
    bullets: [
      'Turn home equity into a new rental asset—not a one-time cash withdrawal',
      'One coordinated team from property review through a tenant-ready suite',
      'Structure the takeout so projected rent may exceed the monthly financing payment',
    ],
    steps: ['Assess', 'Plan', 'Build', 'Rent'],
    ctaLabel: 'Check My Property',
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'garden-laneway-suites',
      source: 'route-selector-garden-laneway-suites',
    }),
    icon: HousePlus,
    illustration: fairlendRouteSelectorAssets.gardenSuite,
    badge: 'Garden + laneway',
    callout: 'garden-suite-rental-income',
    highlights: [
      { label: 'of as-improved value', value: 'Up to 95%' },
      { label: 'amortization', value: 'Up to 30 years' },
      { label: 'from first review to takeout', value: 'One FairLend team' },
    ],
    disclaimer:
      'CMHC maximums shown across eligible Improvement and Refinance paths; 95% LTV and 30-year amortization are product-specific and may not be available together. Approval, rent, and positive cash flow are not guaranteed.',
  },
  {
    id: 'invest',
    title: 'Invest with FairLend',
    description: 'Private-mortgage investing with the administration handled.',
    bullets: [
      'Curated private mortgage opportunities',
      'Serviced by a licensed administrator',
      'No more paper or manual tracking',
      'Investor-fit review before opportunities are shared',
    ],
    steps: ['Learn', 'Review', 'Qualify', 'Monitor'],
    ctaLabel: 'Invest With Us',
    href: '/investing/private-mortgage-lending',
    icon: UsersRound,
    illustration: fairlendRouteSelectorAssets.investorSkyline,
  },
  {
    id: 'partner-program',
    title: 'Partner program',
    description:
      'Work with FairLend to deliver better outcomes for your clients and grow your business.',
    bullets: [
      'Referral and co-lending options',
      'Competitive partner benefits',
      'Dedicated support team',
      'Built for brokers and advisors',
    ],
    steps: ['Connect', 'Refer', 'Fund', 'Grow'],
    ctaLabel: 'Partner With Us',
    href: '/partners',
    icon: Handshake,
    illustration: fairlendRouteSelectorAssets.partnerHandshake,
    density: 'compact',
  },
] satisfies FairlendRouteChoice[]

export const fairlendRouteHelpBanner = {
  title: 'Not sure what you need?',
  body: "Book a free consultation and we'll help you figure out the right financing path.",
  ctaLabel: 'Book consultation',
  image: fairlendRouteSelectorAssets.compass,
} satisfies FairlendRouteHelpBannerContent
