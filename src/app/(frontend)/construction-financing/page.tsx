import { FairlendIntakeRouter } from '@/components/FairlendLeadIntake/FairlendIntakeRouter.client'
import { buildFairlendMetadata } from '@/utilities/seo'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = buildFairlendMetadata({
  description:
    'Start a FairLend construction financing request for a new build, renovation, multiplex, garden suite, refinance, or land project.',
  index: true,
  path: '/construction-financing',
  title: 'Construction Financing Application',
})

export default function ConstructionFinancingPage() {
  return (
    <Suspense fallback={null}>
      <FairlendIntakeRouter />
    </Suspense>
  )
}
