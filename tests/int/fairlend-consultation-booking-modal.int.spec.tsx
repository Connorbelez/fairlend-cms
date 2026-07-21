import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import Link from 'next/link'
import { afterEach, describe, expect, it } from 'vitest'

import {
  FairlendConsultationBookingModalInterceptor,
  getConsultationBookingSource,
} from '@/components/FairlendConsultationBooking/FairlendConsultationBookingModalInterceptor.client'

describe('consultation booking modal URL interception', () => {
  const origin = 'https://fairlend.ca'

  afterEach(() => cleanup())

  it('opens first-party consultation-intent links in the modal and preserves attribution', () => {
    expect(
      getConsultationBookingSource(
        '/construction-financing?intent=consultation&source=build-model-consultation',
        origin,
      ),
    ).toBe('build-model-consultation')
  })

  it('opens legacy booking anchors in the modal', () => {
    expect(getConsultationBookingSource('#book-consultation', origin)).toBe(
      'sitewide-consultation-booking',
    )
  })

  it('allows a direct Bookings handoff to opt into the modal explicitly', () => {
    render(
      <>
        <a
          data-consultation-booking=""
          data-consultation-booking-source="consultation-success-scheduler"
          href="https://outlook.office.com/book/FairLend1@fairlend.ca/"
        >
          Continue to scheduler
        </a>
        <FairlendConsultationBookingModalInterceptor />
      </>,
    )

    const cta = screen.getByRole('link', { name: /continue to scheduler/i })
    let navigationPrevented = false
    cta.addEventListener('click', (event) => {
      navigationPrevented = event.defaultPrevented
    })
    fireEvent.click(cta)

    expect(navigationPrevented).toBe(true)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('does not intercept non-consultation or external destinations', () => {
    expect(
      getConsultationBookingSource('/construction-financing?intent=mortgage', origin),
    ).toBeNull()
    expect(
      getConsultationBookingSource('https://bookings.example.com/?intent=consultation', origin),
    ).toBeNull()
  })

  it('prevents navigation and opens the scheduler for a consultation CTA', async () => {
    render(
      <>
        <Link href="/construction-financing?intent=consultation&source=build-model-consultation">
          Book a free consultation
        </Link>
        <FairlendConsultationBookingModalInterceptor />
      </>,
    )

    const cta = screen.getByRole('link', { name: /book a free consultation/i })
    let navigationPrevented = false
    cta.addEventListener('click', (event) => {
      navigationPrevented = event.defaultPrevented
    })
    fireEvent.click(cta)

    expect(navigationPrevented).toBe(true)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeTruthy()
      expect(screen.getByTitle(/microsoft bookings consultation scheduler/i)).toBeTruthy()
    })
  })
})
