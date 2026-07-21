import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatEditorialDate } from '@/utilities/formatEditorialDate'
import { getPostAuthors } from '@/utilities/postAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, createdAt, heroImage, publishedAt, title, updatedAt } = post
  const authors = getPostAuthors(post)
  const releaseDate = publishedAt || createdAt
  const categoryTitles =
    categories?.flatMap((category) =>
      typeof category === 'object' && category?.title ? [category.title] : [],
    ) || []

  return (
    <header className="bg-[#f8f7f5] text-[#08090a]" data-fairlend-journal-hero>
      <div className="mx-auto max-w-[86rem] px-5 pt-10 pb-14 sm:px-8 sm:pt-14 sm:pb-20 lg:px-14 lg:pt-16 lg:pb-24">
        <Link
          className="inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#18352f] underline decoration-[#96ec18] decoration-2 underline-offset-4 transition-colors hover:text-[#315a12] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08090a]"
          href="/posts"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Return to the resource desk
        </Link>

        <div className="mt-8 grid overflow-hidden border-y border-[#08090a] bg-[#fffdf9] lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)]">
          <div className="flex min-h-[34rem] flex-col justify-between gap-12 p-6 sm:p-9 lg:min-h-[44rem] lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#315a12] uppercase">
                <span>Published field note</span>
                {categoryTitles.length > 0 ? (
                  <>
                    <span aria-hidden="true" className="h-px w-7 bg-[#96ec18]" />
                    <span>{categoryTitles.join(' · ')}</span>
                  </>
                ) : null}
              </div>
              <h1 className="mt-8 max-w-[13ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3.25rem,6vw,6rem)] leading-[0.9] font-semibold tracking-[-0.04em]">
                {title}
              </h1>
            </div>

            <dl className="grid border-t border-[#deded8] text-sm sm:grid-cols-3">
              <div className="border-b border-[#deded8] py-5 sm:border-r sm:border-b-0 sm:pr-5">
                <dt className="font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#6c6c64] uppercase">
                  {authors.length === 1 ? 'Author' : 'Authors'}
                </dt>
                <dd className="mt-2 leading-6 font-bold text-[#18352f]">
                  {formatAuthors(authors)}
                </dd>
              </div>
              <div className="border-b border-[#deded8] py-5 sm:border-r sm:border-b-0 sm:px-5">
                <dt className="font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#6c6c64] uppercase">
                  Released
                </dt>
                <dd className="mt-2 font-bold tabular-nums">
                  <time dateTime={releaseDate}>{formatEditorialDate(releaseDate)}</time>
                </dd>
              </div>
              <div className="py-5 sm:pl-5">
                <dt className="font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#6c6c64] uppercase">
                  Updated
                </dt>
                <dd className="mt-2 font-bold tabular-nums">
                  <time dateTime={updatedAt}>{formatEditorialDate(updatedAt)}</time>
                </dd>
              </div>
            </dl>
          </div>

          <figure className="relative min-h-[25rem] overflow-hidden border-t border-[#08090a] bg-[#deded8] lg:min-h-full lg:border-t-0 lg:border-l">
            {heroImage && typeof heroImage !== 'string' ? (
              <Media
                fill
                imgClassName="object-cover grayscale contrast-[1.08] brightness-[0.96]"
                priority
                resource={heroImage}
                size="(max-width: 1023px) 100vw, 54vw"
              />
            ) : (
              <Image
                alt="Engraved compass and site-plan instruments"
                className="object-cover grayscale contrast-[1.08]"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 54vw"
                src="/assets/fairlend-route-selector/route-compass-engraving.webp"
              />
            )}
            <figcaption className="absolute top-5 left-5 bg-[#96ec18] px-3 py-2 font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.14em] text-[#203500] uppercase">
              FairLend working file
            </figcaption>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#08090a]/35 to-transparent"
            />
          </figure>
        </div>
      </div>
    </header>
  )
}
