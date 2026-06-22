'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const {
    card: { ref: cardRef },
    link: { ref: linkRef },
  } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'fairlend-card-motion group overflow-hidden rounded-[18px] border border-[#e1d1c2] bg-[#fffaf4] shadow-[0_18px_46px_rgb(63_38_18/7%),inset_0_1px_0_rgb(255_252_248/86%)] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:cursor-pointer hover:border-[#d5bfae] hover:shadow-[0_24px_58px_rgb(63_38_18/10%),inset_0_1px_0_rgb(255_252_248/92%)] active:translate-y-0 active:scale-[0.995]',
        className,
      )}
      ref={cardRef}
    >
      <div className="fairlend-card-media relative aspect-[16/10] w-full overflow-hidden bg-[#efe1d3]">
        {!metaImage && (
          <div className="flex size-full items-end bg-[radial-gradient(circle_at_20%_0%,rgb(255_250_244/80%),transparent_42%),linear-gradient(135deg,#f5e8db_0%,#dfcbb9_100%)] p-5">
            <span className="text-[12px] font-extrabold tracking-[0.2em] text-[#486572] uppercase">
              Fairlend
            </span>
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>
      <div className="p-5">
        {showCategories && hasCategories && (
          <div className="mb-4 text-[12px] font-extrabold tracking-[0.18em] text-[var(--fairlend-orange-text)] uppercase">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div>
            <h3 className="m-0 text-[24px] leading-[1.08] font-extrabold text-[#062c2f]">
              <Link
                className="rounded-sm no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fairlend-orange-text)]"
                href={href}
                ref={linkRef}
              >
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <p className="mt-3 mb-0 text-[15px] leading-[1.42] font-semibold text-[#486572]">
            {sanitizedDescription}
          </p>
        )}
      </div>
    </article>
  )
}
