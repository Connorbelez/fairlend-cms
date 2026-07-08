import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FairlendApplicationForm } from '@/components/FairlendLandingHero/FairlendApplicationForm.client'

const applicationFormMocks = vi.hoisted(() => ({
  routerPush: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: applicationFormMocks.routerPush,
  }),
}))

describe('FairlendApplicationForm', () => {
  afterEach(() => {
    cleanup()
    applicationFormMocks.routerPush.mockReset()
    vi.restoreAllMocks()
  })

  it('lifts the form and releases clipping while address suggestions are open', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          suggestions: [
            {
              id: 'suggestion-1117-main',
              mainText: '1117 Queen Street West',
              placeId: 'place-1117-main',
              secondaryText: 'Toronto, ON, Canada',
              text: '1117 Queen Street West, Toronto, ON, Canada',
            },
          ],
        }),
        {
          headers: { 'content-type': 'application/json' },
          status: 200,
        },
      ),
    )

    render(<FairlendApplicationForm />)

    const form = screen.getByTestId('fairlend-application-form')
    const input = screen.getByRole('combobox', { name: 'Project address' })

    expect(form.getAttribute('data-autocomplete-open')).toBe('false')
    expect(form.firstElementChild?.className).toContain('overflow-hidden')

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '1117' } })

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /1117 Queen Street West/i })).toBeTruthy()
    })

    await waitFor(() => {
      expect(form.getAttribute('data-autocomplete-open')).toBe('true')
    })

    expect(form.className).toContain(
      'bottom-[calc(5.45%+var(--hero-stats-height,0px)+clamp(78px,7vw,124px))]',
    )
    expect(form.className).toContain(
      'hero-landscape:bottom-[calc(clamp(18px,1.8vw,32px)+clamp(78px,7vw,124px))]',
    )
    expect(form.firstElementChild?.className).toContain('overflow-visible')
  })

  it('renders browser autofill-friendly field attributes for each application tab', () => {
    render(<FairlendApplicationForm />)

    const buildAddress = screen.getByRole('combobox', { name: 'Project address' })

    expect(buildAddress.getAttribute('name')).toBe('buildAddress')
    expect(buildAddress.getAttribute('autocomplete')).toBe('section-build street-address')

    fireEvent.click(screen.getByRole('tab', { name: /^Invest/ }))

    expect(screen.getByLabelText('Name').getAttribute('name')).toBe('name')
    expect(screen.getByLabelText('Name').getAttribute('autocomplete')).toBe('section-invest name')
    expect(screen.getByLabelText('Email').getAttribute('name')).toBe('email')
    expect(screen.getByLabelText('Email').getAttribute('autocomplete')).toBe('section-invest email')
    expect(screen.getByLabelText('Phone number').getAttribute('name')).toBe('tel')
    expect(screen.getByLabelText('Phone number').getAttribute('autocomplete')).toBe(
      'section-invest tel',
    )

    fireEvent.click(screen.getByRole('tab', { name: /^Get a mortgage/ }))

    expect(screen.getByLabelText('Name').getAttribute('name')).toBe('name')
    expect(screen.getByLabelText('Name').getAttribute('autocomplete')).toBe('section-mortgage name')
    expect(screen.getByLabelText('Email').getAttribute('name')).toBe('email')
    expect(screen.getByLabelText('Email').getAttribute('autocomplete')).toBe(
      'section-mortgage email',
    )
    expect(screen.getByLabelText('Phone number').getAttribute('name')).toBe('tel')
    expect(screen.getByLabelText('Phone number').getAttribute('autocomplete')).toBe(
      'section-mortgage tel',
    )
    expect(screen.getByLabelText('Address').getAttribute('name')).toBe('mortgageAddress')
    expect(screen.getByLabelText('Address').getAttribute('autocomplete')).toBe(
      'section-mortgage street-address',
    )
  })

  it('submits mortgage requests as direct leads without redirecting to the intake route', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'lead-mortgage-1' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(<FairlendApplicationForm />)

    fireEvent.click(screen.getByRole('tab', { name: /^Get a mortgage/ }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Morgan Borrower' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'morgan@example.com' } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '416-555-0199' } })
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Queen St W' } })
    fireEvent.change(screen.getByLabelText('Approximate equity in home'), {
      target: { value: '250000' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Start mortgage request/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/leads', expect.any(Object))
    })

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(JSON.parse(String(requestInit.body))).toMatchObject({
      address: '123 Queen St W',
      email: 'morgan@example.com',
      intent: 'mortgage',
      intake: {
        approximateEquity: '250000',
        homepageValue: '123 Queen St W',
      },
      name: 'Morgan Borrower',
      phone: '416-555-0199',
      source: 'homepage-mortgage-application-form',
      status: 'submitted',
    })
    expect(applicationFormMocks.routerPush).not.toHaveBeenCalled()
    await expect(screen.findByText('Received. We will follow up shortly.')).resolves.toBeTruthy()
  })
})
