import type { HTMLAttributes, ReactElement } from 'react'

type FairlendSectionKickerProps = {
  className?: string
  label: string
  labelId?: string
  labelProps?: HTMLAttributes<HTMLParagraphElement>
  number: string
  numberProps?: HTMLAttributes<HTMLSpanElement>
  slashProps?: HTMLAttributes<HTMLSpanElement>
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
