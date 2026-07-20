import type { Metadata } from 'next/types'

import { FairlendJournalArchive } from '@/components/FairlendJournalArchive'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { Pagination } from '@/components/Pagination'
import { FAIRLEND_DEMO_POST_SLUGS } from '@/lib/fairlend-posts'
import { buildFairlendMetadata, fairlendNotFoundMetadata } from '@/utilities/seo'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const posts = await queryPostsPage(sanitizedPageNumber)

  if (posts.totalPages === 0 || sanitizedPageNumber > posts.totalPages) notFound()

  return (
    <>
      <PageClient />
      <div className="fairlend-landing-page min-h-svh bg-[#f8f7f5]">
        <FairlendJournalArchive
          currentPage={posts.page || sanitizedPageNumber}
          posts={posts.docs}
          showFeatured={false}
          totalDocs={posts.totalDocs}
        />
        {posts.page && posts.totalPages > 1 ? (
          <FairlendLandingRail gutterTexture="groovepaper">
            <div className="mx-auto max-w-[86rem] px-5 py-10 sm:px-8 sm:py-14 lg:px-14">
              <Pagination page={posts.page} totalPages={posts.totalPages} />
            </div>
          </FairlendLandingRail>
        ) : null}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) {
    return fairlendNotFoundMetadata
  }

  const posts = await queryPostsPage(sanitizedPageNumber)

  if (posts.totalPages === 0 || sanitizedPageNumber > posts.totalPages) {
    return fairlendNotFoundMetadata
  }

  return buildFairlendMetadata({
    description:
      'Browse additional FairLend resources on private mortgage financing, construction draws, builder capital, and real estate investment paths.',
    index: false,
    path: `/posts/page/${pageNumber || ''}`,
    title: `FairLend Resources | Page ${pageNumber || ''}`,
  })
}

const queryPostsPage = cache(async (page: number) => {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'posts',
    depth: 1,
    limit: 13,
    page,
    overrideAccess: false,
    select: {
      categories: true,
      createdAt: true,
      meta: true,
      populatedAuthors: true,
      publishedAt: true,
      slug: true,
      title: true,
    },
    where: {
      slug: {
        not_in: [...FAIRLEND_DEMO_POST_SLUGS],
      },
    },
  })
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
    where: {
      slug: {
        not_in: [...FAIRLEND_DEMO_POST_SLUGS],
      },
    },
  })

  const totalPages = Math.ceil(totalDocs / 13)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
