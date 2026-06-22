'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav
      className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:flex-none sm:gap-3"
      aria-label="Primary navigation"
    >
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="min-h-11 rounded-full px-2 text-[12px] font-extrabold uppercase tracking-normal text-[#062c2f] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#fffaf4] hover:text-[#a92d17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a92d17] sm:px-3 sm:text-[13px]"
            preserveLinkHitArea
            size="default"
          />
        )
      })}
      <Link
        aria-label="Search Fairlend resources"
        className="grid size-11 min-w-11 shrink-0 place-items-center rounded-full border border-[#e7d8ca] bg-[#fffaf4] text-[#062c2f] shadow-[0_8px_18px_rgb(63_38_18/6%),inset_0_1px_0_rgb(255_252_248/86%)] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-px hover:border-[#d79d8a] hover:text-[#a92d17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a92d17]"
        href="/search"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="size-5" strokeWidth={1.9} />
      </Link>
    </nav>
  )
}
