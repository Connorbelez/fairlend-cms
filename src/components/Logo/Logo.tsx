import Image from 'next/image'
import React from 'react'

import { cn } from '@/utilities/ui'

export const FAIRLEND_LOGO_SRC = '/assets/fairlend/fairlend-logo.svg'

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
        'inline-flex min-h-11 shrink-0 items-center gap-3 leading-none text-[#062c2f]',
        className,
      )}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="size-11 shrink-0 object-contain"
        fetchPriority={props.priority}
        height={240}
        loading={props.loading}
        src={FAIRLEND_LOGO_SRC}
        unoptimized
        width={244}
      />
      <span className="inline-flex items-baseline gap-2">
        <span className="font-serif text-[31px] font-bold tracking-normal">FairLend</span>
        <span className="text-[10px] font-medium tracking-[0.025em] text-[#494944]">Mortgage</span>
      </span>
    </span>
  )
}
