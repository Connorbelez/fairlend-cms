import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

import { POST as recordCspReport } from '@/app/(frontend)/api/csp-report/route'
import { buildPagesSitemapEntries } from '@/lib/pages-sitemap'
import { staticIndexableRoutes } from '@/lib/static-sitemap-routes'

import { redirects } from '../../redirects'
import { fairlendSecurityHeaders, headers } from '../../security-headers'

const repoRoot = process.cwd()

describe('technical SEO configuration', () => {
  it('canonicalizes the apex host in one permanent redirect and retires noindex shells', async () => {
    const rules = await redirects()

    expect(rules.slice(0, 3)).toEqual([
      {
        destination: 'https://www.fairlend.ca/:path*',
        has: [{ type: 'host', value: 'fairlend.ca' }],
        permanent: true,
        source: '/:path*',
      },
      {
        destination: '/multiplex-financing-gta',
        permanent: true,
        source: '/cmhc-mli-select-multiplex-financing',
      },
      {
        destination: '/construction-draw-financing',
        permanent: true,
        source: '/resources/construction-draws-small-builders',
      },
    ])
  })

  it('publishes a truthful lastmod for every source-controlled sitemap URL', () => {
    const paths = staticIndexableRoutes.map(({ path }) => path)

    expect(staticIndexableRoutes).toHaveLength(17)
    expect(new Set(paths)).toHaveLength(paths.length)
    expect(paths).not.toContain('/cmhc-mli-select-multiplex-financing')
    expect(paths).not.toContain('/resources/construction-draws-small-builders')

    for (const route of staticIndexableRoutes) {
      expect(route.path).toMatch(/^\//)
      expect(route.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(new Date(route.lastmod).getTime()).toBeLessThanOrEqual(Date.now())
    }
  })

  it('preserves static ownership and uses CMS freshness only for CMS-owned URLs', () => {
    const entries = buildPagesSitemapEntries({
      cmsPages: [
        { slug: 'home', updatedAt: '2030-01-01T00:00:00.000Z' },
        { slug: 'borrowers', updatedAt: '2030-01-01T00:00:00.000Z' },
        { slug: 'custom-cms-page', updatedAt: '2026-07-13T12:00:00.000Z' },
      ],
      latestPostUpdatedAt: '2026-07-15T09:30:00.000Z',
      siteUrl: 'https://www.fairlend.ca/',
    })

    expect(entries).toHaveLength(18)
    expect(entries.find(({ loc }) => loc === 'https://www.fairlend.ca/')).toEqual({
      lastmod: '2026-07-14',
      loc: 'https://www.fairlend.ca/',
    })
    expect(entries.find(({ loc }) => loc.endsWith('/borrowers'))?.lastmod).toBe('2026-07-14')
    expect(entries.find(({ loc }) => loc.endsWith('/posts'))?.lastmod).toBe(
      '2026-07-15T09:30:00.000Z',
    )
    expect(entries.find(({ loc }) => loc.endsWith('/custom-cms-page'))?.lastmod).toBe(
      '2026-07-13T12:00:00.000Z',
    )
  })

  it('applies the complete response-security baseline globally', async () => {
    const configuredHeaders = await headers()
    const byName = new Map(fairlendSecurityHeaders.map(({ key, value }) => [key, value]))

    expect(configuredHeaders).toEqual([
      {
        headers: [...fairlendSecurityHeaders],
        source: '/:path*',
      },
    ])
    expect(byName.get('Content-Security-Policy-Report-Only')).toContain(
      'report-uri /api/csp-report',
    )
    expect(byName.get('Strict-Transport-Security')).toBe('max-age=63072000')
    expect(byName.get('X-Content-Type-Options')).toBe('nosniff')
    expect(byName.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(byName.get('Permissions-Policy')).toBeTruthy()
    expect(byName.get('X-Frame-Options')).toBe('SAMEORIGIN')

    const nextConfigSource = await readFile(join(repoRoot, 'next.config.ts'), 'utf8')
    expect(nextConfigSource).toContain('poweredByHeader: false')
  })

  it('accepts bounded CSP reports without logging URL query data', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const request = new Request('https://www.fairlend.ca/api/csp-report', {
      body: JSON.stringify({
        'csp-report': {
          'blocked-uri': 'https://blocked.example/script.js?token=private#fragment',
          'document-uri': 'https://www.fairlend.ca/contact?email=private@example.com',
          ignored: 'not logged',
          'violated-directive': 'script-src',
        },
      }),
      method: 'POST',
    })

    const response = await recordCspReport(request)

    expect(response.status).toBe(204)
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]?.[0]).toContain('https://blocked.example/script.js')
    expect(warn.mock.calls[0]?.[0]).not.toContain('token=private')
    expect(warn.mock.calls[0]?.[0]).not.toContain('email=private')
    expect(warn.mock.calls[0]?.[0]).not.toContain('ignored')

    warn.mockRestore()
  })
})
