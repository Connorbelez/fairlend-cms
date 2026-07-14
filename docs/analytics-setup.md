# FairLend Production Analytics

FairLend uses PostHog only for consented production traffic. Preview and development deployments must not receive `NEXT_PUBLIC_POSTHOG_KEY`, so they cannot initialize PostHog or send traffic into the production project.

## Data contract

The canonical schema lives in `src/lib/analytics/events.ts`. All client events use `trackFairlendEvent()`, which adds schema, deployment, and route classifications and accepts only the declared properties for that event. The shared sanitizer removes query strings, URL fragments, PII-shaped values, raw UUIDs, nested objects, financial fields, form answers, free-text fields, and database identifiers before capture. Development builds warn when a property is removed.

Canonical custom events:

- `fairlend_cta_clicked`, `fairlend_route_selected`
- `fairlend_intake_started`, `fairlend_intake_resumed`
- `fairlend_intake_step_viewed`, `fairlend_intake_step_completed`
- `fairlend_intake_validation_failed`, `fairlend_intake_back_clicked`
- `fairlend_intake_partial_submitted`
- `fairlend_lead_submitted`, `fairlend_lead_submission_failed`
- `fairlend_consultation_scheduler_opened`
- `fairlend_phone_clicked`, `fairlend_email_clicked`
- `fairlend_search_performed`, `fairlend_resource_clicked`
- `fairlend_build_model_started`, `fairlend_build_model_changed`, `fairlend_build_model_cta_clicked`
- `fairlend_lead_qualified`, `fairlend_lead_working_file`, `fairlend_lead_closed_won`, `fairlend_lead_closed_lost`
- `fairlend_consent_updated`

Abandonment is a funnel calculation: an intake start or step view with no lead submission inside the selected conversion window. No client-side abandonment event is emitted.

## Production environment

Configure these for Production only and redeploy because `NEXT_PUBLIC_*` values are compiled into the client bundle:

```bash
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PROJECT_KEY=
POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PERSON_ID_SALT=
CRON_SECRET=
```

`POSTHOG_PERSON_ID_SALT` must be stable, high entropy, server-only, and at least 32 characters. Preview and Development must not have the PostHog key or host variables.

## Consent, identity, and lifecycle

PostHog is not initialized and no replay starts until analytics consent is affirmative. Lead submission accepts an optional `{ consentGranted: true, schemaVersion: 1 }` analytics context. For a consented submitted lead, the server returns a PostHog identity derived by HMAC from the internal lead ID; the raw lead ID is never exposed. The browser identifies before emitting `fairlend_lead_submitted`, which joins the anonymous acquisition journey to later consented lifecycle outcomes.

The browser stores a signed, narrowly scoped revocation capability. Withdrawing analytics consent opts out, stops recording, resets PostHog, and revokes future server lifecycle eligibility. Historical leads are not backfilled without an affirmative analytics-consent record.

`/api/cron/posthog-lifecycle` runs daily at 01:00 UTC, authenticates with `CRON_SECRET`, and translates Twenty CRM state into qualified, working-file, won, or lost events. Events use deterministic non-reversible insert IDs so retries are idempotent. Twenty remains authoritative and lifecycle freshness is up to 24 hours.

## Replay privacy

Replay uses balanced masking: public marketing copy and controls remain visible, while inputs, textareas, contenteditable nodes, validation/answer regions, intake summaries, uploads, account surfaces, and anything marked `data-analytics-sensitive` are masked or blocked. Network bodies and sensitive headers are disabled. Replay is stopped on admin, API, preview, account/dashboard, document, and upload routes.

Calibration is 100% of consented sessions for 30 days or 500 sessions, then 25% general sampling. Intake starts, validation/submission failures, exceptions, and frustration diagnostics should retain full recording through explicit starts or PostHog triggers.

## QA and verification

Use `?analytics_internal=1` on a production URL to persist both `is_internal_user=true` and PostHog's native `$internal_or_test_user=true`; use `?analytics_internal=0` to clear both flags. Saved production insights exclude internal users by default.

For every release:

1. With fresh storage, verify no PostHog request, cookie, identity, or replay exists before consent.
2. Accept analytics and verify sanitized `$pageview`, `$pageleave`, Web Vitals, autocapture, and replay.
3. Complete each journey with synthetic non-sensitive data and verify exact-once start, step, validation/back, submission, and failure semantics.
4. Inspect raw event properties and replay for form values, query strings, financial values, document details, and raw lead IDs.
5. Withdraw consent and verify capture stops, identity resets, and the lead revocation endpoint succeeds.
6. Verify the daily cron rejects missing/invalid authorization and emits only eligible lifecycle events.

The privacy-policy PostHog wording is an implementation-accurate draft and must receive legal review before being treated as legal advice.

`scripts/seed-posthog-schema.mjs` can emit one idempotent, internal-only example of every canonical event so PostHog assets can be configured before rare lifecycle outcomes occur. Run it only with Production environment variables; all seed events use `is_internal_user=true` and deterministic insert IDs.

## PostHog project status

The production project is `FairLend Production` (US Cloud project 503855), using `America/Toronto` and the canonical `www.fairlend.ca`/`fairlend.ca` domains. The configured reporting suite contains seven actions, six cohorts, six 90-day funnels, three path analyses, nine heatmaps, the four operational dashboards, and a disabled abandonment-survey draft.

The current PostHog subscription does not support 15-minute insight-alert evaluation. The submission-failure alert is therefore configured at the supported hourly cadence with a threshold of three. Upgrade to PostHog Boost before representing this alert as a 15-minute operational SLA.

PostHog cannot persist empty replay collections. Create the intake-abandonment, validation/submission-failure, exception, frustration, and converted-session playlists after the first consented production recordings exist; the built-in frustration playlist remains available in the interim.
