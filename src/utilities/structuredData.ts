import type { Config, Media } from '@/payload-types'

import { fairlendSeo, getCanonicalUrl, getMediaUrl } from './seo'

type BreadcrumbItem = {
  name: string
  path: string
}

type JsonLdObject = Record<string, unknown>

const defaultAreaServed = [
  { '@type': 'AdministrativeArea', name: 'Ontario' },
  { '@type': 'City', name: 'Toronto' },
  { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
]

export const fairlendOrganizationJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': `${getCanonicalUrl('/')}#organization`,
  '@type': ['Organization', 'FinancialService'],
  areaServed: defaultAreaServed,
  email: 'elie@fairlend.ca',
  legalName: fairlendSeo.legalName,
  name: fairlendSeo.siteName,
  telephone: '+1-647-831-7605',
  url: getCanonicalUrl('/'),
})

export const fairlendWebsiteJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': `${getCanonicalUrl('/')}#website`,
  '@type': 'WebSite',
  inLanguage: 'en-CA',
  name: fairlendSeo.siteName,
  publisher: { '@id': `${getCanonicalUrl('/')}#organization` },
  url: getCanonicalUrl('/'),
})

export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    item: getCanonicalUrl(item.path),
    name: item.name,
    position: index + 1,
  })),
})

export const buildServiceJsonLd = ({
  description,
  name,
  path,
  serviceType,
}: {
  description: string
  name: string
  path: string
  serviceType?: string
}): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  areaServed: defaultAreaServed,
  description,
  name,
  provider: { '@id': `${getCanonicalUrl('/')}#organization` },
  serviceType: serviceType || name,
  url: getCanonicalUrl(path),
})

export const buildArticleJsonLd = ({
  dateModified,
  datePublished,
  description,
  image,
  path,
  title,
}: {
  dateModified?: string | null
  datePublished?: string | null
  description: string
  image?: Media | Config['db']['defaultIDType'] | null
  path: string
  title: string
}): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  dateModified: dateModified || datePublished,
  datePublished: datePublished || dateModified,
  description,
  headline: title,
  image: [getMediaUrl(image)],
  mainEntityOfPage: getCanonicalUrl(path),
  publisher: { '@id': `${getCanonicalUrl('/')}#organization` },
  url: getCanonicalUrl(path),
})
