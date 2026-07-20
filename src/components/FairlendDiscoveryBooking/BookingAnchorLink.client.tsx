'use client'

import type { MouseEvent, ReactNode } from 'react'

type BookingAnchorLinkProps = {
  children: ReactNode
  className?: string
  href: string
}

export function BookingAnchorLink({ children, className, href }: BookingAnchorLinkProps) {
  const focusScheduler = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector<HTMLElement>(href)
    if (!target) return

    event.preventDefault()
    window.history.replaceState(null, '', href)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    window.requestAnimationFrame(() => target.focus({ preventScroll: true }))
  }

  return (
    <a
      className={className}
      data-analytics-cta-id="discovery-booking-anchor"
      data-analytics-cta-location="discovery-booking-page"
      data-analytics-source="persona-discovery"
      href={href}
      onClick={focusScheduler}
    >
      {children}
    </a>
  )
}
