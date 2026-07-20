'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Media } from '@/components/Media'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'

export type CardPostData = Pick<Post, 'categories' | 'meta' | 'slug' | 'title'>

const cardVariants = cva('group overflow-hidden', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default:
        'fairlend-card-motion rounded-[18px] border border-[#e1d1c2] bg-[#fffaf4] shadow-[0_18px_46px_rgb(63_38_18/7%),inset_0_1px_0_rgb(255_252_248/86%)] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:cursor-pointer hover:border-[#d5bfae] hover:shadow-[0_24px_58px_rgb(63_38_18/10%),inset_0_1px_0_rgb(255_252_248/92%)] active:translate-y-0 active:scale-[0.995]',
      journal:
        'h-full border-t border-[#08090a] bg-transparent text-[#08090a] transition-colors duration-200 hover:cursor-pointer hover:border-[#315a12]',
    },
  },
})

type CardProps = VariantProps<typeof cardVariants> & {
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}

export const Card: React.FC<CardProps> = (props) => {
  const {
    card: { ref: cardRef },
    link: { ref: linkRef },
  } = useClickableCard({})
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    variant = 'default',
  } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`
  const isJournal = variant === 'journal'

  return (
    <article className={cn(cardVariants({ variant }), className)} ref={cardRef}>
      <div
        className={cn(
          'fairlend-card-media relative aspect-[16/10] w-full overflow-hidden',
          isJournal ? 'mt-4 bg-[#deded8]' : 'bg-[#efe1d3]',
        )}
      >
        {!metaImage && !isJournal ? (
          <div className="flex size-full items-end bg-[radial-gradient(circle_at_20%_0%,rgb(255_250_244/80%),transparent_42%),linear-gradient(135deg,#f5e8db_0%,#dfcbb9_100%)] p-5">
            <span className="text-xs font-extrabold tracking-[0.2em] text-[#486572] uppercase">
              FairLend
            </span>
          </div>
        ) : null}
        {!metaImage && isJournal ? (
          <Image
            alt=""
            className="object-cover grayscale opacity-85 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            src="/assets/fairlend-route-selector/route-compass-engraving.webp"
          />
        ) : null}
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            fill={isJournal}
            imgClassName={cn(
              isJournal &&
                'object-cover grayscale contrast-[1.06] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]',
            )}
            resource={metaImage}
            size={isJournal ? '(max-width: 767px) 100vw, 50vw' : '33vw'}
          />
        ) : null}
      </div>

      <div className={cn(isJournal ? 'flex h-full flex-col pt-5' : 'p-5')}>
        {showCategories && hasCategories ? (
          <div
            className={cn(
              'font-extrabold uppercase',
              isJournal
                ? 'font-[family-name:var(--font-oxanium)] text-xs tracking-[0.08em] text-[#315a12]'
                : 'mb-4 text-xs tracking-[0.18em] text-[var(--fairlend-orange-text)]',
            )}
          >
            {categories.map((category, index) => {
              if (typeof category !== 'object') return null
              const categoryTitle = category.title || 'Untitled category'
              const isLast = index === categories.length - 1

              return (
                <Fragment key={index}>
                  {categoryTitle}
                  {!isLast ? <Fragment>, &nbsp;</Fragment> : null}
                </Fragment>
              )
            })}
          </div>
        ) : null}

        {titleToUse ? (
          <h3
            className={cn(
              'm-0',
              isJournal
                ? 'mt-4 text-balance font-[family-name:var(--font-cormorant)] text-[clamp(1.875rem,3vw,2.5rem)] leading-none font-semibold tracking-[-0.025em]'
                : 'text-2xl leading-[1.08] font-extrabold text-[#062c2f]',
            )}
          >
            <Link
              className={cn(
                'no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-4',
                isJournal
                  ? 'transition-colors group-hover:text-[#315a12] focus-visible:outline-[#08090a]'
                  : 'rounded-sm focus-visible:outline-[var(--fairlend-orange-text)]',
              )}
              href={href}
              ref={linkRef}
            >
              {titleToUse}
            </Link>
          </h3>
        ) : null}

        {description ? (
          <p
            className={cn(
              'mb-0 font-semibold',
              isJournal
                ? 'mt-4 line-clamp-3 text-base leading-7 text-[#494944]'
                : 'mt-3 text-base leading-[1.42] text-[#486572]',
            )}
          >
            {sanitizedDescription}
          </p>
        ) : null}

        {isJournal ? (
          <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-extrabold">
            Open related file
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        ) : null}
      </div>
    </article>
  )
}
