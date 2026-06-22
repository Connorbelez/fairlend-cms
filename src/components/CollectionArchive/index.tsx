import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      {posts?.length ? (
        <div className="fairlend-stagger-grid grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8 xl:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={result} relationTo="posts" showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
      ) : (
        <div className="fairlend-reveal rounded-[18px] border border-[#e1d1c2] bg-[#fffaf4] p-8 text-center shadow-[0_18px_46px_rgb(63_38_18/7%),inset_0_1px_0_rgb(255_252_248/86%)] [--fairlend-delay:180ms]">
          <p className="m-0 text-[19px] font-extrabold text-[#062c2f]">No posts published yet.</p>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.45] font-semibold text-[#486572]">
            Check back for financing notes, project guidance, and investor updates.
          </p>
        </div>
      )}
    </div>
  )
}
