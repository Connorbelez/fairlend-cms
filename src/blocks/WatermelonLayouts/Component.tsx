import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { getFairlendMicrosoftBookingsUrl } from '@/lib/fairlend-bookings'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

type Metric = {
  label?: string | null
  value?: string | null
}

type LayoutItem = {
  badge?: string | null
  description?: string | null
  media?: number | MediaType | null
  title?: string | null
}

type WatermelonLayoutBlockProps = {
  blockType?: string
  description?: string | null
  eyebrow?: string | null
  heading?: string | null
  items?: LayoutItem[] | null
  media?: number | MediaType | null
  metrics?: Metric[] | null
  primaryActionLabel?: string | null
  primaryActionUrl?: string | null
  secondaryActionLabel?: string | null
  secondaryActionUrl?: string | null
  secondaryMedia?: number | MediaType | null
  theme?: 'light' | 'dark' | 'muted' | null
}

const fallbackWatermelonLayoutActionHref = buildFairlendIntakeHref({
  intent: 'contact',
  source: 'watermelon-layout-fallback',
})
const fallbackWatermelonLayoutBookingHref = getFairlendMicrosoftBookingsUrl()

const layoutLabels: Record<string, string> = {
  watermelonBusinessManagement: 'Business management',
  watermelonBusinessOperationsDashboard: 'Business operations',
  watermelonECommerceDashboard: 'E-commerce dashboard',
  watermelonErpDashboard: 'ERP dashboard',
  watermelonHrm: 'HRM',
  watermelonIncidentManagement: 'Incident management',
  watermelonInvoiceGeneratorDashboard: 'Invoice generator',
  watermelonInvoiceManagerDashboard: 'Invoice manager',
  watermelonIssueTracking: 'Issue tracking',
  watermelonLeadDashboard: 'Lead dashboard',
  watermelonMailDashboard: 'Mail dashboard',
  watermelonMeetingsDashboard: 'Meetings dashboard',
  watermelonPaymentOperationsDashboard: 'Payment operations',
  watermelonProjectManagementDashboard: 'Project management',
  watermelonSalesDashboard: 'Sales dashboard',
  watermelonTaskManagementDashboard: 'Task management',
  watermelonWorkflowManagementDashboard: 'Workflow management',
}

const fallbackMetrics: Metric[] = [
  { value: '17', label: 'Layouts' },
  { value: '100%', label: 'Editable' },
  { value: '0', label: 'Demo crashes' },
]

const fallbackItems: LayoutItem[] = [
  {
    badge: 'Fields',
    title: 'Typed Payload schema',
    description: 'Every Watermelon layout now exposes text, link, metrics, item, and asset fields.',
  },
  {
    badge: 'Assets',
    title: 'Upload-controlled visuals',
    description:
      'Primary, secondary, and item-level media can be selected from the Media collection.',
  },
  {
    badge: 'Preview',
    title: 'Crash-safe rendering',
    description:
      'The frontend avoids registry demo router assumptions while preserving distinct layouts.',
  },
]

const getMediaResource = (media?: number | MediaType | null): MediaType | null =>
  media && typeof media === 'object' ? media : null

const getVariantIndex = (blockType?: string): number => {
  const keys = Object.keys(layoutLabels)
  const index = keys.findIndex((key) => key === blockType)
  return index >= 0 ? index : 0
}

const getThemeClasses = (theme?: WatermelonLayoutBlockProps['theme']) => {
  if (theme === 'dark') {
    return {
      background: 'bg-neutral-950 text-white',
      panel: 'border-white/12 bg-white/8',
      muted: 'text-white/64',
      button: 'bg-white text-neutral-950 hover:bg-white/90',
    }
  }

  if (theme === 'muted') {
    return {
      background: 'bg-slate-100 text-slate-950',
      panel: 'border-slate-950/10 bg-white/78',
      muted: 'text-slate-600',
      button: 'bg-slate-950 text-white hover:bg-slate-800',
    }
  }

  return {
    background: 'bg-white text-neutral-950',
    panel: 'border-neutral-950/10 bg-neutral-50',
    muted: 'text-neutral-600',
    button: 'bg-neutral-950 text-white hover:bg-neutral-800',
  }
}

const getFrameClasses = (variantIndex: number) => {
  const frames = [
    'lg:grid-cols-[0.92fr_1.08fr]',
    'lg:grid-cols-[1.08fr_0.92fr]',
    'lg:grid-cols-[1fr_1fr]',
  ]

  return frames[variantIndex % frames.length]
}

export const WatermelonLayoutBlock: React.FC<WatermelonLayoutBlockProps> = (props) => {
  const {
    blockType,
    description,
    eyebrow,
    heading,
    media,
    metrics,
    primaryActionLabel,
    primaryActionUrl,
    secondaryActionLabel,
    secondaryActionUrl,
    secondaryMedia,
    theme,
  } = props

  const variantIndex = getVariantIndex(blockType)
  const themeClasses = getThemeClasses(theme)
  const primaryMedia = getMediaResource(media)
  const supportingMedia = getMediaResource(secondaryMedia)
  const sectionMetrics = metrics?.length ? metrics : fallbackMetrics
  const items = props.items?.length ? props.items : fallbackItems
  const label = blockType ? layoutLabels[blockType] : 'Watermelon layout'

  return (
    <section className={cn('w-full overflow-hidden py-16 sm:py-20', themeClasses.background)}>
      <div className="container">
        <div className={cn('grid gap-8 lg:grid-cols-2', getFrameClasses(variantIndex))}>
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-current/50">
                {eyebrow || label}
              </p>
              <h2 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                {heading || label}
              </h2>
              {description && (
                <p
                  className={cn(
                    'mt-5 max-w-2xl text-pretty text-base leading-7',
                    themeClasses.muted,
                  )}
                >
                  {description}
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                {primaryActionLabel && (
                  <a
                    className={cn(
                      'inline-flex h-10 items-center rounded-md px-4 text-sm font-semibold',
                      themeClasses.button,
                    )}
                    href={primaryActionUrl || fallbackWatermelonLayoutActionHref}
                  >
                    {primaryActionLabel}
                  </a>
                )}
                {secondaryActionLabel && (
                  <a
                    className="inline-flex h-10 items-center rounded-md border border-current/15 px-4 text-sm font-semibold"
                    href={secondaryActionUrl || fallbackWatermelonLayoutBookingHref}
                  >
                    {secondaryActionLabel}
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-current/10 border-y border-current/10">
              {sectionMetrics.slice(0, 3).map((metric, index) => (
                <div
                  className="px-4 py-5 first:pl-0"
                  key={`${metric.value}-${metric.label}-${index}`}
                >
                  <p className="text-2xl font-semibold">{metric.value}</p>
                  <p className={cn('mt-1 text-xs uppercase tracking-[0.14em]', themeClasses.muted)}>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn('overflow-hidden rounded-lg border p-3 shadow-sm', themeClasses.panel)}
          >
            <div className="grid gap-3">
              <div className="relative min-h-[280px] overflow-hidden rounded-md border border-current/10 bg-background/70">
                {primaryMedia ? (
                  <Media
                    fill
                    imgClassName="object-cover"
                    priority
                    resource={primaryMedia}
                    className="absolute inset-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,currentColor_0,transparent_24%),linear-gradient(135deg,currentColor_0.5px,transparent_0.5px)] bg-[length:100%_100%,18px_18px] opacity-[0.08]" />
                )}
                <div className="absolute bottom-4 left-4 right-4 rounded-md border border-current/10 bg-background/90 p-4 text-foreground backdrop-blur">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{heading || label}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {items.slice(0, 4).map((item, index) => {
                  const itemMedia = getMediaResource(item.media)

                  return (
                    <article
                      className="rounded-md border border-current/10 bg-background/90 p-4 text-foreground"
                      key={`${item.title}-${index}`}
                    >
                      {itemMedia && (
                        <Media
                          resource={itemMedia}
                          imgClassName="mb-3 aspect-[16/9] rounded-md object-cover"
                          className="mb-3 overflow-hidden rounded-md"
                        />
                      )}
                      {item.badge && (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {item.badge}
                        </p>
                      )}
                      <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>

              {supportingMedia && (
                <Media
                  resource={supportingMedia}
                  imgClassName="aspect-[16/7] rounded-md object-cover"
                  className="overflow-hidden rounded-md"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
