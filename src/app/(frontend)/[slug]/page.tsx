import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { JsonLd } from '@/components/SEO/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/utilities/structuredData'
import {
  fairlendNotFoundMetadata,
  getPayloadDescription,
  getPayloadPagePath,
  getPayloadTitle,
} from '@/utilities/seo'
import { isFairlendTombstonedPageSlug } from '@/lib/fairlend-routes'
import { notFound } from 'next/navigation'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home' && !isFairlendTombstonedPageSlug(doc.slug)
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  if (isFairlendTombstonedPageSlug(decodedSlug)) notFound()

  const url = '/' + decodedSlug
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: page.title, path: getPayloadPagePath(page) },
          ]),
          buildWebPageJsonLd({
            dateModified: page.updatedAt,
            datePublished: page.createdAt,
            description: getPayloadDescription(page),
            name: getPayloadTitle(page),
            path: getPayloadPagePath(page),
          }),
        ]}
      />
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  if (isFairlendTombstonedPageSlug(decodedSlug)) notFound()

  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) return fairlendNotFoundMetadata

  return generateMeta({ collection: 'pages', doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  if (isFairlendTombstonedPageSlug(slug)) return null

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
