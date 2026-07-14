# MBLAA / FSRA Advertising Compliance Audit

Date: 2026-07-08
Project: FairLend CMS
Scope: public-facing Next.js frontend routes in `src/app/(frontend)`, shared header/footer, and directly imported marketing/intake components.

This is an engineering compliance issue register, not a privileged legal opinion. It flags website advertising, public-relations-materials, privacy, CASL, and investor-marketing risks for review by the principal broker/compliance counsel.

## Regulatory Anchors

- O. Reg. 188/08, ss. 5-8: brokerage public relations materials must use authorized names, clearly and prominently disclose authorized name and licence number, and must not include false, misleading, or deceptive information.
- O. Reg. 187/08, ss. 7-10: individual broker/agent public materials must use licensed names, prescribed titles, and brokerage name/licence details.
- O. Reg. 191/08, s. 18: borrower-facing advertising that includes an interest rate, payment amount, or non-interest charge must include APR and term with at least equal prominence.
- FSRA advertising guidance: public relations materials must clearly display authorized name and licence number; FSRA does not pre-approve advertising; brokerages must review/approve their own materials.
- Adjacent regimes checked: CASL, PIPEDA, Competition Act misleading/performance claims, and securities/MIC public-solicitation boundary.

Official source links:

- https://www.ontario.ca/laws/regulation/080188
- https://www.ontario.ca/laws/regulation/080191
- https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-industry-public-relations-and-advertising-requirements
- https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/dont-overpromise-your-mortgage-investment-advertisements

## Pages Reviewed

Static public pages:

- `/`
- `/affordable-sustainable-rental-housing`
- `/borrowers/private-mortgage-financing`
- `/cmhc-mli-select-multiplex-financing`
- `/construction-draw-financing`
- `/en/brokerage/privacy-policy`
- `/fairlend-landing-hero`
- `/garden-suite`
- `/garden-suite-financing-gta`
- `/intake`
- `/investing/private-mortgage-lending`
- `/multiplex-financing-gta`
- `/partners`
- `/resources/construction-draws-small-builders`
- `/search`
- `/start/builder`

Dynamic/CMS-backed public pages:

- `/[slug]`
- `/posts`
- `/posts/[slug]`
- `/posts/page/[pageNumber]`

System/public routes checked for marketing relevance:

- `/pages-sitemap.xml`
- `/posts-sitemap.xml`
- `/r/[campaign]`
- `/api/leads`
- `/api/consultations/book`
- `/api/consultations/availability`
- address autocomplete/details API routes
- preview/seed routes

Important limitation: dynamic Payload CMS page/post bodies were not available as rendered production content in this static code review. The route shells and shared renderers were reviewed, but final compliance signoff should include a live crawl or CMS content export.

## Executive Summary

The site is materially better than most mortgage marketing sites because it has a global footer licence disclosure and several honest risk/approval qualifiers. That said, there are nine issues to fix before treating the site as compliance-ready:

1. Licence/status inconsistency: the footer advertises an active brokerage licence while the privacy policy says the brokerage licence has only been applied for.
2. `FairLend Mortgage` trade-name/DBA usage needs verification against FSRA authorized names.
3. Investor pages publicly market mortgage investment opportunities in a way that approaches securities/MIC solicitation territory.
4. Borrower copy previously included a numeric payout-fee claim without APR/term analysis under O. Reg. 191/08 s. 18; runtime copy now uses qualitative low-payout-fee language.
5. Newsletter email capture needed CASL express-consent language at the collection point; runtime footer copy now includes it.
6. Intake/consultation forms needed stronger collection-point privacy/consent disclosure; runtime forms now include it.
7. Several absolute or performance-style claims need substantiation or tighter qualifiers.
8. Dynamic CMS pages/posts need a mandatory publishing compliance gate.
9. Investor/offering-adjacent copy needs principal broker and securities counsel review before publication.

## Findings

### MBLAA-001 - Licence Status Contradiction Across Public Materials

Severity: Critical
Classification: likely contravention risk / misleading public relations material

Evidence:

- `src/components/FairlendRegistrationDisclosure.tsx:6-10` sets:
  - `legalName: 'Fairlend Management Inc.'`
  - `doingBusinessAs: 'FairLend Mortgage'`
  - `brokerageLicence: '13827'`
  - `administratorLicence: '13828'`
- `src/Footer/WatermelonFooter.client.tsx:269-273` renders that licence disclosure in the global footer.
- `src/app/(frontend)/layout.tsx:51-53` wraps frontend pages in `FrontendChrome footer={<Footer />}`, so the disclosure appears site-wide.
- `src/app/(frontend)/en/brokerage/privacy-policy/page.tsx:39` says FairLend "is a licensed mortgage administrator and has applied for a mortgage brokerage licence."
- `src/app/(frontend)/en/brokerage/privacy-policy/page.tsx:51` repeats that FairLend "has applied to FSRA for a mortgage brokerage licence" and says brokerage activities begin once operative.

Why this matters:

If licence `13827` is active and belongs to Fairlend Management Inc. / an authorized brokerage name, the privacy policy is stale and misleading. If the brokerage licence is not active, the footer and broad brokerage marketing are a more serious problem because public materials are holding out brokerage status.

Required fix:

- Confirm the live FSRA registry status for licence `13827` and `13828`.
- Make the footer, privacy policy, schema/metadata, and all page copy use one current status.
- If the brokerage licence is active, remove "has applied for a mortgage brokerage licence" and "once operative" language from the privacy policy.
- If it is not active, remove brokerage licence display and stop using brokerage-service claims until licensed/authorized.

Suggested replacement if active:

> Fairlend Management Inc. is licensed by FSRA as a mortgage brokerage and mortgage administrator in Ontario. FairLend collects, uses, and discloses personal information in connection with mortgage brokerage, mortgage administration, and related inquiry-handling activities.

### MBLAA-002 - Authorized Name / DBA Verification Required

Severity: High
Classification: authorized-name risk

Evidence:

- `src/components/FairlendRegistrationDisclosure.tsx:7-10` distinguishes legal name `Fairlend Management Inc.` from DBA `FairLend Mortgage`.
- `src/Footer/WatermelonFooter.client.tsx:196` labels the logo link "FairLend Mortgage home."
- Multiple page titles and headings use `FairLend Mortgage`, including `src/app/(frontend)/garden-suite-financing-gta/page.tsx:8`, `src/app/(frontend)/intake/page.tsx:6`, and borrower/investor page components.

Why this matters:

O. Reg. 188/08 s. 5 requires a brokerage to carry on business only in an authorized name. A business-name registration or brand preference is not enough by itself. If `FairLend Mortgage` is not an FSRA-authorized name for the brokerage, the site should not present it as the operating mortgage-business name.

Required fix:

- Verify whether `FairLend Mortgage` is an FSRA-authorized name for licence `13827`.
- If authorized, preserve the current "legal name operating as DBA" pattern and keep it prominent.
- If not authorized, replace mortgage-business references with the authorized name, or complete the FSRA authorized-name process before using the DBA.

### MBLAA-003 - Investor Page Approaches Public Solicitation / Securities Boundary

Severity: High
Classification: high-risk practice / securities and MBLAA advertising risk

Affected page:

- `/investing/private-mortgage-lending`

Evidence:

- `src/components/FairlendInvestorHero/index.tsx:62-71` previously used noncompliant asset-backing framing; the production copy now uses "Private mortgage investing" and "private mortgage opportunities."
- `src/components/FairlendInvestorHero/index.tsx:74-84` uses CTAs "Request Investor Access" and "See the protection framework."
- `src/components/FairlendInvestorHero/index.tsx:101-109` displays experience/performance-like stats `~$2B funded` and `~30 yrs GTA`.
- `src/components/FairlendInvestorOpportunities/index.tsx:50-58` says users review a short list of opportunities already cleared through underwriting and documentation.
- `src/components/FairlendInvestorOpportunities/index.tsx:76-97` shows an illustrative deal with `Loan $420,000`, `LTV 68%`, `Term 12 mo.`, and first position.
- `src/components/FairlendInvestorOpportunities/index.tsx:118-123` CTA label is "Review Opportunities."
- `src/components/FairlendInvestorFaq/index.tsx:60-63` references "whole, syndicated, fractional, first, second, construction financing, or future MIC where appropriate."

Mitigating copy already present:

- `src/components/FairlendInvestorHero/index.tsx:88-90` says private mortgage investments involve risk and are not guaranteed-return products.
- `src/components/FairlendInvestorOpportunities/index.tsx:113-116` says the example is subject to review and not a current offer.
- `src/components/FairlendInvestorFaq/index.tsx:12-31` includes useful risk and liquidity disclaimers.

Why this still matters:

The page is public and reads like a funnel to mortgage investment opportunities. MIC shares, syndicated/fractional mortgage investments, and public investment-return marketing can trigger securities-law obligations in addition to MBLAA advertising standards. Even where the MBLAA permits mortgage investment brokering, public copy should avoid functioning as a public offering page.

Required fix:

- Add a prominent above-the-fold investor-risk and eligibility disclaimer before the CTA, not only below.
- Replace "Review Opportunities" with "Request Investor Suitability Review" or "Request Investor Information."
- Add gating language: opportunities are available only after eligibility/suitability review and required disclosure documents.
- Confirm all investor opportunity copy is consistent with any offering memorandum, exempt-market process, and brokerage compliance manual.
- Substantiate `~$2B funded`, `~30 yrs GTA`, "curated", and "pre-vetted" claims in an internal evidence file.

Suggested safer CTA/copy:

> Request Investor Suitability Review

> Private mortgage investments involve borrower, property, market, legal, liquidity, and recovery risk. Information is provided only after eligibility and suitability review and required disclosures. This page is not an offer to sell securities or a commitment to present any specific mortgage investment.

### MBLAA-004 - Numeric Fee Claim May Trigger O. Reg. 191/08 Advertising Disclosure

Severity: Remediated in runtime copy; retain for compliance tracking
Classification: possible cost-of-borrowing advertising contravention if numeric fee claims return

Affected page:

- `/borrowers/private-mortgage-financing`

Evidence:

- Borrower-facing copy references rate, broker/lender fees, administration charges, renewal considerations, payout terms, default charges, closing costs, and material risks.
- Runtime copy has been revised to use qualitative "low payout fees" phrasing rather than a concrete fee amount.

Why this matters:

O. Reg. 191/08 s. 18 is triggered when borrower-facing mortgage advertising includes an interest rate, payment amount, or amount of a non-interest charge. Numeric fee amounts should not be reintroduced without legal/compliance review for APR/term implications.

Required fix:

- Keep payout-fee claims qualitative unless compliant APR/term/representative-example disclosure is added after compliance review.
- Keep material conditions near the claim.

Suggested safer copy:

> Where the structure allows it, FairLend works to keep payout fees low so leaving for better financing is not treated as the expensive option. Payout terms, lender fees, brokerage fees, legal costs, and other charges should be reviewed before you commit.

### MBLAA-005 - Newsletter Capture Needs CASL Consent Language at Collection Point

Severity: Remediated in runtime footer; verify email-platform unsubscribe implementation separately
Classification: CASL / privacy compliance gap

Affected pages:

- All frontend pages with global footer newsletter form

Evidence:

- The footer newsletter form posts email to `/api/leads` with `intent: 'newsletter'`, `list: 'market-updates'`, consent text/version, and submission timestamp.
- The form now displays collection-point consent language identifying market updates, unsubscribe availability, and the Privacy Policy link.
- The privacy policy has opt-out language at `src/app/(frontend)/en/brokerage/privacy-policy/page.tsx:205`, but CASL express consent should be obtained with the required information at or before signup.

Why this matters:

The form requests commercial electronic messages. Runtime copy now discloses the purpose and unsubscribe availability at signup; sent emails must still include required sender identification and unsubscribe mechanics.

Required fix:

- Keep consent text immediately under the footer newsletter field.
- Preserve consent metadata with the lead: consent text/version, timestamp, source page, IP/user agent if appropriate, and whether express consent was captured.
- Ensure sent emails include unsubscribe and sender identification.

Suggested copy:

> By submitting, you agree to receive FairLend market updates by email. You can unsubscribe at any time. See our Privacy Policy.

### MBLAA-006 - Intake and Consultation Forms Need Stronger Collection-Point Privacy Disclosure

Severity: Remediated in runtime forms; verify any future lead forms use same pattern
Classification: PIPEDA / fair-treatment / recordkeeping gap

Affected pages:

- `/intake`
- `/borrowers/private-mortgage-financing`
- `/start/builder`
- Any CTA flow that posts to `/api/leads`

Evidence:

- `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx:394-431` posts name, phone, email, address, amount, role, timeline, and request details to `/api/leads`.
- `src/components/FairlendBorrowerConsultation/ConsultationForm.client.tsx:132-155` posts name, phone, email, address/city, property value, mortgage balance, amount needed, timeline, situation type, and notes.
- Generic intake and borrower consultation forms now include submit-adjacent collection-point disclosure with a Privacy Policy link and no-approval/no-commitment language.
- `src/components/DrawflowIntake/DrawflowIntake.client.tsx:1441-1451` includes an acknowledgement that FairLend will use the information to review the project and respond.

Why this matters:

The privacy policy exists, and users should continue to see collection purpose, privacy-policy link, and consent/acknowledgement near the submit action when providing mortgage-related financial information.

Required fix:

- Keep a submission-adjacent privacy notice on each lead/intake form.
- Link to `/en/brokerage/privacy-policy`.
- For higher-sensitivity intake flows, require an explicit checkbox acknowledging use of information for review/follow-up and that submission is not approval or commitment.

Suggested copy:

> FairLend will use this information to review your request, respond, and identify relevant next steps. Submission is not an approval or financing commitment. See our Privacy Policy.

### MBLAA-007 - Absolute Security / Sharing Claim Conflicts With Privacy Policy

Severity: Remediated in runtime builder intake; retain rule for future copy
Classification: misleading privacy/security claim risk

Affected page:

- `/start/builder`

Evidence:

- Builder intake copy now says information is protected and used only to review the request, respond, and take permitted next steps under the Privacy Policy.
- Privacy policy `src/app/(frontend)/en/brokerage/privacy-policy/page.tsx:218+` permits sharing with authorized agents and service providers, and line `222+` begins financial-institution/credit sharing language.

Why this matters:

Absolute "never shared" language conflicts with ordinary service-provider, lender, credit, legal, and regulatory sharing described in the privacy policy. Future copy should keep security/privacy statements qualified.

Required fix:

- Keep the qualified privacy statement and avoid future "never shared" claims.

Suggested safer copy:

> Your information is protected and used only to review your request, respond, and take permitted next steps under our Privacy Policy.

### MBLAA-008 - Performance / Substantiation Claims Need Evidence File

Severity: Medium
Classification: Competition Act / misleading representation risk

Affected pages/components:

- `/investing/private-mortgage-lending`
- `/intake?intent=invest`
- `/borrowers/private-mortgage-financing`
- `/start/builder`

Evidence:

- `src/components/FairlendInvestorHero/index.tsx:101-109`: `~$2B funded`, `~30 yrs GTA`.
- `src/components/FairlendInvestorHero/index.tsx:14-20`: "Curated, pre-vetted deals", "Target LTVs under 75%", "Double valuation review", "Power-of-sale recovery path", "Dedicated legal recovery team."
- `src/components/FairlendInvestorOpportunities/index.tsx:128-131`: "Decades of GTA pattern recognition" and "curated, pre-vetted, and fully documented."
- `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx:250-254`: "Target LTVs under 75% with double valuation review", "Registered first-mortgage position", "Dedicated legal recovery path."
- `src/components/FairlendLeadIntake/FairlendLeadIntake.client.tsx:211-216`: "Same day commitments available", "No hidden fees", "Complimentary exit planning."
- `src/components/DrawflowIntake/DrawflowIntake.client.tsx:864-866`: "Strong returns."

Why this matters:

Performance, experience, availability, fee, and investor-protection claims must be supportable. "Same day commitments available" and "Strong returns" are especially vulnerable if consumers/investors can interpret them as typical outcomes.

Required fix:

- Maintain a substantiation file for each claim: metric source, date range, entity, calculation method, exclusions, and approval owner.
- Qualify availability claims.
- Remove or soften claims that cannot be substantiated.

Suggested safer copy examples:

- "Same day commitments may be available for complete files, subject to lender review, valuation, documentation, borrower capacity, and available capital."
- "Projected return profile depends on rent assumptions, costs, leverage, timing, and market conditions."
- "Target LTVs are underwriting guidelines, not guarantees of availability, performance, or loss protection."

### MBLAA-009 - Dynamic CMS Content Needs Mandatory Compliance Gate

Severity: Medium
Classification: process/control gap

Affected routes:

- `/[slug]`
- `/posts`
- `/posts/[slug]`
- `/posts/page/[pageNumber]`

Evidence:

- `src/app/(frontend)/[slug]/page.tsx` renders arbitrary Payload page blocks through `RenderBlocks`.
- `src/app/(frontend)/posts/[slug]/page.tsx` renders CMS post content.
- The static code shell has global footer disclosure, but no code-level evidence that CMS content is reviewed for rate/APR triggers, licence/title references, investor claims, CASL forms, or FSRA-required public-relations-materials disclosures before publication.

Why this matters:

CMS pages and blog posts are public relations materials. A compliant shell does not prevent a CMS editor from publishing an unqualified rate, a "guaranteed approval" claim, an unsubstantiated investor return, or an incorrect broker/agent title.

Required fix:

- Add a CMS publishing checklist/workflow for regulated claims.
- Add editorial linting for prohibited/high-risk phrases: guaranteed approval, lowest/best rates, rates from, payment from, APR, no fees, secure returns, risk-free, FSRA-approved, government-approved, guaranteed returns.
- Require principal broker/compliance signoff for pages/posts containing mortgage rates, fees, private mortgage investments, investor returns, individual broker/agent names, or licence claims.

## Page-by-Page Status

| Page | Status | Notes |
| --- | --- | --- |
| `/` | Review required | Global footer disclosure applies; homepage/components should be checked in live crawl for claims not visible in static route scan. |
| `/affordable-sustainable-rental-housing` | No major page-specific issue found | Uses suitability-style qualifiers, e.g. financing subject to underwriting and available capital. |
| `/borrowers/private-mortgage-financing` | Runtime copy remediated | Numeric payout-fee claim replaced with qualitative low-payout-fee language; approval/rate/fee copy otherwise generally well-qualified. |
| `/cmhc-mli-select-multiplex-financing` | No major page-specific issue found | Under-construction/empty-state page based on static route import. |
| `/construction-draw-financing` | No major page-specific issue found | Draw approval/timing language appears operational and qualified. |
| `/en/brokerage/privacy-policy` | Issue found | Licence-status contradiction; otherwise useful consent/withdrawal/unsubscribe language exists. |
| `/fairlend-landing-hero` | Review required | Landing hero should be included in live rendered crawl before publication. |
| `/garden-suite` | No major page-specific issue found | Contains useful licence-footer reference and underwriting qualifiers. |
| `/garden-suite-financing-gta` | No major page-specific issue found | Qualifies review around property, borrower liquidity, and draw timing. |
| `/intake` | Issue found | Needs stronger privacy/consent notice at submission; investor-intent path contains substantiation-sensitive claims. |
| `/investing/private-mortgage-lending` | Issue found | Investor-marketing/securities boundary, performance claims, opportunity language. |
| `/multiplex-financing-gta` | No major page-specific issue found | No rate/APR or guarantee issue found in static scan. |
| `/partners` | Review required | Partner/referral pages can create role/disclosure risk; static scan did not show a major issue, but partner program copy should be reviewed for referral/compensation claims. |
| `/resources/construction-draws-small-builders` | No major page-specific issue found | Resource placeholder/empty state in static route. |
| `/search` | No major page-specific issue found | Search shell/archive rendering only; results depend on indexed CMS content. |
| `/start/builder` | Issue found | "Never shared" privacy claim; "Strong returns" substantiation concern; intake acknowledgement is directionally good. |
| `/[slug]` | CMS compliance gate required | Dynamic Payload page content not fully reviewable from static shell. |
| `/posts` | CMS compliance gate required | Archive shell only; post content needs publishing review. |
| `/posts/[slug]` | CMS compliance gate required | Dynamic post body content not fully reviewable from static shell. |
| `/posts/page/[pageNumber]` | CMS compliance gate required | Archive pagination shell only; post content needs publishing review. |

## Positive Controls Already Present

- Global footer renders legal name, DBA, brokerage licence number, administrator licence number, FSRA verification link, and privacy link.
- Borrower page expressly says approval is not guaranteed and private mortgage financing is not risk-free.
- Investor FAQ includes strong risk, liquidity, and no-guarantee language.
- Builder intake final acknowledgement says submission is not a funding approval or commitment.
- Privacy policy includes right-to-withdraw-consent and unsubscribe/opt-out language.

## Recommended Fix Order

1. Resolve licence/status contradiction and authorized-name verification.
2. Add CASL/privacy collection-point notices to newsletter, intake, consultation, and builder forms.
3. Rewrite investor page CTAs and disclaimers to avoid public-offering feel.
4. Keep numeric payout-fee claims out of borrower copy; remove or qualify "Strong returns" and "Same day commitments available."
5. Create a substantiation register for all performance/availability/protection claims.
6. Add CMS publishing compliance gate for dynamic pages/posts.

## Verification Notes

- No Playwright, E2E, or build was run, in line with project instructions for marketing-page work.
- This audit used static source review plus official Ontario/FSRA public sources. A production-ready compliance signoff should add a live crawl of the deployed site and a CMS export review.
