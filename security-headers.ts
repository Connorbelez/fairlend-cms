import type { NextConfig } from 'next'

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.google.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://connect.facebook.net https://snap.licdn.com https://bat.bing.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.posthog.com https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://*.doubleclick.net https://www.facebook.com https://*.linkedin.com https://bat.bing.com https://*.clarity.ms wss:",
  "frame-src 'self' https://*.googletagmanager.com https://outlook.office.com https://*.office.com https://*.microsoft.com https://*.microsoftonline.com",
  "worker-src 'self' blob:",
  "media-src 'self' blob: https:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
  'report-to fairlend-csp',
  'report-uri /api/csp-report',
].join('; ')

const cspHeaderKey =
  process.env.CSP_ENFORCE === 'true'
    ? 'Content-Security-Policy'
    : 'Content-Security-Policy-Report-Only'

const hstsIncludeSubdomains = process.env.HSTS_INCLUDE_SUBDOMAINS === 'true'
const hstsPreload = process.env.HSTS_PRELOAD === 'true'

if (hstsPreload && !hstsIncludeSubdomains) {
  throw new Error('HSTS_PRELOAD=true requires HSTS_INCLUDE_SUBDOMAINS=true')
}

const strictTransportSecurity = [
  'max-age=63072000',
  hstsIncludeSubdomains ? 'includeSubDomains' : null,
  hstsPreload ? 'preload' : null,
]
  .filter(Boolean)
  .join('; ')

export const fairlendSecurityHeaders = [
  {
    key: cspHeaderKey,
    value: contentSecurityPolicy,
  },
  {
    key: 'Reporting-Endpoints',
    value: 'fairlend-csp="/api/csp-report"',
  },
  {
    key: 'Permissions-Policy',
    value: 'browsing-topics=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // The two directives are opt-in until every FairLend subdomain has valid TLS.
    key: 'Strict-Transport-Security',
    value: strictTransportSecurity,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
] as const

export const headers: NextConfig['headers'] = async () => [
  {
    headers: [...fairlendSecurityHeaders],
    source: '/:path*',
  },
]
