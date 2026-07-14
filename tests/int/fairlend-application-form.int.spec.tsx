import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

vi.stubGlobal(
  'ResizeObserver',
  class ResizeObserverMock {
    disconnect() {}
    observe() {}
    unobserve() {}
  },
)

function selectApplicationTab(tab: 'invest' | 'mortgage') {
  const selectedTab = screen.getByRole('tab', {
    name: tab === 'invest' ? /^Invest/ : /^Get a mortgage/,
  })

  fireEvent.mouseDown(selectedTab, { button: 0, ctrlKey: false })
}

function getApplicationPanel(tab: 'invest' | 'mortgage') {
  const panel = document.getElementById(`fairlend-${tab}-panel`)

  expect(panel).toBeTruthy()
  return panel!
}

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

    selectApplicationTab('invest')
    const investPanel = within(getApplicationPanel('invest'))

    expect(investPanel.getByLabelText('Name').getAttribute('name')).toBe('name')
    expect(investPanel.getByLabelText('Name').getAttribute('autocomplete')).toBe(
      'section-invest name',
    )
    expect(investPanel.getByLabelText('Email').getAttribute('name')).toBe('email')
    expect(investPanel.getByLabelText('Email').getAttribute('autocomplete')).toBe(
      'section-invest email',
    )
    expect(investPanel.getByLabelText('Phone number').getAttribute('name')).toBe('tel')
    expect(investPanel.getByLabelText('Phone number').getAttribute('autocomplete')).toBe(
      'section-invest tel',
    )
    expect(investPanel.getAllByRole('radio', { name: /\$50K – \$250K/ })).toHaveLength(1)

    selectApplicationTab('mortgage')
    const mortgagePanel = within(getApplicationPanel('mortgage'))

    expect(mortgagePanel.getByLabelText('Name').getAttribute('name')).toBe('name')
    expect(mortgagePanel.getByLabelText('Name').getAttribute('autocomplete')).toBe(
      'section-mortgage name',
    )
    expect(mortgagePanel.getByLabelText('Email').getAttribute('name')).toBe('email')
    expect(mortgagePanel.getByLabelText('Email').getAttribute('autocomplete')).toBe(
      'section-mortgage email',
    )
    expect(mortgagePanel.getByLabelText('Email').hasAttribute('required')).toBe(false)
    expect(mortgagePanel.getByLabelText('Phone number').getAttribute('name')).toBe('tel')
    expect(mortgagePanel.getByLabelText('Phone number').getAttribute('autocomplete')).toBe(
      'section-mortgage tel',
    )
    expect(mortgagePanel.getByLabelText('Phone number').hasAttribute('required')).toBe(false)
    expect(mortgagePanel.getByLabelText('Address').getAttribute('name')).toBe('mortgageAddress')
    expect(mortgagePanel.getByLabelText('Address').getAttribute('autocomplete')).toBe(
      'section-mortgage street-address',
    )
    expect(mortgagePanel.queryByLabelText('Approximate equity in home')).toBeNull()
    expect(mortgagePanel.queryByLabelText('Estimated property value')).toBeNull()
    expect(mortgagePanel.getByRole('radio', { name: 'First mortgage' })).toBeTruthy()
    expect(mortgagePanel.getByRole('radio', { name: 'HELOC' })).toBeTruthy()
    expect(mortgagePanel.getByRole('radio', { name: 'Under $250K' })).toBeTruthy()
    expect(mortgagePanel.queryByLabelText('Current mortgage balance')).toBeNull()
    fireEvent.click(mortgagePanel.getByRole('radio', { name: 'Refinance' }))
    expect(mortgagePanel.getByLabelText('Current mortgage balance')).toBeTruthy()
    fireEvent.click(mortgagePanel.getByRole('radio', { name: 'First mortgage' }))
    expect(mortgagePanel.queryByLabelText('Current mortgage balance')).toBeNull()
    expect(mortgagePanel.getByRole('combobox', { name: 'Timing' })).toBeTruthy()
  })

  it('requires at least one contact method without disabling browser autofill', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    render(<FairlendApplicationForm />)

    selectApplicationTab('mortgage')
    const mortgagePanel = getApplicationPanel('mortgage')
    const form = mortgagePanel.querySelector('form')
    expect(form).toBeTruthy()
    fireEvent.submit(form!)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(
      within(mortgagePanel).getByText(
        'Enter an email address or phone number so we can follow up.',
      ),
    ).toBeTruthy()
    expect(within(mortgagePanel).getByLabelText('Email').getAttribute('aria-invalid')).toBe('true')
    expect(within(mortgagePanel).getByLabelText('Phone number').getAttribute('aria-invalid')).toBe(
      'true',
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

    selectApplicationTab('mortgage')
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Morgan Borrower' } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '416-555-0199' } })
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Queen St W' } })
    fireEvent.click(screen.getByRole('radio', { name: 'Bridge financing' }))
    fireEvent.click(screen.getByRole('radio', { name: '$250K – $500K' }))
    fireEvent.change(screen.getByLabelText('Current mortgage balance'), {
      target: { value: '425000' },
    })
    fireEvent.click(screen.getByRole('combobox', { name: 'Timing' }))
    fireEvent.click(screen.getByRole('option', { name: 'Within 30 days' }))
    fireEvent.click(screen.getByRole('button', { name: /Start mortgage request/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/leads', expect.any(Object))
    })

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(JSON.parse(String(requestInit.body))).toMatchObject({
      address: '123 Queen St W',
      email: '',
      intent: 'mortgage',
      intake: {
        amount: '$250K – $500K',
        currentMortgage: '425000',
        homepageValue: '123 Queen St W',
        mortgageGoal: 'Bridge financing',
        mortgageProduct: 'private',
        timeline: 'Within 30 days',
      },
      name: 'Morgan Borrower',
      phone: '416-555-0199',
      source: 'homepage-mortgage-application-form',
      status: 'submitted',
    })
    expect(applicationFormMocks.routerPush).not.toHaveBeenCalled()
    await expect(screen.findByText('Received. We will follow up shortly.')).resolves.toBeTruthy()
    expect(screen.getByText('Mortgage request received')).toBeTruthy()
  })

  it('submits the selected investor capital band and replaces the form with confirmation', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'lead-investor-1' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(<FairlendApplicationForm />)

    selectApplicationTab('invest')
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Inez Investor' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'inez@example.com' } })
    fireEvent.click(screen.getByRole('radio', { name: '$250K – $1M' }))
    fireEvent.click(screen.getByRole('combobox', { name: 'Investment focus' }))
    fireEvent.click(screen.getByRole('option', { name: 'Private mortgages' }))
    fireEvent.click(screen.getByRole('button', { name: /Start investor intake/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/leads', expect.any(Object))
    })

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(JSON.parse(String(requestInit.body))).toMatchObject({
      email: 'inez@example.com',
      intent: 'invest',
      intake: {
        investmentAmount: '$250K – $1M',
        investmentFocus: 'private-mortgages',
      },
      name: 'Inez Investor',
      phone: '',
      source: 'homepage-invest-application-form',
      status: 'submitted',
    })
    expect(applicationFormMocks.routerPush).not.toHaveBeenCalled()
    await expect(screen.findByText('Investor profile received')).resolves.toBeTruthy()
  })
})
