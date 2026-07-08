'use client'

import { useSearchParams } from 'next/navigation'

import { DrawflowIntake } from '@/components/DrawflowIntake/DrawflowIntake.client'
import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'
import { fairlendBuildIntent, normalizeFairlendIntakeIntent } from '@/lib/fairlend-intake'

export function FairlendIntakeRouter() {
  const searchParams = useSearchParams()
  const intent = normalizeFairlendIntakeIntent(searchParams.get('intent'))

  if (intent === fairlendBuildIntent) {
    return <DrawflowIntake />
  }

  return <FairlendLeadIntake />
}
