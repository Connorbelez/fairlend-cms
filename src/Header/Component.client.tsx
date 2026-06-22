'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useSyncExternalStore } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { FairlendTalkToExpertCta } from '@/components/FairlendTalkToExpertCta'
import { HeaderNav } from './Nav'

const subscribeToHydration = () => () => undefined
const getServerTheme = () => null

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const theme = useSyncExternalStore(
    subscribeToHydration,
    () => headerTheme ?? null,
    getServerTheme,
  )

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <header
      className="relative z-20 border-b border-[#e7d8ca] bg-[#fffaf4]/92 text-[#062c2f] backdrop-blur-md motion-safe:animate-[fairlendChromeDrop_520ms_cubic-bezier(0.16,1,0.3,1)_both]"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container flex flex-wrap items-center justify-between gap-3 py-4 sm:flex-nowrap sm:gap-6">
        <Link
          aria-label="FairLend Mortgage home"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3a19]"
          href="/"
        >
          <Logo loading="eager" priority="high" />
        </Link>
        <FairlendTalkToExpertCta className="order-3 mx-auto mt-1 hidden scale-[0.88] hero-mobile:flex hero-mobile:origin-center sm:order-none sm:mt-0" />
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
