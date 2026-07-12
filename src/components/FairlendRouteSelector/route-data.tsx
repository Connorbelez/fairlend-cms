import { Handshake, HardHat, House, Landmark, UsersRound } from 'lucide-react'

import { buildFairlendMortgageHref } from '@/lib/fairlend-intake'

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
      <br className="xl:hidden" />
      to go with FairLend?
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
    ],
    steps: ['Plan', 'Build', 'Draw', 'Complete'],
    stepDescriptions: [
      'Map the capital and scope',
      'Start with a clear schedule',
      'Release funds by stage',
      'Finish and plan the takeout',
    ],
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
    href: buildFairlendMortgageHref('route-selector-private-mortgage'),
    icon: House,
    illustration: fairlendRouteSelectorAssets.privateMortgageHouse,
    badge: 'Popular',
  },
  {
    id: 'institutional-mortgage',
    title: 'Institutional mortgages',
    description:
      "Access competitive mortgage financing when the banks say no, backed by FairLend's nationwide lender network.",
    bullets: [
      'Competitive rates when the banks say no',
      'Flexible options',
      'Series A & B lenders',
      'Access to thousands of institutional lenders across Canada',
      'Fast commitment—get the money when you need it',
    ],
    steps: ['Apply', 'Match', 'Commit', 'Fund'],
    ctaLabel: 'Get Approved',
    href: '/borrowers/institutional-mortgage',
    icon: Landmark,
    illustration: fairlendRouteSelectorAssets.institutionalMortgage,
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
