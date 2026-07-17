'use client'

import { CalendarClock, ExternalLink, RefreshCw, WifiOff } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { cn } from '@/utilities/ui'

type MicrosoftBookingsEmbedProps = {
  className?: string
  iframeClassName?: string
  loading?: 'eager' | 'lazy'
  title: string
  url: string
}

type EmbedState = 'loading' | 'delayed' | 'loaded'

const delayedThresholdMs = 8_000

function subscribeToOnlineStatus(onStoreChange: () => void) {
  window.addEventListener('offline', onStoreChange)
  window.addEventListener('online', onStoreChange)

  return () => {
    window.removeEventListener('offline', onStoreChange)
    window.removeEventListener('online', onStoreChange)
  }
}

function getOnlineSnapshot() {
  return navigator.onLine
}

export function MicrosoftBookingsEmbed({
  className,
  iframeClassName,
  loading = 'eager',
  title,
  url,
}: MicrosoftBookingsEmbedProps) {
  const [embedState, setEmbedState] = useState<EmbedState>('loading')
  const [retryKey, setRetryKey] = useState(0)
  const isOnline = useSyncExternalStore(subscribeToOnlineStatus, getOnlineSnapshot, () => true)

  useEffect(() => {
    if (embedState !== 'loading') return

    const timeout = window.setTimeout(() => setEmbedState('delayed'), delayedThresholdMs)
    return () => window.clearTimeout(timeout)
  }, [embedState, retryKey])

  const retry = () => {
    setEmbedState('loading')
    setRetryKey((current) => current + 1)
  }

  const effectiveState: EmbedState | 'offline' = isOnline ? embedState : 'offline'
  const isWaiting = effectiveState !== 'loaded'

  return (
    <div className={cn('relative isolate overflow-hidden bg-white', className)}>
      {isWaiting ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-white px-6 text-center text-[#494944]">
          <div className="grid max-w-md justify-items-center gap-4">
            {effectiveState === 'offline' ? (
              <WifiOff aria-hidden="true" className="size-6 text-[#203500]" />
            ) : (
              <CalendarClock aria-hidden="true" className="size-6 text-[#203500]" />
            )}
            <div aria-live="polite" role="status">
              <p className="font-semibold text-[#08090a]">
                {effectiveState === 'loading'
                  ? 'Loading live availability…'
                  : effectiveState === 'offline'
                    ? 'You appear to be offline.'
                    : 'Microsoft Bookings is taking longer than usual.'}
              </p>
              <p className="mt-2 text-sm leading-6">
                {effectiveState === 'offline'
                  ? 'Reconnect, then try the scheduler again.'
                  : effectiveState === 'delayed'
                    ? 'You can retry here or open the secure scheduler in a new tab.'
                    : 'This usually takes only a few seconds.'}
              </p>
            </div>
            {effectiveState !== 'loading' ? (
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#08090a] bg-white px-4 text-sm font-bold text-[#08090a] outline-offset-4 hover:bg-[#f8f7f5] focus-visible:outline focus-visible:outline-2"
                  onClick={retry}
                  data-analytics-cta-id="microsoft-bookings-retry"
                  data-analytics-cta-location="scheduler-recovery"
                  data-analytics-source="microsoft-bookings-embed"
                  type="button"
                >
                  <RefreshCw aria-hidden="true" className="size-4" />
                  Try again
                </button>
                <a
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#96ec18] px-4 text-sm font-bold text-[#08090a] outline-offset-4 hover:bg-[#a4fb20] focus-visible:outline focus-visible:outline-2"
                  href={url}
                  rel="noreferrer"
                  target="_blank"
                  data-analytics-cta-id="microsoft-bookings-external"
                  data-analytics-cta-location="scheduler-recovery"
                  data-analytics-source="microsoft-bookings-embed"
                >
                  Open Microsoft Bookings
                  <ExternalLink aria-hidden="true" className="size-4" />
                  <span className="sr-only"> in a new tab</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <iframe
        className={cn('block size-full border-0 bg-white', iframeClassName)}
        key={retryKey}
        loading={loading}
        onError={() => setEmbedState('delayed')}
        onLoad={() => setEmbedState(navigator.onLine ? 'loaded' : 'loading')}
        referrerPolicy="strict-origin-when-cross-origin"
        src={url}
        title={title}
      />
    </div>
  )
}
