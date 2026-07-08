import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'

let currentSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => currentSearchParams,
}))

describe('FairlendLeadIntake component', () => {
  afterEach(() => {
    cleanup()
    currentSearchParams = new URLSearchParams()
    vi.restoreAllMocks()
  })

  it('persists consultation leads before exposing the scheduler handoff', async () => {
    currentSearchParams = new URLSearchParams({
      intent: 'consultation',
      source: 'footer-book-consultation',
    })
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: '2bd61cf9-9b22-4b75-91d3-2ad6b4cd5d17' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(<FairlendLeadIntake />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Casey Lead' } })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'casey@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/what do you want to cover/i), {
      target: { value: 'Review a construction financing scenario.' },
    })
    fireEvent.click(screen.getByRole('button', { name: /request consultation/i }))

    await waitFor(() => {
      expect(screen.getByText('FairLend has the context.')).toBeTruthy()
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      email: 'casey@example.com',
      intake: {
        page: '/intake',
        requestedIntent: 'consultation',
        source: 'footer-book-consultation',
      },
      intent: 'consultation',
      name: 'Casey Lead',
      source: 'footer-book-consultation',
      status: 'submitted',
    })
    expect(screen.getByRole('link', { name: /continue to scheduler/i })).toBeTruthy()
  })

  it('keeps non-consultation booking follow-up inside intake with the saved lead id', async () => {
    currentSearchParams = new URLSearchParams({
      email: 'investor@example.com',
      intent: 'invest',
      name: 'Investor Lead',
      source: 'investor-final-cta',
    })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'c5d894d3-6fa9-4766-8f90-f041ac97a68d' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(<FairlendLeadIntake />)

    fireEvent.click(screen.getByRole('button', { name: /submit investor intake/i }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /request a consultation/i })).toBeTruthy()
    })

    expect(screen.getByRole('link', { name: /request a consultation/i }).getAttribute('href')).toBe(
      '/intake?intent=consultation&email=investor%40example.com&leadId=c5d894d3-6fa9-4766-8f90-f041ac97a68d&name=Investor+Lead&source=investor-final-cta-success-consultation',
    )
  })
})
