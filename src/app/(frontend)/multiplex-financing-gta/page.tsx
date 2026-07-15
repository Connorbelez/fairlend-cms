import { FairlendFeedbackContentPage } from '@/components/FairlendFeedbackContentPage'
import { fairlendRouteSelectorAssets } from '@/components/FairlendRouteSelector/assets'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

const pageDescription =
  'FairLend helps GTA owners, builders, and brokers pressure-test multiplex budgets, draw timing, private capital needs, and MLI Select readiness.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/multiplex-financing-gta',
  title: 'Multiplex Financing GTA | FairLend',
})

const serviceSeo = {
  description: pageDescription,
  name: 'Multiplex Financing GTA',
  path: '/multiplex-financing-gta',
  serviceType: 'Multiplex financing',
}

const intakeHref = buildFairlendIntakeHref({
  intent: 'build',
  source: 'multiplex-financing-gta',
})

export default function MultiplexFinancingGtaPage() {
  return (
    <>
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendFeedbackContentPage
        config={{
          eyebrow: 'Multiplex financing GTA',
          title: 'A practical path from site to terms',
          subtitle:
            'FairLend helps owners, builders, brokers, and small developers pressure-test construction budgets and draw timing, size their private-capital needs, and confirm MLI Select readiness. Before a promising site stalls.',
          image: {
            ...fairlendRouteSelectorAssets.constructionBuilding,
            alt: 'Line illustration of a GTA construction building',
          },
          primaryCta: { href: intakeHref, label: 'Start multiplex review' },
          secondaryCta: {
            href: '/intake?intent=contact&source=multiplex-question',
            label: 'Talk to FairLend',
          },
          proof: [
            'Toronto and GTA sites',
            '3-unit conversions, fourplexes and sixplexes',
            'Mixed suite projects',
          ],
          sections: [
            {
              kicker: 'Fit',
              title: 'Who this is for',
              body: 'Multiplex projects usually fail when the financing equation is treated as an afterthought. FairLend reviews the site, unit mix, construction scope, borrower capital, rents, debt, and takeout path before the project hardens.',
              panels: [
                {
                  title: 'Owners and small developers',
                  body: 'Pressure-test whether the site, unit mix, construction budget, and projected rents support the intended capital architecture.',
                },
                {
                  title: 'Builders and project teams',
                  body: 'Align working capital, draw timing, evidence, and milestone review with the real construction sequence.',
                },
                {
                  title: 'Brokers and advisors',
                  body: 'Bring a complex file in early so the borrower sees the private capital, bridge, and insured takeout options clearly.',
                },
              ],
            },
            {
              kicker: 'Readiness',
              title: 'MLI Select readiness',
              body: 'Assemble the affordability, accessibility, and energy detail a strong MLI Select file needs. That gets your file CMHC submission-ready.',
              checklist: [
                'Affordability assumptions',
                'Accessibility details',
                'Energy performance detail',
                'Projected Rents',
                'Existing debt and borrower equity',
                'Budget, contingency, and draw schedule',
              ],
            },
            {
              kicker: 'Terms',
              title: 'What the review should produce',
              panels: [
                {
                  title: 'Capital architecture',
                  body: 'Private financing, construction financing, bridge capital, borrower equity, and insured takeout expectations are reviewed as one structure.',
                },
                {
                  title: 'Rate and fee ranges',
                  body: 'Rate and fee ranges, term length, conditions to clear, takeout expectations, and which files route to deeper underwriting.',
                },
                {
                  title: 'Draw timing',
                  body: 'Draw timing is mapped against completed work, lender evidence needs, review lag, release authority, and borrower working capital.',
                },
              ],
            },
          ],
          finalNote:
            'Financing is subject to underwriting, documentation, property value, project economics, borrower capacity, and available capital.',
        }}
      />
    </>
  )
}
