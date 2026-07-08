# FairLend Analytics Setup

This site has a consent-gated analytics layer for PostHog, GA4/GTM, Google Ads, Meta, LinkedIn, and Microsoft Ads.

## What Is Implemented

- PostHog product analytics, autocapture, heatmaps, funnels, and session replay.
- GA4 pageview and custom event tracking.
- Google Tag Manager loading with Google Consent Mode v2.
- Google Ads, Meta Pixel, LinkedIn Insight Tag, and Microsoft UET retargeting tags.
- Sanitized lead events for the key FairLend flows:
  - `fairlend_lead_started`
  - `fairlend_lead_submitted`
  - `fairlend_lead_failed`
  - `fairlend_application_tab_selected`
  - `fairlend_scheduler_opened`
  - `fairlend_consultation_cta_clicked`
- Consent banner with separate Analytics and Advertising switches.

The implementation intentionally does not send names, emails, phone numbers, addresses, notes, balances, property values, or requested amounts as analytics event properties.

## Environment Variables

Set these in Vercel or the deployment environment:

```bash
NEXT_PUBLIC_ANALYTICS_DISABLED=false
NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT=true
NEXT_PUBLIC_ANALYTICS_DEBUG=false

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL=

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=
NEXT_PUBLIC_LINKEDIN_LEAD_CONVERSION_ID=
NEXT_PUBLIC_MICROSOFT_UET_TAG_ID=
```

## Account Setup Checklist

### PostHog

1. Create a PostHog project for the production domain.
2. Copy the project API key into `NEXT_PUBLIC_POSTHOG_KEY`.
3. Use `https://us.i.posthog.com` unless the account is created in the EU region.
4. Enable session replay and heatmaps in PostHog.
5. Create funnels:
   - Landing page view -> `fairlend_lead_started` -> `/intake` page view -> `fairlend_lead_submitted`.
   - Borrower page view -> `fairlend_lead_submitted`.
   - Consultation intake success -> `fairlend_scheduler_opened`.

### Google

1. Create a GA4 property.
2. Create a Web data stream and copy the measurement ID into `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
3. Create a Google Tag Manager web container and copy the container ID into `NEXT_PUBLIC_GTM_ID`.
4. Link GA4 and Google Ads.
5. Create a Google Ads lead conversion action and copy:
   - Google Ads ID into `NEXT_PUBLIC_GOOGLE_ADS_ID`.
   - Lead conversion label into `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL`.
6. Verify Consent Mode v2 in Google Tag Assistant.

### Meta

1. Create a Meta Business portfolio and Dataset/Pixel.
2. Copy the Pixel ID into `NEXT_PUBLIC_META_PIXEL_ID`.
3. Create website custom audiences for eligible pages only.
4. Mark campaigns under the correct financial products/services special category if applicable.

### LinkedIn

1. Create a Campaign Manager ad account.
2. Create an Insight Tag and copy the partner ID into `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`.
3. Create a lead conversion action if needed and copy its ID into `NEXT_PUBLIC_LINKEDIN_LEAD_CONVERSION_ID`.
4. Do not install the tag on pages that collect or display sensitive financial account data.

### Microsoft Ads

1. Create a UET tag.
2. Copy the tag ID into `NEXT_PUBLIC_MICROSOFT_UET_TAG_ID`.
3. Create remarketing lists and conversion goals in Microsoft Advertising.

## Privacy And Compliance Notes

FairLend is in a financial-services-adjacent category. Treat retargeting as restricted until legal/compliance confirms the exact ad category rules for each platform.

- Keep optional analytics and advertising consent-gated.
- Do not send form values or financial details to analytics vendors.
- Keep PostHog replay private by default: all text, element attributes, and inputs are masked.
- Do not place ad pixels on authenticated account, transaction, document-upload, or other sensitive financial pages without legal review.
- For Google and Meta campaigns, expect targeting restrictions for housing, credit, or financial products/services.

## Verification

In production or preview:

1. Load the site with an empty consent state and confirm no optional vendor scripts load before consent.
2. Accept Analytics only and confirm PostHog/GA4 pageviews flow, while ad pixels remain absent.
3. Accept Advertising and confirm configured retargeting pixels load.
4. Submit a test lead and confirm `fairlend_lead_submitted` appears in PostHog and `generate_lead` appears in GA4.
5. Confirm no PII appears in PostHog event properties or session replay.

