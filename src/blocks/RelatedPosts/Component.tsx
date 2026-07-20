import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <section aria-labelledby="related-posts-heading" className={clsx(className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="mb-9 flex flex-col gap-4 border-b border-[#deded8] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#315a12] uppercase">
            Related working files
          </p>
          <h2
            className="mt-3 max-w-[16ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tracking-[-0.035em]"
            id="related-posts-heading"
          >
            Continue through the resource desk.
          </h2>
        </div>
        <p className="font-[family-name:var(--font-oxanium)] text-xs font-bold tracking-[0.08em] text-[#6c6c64] uppercase">
          {docs?.length || 0} {(docs?.length || 0) === 1 ? 'related file' : 'related files'}
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-x-7 gap-y-12 md:grid-cols-2">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <Card
              key={doc.slug || index}
              doc={doc}
              relationTo="posts"
              showCategories
              variant="journal"
            />
          )
        })}
      </div>
    </section>
  )
}
