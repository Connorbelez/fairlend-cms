import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
    vi.unstubAllGlobals()
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

    fireEvent.click(screen.getByRole('button', { name: /send investor inquiry/i }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /request a consultation/i })).toBeTruthy()
    })

    expect(screen.getByRole('link', { name: /request a consultation/i }).getAttribute('href')).toBe(
      '/intake?intent=consultation&email=investor%40example.com&leadId=c5d894d3-6fa9-4766-8f90-f041ac97a68d&name=Investor+Lead&source=investor-final-cta-success-consultation',
    )
  })

  it('collects additional liens from the mortgage wizard and includes them in the persisted lead payload', async () => {
    currentSearchParams = new URLSearchParams({ intent: 'mortgage' })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.stubGlobal('requestAnimationFrame', () => 0)
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: '4c11eb6e-49f1-4fa8-9caf-619c6e506769' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(<FairlendLeadIntake />)

    fireEvent.click(screen.getByRole('button', { name: 'Close a property quickly' }))
    fireEvent.click(screen.getByRole('button', { name: /continue to property/i }))

    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'How is the property used?' })).toBeTruthy()
    })
    fireEvent.click(
      within(screen.getByRole('group', { name: 'How is the property used?' })).getByRole('button', {
        name: 'Primary residence',
      }),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Estimated property value' })).getByRole('button', {
        name: 'Under $750K',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: /continue to mortgage amount/i }))

    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'Additional liens' })).toBeTruthy()
    })
    fireEvent.click(
      within(screen.getByRole('group', { name: 'How much financing do you need?' })).getByRole(
        'button',
        { name: '$250K-$500K' },
      ),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Current mortgage balance' })).getByRole('button', {
        name: 'Under $250K',
      }),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Additional liens' })).getByRole('button', {
        name: 'No additional liens',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: /continue to timing/i }))

    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'When do you need an answer?' })).toBeTruthy()
    })
    fireEvent.click(
      within(screen.getByRole('group', { name: 'When do you need an answer?' })).getByRole(
        'button',
        { name: 'Closing in 2 weeks' },
      ),
    )
    fireEvent.click(
      within(
        screen.getByRole('group', { name: 'How do you expect to repay the mortgage?' }),
      ).getByRole('button', { name: 'Refinance with a bank' }),
    )
    fireEvent.click(screen.getByRole('button', { name: /continue to contact/i }))

    await waitFor(() => {
      expect(document.getElementById('mortgage-name')).toBeTruthy()
    })
    fireEvent.change(document.getElementById('mortgage-name')!, {
      target: { value: 'Mortgage Lead' },
    })
    fireEvent.change(document.getElementById('mortgage-email')!, {
      target: { value: 'mortgage@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: /review my mortgage options/i }))

    await waitFor(() => {
      expect(screen.getByText('Your mortgage file is with FairLend.')).toBeTruthy()
    })

    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      intake: {
        additionalLiens: 'No additional liens',
        amount: '$250K-$500K',
        currentMortgage: 'Under $250K',
      },
      intent: 'mortgage',
      status: 'submitted',
    })
  })
})
