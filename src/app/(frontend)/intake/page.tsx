import type { Metadata } from 'next'

import { FairlendIntakeRouter } from '@/components/FairlendLeadIntake/FairlendIntakeRouter.client'

export const metadata: Metadata = {
  title: 'FairLend Intake | Mortgage, Build, Investor, and Partner Requests',
  description:
    'Start a FairLend intake for build financing, private mortgage review, investor conversations, partner referrals, consultation requests, and follow-up workflows.',
}

export default function IntakePage() {
  return <FairlendIntakeRouter />
}
