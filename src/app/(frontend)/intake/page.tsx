import { FairlendIntakeRouter } from '@/components/FairlendLeadIntake/FairlendIntakeRouter.client'
import { buildFairlendMetadata } from '@/utilities/seo'
import { Suspense } from 'react'

export const metadata = buildFairlendMetadata({
  description:
    'Send the context behind a mortgage, build, investor, partner, or consultation request.',
  index: false,
  path: '/intake',
  title: 'FairLend Request Desk',
})

export default function IntakePage() {
  return (
    <Suspense fallback={null}>
      <FairlendIntakeRouter />
    </Suspense>
  )
}
