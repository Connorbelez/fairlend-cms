'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { FairlendConsultationBookingDialog } from '@/components/FairlendConsultationBooking/FairlendConsultationBookingDialog.client'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import {
  buildFairlendMortgageHref,
  fairlendRentalPropertyAcquisitionHeaderSource,
  fairlendRentalPropertyRefinanceHeaderSource,
} from '@/lib/fairlend-intake'

type HeaderNavItem = NonNullable<HeaderType['navItems']>[number]
type HeaderNavLink = HeaderNavItem['link']

const bookingTriggerHref = '#book-consultation'
const legacyPrivateMortgageHref = '/borrowers/private-mortgage-financing'
const privateMortgageIntakeHref =
  '/construction-financing?intent=mortgage&source=header-nav-private-mortgage'
const rentalPropertyAcquisitionIntakeHref = buildFairlendMortgageHref(
  fairlendRentalPropertyAcquisitionHeaderSource,
)
const rentalPropertyRefinanceIntakeHref = buildFairlendMortgageHref(
  fairlendRentalPropertyRefinanceHeaderSource,
)

const polishedHeaderHrefs = new Set([
  '/',
  '/construction-financing',
  privateMortgageIntakeHref,
  rentalPropertyAcquisitionIntakeHref,
  rentalPropertyRefinanceIntakeHref,
  '/investing/private-mortgage-lending',
  '/partners',
  '/garden-suite-financing-gta',
])

const headerAnchorFallbacks = new Map([
  ['/affordable-sustainable-rental-housing', '/#services'],
  ['/construction-draw-financing', '/#builder-consulting'],
  ['/multiplex-financing-gta', '/#services'],
  ['/posts', '/#questions'],
  ['/search', '/#questions'],
])

function normalizeHeaderHrefInput(url?: string | null): string | null {
  const trimmed = url?.trim()

  if (!trimmed) {
    return null
  }

  try {
    const parsed = new URL(trimmed)

    if (parsed.hostname === 'fairlend-cms.localhost') {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`
    }
  } catch {
    return trimmed
  }

  return trimmed
}

function getHeaderQueryParam(url: string | null | undefined, key: string): string | null {
  const query = normalizeHeaderHrefInput(url)?.split('?')[1]

  if (!query) {
    return null
  }

  return new URLSearchParams(query).get(key)
}

function getHeaderBookingSource({
  label,
  originalUrl,
  normalizedUrl,
}: {
  label?: string | null
  originalUrl?: string | null
  normalizedUrl?: string | null
}): string | null {
  const normalizedOriginalUrl = normalizeHeaderHrefInput(originalUrl)

  if (label === 'contact' || normalizedOriginalUrl === '/contact') {
    return 'header-nav-contact'
  }

  const intent = getHeaderQueryParam(normalizedOriginalUrl, 'intent')
  const source = getHeaderQueryParam(normalizedOriginalUrl, 'source')

  if (intent === 'consultation') {
    return source || 'header-nav-book-consultation'
  }

  if (intent === 'route-helper' && source === 'header-nav-general-intake') {
    return source
  }

  if (normalizedUrl === bookingTriggerHref) {
    return 'header-nav-book-consultation'
  }

  return null
}

function shouldOpenHeaderBooking(url?: string | null): boolean {
  const intent = getHeaderQueryParam(url, 'intent')
  const source = getHeaderQueryParam(url, 'source')

  return (
    intent === 'consultation' ||
    (intent === 'route-helper' && source === 'header-nav-general-intake')
  )
}

function normalizeHeaderUrl(url?: string | null): string | null {
  const normalized = normalizeHeaderHrefInput(url)

  if (!normalized) {
    return null
  }

  if (normalized === legacyPrivateMortgageHref) {
    return privateMortgageIntakeHref
  }

  if (polishedHeaderHrefs.has(normalized)) {
    return normalized
  }

  if (normalized.startsWith('/construction-financing?')) {
    return '/construction-financing'
  }

  return headerAnchorFallbacks.get(normalized) ?? normalized
}

function normalizeHeaderNavLink(link: HeaderNavLink): HeaderNavLink {
  const label = link.label?.trim().toLowerCase()
  const url = normalizeHeaderHrefInput(link.url)

  if (label === 'posts' || label === 'resources' || url === '/posts') {
    return {
      ...link,
      newTab: false,
      reference: null,
      type: 'custom',
      url: '/#questions',
    }
  }

  if (label === 'contact' || url === '/contact') {
    return {
      ...link,
      reference: null,
      type: 'custom',
      url: bookingTriggerHref,
    }
  }

  if (shouldOpenHeaderBooking(url)) {
    return {
      ...link,
      newTab: false,
      reference: null,
      type: 'custom',
      url: bookingTriggerHref,
    }
  }

  const normalizedUrl = normalizeHeaderUrl(url)

  if (normalizedUrl && normalizedUrl !== url) {
    return {
      ...link,
      newTab: false,
      reference: null,
      type: 'custom',
      url: normalizedUrl,
    }
  }

  return link
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav
      className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:flex-none sm:gap-3"
      aria-label="Primary navigation"
    >
      {navItems.map(({ link }, i) => {
        const normalizedLink = normalizeHeaderNavLink(link)
        const label = normalizedLink.label?.trim().toLowerCase()
        const bookingSource = getHeaderBookingSource({
          label,
          normalizedUrl: normalizedLink.url,
          originalUrl: link.url,
        })

        if (bookingSource) {
          return (
            <FairlendConsultationBookingDialog
              className="min-h-11 rounded-full px-2 text-[12px] font-extrabold tracking-normal whitespace-nowrap uppercase text-[#062c2f] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#fffaf4] hover:text-[#a92d17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a92d17] sm:px-3 sm:text-[13px]"
              key={i}
              leadershipCta={false}
              source={bookingSource}
            >
              {normalizedLink.label}
            </FairlendConsultationBookingDialog>
          )
        }

        return (
          <CMSLink
            key={i}
            {...normalizedLink}
            appearance="link"
            className="min-h-11 rounded-full px-2 text-[12px] font-extrabold uppercase tracking-normal text-[#062c2f] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#fffaf4] hover:text-[#a92d17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a92d17] sm:px-3 sm:text-[13px]"
            preserveLinkHitArea
            size="default"
          />
        )
      })}
      <Link
        aria-label="Search FairLend resources"
        className="grid size-11 min-w-11 shrink-0 place-items-center rounded-full border border-[#e7d8ca] bg-[#fffaf4] text-[#062c2f] shadow-[0_8px_18px_rgb(63_38_18/6%),inset_0_1px_0_rgb(255_252_248/86%)] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-px hover:border-[#d79d8a] hover:text-[#a92d17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a92d17]"
        href="/#questions"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="size-5" strokeWidth={1.9} />
      </Link>
    </nav>
  )
}
