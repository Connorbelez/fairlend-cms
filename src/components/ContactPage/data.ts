export type ContactPathway = {
  code: string
  description: string
  href: string
  label: string
}

export const contactPathways = [
  {
    code: 'Private / bridge',
    description: 'Private mortgages, refinances, bridge needs, and time-sensitive closings.',
    href: '/borrowers/private-mortgage-financing',
    label: 'Borrower financing',
  },
  {
    code: 'Construction / draws',
    description: 'Ground-up construction, infill, multiplex, and draw-based project capital.',
    href: '/construction-draw-financing',
    label: 'Builder financing',
  },
  {
    code: 'Capital / suitability',
    description: 'FairLend’s suitability-first approach to private mortgage investing.',
    href: '/investing/private-mortgage-lending',
    label: 'Private mortgage investing',
  },
  {
    code: 'Referral / collaboration',
    description: 'Broker, developer, and professional referral scenarios for review.',
    href: '/partners',
    label: 'Partner with FairLend',
  },
] as const satisfies readonly ContactPathway[]
