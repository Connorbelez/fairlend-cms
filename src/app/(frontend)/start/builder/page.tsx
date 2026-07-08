import { DrawflowIntake } from '@/components/DrawflowIntake/DrawflowIntake.client'
import { buildFairlendMetadata } from '@/utilities/seo'

export const metadata = buildFairlendMetadata({
  description:
    'Start a FairLend Mortgage builder intake with visible fields, project context, legal acknowledgement, and shared licence footer.',
  index: false,
  path: '/start/builder',
  title: 'Builder Intake | FairLend',
})

export default function BuilderStartPage() {
  return <DrawflowIntake />
}
