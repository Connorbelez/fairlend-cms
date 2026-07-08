import type { Metadata } from 'next'

import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import {
  FairlendPartnerBroker,
  FairlendPartnerConstruction,
  FairlendPartnerCredibility,
  FairlendPartnerDesign,
  FairlendPartnerFaqWrapper as FairlendPartnerFaq,
  FairlendPartnerFinalCta,
  FairlendPartnerHero,
  FairlendPartnerHowItWorks,
  FairlendPartnerLifecycle,
  FairlendPartnerProblem,
  FairlendPartnerProgram,
  FairlendPartnerProjectTypes,
  FairlendPartnerRealEstate,
  FairlendPartnerWhoFor,
} from '@/components/FairlendPartnerProgram'

export const metadata: Metadata = {
  title: 'FairLend Partner Program | Build Financing for the GTA Build Ecosystem',
  description:
    'The FairLend Partner Program gives mortgage brokers, agents, architects, planners, engineers, builders, and the wider GTA build ecosystem an end-to-end construction financing and execution partner. Bring us in before the project hardens.',
  alternates: { canonical: '/partners' },
}

/**
 * FairLend Partner Program.
 *
 * Thirteen rails assembled per the page section breakdown. Visual system is the
 * Editorial Topographic Grid (DESIGN.md): warm paper, ink type, electric lime
 * reserved for one dominant action per decision area, topographic contour
 * motifs, and pen-and-ink linework. Copy locked from the section breakdown.
 *
 * Compliance: $2B+ funded, "nearly three decades," DrawFlow, and any CMHC MLI
 * Select language are flagged in component source and must be substantiated
 * before publishing.
 */
export default function PartnerProgramPage() {
  return (
    <div className="fairlend-landing-page fairlend-partners-page min-h-svh bg-[#f8f7f5]">
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--paper"
        gutterTexture="fabric-of-squares"
      >
        <FairlendPartnerHero />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--ink"
        gutterTexture="grid-noise"
      >
        <FairlendPartnerProblem />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--chalk"
        gutterTexture="debut-light"
      >
        <FairlendPartnerProgram />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--forest"
        gutterTexture="inflicted"
      >
        <FairlendPartnerWhoFor />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--linen"
        gutterTexture="groovepaper"
      >
        <FairlendPartnerLifecycle />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--charcoal"
        gutterTexture="fabric-of-squares"
      >
        <FairlendPartnerBroker />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--paper"
        gutterTexture="grid-noise"
      >
        <FairlendPartnerRealEstate />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--blueprint"
        gutterTexture="inflicted"
      >
        <FairlendPartnerDesign />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--chalk"
        gutterTexture="groovepaper"
      >
        <FairlendPartnerConstruction />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--ink"
        gutterTexture="debut-light"
      >
        <FairlendPartnerHowItWorks />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--linen"
        gutterTexture="fabric-of-squares"
      >
        <FairlendPartnerProjectTypes />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--forest"
        gutterTexture="grid-noise"
      >
        <FairlendPartnerCredibility />
      </FairlendLandingRail>
      <FairlendLandingRail
        className="fairlend-partner-rail fairlend-partner-rail--lime-wash"
        gutterTexture="debut-light"
      >
        <FairlendPartnerFaq />
      </FairlendLandingRail>
      <FairlendLandingRail className="fairlend-partner-rail fairlend-partner-rail--charcoal [--landing-gutter-width:0px] [&_.fairlend-landing-rail-dots]:hidden">
        <FairlendPartnerFinalCta />
      </FairlendLandingRail>
    </div>
  )
}
