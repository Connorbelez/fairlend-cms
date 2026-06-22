import React from 'react'

import { cn } from '@/utilities/ui'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      aria-label="FairLend Mortgage"
      className={cn(
        'inline-flex min-h-11 min-w-[168px] flex-col justify-center leading-none text-[#062c2f]',
        className,
      )}
    >
      <span className="font-serif text-[31px] font-bold tracking-normal">FairLend</span>
      <span className="-mt-0.5 text-[10px] font-extrabold tracking-[0.24em] uppercase">
        Mortgage
      </span>
    </span>
  )
}
