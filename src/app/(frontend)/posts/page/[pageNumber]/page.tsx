import type { Metadata } from 'next/types'

import { FairlendJournalArchive } from '@/components/FairlendJournalArchive'
import { Pagination } from '@/components/Pagination'
import { FAIRLEND_DEMO_POST_SLUGS } from '@/lib/fairlend-posts'
import { buildFairlendMetadata } from '@/utilities/seo'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
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

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 13,
    page: sanitizedPageNumber,
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

  if (posts.totalPages === 0 || sanitizedPageNumber > posts.totalPages) notFound()

  return (
    <>
      <PageClient />
      <FairlendJournalArchive posts={posts.docs} showFeatured={false} />
      <div className="container bg-[#f8f7f5] pb-20">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return buildFairlendMetadata({
    description:
      'Browse additional FairLend resources on private mortgage financing, construction draws, builder capital, and real estate investment paths.',
    index: false,
    path: `/posts/page/${pageNumber || ''}`,
    title: `FairLend Resources | Page ${pageNumber || ''}`,
  })
}

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
