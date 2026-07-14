import { type ReactElement } from 'react'

import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
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
  'Need a private mortgage in Ontario? FairLend helps borrowers review first, second, bridge, renewal, and equity-based options with clear costs, timing, and an exit plan.'

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
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <main className="pm-file">
          <CoverSheet />
          <IncidentBoard />
          <CostXray />
          <ExitRoute />
          <JudgmentDesk />
          <QuestionRegister />
        </main>
      </FairlendLandingRail>
    </div>
  )
}
