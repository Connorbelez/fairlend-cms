import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DrawflowIntake } from '@/components/DrawflowIntake/DrawflowIntake.client'

let currentSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => currentSearchParams,
}))

vi.mock('@/components/ui/metal-button', () => ({
  MetalButton: ({
    children,
    metalFxClassName: _metalFxClassName,
    preset: _preset,
    strength: _strength,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    metalFxClassName?: string
    preset?: string
    strength?: number
  }) => <button {...props}>{children}</button>,
}))

describe('DrawflowIntake project scope', () => {
  afterEach(() => {
    cleanup()
    currentSearchParams = new URLSearchParams()
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
})
