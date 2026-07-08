import type { Metadata } from 'next'

import { DrawflowIntake } from '@/components/DrawflowIntake/DrawflowIntake.client'

export const metadata: Metadata = {
  title: 'Builder Intake | FairLend Mortgage',
  description:
    'Start a FairLend Mortgage builder intake with visible fields, project context, legal acknowledgement, and shared licence footer.',
  alternates: { canonical: '/start/builder' },
}

export default function BuilderStartPage() {
  return <DrawflowIntake />
}
