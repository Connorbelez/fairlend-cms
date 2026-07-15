import { fairlendRouteChoices } from '@/components/FairlendRouteSelector/route-data'

export const fairlendAudiencePaths = fairlendRouteChoices.map((route) => ({
  badge: 'badge' in route ? route.badge : undefined,
  bullets: route.bullets,
  ctaLabel: route.ctaLabel,
  description: route.description,
  disclaimer: 'disclaimer' in route ? route.disclaimer : undefined,
  href: route.href,
  id: route.id,
  services: 'services' in route ? route.services : undefined,
  steps: route.steps,
  title: route.title,
}))

export const fairlendBuildModelStages = [
  {
    name: 'Plan',
    summary:
      'Test whether the site, project economics, zoning, unit mix, budget, timeline, expected value, and intended exit support a financeable build before committing more capital.',
  },
  {
    name: 'Finance',
    summary:
      'Align the land basis, construction budget, borrower equity, working-capital needs, project milestones, and exit in one construction-financing structure.',
  },
  {
    name: 'Build support',
    summary:
      'Coordinate the project team and adjust milestone draws as the work and capital requirements change, subject to the financing terms.',
  },
  {
    name: 'Takeout',
    summary:
      'Shape the project, documentation, and operating plan toward an eligible refinance, sale, rental stabilization, or CMHC-insured takeout path.',
  },
  {
    name: 'Build recovery',
    summary:
      'Review schedule, budget, trades, working capital, draw requirements, and documentation to diagnose a stalled build and coordinate an appropriate recovery plan.',
  },
] as const

export const fairlendBuilderEconomicsTimeline = [
  {
    label: '2019 — luxury infill',
    summary:
      'Toronto luxury single-family assumptions could still produce a positive estimated return in the illustrative FairLend model.',
  },
  {
    label: '2023 — costs reprice the deal',
    summary:
      'Higher acquisition, construction, and financing assumptions show how quickly the estimated return can compress.',
  },
  {
    label: '2026 — density changes the model',
    summary:
      'Multiplex and garden-suite options can expand housing output and rental capacity, but they do not guarantee project profit.',
  },
] as const

export const fairlendLeadershipTeam = [
  {
    name: 'Elie Soberano',
    role: 'Founder, Principal Broker & MIC Director',
    summary:
      'Leads mortgage brokerage, private lending, construction-financing, and investment-finance strategy.',
  },
  {
    name: 'Connor Beleznay',
    role: 'CTO & MIC Director',
    summary:
      'Leads capital-markets systems and AI infrastructure built around human-led underwriting.',
  },
  {
    name: 'Bogdan Krystek',
    role: 'CFO & MIC Director',
    summary:
      'Leads financial oversight, capital planning, reporting, and controls across FairLend.',
  },
  {
    name: 'Joel Brenner',
    role: 'CLO',
    summary:
      'Leads legal and risk work, drawing on private-equity, real-estate-law, and cybersecurity experience.',
  },
] as const

export const fairlendMachineContentReviewedAt = '2026-07-15'
