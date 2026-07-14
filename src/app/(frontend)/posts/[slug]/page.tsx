import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { JsonLd } from '@/components/SEO/JsonLd'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  buildWebPageJsonLd,
  getSchemaNodeId,
} from '@/utilities/structuredData'
import { getPayloadDescription, getPayloadPostPath, getPayloadTitle } from '@/utilities/seo'
import { FAIRLEND_DEMO_POST_SLUGS, isFairlendDemoPostSlug } from '@/lib/fairlend-posts'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      slug: {
        not_in: [...FAIRLEND_DEMO_POST_SLUGS],
      },
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const isMoneyPage = post.contentMode === 'moneyPage'
  const path = getPayloadPostPath(post)
  const title = getPayloadTitle(post)
  const description = getPayloadDescription(post)
  const authorNames =
    post.populatedAuthors
      ?.map((author) => author.name?.trim())
      .filter((name): name is string => Boolean(name)) || []

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Resources', path: '/posts' },
            { name: post.title, path },
          ]),
          buildWebPageJsonLd({
            dateModified: post.updatedAt,
            datePublished: post.publishedAt || post.createdAt,
            description,
            mainEntityId: getSchemaNodeId(path, 'article'),
            name: title,
            path,
          }),
          buildArticleJsonLd({
            authorNames,
            dateModified: post.updatedAt,
            datePublished: post.publishedAt || post.createdAt,
            description,
            image: post.meta?.image || post.heroImage,
            path,
            title,
          }),
          ...authorNames.map((name) => buildPersonJsonLd({ name })),
        ]}
      />
      {!isMoneyPage ? <PostHero post={post} /> : null}

      {isMoneyPage ? (
        <div className="money-page-document">
          <RenderBlocks blocks={post.moneyPageLayout} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="container">
            {post.content ? (
              <RichText
                className="max-w-[48rem] mx-auto"
                data={post.content}
                enableGutter={false}
              />
            ) : null}
          </div>
        </div>
      )}

      {post.relatedPosts && post.relatedPosts.length > 0 ? (
        <div className="container">
          <RelatedPosts
            className="mt-12 max-w-[52rem] mx-auto lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
            docs={post.relatedPosts.filter((post) => typeof post === 'object')}
          />
        </div>
      ) : null}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ collection: 'posts', doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  if (isFairlendDemoPostSlug(slug)) return null

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
