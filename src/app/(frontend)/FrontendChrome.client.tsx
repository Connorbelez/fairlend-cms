'use client'

import { Header as DirectionalHoverHeader } from '@/components/directional-hover-header/header'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface FrontendChromeProps {
  children: ReactNode
  footer: ReactNode
  header: ReactNode
}

const STANDALONE_LANDING_PATHS = ['/', '/fairlend-landing-hero', '/intake', '/partners']

export function FrontendChrome({ children, footer, header }: FrontendChromeProps) {
  const pathname = usePathname()
  const isStandaloneLanding = STANDALONE_LANDING_PATHS.includes(pathname)

  if (isStandaloneLanding) {
    return (
      <>
        <DirectionalHoverHeader />
        {children}
        {footer}
      </>
    )
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  )
}
