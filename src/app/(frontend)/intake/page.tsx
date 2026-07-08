import { FairlendIntakeRouter } from '@/components/FairlendLeadIntake/FairlendIntakeRouter.client'
import { buildFairlendMetadata } from '@/utilities/seo'

export const metadata = buildFairlendMetadata({
  description:
    'Send the context behind a mortgage, build, investor, partner, or consultation request.',
  index: false,
  path: '/intake',
  title: 'FairLend Request Desk',
})

export default function IntakePage() {
  return <FairlendIntakeRouter />
}
