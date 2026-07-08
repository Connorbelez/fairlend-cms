import type { HTMLAttributes, ReactElement } from 'react'

import { cn } from '@/utilities/ui'

import './section-rule.css'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type KickerElementAttributes<T extends HTMLElement> = HTMLAttributes<T> & DataAttributes

type FairlendSectionKickerProps = {
  className?: string
  label: string
  labelId?: string
  labelProps?: KickerElementAttributes<HTMLParagraphElement>
  number: string
  numberProps?: KickerElementAttributes<HTMLSpanElement>
  slashProps?: KickerElementAttributes<HTMLSpanElement>
} & KickerElementAttributes<HTMLDivElement>

export function FairlendSectionRule({
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement>): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cn('fairlend-section-rule', className)}
      {...rest}
    />
  )
}

export function FairlendSectionKicker({
  className,
  label,
  labelId,
  labelProps,
  number,
  numberProps,
  slashProps,
  ...rest
}: FairlendSectionKickerProps): ReactElement {
  const { className: slashClassName, ...slashRest } = slashProps ?? {}

  return (
    <div className={['about-section-kicker', className].filter(Boolean).join(' ')} {...rest}>
      <span className="about-text-textured" {...numberProps}>
        {number}
      </span>
      <span
        {...slashRest}
        aria-hidden
        className={['about-kicker-slash', slashClassName].filter(Boolean).join(' ')}
      >
        /
      </span>
      <p className="about-text-textured" id={labelId} {...labelProps}>
        {label}
      </p>
    </div>
  )
}
