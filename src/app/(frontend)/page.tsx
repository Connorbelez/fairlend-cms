import type { Metadata } from 'next'

import { FairlendAboutStorySection } from '@/components/FairlendAboutStorySection'
import { FairlendBuilderConsultingSection } from '@/components/FairlendBuilderConsultingSection'
import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLeadershipSection } from '@/components/FairlendLeadershipSection'
import { FairlendScrollChoreography } from '@/components/FairlendScrollChoreography.client'
import { FairlendServicesSection } from '@/components/FairlendServicesSection'

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
      <FairlendServicesSection />
      <FairlendAboutStorySection />
      <FairlendBuilderConsultingSection />
      <FairlendLeadershipSection />
    </div>
  )
}
