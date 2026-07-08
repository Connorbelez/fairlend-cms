import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { buildFairlendMetadata } from '@/utilities/seo'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
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
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return buildFairlendMetadata({
    description:
      'Read FairLend resources on private mortgage financing, construction draws, builder capital, multiplex projects, and real estate investment paths.',
    path: '/posts',
    title: 'FairLend Resources | Mortgage Financing Guides',
  })
}
