import { FairlendLandingHero } from '@/components/FairlendLandingHero'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendLandingSections } from '@/components/FairlendLandingSections'
import { FairlendRouteSelector } from '@/components/FairlendRouteSelector'
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
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendRouteSelector id="services" />
      </FairlendLandingRail>
      <FairlendLandingSections />
    </main>
  )
}
