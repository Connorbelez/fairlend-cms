import type { Config, Media } from '@/payload-types'
import { FAIRLEND_OFFICE } from '@/components/FairlendOfficeMap/data'

import { fairlendSeo, getCanonicalUrl, getMediaUrl } from './seo'

type BreadcrumbItem = {
  name: string
  path: string
}

type JsonLdObject = Record<string, unknown>

export type StructuredArticleAuthor = {
  bio?: string
  name: string
  officialTitle?: string
}

type WebPageType = 'ContactPage' | 'ProfilePage' | 'WebPage'

const defaultAreaServed = [
  { '@type': 'AdministrativeArea', name: 'Ontario' },
  { '@type': 'City', name: 'Toronto' },
  { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
]

export const getSchemaNodeId = (path: string, node: string) => `${getCanonicalUrl(path)}#${node}`

const organizationId = () => getSchemaNodeId('/', 'organization')
const websiteId = () => getSchemaNodeId('/', 'website')
const principalBrokerId = () => getSchemaNodeId('/', 'elie-soberano')

const personSlug = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const personId = (name: string) =>
  personSlug(name) === 'elie-soberano'
    ? principalBrokerId()
    : getSchemaNodeId('/', `person-${personSlug(name)}`)

export const fairlendOrganizationJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': organizationId(),
  '@type': ['Organization', 'FinancialService'],
  address: {
    '@type': 'PostalAddress',
    addressCountry: FAIRLEND_OFFICE.addressCountry,
    addressLocality: FAIRLEND_OFFICE.addressLocality,
    addressRegion: FAIRLEND_OFFICE.addressRegion,
    postalCode: FAIRLEND_OFFICE.postalCode,
    streetAddress: FAIRLEND_OFFICE.addressLine,
  },
  areaServed: defaultAreaServed,
  contactPoint: {
    '@type': 'ContactPoint',
    availableLanguage: ['English'],
    contactType: 'mortgage inquiries',
    email: 'elie@fairlend.ca',
    telephone: '+1-647-831-7605',
  },
  email: 'elie@fairlend.ca',
  founder: { '@id': principalBrokerId() },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: FAIRLEND_OFFICE.latitude,
    longitude: FAIRLEND_OFFICE.longitude,
  },
  legalName: fairlendSeo.legalName,
  logo: getCanonicalUrl('/assets/fairlend/fairlend-logo.svg'),
  name: fairlendSeo.siteName,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
    },
  ],
  sameAs: [
    'https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~',
    'https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~',
  ],
  telephone: '+1-647-831-7605',
  url: getCanonicalUrl('/'),
})

export const fairlendPrincipalBrokerJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': principalBrokerId(),
  '@type': 'Person',
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Mortgage broker licence',
    identifier: 'M08001537',
    recognizedBy: {
      '@type': 'GovernmentOrganization',
      name: 'Financial Services Regulatory Authority of Ontario',
      url: 'https://www.fsrao.ca/',
    },
  },
  jobTitle: 'Principal Broker and Founder',
  knowsAbout: [
    'Private mortgage financing',
    'Institutional mortgage financing',
    'Construction financing',
    'Mortgage administration',
  ],
  name: 'Elie Soberano',
  url: getCanonicalUrl('/investing/private-mortgage-lending#investor-leadership'),
  worksFor: { '@id': organizationId() },
})

export const buildPersonJsonLd = ({
  bio,
  name,
  officialTitle,
}: StructuredArticleAuthor): JsonLdObject => {
  const person =
    personId(name) === principalBrokerId()
      ? fairlendPrincipalBrokerJsonLd()
      : {
          '@context': 'https://schema.org',
          '@id': personId(name),
          '@type': 'Person',
          name,
          worksFor: { '@id': organizationId() },
        }

  return {
    ...person,
    ...(bio ? { description: bio } : {}),
    ...(officialTitle ? { jobTitle: officialTitle } : {}),
  }
}

export const fairlendWebsiteJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': websiteId(),
  '@type': 'WebSite',
  inLanguage: 'en-CA',
  name: fairlendSeo.siteName,
  publisher: { '@id': organizationId() },
  url: getCanonicalUrl('/'),
})

export const buildWebPageJsonLd = ({
  dateModified,
  datePublished,
  description,
  hasBreadcrumb = true,
  mainEntityId,
  name,
  path,
  reviewedByPrincipalBroker = false,
  type = 'WebPage',
}: {
  dateModified?: string | null
  datePublished?: string | null
  description: string
  hasBreadcrumb?: boolean
  mainEntityId?: string
  name: string
  path: string
  reviewedByPrincipalBroker?: boolean
  type?: WebPageType
}): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': getSchemaNodeId(path, 'webpage'),
  '@type': type,
  about: { '@id': organizationId() },
  ...(hasBreadcrumb ? { breadcrumb: { '@id': getSchemaNodeId(path, 'breadcrumb') } } : {}),
  ...(dateModified ? { dateModified } : {}),
  ...(datePublished ? { datePublished } : {}),
  description,
  inLanguage: 'en-CA',
  isPartOf: { '@id': websiteId() },
  ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
  name,
  ...(reviewedByPrincipalBroker ? { reviewedBy: { '@id': principalBrokerId() } } : {}),
  url: getCanonicalUrl(path),
})

export const buildContactPageJsonLd = (): JsonLdObject =>
  buildWebPageJsonLd({
    description:
      'Contact FairLend Mortgage about private, construction, and institutional mortgage financing in Ontario.',
    mainEntityId: organizationId(),
    name: 'Contact FairLend Mortgage',
    path: '/contact',
    type: 'ContactPage',
  })

export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': getSchemaNodeId(items.at(-1)?.path || '/', 'breadcrumb'),
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
  '@id': getSchemaNodeId(path, 'service'),
  '@type': 'Service',
  areaServed: defaultAreaServed,
  description,
  name,
  provider: { '@id': organizationId() },
  serviceType: serviceType || name,
  url: getCanonicalUrl(path),
})

export const buildHomepageOfferCatalogJsonLd = (): JsonLdObject => {
  const offers = [
    {
      description:
        'Acquisition, construction, milestone-draw, completion, and takeout planning for Ontario building projects.',
      name: 'Construction financing',
      path: '/construction-draw-financing',
    },
    {
      description:
        'Private and institutional residential mortgage options, including bridge, renewal, refinance, and home-equity financing.',
      name: 'Residential mortgages',
      path: '/borrowers',
    },
    {
      description:
        'Feasibility, permit-path, construction-financing, draw, and takeout coordination for garden and laneway suites in the GTA.',
      name: 'Garden and laneway suite financing',
      path: '/garden-suite-financing-gta',
    },
    {
      description:
        'Professionally underwritten and administered private mortgage opportunities for eligible investors.',
      name: 'Private mortgage investing',
      path: '/investing/private-mortgage-lending',
    },
    {
      description:
        'Specialist financing support and defined referral routes for brokers, builders, consultants, and professional advisors.',
      name: 'FairLend partner program',
      path: '/partners',
    },
  ] as const

  return {
    '@context': 'https://schema.org',
    '@id': getSchemaNodeId('/', 'offer-catalog'),
    '@type': 'ItemList',
    itemListElement: offers.map((offer, index) => ({
      '@type': 'ListItem',
      item: {
        '@id': getSchemaNodeId(offer.path, 'service'),
        '@type': 'Service',
        areaServed: defaultAreaServed,
        description: offer.description,
        name: offer.name,
        provider: { '@id': organizationId() },
        url: getCanonicalUrl(offer.path),
      },
      position: index + 1,
    })),
    name: 'FairLend financing and partnership routes',
    numberOfItems: offers.length,
  }
}

export const buildArticleJsonLd = ({
  authors = [],
  dateModified,
  datePublished,
  description,
  image,
  path,
  title,
}: {
  authors?: StructuredArticleAuthor[]
  dateModified?: string | null
  datePublished?: string | null
  description: string
  image?: Media | Config['db']['defaultIDType'] | null
  path: string
  title: string
}): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@id': getSchemaNodeId(path, 'article'),
  '@type': 'BlogPosting',
  author:
    authors.length > 0
      ? authors.map((author) => ({ '@id': buildPersonJsonLd(author)['@id'] }))
      : { '@id': organizationId() },
  ...(dateModified || datePublished ? { dateModified: dateModified || datePublished } : {}),
  ...(datePublished || dateModified ? { datePublished: datePublished || dateModified } : {}),
  description,
  headline: title,
  image: [getMediaUrl(image)],
  inLanguage: 'en-CA',
  isPartOf: { '@id': websiteId() },
  mainEntityOfPage: { '@id': getSchemaNodeId(path, 'webpage') },
  publisher: { '@id': organizationId() },
  url: getCanonicalUrl(path),
})
