import { JsonLd } from './JsonLd'
import {
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
  buildWebPageJsonLd,
  getSchemaNodeId,
} from '@/utilities/structuredData'

type FairlendServiceSeoProps = {
  dateModified?: string
  description: string
  name: string
  path: string
  reviewedByPrincipalBroker?: boolean
  serviceType?: string
}

export function FairlendServiceSeo({
  dateModified,
  description,
  name,
  path,
  reviewedByPrincipalBroker,
  serviceType,
}: FairlendServiceSeoProps) {
  return (
    <JsonLd
      data={[
        buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name, path },
        ]),
        buildWebPageJsonLd({
          dateModified,
          description,
          mainEntityId: getSchemaNodeId(path, 'service'),
          name,
          path,
          reviewedByPrincipalBroker,
        }),
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
