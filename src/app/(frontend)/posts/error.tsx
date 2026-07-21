'use client'

import { ArrowRight, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { Button } from '@/components/ui/button'

export default function PostsError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="fairlend-landing-page min-h-svh bg-[#f8f7f5] text-[#08090a]">
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
          <div className="grid overflow-hidden border-y border-[#08090a] bg-[#fffdf9] md:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="font-[family-name:var(--font-oxanium)] text-xs font-extrabold tracking-[0.12em] text-[#315a12] uppercase">
                Resource desk · retrieval stopped
              </p>
              <h1 className="mt-6 max-w-[11ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3.25rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.04em]">
                This working file could not be opened.
              </h1>
              <p className="mt-6 max-w-[56ch] text-base leading-7 font-medium text-[#494944]">
                The resource desk hit a retrieval error. Try the request again, or return to the
                archive while the file is reviewed.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  className="min-h-12 rounded-none bg-[#96ec18] px-5 font-extrabold text-[#030405] shadow-none hover:bg-[#a4fb20] focus-visible:outline-[#08090a]"
                  onClick={reset}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Try again
                </Button>
                <Button
                  asChild
                  className="min-h-12 rounded-none border-[#08090a] bg-transparent px-5 font-extrabold text-[#08090a] shadow-none hover:bg-[#eef8df]"
                  variant="outline"
                >
                  <Link href="/posts">
                    Return to the archive
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative min-h-[24rem] border-t border-[#08090a] bg-[#deded8] md:min-h-[36rem] md:border-t-0 md:border-l">
              <Image
                alt="Engraved compass and site-plan instruments"
                className="object-cover grayscale contrast-[1.08]"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 45vw"
                src="/assets/fairlend-route-selector/route-compass-engraving.webp"
              />
            </div>
          </div>
        </div>
      </FairlendLandingRail>
    </main>
  )
}
