import type { HTMLAttributes, ReactElement } from 'react'

type DataAttributes = {
  [key: `data-${string}`]: boolean | number | string | undefined
}

type FairlendSectionKickerProps = {
  className?: string
  label: string
  labelId?: string
  labelProps?: HTMLAttributes<HTMLParagraphElement> & DataAttributes
  number: string
  numberProps?: HTMLAttributes<HTMLSpanElement> & DataAttributes
  slashProps?: HTMLAttributes<HTMLSpanElement> & DataAttributes
} & HTMLAttributes<HTMLDivElement>

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
