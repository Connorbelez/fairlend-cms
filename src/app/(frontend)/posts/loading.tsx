import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { Skeleton } from '@/components/ui/skeleton'

export default function PostsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading FairLend resources"
      className="fairlend-landing-page min-h-svh bg-[#f8f7f5] text-[#08090a]"
    >
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <div className="mx-auto grid max-w-[86rem] gap-10 px-5 pt-16 pb-14 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)] lg:items-end lg:px-14 lg:pt-24 lg:pb-20">
          <div>
            <Skeleton className="h-3 w-56 rounded-none bg-[#cfd6c8]" />
            <Skeleton className="mt-7 h-16 w-full max-w-[36rem] rounded-none bg-[#deded8] sm:h-24" />
            <Skeleton className="mt-3 h-16 w-4/5 rounded-none bg-[#deded8] sm:h-24" />
          </div>
          <div>
            <Skeleton className="h-6 w-full max-w-[38rem] rounded-none bg-[#deded8]" />
            <Skeleton className="mt-3 h-6 w-4/5 rounded-none bg-[#deded8]" />
            <Skeleton className="mt-7 h-12 w-full max-w-[32rem] rounded-none bg-[#e8e8e2]" />
          </div>
        </div>
      </FairlendLandingRail>

      <FairlendLandingRail gutterTexture="grid-noise">
        <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-8 sm:py-20 lg:px-14">
          <div className="grid border-y border-[#08090a] bg-[#fffdf9] md:grid-cols-2">
            <Skeleton className="min-h-[22rem] rounded-none bg-[#d7d7d0] md:min-h-[31rem]" />
            <div className="p-7 sm:p-10">
              <Skeleton className="h-3 w-40 rounded-none bg-[#cfd6c8]" />
              <Skeleton className="mt-8 h-12 w-full rounded-none bg-[#deded8]" />
              <Skeleton className="mt-3 h-12 w-3/4 rounded-none bg-[#deded8]" />
              <Skeleton className="mt-8 h-5 w-full rounded-none bg-[#e8e8e2]" />
              <Skeleton className="mt-3 h-5 w-5/6 rounded-none bg-[#e8e8e2]" />
            </div>
          </div>
        </div>
      </FairlendLandingRail>
    </main>
  )
}
