import type { Metadata } from 'next'

import { FairlendJudgmentSection } from '@/components/FairlendJudgmentSection'
import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLeadershipSection } from '@/components/FairlendLeadershipSection'
import { FairlendOpportunityCanvas } from '@/components/FairlendOpportunityCanvas'
import { FairlendScrollChoreography } from '@/components/FairlendScrollChoreography.client'

export const metadata: Metadata = {
  title: 'Fairlend | Multiplex, Single Family, and Land Financing',
  description:
    'Fairlend guides Toronto builders and investors through permit, acquisition, construction, and completion financing.',
}

export default function Page() {
  return (
    <div className="min-h-svh bg-[rgb(255_253_247)]">
      <FairlendScrollChoreography />
      <FairlendLandingHero />
      <FairlendOpportunityCanvas />
      <FairlendJudgmentSection />
      <FairlendLeadershipSection />
    </div>
  )
}
