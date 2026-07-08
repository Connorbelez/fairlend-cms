import { Banner } from '@payloadcms/ui/elements/Banner'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { getFairlendCampaignConfigs } from '@/lib/fairlend-campaign-attribution'

import './index.scss'

const baseClass = 'before-dashboard'
const leadsCollectionUrl = '/admin/collections/fairlend-leads'
const campaignScansCollectionUrl = '/admin/collections/fairlend-campaign-scans'
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
  campaign: string
  completionCount: number
  conversionRate: number
  scanCount: number
  source: string
}

type OperationsSnapshot = {
  activeLeadCount: number
  bookingCount: number
  campaignPerformance: CampaignPerformanceRow[]
  error?: string
  highPriorityCount: number
  qrConversionRate: number
  qrLeadCompletionCount: number
  qrScanCount: number
  recentLeads: SnapshotLead[]
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
      ...campaignResults
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
      ...campaignConfigs.flatMap((campaign) => [
        payload.find({
          collection: 'fairlend-campaign-scans',
          depth: 0,
          limit: 0,
          overrideAccess: true,
          where: { campaign: { equals: campaign.campaign } },
        }),
        payload.find({
          collection: 'fairlend-leads',
          depth: 0,
          limit: 0,
          overrideAccess: true,
          where: {
            and: [
              { campaign: { equals: campaign.campaign } },
              { status: { equals: 'submitted' } },
            ],
          },
        }),
      ]),
    ])

    const campaignPerformance = campaignConfigs.map((campaign, index) => {
      const scanCount = campaignResults[index * 2]?.totalDocs ?? 0
      const completionCount = campaignResults[index * 2 + 1]?.totalDocs ?? 0

      return {
        campaign: campaign.campaign,
        completionCount,
        conversionRate: calculateConversionRate(completionCount, scanCount),
        scanCount,
        source: campaign.source,
      }
    })
    const qrScanCount = campaignPerformance.reduce((total, row) => total + row.scanCount, 0)
    const qrLeadCompletionCount = campaignPerformance.reduce(
      (total, row) => total + row.completionCount,
      0,
    )

    return {
      activeLeadCount: activeLeads.totalDocs,
      bookingCount: consultationBookings.totalDocs,
      campaignPerformance,
      highPriorityCount: highPriorityLeads.totalDocs,
      qrConversionRate: calculateConversionRate(qrLeadCompletionCount, qrScanCount),
      qrLeadCompletionCount,
      qrScanCount,
      recentLeads: recentLeads.docs as SnapshotLead[],
      submittedLeadCount: submittedLeads.totalDocs,
      syncFailureCount: 0,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown dashboard query error'

    return {
      activeLeadCount: 0,
      bookingCount: 0,
      campaignPerformance: [],
      error: message,
      highPriorityCount: 0,
      qrConversionRate: 0,
      qrLeadCompletionCount: 0,
      qrScanCount: 0,
      recentLeads: [],
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
const campaignCompletionsUrl = (campaign: string): string =>
  `${leadsCollectionUrl}?where[campaign][equals]=${encodeURIComponent(campaign)}&where[status][equals]=submitted`

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
      href: leadsCollectionUrl,
      label: 'QR lead completions',
      value: snapshot.qrLeadCompletionCount,
    },
    {
      href: campaignScansCollectionUrl,
      label: 'QR conversion rate',
      value: formatPercent(snapshot.qrConversionRate),
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
                  <a href={campaignCompletionsUrl(row.campaign)}>
                    {row.completionCount} completed leads
                  </a>
                  <strong>{formatPercent(row.conversionRate)} conversion</strong>
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
