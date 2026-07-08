import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { WatermelonLayoutBlock } from '@/blocks/WatermelonLayouts/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  watermelonBusinessManagement: WatermelonLayoutBlock,
  watermelonBusinessOperationsDashboard: WatermelonLayoutBlock,
  watermelonECommerceDashboard: WatermelonLayoutBlock,
  watermelonErpDashboard: WatermelonLayoutBlock,
  watermelonHrm: WatermelonLayoutBlock,
  watermelonIncidentManagement: WatermelonLayoutBlock,
  watermelonInvoiceGeneratorDashboard: WatermelonLayoutBlock,
  watermelonInvoiceManagerDashboard: WatermelonLayoutBlock,
  watermelonIssueTracking: WatermelonLayoutBlock,
  watermelonLeadDashboard: WatermelonLayoutBlock,
  watermelonMailDashboard: WatermelonLayoutBlock,
  watermelonMeetingsDashboard: WatermelonLayoutBlock,
  watermelonPaymentOperationsDashboard: WatermelonLayoutBlock,
  watermelonProjectManagementDashboard: WatermelonLayoutBlock,
  watermelonSalesDashboard: WatermelonLayoutBlock,
  watermelonTaskManagementDashboard: WatermelonLayoutBlock,
  watermelonWorkflowManagementDashboard: WatermelonLayoutBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
