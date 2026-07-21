import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const canonicalHostRedirect = {
    destination: 'https://www.fairlend.ca/:path*',
    has: [
      {
        type: 'host' as const,
        value: 'fairlend.ca',
      },
    ],
    permanent: true,
    source: '/:path*',
  }

  const retiredResourceRedirects = [
    {
      destination: '/construction-financing',
      permanent: true,
      source: '/intake',
    },
    {
      destination: '/construction-financing/:path*',
      permanent: true,
      source: '/intake/:path*',
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
  ]

  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  return [canonicalHostRedirect, ...retiredResourceRedirects, internetExplorerRedirect]
}
