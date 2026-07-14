import { FairlendFeedbackContentPage } from '@/components/FairlendFeedbackContentPage'
import { fairlendRouteSelectorAssets } from '@/components/FairlendRouteSelector/assets'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { fairlendMortgageEditorialSources } from '@/lib/fairlend-editorial'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

const pageDescription =
  'FairLend reviews rental housing projects where affordability, operating resilience, and construction feasibility need to work in the same plan.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/affordable-sustainable-rental-housing',
  title: 'Sustainable Rental Housing Financing | FairLend',
})

const serviceSeo = {
  description: pageDescription,
  name: 'Sustainable Rental Housing Financing',
  path: '/affordable-sustainable-rental-housing',
  serviceType: 'Rental housing financing review',
}

const intakeHref = buildFairlendIntakeHref({
  intent: 'build',
  source: 'affordable-sustainable-rental-housing',
})

export default function AffordableSustainableRentalHousingPage() {
  return (
    <>
      <FairlendServiceSeo {...serviceSeo} dateModified="2026-07-14" reviewedByPrincipalBroker />
      <FairlendFeedbackContentPage
        config={{
          eyebrow: 'Sustainable Housing',
          title: 'Capital for rentals built to last',
          subtitle: pageDescription,
          image: {
            ...fairlendRouteSelectorAssets.investorSkyline,
            alt: 'Sustainable rental housing financing illustration',
          },
          primaryCta: { href: intakeHref, label: 'Review rental project' },
          secondaryCta: { href: '/multiplex-financing-gta', label: 'Multiplex financing' },
          proof: ['Affordability', 'Operating resilience', 'Construction feasibility'],
          geoAnswer: {
            question: 'What makes a rental housing project financeable?',
            answer: (
              <p>
                A rental housing project becomes financeable when its land basis, permitted scope,
                construction budget, schedule, borrower equity, projected rents, operating costs,
                debt service, and exit strategy support one coherent repayment plan. Lenders test
                more than the headline loan amount: they examine approvals, appraisal assumptions,
                lease-up timing, cost-to-complete, contingency, contractor capacity, environmental
                and building requirements, guarantees, and the borrower&apos;s ability to carry
                delays or reimbursement gaps. Affordability or energy-efficiency features can
                improve the operating case or program fit, but they do not replace viable project
                economics. The financing structure should match when costs occur, when draws can be
                requested, how interest is funded, and how the completed property will stabilize or
                refinance. Program eligibility, pricing, leverage, approvals, and funding remain
                subject to current lender rules, verified documentation, valuation, available
                capital, and applicable government requirements.
              </p>
            ),
            comparison: {
              caption: 'Rental project financing evidence',
              columns: ['Evidence', 'Core question'],
              rows: [
                {
                  label: 'Development',
                  values: ['Approvals, scope, budget, schedule', 'Can the project be completed?'],
                },
                {
                  label: 'Operations',
                  values: [
                    'Rents, vacancy, expenses, reserves',
                    'Can the property carry the debt?',
                  ],
                },
                {
                  label: 'Capital',
                  values: [
                    'Equity, draws, contingency, exit',
                    'Can delays and overruns be absorbed?',
                  ],
                },
              ],
            },
          },
          editorial: {
            sources: [
              ...fairlendMortgageEditorialSources,
              {
                href: 'https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance',
                label: 'CMHC — multi-unit and rental housing mortgage loan insurance',
              },
            ],
          },
          sections: [
            {
              kicker: 'Feasibility',
              title: 'The right projects get funded',
              body: 'Land, scope, operating cost, debt service, schedule, exit, and whether the borrower can survive reimbursement timing determine feasibility. FairLend evaluates those pressures together before capital is framed as a fit.',
              panels: [
                {
                  title: 'Rental projects',
                  body: 'For builders and owners creating rental projects where cost, debt service, and projected rents must support the plan.',
                },
                {
                  title: 'Operating cost',
                  body: 'Sustainable choices reduce operating cost when the design, budget, and financing path are reviewed together.',
                },
                {
                  title: 'Projected rents',
                  body: 'Rent logic is grounded in projected rents, evidence, operating assumptions, and the exit plan.',
                },
              ],
            },
            {
              kicker: 'Execution',
              title: 'From project inception to draw discipline',
              checklist: [
                'Site and land basis',
                'Scope and construction budget',
                'Operating cost pressure',
                'Sustainable choices reduce operating cost',
                'Debt service and reimbursement timing',
                'Exit and stabilization path',
              ],
            },
          ],
          finalNote:
            'Financing remains subject to underwriting, documentation, property value, borrower capacity, project economics, and available capital.',
        }}
      />
    </>
  )
}
