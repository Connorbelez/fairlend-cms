import type { ReactElement } from 'react'

import { FairlendBuildModelSection } from '@/components/FairlendBuildModelSection'
import { FairlendBuilderConsultingSection } from '@/components/FairlendBuilderConsultingSection'
import { FairlendEthosSection } from '@/components/FairlendEthosSection'
import { FairlendFaqSection } from '@/components/FairlendFaqSection'
import { FairlendLandingOverviewSection } from '@/components/FairlendLandingOverviewSection'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendLeadershipSection } from '@/components/FairlendLeadershipSection'
import { FairlendTeamSection } from '@/components/FairlendTeamSection'

export function FairlendLandingSections(): ReactElement {
  return (
    <>
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
        <FairlendTeamSection />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendEthosSection />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendFaqSection />
      </FairlendLandingRail>
    </>
  )
}
