import type { NextConfig } from 'next'

const contentSecurityPolicyReportOnly = [
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
  "frame-src 'self' https://outlook.office.com https://*.office.com https://*.microsoft.com https://*.microsoftonline.com",
  "worker-src 'self' blob:",
  "media-src 'self' blob: https:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
  'report-uri /api/csp-report',
].join('; ')

export const fairlendSecurityHeaders = [
  {
    key: 'Content-Security-Policy-Report-Only',
    value: contentSecurityPolicyReportOnly,
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
    // Deliberately exclude includeSubDomains/preload until every FairLend subdomain is inventoried.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000',
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
