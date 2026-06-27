import { cn } from '@/utilities/ui'

const blueprintBlue = '#155a94'

export function HeroHandwrittenInsertion({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute bottom-[calc(100%+clamp(6px,0.8vw,12px))] left-1/2 z-10 flex -translate-x-1/2 h-[clamp(24px,1.8vw,34px)] w-max max-w-[calc(100vw-48px)] items-end justify-center text-[clamp(18px,1.2vw,25px)] leading-none font-normal tracking-normal text-[#155a94] [font-family:Architects_Daughter,cursive] [text-shadow:0_1px_0_rgb(255_253_247/96%),0_7px_18px_rgb(21_90_148/14%)] motion-safe:animate-[heroHandwrittenNoteIn_540ms_var(--hero-ease-out)_180ms_both] hero-max-1279:bottom-[calc(100%+clamp(5px,1.2vw,10px))] hero-max-1279:h-[clamp(22px,2.9vw,30px)] hero-max-1279:text-[clamp(16px,2.25vw,23px)] hero-tablet-landscape:text-[clamp(17px,1.82vw,22px)] hero-tablet-landscape-short:bottom-[calc(100%+4px)] hero-tablet-landscape-short:h-[21px] hero-tablet-landscape-short:text-[clamp(14px,1.42vw,17px)] hero-mobile:h-[19px] hero-mobile:text-[clamp(13px,4vw,16px)] hero-mobile-short:hidden',
        className,
      )}
      data-hero-insertion="financing-for"
      data-testid="hero-handwritten-insertion"
      style={{ color: blueprintBlue }}
    >
      <span className="relative block translate-y-[3px] -rotate-[5deg] whitespace-nowrap hero-tablet-landscape-short:translate-y-[2px] hero-mobile:translate-y-[2px]">
        (and execution support)
      </span>
    </span>
  )
}
