import Image from 'next/image'
import React from 'react'

import { FAIRLEND_LOGO_SRC } from '@/components/Logo/Logo'

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      data-watermelon-logo-icon
    >
      <Image
        alt=""
        aria-hidden="true"
        className="size-full object-contain"
        height={240}
        src={FAIRLEND_LOGO_SRC}
        unoptimized
        width={244}
      />
    </span>
  )
}
