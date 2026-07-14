'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/utilities/ui'

export type FairlendApplicationChoice = {
  label: string
  value: string
}

export function FairlendApplicationChoiceChips({
  className,
  describedBy,
  legend,
  name,
  onValueChange,
  options,
  required = false,
  value,
}: {
  className?: string
  describedBy?: string
  legend: string
  name: string
  onValueChange: (value: string) => void
  options: readonly FairlendApplicationChoice[]
  required?: boolean
  value: string
}) {
  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="mb-[7px] text-[clamp(10px,0.72vw,11px)] font-extrabold uppercase tracking-[0.04em] text-[#2f3b39]">
        {legend}
      </legend>
      <RadioGroup
        aria-describedby={describedBy}
        className="flex min-w-0 flex-wrap gap-[7px]"
        name={name}
        onValueChange={onValueChange}
        required={required}
        value={value}
      >
        {options.map((option) => {
          const id = `fairlend-${name}-${option.value}`

          return (
            <label className="relative min-w-0 cursor-pointer" htmlFor={id} key={option.value}>
              <RadioGroupItem className="peer sr-only" id={id} value={option.value} />
              <span className="flex min-h-[38px] min-w-0 items-center justify-center gap-0 rounded-full border border-[#d3d6d1] bg-[rgb(255_253_249/94%)] px-[12px] py-[7px] text-center text-xs leading-[1.15] font-bold text-[#263330] shadow-[0_1px_0_rgb(255_255_255/80%)] transition-[color,background-color,border-color,box-shadow,transform,gap] duration-200 ease-[var(--hero-ease-quint)] before:size-0 before:shrink-0 before:rounded-full before:bg-[#173421] before:opacity-0 before:transition-[width,height,opacity] before:duration-200 before:content-[''] hover:-translate-y-px hover:border-[#a8b0aa] hover:bg-white peer-data-[state=checked]:gap-[7px] peer-data-[state=checked]:border-[#79c90e] peer-data-[state=checked]:bg-[#96ec18] peer-data-[state=checked]:text-[#102015] peer-data-[state=checked]:shadow-[0_0_0_2px_rgb(255_253_249),0_0_0_4px_rgb(150_236_24/28%),0_6px_14px_rgb(89_145_8/13%)] peer-data-[state=checked]:before:size-[6px] peer-data-[state=checked]:before:opacity-100 peer-focus-visible:outline-none peer-focus-visible:ring-[3px] peer-focus-visible:ring-[#111] peer-disabled:cursor-not-allowed peer-disabled:opacity-50 hero-mobile:min-h-[36px] hero-mobile:px-[10px] hero-mobile:py-[6px]">
                {option.label}
              </span>
            </label>
          )
        })}
      </RadioGroup>
    </fieldset>
  )
}
