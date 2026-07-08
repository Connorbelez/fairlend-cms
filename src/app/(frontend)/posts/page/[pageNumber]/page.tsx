import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <main className="bg-[#fbf3ea] pt-16 pb-24 text-[#062c2f]">
      <PageClient />
      <div className="container fairlend-reveal mb-12">
        <p className="fairlend-kicker-motion mb-4 text-[12px] font-extrabold tracking-[0.28em] text-[var(--fairlend-orange-text)] uppercase">
          FairLend Resources
        </p>
        <h1 className="m-0 max-w-[760px] font-serif text-[clamp(54px,12vw,104px)] leading-[0.92] font-bold text-[#062c2f]">
          Financing notes for builders and investors.
        </h1>
        <p className="mt-6 max-w-[620px] text-[clamp(18px,2.3vw,22px)] leading-[1.35] font-semibold text-[#33545e]">
          Practical guidance on private mortgages, construction files, draw schedules, and real
          estate investment paths.
        </p>
      </div>

      <div className="container fairlend-reveal mb-8 text-sm font-extrabold tracking-[0.08em] text-[#486572] uppercase [--fairlend-delay:120ms]">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `FairLend Resources | Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
