# FairLend search launch implementation

This document maps the code-owned items from the July 14, 2026 search-indexing launch runbook to their implementation and keeps account/operator work explicit.

## Implemented in this repository

### Search corpus and sitemap

- The production migration `20260714_140000_search_readiness` deletes the QA page `money-page-blocks-qa-2026-07-12` and the three generic demo posts.
- The seed workflow no longer creates demo authors, demo posts, generic categories, or the template contact page.
- Both sitemap routes defensively exclude the QA/demo slugs even before the cleanup migration runs.
- The pages sitemap includes only finished canonical static public routes. The unfinished CMHC MLI Select and builder-resource pages are deliberately excluded.
- `/terms` is intentionally `index, follow`, self-canonical, internally linked, and included in the sitemap.
- Search, intake, builder workflow, pagination, preview, admin, API, and campaign routes remain outside the sitemap.
- CMS-derived `lastmod` values continue to use Payload's `updatedAt`; static routes do not emit synthetic deployment timestamps.

### Canonical and route hygiene

- Canonical URLs normalize the apex host to `https://www.fairlend.ca`.
- The legacy `/fairlend-landing-hero` route has been removed and returns `404`.
- Unknown `/r/*` campaign codes return a real `404` with `X-Robots-Tag: noindex`; configured codes retain tracked temporary redirects.
- `robots.txt` generation explicitly allows Googlebot, Bingbot, DuckDuckBot, Applebot, and OAI-SearchBot while blocking admin, API, and preview endpoints.

### Indexable trust and hub pages

- `/contact` is a static branded trust page adapted from the vendored `@efferd/contact-5` shadcn registry block. It has unique metadata, a visible H1, working lead submission, phone, monitored email, consultation availability, service area, legal/licence disclosure, preparation guidance, and contextual links.
- `/borrowers` and `/investing` provide crawlable hub routes that link to the priority commercial pages with descriptive anchor text.
- `/disclosures` consolidates legal identity, FSRA licence references, financing limitations, investor-risk language, and links to privacy, terms, and contact.
- Header and footer navigation now link directly to priority money pages and the builder resource instead of routing every informational click into a noindex intake workflow.

### Entity and structured data

- The Organization/FinancialService graph now includes the canonical logo, contact point, weekday consultation availability, service area, stable organization ID, and official licence-record links.
- The contact page adds `ContactPage` and `BreadcrumbList` structured data matching visible content.
- Public footer contact data is aligned with the organization graph: `647-831-7605` and `elie@fairlend.ca`.

### IndexNow

- A stable public IndexNow verification key is served from `/indexnow-key.txt`; `INDEXNOW_KEY` is an optional rotation override.
- Published Pages and Posts enqueue notifications after publish, material published updates, unpublish, and delete events.
- Notifications always use the final `www` canonical URL and include `keyLocation`.
- A durable `fairlend_indexnow_events` table deduplicates document versions and records URL, change type, collection/document, version timestamp, deployment, response status, retry count, and error.
- Transient `429` and `5xx` responses retry with bounded exponential backoff and a five-second timeout per attempt. Drafts, autosaves, previews, staging deployments, and unchanged versions do not notify.

### Technical SEO hardening

- Apex-host traffic now receives one permanent redirect directly to the final HTTPS `www` URL.
- The two intentional noindex resource placeholders are retired with permanent redirects, and live navigation now links directly to their complete replacement pages.
- Every source-controlled page sitemap entry has a source-authored `lastmod`; CMS-only pages retain Payload `updatedAt`, and the posts archive advances when a real published post changes.
- Global response headers now add HSTS, MIME-sniffing protection, a strict referrer policy, framing protection, a permissions policy, and a report-only CSP with a bounded, privacy-sanitized report endpoint.
- `X-Powered-By` is disabled before Payload wraps the Next.js configuration.
- HSTS `includeSubDomains` and preload were evaluated and intentionally withheld: wildcard and nested FairLend DNS names do not all present valid TLS, and `autodiscover.fairlend.ca` could not be proven HTTPS-safe. Re-evaluate only after an authoritative subdomain inventory and TLS remediation.

## Production deployment steps

1. Leave `INDEXNOW_KEY` unset to use the checked-in public key, or set a valid 8–128 character replacement in the Vercel Production environment when rotating it. Do not set `INDEXNOW_ENABLED`; production enables automatically.
2. Confirm `NEXT_PUBLIC_SERVER_URL=https://www.fairlend.ca`.
3. Deploy normally so Payload runs `20260714_140000_search_readiness` before the application build.
4. Run the automated release gate:

   ```sh
   pnpm audit:seo https://www.fairlend.ca
   ```

5. If the gate reports a failure, use the individual checks below to inspect it:

   ```sh
   curl -I https://www.fairlend.ca/fairlend-landing-hero # expect 404
   curl -I https://www.fairlend.ca/r/not-real
   curl https://www.fairlend.ca/robots.txt
   curl https://www.fairlend.ca/sitemap.xml
   curl https://www.fairlend.ca/pages-sitemap.xml
   curl https://www.fairlend.ca/posts-sitemap.xml
   curl https://www.fairlend.ca/indexnow-key.txt
   ```

6. Confirm removed QA/demo URLs return `404` or `410`, and confirm no sitemap URL redirects, returns `noindex`, or declares a different canonical.
7. Validate the homepage and contact-page JSON-LD in Google Rich Results Test and Schema.org Validator.
8. Confirm Vercel Firewall/WAF allows current Googlebot, Bingbot, Applebot, DuckDuckBot, and OAI-SearchBot traffic.

## Account/operator work still required

These tasks cannot be completed by repository code and require domain/account authority:

- Create the `fairlend.ca` Google Search Console Domain property, retain DNS TXT verification, and add a backup owner/full user.
- Check Search Console Manual actions and Security issues before submission.
- Submit only `https://www.fairlend.ca/sitemap.xml`, wait for Success, live-test the priority launch URLs, request indexing once per URL, and keep an inspection log.
- Import the verified property into Bing Webmaster Tools, confirm the sitemap, inspect priority URLs, run Site Scan, and monitor its IndexNow report.
- Decide GPTBot and Applebot-Extended model-training consent separately from search crawler access.
- Claim and reconcile eligible Google Business Profile, Bing Places, and Apple Business Connect records.
- Verify that public business name, phone, service area, hours, licences, and website URL match every official profile and regulator record.
- Add only verified official social/business profiles to Organization `sameAs`; none were discoverable in the codebase, so no social URLs were invented.
- Establish launch-day, weekly, monthly, and quarterly Search Console/Bing monitoring described in the runbook.

Do not submit the sitemap to search engines until the post-deploy release gate passes.
