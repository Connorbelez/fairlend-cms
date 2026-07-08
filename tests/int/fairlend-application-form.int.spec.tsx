import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FairlendApplicationForm } from '@/components/FairlendLandingHero/FairlendApplicationForm.client'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('FairlendApplicationForm', () => {
  afterEach(() => {
    cleanup()
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
})
