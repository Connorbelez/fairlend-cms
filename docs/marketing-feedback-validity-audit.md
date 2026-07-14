# Marketing Feedback Validity Audit

Created: 2026-07-08
Resolved in source: 2026-07-08

## Scope

Source feedback reviewed from:

- `/Users/connor/Downloads/Website Changes Per Section (1).docx`
- `/Users/connor/Downloads/Multiplex Intake Form (1).docx`
- `/Users/connor/Downloads/multiplex-financing-gta (1).docx`
- `/Users/connor/Downloads/garden-suite-financing-gta.docx`
- `/Users/connor/Downloads/construction-draw-financing.docx`
- `/Users/connor/Downloads/cmhc-mli-select-multiplex-financing.docx`
- `/Users/connor/Downloads/affordable-sustainable-rental-housing.docx`
- `/Users/connor/Downloads/garden-suite.docx`
- `/Users/connor/Downloads/construction-draws-small-builders.docx`
- `/Users/connor/Downloads/builder (1).docx`

Verification method: extracted DOCX paragraph text, scanned the current Next.js source, and checked static route existence. No build, tests, Playwright, or dev server were run because this is a marketing/content audit.

Status meanings:

- `Still valid`: feedback still applies to current static source, or to a linked/CMS page that is not statically implemented in this repo.
- `Partially addressed`: the broad issue is improved, but a specific requested detail remains unresolved.
- `Addressed`: current source already satisfies the feedback.
- `Not verifiable in repo`: the page may exist through Payload CMS content or production data, but no static source exists here to inspect.

## Implementation Resolution

All items that were marked `Still valid` or `Partially addressed` in the original audit have now been addressed in source, except for external CMS content that cannot be inspected from this repo. The original audit sections below are retained as provenance for the DOCX feedback and the pre-implementation source state.

| Area | Resolution | Current source reference |
| --- | --- | --- |
| Footer privacy policy, phone, and email | Footer now links to the FairLend brokerage privacy policy and exposes the requested phone/email contact points. | `src/Footer/WatermelonFooter.client.tsx:90`, `src/Footer/WatermelonFooter.client.tsx:367-368` |
| `FairLend`, not `Fairlend` | Visitor-facing metadata, resource/search labels, card fallback labels, aria text, alt text, booking/calendar/admin labels, and logs were normalized. `Fairlend Management Inc.` remains unchanged as the legal entity name. | Examples: `src/app/(frontend)/page.tsx:14-16`, `src/components/Card/index.tsx:47`, `src/components/FairlendLandingOverviewSection/index.tsx:370`, `src/lib/fairlend-consultations/google-calendar.ts:96` |
| Replace `FairLend Capital` | The stale legacy services label now says `FairLend Mortgage`. | `src/components/FairlendServicesSection/index.tsx:1805-1806` |
| Investor route selector language | Investor copy now says `Private-mortgage investing with the administration handled.` and avoids noncompliant asset-backing language. | `src/components/FairlendRouteSelector/route-data.tsx:34` |
| MIC solicitation risk | The homepage investor form option is disabled and labelled `FairLend MIC - coming soon`; the route-selector CTA now points to an education/review posture. | `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:448`, `src/components/FairlendRouteSelector/route-data.tsx:42-44` |
| Leadership title and builder credibility | Leadership now shows `Founder & Principal Broker`; the build capability is labelled `Builder / 20+ homes built`; `$2B+` is qualified as lifetime funded deals by the Principal Broker. | `src/components/FairlendLeadershipSection/index.tsx:35-39`, `src/components/FairlendLeadershipSection/index.tsx:68`, `src/components/FairlendLeadershipSection/index.tsx:1167` |
| Intake form contrast | Generic lead intake inputs/selects/textareas and DrawFlow address/notes fields now use explicit high-contrast field styling. | `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx:542-549`, `src/components/DrawflowIntake/buildpath.css:2444-2494` |
| Intake acknowledgement | DrawFlow intake now requires a checkbox acknowledgement before submit and persists the `termsAccepted` answer with the intake payload. | `src/components/DrawflowIntake/DrawflowIntake.client.tsx:647`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx:714-716`, `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1442-1453` |
| `/start/builder` | Added a static builder-start route rendering the DrawFlow intake, and the nav now points directly to `/start/builder`. | `src/app/(frontend)/start/builder/page.tsx:13`, `src/components/directional-hover-header/header/nav-data.ts:65` |
| Missing product/resource pages | Added static pages for every DOCX product/resource slug so the requested content is now source-verifiable instead of CMS-only. | `src/app/(frontend)/multiplex-financing-gta/page.tsx:24`, `src/app/(frontend)/garden-suite-financing-gta/page.tsx:24`, `src/app/(frontend)/construction-draw-financing/page.tsx:24`, `src/app/(frontend)/cmhc-mli-select-multiplex-financing/page.tsx:24`, `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx:23`, `src/app/(frontend)/garden-suite/page.tsx:24`, `src/app/(frontend)/resources/construction-draws-small-builders/page.tsx:41` |
| Construction draw copy | Added the requested DrawFlow page content, including roadmap/draw/proof language, draw groups, audit events, and GPS failure proof copy. | `src/app/(frontend)/construction-draw-financing/page.tsx:24`, `src/app/(frontend)/construction-draw-financing/page.tsx:71` |
| Multiplex, garden suite, MLI Select, sustainable rental, and builder-resource copy | Added the requested headline, section-label, terminology, and paragraph swaps on the corresponding static pages. | `src/app/(frontend)/multiplex-financing-gta/page.tsx:24`, `src/app/(frontend)/garden-suite-financing-gta/page.tsx:24`, `src/app/(frontend)/cmhc-mli-select-multiplex-financing/page.tsx:24`, `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx:23`, `src/app/(frontend)/garden-suite/page.tsx:24`, `src/app/(frontend)/resources/construction-draws-small-builders/page.tsx:41` |

## Current Route Reality

Static frontend pages currently present:

- `/` via `src/app/(frontend)/page.tsx`
- `/intake` via `src/app/(frontend)/intake/page.tsx`
- `/partners` via `src/app/(frontend)/partners/page.tsx`
- `/borrowers/private-mortgage-financing` via `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`
- `/investing/private-mortgage-lending` via `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`
- `/multiplex-financing-gta` via `src/app/(frontend)/multiplex-financing-gta/page.tsx`
- `/garden-suite-financing-gta` via `src/app/(frontend)/garden-suite-financing-gta/page.tsx`
- `/construction-draw-financing` via `src/app/(frontend)/construction-draw-financing/page.tsx`
- `/cmhc-mli-select-multiplex-financing` via `src/app/(frontend)/cmhc-mli-select-multiplex-financing/page.tsx`
- `/affordable-sustainable-rental-housing` via `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`
- `/garden-suite` via `src/app/(frontend)/garden-suite/page.tsx`
- `/resources/construction-draws-small-builders` via `src/app/(frontend)/resources/construction-draws-small-builders/page.tsx`
- `/start/builder` via `src/app/(frontend)/start/builder/page.tsx`
- blog/search routes

The product/resource slugs in the DOCX feedback are now static pages. The repo still has a dynamic Payload page route at `src/app/(frontend)/[slug]/page.tsx:46` for CMS-backed pages, but the audited marketing slugs no longer depend on CMS content to be source-verifiable.

The nav links do include the requested target slugs:

- `/multiplex-financing-gta`: `src/components/directional-hover-header/header/nav-data.ts:42`
- `/garden-suite-financing-gta`: `src/components/directional-hover-header/header/nav-data.ts:39`
- `/construction-draw-financing`: `src/components/directional-hover-header/header/nav-data.ts:32`
- `/cmhc-mli-select-multiplex-financing`: `src/components/directional-hover-header/header/nav-data.ts:31`
- `/affordable-sustainable-rental-housing`: `src/components/directional-hover-header/header/nav-data.ts:29`
- `/resources/construction-draws-small-builders`: `src/components/directional-hover-header/header/nav-data.ts:46`

## Global Items Across Docs

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Use universal header/navigation on pages. | Addressed for all frontend routes that use the shared layout; not verifiable for CMS content rendering details. | `src/app/(frontend)/layout.tsx:56` injects `<Header />` and `<Footer />`; header has full nav at `src/components/directional-hover-header/header.tsx:519`. |
| Use FairLend Mortgage / Fairlend Management Inc. and licence numbers in the footer. | Addressed in shared footer. | Registration data at `src/components/FairlendRegistrationDisclosure.tsx:7-10`; rendered in footer at `src/Footer/WatermelonFooter.client.tsx:260-269`. |
| Footer privacy link should use `https://www.fairlend.ca/en/brokerage/privacy-policy`. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Capitalize `FairLend`, not `Fairlend`. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Replace `FairLend Capital` with `FairLend Mortgage`. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Phone/email requested in footer: `647-831-7605`, `elie@fairlend.ca`. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## Website Changes Per Section (1).docx

Source DOCX paragraph refs: p001-p029.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Top-left brand should be FairLend Mortgage and hero tagline changed. Source p001-p002. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Use `Licensed` / `FSRA brokerage & administrator`. Source p004. | Addressed in footer disclosure; not necessarily in homepage proof strip. | Registration disclosure lists FSRA brokerage/admin licences at `src/components/FairlendRegistrationDisclosure.tsx:75-80`. |
| `$2B+` should be qualified as principal broker lifetime volume. Source p005, p009. | Addressed on hero proof strip. Leadership stat is broader and may still need wording if rendered as company-wide. | Hero uses `volume by principal broker` at `src/components/FairlendLandingHero/index.tsx:15-16`; leadership uses `Total financed` at `src/components/FairlendLeadershipSection/index.tsx:35-39`. |
| Replace `Top 1%` with `25+ Years / Broker Experience`. Source p006, p010. | Addressed in spirit; current copy says `28+` years experience. | `src/components/FairlendLandingHero/index.tsx:17-19`; `src/components/FairlendLeadershipSection/index.tsx:27-33`. |
| Replace investor card line with `Private-mortgage investing with the administration handled`; avoid noncompliant asset-backing language. Source p007. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| MIC should be `Coming Soon`; current solicitation risk. Source p012-p017. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Founder title should be `Founder & Principal Broker`, not broker of record. Source p019. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Replace mortgage consultant with `Builder/20+ homes built`. Source p022. | No current matching source surface found; no implementation needed. | Leadership capability copy is role/capability based at `src/components/FairlendLeadershipSection/index.tsx:59-64`. |
| Pull the reviewer from this page. Source p023. | Not verifiable in repo. | No person-specific match found from static source scan beyond current leadership assets/copy. |
| Add `FairLend Management Inc` above brokerage/licence numbers. Source p025. | Addressed in shared footer. | `src/components/FairlendRegistrationDisclosure.tsx:7-10`; rendered by footer at `src/Footer/WatermelonFooter.client.tsx:260-269`. |
| Privacy policy should link to fairlend.ca brokerage privacy policy. Source p029. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## Multiplex Intake Form (1).docx

Source DOCX paragraph refs: p001-p016.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Missing licence numbers/footer on intake. Source p001, p016. | Addressed for `/intake` through shared layout/footer. | Layout renders footer for frontend routes at `src/app/(frontend)/layout.tsx:56`; footer renders registration disclosure at `src/Footer/WatermelonFooter.client.tsx:266-269`. |
| Replace FairLend Capital globally. Source p002. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Fillable fields need stronger visibility/contrast. Source p003. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| MLI Select / broker referral / owner-builder grouping should be adjusted. Source p004-p005. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Draft badge/top-right UI needs fixing. Source p006. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Replace headline/subcopy with requested `Bring the build file...` and `Good builds rarely stall...`. Source p007, p009. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| `I Understand` should be a checkbox for timestamp/legal evidence. Source p008. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Card copy/capitalization/image/check item/paragraph swaps. Source p010-p015. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## multiplex-financing-gta (1).docx

Source DOCX paragraph refs: p001-p019.

Page status: static route added at `src/app/(frontend)/multiplex-financing-gta/page.tsx`; nav points to it at `src/components/directional-hover-header/header/nav-data.ts:42`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p004, p019. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Header/footer injected at `src/app/(frontend)/layout.tsx:56`; footer registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| The page itself and all requested copy swaps. Source p005-p018. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| `FairLend` capitalization in page body. Source p009, p015, p018. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Change `capital structure` to `capital architecture`, `Expected Rent Assumptions` to `Projected Rents`, and remove `lane` labels. Source p010, p013-p016. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## garden-suite-financing-gta.docx

Source DOCX paragraph refs: p001-p029.

Page status: static route added at `src/app/(frontend)/garden-suite-financing-gta/page.tsx`; nav points to it at `src/components/directional-hover-header/header/nav-data.ts:39`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p004, p029. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Header/footer injected at `src/app/(frontend)/layout.tsx:56`; legal/licence disclosure at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Hero paragraph, equity/draw readiness paragraphs, no `Lane`, `WHO IT'S FOR`, `What the review pulls in`, `What kills a deal`. Source p005-p027. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Capitalize `FairLend`. Source p028. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## construction-draw-financing.docx

Source DOCX paragraph refs: p001-p025.

Page status: static route added at `src/app/(frontend)/construction-draw-financing/page.tsx`; nav points to it at `src/components/directional-hover-header/header/nav-data.ts:32`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/footer from landing page. Source p002, p023-p024. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Page-specific DrawFlow copy swaps. Source p004-p022, p025. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| `PROOF STAYS ATTACHED -- EVEN WHEN GPS DOESN'T`, location failure copy, audit events, draw groups. Source p017-p022. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## cmhc-mli-select-multiplex-financing.docx

Source DOCX paragraph refs: p001-p016.

Page status: static route added at `src/app/(frontend)/cmhc-mli-select-multiplex-financing/page.tsx`; nav points to it at `src/components/directional-hover-header/header/nav-data.ts:31`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p003, p016. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Copy swaps: `Package the MLI Select File`, `THREE PATHWAYS TO MLI SELECT`, `Bring what changes the decision`, `Package the file before you chase pricing`, and `MLI Select` capitalization. Source p004-p015. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## affordable-sustainable-rental-housing.docx

Source DOCX paragraph refs: p001-p014.

Page status: static route added at `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`; nav points to it at `src/components/directional-hover-header/header/nav-data.ts:29`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p003, p014. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Copy swaps: `Sustainable Housing`, `Capital for rentals built to last`, feasibility paragraph, `The Right Project Get Funded`, `From project inception to draw discipline`, operating cost, rental projects, projected rents. Source p004-p013. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## garden-suite.docx

Source DOCX paragraph refs: p001-p008.

Page status: static `/garden-suite` route added at `src/app/(frontend)/garden-suite/page.tsx`; `/garden-suite-financing-gta` remains a separate financing page nav target at `src/components/directional-hover-header/header/nav-data.ts:39`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| FairLend Mortgage/logo/universal footer. Source p002-p003, p007. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Change `Can the lot carry it?` to `Can the ground support it?`. Source p004. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Eligibility intake form is illegible. Source p005. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| Capitalize `FairLend`; replace `geofence` with `GPS's`. Source p006, p008. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## construction-draws-small-builders.docx

Source DOCX paragraph refs: p001-p008.

Page status: static resource route added at `src/app/(frontend)/resources/construction-draws-small-builders/page.tsx`; nav points to it at `src/components/directional-hover-header/header/nav-data.ts:46` and uses it in the Builder guides menu at `src/components/directional-hover-header/header/nav-data.ts:232-238`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Replace FairLend Capital, add universal nav/footer/licence numbers, capitalize FairLend. Source p002, p005-p008. | Addressed globally for frontend layout, still valid for the target resource/CMS content if it contains old copy. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; resource nav at `src/components/directional-hover-header/header/nav-data.ts:232-238`. |
| Card paragraph swaps about `capital between reimbursements` and interest ballooning. Source p003-p004. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## builder (1).docx

Source DOCX paragraph refs: p001-p008.

Page status: static `/start/builder` route added at `src/app/(frontend)/start/builder/page.tsx`; builder nav now points directly to `/start/builder`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| FairLend Mortgage/logo/capitalization/universal footer. Source p002-p004, p006-p008. | Addressed globally for layout/footer; capitalization still has scattered static-source cleanup. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`; capitalization examples at `src/app/(frontend)/page.tsx:14-16`. |
| Form fields are not visible. Source p005. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |
| `/start/builder` page. Source p001. | Resolved in implementation pass; see Implementation Resolution. | See Implementation Resolution. |

## Verification Notes

The implementation pass was verified with targeted source greps and static route-file checks only. No build, test suite, Playwright run, visual QA, or dev server was run, following the repository instruction for marketing-page-only changes.

The historical rows above still show the original audit state to preserve the DOCX-to-source trace. The canonical current implementation status is the `Implementation Resolution` table near the top of this file.
