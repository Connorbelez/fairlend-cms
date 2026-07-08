import { JsonLd } from './JsonLd'
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from '@/utilities/structuredData'

type FairlendServiceSeoProps = {
  description: string
  name: string
  path: string
  serviceType?: string
}

export function FairlendServiceSeo({
  description,
  name,
  path,
  serviceType,
}: FairlendServiceSeoProps) {
  return (
    <JsonLd
      data={[
        buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name, path },
        ]),
        buildServiceJsonLd({
          description,
          name,
          path,
          serviceType,
        }),
      ]}
    />
  )
}
