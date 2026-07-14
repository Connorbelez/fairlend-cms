import type { ReactElement } from 'react'

import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
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
  'FairLend helps Ontario borrowers compare institutional mortgage options across banks, credit unions, trust companies, and monoline lenders with clear qualification criteria, terms, and next steps.'

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
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <main className="im-file">
          <InstitutionalCover />
          <LenderFitMatrix />
          <DeclineDecoder />
          <TermSheet />
          <MatchingRoute />
          <FitDecision />
          <QuestionRegister />
        </main>
      </FairlendLandingRail>
    </div>
  )
}
