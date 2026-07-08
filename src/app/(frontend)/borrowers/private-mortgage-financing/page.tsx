import type { Metadata } from 'next'

import { FairlendBorrowerConsultation } from '@/components/FairlendBorrowerConsultation'
import { FairlendBorrowerHero } from '@/components/FairlendBorrowerHero'
import { FairlendBorrowerProblem } from '@/components/FairlendBorrowerProblem'
import { FairlendBorrowerSolution } from '@/components/FairlendBorrowerSolution'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'

export const metadata: Metadata = {
  title: 'Private Mortgage Financing Ontario | Clear Terms and Exit Plan | FairLend',
  description:
    'FairLend helps Ontario borrowers explore first, second, bridge, renewal, and equity-based private mortgage financing with transparent terms, disciplined review, and a practical exit plan.',
  alternates: { canonical: '/borrowers/private-mortgage-financing' },
}

/**
 * Private Mortgage Financing for Borrowers.
 *
 * Thesis spine (sections 1–3 + 9) per the page section breakdown. Sections
 * 4–8 (scenarios, differentiators, process, trust, FAQ) slot into rails
 * between Solution and Consultation without restructuring.
 */
export default function BorrowerPrivateMortgageFinancingPage() {
  return (
    <div className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <FairlendLandingRail>
        <FairlendBorrowerHero />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendBorrowerProblem />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendBorrowerSolution />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendBorrowerConsultation />
      </FairlendLandingRail>
    </div>
  )
}
