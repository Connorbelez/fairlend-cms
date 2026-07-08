import { FairlendInvestorFinalCta } from '@/components/FairlendInvestorFinalCta'
import { FairlendInvestorFit } from '@/components/FairlendInvestorFit'
import { FairlendInvestorFaq } from '@/components/FairlendInvestorFaq'
import { FairlendInvestorFractional } from '@/components/FairlendInvestorFractional'
import { FairlendInvestorHero } from '@/components/FairlendInvestorHero'
import { FairlendInvestorLeadership } from '@/components/FairlendInvestorLeadership'
import { FairlendInvestorManagedPlatform } from '@/components/FairlendInvestorManagedPlatform'
import { FairlendInvestorOpportunities } from '@/components/FairlendInvestorOpportunities'
import { FairlendInvestorPortal } from '@/components/FairlendInvestorPortal'
import { FairlendInvestorPrimer } from '@/components/FairlendInvestorPrimer'
import { FairlendInvestorProcess } from '@/components/FairlendInvestorProcess'
import { FairlendInvestorProtectionStack } from '@/components/FairlendInvestorProtectionStack'
import { FairlendInvestorRateReframe } from '@/components/FairlendInvestorRateReframe'
import { FairlendInvestorRegulatorBand } from '@/components/FairlendInvestorRegulatorBand'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { buildFairlendMetadata } from '@/utilities/seo'

const pageDescription =
  'Access curated private mortgage opportunities through FairLend with conservative underwriting, investor portal visibility, administration, and legal recovery support.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/investing/private-mortgage-lending',
  title: 'Private Mortgage Investing Ontario | FairLend',
})

const serviceSeo = {
  description:
    'Private mortgage investment access and administration for Ontario investors reviewing secured real estate lending opportunities.',
  name: 'Private Mortgage Investing Ontario',
  path: '/investing/private-mortgage-lending',
  serviceType: 'Private mortgage investing',
}

/**
 * Private Mortgage Lending — Investor Page.
 *
 * Thesis: FairLend gives investors access to private mortgage income through a
 * controlled, professionally administered process — and runs the entire
 * lifecycle on one platform. Two stories carry equal weight: managed
 * convenience (one platform end-to-end) and protection discipline (underwriting,
 * valuation, security, recovery). Credibility anchors (~$2B funded, ~30 years,
 * GTA-focused) are threaded through every section, not isolated in one bio box.
 *
 * Compliance: risk line stays clean throughout. No "guaranteed", "risk-free",
 * "safe", "principal protected", "CDIC-like", or "bank-account substitute"
 * language. Risk microcopy sits under the hero and the final CTA.
 */
export default function InvestorPrivateMortgageLendingPage() {
  return (
    <div className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendLandingRail>
        <FairlendInvestorHero />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorPrimer />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorRateReframe />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorProtectionStack />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorManagedPlatform />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorPortal />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorOpportunities />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorFractional />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorRegulatorBand />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorProcess />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorLeadership />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorFit />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorFaq />
      </FairlendLandingRail>
      <FairlendLandingRail>
        <FairlendInvestorFinalCta />
      </FairlendLandingRail>
    </div>
  )
}
