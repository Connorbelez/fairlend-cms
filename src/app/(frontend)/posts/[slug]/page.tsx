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
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { PostAttribution } from '@/components/PostAttribution'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  buildWebPageJsonLd,
  getSchemaNodeId,
} from '@/utilities/structuredData'
import {
  fairlendNotFoundMetadata,
  getPayloadDescription,
  getPayloadPostPath,
  getPayloadTitle,
} from '@/utilities/seo'
import { FAIRLEND_DEMO_POST_SLUGS, isFairlendDemoPostSlug } from '@/lib/fairlend-posts'
import { getPostAuthors } from '@/utilities/postAuthors'
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
  const authors = getPostAuthors(post)
  const personAuthors = authors
    .filter((author) => !author.isOrganization)
    .map(({ bio, name, officialTitle }) => ({ bio, name, officialTitle }))

  return (
    <article className="fairlend-landing-page min-h-svh bg-[#f8f7f5] text-[#08090a]">
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
            authors: personAuthors,
            dateModified: post.updatedAt,
            datePublished: post.publishedAt || post.createdAt,
            description,
            image: post.meta?.image || post.heroImage,
            path,
            title,
          }),
          ...personAuthors.map((author) => buildPersonJsonLd(author)),
        ]}
      />
      {isMoneyPage ? (
        <div className="money-page-document">
          <RenderBlocks blocks={post.moneyPageLayout} />
        </div>
      ) : (
        <>
          <FairlendLandingRail gutterTexture="fabric-of-squares">
            <PostHero post={post} />
          </FairlendLandingRail>
          <FairlendLandingRail gutterTexture="inflicted">
            <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
              {post.content ? (
                <RichText
                  className="mx-auto max-w-[48rem]"
                  data={post.content}
                  enableGutter={false}
                  variant="journal"
                />
              ) : null}
            </div>
          </FairlendLandingRail>
        </>
      )}

      <FairlendLandingRail gutterTexture="groovepaper">
        <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
          <PostAttribution post={post} />
          {post.relatedPosts && post.relatedPosts.length > 0 ? (
            <RelatedPosts
              className="mx-auto mt-16 max-w-[64rem] sm:mt-20"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          ) : null}
        </div>
      </FairlendLandingRail>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return fairlendNotFoundMetadata

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
