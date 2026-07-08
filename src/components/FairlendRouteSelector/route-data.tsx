import { Handshake, HardHat, House, UsersRound } from 'lucide-react'

import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

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
    id: 'invest',
    title: 'Invest with FairLend',
    description:
      'Grow your portfolio with private mortgage and real estate-backed investment opportunities.',
    bullets: [
      'Curated investment opportunities',
      'Transparent terms and security',
      'Disciplined underwriting',
      'Ongoing investor reporting',
    ],
    steps: ['Explore', 'Review', 'Invest', 'Monitor'],
    ctaLabel: 'Explore investments',
    href: buildFairlendIntakeHref({ intent: 'invest', source: 'route-selector-invest' }),
    icon: UsersRound,
    illustration: fairlendRouteSelectorAssets.investorSkyline,
  },
  {
    id: 'private-mortgage',
    title: 'Get a private mortgage',
    description:
      "Access flexible, private mortgage financing when traditional lending doesn't fit.",
    bullets: [
      '1st, 2nd, and private mortgages',
      'Fast decisions, competitive terms',
      'Flexible solutions for your needs',
      'Local expertise, direct access',
    ],
    steps: ['Apply', 'Review', 'Approve', 'Fund'],
    ctaLabel: 'Start my mortgage',
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: 'route-selector-private-mortgage',
    }),
    icon: House,
    illustration: fairlendRouteSelectorAssets.privateMortgageHouse,
    badge: 'Popular',
  },
  {
    id: 'construction-financing',
    title: 'Get construction financing',
    description: 'Finance your project from the ground up with dependable construction funding.',
    bullets: [
      'Land, builds, and takeout',
      'Draw schedules that fit your plan',
      'Interest reserved during build',
      'Experienced construction lending',
    ],
    steps: ['Plan', 'Build', 'Draw', 'Complete'],
    ctaLabel: 'Finance my build',
    href: buildFairlendIntakeHref({
      intent: 'build',
      source: 'route-selector-construction-financing',
    }),
    icon: HardHat,
    illustration: fairlendRouteSelectorAssets.constructionBuilding,
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
    ctaLabel: 'Become a partner',
    href: buildFairlendIntakeHref({
      intent: 'partner-apply',
      source: 'route-selector-partner-program',
    }),
    icon: Handshake,
    illustration: fairlendRouteSelectorAssets.partnerHandshake,
  },
] satisfies FairlendRouteChoice[]

export const fairlendRouteHelpBanner = {
  title: 'Not sure which route is right for you?',
  body: "Answer a few questions and we'll point you in the right direction.",
  ctaLabel: 'Help me choose',
  href: buildFairlendIntakeHref({ intent: 'route-helper', source: 'route-selector-helper' }),
  image: fairlendRouteSelectorAssets.compass,
} satisfies FairlendRouteHelpBannerContent
