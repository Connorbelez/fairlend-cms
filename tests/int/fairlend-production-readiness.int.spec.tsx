import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fairlendNavLinks } from '@/components/directional-hover-header/header/nav-data'
import { Footer } from '@/Footer/Component'
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
  Banner: ({ children, className, type }: { children: React.ReactNode; className?: string; type?: string }) => (
    <div className={className} data-banner-type={type}>
      {children}
    </div>
  ),
}))
vi.mock('@/utilities/getGlobals', () => ({
  getCachedGlobal: () => async () => ({
    navItems: [
      { link: { label: 'Posts', type: 'custom', url: '/posts' } },
      { link: { label: 'Contact', type: 'custom', url: '/contact' } },
      { link: { label: 'Search', type: 'custom', url: '/search' } },
    ],
  }),
}))
vi.mock('@/Footer/WatermelonFooter.client', () => ({
  WatermelonFooter: ({ navItems }: { navItems: Array<{ link: { label: string; url: string } }> }) => (
    <footer>
      {navItems.map(({ link }) => (
        <a href={link.url} key={link.label}>
          {link.label}
        </a>
      ))}
    </footer>
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

  it('routes public header action targets to intake or source-backed pages', () => {
    expect(fairlendNavLinks.contact.href).toBe('/intake?intent=contact&source=header-nav-contact')
    expect(fairlendNavLinks.backoffice.href).toBe(
      '/intake?intent=contact&source=header-nav-platform-access',
    )
    expect(fairlendNavLinks.investors.href).toBe('/investing/private-mortgage-lending')
    expect(fairlendNavLinks.resources.href).toBe('/posts')
    expect(fairlendNavLinks.startMultiplex.href).toBe(
      '/intake?intent=build&source=header-nav-multiplex-intake',
    )
  })

  it('normalizes CMS footer action CTAs to intake while keeping informational links direct', async () => {
    const markup = renderToStaticMarkup(await Footer())

    expect(markup).toContain(
      '/intake?intent=consultation&amp;source=footer-default-book-consultation',
    )
    expect(markup).toContain('/intake?intent=contact&amp;source=footer-default-contact')
    expect(markup).toContain('href="/search"')
    expect(markup).not.toContain('outlook.office.com/book')
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
