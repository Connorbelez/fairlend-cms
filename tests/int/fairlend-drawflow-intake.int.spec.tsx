import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DrawflowIntake } from '@/components/DrawflowIntake/DrawflowIntake.client'
import { FairlendIntakeRouter } from '@/components/FairlendLeadIntake/FairlendIntakeRouter.client'

let currentSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => currentSearchParams,
}))

vi.mock('@/components/ui/metal-button', () => ({
  MetalButton: ({
    children,
    metalFxClassName: _metalFxClassName,
    normalizeHostStyles: _normalizeHostStyles,
    preset: _preset,
    strength: _strength,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    metalFxClassName?: string
    normalizeHostStyles?: boolean
    preset?: string
    strength?: number
  }) => <button {...props}>{children}</button>,
}))

function renderHomeownerIntake(params: Record<string, string> = {}) {
  currentSearchParams = new URLSearchParams({
    intent: 'build',
    projectScope: 'garden-laneway-suites',
    source: 'route-selector-garden-laneway-suites',
    ...params,
  })
  vi.stubGlobal('scrollTo', vi.fn())
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })

  return render(<DrawflowIntake variant="garden-suite-homeowner" />)
}

function completeHomeownerPropertyStep({ noProperty = false } = {}) {
  if (noProperty) {
    fireEvent.click(screen.getByRole('button', { name: "I don't have a property yet" }))
  } else {
    fireEvent.change(screen.getByLabelText('Property address'), {
      target: { value: '18 Garden Lane, Toronto, ON' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'I/we own the property' }))
    fireEvent.click(screen.getByRole('button', { name: 'I/we live there' }))
  }
  fireEvent.click(screen.getByRole('button', { name: 'Backyard garden suite' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
}

function completeHomeownerReadinessStep() {
  fireEvent.click(screen.getByRole('button', { name: 'Just exploring' }))
  fireEvent.click(screen.getByRole('button', { name: 'Check if my property is suitable' }))
  fireEvent.click(screen.getByRole('button', { name: 'Construction financing' }))
  fireEvent.click(screen.getByRole('button', { name: '$50K-$100K' }))
  fireEvent.click(screen.getByRole('button', { name: 'Within 3 months' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
}

function completeHomeownerContactStep() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Morgan Homeowner' } })
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'morgan@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Phone (optional)'), {
    target: { value: '416-555-0188' },
  })
  fireEvent.change(screen.getByLabelText('Anything else we should know? (optional)'), {
    target: { value: 'We want help understanding the permit path.' },
  })
  fireEvent.click(screen.getByRole('checkbox'))
}

function installLocalStorageMock() {
  const values = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size
    },
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, String(value)),
  } satisfies Storage)
}

describe('DrawflowIntake project scope', () => {
  afterEach(() => {
    cleanup()
    currentSearchParams = new URLSearchParams()
    window.localStorage?.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('opens the first form step with a valid project scope preselected', async () => {
    currentSearchParams = new URLSearchParams({
      intent: 'build',
      projectScope: 'multiplex-financing',
      source: 'landing-overview-multiplex-financing',
    })
    vi.stubGlobal('scrollTo', vi.fn())

    render(<DrawflowIntake />)

    expect(screen.getByRole('heading', { name: 'Where is the build?' })).toBeTruthy()
    expect(
      screen.getByRole('radio', { name: 'Multi-plex financing' }).getAttribute('aria-checked'),
    ).toBe('true')
  })

  it('offers Single-Family Residence and keeps Continue available for every property status', () => {
    currentSearchParams = new URLSearchParams({ intent: 'build' })
    vi.stubGlobal('scrollTo', vi.fn())

    render(<DrawflowIntake />)

    fireEvent.click(screen.getByRole('button', { name: 'Start project review' }))

    const singleFamily = screen.getByRole('radio', { name: 'Single-Family Residence' })
    fireEvent.click(singleFamily)
    expect(singleFamily.getAttribute('aria-checked')).toBe('true')

    const statuses = [
      'I/we own the property',
      'Related entity owns it',
      'Firm purchase agreement signed',
      'Conditional purchase agreement signed',
      'Offer / LOI submitted',
      'Under negotiation',
      'Property identified, no control yet',
      'No specific property yet',
    ]
    const continueButton = screen.getByRole('button', { name: 'Continue' })

    for (const status of statuses) {
      const statusButton = screen.getByRole('button', { name: status })
      fireEvent.click(statusButton)
      expect(statusButton.getAttribute('aria-pressed')).toBe('true')
      expect(continueButton.hasAttribute('disabled')).toBe(false)
    }
  })

  it('opens Garden and Laneway traffic directly in the simplified homeowner flow', () => {
    renderHomeownerIntake()

    expect(screen.getByRole('heading', { name: "Let's start with the property." })).toBeTruthy()
    expect(screen.getByText('Step 1 of 3')).toBeTruthy()
    expect(screen.queryByText('What are you looking to finance?')).toBeNull()
    expect(screen.queryByText('Units after completion')).toBeNull()
    expect(screen.queryByText('Already have a build permit?')).toBeNull()
  })

  it('routes Garden scope through the homeowner variant and other build scopes to the builder', () => {
    currentSearchParams = new URLSearchParams({
      intent: 'build',
      projectScope: 'garden-laneway-suites',
      source: 'header-nav-garden-laneway-suites',
    })
    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })

    render(<FairlendIntakeRouter />)
    expect(screen.getByRole('heading', { name: "Let's start with the property." })).toBeTruthy()

    cleanup()
    currentSearchParams = new URLSearchParams({
      intent: 'build',
      projectScope: 'multiplex-financing',
      source: 'landing-overview-multiplex-financing',
    })
    render(<FairlendIntakeRouter />)
    expect(screen.getByRole('heading', { name: 'Where is the build?' })).toBeTruthy()
  })

  it('validates property basics but lets a homeowner without a property continue', async () => {
    renderHomeownerIntake()

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('alert').textContent).toContain('connection to the property')

    completeHomeownerPropertyStep({ noProperty: true })

    expect(screen.getByRole('heading', { name: 'Where are you starting from?' })).toBeTruthy()
    expect(screen.getByText('Step 2 of 3')).toBeTruthy()
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole('heading', { name: 'Where are you starting from?' }),
      )
    })

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('heading', { name: "Let's start with the property." })).toBeTruthy()
  })

  it('submits the three-step homeowner payload without builder-only defaults', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'a1d67667-512d-4122-8c8e-8adb0e9259c7' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )
    renderHomeownerIntake()

    completeHomeownerPropertyStep()
    completeHomeownerReadinessStep()
    completeHomeownerContactStep()
    fireEvent.click(screen.getByRole('button', { name: 'Send property check' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Your property check is in.' })).toBeTruthy()
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))
    expect(payload).toMatchObject({
      address: '18 Garden Lane, Toronto, ON',
      email: 'morgan@example.com',
      intake: {
        approximateEquity: '$50K-$100K',
        completionStatus: 'complete',
        financingNeeds: ['Check if my property is suitable', 'Construction financing'],
        intakeVariant: 'garden-suite-homeowner',
        notes: 'We want help understanding the permit path.',
        occupancy: 'I/we live there',
        projectScope: 'Garden & laneway suites',
        projectStage: 'Just exploring',
        siteControl: 'I/we own the property',
        suiteType: 'Backyard garden suite',
        termsAccepted: true,
        timeline: 'Within 3 months',
      },
      intent: 'build',
      name: 'Morgan Homeowner',
      phone: '416-555-0188',
      source: 'route-selector-garden-laneway-suites',
      status: 'submitted',
    })
    expect(payload.intake).not.toHaveProperty('unitCount')
    expect(payload.intake).not.toHaveProperty('buildType')
    expect(payload.intake).not.toHaveProperty('projectTeam')
  })

  it('keeps answers in place when submission fails and allows a retry', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'b95fd1e4-3187-402e-a284-226be8560c4b' }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
    renderHomeownerIntake()
    completeHomeownerPropertyStep()
    completeHomeownerReadinessStep()
    completeHomeownerContactStep()

    fireEvent.click(screen.getByRole('button', { name: 'Send property check' }))
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('could not save')
    })
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('morgan@example.com')

    fireEvent.click(screen.getByRole('button', { name: 'Send property check' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Your property check is in.' })).toBeTruthy()
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('isolates homeowner drafts and autosaves a prefilled lead id', async () => {
    installLocalStorageMock()
    window.localStorage.setItem(
      'build-financing-intake',
      JSON.stringify({ address: 'Builder draft address', projectScope: 'Multi-plex financing' }),
    )
    window.localStorage.setItem(
      'fairlend-garden-suite-intake-v1',
      JSON.stringify({
        address: 'Saved homeowner address',
        siteControl: 'I/we own the property',
        occupancy: 'I/we live there',
        suiteType: 'Laneway suite',
      }),
    )
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'c6e28119-246b-4bb1-9d42-0cb3d6dc05ea' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      }),
    )

    renderHomeownerIntake({
      address: 'URL homeowner address',
      leadId: 'c6e28119-246b-4bb1-9d42-0cb3d6dc05ea',
    })

    await waitFor(() => {
      expect((screen.getByLabelText('Property address') as HTMLInputElement).value).toBe(
        'URL homeowner address',
      )
    })
    expect(screen.getByRole('button', { name: 'Laneway suite' }).getAttribute('aria-pressed')).toBe(
      'true',
    )

    await waitFor(
      () => {
        expect(fetchMock.mock.calls.some(([url]) => url === '/api/leads')).toBe(true)
      },
      { timeout: 2000 },
    )
    const leadCall = fetchMock.mock.calls.find(([url]) => url === '/api/leads')
    const draftPayload = JSON.parse(String(leadCall?.[1]?.body))
    expect(draftPayload).toMatchObject({
      address: 'URL homeowner address',
      id: 'c6e28119-246b-4bb1-9d42-0cb3d6dc05ea',
      intake: {
        completionStatus: 'partial',
        intakeVariant: 'garden-suite-homeowner',
        projectScope: 'Garden & laneway suites',
      },
      status: 'draft',
    })
  })
})
