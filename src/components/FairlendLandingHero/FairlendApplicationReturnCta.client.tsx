'use client'

import { ArrowUp } from 'lucide-react'
import { type MouseEvent, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { analyticsConsentStateEventName } from '@/lib/analytics/config'
import { trackFairlendEvent } from '@/lib/analytics/events'

import { fairlendApplicationId, getFairlendApplicationElement } from './application-target'

/**
 * Keeps the long homepage recoverable on mobile after the application scrolls
 * out of view. It stays below the consent surface and does not appear until a
 * consent choice has dismissed that surface.
 */
export function FairlendApplicationReturnCta() {
  const [hasPassedApplication, setHasPassedApplication] = useState(false)
  const [isConsentPending, setIsConsentPending] = useState(true)

  useEffect(() => {
    const application = getFairlendApplicationElement()
    if (!application) return

    let cancelled = false
    const applicationObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setHasPassedApplication(!entry.isIntersecting && entry.boundingClientRect.bottom < 0)
      },
      { threshold: 0.05 },
    )
    const handleConsentState = (event: Event) => {
      const detail = (event as CustomEvent<{ pending?: boolean }>).detail
      setIsConsentPending(detail?.pending === true)
    }

    queueMicrotask(() => {
      if (!cancelled) {
        setIsConsentPending(document.documentElement.hasAttribute('data-fairlend-consent-pending'))
      }
    })
    applicationObserver.observe(application)
    window.addEventListener(analyticsConsentStateEventName, handleConsentState)

    return () => {
      cancelled = true
      applicationObserver.disconnect()
      window.removeEventListener(analyticsConsentStateEventName, handleConsentState)
    }
  }, [])

  function handleReturn(event: MouseEvent<HTMLAnchorElement>): void {
    const application = getFairlendApplicationElement()
    if (!application) return

    event.preventDefault()
    window.history.replaceState(null, '', `#${fairlendApplicationId}`)
    application.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
    application.focus({ preventScroll: true })
    trackFairlendEvent('fairlend_cta_clicked', {
      cta_id: 'return_to_application',
      cta_location: 'mobile_sticky',
      source: 'homepage-long-scroll',
    })
  }

  if (!hasPassedApplication || isConsentPending) return null

  return (
    <Button
      asChild
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[65] hidden min-h-12 rounded-full border border-[#08090a] bg-[#96ec18] px-5 text-sm font-extrabold text-[#08090a] shadow-[5px_5px_0_#08090a] hover:-translate-y-0.5 hover:bg-[#a4fb20] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08090a] hero-mobile:inline-flex"
    >
      <a href={`#${fairlendApplicationId}`} onClick={handleReturn}>
        <ArrowUp aria-hidden="true" className="size-4" strokeWidth={2.25} />
        Back to application
      </a>
    </Button>
  )
}
