import { FairlendPathHub } from '@/components/FairlendPathHub'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'Compare FairLend mortgage financing paths for Ontario borrowers and builders, including private, institutional, construction, multiplex, and garden-suite financing.',
  path: '/borrowers',
  title: 'Mortgage Financing for Ontario Borrowers and Builders',
})

const paths = [
  {
    description:
      'Flexible mortgage structures for bridge needs, refinances, equity access, complex income, and time-sensitive closings.',
    href: '/borrowers/private-mortgage-financing',
    title: 'Private mortgage financing',
  },
  {
    description:
      'A lender-ready route for larger or more structured commercial and residential real-estate financing requirements.',
    href: '/borrowers/institutional-mortgage',
    title: 'Institutional mortgage financing',
  },
  {
    description:
      'Draw-based capital planning for land, permits, hard costs, construction milestones, and completion.',
    href: '/construction-draw-financing',
    title: 'Construction draw financing',
  },
  {
    description:
      'Financing guidance for Toronto and GTA multiplex conversions, acquisitions, construction, and take-out planning.',
    href: '/multiplex-financing-gta',
    title: 'Multiplex financing',
  },
  {
    description:
      'A financing route for garden and laneway suites, including project scope, budget, draw timing, and exit strategy.',
    href: '/garden-suite-financing-gta',
    title: 'Garden-suite financing',
  },
  {
    description:
      'Project-planning guidance for adding a detached garden suite, from feasibility and approvals through construction and completion.',
    href: '/garden-suite',
    title: 'Garden-suite project guide',
  },
  {
    description:
      'Review the insured-financing path for qualifying multi-unit rental housing and the operating evidence a lender will expect.',
    href: '/cmhc-mli-select-multiplex-financing',
    title: 'CMHC MLI Select financing',
  },
  {
    description:
      'Explore financing considerations for rental projects that combine affordability, energy performance, accessibility, and long-term operations.',
    href: '/affordable-sustainable-rental-housing',
    title: 'Affordable and sustainable rental housing',
  },
] as const

export default function BorrowersPage() {
  return (
    <FairlendPathHub
      description="Start with the property and the constraint—not a product label. FairLend helps Ontario borrowers and builders compare realistic private, institutional, and construction financing routes."
      label="Borrowers"
      path="/borrowers"
      paths={[...paths]}
      preparation={[
        'Property address, municipality, property type, and current ownership status.',
        'Requested amount, existing mortgages or liens, and the use of funds.',
        'Target closing, construction milestone, renewal, or payout date.',
        'Purchase agreement, budget, appraisal, plans, permits, or current lender statement—if available.',
      ]}
      title="Find the financing route that matches the property."
    />
  )
}
