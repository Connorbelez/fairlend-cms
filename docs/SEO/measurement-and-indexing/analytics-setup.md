# FairLend Production Analytics

FairLend uses Vercel Web Analytics and Speed Insights for always-on anonymous public-site traffic and performance measurement, a direct GA4 Google tag for aggregate consented acquisition/conversion reporting, a published Google Tag Manager container for future tag management, and PostHog for consented product analytics. Preview and development deployments must not receive the production GA, GTM, or PostHog public IDs, so they cannot pollute production reporting; Vercel keeps Preview and Production data in separate environment filters.

## Vercel anonymous traffic and performance

The shared public frontend layout mounts `@vercel/analytics` and `@vercel/speed-insights`. This covers the home page, marketing and product pages, CMS pages, posts, calculators, booking, contact, and intake routes. Payload Admin, API handlers, sitemap/text endpoints, and preview-control handlers do not mount the clients.

Vercel measurement is always active when the global `NEXT_PUBLIC_ANALYTICS_DISABLED` kill switch is false. It is anonymous and cookie-free, so it is separate from the optional behavioral-analytics consent controlling PostHog and GA4. Every outgoing Vercel URL has its query string and fragment removed. Visits marked with `?analytics_internal=1` or the persisted `fairlend.analytics-internal.v1` flag are discarded; `?analytics_internal=0` clears that designation through the shared analytics provider.

Vercel receives automatic public-page views and route-attributed Core Web Vitals plus four deliberately narrow custom events:

- `fairlend_page_engaged_30s` after 30 seconds of visible active time
- `fairlend_page_engaged_90s` after 90 seconds of visible active time
- `fairlend_intake_started` with only `journey_type` and `form_id`
- `fairlend_lead_submitted` with only `journey_type` and `form_id`

Engagement clocks pause while the document is hidden and reset on client-side page navigation. Detailed intake steps, validation failures, CTA clicks, session replay, exceptions, and CRM lifecycle events remain in the consented PostHog/GA4 contract and are not copied to Vercel.

Use the Vercel Production dashboard as follows:

- landing-page conversion = `fairlend_lead_submitted` / pageviews for that page
- form completion = `fairlend_lead_submitted` / `fairlend_intake_started`, filtered by `journey_type` or `form_id`
- 30-second or 90-second engaged-view rate = the corresponding milestone / pageviews
- bounce rate = Vercel's native page-level bounce rate; custom events do not change that calculation
- exact session duration and time-on-page = PostHog `$pageleave` and session data, after analytics consent

## Google production assets

The canonical production origin is `https://www.fairlend.ca`.

| Asset | Production value |
| --- | --- |
| GA4 account | `hfai` (`366481383`) |
| GA4 property | `fairlend-root` (`502729166`) |
| GA4 web stream | `FairLend Production Web` (`12081590698`) |
| GA4 measurement ID | `G-09V5BSS55K` |
| GTM account | `FairLend` (`6365028133`) |
| GTM web container | `www.fairlend.ca` (`GTM-5HV3MRRW`, container `257766163`) |
| Search Console property | `https://www.fairlend.ca/` (GA4-verified owner) |

GTM Version 2, `Initial production ownership container`, is the current live version. It intentionally contains zero tags, the `Analytics Consent Granted` custom-event trigger, and the `Canonical Production Origin` constant. Google currently displays a malware-scanner warning on this zero-tag version, confirming that the flag is container/domain-level rather than caused by a tag payload.

GA4 currently loads directly from the application with Consent Mode defaulted to denied. Its configuration suppresses automatic pageviews, and the application emits the first pageview only after analytics consent. GTM is independently installed for future tag management. This split is intentional: Google's malware scanner auto-paused a newly created native Google Tag before the container's first publication, and Google's remediation guidance warns against publishing or re-enabling flagged tags. The clean container is therefore published without the affected tag.

Do not add a second GA pageview tag. The application configures `G-09V5BSS55K` with `send_page_view=false` and owns each initial and client-side navigation `page_view`. If Google clears the container and GA delivery is moved into GTM later, set `NEXT_PUBLIC_GA_MANAGED_BY_GTM=true`, configure the GTM Google Tag with `send_page_view=false`, and fire it only on the `fairlend_analytics_ready` custom event.

The denied Consent Mode default, executable GTM bootstrap, and direct GA4 tag are server-rendered in `<head>`. The direct GA4 configuration uses `send_page_view=false`; loading the tag therefore does not authorize analytics storage or emit an application pageview before consent. The GTM `<noscript>` iframe is the first application child under `<body>`, but Next.js 16 inserts its own React streaming marker before application children. Search Console therefore uses the direct GA4 tag for URL-prefix ownership verification rather than relying on GTM's legacy requirement that nothing appear before the `<noscript>` element.

## Data contract

The canonical schema lives in `src/lib/analytics/events.ts`. All client events use `trackFairlendEvent()`, which adds schema, deployment, and route classifications and accepts only the declared properties for that event. The shared sanitizer removes query strings, URL fragments, PII-shaped values, raw UUIDs, nested objects, financial fields, form answers, free-text fields, and database identifiers before capture. Development builds warn when a property is removed.

The Vercel bridge listens at that canonical browser-event boundary but forwards only intake starts and successful submissions. It independently emits the two anonymous active-engagement milestones described above. Vercel Pro permits two properties per event; neither event may add a third property or any contact, financial, property, document, or database value.

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
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-09V5BSS55K
NEXT_PUBLIC_GA_MANAGED_BY_GTM=false
NEXT_PUBLIC_GTM_ID=GTM-5HV3MRRW
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PROJECT_KEY=
POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PERSON_ID_SALT=
CRON_SECRET=
```

The GA4 stream URL must remain `https://www.fairlend.ca`. Enhanced Measurement may remain enabled for scrolls, outbound clicks, site search, video engagement, file downloads, and form interactions, but its automatic pageview/history-change measurement must stay disabled because the application owns SPA pageviews.

### GA4 event mapping

The typed application contract remains the source of truth. Google receives these recommended-name mappings:

- `fairlend_lead_submitted` → `generate_lead` (primary key event)
- `fairlend_intake_started` → `begin_checkout`
- `fairlend_consultation_scheduler_opened` → `schedule`
- every other `fairlend_*` event keeps its canonical name

Register event-scoped custom dimensions in GA4 for the reporting parameters that the sanitizer permits: `deployment_environment`, `page_type`, `content_group`, `journey_type`, `form_id`, `form_variant`, `source`, `cta_id`, `cta_location`, `step_key`, `completion_status`, `failure_type`, `input_category`, and `intent`. Never register or send contact details, free text, financial values, addresses, uploaded-document metadata, or internal database identifiers.

`generate_lead` is the configured primary GA4 key event, counted once per event with no fabricated default monetary value. The stale `close_convert_lead` and `qualify_lead` key-event flags from the previous project iteration are disabled. GA4's built-in `purchase` key event remains present but is not emitted by the FairLend application.

`POSTHOG_PERSON_ID_SALT` must be stable, high entropy, server-only, and at least 32 characters. Preview and Development must not have the PostHog key or host variables.

## Consent, identity, and lifecycle

Vercel Web Analytics and Speed Insights are anonymous, aggregate, cookie-free, and always active on public pages. The consent interface explicitly describes this baseline. Its Behavioral Analytics choice continues to control PostHog, GA4, identity linking, and replay; Advertising continues to control advertising and retargeting destinations.

PostHog is not initialized and no replay starts until analytics consent is affirmative. Lead submission accepts an optional `{ consentGranted: true, schemaVersion: 1 }` analytics context. For a consented submitted lead, the server returns a PostHog identity derived by HMAC from the internal lead ID; the raw lead ID is never exposed. The browser identifies before emitting `fairlend_lead_submitted`, which joins the anonymous acquisition journey to later consented lifecycle outcomes.

The browser stores a signed, narrowly scoped revocation capability. Withdrawing analytics consent opts out, stops recording, resets PostHog, and revokes future server lifecycle eligibility. Historical leads are not backfilled without an affirmative analytics-consent record.

`/api/cron/posthog-lifecycle` runs daily at 01:00 UTC, authenticates with `CRON_SECRET`, and translates Twenty CRM state into qualified, working-file, won, or lost events. Events use deterministic non-reversible insert IDs so retries are idempotent. Twenty remains authoritative and lifecycle freshness is up to 24 hours.

## Replay privacy

Replay uses balanced masking: public marketing copy and controls remain visible, while inputs, textareas, contenteditable nodes, validation/answer regions, intake summaries, uploads, account surfaces, and anything marked `data-analytics-sensitive` are masked or blocked. Network bodies and sensitive headers are disabled. Replay is stopped on admin, API, preview, account/dashboard, document, and upload routes.

Calibration is 100% of consented sessions for 30 days or 500 sessions, then 25% general sampling. Intake starts, validation/submission failures, exceptions, and frustration diagnostics should retain full recording through explicit starts or PostHog triggers.

## QA and verification

Use `?analytics_internal=1` on a production URL to persist both `is_internal_user=true` and PostHog's native `$internal_or_test_user=true`; use `?analytics_internal=0` to clear both flags. Saved production insights exclude internal users by default.

For every release:

1. With fresh storage, verify Vercel pageview and Speed Insights requests are present while no PostHog request, cookie, identity, or replay exists before consent.
2. Confirm Vercel URLs contain no query string or fragment and internal-marked visits produce no Vercel events.
3. Keep the page visible for 30 and 90 seconds, then verify each engagement milestone arrives once; repeat with a hidden tab to verify the clock pauses.
4. Submit synthetic non-sensitive lead forms and verify Vercel receives exact-once start and submission events containing only `journey_type` and `form_id`.
5. Accept analytics and verify sanitized PostHog `$pageview`, `$pageleave`, Web Vitals, autocapture, and replay.
6. Complete each journey with synthetic non-sensitive data and verify exact-once start, step, validation/back, submission, and failure semantics.
7. Inspect raw event properties and replay for form values, query strings, financial values, document details, and raw lead IDs.
8. Withdraw consent and verify PostHog capture stops, identity resets, and the lead revocation endpoint succeeds while anonymous Vercel measurement continues.
9. Verify the daily cron rejects missing/invalid authorization and emits only eligible lifecycle events.

The privacy-policy analytics wording is an implementation-accurate draft and must receive legal review before being treated as legal advice.

`scripts/seed-posthog-schema.mjs` can emit one idempotent, internal-only example of every canonical event so PostHog assets can be configured before rare lifecycle outcomes occur. Run it only with Production environment variables; all seed events use `is_internal_user=true` and deterministic insert IDs.

## PostHog project status

The production project is `FairLend Production` (US Cloud project 503855), using `America/Toronto` and the canonical `www.fairlend.ca`/`fairlend.ca` domains. The configured reporting suite contains seven actions, six cohorts, six 90-day funnels, three path analyses, nine heatmaps, the four operational dashboards, and a disabled abandonment-survey draft.

The current PostHog subscription does not support 15-minute insight-alert evaluation. The submission-failure alert is therefore configured at the supported hourly cadence with a threshold of three. Upgrade to PostHog Boost before representing this alert as a 15-minute operational SLA.

PostHog cannot persist empty replay collections. Create the intake-abandonment, validation/submission-failure, exception, frustration, and converted-session playlists after the first consented production recordings exist; the built-in frustration playlist remains available in the interim.
