import { Banner } from '@payloadcms/ui/elements/Banner'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { getFairlendCampaignConfigs } from '@/lib/fairlend-campaign-attribution'
import {
  getFairlendCampaignJourneyAnalytics,
  type CampaignAbandonmentBreakdown,
  type CampaignFormBreakdown,
  type CampaignPageBreakdown,
  type RecentCampaignJourney,
} from '@/lib/fairlend-campaign-journey'

import './index.scss'

const baseClass = 'before-dashboard'
const leadsCollectionUrl = '/admin/collections/fairlend-leads'
const campaignScansCollectionUrl = '/admin/collections/fairlend-campaign-scans'
const campaignEventsCollectionUrl = '/admin/collections/fairlend-campaign-events'
const bookingsCollectionUrl = '/admin/collections/fairlend-consultation-bookings'

type SnapshotLead = {
  campaign?: null | string
  id: number | string
  email?: null | string
  intent?: null | string
  name?: null | string
  priority?: null | string
  source?: null | string
  status?: null | string
  updatedAt?: null | string
  workflowStatus?: null | string
}

type CampaignPerformanceRow = {
  bouncedScanCount: number
  bounceRate: number
  campaign: string
  scanCount: number
  source: string
  successfulIntakeCount: number
  successfulIntakeRate: number
  trackedScanCount: number
}

type OperationsSnapshot = {
  activeLeadCount: number
  bookingCount: number
  campaignAbandonments: CampaignAbandonmentBreakdown[]
  campaignForms: CampaignFormBreakdown[]
  campaignPages: CampaignPageBreakdown[]
  campaignPerformance: CampaignPerformanceRow[]
  error?: string
  highPriorityCount: number
  qrBounceRate: number
  qrBouncedScanCount: number
  qrScanCount: number
  qrSuccessfulIntakeCount: number
  qrSuccessfulIntakeRate: number
  qrTrackedScanCount: number
  recentLeads: SnapshotLead[]
  recentQrJourneys: RecentCampaignJourney[]
  submittedLeadCount: number
  syncFailureCount: number
}

async function getOperationsSnapshot(): Promise<OperationsSnapshot> {
  try {
    const payload = await getPayload({ config: configPromise })
    const campaignConfigs = getFairlendCampaignConfigs()
    const [
      recentLeads,
      submittedLeads,
      activeLeads,
      highPriorityLeads,
      consultationBookings,
      journeyAnalytics,
    ] = await Promise.all([
      payload.find({
        collection: 'fairlend-leads',
        depth: 0,
        limit: 5,
        overrideAccess: true,
        sort: '-updatedAt',
      }),
      payload.find({
        collection: 'fairlend-leads',
        depth: 0,
        limit: 0,
        overrideAccess: true,
        where: { status: { equals: 'submitted' } },
      }),
      payload.find({
        collection: 'fairlend-leads',
        depth: 0,
        limit: 0,
        overrideAccess: true,
        where: { workflowStatus: { in: ['new', 'contact_attempted', 'contacted', 'qualified'] } },
      }),
      payload.find({
        collection: 'fairlend-leads',
        depth: 0,
        limit: 0,
        overrideAccess: true,
        where: { priority: { equals: 'high' } },
      }),
      payload.find({
        collection: 'fairlend-consultation-bookings',
        depth: 0,
        limit: 0,
        overrideAccess: true,
      }),
      getFairlendCampaignJourneyAnalytics(campaignConfigs.map((campaign) => campaign.campaign)),
    ])

    const campaignPerformance = campaignConfigs.map((campaign) => {
      const performance = journeyAnalytics.performance.find(
        (row) => row.campaign === campaign.campaign,
      )

      return {
        bouncedScanCount: performance?.bouncedScanCount ?? 0,
        bounceRate: performance?.bounceRate ?? 0,
        campaign: campaign.campaign,
        scanCount: performance?.scanCount ?? 0,
        source: campaign.source,
        successfulIntakeCount: performance?.successfulIntakeCount ?? 0,
        successfulIntakeRate: performance?.successfulIntakeRate ?? 0,
        trackedScanCount: performance?.trackedScanCount ?? 0,
      }
    })
    const qrScanCount = campaignPerformance.reduce((total, row) => total + row.scanCount, 0)
    const qrTrackedScanCount = campaignPerformance.reduce(
      (total, row) => total + row.trackedScanCount,
      0,
    )
    const qrBouncedScanCount = campaignPerformance.reduce(
      (total, row) => total + row.bouncedScanCount,
      0,
    )
    const qrSuccessfulIntakeCount = campaignPerformance.reduce(
      (total, row) => total + row.successfulIntakeCount,
      0,
    )

    return {
      activeLeadCount: activeLeads.totalDocs,
      bookingCount: consultationBookings.totalDocs,
      campaignAbandonments: journeyAnalytics.abandonments,
      campaignForms: journeyAnalytics.forms,
      campaignPages: journeyAnalytics.pages,
      campaignPerformance,
      highPriorityCount: highPriorityLeads.totalDocs,
      qrBounceRate: calculateConversionRate(qrBouncedScanCount, qrTrackedScanCount),
      qrBouncedScanCount,
      qrScanCount,
      qrSuccessfulIntakeCount,
      qrSuccessfulIntakeRate: calculateConversionRate(qrSuccessfulIntakeCount, qrScanCount),
      qrTrackedScanCount,
      recentLeads: recentLeads.docs as SnapshotLead[],
      recentQrJourneys: journeyAnalytics.recentJourneys,
      submittedLeadCount: submittedLeads.totalDocs,
      syncFailureCount: 0,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown dashboard query error'

    return {
      activeLeadCount: 0,
      bookingCount: 0,
      campaignAbandonments: [],
      campaignForms: [],
      campaignPages: [],
      campaignPerformance: [],
      error: message,
      highPriorityCount: 0,
      qrBounceRate: 0,
      qrBouncedScanCount: 0,
      qrScanCount: 0,
      qrSuccessfulIntakeCount: 0,
      qrSuccessfulIntakeRate: 0,
      qrTrackedScanCount: 0,
      recentLeads: [],
      recentQrJourneys: [],
      submittedLeadCount: 0,
      syncFailureCount: 0,
    }
  }
}

const formatDate = (value?: null | string): string => {
  if (!value) {
    return 'No update date'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'No update date'
  }

  return new Intl.DateTimeFormat('en-CA', {
    day: 'numeric',
    month: 'short',
    timeZone: 'America/Toronto',
  }).format(date)
}

const displayValue = (value?: null | string): string => value?.trim() || 'Not captured'
const displayLeadTitle = (lead: SnapshotLead): string =>
  lead.name?.trim() || lead.email?.trim() || 'Unnamed lead'
const formatPercent = (value: number): string => `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`
const calculateConversionRate = (completed: number, scans: number): number =>
  scans > 0 ? (completed / scans) * 100 : 0
const campaignScansUrl = (campaign: string): string =>
  `${campaignScansCollectionUrl}?where[campaign][equals]=${encodeURIComponent(campaign)}`
const campaignEventsUrl = (campaign: string): string =>
  `${campaignEventsCollectionUrl}?where[campaign][equals]=${encodeURIComponent(campaign)}`
const formatOutcome = (outcome: RecentCampaignJourney['outcome']): string =>
  ({
    bounced: 'Bounced',
    browsing: 'Browsed, no intake',
    intake_abandoned: 'Intake abandoned',
    not_tracked: 'Journey not tracked',
    successful_intake: 'Successful intake',
  })[outcome]

const BeforeDashboard = async () => {
  const snapshot = await getOperationsSnapshot()

  const cards = [
    {
      href: leadsCollectionUrl,
      label: 'Submitted leads',
      value: snapshot.submittedLeadCount,
    },
    {
      href: leadsCollectionUrl,
      label: 'Active lead work',
      value: snapshot.activeLeadCount,
    },
    {
      href: bookingsCollectionUrl,
      label: 'Consultation bookings',
      value: snapshot.bookingCount,
    },
    {
      href: campaignScansCollectionUrl,
      label: 'QR scans',
      value: snapshot.qrScanCount,
    },
    {
      href: campaignEventsCollectionUrl,
      label: 'Behavior-tracked scans',
      value: snapshot.qrTrackedScanCount,
    },
    {
      href: campaignEventsCollectionUrl,
      label: 'QR bounce rate',
      value: `${snapshot.qrBouncedScanCount} · ${formatPercent(snapshot.qrBounceRate)}`,
      warning: snapshot.qrBounceRate >= 50,
    },
    {
      href: campaignEventsCollectionUrl,
      label: 'Successful QR intakes',
      value: `${snapshot.qrSuccessfulIntakeCount} · ${formatPercent(snapshot.qrSuccessfulIntakeRate)}`,
    },
    {
      href: leadsCollectionUrl,
      label: 'High priority',
      value: snapshot.highPriorityCount,
    },
    {
      href: leadsCollectionUrl,
      label: 'Sync failures',
      value: snapshot.syncFailureCount,
      warning: snapshot.syncFailureCount > 0,
    },
  ]

  return (
    <section className={baseClass} data-testid="fairlend-operations-dashboard">
      <Banner className={`${baseClass}__banner`} type={snapshot.error ? 'error' : 'success'}>
        <h4>FairLend Operations</h4>
        <p>
          {snapshot.error
            ? `Lead dashboard data could not be loaded: ${snapshot.error}`
            : 'Lead capture, consultation, and follow-up activity from the Operations collections.'}
        </p>
      </Banner>

      <div className={`${baseClass}__cards`} aria-label="FairLend operations snapshot">
        {cards.map((card) => (
          <a
            className={`${baseClass}__card${card.warning ? ` ${baseClass}__card--warning` : ''}`}
            href={card.href}
            key={card.label}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </a>
        ))}
      </div>

      <div className={`${baseClass}__campaigns`}>
        <div className={`${baseClass}__recent-head`}>
          <h5>QR campaign performance</h5>
          <a href={campaignScansCollectionUrl}>Open scans</a>
        </div>

        {snapshot.campaignPerformance.length > 0 ? (
          <ul className={`${baseClass}__campaign-list`}>
            {snapshot.campaignPerformance.map((row) => (
              <li className={`${baseClass}__campaign`} key={row.campaign}>
                <span className={`${baseClass}__campaign-main`}>
                  <strong>{row.campaign}</strong>
                  <em>{row.source}</em>
                </span>
                <span className={`${baseClass}__campaign-metrics`}>
                  <a href={campaignScansUrl(row.campaign)}>{row.scanCount} scans</a>
                  <a href={campaignEventsUrl(row.campaign)}>
                    {row.trackedScanCount} behavior tracked
                  </a>
                  <span>
                    {row.bouncedScanCount} bounced · {formatPercent(row.bounceRate)}
                  </span>
                  <strong>
                    {row.successfulIntakeCount} successful ·{' '}
                    {formatPercent(row.successfulIntakeRate)}
                  </strong>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`${baseClass}__empty`}>
            No QR campaign activity is visible yet. Scans through /r/v1 will appear here.
          </p>
        )}
      </div>

      <p className={`${baseClass}__metric-note`}>
        Bounce rate is single-page, no-intake behavior among scans that consented to analytics.
        Successful-intake rate is completed lead, scheduler, or CMS form outcomes across all scans.
      </p>

      <div className={`${baseClass}__journey-grid`}>
        <div className={`${baseClass}__journey-panel`}>
          <div className={`${baseClass}__recent-head`}>
            <h5>Pages visited</h5>
            <a href={campaignEventsCollectionUrl}>All events</a>
          </div>
          {snapshot.campaignPages.length > 0 ? (
            <ol className={`${baseClass}__breakdown-list`}>
              {snapshot.campaignPages.slice(0, 10).map((row) => (
                <li key={`${row.campaign}:${row.pagePath}`}>
                  <span>
                    <strong>{row.pagePath}</strong>
                    <em>{row.campaign}</em>
                  </span>
                  <span>
                    {row.uniqueScanCount} scans · {row.pageViewCount} views
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={`${baseClass}__empty`}>No consented QR page journeys yet.</p>
          )}
        </div>

        <div className={`${baseClass}__journey-panel`}>
          <div className={`${baseClass}__recent-head`}>
            <h5>Last page before abandonment</h5>
            <a href={campaignEventsCollectionUrl}>Inspect events</a>
          </div>
          {snapshot.campaignAbandonments.length > 0 ? (
            <ol className={`${baseClass}__breakdown-list`}>
              {snapshot.campaignAbandonments.slice(0, 10).map((row) => (
                <li key={`${row.campaign}:${row.pagePath}`}>
                  <span>
                    <strong>{row.pagePath}</strong>
                    <em>{row.campaign}</em>
                  </span>
                  <span>{row.abandonedScanCount} exits</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={`${baseClass}__empty`}>No abandoned tracked journeys yet.</p>
          )}
        </div>

        <div className={`${baseClass}__journey-panel`}>
          <div className={`${baseClass}__recent-head`}>
            <h5>Successful intake forms</h5>
            <a href={campaignEventsCollectionUrl}>Inspect outcomes</a>
          </div>
          {snapshot.campaignForms.length > 0 ? (
            <ol className={`${baseClass}__breakdown-list`}>
              {snapshot.campaignForms.slice(0, 10).map((row) => (
                <li key={`${row.campaign}:${row.eventType}:${row.formId ?? row.formName}`}>
                  <span>
                    <strong>{row.formName}</strong>
                    <em>
                      {row.intakeType ?? row.eventType} · {row.campaign}
                    </em>
                  </span>
                  <span>{row.completionCount} completed</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={`${baseClass}__empty`}>No attributed intake completions yet.</p>
          )}
        </div>
      </div>

      <div className={`${baseClass}__recent`}>
        <div className={`${baseClass}__recent-head`}>
          <h5>Recent QR scan outcomes</h5>
          <a href={campaignScansCollectionUrl}>Open scans</a>
        </div>

        {snapshot.recentQrJourneys.length > 0 ? (
          <ul className={`${baseClass}__journey-list`}>
            {snapshot.recentQrJourneys.map((journey) => (
              <li className={`${baseClass}__journey`} key={journey.scanId}>
                <span className={`${baseClass}__journey-summary`}>
                  <strong>{journey.campaign}</strong>
                  <em className={`${baseClass}__outcome ${baseClass}__outcome--${journey.outcome}`}>
                    {formatOutcome(journey.outcome)}
                  </em>
                  <span>{formatDate(journey.capturedAt)}</span>
                </span>
                <span className={`${baseClass}__journey-path`}>
                  {journey.pagePaths.length > 0
                    ? journey.pagePaths.join(' → ')
                    : 'No consented page path'}
                </span>
                {journey.formName ? (
                  <span className={`${baseClass}__journey-form`}>{journey.formName}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className={`${baseClass}__empty`}>No QR scans are visible yet.</p>
        )}
      </div>

      <div className={`${baseClass}__recent`}>
        <div className={`${baseClass}__recent-head`}>
          <h5>Recent lead submissions</h5>
          <a href={leadsCollectionUrl}>Open leads</a>
        </div>

        {snapshot.recentLeads.length > 0 ? (
          <ul className={`${baseClass}__lead-list`}>
            {snapshot.recentLeads.map((lead) => (
              <li className={`${baseClass}__lead`} key={lead.id}>
                <span className={`${baseClass}__lead-main`}>
                  <strong>{displayLeadTitle(lead)}</strong>
                  <em>{displayValue(lead.intent)}</em>
                </span>
                <span className={`${baseClass}__lead-meta`}>
                  {displayValue(lead.status)} · {displayValue(lead.workflowStatus)} ·{' '}
                  {displayValue(lead.priority)} · {formatDate(lead.updatedAt)}
                </span>
                <span className={`${baseClass}__lead-source`}>{displayValue(lead.source)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`${baseClass}__empty`}>
            No leads are visible yet. Submitted intake forms will appear here and in the FairLend
            Leads collection.
          </p>
        )}
      </div>
    </section>
  )
}

export default BeforeDashboard
