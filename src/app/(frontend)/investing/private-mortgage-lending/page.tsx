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
import { FairlendScrollChoreography } from '@/components/FairlendScrollChoreography.client'
import { FairlendEditorialReview } from '@/components/SEO/FairlendEditorialReview'
import { FairlendGeoAnswerBlock } from '@/components/SEO/FairlendGeoAnswerBlock'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { buildFairlendMetadata } from '@/utilities/seo'
import { fairlendMortgageEditorialSources } from '@/lib/fairlend-editorial'

export const dynamic = 'force-static'

const pageDescription =
  'Review curated Ontario private mortgage opportunities with FairLend underwriting, investor portal reporting, administration, and recovery support.'

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
 * valuation, security, recovery). Quantitative credibility claims are centralized
 * with an as-of methodology and paired with the reviewer/source panel.
 *
 * Compliance: risk line stays clean throughout. No "guaranteed", "risk-free",
 * "safe", "principal protected", "CDIC-like", or "bank-account substitute"
 * language. Risk microcopy sits under the hero and the final CTA.
 */
export default function InvestorPrivateMortgageLendingPage() {
  return (
    <main className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
      <FairlendServiceSeo {...serviceSeo} dateModified="2026-07-14" reviewedByPrincipalBroker />
      <FairlendScrollChoreography surface="investor" />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendInvestorHero />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <div className="px-5 py-10 sm:px-8 lg:px-12">
          <FairlendGeoAnswerBlock
            answer={
              <p>
                Private mortgage investing means lending capital, directly or through a managed
                structure, against registered mortgage security on real estate. The investor&apos;s
                return generally comes from borrower interest and permitted fees, while the
                mortgage, supporting guarantees, appraisal, legal documents, loan-to-value, and exit
                plan define the risk position. Security does not eliminate risk: property values can
                fall, borrowers can default, interest can stop, enforcement can be slow and
                expensive, and invested capital can be illiquid or lost. A disciplined review
                examines borrower capacity, property value and marketability, lien priority,
                insurance, taxes, construction or renovation exposure, term, pricing, exit, legal
                enforceability, and downside recovery. Administration and reporting help manage the
                lifecycle but do not guarantee repayment or returns. Every opportunity should be
                assessed on its own facts, suitability, documentation, and concentration impact,
                with independent legal, tax, and financial advice where appropriate.
              </p>
            }
            comparison={{
              caption: 'Private mortgage investment review framework',
              columns: ['Evidence to review', 'Risk question'],
              rows: [
                {
                  label: 'Security',
                  values: [
                    'Appraisal, title, priority, insurance',
                    'What supports recovery after default?',
                  ],
                },
                {
                  label: 'Borrower',
                  values: [
                    'Capacity, credit, equity, experience',
                    'What supports payment and execution?',
                  ],
                },
                {
                  label: 'Exit',
                  values: [
                    'Sale, refinance, completion, repayment source',
                    'How and when can principal return?',
                  ],
                },
                {
                  label: 'Portfolio fit',
                  values: [
                    'Term, liquidity, exposure, concentration',
                    'Can the investor absorb delay or loss?',
                  ],
                },
              ],
            }}
            question="What is private mortgage investing?"
          />
        </div>
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="debut-light">
        <div className="px-5 py-10 sm:px-8 lg:px-12">
          <FairlendEditorialReview
            methodology="Mortgage-investment guidance is reviewed against current FSRA consumer and licensing materials. Career experience and funded-volume claims use FairLend internal funded-file records reviewed July 14, 2026. Every opportunity still requires deal-specific suitability, underwriting, legal, valuation, and risk review."
            sources={[
              ...fairlendMortgageEditorialSources,
              {
                href: 'https://www.fsrao.ca/consumers/mortgage-brokering',
                label: 'FSRA — investing in mortgages and licensed participants',
              },
              {
                href: 'https://www.fsrao.ca/licensing/mortgage-brokerage/about-mortgage-brokerage-and-mortgage-administrator-licences',
                label: 'FSRA — brokerage and administrator licensing',
              },
            ]}
          />
        </div>
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendInvestorPrimer />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendInvestorRateReframe />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="debut-light">
        <FairlendInvestorProtectionStack />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendInvestorManagedPlatform />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendInvestorPortal />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendInvestorOpportunities />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendInvestorFractional />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="debut-light">
        <FairlendInvestorRegulatorBand />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendInvestorProcess />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <FairlendInvestorLeadership />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="inflicted">
        <FairlendInvestorFit />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="grid-noise">
        <FairlendInvestorFaq />
      </FairlendLandingRail>
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendInvestorFinalCta />
      </FairlendLandingRail>
    </main>
  )
}
