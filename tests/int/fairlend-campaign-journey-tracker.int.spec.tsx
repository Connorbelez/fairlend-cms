import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FairlendCampaignJourneyTracker } from '@/components/Analytics/FairlendCampaignJourneyTracker.client'

const trackerMocks = vi.hoisted(() => ({
  createEventId: vi.fn(),
  hasSession: vi.fn(),
  pathname: '/borrowers/construction-financing',
  sendEvent: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => trackerMocks.pathname,
}))

vi.mock('@/lib/fairlend-campaign-journey.client', () => ({
  createFairlendCampaignJourneyEventId: trackerMocks.createEventId,
  hasFairlendCampaignSession: trackerMocks.hasSession,
  sendFairlendCampaignJourneyEvent: trackerMocks.sendEvent,
}))

describe('FairLend campaign journey tracker', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('records a page view and deduplicated exit for a consented QR session', async () => {
    trackerMocks.hasSession.mockReturnValue(true)
    trackerMocks.createEventId
      .mockReturnValueOnce('page-exit:exit-id')
      .mockReturnValueOnce('page-view:view-id')

    const view = render(<FairlendCampaignJourneyTracker enabled />)

    await waitFor(() => {
      expect(trackerMocks.sendEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'page-view:view-id',
          eventType: 'page_view',
          pagePath: '/borrowers/construction-financing',
        }),
      )
    })

    view.unmount()

    expect(trackerMocks.sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'page-exit:exit-id',
        eventType: 'page_exit',
        pagePath: '/borrowers/construction-financing',
      }),
      { beacon: true },
    )
  })

  it('does not record behavioral events without analytics consent', () => {
    trackerMocks.hasSession.mockReturnValue(true)
    render(<FairlendCampaignJourneyTracker enabled={false} />)
    expect(trackerMocks.sendEvent).not.toHaveBeenCalled()
  })
})
