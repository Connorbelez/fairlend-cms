import type { Metadata } from 'next'

import { CalculatorDirectory } from '@/components/Calculators/CalculatorDirectory.client'
import { buildFairlendMetadata } from '@/utilities/seo'

export const metadata: Metadata = buildFairlendMetadata({
  description: 'Transparent private mortgage, construction, garden suite, multiplex, MLI Select, and mortgage investor calculators from FairLend.',
  path: '/calculators',
  title: 'Mortgage and Construction Calculators | FairLend',
})

export default function CalculatorsPage() {
  return <CalculatorDirectory />
}

