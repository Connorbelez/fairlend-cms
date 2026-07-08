# Marketing Feedback Validity Audit

Created: 2026-07-08

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

## Current Route Reality

Static frontend pages currently present:

- `/` via `src/app/(frontend)/page.tsx`
- `/intake` via `src/app/(frontend)/intake/page.tsx`
- `/partners` via `src/app/(frontend)/partners/page.tsx`
- `/borrowers/private-mortgage-financing` via `src/app/(frontend)/borrowers/private-mortgage-financing/page.tsx`
- `/investing/private-mortgage-lending` via `src/app/(frontend)/investing/private-mortgage-lending/page.tsx`
- blog/search routes

The product/resource slugs in the DOCX feedback are not static pages. The repo has a dynamic Payload page route at `src/app/(frontend)/[slug]/page.tsx:46` and queries CMS pages by slug at `src/app/(frontend)/[slug]/page.tsx:94`, so these pages could exist in CMS/production. From static source, they are only verifiable as nav targets.

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
| Footer privacy link should use `https://www.fairlend.ca/en/brokerage/privacy-policy`. | Still valid. | Current footer points to local `/privacy` at `src/Footer/WatermelonFooter.client.tsx:89`. |
| Capitalize `FairLend`, not `Fairlend`. | Still valid in metadata/resources and some copy. | Examples: `src/app/(frontend)/page.tsx:14-16`, `src/app/(frontend)/fairlend-landing-hero/page.tsx:10-12`, `src/app/(frontend)/search/page.tsx:98`, `src/components/FairlendTestimonialsMarquee/index.tsx:13`. |
| Replace `FairLend Capital` with `FairLend Mortgage`. | Partially addressed. Active homepage does not appear to render `FairLend Capital`, but stale/legacy source still contains it. | Legacy services component has `FairLend` / `Capital` at `src/components/FairlendServicesSection/index.tsx:1805-1806`; active homepage imports different sections at `src/app/(frontend)/page.tsx:3-10`. |
| Phone/email requested in footer: `647-831-7605`, `elie@fairlend.ca`. | Still valid if those must be visible globally. | No direct match for those values in current scanned source. Footer only has booking/lead capture links at `src/Footer/WatermelonFooter.client.tsx:360-367`. |

## Website Changes Per Section (1).docx

Source DOCX paragraph refs: p001-p029.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Top-left brand should be FairLend Mortgage and hero tagline changed. Source p001-p002. | Mostly addressed for brand; old tagline is not present in active homepage. | Header logo aria label is `FairLend Mortgage home` at `src/Header/Component.client.tsx:41`; active hero H1 is `Financing for...` at `src/components/FairlendLandingHero/index.tsx:279-286`. |
| Use `Licensed` / `FSRA brokerage & administrator`. Source p004. | Addressed in footer disclosure; not necessarily in homepage proof strip. | Registration disclosure lists FSRA brokerage/admin licences at `src/components/FairlendRegistrationDisclosure.tsx:75-80`. |
| `$2B+` should be qualified as principal broker lifetime volume. Source p005, p009. | Addressed on hero proof strip. Leadership stat is broader and may still need wording if rendered as company-wide. | Hero uses `volume by principal broker` at `src/components/FairlendLandingHero/index.tsx:15-16`; leadership uses `Total financed` at `src/components/FairlendLeadershipSection/index.tsx:35-39`. |
| Replace `Top 1%` with `25+ Years / Broker Experience`. Source p006, p010. | Addressed in spirit; current copy says `28+` years experience. | `src/components/FairlendLandingHero/index.tsx:17-19`; `src/components/FairlendLeadershipSection/index.tsx:27-33`. |
| Replace investor card line with `Private-mortgage investing with the administration handled`; avoid `real estate-backed investing`. Source p007. | Still valid. | Current route selector says `real estate-backed investment opportunities` at `src/components/FairlendRouteSelector/route-data.tsx:33-35`. |
| MIC should be `Coming Soon`; current solicitation risk. Source p012-p017. | Still valid. | Homepage investor form includes a selectable `MIC` option at `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:424-449`; route selector CTA says `Explore investments` at `src/components/FairlendRouteSelector/route-data.tsx:42-44`. |
| Founder title should be `Founder & Principal Broker`, not broker of record. Source p019. | Mostly addressed; current visible title is `Principal broker`, but not `Founder & Principal Broker`. | `src/components/FairlendLeadershipSection/index.tsx:1166-1168`, `src/components/FairlendLeadershipSection/index.tsx:1221-1224`. |
| Replace mortgage consultant with `Builder/20+ homes built`. Source p022. | Not verifiable from current active source as phrased. | Leadership capability copy is role/capability based at `src/components/FairlendLeadershipSection/index.tsx:59-64`. |
| Pull the reviewer from this page. Source p023. | Not verifiable in repo. | No person-specific match found from static source scan beyond current leadership assets/copy. |
| Add `FairLend Management Inc` above brokerage/licence numbers. Source p025. | Addressed in shared footer. | `src/components/FairlendRegistrationDisclosure.tsx:7-10`; rendered by footer at `src/Footer/WatermelonFooter.client.tsx:260-269`. |
| Privacy policy should link to fairlend.ca brokerage privacy policy. Source p029. | Still valid. | Current footer link is `/privacy` at `src/Footer/WatermelonFooter.client.tsx:89`. |

## Multiplex Intake Form (1).docx

Source DOCX paragraph refs: p001-p016.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Missing licence numbers/footer on intake. Source p001, p016. | Addressed for `/intake` through shared layout/footer. | Layout renders footer for frontend routes at `src/app/(frontend)/layout.tsx:56`; footer renders registration disclosure at `src/Footer/WatermelonFooter.client.tsx:266-269`. |
| Replace FairLend Capital globally. Source p002. | Partially addressed; no active intake `FairLend Capital` found, but stale component source remains. | `src/components/FairlendServicesSection/index.tsx:1805-1806`. |
| Fillable fields need stronger visibility/contrast. Source p003. | Partially addressed. Generic intake fields use default input styles, while homepage hero form has explicit high-contrast styling. Build wizard field contrast should be visually checked before closing this. | Generic intake fields render plain `<Input />` at `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx:542-549`; homepage form field style is explicit at `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:68-75`; build intake address field at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1048-1060`. |
| MLI Select / broker referral / owner-builder grouping should be adjusted. Source p004-p005. | Still valid for the build intake defaults/options. | Build intake defaults include `Bridge to CMHC financing` and build-role/team fields at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:385-399`; option lists at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:438-453` and `src/components/DrawflowIntake/DrawflowIntake.client.tsx:514-526`. |
| Draft badge/top-right UI needs fixing. Source p006. | Still valid if the draft state is visible in the wizard UI; source persists drafts but no reviewed visual state was tested. | Draft persistence starts at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:646`; status type at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1779-1786`. |
| Replace headline/subcopy with requested `Bring the build file...` and `Good builds rarely stall...`. Source p007, p009. | Still valid if this copy is still expected on build intake; exact copy is absent from scanned source. | Current build intake hero CTA reads `Start project review` at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:925-929`; current property step subtitle is at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1041-1046`. |
| `I Understand` should be a checkbox for timestamp/legal evidence. Source p008. | Still valid; no matching `I Understand`/checkbox acknowledgement was found in scanned intake source. | Build intake routes through `DrawflowIntake` at `src/components/FairlendLeadIntake/FairlendIntakeRouter.client.tsx:13-15`; no `I Understand` match in scanned source. |
| Card copy/capitalization/image/check item/paragraph swaps. Source p010-p015. | Still valid where those build-intake sections exist; exact requested replacements are absent from scanned source. | DrawFlow/build intake content has milestone/draw copy around `src/components/DrawflowIntake/DrawflowIntake.client.tsx:207-251` and build intake options at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:438-453`. |

## multiplex-financing-gta (1).docx

Source DOCX paragraph refs: p001-p019.

Page status: not a static route. Nav points to it at `src/components/directional-hover-header/header/nav-data.ts:42`; dynamic CMS route may serve it via `src/app/(frontend)/[slug]/page.tsx:46-64`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p004, p019. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Header/footer injected at `src/app/(frontend)/layout.tsx:56`; footer registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| The page itself and all requested copy swaps. Source p005-p018. | Still valid for implementation/CMS content because no static page source exists and exact replacement copy is absent from scanned source. | Nav only: `src/components/directional-hover-header/header/nav-data.ts:42`; no static `src/app/(frontend)/multiplex-financing-gta/page.tsx`. |
| `FairLend` capitalization in page body. Source p009, p015, p018. | Still valid as a global cleanup and for CMS content. | Current static metadata/examples still use `Fairlend` at `src/app/(frontend)/page.tsx:14-16`; product page body not verifiable in repo. |
| Change `capital structure` to `capital architecture`, `Expected Rent Assumptions` to `Projected Rents`, and remove `lane` labels. Source p010, p013-p016. | Still valid for target page/CMS content. | Exact requested replacement terms were not found in scanned static `src` source. |

## garden-suite-financing-gta.docx

Source DOCX paragraph refs: p001-p029.

Page status: not a static route. Nav points to it at `src/components/directional-hover-header/header/nav-data.ts:39`; dynamic CMS route may serve it via `src/app/(frontend)/[slug]/page.tsx:46-64`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p004, p029. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Header/footer injected at `src/app/(frontend)/layout.tsx:56`; legal/licence disclosure at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Hero paragraph, equity/draw readiness paragraphs, no `Lane`, `WHO IT'S FOR`, `What the review pulls in`, `What kills a deal`. Source p005-p027. | Still valid for target page/CMS content because no static page source exists and exact replacement copy is absent from scanned source. | Nav only: `src/components/directional-hover-header/header/nav-data.ts:39`; no static `src/app/(frontend)/garden-suite-financing-gta/page.tsx`. |
| Capitalize `FairLend`. Source p028. | Still valid as a global cleanup and for CMS content. | Examples remain at `src/app/(frontend)/page.tsx:14-16` and `src/components/FairlendTestimonialsMarquee/index.tsx:13`. |

## construction-draw-financing.docx

Source DOCX paragraph refs: p001-p025.

Page status: not a static route. Nav points to it at `src/components/directional-hover-header/header/nav-data.ts:32`; dynamic CMS route may serve it via `src/app/(frontend)/[slug]/page.tsx:46-64`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/footer from landing page. Source p002, p023-p024. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Page-specific DrawFlow copy swaps. Source p004-p022, p025. | Still valid for target page/CMS content. Exact requested copy is absent from current static source. | Current related DrawFlow copy exists on homepage/build model at `src/components/FairlendBuildModelSection/index.tsx:316-390` and FAQ at `src/components/FairlendFaqSection/data.ts:108-123`, but not the requested target page. |
| `PROOF STAYS ATTACHED -- EVEN WHEN GPS DOESN'T`, location failure copy, audit events, draw groups. Source p017-p022. | Still valid if the construction draw page/DrawFlow page is implemented. | Current source has generic milestone/draw copy in `src/components/DrawflowIntake/DrawflowIntake.client.tsx:207-251`; exact replacement terms were not found. |

## cmhc-mli-select-multiplex-financing.docx

Source DOCX paragraph refs: p001-p016.

Page status: not a static route. Nav points to it at `src/components/directional-hover-header/header/nav-data.ts:31`; dynamic CMS route may serve it via `src/app/(frontend)/[slug]/page.tsx:46-64`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p003, p016. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Copy swaps: `Package the MLI Select File`, `THREE PATHWAYS TO MLI SELECT`, `Bring what changes the decision`, `Package the file before you chase pricing`, and `MLI Select` capitalization. Source p004-p015. | Still valid for target page/CMS content because no static page source exists and exact requested copy is absent from scanned source. | Nav labels exist at `src/components/directional-hover-header/header/nav-data.ts:128-130`; no static `src/app/(frontend)/cmhc-mli-select-multiplex-financing/page.tsx`. |

## affordable-sustainable-rental-housing.docx

Source DOCX paragraph refs: p001-p014.

Page status: not a static route. Nav points to it at `src/components/directional-hover-header/header/nav-data.ts:29`; dynamic CMS route may serve it via `src/app/(frontend)/[slug]/page.tsx:46-64`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Logo/FairLend Mortgage/universal nav/footer. Source p002-p003, p014. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Copy swaps: `Sustainable Housing`, `Capital for rentals built to last`, feasibility paragraph, `The Right Project Get Funded`, `From project inception to draw discipline`, operating cost, rental projects, projected rents. Source p004-p013. | Still valid for target page/CMS content because no static page source exists and exact requested copy is absent from scanned source. | Nav label/description exist at `src/components/directional-hover-header/header/nav-data.ts:133-135`; no static `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`. |

## garden-suite.docx

Source DOCX paragraph refs: p001-p008.

Page status: ambiguous. There is no static `/garden-suite` route; there is a `/garden-suite-financing-gta` nav target at `src/components/directional-hover-header/header/nav-data.ts:39`, and resource nav references garden suites at `src/components/directional-hover-header/header/nav-data.ts:48`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| FairLend Mortgage/logo/universal footer. Source p002-p003, p007. | Addressed globally for frontend layout; not verifiable inside CMS page content. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`. |
| Change `Can the lot carry it?` to `Can the ground support it?`. Source p004. | Still valid for target CMS/resource content; exact copy not found in static source. | No static `/garden-suite` route. |
| Eligibility intake form is illegible. Source p005. | Still valid pending visual QA of the relevant CMS/page form. Current generic intake fields are source-visible but no screenshot QA was run. | Generic intake field renderer at `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx:536-550`; build intake address field at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1048-1060`. |
| Capitalize `FairLend`; replace `geofence` with `GPS's`. Source p006, p008. | Still valid for target CMS/resource content; exact target copy not found in static source. | Global capitalization examples remain at `src/app/(frontend)/page.tsx:14-16`. |

## construction-draws-small-builders.docx

Source DOCX paragraph refs: p001-p008.

Page status: not a static route. Nav points to `/resources/construction-draws-small-builders` at `src/components/directional-hover-header/header/nav-data.ts:46` and uses it in the Builder guides menu at `src/components/directional-hover-header/header/nav-data.ts:232-238`; dynamic CMS/post content may serve it.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| Replace FairLend Capital, add universal nav/footer/licence numbers, capitalize FairLend. Source p002, p005-p008. | Addressed globally for frontend layout, still valid for the target resource/CMS content if it contains old copy. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; resource nav at `src/components/directional-hover-header/header/nav-data.ts:232-238`. |
| Card paragraph swaps about `capital between reimbursements` and interest ballooning. Source p003-p004. | Still valid for target resource/CMS content; exact requested copy is absent from scanned static source. | No static resource page source; only nav target is verifiable at `src/components/directional-hover-header/header/nav-data.ts:46`. |

## builder (1).docx

Source DOCX paragraph refs: p001-p008.

Page status: no static `/start/builder` route. Builder intake currently routes through `/intake?intent=build...` via `buildFairlendIntakeHref`.

| Feedback | Status | Relevant current reference |
| --- | --- | --- |
| FairLend Mortgage/logo/capitalization/universal footer. Source p002-p004, p006-p008. | Addressed globally for layout/footer; capitalization still has scattered static-source cleanup. | Layout/header/footer at `src/app/(frontend)/layout.tsx:56`; registration at `src/components/FairlendRegistrationDisclosure.tsx:7-10`; capitalization examples at `src/app/(frontend)/page.tsx:14-16`. |
| Form fields are not visible. Source p005. | Partially addressed; source has explicit field styling in homepage form, but the build intake wizard/generic intake should be visually checked before marking closed. | Homepage form field style at `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:68-75`; generic intake field renderer at `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx:536-550`; build intake address field at `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1048-1060`. |
| `/start/builder` page. Source p001. | Still valid only if that literal route is required. Current source uses `/intake` with intent params, not `/start/builder`. | `src/components/directional-hover-header/header/nav-data.ts:64-68` builds a builder-intake href; `/intake` route is `src/app/(frontend)/intake/page.tsx:11-12`. |

## Recommended Fix Order

1. Fix high-confidence static issues first:
   - Replace route selector investor language at `src/components/FairlendRouteSelector/route-data.tsx:33-35`.
   - Change or gate the `MIC` option at `src/components/FairlendLandingHero/FairlendApplicationForm.client.tsx:424-449`.
   - Update footer privacy link at `src/Footer/WatermelonFooter.client.tsx:89`.
   - Normalize visible `Fairlend` strings in metadata/resources/testimonial copy.

2. Decide whether the linked product/resource pages are CMS-only or should become static App Router pages. If CMS-only, apply the DOCX copy swaps in Payload content and verify the dynamic `[slug]` rendering.

3. Re-check form contrast visually for `/intake?intent=build` and generic `/intake` after copy/UI changes. The source suggests some explicit styling exists, but the DOCX complaint is visual and should not be closed from source inspection alone.

4. Clean stale source only if those components can still be rendered. `FairLend Capital` exists in `src/components/FairlendServicesSection/index.tsx:1805-1806`, but that component is not imported by the active homepage route.
