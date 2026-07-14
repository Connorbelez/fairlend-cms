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
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

const pageDescription =
  'FairLend helps Southern Ontario brokers, agents, designers, planners, engineers, and builders structure financing earlier for complex build projects.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/partners',
  title: 'FairLend Partner Program | Southern Ontario Build Financing',
})

const serviceSeo = {
  description:
    'Partner program for Southern Ontario real estate, mortgage, design, planning, and construction professionals who need financing structure for build projects.',
  name: 'FairLend Partner Program',
  path: '/partners',
  serviceType: 'Build financing partner program',
}

/**
 * FairLend Partner Program.
 *
 * Thirteen rails assembled per the page section breakdown. Visual system is the
 * Editorial Topographic Grid (DESIGN.md): warm paper, ink type, electric lime
 * reserved for one dominant action per decision area, topographic contour
 * motifs, and pen-and-ink linework. Copy locked from the section breakdown.
 *
 * Quantitative credibility claims are centralized with an as-of methodology.
 * DrawFlow and CMHC MLI Select language remain narrowly scoped and qualified.
 */
export default function PartnerProgramPage() {
  return (
    <main className="fairlend-landing-page fairlend-partners-page min-h-svh bg-[#f8f7f5]">
      <FairlendServiceSeo {...serviceSeo} />
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
    </main>
  )
}
