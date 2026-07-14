import { FairlendPathHub } from '@/components/FairlendPathHub'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'Review FairLend’s suitability-first approach to private mortgage lending and mortgage administration for eligible Ontario investors.',
  path: '/investing',
  title: 'Private Mortgage Investing in Ontario | FairLend',
})

export default function InvestingPage() {
  return (
    <FairlendPathHub
      description="Private mortgage lending requires clear risk, security, borrower, property, term, and exit analysis. FairLend’s investor path begins with suitability and documented deal review."
      label="Investing"
      path="/investing"
      paths={[
        {
          description:
            'Understand the review process, mortgage security, administration posture, suitability gate, and questions to ask before proceeding.',
          href: '/investing/private-mortgage-lending',
          title: 'Private mortgage lending',
        },
        {
          description:
            'Read question-led financing resources and market commentary before starting an investor conversation.',
          href: '/posts',
          title: 'Mortgage resources',
        },
        {
          description:
            'Professional partners can bring a borrower scenario, property opportunity, or administration question to FairLend.',
          href: '/partners',
          title: 'Partner scenarios',
        },
      ]}
      preparation={[
        'Your investment objective, time horizon, liquidity needs, and prior mortgage experience.',
        'The amount you are considering and whether registered funds or an entity are involved.',
        'Questions about loan-to-value, valuation, priority, term, repayment, default, and administration.',
        'Independent legal, tax, accounting, and investment advice appropriate to your circumstances.',
      ]}
      title="Review the mortgage, the security, and the exit."
    />
  )
}
