import { FairlendFeedbackContentPage } from '@/components/FairlendFeedbackContentPage'
import { fairlendBuildPropertyTypesAssets } from '@/components/FairlendBuildPropertyTypes'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

const pageDescription =
  'FairLend reviews GTA garden suite projects around property, mortgage position, permit stage, budget, draw timing, rental assumptions, and borrower liquidity.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/garden-suite-financing-gta',
  title: 'Garden Suite Financing GTA | FairLend',
})

const serviceSeo = {
  description: pageDescription,
  name: 'Garden Suite Financing GTA',
  path: '/garden-suite-financing-gta',
  serviceType: 'Garden suite financing',
}

const intakeHref = buildFairlendIntakeHref({
  intent: 'build',
  source: 'garden-suite-financing-gta',
})

export default function GardenSuiteFinancingGtaPage() {
  return (
    <>
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendFeedbackContentPage
        config={{
          eyebrow: 'Garden suite financing GTA',
          title: 'Garden suite financing for real project constraints.',
          subtitle:
            'Garden suites stall on cash flow, not construction. We check the property, your mortgage position, permits, budget, and draw timing before the build starts — so funding arrives when each stage needs it.',
          image: {
            ...fairlendBuildPropertyTypesAssets.singleFamily,
            alt: 'Line illustration of a residential property for a garden suite review',
          },
          primaryCta: { href: intakeHref, label: 'Start garden suite intake' },
          secondaryCta: { href: intakeHref, label: 'Check eligibility' },
          proof: ['Existing mortgage and equity', 'Plans and permit stage', 'Builder context'],
          sections: [
            {
              kicker: 'Review',
              title: 'What the review pulls in',
              body: 'Existing mortgage debt, available equity, borrower liquidity, and rental intent are weighed together, not one at a time.',
              checklist: [
                'Property and ownership',
                'Mortgage and equity',
                'Plans and permit stage',
                'Budget and contingency',
                'Rental and exit assumptions',
                'Builder context',
              ],
            },
            {
              kicker: 'Draw readiness',
              title: 'Funding planned before crews wait',
              body: 'Garden suite construction strains cash when the draw schedule is an afterthought. We map how each stage gets verified and funded before crews are standing around waiting to be paid.',
              panels: [
                {
                  title: 'Draw readiness',
                  body: 'Construction funding moves fastest when completed work, site verification, and release timing are planned before the first draw.',
                },
                {
                  title: 'Equity position',
                  body: 'Existing mortgage debt, available equity, borrower liquidity, and rental intent are weighed together, not one at a time.',
                },
                {
                  title: 'Property-specific review',
                  body: 'The review is organized around the borrower, property, permit stage, and funding path, not generic lane language.',
                },
              ],
            },
            {
              kicker: 'Blockers',
              title: 'What kills a deal',
              checklist: [
                'Contingency too thin',
                'Permit status unclear',
                'Budget not tied to scope',
                'Rental assumptions without evidence',
                'Liquidity below working-capital need',
              ],
            },
          ],
          finalNote:
            'FairLend Mortgage structures the review around site constraints, borrower liquidity, and the timing of reimbursement draws.',
        }}
      />
    </>
  )
}
