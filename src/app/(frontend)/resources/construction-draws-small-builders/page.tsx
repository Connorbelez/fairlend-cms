import { FairlendUnderConstructionEmptyState } from '@/components/FairlendUnderConstructionEmptyState'
import { buildFairlendMetadata } from '@/utilities/seo'

export const metadata = buildFairlendMetadata({
  description:
    'A practical guide for small builders planning reimbursement draws, milestone evidence, working capital, and interest timing.',
  index: false,
  path: '/resources/construction-draws-small-builders',
  title: 'Construction Draws for Small Builders | FairLend',
})

export default function ConstructionDrawsSmallBuildersPage() {
  return (
    <FairlendUnderConstructionEmptyState
      description="The construction draws guide is being rebuilt with cleaner draw timing, evidence, working-capital, and release structure guidance. Book a consultation and we can walk through your draw path directly."
      source="construction-draws-small-builders-under-construction"
      title="The draw planning guide is under construction."
    />
  )
}
