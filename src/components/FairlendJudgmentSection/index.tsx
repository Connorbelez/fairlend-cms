import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Crosshair, SlidersHorizontal } from 'lucide-react'

const proofPoints = [
  {
    icon: Crosshair,
    label: 'Risk reviewed',
  },
  {
    icon: BadgeCheck,
    label: 'Terms clear',
  },
  {
    icon: SlidersHorizontal,
    label: 'Draws managed',
  },
] as const

function CropMark({ x, y }: { x: number; y: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute hidden size-4 -translate-x-1/2 -translate-y-1/2 text-[#9c9487] before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:-translate-y-1/2 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-current lg:block"
      data-testid="judgment-crop-mark"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  )
}

export function FairlendJudgmentSection() {
  return (
    <section
      aria-labelledby="fairlend-judgment-title"
      className="grid min-h-svh overflow-hidden bg-[rgb(255_253_247)] text-[#07343b] lg:h-[calc(100svh-72px)] lg:min-h-[calc(100svh-72px)] lg:grid-cols-[58.373%_41.627%]"
      data-fairlend-motion="about-fairlend"
      data-testid="judgment-section"
      id="fairlend-method"
    >
      <div
        className="relative min-h-[520px] overflow-hidden bg-[rgb(233_241_239)] lg:min-h-[calc(100svh-72px)]"
        data-fairlend-about-image
      >
        <Image
          alt="Fairlend underwriting desk with loan files, construction model, and approval review."
          className="object-cover object-center will-change-transform"
          data-fairlend-about-photo
          fill
          priority={false}
          sizes="(min-width: 1024px) 58vw, 100vw"
          src="/assets/reference-judgment/fairlend-judgment-desk.webp"
        />
      </div>

      <div
        className="relative min-h-[640px] overflow-hidden px-[clamp(34px,8.25vw,138px)] pt-[clamp(48px,15.3vw,144px)] pb-[clamp(34px,6vw,58px)] lg:min-h-[calc(100svh-72px)] lg:px-0 lg:pt-0 lg:pb-0"
        data-fairlend-about-panel
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(to_right,transparent_0,transparent_13.55%,rgb(213_226_223/58%)_13.55%,rgb(213_226_223/58%)_13.7%,transparent_13.7%,transparent_88.42%,rgb(213_226_223/58%)_88.42%,rgb(213_226_223/58%)_88.57%,transparent_88.57%),linear-gradient(to_bottom,transparent_0,transparent_8.5%,rgb(213_226_223/58%)_8.5%,rgb(213_226_223/58%)_8.66%,transparent_8.66%,transparent_91.14%,rgb(213_226_223/58%)_91.14%,rgb(213_226_223/58%)_91.3%,transparent_91.3%)]"
        />
        <CropMark x={88.42} y={8.5} />
        <CropMark x={13.55} y={91.14} />
        <CropMark x={88.42} y={91.14} />

        <div
          className="relative z-[1] lg:absolute lg:top-[15.08%] lg:left-[20.1%] lg:w-[min(28.4vw,474px)]"
          data-fairlend-about-copy
        >
          <span
            aria-hidden="true"
            className="block h-[3px] w-[45px] bg-[var(--fairlend-orange,#ff3a19)]"
            data-fairlend-about-rule
          />
          <p className="mt-[25px] mb-0 text-[clamp(12px,0.84vw,14px)] leading-none font-extrabold tracking-[0.42em] text-[var(--fairlend-orange,#ff3a19)] uppercase">
            About Fairlend
          </p>
          <h2
            id="fairlend-judgment-title"
            className="mt-[31px] mb-0 max-w-[474px] font-serif text-[clamp(64px,5.36vw,90px)] leading-[0.935] font-bold tracking-normal text-[#073c43]"
            data-fairlend-about-title
          >
            Judgment,
            <br />
            made
            <br />
            measurable.
          </h2>
          <p
            className="mt-[31px] mb-0 max-w-[452px] text-[clamp(19px,1.24vw,21px)] leading-[1.28] font-semibold tracking-normal text-[#103641]"
            data-fairlend-about-summary
          >
            We combine local lending experience with disciplined process so every decision is fast,
            clear, and defensible.
          </p>
          <Link
            className="mt-[34px] inline-flex min-h-11 items-center gap-[10px] border-b-2 border-[var(--fairlend-orange-text,var(--fairlend-orange,#ff3a19))] pt-[5px] pb-[5px] text-[clamp(20px,1.38vw,23px)] leading-none font-medium text-[var(--fairlend-orange-text,var(--fairlend-orange,#ff3a19))] no-underline transition-[gap,color,border-color] duration-200 hover:gap-[14px] hover:border-[var(--fairlend-orange-text-hover,#d72f18)] hover:text-[var(--fairlend-orange-text-hover,#d72f18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fairlend-orange-text,var(--fairlend-orange,#ff3a19))]"
            href="#fairlend-method"
          >
            See our method
            <ArrowRight aria-hidden="true" className="size-[24px]" strokeWidth={1.8} />
          </Link>
        </div>

        <div
          className="relative z-[1] mt-[72px] grid max-w-[474px] grid-cols-3 items-end gap-0 lg:absolute lg:bottom-[14.65%] lg:left-[20.1%] lg:mt-0 lg:w-[min(28.4vw,474px)]"
          data-fairlend-about-proof
          data-testid="judgment-proof-points"
        >
          {proofPoints.map(({ icon: Icon, label }, index) => (
            <div
              className="relative grid min-h-[78px] min-w-0 justify-items-center gap-[13px] text-center text-[clamp(11px,0.78vw,13px)] leading-none font-extrabold text-[#0b3039] transition-[color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:text-[#ff3a19] [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-[cubic-bezier(0.22,1,0.36,1)] hover:[&_svg]:scale-105"
              key={label}
            >
              <Icon aria-hidden="true" className="size-[38px]" strokeWidth={1.8} />
              <span className="max-w-full whitespace-nowrap">{label}</span>
              {index < proofPoints.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-[4px] right-0 h-[78px] w-px bg-[#d7ccbf]"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
