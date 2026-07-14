# QR campaign attribution and journey reporting

## Flow

1. `/r/[campaign]` creates a scan row and redirects to the configured destination.
2. The response sets a 30-day `HttpOnly` attribution cookie signed with
   `FAIRLEND_ATTRIBUTION_SECRET` (falling back to `PAYLOAD_SECRET`) and a non-sensitive marker
   cookie used to avoid journey requests for non-campaign visitors.
3. Lead submissions, consultation bookings, and Payload CMS form submissions record their
   successful outcome against the signed scan identifier.
4. With analytics consent, the global frontend tracker records page views and page exits. Query
   strings, form answers, and raw IP addresses are not stored in campaign journey events.

Invalid, modified, expired, or unsigned attribution cookies are ignored. Attribution and journey
writes are isolated from the conversion path: a reporting failure cannot fail a lead, booking, CMS
form submission, or navigation. Event request bodies are limited to 16 KiB and each scan is capped
at 1,000 deduplicated journey events to prevent unbounded ingestion.

## Event model

Campaign events are available under **Operations → FairLend Campaign Events** in Payload:

- `page_view` and `page_exit`: consented behavioral journey events;
- `intake_started` and `intake_submitted`: standard `/api/leads` outcomes;
- `consultation_booked`: confirmed consultation scheduler outcome;
- `form_submitted`: successful Payload form-builder outcome.

The event table stores campaign and scan identifiers, page path, visit identifier, capped duration,
form identifier/name, intake type, lead identifier, and timestamps. It does not store submitted form
values.

## Dashboard definitions

- **QR scans:** all scan rows for configured campaigns.
- **Behavior-tracked scans:** scans with at least one consented `page_view`.
- **Bounce:** a behavior-tracked scan with exactly one page view, no intake/form start, no successful
  outcome, and no converted lead.
- **Bounce rate:** bounced scans divided by behavior-tracked scans. Scans without analytics consent
  are excluded rather than classified as bounces.
- **Successful intake:** a scan with an attributed submitted lead, confirmed consultation booking,
  successful CMS form submission, or legacy converted-lead marker.
- **Successful-intake rate:** successful scans divided by all QR scans.
- **Last page before abandonment:** the final consented page view for tracked scans without a
  successful outcome. This includes multi-page and started-but-unfinished journeys, so it is broader
  than the strict bounce metric.

## Deployment

Run the registered Payload migration before deploying application code:

```sh
pnpm payload:migrate
```

Set a strong `FAIRLEND_ATTRIBUTION_SECRET` in each environment. If omitted, `PAYLOAD_SECRET` signs
the cookie. Rotating either active signing secret invalidates existing attribution cookies, which is
safe but resets attribution for those browser sessions.
