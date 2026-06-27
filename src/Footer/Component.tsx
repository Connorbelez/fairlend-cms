import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { fairlendRegistration } from '@/components/FairlendRegistrationDisclosure'
import { WatermelonFooter } from './WatermelonFooter.client'

const demoFooterLabels = new Set(['admin', 'payload', 'source code'])

const defaultFooterNavItems = [
  { link: { label: 'Home', type: 'custom' as const, url: '/' } },
  { link: { label: 'Application', type: 'custom' as const, url: '/intake' } },
  { link: { label: 'Resources', type: 'custom' as const, url: '/posts' } },
  { link: { label: 'Search', type: 'custom' as const, url: '/search' } },
  { link: { label: 'Contact', type: 'custom' as const, url: '/contact' } },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const cmsNavItems = footerData?.navItems || []
  const publicNavItems = cmsNavItems.filter(
    ({ link }) => !demoFooterLabels.has(link.label.toLowerCase()),
  )
  const navItems = publicNavItems.length > 0 ? publicNavItems : defaultFooterNavItems
  const year = new Date().getFullYear()

  return (
    <WatermelonFooter
      currentAsOf={fairlendRegistration.currentAsOf}
      doingBusinessAs={fairlendRegistration.doingBusinessAs}
      legalName={fairlendRegistration.legalName}
      navItems={navItems}
      year={year}
    />
  )
}
