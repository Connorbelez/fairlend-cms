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

  it('collects additional debt from the mortgage wizard and includes it in the persisted lead payload', async () => {
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
      expect(screen.getByRole('group', { name: 'Additional debt' })).toBeTruthy()
    })
    const additionalDebtGroup = within(screen.getByRole('group', { name: 'Additional debt' }))
    expect(
      additionalDebtGroup.getAllByRole('button').map((button) => button.textContent),
    ).toEqual([
      'No additional debt',
      'Under $50K',
      '$50K-$100K',
      '$100K-$250K',
      '$250K-$500K',
      '$500K-$750K',
      '$750K+ / not sure',
    ])
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
      additionalDebtGroup.getByRole('button', {
        name: '$50K-$100K',
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
    expect(
      screen.queryByRole('group', { name: 'How do you expect to repay the mortgage?' }),
    ).toBeNull()
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
        additionalLiens: '$50K-$100K',
        amount: '$250K-$500K',
        currentMortgage: 'Under $250K',
        mortgageProduct: 'private',
      },
      intent: 'mortgage',
      status: 'submitted',
    })
  })

  it('defers contact capture while preserving partial submission for prefilled leads', async () => {
    currentSearchParams = new URLSearchParams({
      email: 'heloc@example.com',
      intent: 'mortgage',
      name: 'HELOC Lead',
      source: 'route-selector-heloc',
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.stubGlobal('requestAnimationFrame', () => 0)
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: '258fd5df-aa05-4b6d-973b-d74be23e8fbc' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(<FairlendLeadIntake />)

    fireEvent.click(screen.getByRole('button', { name: 'Home Equity Line of Credit (HELOC)' }))
    expect(document.getElementById('mortgage-early-name')).toBeNull()
    expect(document.getElementById('mortgage-early-email')).toBeNull()
    expect(document.getElementById('mortgage-early-phone')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /continue to property/i }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Skip and submit' })).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Skip and submit' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      email: 'heloc@example.com',
      intake: {
        completionStatus: 'partial',
        detail: '[Partial intake]',
        mortgageProduct: 'private',
        situation: 'Home Equity Line of Credit (HELOC)',
      },
      name: 'HELOC Lead',
      source: 'route-selector-heloc',
      status: 'submitted',
    })
  })

  it('routes purchase and first-time buyer goals into the institutional mortgage flow', async () => {
    currentSearchParams = new URLSearchParams({
      intent: 'mortgage',
      source: 'landing-overview-residential-mortgages',
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.stubGlobal('requestAnimationFrame', () => 0)
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: '0bf771ee-a9a3-4aca-9c2b-ae9c9116ca1e' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(<FairlendLeadIntake mortgageProduct="residential" />)

    const purchaseGoal = screen.getByRole('button', { name: 'Purchase a house or property' })
    expect(purchaseGoal.classList.contains('fl-mortgage-chip-option')).toBe(true)
    expect(purchaseGoal.parentElement?.classList.contains('is-chip-grid')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'First-time home buyer' }))

    const applicationStatus = screen.getByRole('group', {
      name: 'Where is the application today?',
    })
    fireEvent.click(
      within(applicationStatus).getByRole('button', { name: 'Exploring before I apply' }),
    )
    fireEvent.click(screen.getByRole('button', { name: /continue to property/i }))

    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'What type of property is it?' })).toBeTruthy()
    })

    fireEvent.click(
      within(screen.getByRole('group', { name: 'What type of property is it?' })).getByRole(
        'button',
        { name: 'Owner-occupied home' },
      ),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Estimated property value' })).getByRole('button', {
        name: 'Under $750K',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: /continue to financing/i }))

    await waitFor(() => {
      expect(
        screen.getByRole('group', { name: 'How much financing are you seeking?' }),
      ).toBeTruthy()
    })
    fireEvent.click(
      within(screen.getByRole('group', { name: 'How much financing are you seeking?' })).getByRole(
        'button',
        { name: 'Under $250K' },
      ),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Current mortgage balance' })).getByRole('button', {
        name: 'No current mortgage',
      }),
    )
    fireEvent.click(
      within(
        screen.getByRole('group', { name: 'Other registered debt on the property' }),
      ).getByRole('button', { name: 'No additional debt' }),
    )
    fireEvent.click(screen.getByRole('button', { name: /continue to qualification/i }))

    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'How is your income documented?' })).toBeTruthy()
    })
    fireEvent.click(
      within(screen.getByRole('group', { name: 'How is your income documented?' })).getByRole(
        'button',
        { name: 'Salaried / T4 income' },
      ),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Approximate credit range' })).getByRole('button', {
        name: 'Excellent (720+)',
      }),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'When do you need the financing?' })).getByRole(
        'button',
        { name: 'Closing in under 30 days' },
      ),
    )
    fireEvent.click(screen.getByRole('button', { name: /continue to contact/i }))

    await waitFor(() => {
      expect(document.getElementById('institutional-name')).toBeTruthy()
    })
    fireEvent.change(document.getElementById('institutional-name')!, {
      target: { value: 'First Home Buyer' },
    })
    fireEvent.change(document.getElementById('institutional-email')!, {
      target: { value: 'buyer@example.com' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /request an institutional mortgage review/i }),
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      intake: {
        mortgageProduct: 'institutional',
        situation: 'First-time home buyer',
        source: 'landing-overview-residential-mortgages',
      },
      intent: 'mortgage',
      source: 'landing-overview-residential-mortgages',
      status: 'submitted',
    })
  })

  it('collects an acquisition financing file for an existing rental property', async () => {
    currentSearchParams = new URLSearchParams({
      intent: 'mortgage',
      source: 'landing-overview-acquisition-existing-rental-properties',
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.stubGlobal('requestAnimationFrame', () => 0)
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: '0bfbf814-7488-4a40-9284-445e40f1c2e2' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(
      <FairlendLeadIntake
        mortgageProduct="rental-property"
        rentalPropertyTransaction="acquisition"
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Acquisition / purchase' }).getAttribute('aria-pressed'),
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Conditional offer / due diligence' }))
    fireEvent.click(screen.getByRole('button', { name: 'Corporation' }))
    fireEvent.click(screen.getByRole('button', { name: /continue to property/i }))

    await waitFor(() => expect(document.getElementById('rental-property-address')).toBeTruthy())
    fireEvent.change(document.getElementById('rental-property-address')!, {
      target: { value: '125 Rental Street, Toronto' },
    })
    fireEvent.click(screen.getByRole('button', { name: '5+ unit apartment' }))
    expect(document.getElementById('rental-number-of-units')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Fully occupied' }))
    fireEvent.click(screen.getByRole('button', { name: /continue to financing/i }))

    await waitFor(() =>
      expect(screen.getByRole('group', { name: 'Amount required (CAD)' })).toBeTruthy(),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Amount required (CAD)' })).getByRole('button', {
        name: '$1M-$2.5M',
      }),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Purchase price (CAD)' })).getByRole('button', {
        name: '$1.5M-$3M',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Bank / institutional lender reviewing' }))
    fireEvent.change(document.getElementById('rental-encumbrance-details')!, {
      target: { value: 'Bank term sheet requested; no secondary financing.' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continue to income and timing/i }))

    await waitFor(() => expect(document.getElementById('rental-gross-rent')).toBeTruthy())
    fireEvent.change(document.getElementById('rental-gross-rent')!, {
      target: { value: '$18,500' },
    })
    fireEvent.click(screen.getByRole('button', { name: '31–60 days' }))
    fireEvent.click(screen.getByRole('button', { name: /continue to contact/i }))

    await waitFor(() => expect(document.getElementById('rental-contact-name')).toBeTruthy())
    fireEvent.change(document.getElementById('rental-contact-name')!, {
      target: { value: 'Rental Buyer' },
    })
    fireEvent.change(document.getElementById('rental-contact-email')!, {
      target: { value: 'buyer@example.com' },
    })
    fireEvent.change(document.getElementById('rental-contact-phone')!, {
      target: { value: '416-555-0198' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /request a rental property financing review/i }),
    )

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      address: '125 Rental Street, Toronto',
      intake: {
        additionalLienDetails: 'Bank term sheet requested; no secondary financing.',
        additionalLiens: 'Bank / institutional lender reviewing',
        amount: '$1M-$2.5M',
        grossRentalIncome: '$18,500',
        mortgageProduct: 'rental-property',
        numberOfUnits: '',
        occupancyStatus: 'Fully occupied',
        ownershipStatus: 'Conditional offer / due diligence',
        ownershipStructure: 'Corporation',
        propertyUse: '5+ unit apartment',
        propertyValue: '$1.5M-$3M',
        situation: 'Acquisition / purchase',
        timeline: '31–60 days',
      },
      phone: '416-555-0198',
      source: 'landing-overview-acquisition-existing-rental-properties',
      status: 'submitted',
    })
  })

  it('collects current debt and encumbrances for a rental-property refinance', async () => {
    currentSearchParams = new URLSearchParams({
      intent: 'mortgage',
      source: 'landing-overview-refinancing-existing-rental-properties',
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.stubGlobal('requestAnimationFrame', () => 0)
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'd96dcfb7-f3b9-4be3-a31f-cc7a5797dfaa' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    render(
      <FairlendLeadIntake
        mortgageProduct="rental-property"
        rentalPropertyTransaction="refinance"
      />,
    )

    expect(screen.getByRole('button', { name: 'Refinance' }).getAttribute('aria-pressed')).toBe(
      'true',
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'My corporation or partnership is on title' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Partnership / joint venture' }))
    fireEvent.click(screen.getByRole('button', { name: /continue to property/i }))

    await waitFor(() => expect(document.getElementById('rental-property-address')).toBeTruthy())
    fireEvent.change(document.getElementById('rental-property-address')!, {
      target: { value: '88 Refinance Avenue, Toronto' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Mixed-use with residential units' }))
    fireEvent.change(document.getElementById('rental-number-of-units')!, {
      target: { value: '8' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Partially occupied' }))
    fireEvent.click(screen.getByRole('button', { name: /continue to financing/i }))

    await waitFor(() =>
      expect(screen.getByRole('group', { name: 'Current mortgage balance (CAD)' })).toBeTruthy(),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Amount required (CAD)' })).getByRole('button', {
        name: '$500K-$1M',
      }),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Estimated current value (CAD)' })).getByRole(
        'button',
        { name: '$1.5M-$3M' },
      ),
    )
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Current mortgage balance (CAD)' })).getByRole(
        'button',
        { name: '$500K-$1M' },
      ),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Other debt (unsecured or non-property debt)' }))
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Approximate other debt amount' })).getByRole(
        'button',
        { name: '$250K-$500K' },
      ),
    )
    fireEvent.change(document.getElementById('rental-encumbrance-details')!, {
      target: { value: 'Shareholder loan used for property improvements.' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continue to income and timing/i }))

    await waitFor(() => expect(document.getElementById('rental-gross-rent')).toBeTruthy())
    fireEvent.change(document.getElementById('rental-gross-rent')!, {
      target: { value: '$12,000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Within 30 days' }))
    fireEvent.click(screen.getByRole('button', { name: /continue to contact/i }))

    await waitFor(() => expect(document.getElementById('rental-contact-name')).toBeTruthy())
    fireEvent.change(document.getElementById('rental-contact-name')!, {
      target: { value: 'Rental Owner' },
    })
    fireEvent.change(document.getElementById('rental-contact-email')!, {
      target: { value: 'owner@example.com' },
    })
    fireEvent.change(document.getElementById('rental-contact-phone')!, {
      target: { value: '647-555-0112' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /request a rental property financing review/i }),
    )

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      intake: {
        additionalDebtAmount: '$250K-$500K',
        additionalLienDetails: 'Shareholder loan used for property improvements.',
        additionalLiens: 'Other debt (unsecured or non-property debt)',
        amount: '$500K-$1M',
        currentMortgage: '$500K-$1M',
        grossRentalIncome: '$12,000',
        mortgageProduct: 'rental-property',
        numberOfUnits: '8',
        ownershipStatus: 'My corporation or partnership is on title',
        ownershipStructure: 'Partnership / joint venture',
        propertyValue: '$1.5M-$3M',
        situation: 'Refinance',
      },
      source: 'landing-overview-refinancing-existing-rental-properties',
      status: 'submitted',
    })
  })
})
