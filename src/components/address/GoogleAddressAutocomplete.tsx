'use client'

import type React from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

type AddressChangeMeta = { source: 'selection' | 'typing' }
type AddressSuggestion = {
  id: string
  mainText: string
  placeId: string
  secondaryText?: string
  text: string
}

type AddressDetails = {
  addressComponents?: unknown
  formattedAddress?: string
  id?: string
  location?: unknown
  placeId: string
  postalAddress?: unknown
}

interface GoogleAddressAutocompleteProps {
  ariaDescribedBy?: string
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete']
  className?: string
  disabled?: boolean
  id?: string
  inputClassName?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  label?: React.ReactNode
  labelClassName?: string
  name?: string
  onChange: (value: string, meta?: AddressChangeMeta) => void
  onOpenChange?: (open: boolean) => void
  onPlaceSelect?: (_suggestion: AddressSuggestion, details: AddressDetails | null) => void
  onResolvingChange?: (resolving: boolean) => void
  placeholder?: string
  required?: boolean
  showSearchIcon?: boolean
  size?: 'sm' | 'default' | 'lg' | number
  testId?: string
  type?: React.HTMLInputTypeAttribute
  value: string
}

export function GoogleAddressAutocomplete({
  ariaDescribedBy,
  autoComplete = 'off',
  className,
  disabled = false,
  id,
  inputClassName,
  inputMode,
  label,
  labelClassName,
  name,
  onChange,
  onOpenChange,
  onPlaceSelect,
  onResolvingChange,
  placeholder = 'Search project address',
  required = false,
  testId,
  type = 'text',
  value,
}: GoogleAddressAutocompleteProps) {
  const generatedId = useId()
  const inputId = id ?? `address-autocomplete-${generatedId}`
  const listboxId = `${inputId}-listbox`
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const sessionTokenRef = useRef<string>(createAutocompleteSessionToken())
  const trimmedValue = value.trim()
  const isOpen = isFocused && (suggestions.length > 0 || isLoading || Boolean(error))

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (trimmedValue.length < 3 || disabled) {
      const timeout = window.setTimeout(() => {
        setSuggestions([])
        setError(null)
        setIsLoading(false)
      }, 0)

      return () => window.clearTimeout(timeout)
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/address-autocomplete', {
          body: JSON.stringify({
            input: trimmedValue,
            sessionToken: sessionTokenRef.current,
          }),
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Address lookup failed')
        }

        const payload = (await response.json()) as { suggestions?: AddressSuggestion[] }
        setSuggestions(payload.suggestions ?? [])
        setActiveIndex(-1)
      } catch (lookupError) {
        if (!controller.signal.aborted) {
          setSuggestions([])
          setError(lookupError instanceof Error ? lookupError.message : 'Address lookup failed')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 220)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [disabled, trimmedValue])

  const activeDescendant = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= suggestions.length) {
      return undefined
    }

    return `${listboxId}-option-${activeIndex}`
  }, [activeIndex, listboxId, suggestions.length])

  async function selectSuggestion(suggestion: AddressSuggestion) {
    setIsResolving(true)
    setError(null)
    onResolvingChange?.(true)

    try {
      const response = await fetch('/api/address-details', {
        body: JSON.stringify({
          placeId: suggestion.placeId,
          sessionToken: sessionTokenRef.current,
        }),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })

      const responsePayload = (await response.json().catch(() => null)) as
        | (AddressDetails & { code?: string; error?: string })
        | null

      if (!response.ok) {
        if (responsePayload?.code === 'NON_CANADIAN_ADDRESS') {
          setError(responsePayload.error ?? 'Select a Canadian address.')
          return
        }
        throw new Error('Address details failed')
      }

      const details = responsePayload as AddressDetails
      const nextValue = details.formattedAddress || suggestion.text
      onChange(nextValue, { source: 'selection' })
      onPlaceSelect?.(suggestion, details)
      setSuggestions([])
      setActiveIndex(-1)
      sessionTokenRef.current = createAutocompleteSessionToken()
    } catch {
      onChange(suggestion.text, { source: 'selection' })
      onPlaceSelect?.(suggestion, null)
      setSuggestions([])
      setActiveIndex(-1)
      sessionTokenRef.current = createAutocompleteSessionToken()
    } finally {
      setIsResolving(false)
      onResolvingChange?.(false)
    }
  }

  const inputProps = {
    'aria-activedescendant': activeDescendant,
    'aria-autocomplete': 'list' as const,
    'aria-controls': listboxId,
    'aria-describedby': ariaDescribedBy,
    'aria-expanded': isOpen,
    'aria-label': typeof label === 'string' ? label : 'Project address',
    autoComplete,
    className: cn('w-full min-w-0', inputClassName),
    'data-testid': testId,
    disabled,
    id: inputId,
    inputMode,
    name,
    onBlur: () => {
      window.setTimeout(() => setIsFocused(false), 120)
    },
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value, { source: 'typing' })
    },
    onFocus: () => setIsFocused(true),
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || suggestions.length === 0) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => (current + 1) % suggestions.length)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1))
      }

      if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault()
        void selectSuggestion(suggestions[activeIndex])
      }

      if (event.key === 'Escape') {
        setSuggestions([])
        setActiveIndex(-1)
      }
    },
    placeholder,
    required,
    role: 'combobox',
    type,
    value,
  }

  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      {label ? (
        <label className={labelClassName} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="relative min-w-0" data-slot="autocomplete-input-group">
        <input {...inputProps} />

        {value ? (
          <button
            aria-label="Clear address"
            className="absolute top-1/2 right-2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            data-slot="autocomplete-clear"
            onClick={() => {
              onChange('', { source: 'typing' })
              setSuggestions([])
              setActiveIndex(-1)
            }}
            type="button"
          >
            ×
          </button>
        ) : null}

        {isOpen ? (
          <div
            className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-[0_20px_44px_rgb(15_23_42/16%)]"
            data-slot="autocomplete-menu"
          >
            {isLoading || isResolving ? (
              <div
                className="px-4 py-3 text-sm font-semibold text-slate-500"
                data-slot="autocomplete-status"
              >
                {isResolving ? 'Confirming address...' : 'Searching addresses...'}
              </div>
            ) : null}

            {!isLoading && !isResolving && error ? (
              <div
                className="px-4 py-3 text-sm font-semibold text-slate-500"
                data-slot="autocomplete-status"
              >
                Address suggestions are unavailable. You can still continue.
              </div>
            ) : null}

            {!isLoading && !isResolving && !error && suggestions.length > 0 ? (
              <ul id={listboxId} role="listbox">
                {suggestions.map((suggestion, index) => (
                  <li
                    aria-selected={activeIndex === index}
                    className={cn(
                      'cursor-pointer px-4 py-3 transition hover:bg-slate-50',
                      activeIndex === index && 'bg-slate-50',
                    )}
                    id={`${listboxId}-option-${index}`}
                    key={suggestion.id}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      void selectSuggestion(suggestion)
                    }}
                    role="option"
                  >
                    <span className="block text-sm font-extrabold text-slate-900">
                      {suggestion.mainText}
                    </span>
                    {suggestion.secondaryText ? (
                      <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                        {suggestion.secondaryText}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function createAutocompleteSessionToken(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2)
}
