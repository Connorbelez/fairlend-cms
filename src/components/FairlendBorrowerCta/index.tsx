import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/utilities/ui'

import './fairlend-borrower-cta.css'

/**
 * Shared CTA primitive for the borrower page.
 *
 * Visual language mirrors the hero `StartApplicationButton` and the route-card
 * CTA: lime fill + ink rounded square containing a lime `ArrowUpRight`, with a
 * hover lift + arrow nudge. Secondary variants stay quiet (outlined or text)
 * so only one lime CTA reads per viewport, per the brief's CTA density rule.
 *
 * Arrow square is decorative; the link's accessible name comes from its label.
 */
export type BorrowerCtaVariant = 'primary' | 'secondary' | 'text'
export type BorrowerCtaSize = 'lg' | 'md'

type BaseProps = {
  variant?: BorrowerCtaVariant
  size?: BorrowerCtaSize
  label: string
  href: string
  className?: string
  /** Hide the arrow square (used for inline text links inside body copy). */
  hideArrow?: boolean
}

type AnchorProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'> & { as?: 'a' }
type LinkProps = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'> & { as: 'link' }

export function FairlendBorrowerCta({
  as = 'link',
  variant = 'primary',
  size = 'lg',
  label,
  href,
  className,
  hideArrow = false,
  ...rest
}: AnchorProps | LinkProps): ReactElement {
  const content = (
    <>
      <span className="fairlend-borrower-cta__label">{label}</span>
      {!hideArrow && (
        <span aria-hidden="true" className="fairlend-borrower-cta__arrow-box">
          <ArrowUpRight className="fairlend-borrower-cta__arrow-icon" strokeWidth={2.25} />
        </span>
      )}
    </>
  )

  const classes = cn(
    'fairlend-borrower-cta group inline-flex items-center justify-center gap-[12px] rounded-[9px] leading-none font-normal outline-none transition-[background-color,color,transform,box-shadow,border-color] duration-200 focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f7f5]',
    `fairlend-borrower-cta--${variant}`,
    size === 'lg'
      ? 'fairlend-borrower-cta--lg h-[55px] pl-[18px] pr-5 text-[17px]'
      : 'fairlend-borrower-cta--md h-12 px-4 text-[15px]',
    variant === 'primary' &&
      'bg-[#96ec18] text-[#101010] shadow-[0_10px_24px_rgb(118_205_0/12%)] hover:-translate-y-0.5 hover:bg-[#a4fb20] hover:shadow-[0_14px_32px_rgb(118_205_0/18%)]',
    variant === 'secondary' &&
      'border border-[rgb(8_9_10/22%)] bg-transparent text-[#08090a] hover:border-[#08090a] hover:bg-[rgb(8_9_10/4%)]',
    variant === 'text' && 'text-[#08090a] underline-offset-4 hover:underline',
    className,
  )

  if (as === 'a') {
    const anchorProps = rest as Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'>

    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    )
  }

  const linkProps = rest as Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'>

  return (
    <Link href={href} className={classes} {...linkProps}>
      {content}
    </Link>
  )
}
