import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLandingOverviewSection } from '@/components/FairlendLandingOverviewSection'
import { FairlendDeferredLandingSections } from '@/components/FairlendDeferredLandingSections.client'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendRouteSelector } from '@/components/FairlendRouteSelector'
import {
  FairlendStaticBuilderConsulting,
  FairlendStaticBuildModel,
  FairlendStaticEthos,
  FairlendStaticFaq,
  FairlendStaticLeadershipTeam,
} from '@/components/FairlendStaticHomepageFallbacks'
import { JsonLd } from '@/components/SEO/JsonLd'
import { buildFairlendMetadata } from '@/utilities/seo'
import {
  buildHomepageOfferCatalogJsonLd,
  buildWebPageJsonLd,
  getSchemaNodeId,
} from '@/utilities/structuredData'

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
        data={[
          buildWebPageJsonLd({
            description:
              'FairLend guides Southern Ontario builders, borrowers, and investors through private mortgage, acquisition, construction, and completion financing.',
            hasBreadcrumb: false,
            mainEntityId: getSchemaNodeId('/', 'organization'),
            name: 'FairLend Mortgage | Private Real Estate Financing Ontario',
            path: '/',
          }),
          buildHomepageOfferCatalogJsonLd(),
        ]}
      />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendLandingHero />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <div className="min-h-[2500px] bg-[#f8f7f5] xl:min-h-[720px]" id="services">
          <FairlendRouteSelector />
        </div>
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendLandingOverviewSection />
      </FairlendLandingRail>
      <FairlendDeferredLandingSections
        buildModelFallback={<FairlendStaticBuildModel />}
        builderConsultingFallback={<FairlendStaticBuilderConsulting />}
        ethosFallback={<FairlendStaticEthos />}
        faqFallback={<FairlendStaticFaq />}
        teamFallback={<FairlendStaticLeadershipTeam />}
      />
    </main>
  )
}
