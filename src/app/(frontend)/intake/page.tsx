import type { Metadata } from 'next'

import { DrawflowIntake } from '@/components/DrawflowIntake/DrawflowIntake.client'

export const metadata: Metadata = {
  title: 'DrawFlow Intake | Fairlend',
  description:
    'Start a DrawFlow build financing review with property, stage, capital, team, and contact details.',
}

export default function IntakePage() {
  return <DrawflowIntake />
}
