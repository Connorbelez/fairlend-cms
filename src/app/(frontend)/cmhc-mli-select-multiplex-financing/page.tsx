import type { Metadata } from 'next'

import { FairlendUnderConstructionEmptyState } from '@/components/FairlendUnderConstructionEmptyState'

export const metadata: Metadata = {
  title: 'CMHC MLI Select Multiplex Financing | FairLend Mortgage',
  description:
    'FairLend helps package MLI Select-ready multiplex files around affordability, accessibility, energy detail, budget, debt, unit mix, and financing route.',
  alternates: { canonical: '/cmhc-mli-select-multiplex-financing' },
}

export default function CmhcMliSelectMultiplexFinancingPage() {
  return (
    <FairlendUnderConstructionEmptyState
      description="The CMHC MLI Select resource is being rebuilt into a sharper financing guide. Book a consultation and we can review affordability, energy, accessibility, unit mix, budget, and debt structure directly."
      source="cmhc-mli-select-under-construction"
      title="The MLI Select guide is under construction."
    />
  )
}
