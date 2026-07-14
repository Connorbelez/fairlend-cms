import type { ReactElement } from 'react'

import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendEditorialReview } from '@/components/SEO/FairlendEditorialReview'
import { FairlendGeoAnswerBlock } from '@/components/SEO/FairlendGeoAnswerBlock'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { fairlendMortgageEditorialSources } from '@/lib/fairlend-editorial'
import { buildFairlendMetadata } from '@/utilities/seo'

import {
  DeclineDecoder,
  FitDecision,
  InstitutionalCover,
  LenderFitMatrix,
  MatchingRoute,
  QuestionRegister,
  TermSheet,
} from './sections'
import './institutional-mortgage.css'

export const dynamic = 'force-static'

const pageDescription =
  'Compare institutional mortgage options across Ontario banks, credit unions, trust companies, and monoline lenders with FairLend’s qualification guidance.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/borrowers/institutional-mortgage',
  title: 'Institutional Mortgage Financing Ontario | FairLend',
})

const serviceSeo = {
  description: pageDescription,
  name: 'Institutional Mortgage Financing Ontario',
  path: '/borrowers/institutional-mortgage',
  serviceType: 'Institutional mortgage brokerage',
}

export default function InstitutionalMortgagePage(): ReactElement {
  return (
    <div className="im-page" data-institutional-mortgage-page>
      <FairlendServiceSeo {...serviceSeo} dateModified="2026-07-14" reviewedByPrincipalBroker />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <main className="im-file">
          <InstitutionalCover />
          <div className="px-4 py-10 sm:px-8 lg:px-12">
            <FairlendGeoAnswerBlock
              answer={
                <p>
                  An institutional mortgage is real-estate-secured financing offered by a bank,
                  credit union, trust company, or monoline lender under documented lending policy.
                  Approval generally depends on verified income, credit history, debt-service
                  ratios, down payment or equity, property type and condition, appraisal, and the
                  lender&apos;s current risk limits. Institutional financing is usually the
                  lowest-cost route for a borrower who fits policy, but the cheapest advertised rate
                  is not automatically the best term: prepayment privileges, penalties, portability,
                  amortization, fees, qualification rules, and renewal strategy all affect total
                  cost. A broker&apos;s role is to structure the file, identify realistic lender
                  fits, compare complete offers, coordinate conditions, and explain trade-offs.
                  Lenders make the final credit decision. Rates, approval, conditions, valuation,
                  and funding remain subject to the borrower&apos;s verified circumstances, the
                  property, lender policy, market conditions, and applicable mortgage rules.
                </p>
              }
              comparison={{
                caption: 'Common institutional lender differences',
                columns: ['Banks and trusts', 'Credit unions and monolines'],
                rows: [
                  {
                    label: 'Policy fit',
                    values: [
                      'Standardized national programs',
                      'May offer distinct niches or channels',
                    ],
                  },
                  {
                    label: 'Price',
                    values: ['Rate plus fees and penalties', 'Rate plus fees and penalties'],
                  },
                  {
                    label: 'Review focus',
                    values: [
                      'Income, credit, debt service, property',
                      'Income, credit, debt service, property',
                    ],
                  },
                  {
                    label: 'Decision',
                    values: [
                      'Final approval belongs to the lender',
                      'Final approval belongs to the lender',
                    ],
                  },
                ],
              }}
              question="What is an institutional mortgage?"
            />
          </div>
          <LenderFitMatrix />
          <DeclineDecoder />
          <TermSheet />
          <MatchingRoute />
          <FitDecision />
          <div className="px-4 py-10 sm:px-8 lg:px-12">
            <FairlendEditorialReview
              sources={[
                ...fairlendMortgageEditorialSources,
                {
                  href: 'https://www.fsrao.ca/consumers/mortgage-brokering/working-mortgage-professional',
                  label: 'FSRA — working with an Ontario mortgage professional',
                },
                {
                  href: 'https://www.fsrao.ca/consumers/mortgage-brokering/mortgage-application-process',
                  label: 'FSRA — Ontario mortgage application process',
                },
              ]}
            />
          </div>
          <QuestionRegister />
        </main>
      </FairlendLandingRail>
    </div>
  )
}
