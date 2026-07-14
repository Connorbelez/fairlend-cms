import { Phone } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'

import { buildFairlendConsultationHref } from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

export const FAIRLEND_CONTACT_PHONE_LABEL = '647-831-7605'
export const FAIRLEND_CONTACT_PHONE_HREF = 'tel:+16478317605'

type FairlendTalkToExpertCtaProps = ComponentPropsWithoutRef<'a'> & {
  eyebrow?: string
  label?: string
}

export function FairlendTalkToExpertCta({
  className,
  eyebrow = 'Talk to an Expert',
  href = buildFairlendConsultationHref('talk-to-expert-cta'),
  label = 'Book a consultation',
  rel,
  target,
  ...props
}: FairlendTalkToExpertCtaProps) {
  return (
    <a
      aria-label="Request a FairLend expert consultation"
      className={cn(
        'group relative flex w-fit items-center gap-[clamp(9px,0.7vw,12px)] rounded-full bg-[var(--fairlend-ink)] px-[clamp(14px,1.2vw,20px)] py-[clamp(8px,0.72vw,10px)] text-[var(--fairlend-cream-soft)] shadow-[0_8px_20px_rgb(13_39_50/18%)] transition-[transform,box-shadow] duration-[260ms] ease-[var(--hero-ease-quint)] [--hero-ease-quint:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[oklch(22%_0.05_205)] hover:shadow-[0_12px_28px_rgb(13_39_50/26%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fairlend-orange)] active:translate-y-0',
        className,
      )}
      href={href}
      rel={rel}
      target={target}
      {...props}
    >
      <span className="flex size-[clamp(24px,1.7vw,29px)] items-center justify-center rounded-full bg-[var(--fairlend-orange)] text-white shadow-[0_0_0_3px_rgb(255_250_244/40%)] transition-transform duration-260 group-hover:scale-110">
        <Phone aria-hidden="true" className="size-[clamp(14px,1vw,18px)]" strokeWidth={2} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[clamp(9px,0.62vw,11px)] leading-none font-semibold tracking-wide uppercase text-[#a7b4bb]">
          {eyebrow}
        </span>
        <span className="text-[clamp(13px,0.92vw,15px)] leading-none font-extrabold">{label}</span>
      </span>
    </a>
  )
}
