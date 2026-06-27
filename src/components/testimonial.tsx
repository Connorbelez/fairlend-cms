import Image, { type ImageProps } from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/utilities/ui'

const testimonialVariants = cva('flex h-full flex-col', {
  variants: {
    variant: {
      default: '',
      fairlend:
        'group relative isolate min-h-[236px] overflow-hidden rounded-[8px] border border-[#dccbbd] bg-[#fffaf4] bg-[linear-gradient(135deg,rgb(255_253_248/98%)_0%,rgb(255_250_244/94%)_42%,rgb(246_233_220/96%)_100%)] p-[1px] shadow-[0_1px_0_rgb(255_255_255/90%)_inset,0_18px_46px_rgb(64_38_18/9%),0_46px_92px_rgb(64_38_18/7%)] before:pointer-events-none before:absolute before:inset-[1px] before:z-0 before:rounded-[7px] before:bg-[linear-gradient(90deg,rgb(6_44_47/5%)_1px,transparent_1px),linear-gradient(180deg,rgb(6_44_47/4%)_1px,transparent_1px),radial-gradient(circle_at_13%_20%,rgb(255_58_25/10%)_0%,transparent_24%),radial-gradient(circle_at_88%_14%,rgb(255_255_255/70%)_0%,transparent_27%)] before:bg-[length:28px_28px,28px_28px,100%_100%,100%_100%] after:pointer-events-none after:absolute after:inset-x-[18px] after:top-[17px] after:z-[1] after:h-px after:bg-[linear-gradient(90deg,rgb(255_58_25/92%)_0_42px,rgb(6_44_47/18%)_42px_100%)] hover:border-[#d0bcaa] hover:shadow-[0_1px_0_rgb(255_255_255/95%)_inset,0_22px_54px_rgb(64_38_18/11%),0_54px_108px_rgb(64_38_18/8%)] lg:min-h-[210px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const testimonialQuoteVariants = cva('grow text-pretty text-foreground', {
  variants: {
    variant: {
      default: 'px-4 py-3 text-base',
      fairlend:
        'relative z-10 m-0 px-6 pt-[46px] pb-5 text-[18px] leading-[1.34] font-extrabold tracking-normal text-[#092b35] sm:text-[19px] lg:px-5 lg:pt-[42px] lg:pb-4 lg:text-[16px] lg:leading-[1.26] xl:text-[17px] 2xl:text-[18px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const testimonialAuthorVariants = cva(
  'grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-3.5',
  {
    variants: {
      variant: {
      default: 'px-4 pt-1 pb-3',
      fairlend:
          'relative z-10 mt-auto mx-4 mb-4 rounded-[7px] border border-white/70 bg-[rgb(255_255_255/34%)] px-4 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/80%)] backdrop-blur-[2px] lg:mx-3 lg:mb-3 lg:px-3 lg:py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const testimonialAvatarVariants = cva('relative row-span-2 shrink-0', {
  variants: {
    variant: {
      default: 'size-8',
      fairlend:
        'grid size-12 place-items-center rounded-full bg-[#062c2f] text-[13px] font-extrabold text-[#fffaf4] shadow-[0_9px_18px_rgb(6_44_47/20%),inset_0_1px_0_rgb(255_255_255/18%)] lg:size-10 lg:text-[12px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const testimonialAuthorNameVariants = cva(
  'flex items-center gap-1.5 font-semibold text-foreground',
  {
    variants: {
      variant: {
      default: 'text-sm leading-4.5',
        fairlend: 'text-[15px] leading-5 font-extrabold text-[var(--fairlend-ink)] lg:text-[14px] lg:leading-[1.15]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const testimonialAuthorTaglineVariants = cva('text-balance text-muted-foreground', {
  variants: {
    variant: {
      default: 'text-xs leading-4',
      fairlend: 'text-[12px] leading-4 font-bold text-[var(--fairlend-muted)] lg:text-[11px] lg:leading-[1.25]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const testimonialVerifiedBadgeVariants = cva(
  "flex [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: '',
        fairlend:
          'ml-0.5 rounded-full text-[var(--fairlend-orange)] drop-shadow-[0_4px_8px_rgb(255_58_25/16%)] [&_svg:not([class*=size-])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type TestimonialProps = ComponentProps<'figure'> & VariantProps<typeof testimonialVariants>

export function Testimonial({ className, variant, ...props }: TestimonialProps) {
  return (
    <figure
      data-slot="testimonial"
      className={cn(testimonialVariants({ variant }), className)}
      {...props}
    />
  )
}

type TestimonialQuoteProps = ComponentProps<'blockquote'> &
  VariantProps<typeof testimonialQuoteVariants>

export function TestimonialQuote({ className, variant, ...props }: TestimonialQuoteProps) {
  return (
    <blockquote
      data-slot="testimonial-quote"
      className={cn(testimonialQuoteVariants({ variant }), className)}
      {...props}
    />
  )
}

type TestimonialAuthorProps = ComponentProps<'figcaption'> &
  VariantProps<typeof testimonialAuthorVariants>

export function TestimonialAuthor({ className, variant, ...props }: TestimonialAuthorProps) {
  return (
    <figcaption
      data-slot="testimonial-author"
      className={cn(testimonialAuthorVariants({ variant }), className)}
      {...props}
    />
  )
}

type TestimonialAvatarProps = ComponentProps<'div'> & VariantProps<typeof testimonialAvatarVariants>

export function TestimonialAvatar({ className, variant, ...props }: TestimonialAvatarProps) {
  return (
    <div
      data-slot="testimonial-avatar"
      className={cn(testimonialAvatarVariants({ variant }), className)}
      {...props}
    />
  )
}

export function TestimonialAvatarImg({ className, alt, ...props }: ImageProps) {
  return (
    <Image
      data-slot="testimonial-avatar-img"
      className={cn('size-8 rounded-full select-none', className)}
      alt={alt}
      {...props}
    />
  )
}

export function TestimonialAvatarRing({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="testimonial-avatar-ring"
      className={cn(
        'pointer-events-none absolute inset-0 rounded-full inset-ring-1 inset-ring-black/10 dark:inset-ring-white/15',
        className,
      )}
      {...props}
    />
  )
}

type TestimonialAuthorNameProps = ComponentProps<'div'> &
  VariantProps<typeof testimonialAuthorNameVariants>

export function TestimonialAuthorName({
  className,
  variant,
  ...props
}: TestimonialAuthorNameProps) {
  return (
    <div
      data-slot="testimonial-author-name"
      className={cn(testimonialAuthorNameVariants({ variant }), className)}
      {...props}
    />
  )
}

type TestimonialAuthorTaglineProps = ComponentProps<'div'> &
  VariantProps<typeof testimonialAuthorTaglineVariants>

export function TestimonialAuthorTagline({
  className,
  variant,
  ...props
}: TestimonialAuthorTaglineProps) {
  return (
    <div
      data-slot="testimonial-author-tagline"
      className={cn(testimonialAuthorTaglineVariants({ variant }), className)}
      {...props}
    />
  )
}

type TestimonialVerifiedBadgeProps = ComponentProps<'span'> &
  VariantProps<typeof testimonialVerifiedBadgeVariants>

export function TestimonialVerifiedBadge({
  className,
  variant,
  ...props
}: TestimonialVerifiedBadgeProps) {
  return (
    <span
      data-slot="testimonial-verified-badge"
      className={cn(testimonialVerifiedBadgeVariants({ variant }), className)}
      aria-hidden
      {...props}
    />
  )
}
