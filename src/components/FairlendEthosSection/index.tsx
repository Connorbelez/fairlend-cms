import type { ReactElement } from 'react'

import { FairlendPaperSection, FairlendPaperShell } from '@/components/FairlendMarketingPrimitives'

import { AlignedInterestsBlock } from './components/AlignedInterestsBlock'
import { CapitalTrapsBlock } from './components/CapitalTrapsBlock'
import { EthosSectionMotion } from './components/EthosSectionMotion.client'
import { EthosManifestoBlock } from './components/EthosManifestoBlock'
import { EthosProofBlock } from './components/EthosProofBlock'
import { HousingOpportunityBlock } from './components/HousingOpportunityBlock'
import { OperatingStandardBlock } from './components/OperatingStandardBlock'
import { ETHOS_ASSETS } from './content'
import './ethos-section.css'

export type FairlendEthosSectionProps = {
  officeImageSrc?: string
}

export function FairlendEthosSection({
  officeImageSrc = ETHOS_ASSETS.office,
}: FairlendEthosSectionProps = {}): ReactElement {
  return (
    <FairlendPaperSection
      aria-labelledby="fairlend-ethos-title"
      className="fairlend-ethos"
      data-testid="fairlend-ethos-section"
      id="ethos"
    >
      <FairlendPaperShell className="fairlend-ethos__shell">
        <EthosSectionMotion />
        <EthosProofBlock officeImageSrc={officeImageSrc} />
        <AlignedInterestsBlock />
        <OperatingStandardBlock />
        <CapitalTrapsBlock
          auditSpecimenImageSrc={ETHOS_ASSETS.auditSpecimen}
          skylineImageSrc={ETHOS_ASSETS.skyline}
        />
        <HousingOpportunityBlock />
        <EthosManifestoBlock housingImageSrc={ETHOS_ASSETS.manifestoHousing} />
      </FairlendPaperShell>
    </FairlendPaperSection>
  )
}
