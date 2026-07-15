import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLandingOverviewSection } from '@/components/FairlendLandingOverviewSection'
import { FairlendDeferredLandingSections } from '@/components/FairlendDeferredLandingSections.client'
import { FairlendDeferredRouteSelector } from '@/components/FairlendDeferredRouteSelector.client'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { JsonLd } from '@/components/SEO/JsonLd'
import { buildFairlendMetadata } from '@/utilities/seo'
import { buildWebPageJsonLd, getSchemaNodeId } from '@/utilities/structuredData'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'FairLend guides Southern Ontario builders, borrowers, and investors through private mortgage, acquisition, construction, and completion financing.',
  path: '/',
  title: 'FairLend Mortgage | Private Real Estate Financing Ontario',
})

export default function Page() {
  return (
    <main className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <JsonLd
        data={buildWebPageJsonLd({
          description:
            'FairLend guides Southern Ontario builders, borrowers, and investors through private mortgage, acquisition, construction, and completion financing.',
          hasBreadcrumb: false,
          mainEntityId: getSchemaNodeId('/', 'organization'),
          name: 'FairLend Mortgage | Private Real Estate Financing Ontario',
          path: '/',
        })}
      />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendLandingHero />
      </FairlendLandingRail>
      <FairlendDeferredRouteSelector />
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendLandingOverviewSection />
      </FairlendLandingRail>
      <FairlendDeferredLandingSections />
    </main>
  )
}
