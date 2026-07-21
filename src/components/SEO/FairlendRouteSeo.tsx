import { JsonLd } from './JsonLd'
import {
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
  buildWebPageJsonLd,
  getSchemaNodeId,
} from '@/utilities/structuredData'

type FairlendServiceSeoProps = {
  /** Overrides the default Home → current-page breadcrumb trail. */
  breadcrumbTrail?: readonly { name: string; path: string }[]
  dateModified?: string
  description: string
  name: string
  path: string
  reviewedByPrincipalBroker?: boolean
  serviceType?: string
}

export function FairlendServiceSeo({
  breadcrumbTrail,
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
        buildBreadcrumbJsonLd(
          breadcrumbTrail ? [...breadcrumbTrail] : [
            { name: 'Home', path: '/' },
            { name, path },
          ],
        ),
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
