'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface FrontendChromeProps {
  children: ReactNode
  footer: ReactNode
  header: ReactNode
}

export function FrontendChrome({ children, footer, header }: FrontendChromeProps) {
  const pathname = usePathname()
  const isStandaloneLanding = pathname === '/'

  if (isStandaloneLanding) {
    return <>{children}</>
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  )
}
