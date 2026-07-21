import { BadgeCheck } from 'lucide-react'

import { Card } from '@/components/ui/card'
import type { Post } from '@/payload-types'
import { formatEditorialDate } from '@/utilities/formatEditorialDate'
import { getPostAuthors } from '@/utilities/postAuthors'
import { cn } from '@/utilities/ui'

type PostAttributionProps = {
  className?: string
  post: Pick<Post, 'createdAt' | 'populatedAuthors' | 'publishedAt' | 'updatedAt'>
}

export function PostAttribution({ className, post }: PostAttributionProps) {
  const authors = getPostAuthors(post)
  const publishedAt = post.publishedAt || post.createdAt

  return (
    <Card
      className={cn(
        'mx-auto w-full max-w-[64rem] rounded-none border-x-0 border-y border-[#08090a] bg-[#fffdf9] p-0 text-[#08090a] shadow-none',
        className,
      )}
      render={<aside aria-label="Article author and release details" />}
    >
      <div className="grid gap-6 border-b border-[#deded8] p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-7 lg:p-9">
        <div className="max-w-[34rem]">
          <p className="flex items-center gap-2 font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#315a12] uppercase">
            <BadgeCheck aria-hidden="true" className="size-4" />
            Accountable authorship
          </p>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-cormorant)] text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.035em]">
            The people behind this working file.
          </h2>
          <p className="mt-4 max-w-[58ch] text-sm leading-6 font-semibold text-[#494944]">
            Clear credentials, visible release history, and a named point of accountability for the
            guidance above.
          </p>
        </div>

        <dl className="grid grid-cols-2 border border-[#deded8] text-xs">
          <div className="border-r border-[#deded8] p-4 sm:min-w-36">
            <dt className="font-[family-name:var(--font-oxanium)] font-extrabold tracking-[0.08em] text-[#6c6c64] uppercase">
              Released
            </dt>
            <dd className="mt-2 font-bold tabular-nums text-[#08090a]">
              <time dateTime={publishedAt}>{formatEditorialDate(publishedAt)}</time>
            </dd>
          </div>
          <div className="p-4 sm:min-w-36">
            <dt className="font-[family-name:var(--font-oxanium)] font-extrabold tracking-[0.08em] text-[#6c6c64] uppercase">
              Updated
            </dt>
            <dd className="mt-2 font-bold tabular-nums text-[#08090a]">
              <time dateTime={post.updatedAt}>{formatEditorialDate(post.updatedAt)}</time>
            </dd>
          </div>
        </dl>
      </div>

      <div className="divide-y divide-[#deded8] px-5 sm:px-7 lg:px-9">
        {authors.map((author, index) => (
          <section
            className="grid gap-4 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6 lg:py-9"
            key={author.id || author.name}
          >
            <span
              aria-hidden="true"
              className="font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#315a12]"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="font-[family-name:var(--font-cormorant)] text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-4xl">
                {author.name}
              </p>
              <p className="mt-1 text-sm leading-6 font-extrabold text-[#315a12]">
                {author.officialTitle}
              </p>
              <p className="mt-4 max-w-[68ch] text-base leading-7 font-medium text-[#494944]">
                {author.bio}
              </p>
            </div>
          </section>
        ))}
      </div>
    </Card>
  )
}
