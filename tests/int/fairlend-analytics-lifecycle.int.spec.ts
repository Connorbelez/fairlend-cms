import { describe, expect, it } from 'vitest'

import { mapTwentyLifecycleStatus } from '@/lib/analytics/lifecycle'

describe('PostHog lifecycle mapping', () => {
  it.each([
    ['QUALIFIED', 'fairlend_lead_qualified'],
    ['APPLICATION_IN_PROGRESS', 'fairlend_lead_working_file'],
    ['UNDERWRITING', 'fairlend_lead_working_file'],
    ['FUNDED', 'fairlend_lead_closed_won'],
    ['COMPLETED', 'fairlend_lead_closed_won'],
    ['DECLINED', 'fairlend_lead_closed_lost'],
  ])('maps %s to %s', (status, event) => {
    expect(mapTwentyLifecycleStatus(status)).toBe(event)
  })

  it('ignores unknown and absent CRM states', () => {
    expect(mapTwentyLifecycleStatus('NEW')).toBeUndefined()
    expect(mapTwentyLifecycleStatus(null)).toBeUndefined()
  })
})
