# Analytics Vendor Setup Status

Last updated: 2026-07-14.

## PostHog

- Project: `FairLend Production` (US Cloud, project 503855)
- Timezone: `America/Toronto`
- Client and server implementation: complete in this changeset
- Production Vercel variables: configured
- Preview and Development PostHog variables: intentionally absent
- Consent: required before initialization, capture, identification, or replay
- Taxonomy: schema version 1 canonical events in `src/lib/analytics/events.ts`
- CRM outcomes: daily Twenty reconciliation at 01:00 UTC
- Privacy: shared sanitizer, balanced replay masking, no network bodies/headers, signed lifecycle revocation
- Internal QA: persist with `?analytics_internal=1`
- PostHog actions: 7 production actions configured
- PostHog cohorts: 6 production cohorts configured
- PostHog journeys: 6 saved 90-day funnels and 3 saved path views configured
- Heatmaps: 9 production pages/routes configured
- Dashboards: `FairLend Executive`, `Acquisition & Content`, `Intake UX`, and `Data Quality`
- Survey: no-free-text abandonment survey saved disabled pending the volume threshold
- Alert: submission failures at 3 or more per hour (15-minute evaluation requires PostHog Boost)
- Replay playlists: deferred until the first consented production recordings exist; PostHog cannot save an empty collection

Post-deployment browser verification confirmed that PostHog remains absent before consent and receives sanitized pageviews, autocapture, Web Vitals, and canonical events after consent. Custom replay playlists must be created after the first consented production recordings arrive.

## Other vendors

Google/Meta/LinkedIn/Microsoft destinations remain separately consent-gated. Their account IDs are optional and are not required for PostHog production analytics. Do not add advertising pixels to authenticated, upload, transaction, or other sensitive financial surfaces without legal/compliance approval.
