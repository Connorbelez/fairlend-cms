import type { Metadata } from 'next'

import { FairlendBorrowerConsultation } from '@/components/FairlendBorrowerConsultation'
import { FairlendBorrowerDifferentiators } from '@/components/FairlendBorrowerDifferentiators'
import { FairlendBorrowerFaq } from '@/components/FairlendBorrowerFaq'
import { FairlendBorrowerHero } from '@/components/FairlendBorrowerHero'
import { FairlendBorrowerProcess } from '@/components/FairlendBorrowerProcess'
import { FairlendBorrowerProblem } from '@/components/FairlendBorrowerProblem'
import { FairlendBorrowerScenarios } from '@/components/FairlendBorrowerScenarios'
import { FairlendBorrowerSolution } from '@/components/FairlendBorrowerSolution'
import { FairlendBorrowerTrustProof } from '@/components/FairlendBorrowerTrustProof'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'

export const metadata: Metadata = {
  title: 'Private Mortgage Financing Ontario | Fast, Clear Private Mortgage Options | FairLend',
  description:
    'Need a private mortgage in Ontario? FairLend helps borrowers review first, second, bridge, renewal, and equity-based options with clear costs, timing, and an exit plan.',
  alternates: { canonical: '/borrowers/private-mortgage-financing' },
}

/**
 * Private Mortgage Financing for Borrowers.
 *
 * Full nine-section page per the borrower section breakdown: hero, problem,
 * solution, scenarios, differentiators, process, trust/proof, FAQ, final CTA.
 */
export default function BorrowerPrivateMortgageFinancingPage() {
  return (
    <div className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendBorrowerHero />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendBorrowerProblem />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendBorrowerSolution />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="debut-light">
        <FairlendBorrowerScenarios />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendBorrowerDifferentiators />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendBorrowerProcess />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendBorrowerTrustProof />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendBorrowerFaq />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendBorrowerConsultation />
      </FairlendLandingRail>
    </div>
  )
}
