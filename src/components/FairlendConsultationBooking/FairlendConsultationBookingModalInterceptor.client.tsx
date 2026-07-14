'use client'

import * as React from 'react'

import { trackFairlendEvent } from '@/lib/analytics/events'

import { FairlendConsultationBookingDialog } from './FairlendConsultationBookingDialog.client'

const fallbackSource = 'sitewide-consultation-booking'

export function getConsultationBookingSource(href: string, origin: string): string | null {
  try {
    const url = new URL(href, origin)

    if (url.origin !== origin) return null

    if (url.pathname === '/intake' && url.searchParams.get('intent') === 'consultation') {
      return url.searchParams.get('source') || fallbackSource
    }

    if (url.hash === '#consultation' || url.hash === '#book-consultation') {
      return fallbackSource
    }
  } catch {
    return null
  }

  return null
}

/**
 * Keeps every first-party consultation CTA in the booking flow, including
 * Payload-authored links, without requiring each page or block to own a modal.
 */
export function FairlendConsultationBookingModalInterceptor() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [source, setSource] = React.useState(fallbackSource)

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return

      const trigger = target.closest<HTMLElement>('a[href], [data-consultation-booking]')
      if (!trigger || trigger.closest('[data-fairlend-consultation-trigger]')) return

      const bookingSource = trigger.hasAttribute('data-consultation-booking')
        ? trigger.dataset.consultationBookingSource || fallbackSource
        : getConsultationBookingSource(trigger.getAttribute('href') || '', window.location.origin)

      if (!bookingSource) return

      event.preventDefault()
      setSource(bookingSource)
      setIsOpen(true)
      trackFairlendEvent('fairlend_consultation_scheduler_opened', { source: bookingSource })
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return (
    <FairlendConsultationBookingDialog
      onOpenChange={setIsOpen}
      open={isOpen}
      source={source}
      trigger={false}
    />
  )
}
