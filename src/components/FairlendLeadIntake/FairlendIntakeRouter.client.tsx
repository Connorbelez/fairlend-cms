'use client'

import { useSearchParams } from 'next/navigation'

import { DrawflowIntake } from '@/components/DrawflowIntake/DrawflowIntake.client'
import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'
import {
  fairlendBuildIntent,
  resolveFairlendIntakeIntent,
  resolveFairlendRentalPropertyTransaction,
} from '@/lib/fairlend-intake'

export function FairlendIntakeRouter() {
  const searchParams = useSearchParams()
  const intent = resolveFairlendIntakeIntent(searchParams.get('intent'), searchParams.get('source'))
  const rentalPropertyTransaction = resolveFairlendRentalPropertyTransaction(
    searchParams.get('source'),
  )

  if (intent === fairlendBuildIntent) {
    return <DrawflowIntake />
  }

  return (
    <FairlendLeadIntake
      intentOverride={intent}
      mortgageProduct={
        intent === 'mortgage'
          ? rentalPropertyTransaction
            ? 'rental-property'
            : 'residential'
          : undefined
      }
      rentalPropertyTransaction={rentalPropertyTransaction ?? undefined}
    />
  )
}
