import type { Metadata } from 'next'

import { FairlendJudgmentSection } from '@/components/FairlendJudgmentSection'
import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendOpportunityCanvas } from '@/components/FairlendOpportunityCanvas'
import { FairlendScrollChoreography } from '@/components/FairlendScrollChoreography.client'

export const metadata: Metadata = {
  title: 'Fairlend | Multiplex, Single Family, and Land Financing',
  description:
    'Fairlend guides Toronto builders and investors through permit, acquisition, construction, and completion financing.',
}

export default function FairlendLandingHeroPage() {
  return (
    <div className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <FairlendScrollChoreography />
      <FairlendLandingRail>
        <FairlendLandingHero />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendOpportunityCanvas />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendJudgmentSection />
      </FairlendLandingRail>
    </div>
  )
}
