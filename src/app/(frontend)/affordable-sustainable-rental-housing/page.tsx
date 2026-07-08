import type { Metadata } from 'next'

import { FairlendFeedbackContentPage } from '@/components/FairlendFeedbackContentPage'
import { fairlendRouteSelectorAssets } from '@/components/FairlendRouteSelector/assets'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

export const metadata: Metadata = {
  title: 'Affordable Sustainable Rental Housing Financing | FairLend Mortgage',
  description:
    'FairLend reviews rental housing projects where affordability, operating resilience, and construction feasibility need to work in the same plan.',
  alternates: { canonical: '/affordable-sustainable-rental-housing' },
}

const intakeHref = buildFairlendIntakeHref({
  intent: 'build',
  source: 'affordable-sustainable-rental-housing',
})

export default function AffordableSustainableRentalHousingPage() {
  return (
    <FairlendFeedbackContentPage
      config={{
        eyebrow: 'Sustainable Housing',
        title: 'Capital for rentals built to last',
        subtitle:
          'FairLend reviews rental housing projects where affordability, operating resilience, and construction feasibility need to work in the same plan.',
        image: {
          ...fairlendRouteSelectorAssets.investorSkyline,
          alt: 'Sustainable rental housing financing illustration',
        },
        primaryCta: { href: intakeHref, label: 'Review rental project' },
        secondaryCta: { href: '/cmhc-mli-select-multiplex-financing', label: 'MLI Select route' },
        proof: ['Affordability', 'Operating resilience', 'Construction feasibility'],
        sections: [
          {
            kicker: 'Feasibility',
            title: 'The right projects get funded',
            body:
              'Land, scope, operating cost, debt service, schedule, exit, and whether the borrower can survive reimbursement timing determine feasibility. FairLend evaluates those pressures together before capital is framed as a fit.',
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
  )
}
