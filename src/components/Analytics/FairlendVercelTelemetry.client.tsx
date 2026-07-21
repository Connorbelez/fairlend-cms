'use client'

import { track } from '@vercel/analytics'
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { usePathname } from 'next/navigation'
import { type ReactElement, useEffect } from 'react'

import {
  analyticsConfig,
  analyticsEventName,
  analyticsInternalStorageKey,
} from '@/lib/analytics/config'
import { sanitizeAnalyticsPath } from '@/lib/analytics/sanitize'

const engagementMilestones = [
  { event: 'fairlend_page_engaged_30s', milliseconds: 30_000 },
  { event: 'fairlend_page_engaged_90s', milliseconds: 90_000 },
] as const

type VercelEvent = BeforeSendEvent | { route?: string; type: 'vital'; url: string }

type FairlendAnalyticsWindowEvent = {
  event?: unknown
  form_id?: unknown
  journey_type?: unknown
}

function getInternalFlag(input: string): string | null {
  try {
    return new URL(input, window.location.origin).searchParams.get('analytics_internal')
  } catch {
    return null
  }
}

function isInternalAnalyticsVisit(input: string): boolean {
  const internalFlag = getInternalFlag(input)
  if (internalFlag === '1') return true
  if (internalFlag === '0') return false

  try {
    return window.localStorage.getItem(analyticsInternalStorageKey) === 'true'
  } catch {
    return false
  }
}

function getSanitizedEventUrl(input: string): string {
  try {
    const url = new URL(input, window.location.origin)
    return `${url.origin}${sanitizeAnalyticsPath(url.pathname)}`
  } catch {
    return sanitizeAnalyticsPath(input)
  }
}

function beforeSend<T extends VercelEvent>(event: T): T | null {
  if (isInternalAnalyticsVisit(event.url)) return null
  return { ...event, url: getSanitizedEventUrl(event.url) }
}

function getSafeEventProperty(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized && normalized.length <= 255 ? normalized : undefined
}

function forwardFairlendConversion(event: Event): void {
  if (isInternalAnalyticsVisit(window.location.href)) return
  if (!(event instanceof CustomEvent)) return
  const detail = event.detail as FairlendAnalyticsWindowEvent | null
  if (!detail || typeof detail !== 'object') return
  if (
    detail.event !== 'fairlend_intake_started' &&
    detail.event !== 'fairlend_lead_submitted'
  ) {
    return
  }

  const formId = getSafeEventProperty(detail.form_id)
  const journeyType = getSafeEventProperty(detail.journey_type)
  if (!formId || !journeyType) return

  track(detail.event, { form_id: formId, journey_type: journeyType })
}

function useFairlendVercelEvents(pathname: string): void {
  useEffect(() => {
    if (!analyticsConfig.enabled) return
    window.addEventListener(analyticsEventName, forwardFairlendConversion)
    return () => window.removeEventListener(analyticsEventName, forwardFairlendConversion)
  }, [])

  useEffect(() => {
    if (!analyticsConfig.enabled) return
    if (isInternalAnalyticsVisit(window.location.href)) return

    let activeMilliseconds = 0
    let activeSince = document.visibilityState === 'visible' ? Date.now() : null
    let milestoneIndex = 0
    let timer: number | undefined

    const getActiveMilliseconds = (): number =>
      activeMilliseconds + (activeSince === null ? 0 : Date.now() - activeSince)

    const clearMilestoneTimer = (): void => {
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
    }

    const scheduleNextMilestone = (): void => {
      clearMilestoneTimer()
      if (activeSince === null || milestoneIndex >= engagementMilestones.length) return

      const milestone = engagementMilestones[milestoneIndex]
      if (!milestone) return
      const remaining = Math.max(0, milestone.milliseconds - getActiveMilliseconds())
      timer = window.setTimeout(() => {
        activeMilliseconds = getActiveMilliseconds()
        activeSince = Date.now()

        while (
          milestoneIndex < engagementMilestones.length &&
          activeMilliseconds >= engagementMilestones[milestoneIndex]!.milliseconds
        ) {
          track(engagementMilestones[milestoneIndex]!.event)
          milestoneIndex += 1
        }

        scheduleNextMilestone()
      }, remaining)
    }

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        if (activeSince === null) activeSince = Date.now()
        scheduleNextMilestone()
        return
      }

      if (activeSince !== null) activeMilliseconds = getActiveMilliseconds()
      activeSince = null
      clearMilestoneTimer()
    }

    scheduleNextMilestone()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearMilestoneTimer()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname])
}

export function FairlendVercelTelemetry(): ReactElement | null {
  const pathname = usePathname()
  useFairlendVercelEvents(pathname)

  if (!analyticsConfig.enabled) return null

  return (
    <>
      <Analytics beforeSend={beforeSend} />
      <SpeedInsights beforeSend={beforeSend} />
    </>
  )
}
