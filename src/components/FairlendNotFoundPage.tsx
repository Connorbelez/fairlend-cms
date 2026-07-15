import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function FairlendNotFoundPage() {
  return (
    <main className="min-h-svh bg-[#fbf3ea] py-24 text-[#062c2f]">
      <div className="container fairlend-reveal">
        <p className="fairlend-kicker-motion mb-4 text-[12px] font-extrabold tracking-[0.28em] text-[var(--fairlend-orange-text)] uppercase">
          404
        </p>
        <h1 className="m-0 max-w-[760px] font-serif text-[clamp(54px,12vw,104px)] leading-[0.92] font-bold text-[#062c2f]">
          This route is not funded.
        </h1>
        <p className="mt-6 max-w-[560px] text-[clamp(18px,2.3vw,22px)] leading-[1.35] font-semibold text-[#33545e]">
          The page may have moved, or the file may never have closed.
        </p>
        <Button
          asChild
          className="mt-9 rounded-full bg-[var(--fairlend-orange)] px-6 text-[#fffaf4] shadow-[0_14px_28px_rgb(255_58_25/18%)] transition-[background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[var(--fairlend-orange-dark)] hover:shadow-[0_18px_34px_rgb(255_58_25/22%)] active:translate-y-0 active:scale-[0.985] focus-visible:outline-[var(--fairlend-orange-text)]"
          size="lg"
          variant="default"
        >
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  )
}
