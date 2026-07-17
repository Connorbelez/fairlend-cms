# Persona discovery booking pages

FairLend’s post-outreach discovery flow uses one statically rendered page shell and four persona-specific Microsoft Bookings services:

| Persona | Route | Microsoft Bookings service |
| --- | --- | --- |
| Partners | `/booking/partners` | `bWqqdoHUfEKW2zUNB-i24A2` |
| Lenders | `/booking/lenders` | `CCZlHqWodEWB1M6K7mPCKQ2` |
| Borrowers | `/booking/borrowers` | `8wIOUslWcEC-t5aOIrs0Qw2` |
| Builders | `/booking/builders` | `ohxdHFxKu0Ca57NU3hynVQ2` |

Each service is a public 30-minute online discovery call hosted by Elie Soberano. The customer cannot choose a staff member. Microsoft Bookings controls live availability, timezone selection, confirmation, rescheduling, and cancellation.

## Application architecture

- `src/app/(frontend)/booking/[bookingtype]/page.tsx` statically generates the four allowed routes and rejects unsupported slugs.
- `src/components/FairlendDiscoveryBooking/config.ts` is the typed source for persona copy, preparation, proof, objection paths, FAQ content, SEO metadata, and art direction.
- `src/components/FairlendDiscoveryBooking/DiscoveryBookingHero.tsx` owns the conversion-first booking dossier and embedded scheduler.
- `src/components/FairlendDiscoveryBooking/DiscoveryOfferSection.tsx` owns the persona elevator pitch and call agenda.
- `src/components/FairlendDiscoveryBooking/DiscoveryFaqSection.tsx` owns the persona FAQ shell; only the accordion leaf is client-rendered.
- `src/components/FairlendConsultationBooking/MicrosoftBookingsEmbed.client.tsx` is shared with the existing consultation dialog and owns loading, delayed, offline, retry, and external-open recovery.
- `src/lib/fairlend-bookings.ts` contains validated published defaults. Persona routes never silently fall back to the generic consultation calendar.

## Environment overrides

The published service URLs ship as application defaults. The four `NEXT_PUBLIC_MICROSOFT_BOOKINGS_*_URL` variables in `.env.example` are optional overrides. An override must be a published HTTPS service URL under `outlook.office.com/book/.../s/...`; placeholders, generic organization pages, and other hosts fail validation.

Because these are public Next.js variables, redeploy after changing one.

## Privacy and operational boundaries

- Microsoft begins loading the scheduler on the booking page and processes the scheduling details entered there.
- Visitors are told not to upload sensitive documents through Bookings. FairLend supplies a separate secure path if documents are required after the call.
- The page states that booking is not an approval, financing commitment, or capital commitment.
- FairLend privacy, regulatory, Microsoft privacy, email, phone, licence, reschedule, and cancellation paths remain available without depending on the iframe.
- The cross-origin iframe does not expose a reliable appointment-completion event to the page. Do not infer a confirmed booking from iframe `load`; use Microsoft calendar/CRM integration as the source of truth for completed appointments.

## Analytics

The four routes are classified as `page_type: booking` with the persona as `content_group`. Scheduler anchors, retries, and external Microsoft links use consent-gated delegated CTA tracking. Appointment confirmation remains intentionally untracked in the browser until Microsoft supplies a supported completion signal.

## Impeccable workflow record

The booking experience was shaped and crafted from the approved split-dossier reference, then processed through the full application pipeline before the individual page passes.

### Application pipeline

| Stage | Result |
| --- | --- |
| Clarify | Locked the experience to post-outreach, 30-minute persona discovery calls with the embedded scheduler as the primary action. |
| Distill | Reduced each route to one booking decision, four preparation items, three offer rows, a three-step call sequence, and six persona objections. |
| Typeset | Applied the project editorial display face to narrative headings and the sans-serif system to operational copy, controls, labels, and booking guidance. |
| Colorize | Kept the FairLend paper/ink/lime system; lime is reserved for conversion state, checked preparation, and selected emphasis. |
| Audit | Ran the dual-agent design-health review and deterministic anti-pattern scan. The archived pre-fix critique is in `.impeccable/critique/`. |
| Critique | Prioritized truthful proof, a calmer scheduler perimeter, immediate low-bandwidth escape paths, readable consequential prose, and stronger persona art. |
| Harden | Added URL validation, unsupported-slug rejection, offline/delayed/retry states, external booking, contact fallbacks, and explicit privacy/commitment boundaries. |
| Optimize | Preserved server rendering, limited client code to interactive leaves, kept lower sections text-only, and avoided loading persona artwork ahead of the scheduler. An estimated `content-visibility` optimization was removed after it caused fragment-position shifts. |
| Polish | Added focus handoff, reduced-motion behavior, responsive ledger labels, restrained route-signal motion, and directional CTA feedback. |

### Page pipeline

Every persona route uses the same conversion architecture but received a complete content, objection, proof, and FAQ pass.

| Route | Targeted offer | Primary objections handled | Distinctive page evidence |
| --- | --- | --- | --- |
| `/booking/partners` | A dependable financing extension for client scenarios outside a partner's normal mandate. | Client ownership, referral handoff, communication cadence, and protected relationships. | Partner-network language and an authored Toronto relationship skyline. |
| `/booking/lenders` | A disciplined origination channel for private capital mandates. | Deal fit, underwriting packages, approval control, reporting, and deployment preferences. | Capital-fit ledger and lender/investor engraving. |
| `/booking/borrowers` | A practical route through bank declines, timing pressure, and non-standard income or property situations. | Credit impact, fees, documentation, qualification, and whether booking creates an obligation. | Scenario-first copy and residential-property engraving. |
| `/booking/builders` | Financing strategy aligned to acquisition, construction, draw, and exit milestones. | Permits, equity, presales, cost-to-complete, draw administration, and execution timing. | Stage-gate call agenda and construction engraving. |

For each route, the page pipeline evaluated three structural alternatives per section. The selected system uses a focus-guided scheduler hero, numbered dossier ledger, and editorial FAQ split because those variants preserved the approved reference while improving recognition, mobile source order, and objection handling. Delight is intentionally functional: scheduler focus is signalled at the handoff, the offer CTA advances horizontally, and the FAQ contact CTA advances diagonally. All motion is disabled when reduced motion is requested.

### Route-by-route section ledger

Each route was processed in rendered order: booking hero and scheduler, offer ledger and call sequence, then persona FAQ. Every section completed polish, bolder, typeset, animate, overdrive, and delight before the next route began.

#### Partners

- **Polish:** tightened the scheduler promise around relationship ownership and made the external booking and contact escape paths immediately visible.
- **Bolder:** introduced “Relationship architecture,” protected-relationship ledger headings, and a working-agreement call sequence.
- **Typeset:** retained the editorial display/sans operational hierarchy while widening the FAQ title measure for the longer relationship language.
- **Animate:** preserved the short scheduler focus signal and directional progress cues with a complete reduced-motion fallback.
- **Overdrive:** compared a cinematic relationship montage, sticky collaboration brief, and focus-guided dossier for the hero; referral cards, a role map, and a numbered relationship ledger for the offer; and a chat transcript, terms matrix, and editorial accordion for FAQ. Selected the focus-guided dossier, relationship ledger, and editorial accordion.
- **Delight:** hero—availability handoff signal; offer—directional relationship progression; FAQ—client-ownership objection opens by default.
- **Gate:** partner artwork, client-ownership copy, referral boundaries, responsive ledger labels, and scheduler recovery paths verified.

#### Lenders

- **Polish:** made mandate fit, file quality, retained approval control, administration posture, and next diligence explicit at the decision point.
- **Bolder:** introduced “Capital-fit ledger,” lender-specific column language, and a mandate-fit call sequence.
- **Typeset:** kept dense underwriting language in the operational face and used the display face only for the decision hierarchy and questions.
- **Animate:** limited motion to the booking handoff, ledger direction, accordion transition, and CTA response.
- **Overdrive:** compared a live mandate dashboard, sticky lender brief, and focus-guided dossier for the hero; a loan-tape table, mandate scorecard, and origination ledger for the offer; and an underwriting memo, control matrix, and editorial accordion for FAQ. Selected the focus-guided dossier, origination ledger, and editorial accordion.
- **Delight:** hero—mandate-fit promise in the live-availability band; offer—standardization-to-lender progression; FAQ—approval-control objection opens by default.
- **Gate:** lender engraving, credit-control language, servicing scope, desktop ledger alignment, mobile labels, and zero runtime errors verified.

#### Borrowers

- **Polish:** clarified that booking is free, creates no application or credit inquiry, and should end with a realistic route or a clear reason not to proceed.
- **Bolder:** introduced “Scenario triage,” plain-language decision columns, and a document-or-decision call sequence.
- **Typeset:** kept consequential credit, cost, and confidentiality copy at body size while reserving compact uppercase labels for navigation and status.
- **Animate:** kept motion non-blocking and removed estimated offscreen rendering after it destabilized fragment positioning.
- **Overdrive:** compared a product carousel, eligibility wizard, and focus-guided dossier for the hero; mortgage comparison cards, a decision tree, and scenario-triage ledger for the offer; and a quote estimator, sales chat, and editorial accordion for FAQ. Selected the focus-guided dossier, scenario-triage ledger, and editorial accordion.
- **Delight:** hero—decision-quality promise in the scheduler band; offer—constraint-to-next-answer progression; FAQ—approval and credit-inquiry objection opens by default.
- **Gate:** residential artwork, fee/credit/approval boundaries, mobile section containment, deterministic fragment layout, and readable preparation copy verified.

#### Builders

- **Polish:** aligned the call promise with the current project stage and surfaced acquisition, permits, draws, working capital, takeout, equity, and obligation boundaries.
- **Bolder:** introduced “Project capital path,” stage-specific ledger headings, and a financing stage-gate sequence.
- **Typeset:** gave the project thesis editorial scale while keeping budgets, draws, permits, and guarantees in a compact operational register.
- **Animate:** retained only directional sequencing, scheduler focus, accordion disclosure, and CTA feedback.
- **Overdrive:** compared a project timeline, sources-and-uses stack, and focus-guided dossier for the hero; a milestone roadmap, draw waterfall, and project-capital ledger for the offer; and a diligence checklist, risk matrix, and editorial accordion for FAQ. Selected the focus-guided dossier, project-capital ledger, and editorial accordion.
- **Delight:** hero—project-stage promise in the scheduler band; offer—stage-gate progression; FAQ—fees, guarantees, and obligation objection opens by default.
- **Gate:** construction artwork, stage/draw/equity copy, desktop composition, mobile objection flow, and zero runtime errors verified.

### Shared completion-gate changes

- Added explicit border-box sizing and horizontal clipping to keep the three page-level regions viewport-bound regardless of global preflight order.
- Removed `content-visibility` and intrinsic-size estimates from the text-only lower sections after browser evidence showed unstable fragment jumps.
- Added persona-specific scheduler outcomes, offer eyebrows, ledger headings, meeting labels, FAQ titles, CTA labels, and featured objection IDs to the typed configuration contract.
- Preserved static generation and Server Components for the page shell; only the scheduler state, booking anchor focus, and accordion remain client leaves.
- Kept all persona imagery in optimized WebP assets with intrinsic dimensions, `next/image`, responsive sizes, and lazy loading behind the eager scheduler.

## Verification record

- Targeted ESLint passed for all changed TypeScript and TSX files.
- The Impeccable deterministic detector returned zero findings.
- `git diff --check` passed.
- All four local routes returned HTTP 200 with their persona title, exact Microsoft service ID, scheduler region, and FAQ structured data.
- A fresh no-emit TypeScript check found no booking-page errors. The repository still reports pre-existing nullable `redirects` and `headers` calls in `tests/int/technical-seo.int.spec.ts`.
- Per project instructions for marketing pages, no build, Playwright, end-to-end, or test-suite command was run.
