import type { Metadata } from 'next'

import type { Config, Media, Page, Post } from '@/payload-types'

export const fairlendSeo = {
  defaultDescription:
    'FairLend helps Ontario borrowers, builders, partners, and private mortgage investors structure clear real-estate financing options.',
  defaultOgImagePath: '/opengraph-image',
  legalName: 'Fairlend Management Inc.',
  locale: 'en_CA',
  siteName: 'FairLend Mortgage',
  titleTemplate: '%s | FairLend Mortgage',
} as const

const productionOrigin = 'https://www.fairlend.ca'

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const isLocalOrigin = (value: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value)

const normalizeCanonicalOrigin = (value: string) => {
  const url = new URL(value)

  if (url.hostname === 'fairlend.ca') {
    url.hostname = 'www.fairlend.ca'
  }

  return stripTrailingSlash(url.toString())
}

export const getCanonicalOrigin = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const configuredOrigin = configuredUrl ? stripTrailingSlash(configuredUrl) : ''
  const origin = normalizeCanonicalOrigin(
    process.env.NODE_ENV === 'production' && isLocalOrigin(configuredOrigin)
      ? vercelProductionUrl
        ? `https://${vercelProductionUrl}`
        : productionOrigin
      : configuredOrigin ||
          (vercelProductionUrl ? `https://${vercelProductionUrl}` : productionOrigin),
  )

  if (process.env.NODE_ENV === 'production' && isLocalOrigin(origin)) {
    throw new Error('Production SEO metadata cannot use a localhost canonical origin')
  }

  return origin
}

export const getCanonicalUrl = (path = '/') => new URL(path, `${getCanonicalOrigin()}/`).toString()

export const getMediaUrl = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object' && 'url' in image && image.url) {
    const ogUrl = image.sizes?.og?.url
    return getCanonicalUrl(ogUrl || image.url)
  }

  return getCanonicalUrl(fairlendSeo.defaultOgImagePath)
}

type FairlendMetadataInput = {
  description?: string | null
  image?: string | Media | Config['db']['defaultIDType'] | null
  index?: boolean
  path?: string
  title?: string | null
  type?: 'article' | 'website'
}

export const buildFairlendMetadata = ({
  description,
  image,
  index = true,
  path = '/',
  title,
  type = 'website',
}: FairlendMetadataInput): Metadata => {
  const resolvedTitle = title?.trim() || fairlendSeo.siteName
  const resolvedDescription = description?.trim() || fairlendSeo.defaultDescription
  const canonical = getCanonicalUrl(path)
  const imageUrl = typeof image === 'string' ? getCanonicalUrl(image) : getMediaUrl(image)

  return {
    alternates: {
      canonical,
    },
    description: resolvedDescription,
    openGraph: {
      description: resolvedDescription,
      images: [
        {
          alt: resolvedTitle,
          height: 630,
          url: imageUrl,
          width: 1200,
        },
      ],
      locale: fairlendSeo.locale,
      siteName: fairlendSeo.siteName,
      title: resolvedTitle,
      type,
      url: canonical,
    },
    robots: index
      ? {
          follow: true,
          index: true,
        }
      : {
          follow: true,
          index: false,
          googleBot: {
            follow: true,
            index: false,
          },
        },
    title: resolvedTitle,
    twitter: {
      card: 'summary_large_image',
      description: resolvedDescription,
      images: [imageUrl],
      title: resolvedTitle,
    },
  }
}

export const getPayloadPagePath = (doc?: Partial<Page> | null) => {
  if (!doc?.slug || doc.slug === 'home') return '/'
  return `/${doc.slug}`
}

export const getPayloadPostPath = (doc?: Partial<Post> | null) => {
  if (!doc?.slug) return '/posts'
  return `/posts/${doc.slug}`
}

export const getPayloadTitle = (doc?: Partial<Page> | Partial<Post> | null) =>
  doc?.meta?.title || doc?.title || fairlendSeo.siteName

export const getPayloadDescription = (doc?: Partial<Page> | Partial<Post> | null) =>
  doc?.meta?.description || fairlendSeo.defaultDescription
