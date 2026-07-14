import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

const brutalistCtaButtonVariants = cva(
  [
    'group/brutalist-cta relative isolate grid w-full grid-cols-[minmax(0,1fr)_var(--brutalist-cta-direction-width)] gap-0 overflow-visible border-0 p-0',
    'rounded-[7px] bg-(--brutalist-cta-surface) text-white shadow-[0_4px_0_var(--brutalist-cta-signal)]',
    'font-bold leading-[1.15] tracking-[-0.015em]',
    'transition-[background-color,box-shadow,color,transform] duration-200 ease-out',
    'hover:-translate-y-0.5 hover:bg-(--brutalist-cta-surface-hover) hover:shadow-[0_6px_0_var(--brutalist-cta-signal)]',
    'active:translate-y-0.5 active:shadow-[0_2px_0_var(--brutalist-cta-signal)]',
    'focus-visible:outline-(--brutalist-cta-signal)',
    '[--brutalist-cta-direction-width:58px] [--brutalist-cta-signal-hover:#b6f05b] [--brutalist-cta-signal:#aaea4d]',
    '[--brutalist-cta-surface-hover:#172018] [--brutalist-cta-surface:#10161f]',
  ],
  {
    variants: {
      size: {
        compact: 'h-[50px] min-h-[50px] text-base [--brutalist-cta-direction-width:50px]',
        default: 'h-[60px] min-h-[60px] text-[15px]',
        hero: 'h-[63px] min-h-[63px] text-[17px] [--brutalist-cta-direction-width:63px]',
        referral: 'h-[54px] min-h-[54px] text-sm [--brutalist-cta-direction-width:54px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type BrutalistCtaButtonProps = Omit<ButtonProps, 'children' | 'size'> &
  VariantProps<typeof brutalistCtaButtonVariants> & {
    arrowClassName?: string
    icon?: ReactNode
    labelClassName?: string
    children: ReactNode
  }

function BrutalistCtaButton({
  arrowClassName,
  children,
  className,
  icon,
  labelClassName,
  size,
  ...props
}: BrutalistCtaButtonProps) {
  return (
    <Button className={cn(brutalistCtaButtonVariants({ size }), className)} size="clear" {...props}>
      <span className={cn('min-w-0 px-5 text-left text-balance', labelClassName)}>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          'grid h-full w-full place-items-center rounded-r-[7px] bg-(--brutalist-cta-signal) text-(--brutalist-cta-surface)',
          'transition-colors duration-200 group-hover/brutalist-cta:bg-(--brutalist-cta-signal-hover)',
          arrowClassName,
        )}
      >
        {icon ?? (
          <ArrowRight
            className="size-[21px] transition-transform duration-200 group-hover/brutalist-cta:translate-x-[3px]"
            strokeWidth={2}
          />
        )}
      </span>
    </Button>
  )
}

export { BrutalistCtaButton, brutalistCtaButtonVariants }
export type { BrutalistCtaButtonProps }
