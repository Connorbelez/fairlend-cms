import { FairlendNotFoundPage } from '@/components/FairlendNotFoundPage'
import { fairlendNotFoundMetadata } from '@/utilities/seo'

import './(frontend)/globals.css'

export const metadata = fairlendNotFoundMetadata

export default function GlobalNotFound() {
  return (
    <html data-theme="light" lang="en">
      <body>
        <FairlendNotFoundPage />
      </body>
    </html>
  )
}
