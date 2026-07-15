import type { Metadata } from 'next/types'

import { FairlendJournalArchive } from '@/components/FairlendJournalArchive'
import { Pagination } from '@/components/Pagination'
import { JsonLd } from '@/components/SEO/JsonLd'
import { FAIRLEND_DEMO_POST_SLUGS } from '@/lib/fairlend-posts'
import { buildFairlendMetadata } from '@/utilities/seo'
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/utilities/structuredData'
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
    limit: 13,
    overrideAccess: false,
    select: {
      createdAt: true,
      title: true,
      slug: true,
      categories: true,
      meta: true,
      populatedAuthors: true,
      publishedAt: true,
    },
    where: {
      slug: {
        not_in: [...FAIRLEND_DEMO_POST_SLUGS],
      },
    },
  })

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Resources', path: '/posts' },
          ]),
          buildWebPageJsonLd({
            description:
              'Read FairLend resources on private mortgage financing, construction draws, builder capital, multiplex projects, and real estate investment paths.',
            name: 'FairLend Resources | Mortgage Financing Guides',
            path: '/posts',
          }),
        ]}
      />
      <PageClient />
      <FairlendJournalArchive posts={posts.docs} />
      <div className="container bg-[#f8f7f5] pb-20">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </>
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
