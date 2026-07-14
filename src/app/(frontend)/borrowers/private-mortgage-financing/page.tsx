import { type ReactElement } from 'react'

import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendEditorialReview } from '@/components/SEO/FairlendEditorialReview'
import { FairlendGeoAnswerBlock } from '@/components/SEO/FairlendGeoAnswerBlock'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { fairlendMortgageEditorialSources } from '@/lib/fairlend-editorial'
import { buildFairlendMetadata } from '@/utilities/seo'

import {
  CostXray,
  CoverSheet,
  ExitRoute,
  IncidentBoard,
  JudgmentDesk,
  QuestionRegister,
} from './sections'

import './private-mortgage-financing.css'

export const dynamic = 'force-static'

const pageDescription =
  'Explore private mortgage options in Ontario for first, second, bridge, renewal, and equity financing, with clear costs, timing, and an exit plan.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/borrowers/private-mortgage-financing',
  title: 'Private Mortgage Financing Ontario | FairLend',
})

const serviceSeo = {
  description:
    'Private mortgage financing review for Ontario borrowers considering first, second, bridge, renewal, and equity-based mortgage options.',
  name: 'Private Mortgage Financing Ontario',
  path: '/borrowers/private-mortgage-financing',
  serviceType: 'Private mortgage financing',
}

export default function BorrowerPrivateMortgageFinancingPage(): ReactElement {
  return (
    <div className="pm-page" data-private-mortgage-page>
      <FairlendServiceSeo {...serviceSeo} dateModified="2026-07-14" reviewedByPrincipalBroker />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <main className="pm-file">
          <CoverSheet />
          <div className="px-4 py-10 sm:px-8 lg:px-12">
            <FairlendGeoAnswerBlock
              answer={
                <p>
                  A private mortgage in Ontario is real-estate-secured financing provided by an
                  individual or non-bank lender instead of a bank, credit union, trust company, or
                  monoline lender. Approval usually puts more weight on property value, equity,
                  loan-to-value, location, and a credible exit than on conventional income or credit
                  rules. Borrowers commonly use it for time-sensitive purchases, bridge gaps,
                  renovations, construction, arrears, renewals, or situations that do not fit
                  institutional policy. This flexibility typically comes with higher interest,
                  lender fees, brokerage, legal, and appraisal costs, shorter terms, and greater
                  renewal or enforcement risk. A proper review should compare the total dollar
                  cost—not only the rate—and document the term, payment structure, prepayment terms,
                  default charges, conditions, and exit plan. Availability and pricing depend on
                  underwriting, property value, borrower capacity, market conditions, and lender
                  capital; approval and funding are never guaranteed.
                </p>
              }
              comparison={{
                caption: 'Typical private and institutional mortgage characteristics',
                columns: ['Private mortgage', 'Institutional mortgage'],
                rows: [
                  {
                    label: 'Primary review',
                    values: [
                      'Property value, equity, location, and exit',
                      'Income, credit, debt service, and property',
                    ],
                  },
                  {
                    label: 'Typical term',
                    values: ['Usually shorter and exit-driven', 'Often longer and renewal-driven'],
                  },
                  {
                    label: 'Cost profile',
                    values: [
                      'Typically higher rate and fees',
                      'Typically lower cost when policy is met',
                    ],
                  },
                  {
                    label: 'Best fit',
                    values: [
                      'Time-sensitive or non-standard files',
                      'Borrowers who meet conventional policy',
                    ],
                  },
                ],
              }}
              question="What is a private mortgage in Ontario?"
            />
          </div>
          <IncidentBoard />
          <CostXray />
          <ExitRoute />
          <JudgmentDesk />
          <div className="px-4 py-10 sm:px-8 lg:px-12">
            <FairlendEditorialReview
              sources={[
                ...fairlendMortgageEditorialSources,
                {
                  href: 'https://www.fsrao.ca/consumers/mortgage-brokering',
                  label: 'FSRA — mortgage brokering and private mortgages',
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
