import { Handshake, HardHat, House, UsersRound } from 'lucide-react'

import { fairlendRouteSelectorAssets } from './assets'
import type {
  FairlendRouteChoice,
  FairlendRouteHelpBannerContent,
  FairlendRouteSelectorCopy,
} from './types'

export const fairlendRouteSelectorCopy = {
  kicker: 'Choose your route',
  title: (
    <>
      Where would you like
      <br />
      to go with FairLend?
    </>
  ),
  description: (
    <>
      FairLend offers multiple ways to move your project forward.
      <br />
      Choose the path that fits your goals and we&apos;ll guide the way.
    </>
  ),
} satisfies FairlendRouteSelectorCopy

export const fairlendRouteChoices = [
  {
    id: 'construction-financing',
    title: 'Get construction financing',
    description: 'Plan draws, capital, and takeout around how your project actually gets built.',
    bullets: [
      'Land, builds, and takeout planning',
      'Draw schedules built around milestones',
      'Access capital as work progresses',
      'Construction guidance from planning to completion',
    ],
    steps: ['Plan', 'Build', 'Draw', 'Complete'],
    ctaLabel: 'Get Approved',
    href: '/intake',
    icon: HardHat,
    illustration: fairlendRouteSelectorAssets.constructionBuilding,
    badge: 'Priority',
  },
  {
    id: 'private-mortgage',
    title: 'Get a private mortgage',
    description:
      "Access private mortgage financing when traditional lending doesn't fit your timing, property, or exit.",
    bullets: [
      '1st, 2nd, and 3rd mortgages',
      'Fast review and commitment options',
      'Fair fees and clear exit terms',
      'Local expertise, direct access',
    ],
    steps: ['Apply', 'Review', 'Approve', 'Fund'],
    ctaLabel: 'Get Approved',
    href: '/borrowers/private-mortgage-financing',
    icon: House,
    illustration: fairlendRouteSelectorAssets.privateMortgageHouse,
    badge: 'Popular',
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
  },
] satisfies FairlendRouteChoice[]

export const fairlendRouteHelpBanner = {
  title: 'Not sure what you need?',
  body: "Book a free consultation and we'll help you figure out the right financing path.",
  ctaLabel: 'Book consultation',
  image: fairlendRouteSelectorAssets.compass,
} satisfies FairlendRouteHelpBannerContent
