# Twenty CRM import mapping — 80 GTA MLI Select early-file professionals

Prepared 2026-07-15. This is the pre-write mapping for explicit approval. No Partner Lead, Task, or TaskTarget record is created by this generator.

## Record operations

| Manifest | Count | Twenty object | Idempotency key | Operation |
|---|---:|---|---|---|
| `mli-select-early-file-professionals-80-crm-manifest.json` | 80 | Partner Lead | `fairlendLeadId` | Upsert net-new qualified prospects |
| `mli-select-early-file-professionals-80-follow-up-manifest.json` | 80 | Task | `fairlendTaskKey` | Upsert initial scheduled follow-ups |
| same follow-up manifest | 80 | TaskTarget | `fairlendTaskTargetKey` | Upsert Task → Partner Lead targets after Partner Lead IDs resolve |

## Core mapping

| Research / manifest value | Twenty field |
|---|---|
| stable prospect UUID | `Partner Lead.fairlendLeadId` |
| company name | `name`, `companyName` |
| segment / professional lane | `partnerType`, `partnerRole` |
| exact MLI Select touchpoint, engagement stage, early-file artifacts, 10-point qualification | `scenarioContext`, `servicesSummary`, `fitEvidence`, `companyResearchNotes` |
| official service/project evidence | `projectContext`, `buildPortfolioSummary` |
| complete public contact routes | `email`, `phone`, `contactRoute`, `publicContactSummary`, `allContactEmails`, `allContactPhones`, `contactFormUrl`, `contactLocations` |
| company and evidence URLs | `companyWebsite`, `sourceUrls`, `companySourceUrls`, `buildPortfolioSourceUrls`, `outreachDossierSources` |
| target person/role research | `contactName`, `peopleResearchSummary`, `decisionMakerCount`, `primaryDecisionMakerStatus` |
| personalized positioning | `primaryHook`, `proposedOffer`, `firstCta`, `objectionsAndRisks` |
| channel scripts and sequence | `outreachEmail`, `outreachLinkedIn`, `outreachPhoneAndForm`, `outreachFollowUps`, `outreachAsset`, `outreachGuardrails` |
| research state | `verificationDate`, `companyVerifiedOn`, `companyVerificationStatus`, `activityRecencyStatus`, `activityRecencyNotes` |
| workflow | `partnerCategory=BUILDER_PROFESSIONAL`, `partnershipStage=BUILDER_OUTREACH_READY`, `responseStatus=NOT_CONTACTED` |
| owner | `ownerId=5dcb0871-7dfe-4fb5-b81d-5c674a143551` (Connor Beleznay) |
| scheduled first action | `nextActionAt`, `nextFollowUpMethod`, `nextAction`, `nextFollowUpRequirements`, `nextFollowUpTaskKey` |
| Task schedule | `Task.dueAt`, `status=TODO`, `followUpMethod`, `followUpRequirements`, `followUpOutcome=PENDING`, `followUpSequenceStep=1` |

## Scheduling and safety

- Due dates run from July 28 through August 6, 2026, ten prospects per Toronto business day, in 15-minute slots.
- No email, LinkedIn message, call, form submission, or calendar booking is sent by this import.
- Each follow-up requires current-route/title re-verification and records specific information to request.
- Client information may move only through an owner-authorized intake, secure link, or three-way introduction.
