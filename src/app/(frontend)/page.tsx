import { FairlendBuilderConsultingSection } from '@/components/FairlendBuilderConsultingSection'
import { FairlendBuildModelSection } from '@/components/FairlendBuildModelSection'
import { FairlendFaqSection } from '@/components/FairlendFaqSection'
import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLandingOverviewSection } from '@/components/FairlendLandingOverviewSection'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendLeadershipSection } from '@/components/FairlendLeadershipSection'
import { FairlendRouteSelector } from '@/components/FairlendRouteSelector'
import { FairlendScrollChoreography } from '@/components/FairlendScrollChoreography.client'
import { buildFairlendMetadata } from '@/utilities/seo'

export const metadata = buildFairlendMetadata({
  description:
    'FairLend guides Toronto builders, borrowers, and investors through private mortgage, acquisition, construction, and completion financing.',
  path: '/',
  title: 'FairLend Mortgage | Private Real Estate Financing Ontario',
})

export default function Page() {
  return (
    <div className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <FairlendScrollChoreography />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendLandingHero />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendRouteSelector id="services" />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendLandingOverviewSection />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendBuildModelSection />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="debut-light">
        <FairlendBuilderConsultingSection />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendLeadershipSection />
      </FairlendLandingRail>
      <FairlendLandingRail className="[--landing-gutter-width:0px] [&_.fairlend-landing-rail-dots]:hidden">
        <FairlendFaqSection />
      </FairlendLandingRail>
    </div>
  )
}
