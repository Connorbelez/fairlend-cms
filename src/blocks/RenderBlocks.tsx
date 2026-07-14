import React, { Fragment } from 'react'

import type { Page, Post } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { isMoneyPageBlockType, MoneyPageBlock } from '@/blocks/MoneyPage/Component'
import { WatermelonLayoutBlock } from '@/blocks/WatermelonLayouts/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  moneyPageCTA: MoneyPageBlock,
  moneyPageComparison: MoneyPageBlock,
  moneyPageDisclosure: MoneyPageBlock,
  moneyPageFAQ: MoneyPageBlock,
  moneyPageFeatures: MoneyPageBlock,
  moneyPageHero: MoneyPageBlock,
  moneyPageMediaSplit: MoneyPageBlock,
  moneyPageNarrative: MoneyPageBlock,
  moneyPageProcess: MoneyPageBlock,
  moneyPageProof: MoneyPageBlock,
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

type RenderableBlock = Page['layout'][number] | NonNullable<Post['moneyPageLayout']>[number]

export const RenderBlocks: React.FC<{
  blocks?: RenderableBlock[] | null
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
                <div className={isMoneyPageBlockType(blockType) ? undefined : 'my-16'} key={index}>
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
