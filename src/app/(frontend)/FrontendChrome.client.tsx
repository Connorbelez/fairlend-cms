'use client'

import { Header as DirectionalHoverHeader } from '@/components/directional-hover-header/header'
import type { ReactNode } from 'react'

interface FrontendChromeProps {
  children: ReactNode
  footer: ReactNode
}

export function FrontendChrome({ children, footer }: FrontendChromeProps) {
  return (
    <>
      <DirectionalHoverHeader />
      {children}
      {footer}
    </>
  )
}
