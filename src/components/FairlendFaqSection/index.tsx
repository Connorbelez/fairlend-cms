import type { ReactElement } from 'react'

import { fairlendFaqJsonLd } from './data'
import { FairlendFaqSectionClient } from './FairlendFaqSection.client'

export function FairlendFaqSection(): ReactElement {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(fairlendFaqJsonLd).replaceAll('<', '\\u003c'),
        }}
        type="application/ld+json"
      />
      <FairlendFaqSectionClient />
    </>
  )
}

export { fairlendFaqGroups } from './data'
