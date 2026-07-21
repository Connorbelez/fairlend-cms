import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/ui'

const selectableChipVariants = cva('', {
  variants: {
    active: {
      false: null,
      true: 'is-selected',
    },
    variant: {
      builder: 'bp-chip-option fairlend-choice-pill',
      mortgage: 'fl-mortgage-chip-option',
    },
  },
  defaultVariants: {
    active: false,
    variant: 'builder',
  },
})

type SelectableChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> &
  Omit<VariantProps<typeof selectableChipVariants>, 'active'> & {
    active: boolean
  }

function SelectableChip({
  active,
  className,
  type = 'button',
  variant,
  ...props
}: SelectableChipProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(selectableChipVariants({ active, variant }), className)}
      data-selected={active}
      type={type}
      {...props}
    />
  )
}

export { SelectableChip, selectableChipVariants }
