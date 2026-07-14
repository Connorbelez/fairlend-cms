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

Post-deployment verification and the saved PostHog actions, cohorts, funnels, paths, heatmaps, replay playlists, dashboard suite, and alerts are recorded in the task handoff once browser configuration is complete.

## Other vendors

Google/Meta/LinkedIn/Microsoft destinations remain separately consent-gated. Their account IDs are optional and are not required for PostHog production analytics. Do not add advertising pixels to authenticated, upload, transaction, or other sensitive financial surfaces without legal/compliance approval.
