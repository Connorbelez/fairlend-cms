import type { FairlendCampaignJourneyEventInput } from '@/lib/fairlend-campaign-journey'

const markerCookieName = 'fairlend_campaign_session'
const journeyEndpoint = '/api/campaign-journey'

export function hasFairlendCampaignSession(): boolean {
  return document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith(`${markerCookieName}=`))
}

export function createFairlendCampaignJourneyEventId(prefix: string): string {
  return `${prefix}:${crypto.randomUUID()}`
}

export function sendFairlendCampaignJourneyEvent(
  event: FairlendCampaignJourneyEventInput,
  options: { beacon?: boolean } = {},
): void {
  if (!hasFairlendCampaignSession()) return

  const body = JSON.stringify(event)
  if (options.beacon && navigator.sendBeacon) {
    navigator.sendBeacon(journeyEndpoint, new Blob([body], { type: 'application/json' }))
    return
  }

  void fetch(journeyEndpoint, {
    body,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    method: 'POST',
  }).catch(() => {
    // Attribution must never interrupt navigation or form completion.
  })
}
