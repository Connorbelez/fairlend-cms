# Analytics Vendor Setup Status

Last updated: 2026-07-08.

## Implemented In Code

- Consent-gated analytics loader is implemented in `src/components/Analytics/AnalyticsProvider.client.tsx`.
- Sanitized conversion/event helpers are implemented in `src/lib/analytics/events.ts`.
- Environment variables are documented in `.env.example`.
- Local development has `NEXT_PUBLIC_GTM_ID=GTM-5HV3MRRW` in `.env.local`.
- Setup and compliance notes are documented in `docs/analytics-setup.md`.

## Verification Evidence

- `pnpm exec vitest run --config ./vitest.config.mts tests/int/fairlend-analytics.int.spec.ts` passes.
- `pnpm exec tsc --noEmit --pretty false` passes.
- Scoped ESLint for analytics/touched lead files passes.
- `tests/int/fairlend-analytics.int.spec.ts` verifies:
  - no vendor calls happen before optional consent is granted
  - analytics-only consent sends analytics events but not ad pixels
  - marketing consent fires lead conversion destinations
  - sensitive lead fields are stripped before vendor calls

## Account Setup State

### PostHog

Status: blocked by GitHub/PostHog authentication.

Current blocker: PostHog redirects to GitHub sign-in for OAuth. Complete GitHub login/2FA/authorization in the in-app browser, then create/select the FairLend project and copy the project key into `NEXT_PUBLIC_POSTHOG_KEY`.

### Google Analytics 4

Status: staged at final account/property creation.

Prepared values:

- Account name: `FairLend`
- Property name: `FairLend CMS`
- Country: `Canada`
- Reporting timezone: `Toronto Time`
- Currency: `Canadian Dollar`
- Industry: `Finance`
- Business size: `Small - 1 to 10 employees`
- Business objective: `Generate leads`

Blocked action: clicking `Create` creates the real GA4 account/property under the signed-in Google account and requires user confirmation.

After creation:

- Copy the web stream measurement ID to `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Link the property to Google Ads if a Google Ads account is created.

### Google Tag Manager

Status: created and wired locally.

Created values:

- Account name: `FairLend`
- Country: `Canada`
- Container name: `www.fairlend.ca`
- Target platform: `Web`
- Container ID: `GTM-5HV3MRRW`

Implementation state:

- `NEXT_PUBLIC_GTM_ID=GTM-5HV3MRRW` is set in `.env.local`.
- Add the same value in Vercel/production when deploying.

### Google Ads

Status: blocked by account creation/business setup.

Current blocker: the signed-in Google account has no Google Ads accounts. Creating one requires business/account choices and final account creation confirmation.

After creation:

- Copy the Ads customer/conversion tag ID to `NEXT_PUBLIC_GOOGLE_ADS_ID`.
- Create a lead conversion action and copy its label to `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL`.

### Meta Pixel

Status: blocked by Meta Business login.

Current blocker: Meta Business redirects to login. After login, create a Dataset/Pixel only for eligible pages and copy the Pixel ID to `NEXT_PUBLIC_META_PIXEL_ID`.

### LinkedIn Insight Tag

Status: blocked by LinkedIn Campaign Manager login.

Current blocker: LinkedIn Campaign Manager redirects to login. After login, create/select the ad account and Insight Tag, then copy:

- Partner ID to `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`
- Lead conversion ID to `NEXT_PUBLIC_LINKEDIN_LEAD_CONVERSION_ID`

### Microsoft Advertising UET

Status: blocked by Microsoft Advertising account setup.

Current blocker: Microsoft Advertising setup requires account/business choices. After login/setup, create a UET tag and copy the tag ID to `NEXT_PUBLIC_MICROSOFT_UET_TAG_ID`.
