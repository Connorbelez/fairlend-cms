import type { Metadata } from 'next'

import { GardenSuiteMoneyPage } from '@/components/GardenSuiteMoneyPage'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

const pageDescription =
  'Plan, build and finance a Toronto Garden or Laneway Suite with FairLend and DrawFlow, including up to 15 milestone-based draws. Request an assessment.'

const baseMetadata = buildFairlendMetadata({
  description: pageDescription,
  image: '/assets/garden-suite/garden-suite-construction-hero-16x9-2k-clean.webp',
  imageAlt: 'A Toronto Garden Suite construction project with DrawFlow project-planning context',
  path: '/garden-suite-financing-gta',
  title: 'Garden Suite Financing Toronto & GTA | FairLend',
})

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    description:
      'An end-to-end Garden Suite team powered by DrawFlow: adaptive construction planning, milestone oversight and up to 15 borrower-controlled draws.',
    title: 'Plan, Build and Finance Your Garden Suite with FairLend',
  },
  twitter: {
    ...baseMetadata.twitter,
    card: 'summary_large_image',
    description:
      'An end-to-end Garden Suite team powered by DrawFlow: adaptive construction planning, milestone oversight and up to 15 borrower-controlled draws.',
    title: 'Plan, Build and Finance Your Garden Suite with FairLend',
  },
}

export default function GardenSuiteFinancingGtaPage() {
  return (
    <>
      <FairlendServiceSeo
        description={pageDescription}
        dateModified="2026-07-27"
        name="Garden Suite Financing in Toronto"
        path="/garden-suite-financing-gta"
        serviceType="Garden suite financing"
      />
      <GardenSuiteMoneyPage />
    </>
  )
}
