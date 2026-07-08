import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { fairlendRegistration } from '@/components/FairlendRegistrationDisclosure'
import { buildFairlendConsultationHref, buildFairlendContactHref } from '@/lib/fairlend-intake'
import type { Footer as FooterGlobal } from '@/payload-types'
import { WatermelonFooter } from './WatermelonFooter.client'

const demoFooterLabels = new Set(['admin', 'payload', 'source code'])
const footerBookingHref = buildFairlendConsultationHref('footer-default-book-consultation')
const footerContactHref = buildFairlendContactHref('footer-default-contact')
type FooterNavItem = NonNullable<FooterGlobal['navItems']>[number]

const defaultFooterNavItems = [
  { link: { label: 'Home', type: 'custom' as const, url: '/' } },
  { link: { label: 'Application', type: 'custom' as const, url: '/intake' } },
  {
    link: {
      label: 'Book consultation',
      newTab: false,
      type: 'custom' as const,
      url: footerBookingHref,
    },
  },
  { link: { label: 'Search', type: 'custom' as const, url: '/search' } },
  {
    link: {
      label: 'Contact',
      type: 'custom' as const,
      url: footerContactHref,
    },
  },
]

function normalizeFooterNavItem(item: FooterNavItem): FooterNavItem {
  const label = item.link.label?.trim().toLowerCase()
  const url = item.link.url?.trim()

  if (label === 'resources' || label === 'posts' || url === '/posts') {
    return {
      ...item,
      link: {
        ...item.link,
        label: 'Book consultation',
        newTab: false,
        reference: null,
        type: 'custom',
        url: footerBookingHref,
      },
    }
  }

  if (label === 'contact' || url === '/contact') {
    return {
      ...item,
      link: {
        ...item.link,
        reference: null,
        type: 'custom',
        url: footerContactHref,
      },
    }
  }

  return item
}

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const cmsNavItems = footerData?.navItems || []
  const publicNavItems = cmsNavItems.filter(
    ({ link }) => !demoFooterLabels.has(link.label.toLowerCase()),
  )
  const navItems =
    publicNavItems.length > 0 ? publicNavItems.map(normalizeFooterNavItem) : defaultFooterNavItems
  const year = new Date().getFullYear()

  return (
    <WatermelonFooter
      doingBusinessAs={fairlendRegistration.doingBusinessAs}
      legalName={fairlendRegistration.legalName}
      navItems={navItems}
      year={year}
    />
  )
}
