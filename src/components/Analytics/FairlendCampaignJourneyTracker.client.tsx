'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import {
  createFairlendCampaignJourneyEventId,
  hasFairlendCampaignSession,
  sendFairlendCampaignJourneyEvent,
} from '@/lib/fairlend-campaign-journey.client'

export function FairlendCampaignJourneyTracker({ enabled }: { enabled: boolean }): null {
  const pathname = usePathname()

  useEffect(() => {
    if (!enabled || !hasFairlendCampaignSession()) return

    const visitId = crypto.randomUUID()
    const enteredAt = Date.now()
    const exitEventId = createFairlendCampaignJourneyEventId('page-exit')
    let exitSent = false

    sendFairlendCampaignJourneyEvent({
      eventId: createFairlendCampaignJourneyEventId('page-view'),
      eventType: 'page_view',
      occurredAt: new Date(enteredAt).toISOString(),
      pagePath: pathname,
      visitId,
    })

    const sendExit = () => {
      if (exitSent) return
      exitSent = true
      sendFairlendCampaignJourneyEvent(
        {
          durationMs: Date.now() - enteredAt,
          eventId: exitEventId,
          eventType: 'page_exit',
          pagePath: pathname,
          visitId,
        },
        { beacon: true },
      )
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendExit()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', sendExit)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', sendExit)
      sendExit()
    }
  }, [enabled, pathname])

  return null
}
