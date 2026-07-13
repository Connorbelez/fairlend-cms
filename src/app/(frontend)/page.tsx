import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendLandingSections } from '@/components/FairlendLandingSections'
import { FairlendLazyScrollChoreography } from '@/components/FairlendLazyScrollChoreography.client'
import { FairlendRouteSelector } from '@/components/FairlendRouteSelector'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'FairLend guides Toronto builders, borrowers, and investors through private mortgage, acquisition, construction, and completion financing.',
  path: '/',
  title: 'FairLend Mortgage | Private Real Estate Financing Ontario',
})

export default function Page() {
  return (
    <div className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <FairlendLazyScrollChoreography />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendLandingHero />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendRouteSelector id="services" />
      </FairlendLandingRail>
      <FairlendLandingSections />
    </div>
  )
}
