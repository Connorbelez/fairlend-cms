import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { buildFairlendMetadata } from '@/utilities/seo'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <main className="bg-[#fbf3ea] pt-16 pb-24 text-[#062c2f]">
      <PageClient />
      <div className="container fairlend-reveal mb-12 text-center">
        <p className="fairlend-kicker-motion mb-4 text-[12px] font-extrabold tracking-[0.28em] text-[var(--fairlend-orange-text)] uppercase">
          Search
        </p>
        <h1 className="mx-auto m-0 max-w-[760px] font-serif text-[clamp(54px,12vw,104px)] leading-[0.92] font-bold text-[#062c2f]">
          Find the right financing signal.
        </h1>
        <p className="mx-auto mt-6 max-w-[620px] text-[clamp(18px,2.3vw,22px)] leading-[1.35] font-semibold text-[#33545e]">
          Search FairLend resources by property path, lending structure, or investment topic.
        </p>
        <div className="fairlend-reveal mx-auto mt-9 max-w-[50rem] [--fairlend-delay:140ms]">
          <Search />
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container fairlend-reveal [--fairlend-delay:220ms]">
          <div className="rounded-[18px] border border-[#e1d1c2] bg-[#fffaf4] p-8 text-center shadow-[0_18px_46px_rgb(63_38_18/7%),inset_0_1px_0_rgb(255_252_248/86%)]">
            <p className="m-0 text-[19px] font-extrabold text-[#062c2f]">No results found.</p>
            <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.45] font-semibold text-[#486572]">
              Try a property type, city, lending stage, or investor topic.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

export function generateMetadata(): Metadata {
  return buildFairlendMetadata({
    description:
      'Search FairLend resources by property path, lending structure, or investment topic.',
    index: false,
    path: '/search',
    title: 'Search FairLend Resources',
  })
}
