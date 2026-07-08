import type { Metadata } from 'next'

import { FairlendIntakeRouter } from '@/components/FairlendLeadIntake/FairlendIntakeRouter.client'

export const metadata: Metadata = {
  title: 'FairLend Request Desk | Mortgage, Build, Investor, and Partner Reviews',
  description:
    'Send the context behind a mortgage, build, investor, partner, or consultation request.',
}

export default function IntakePage() {
  return <FairlendIntakeRouter />
}
