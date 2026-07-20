import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, BookOpen, Search } from 'lucide-react'

import { Media } from '@/components/Media'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import type { Post } from '@/payload-types'
import { formatEditorialDate } from '@/utilities/formatEditorialDate'
import { getPostAuthors } from '@/utilities/postAuthors'

export type FairlendJournalPost = Pick<
  Post,
  'categories' | 'createdAt' | 'meta' | 'populatedAuthors' | 'publishedAt' | 'slug' | 'title'
>

type FairlendJournalArchiveProps = {
  currentPage?: number
  posts: FairlendJournalPost[]
  showFeatured?: boolean
  totalDocs?: number
}

function getPostDate(post: FairlendJournalPost): string {
  return post.publishedAt || post.createdAt
}

function getPostCategory(post: FairlendJournalPost): string {
  const category = post.categories?.find((item) => typeof item === 'object')
  return typeof category === 'object' && category?.title ? category.title : 'Financing field note'
}

function getPostAuthor(post: FairlendJournalPost): string {
  const author = getPostAuthors(post)[0]
  return `${author.name} · ${author.officialTitle}`
}

function JournalMedia({
  className,
  post,
  priority = false,
  sizes,
}: {
  className?: string
  post: FairlendJournalPost
  priority?: boolean
  sizes: string
}) {
  const image = post.meta?.image

  if (image && typeof image === 'object') {
    return (
      <Media
        className={className}
        fill
        imgClassName="object-cover grayscale transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        priority={priority}
        resource={image}
        size={sizes}
      />
    )
  }

  return (
    <Image
      alt=""
      className="object-cover grayscale opacity-85 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
      fill
      priority={priority}
      sizes={sizes}
      src="/assets/fairlend-route-selector/route-compass-engraving.webp"
    />
  )
}

function JournalSearch() {
  return (
    <form action="/search" className="relative w-full max-w-[32rem]" method="get" role="search">
      <label className="sr-only" htmlFor="journal-search">
        Search FairLend resources
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#494944]"
        strokeWidth={1.8}
      />
      <input
        className="min-h-12 w-full border border-[#deded8] bg-[#fffdf9] pr-14 pl-12 text-base font-semibold text-[#08090a] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#6c6c64] focus:border-[#08090a] focus:shadow-[inset_0_-3px_0_#96ec18]"
        id="journal-search"
        name="q"
        placeholder="Search by project, structure, or stage"
        type="search"
      />
      <button
        aria-label="Submit resource search"
        className="absolute top-1/2 right-0.5 grid size-11 -translate-y-1/2 place-items-center bg-[#96ec18] text-[#030405] transition-colors hover:bg-[#a4fb20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08090a]"
        type="submit"
      >
        <ArrowUpRight aria-hidden="true" className="size-4.5" />
      </button>
    </form>
  )
}

function FeaturedStory({ post }: { post: FairlendJournalPost }) {
  const date = getPostDate(post)

  return (
    <Link
      className="group grid min-h-[31rem] border-y border-[#08090a] bg-[#fffdf9] text-[#08090a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08090a] md:grid-cols-[minmax(0,1.22fr)_minmax(21rem,0.78fr)]"
      href={`/posts/${post.slug}`}
    >
      <div className="relative min-h-[22rem] overflow-hidden border-b border-[#08090a] bg-[#deded8] md:min-h-full md:border-r md:border-b-0">
        <JournalMedia post={post} priority sizes="(max-width: 767px) 100vw, 62vw" />
        <span className="absolute top-5 left-5 bg-[#96ec18] px-3 py-2 text-[12px] font-extrabold tracking-[0.14em] text-[#203500] uppercase">
          Lead file
        </span>
      </div>

      <div className="flex flex-col justify-between gap-12 p-6 sm:p-8 lg:p-11">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-[#494944]">
            <span>{getPostCategory(post)}</span>
            <span aria-hidden="true">/</span>
            <time dateTime={date}>{formatEditorialDate(date)}</time>
          </div>
          <h2 className="mt-7 max-w-[12ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(2.75rem,5.2vw,4.75rem)] leading-[0.94] font-semibold tracking-[-0.035em]">
            {post.title}
          </h2>
          {post.meta?.description ? (
            <p className="mt-6 max-w-[58ch] text-pretty text-base leading-7 font-medium text-[#494944] sm:text-lg sm:leading-8">
              {post.meta.description}
            </p>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-6 border-t border-[#deded8] pt-5">
          <p className="text-sm font-semibold text-[#494944]">{getPostAuthor(post)}</p>
          <span className="grid size-12 shrink-0 place-items-center bg-[#08090a] text-[#96ec18] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ArrowUpRight aria-hidden="true" className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function JournalCard({ post }: { post: FairlendJournalPost }) {
  const date = getPostDate(post)

  return (
    <li className="min-w-0">
      <Link
        className="group flex h-full flex-col border-t border-[#08090a] pt-4 text-[#08090a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08090a]"
        href={`/posts/${post.slug}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#deded8]">
          <JournalMedia
            post={post}
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-bold tracking-[0.04em] text-[#494944]">
            <span>{getPostCategory(post)}</span>
            <span aria-hidden="true">/</span>
            <time dateTime={date}>{formatEditorialDate(date)}</time>
          </div>
          <h3 className="mt-4 text-balance font-[family-name:var(--font-cormorant)] text-[clamp(1.875rem,3vw,2.5rem)] leading-[1] font-semibold tracking-[-0.025em] transition-colors group-hover:text-[#315a12]">
            {post.title}
          </h3>
          {post.meta?.description ? (
            <p className="mt-4 line-clamp-3 text-pretty text-base leading-7 font-medium text-[#494944]">
              {post.meta.description}
            </p>
          ) : null}
          <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-extrabold">
            Read field note
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </li>
  )
}

function JournalEmptyState() {
  return (
    <div className="grid border-y border-[#08090a] bg-[#fffdf9] md:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
      <div className="relative min-h-[25rem] overflow-hidden border-b border-[#08090a] bg-[#e8e8e2] md:border-r md:border-b-0">
        <Image
          alt="Engraved compass and site-plan instruments"
          className="object-contain p-10 grayscale sm:p-16"
          fill
          sizes="(max-width: 767px) 100vw, 55vw"
          src="/assets/fairlend-route-selector/route-compass-engraving.webp"
        />
        <span className="absolute top-5 left-5 bg-[#96ec18] px-3 py-2 text-[12px] font-extrabold tracking-[0.14em] text-[#203500] uppercase">
          Editorial desk open
        </span>
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <BookOpen aria-hidden="true" className="size-9 text-[#315a12]" strokeWidth={1.6} />
        <h2 className="mt-7 max-w-[12ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.94] font-semibold tracking-[-0.035em]">
          The first field notes are being prepared.
        </h2>
        <p className="mt-6 max-w-[52ch] text-pretty text-base leading-7 font-medium text-[#494944]">
          New field notes are in editorial review. For guidance on mortgage files, construction
          draws, project timing, or investor due diligence, speak directly with our team.
        </p>
        <Link
          className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 bg-[#96ec18] px-5 text-sm font-extrabold text-[#030405] transition-colors hover:bg-[#a4fb20] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08090a]"
          href="/contact"
        >
          Ask the editorial desk
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export function FairlendJournalArchive({
  currentPage = 1,
  posts,
  showFeatured = true,
  totalDocs = posts.length,
}: FairlendJournalArchiveProps) {
  const featured = showFeatured ? posts[0] : undefined
  const archivePosts = featured ? posts.slice(1) : posts

  return (
    <main className="bg-[#f8f7f5] text-[#08090a]">
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <header className="mx-auto grid max-w-[86rem] gap-10 px-5 pt-16 pb-14 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)] lg:items-end lg:px-14 lg:pt-24 lg:pb-20">
          <div>
            <p className="font-[family-name:var(--font-oxanium)] text-[12px] font-extrabold tracking-[0.16em] text-[#315a12] uppercase">
              FairLend resource desk · File index {String(currentPage).padStart(2, '0')}
            </p>
            <h1 className="mt-6 max-w-[11ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3.75rem,7vw,6rem)] leading-[0.9] font-semibold tracking-[-0.04em]">
              Financing field notes for decisions that move.
            </h1>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-[62ch] text-pretty text-lg leading-8 font-medium text-[#494944]">
              Reviewed guidance for Ontario borrowers, builders, partners, and mortgage
              investors—written around the documents, constraints, and timing that shape a file.
            </p>
            <div className="mt-7">
              <JournalSearch />
            </div>
          </div>
        </header>
      </FairlendLandingRail>

      <FairlendLandingRail gutterTexture="grid-noise">
        <div className="mx-auto max-w-[86rem] px-5 sm:px-8 lg:px-14">
          {featured ? <FeaturedStory post={featured} /> : null}
          {!featured && archivePosts.length === 0 ? <JournalEmptyState /> : null}

          {archivePosts.length > 0 ? (
            <section aria-labelledby="journal-archive-heading" className="py-16 sm:py-20 lg:py-24">
              <div className="mb-10 flex flex-col gap-5 border-b border-[#deded8] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <h2
                  className="font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,4.5vw,4rem)] leading-none font-semibold tracking-[-0.035em]"
                  id="journal-archive-heading"
                >
                  {currentPage === 1 ? 'From the archive' : `Archive · page ${currentPage}`}
                </h2>
                <p className="font-[family-name:var(--font-oxanium)] text-[12px] font-bold tracking-[0.08em] text-[#494944] uppercase">
                  {totalDocs} {totalDocs === 1 ? 'published file' : 'published files'}
                </p>
              </div>
              <ul className="grid gap-x-7 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
                {archivePosts.map((post) => (
                  <JournalCard key={post.slug} post={post} />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </FairlendLandingRail>
    </main>
  )
}
