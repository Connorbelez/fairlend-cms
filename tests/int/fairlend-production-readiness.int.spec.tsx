import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fairlendNavLinks, NAV_LINKS } from '@/components/directional-hover-header/header/nav-data'
import { financeItems } from '@/components/FairlendLandingOverviewSection'
import BeforeDashboard from '@/components/BeforeDashboard'

const dashboardMocks = vi.hoisted(() => ({
  find: vi.fn(),
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))
vi.mock('payload', () => ({
  getPayload: dashboardMocks.getPayload,
}))
vi.mock('@payloadcms/ui/elements/Banner', () => ({
  Banner: ({
    children,
    className,
    type,
  }: {
    children: React.ReactNode
    className?: string
    type?: string
  }) => (
    <div className={className} data-banner-type={type}>
      {children}
    </div>
  ),
}))
const repoRoot = process.cwd()

async function source(path: string): Promise<string> {
  return readFile(join(repoRoot, path), 'utf8')
}

describe('FairLend production readiness guards', () => {
  beforeEach(() => {
    dashboardMocks.find.mockReset()
    dashboardMocks.getPayload.mockReset()
  })

  it('keeps sitemap and layout fallbacks production-safe', async () => {
    const files = await Promise.all([
      source('src/app/(frontend)/layout.tsx'),
      source('src/app/(frontend)/(sitemaps)/pages-sitemap.xml/route.ts'),
      source('src/app/(frontend)/(sitemaps)/posts-sitemap.xml/route.ts'),
      source('next-sitemap.config.cjs'),
    ])

    expect(files.join('\n')).not.toContain('http://localhost:8400/live.js')
    expect(files.join('\n')).not.toContain('https://example.com')
    expect(files.join('\n')).toContain('NEXT_PUBLIC_SERVER_URL or VERCEL_PROJECT_PRODUCTION_URL')
    expect(files.join('\n')).toContain('Sitemap generation requires a production canonical origin')
  })

  it('keeps public header destinations aligned with the polished sitemap', () => {
    expect(fairlendNavLinks).toEqual({
      about: { href: '/#overview' },
      backoffice: { href: '/#questions' },
      home: { href: '/' },
      intake: { href: '/intake' },
      investing: { href: '/investing/private-mortgage-lending' },
      leadership: { href: '/#leadership' },
      partners: { href: '/partners' },
      privateMortgages: {
        href: '/intake?intent=mortgage&source=header-nav-private-mortgage',
      },
      rentalPropertyAcquisition: {
        href: '/intake?intent=mortgage&source=header-nav-acquisition-existing-rental-properties',
      },
      rentalPropertyRefinance: {
        href: '/intake?intent=mortgage&source=header-nav-refinancing-existing-rental-properties',
      },
      startFile: { href: '/intake' },
    })
  })

  it('links rental-property cards and header items to their branch-specific intake sources', () => {
    const rentalCards = financeItems.filter(({ title }) =>
      title.endsWith('Existing Rental Properties'),
    )
    const financingMenu = NAV_LINKS.find(({ label }) => label === 'Financing')?.menu
    const rentalHeaderColumn = financingMenu?.columns.find(
      ({ heading }) => heading === 'Refinancing & acquisitions',
    )

    expect(rentalCards.map(({ href }) => href)).toEqual([
      '/intake?intent=mortgage&source=landing-overview-acquisition-existing-rental-properties',
      '/intake?intent=mortgage&source=landing-overview-refinancing-existing-rental-properties',
    ])
    expect(rentalHeaderColumn?.items.map(({ link }) => link.href)).toEqual([
      '/intake?intent=mortgage&source=header-nav-acquisition-existing-rental-properties',
      '/intake?intent=mortgage&source=header-nav-refinancing-existing-rental-properties',
    ])
  })

  it('routes private mortgage navigation and cards to the unified intake', async () => {
    const files = await Promise.all([
      source('src/components/FairlendRouteSelector/route-data.tsx'),
      source('src/components/FairlendBuildPropertyTypes/index.tsx'),
      source('src/components/directional-hover-header/header/nav-data.ts'),
    ])
    const combined = files.join('\n')

    expect(combined).not.toContain("href: '/borrowers/private-mortgage-financing'")
    expect(combined).toContain("buildFairlendMortgageHref('route-selector-private-mortgage')")
    expect(combined).toContain("buildFairlendMortgageHref('property-types-residential-mortgage')")
    expect(combined).toContain("buildFairlendMortgageHref('header-nav-private-mortgage')")
  })

  it('routes bridge-loan cards to the unified mortgage intake', async () => {
    const files = await Promise.all([
      source('src/components/FairlendLandingOverviewSection/index.tsx'),
      source('src/components/FairlendAboutStorySection/index.tsx'),
    ])
    const combined = files.join('\n')

    expect(combined).toContain("intent: 'mortgage',\n      source: 'landing-overview-bridge-loans'")
    expect(combined).toContain("intent: 'mortgage',\n      source: 'about-story-bridge-loans'")
    expect(combined).not.toContain(
      "intent: 'build',\n      source: 'landing-overview-bridge-loans'",
    )
    expect(combined).not.toContain("intent: 'build',\n      source: 'about-story-bridge-loans'")
  })

  it('keeps footer actions routed through tracked intake links', async () => {
    const footerSource = await source('src/Footer/WatermelonFooter.client.tsx')

    expect(footerSource).toContain("buildFairlendConsultationHref('reference-footer-apply-now')")
    expect(footerSource).toContain('href: consultationHref')
    expect(footerSource).toContain('href="/search?q=terms"')
    expect(footerSource).not.toContain('outlook.office.com/book')
  })

  it('renders the Payload operations dashboard with populated and empty states', async () => {
    dashboardMocks.find
      .mockResolvedValueOnce({
        docs: [
          {
            email: 'lead@example.com',
            id: 1,
            intent: 'consultation',
            name: 'Lead Owner',
            priority: 'high',
            source: 'footer-book-consultation',
            status: 'submitted',
            updatedAt: '2026-07-07T12:00:00.000Z',
            workflowStatus: 'new',
          },
        ],
        totalDocs: 1,
      })
      .mockResolvedValueOnce({ docs: [], totalDocs: 4 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 3 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 2 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 1 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 12 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 3 })

    dashboardMocks.getPayload.mockResolvedValue({ find: dashboardMocks.find })

    const populatedMarkup = renderToStaticMarkup(await BeforeDashboard())

    expect(populatedMarkup).toContain('FairLend Operations')
    expect(populatedMarkup).toContain('Submitted leads')
    expect(populatedMarkup).toContain('QR scans')
    expect(populatedMarkup).toContain('QR lead completions')
    expect(populatedMarkup).toContain('QR conversion rate')
    expect(populatedMarkup).toContain('QR campaign performance')
    expect(populatedMarkup).toContain('v1')
    expect(populatedMarkup).toContain('qr-v1')
    expect(populatedMarkup).toContain('12 scans')
    expect(populatedMarkup).toContain('3 completed leads')
    expect(populatedMarkup).toContain('25% conversion')
    expect(populatedMarkup).toContain('Lead Owner')
    expect(populatedMarkup).toContain('footer-book-consultation')
    expect(populatedMarkup).toContain('/admin/collections/fairlend-leads')
    expect(populatedMarkup).toContain('/admin/collections/fairlend-campaign-scans')
    expect(populatedMarkup).toContain('/admin/collections/fairlend-consultation-bookings')

    dashboardMocks.find.mockReset()
    dashboardMocks.find
      .mockResolvedValueOnce({ docs: [], totalDocs: 0 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 0 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 0 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 0 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 0 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 0 })
      .mockResolvedValueOnce({ docs: [], totalDocs: 0 })

    const emptyMarkup = renderToStaticMarkup(await BeforeDashboard())

    expect(emptyMarkup).toContain('No leads are visible yet')
  })

  it('renders a Payload dashboard error state when operations queries fail', async () => {
    dashboardMocks.getPayload.mockRejectedValue(new Error('database unavailable'))

    const markup = renderToStaticMarkup(await BeforeDashboard())

    expect(markup).toContain('Lead dashboard data could not be loaded')
    expect(markup).toContain('database unavailable')
  })
})
