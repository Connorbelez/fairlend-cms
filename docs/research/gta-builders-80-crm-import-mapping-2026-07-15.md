# GTA builder CRM import mapping — approval contract

Prepared 2026-07-15 for exactly 80 net-new GTA builder prospects. This is the write contract for the production Twenty import. The preflight found zero matching `fairlendLeadId`, `fairlendTaskKey`, or `fairlendTaskTargetKey` records. All records are assigned to Connor Beleznay (`5dcb0871-7dfe-4fb5-b81d-5c674a143551`). No outbound message is sent by this import.

## Write order and idempotency

1. Upsert 80 Partner Leads in four batches of 20, matched by unique `fairlendLeadId`.
2. Upsert 80 native Tasks in four batches of 20, matched by unique `fairlendTaskKey`.
3. Resolve the resulting Partner Lead and Task record IDs.
4. Upsert 80 Task Targets in four batches of 20, matched by unique `fairlendTaskTargetKey` and linked with `taskId` + `targetPartnerLeadId`.
5. Patch each Partner Lead's `nextFollowUpTaskId` with the created Task record ID, leaving the Task as the source of truth.
6. Re-query all three objects and require exactly 80 unique records and 80 valid Task-to-Partner-Lead links.

## Partner Lead mapping

| Source / derivation | Twenty field |
|---|---|
| Builder name | `name`, `companyName` |
| UUIDv5 of normalized builder name | `fairlendLeadId` |
| Research verification timestamp | `capturedAt`, `verificationDate`, `companyVerifiedOn` |
| Fixed research corpus identifier | `source` |
| Constant `partner-prospect` | `intent` |
| Primary attributed decision-maker | `contactName` |
| Primary structured contact route | `email`, `phone`, `contactRoute` |
| Company website | `companyWebsite` |
| Contact page / form | `contactFormUrl` |
| All emails found on first-party pages | `allContactEmails` |
| All phones found on first-party pages | `allContactPhones` |
| Decision-maker, website, form, all emails/phones, geography | `publicContactSummary` |
| Service/contact geography | `contactLocations` |
| Geography + current build signal | `projectContext` |
| Early-file signal | `scenarioContext` |
| Current services/build signal + early-file involvement | `servicesSummary` |
| Activity evidence + current/representative builds + company notes | `buildPortfolioSummary` |
| Attributable company/build URLs | `buildPortfolioSourceUrls` |
| All research URLs | `sourceUrls`, `outreachDossierSources` |
| Company verification URLs | `companySourceUrls` |
| Company research dossier | `companyResearchNotes` |
| Decision-maker research dossier | `peopleResearchSummary` |
| UUIDv5 company identity key | `companyMatchKey` |
| Evidence-backed partnership hook | `primaryHook` |
| Fit rationale | `fitEvidence` |
| Published openness signal | `opennessSignal` |
| Recommended FairLend/DrawFlow offer | `proposedOffer` |
| Specific information/requested next step | `firstCta` |
| Claims and objections to avoid | `objectionsAndRisks` |
| Activity / build evidence | `activityRecencyNotes` |
| Personalized email plan and script | `outreachEmail` |
| Personalized LinkedIn plan and script | `outreachLinkedIn` |
| Personalized phone/form plan and script | `outreachPhoneAndForm` |
| Personalized follow-up sequence | `outreachFollowUps` |
| Lead-specific leave-behind | `outreachAsset` |
| Compliance and evidence guardrails | `outreachGuardrails` |
| Rank, fit score, and research region | `activationContext` |
| Scheduled Task due time | `nextActionAt` |
| Scheduled Task method | `nextFollowUpMethod` |
| Scheduled Task title | `nextAction` |
| Scheduled Task requirements | `nextFollowUpRequirements` |
| Scheduled Task deterministic key | `nextFollowUpTaskKey` |
| Resulting Twenty Task ID after Task upsert | `nextFollowUpTaskId` |
| Ranked research priority | `priority` |
| Research verification state | `companyVerificationStatus`, `primaryDecisionMakerStatus`, `activityRecencyStatus` |
| Presence of named decision-maker | `decisionMakerCount` |
| Connor Beleznay workspace member ID | `ownerId` |
| Constants | `captureStatus=SUBMITTED`, `workflowStatus=QUALIFIED`, `timestampProvenance=INFERRED_CREATED_AT`, `consultationMilestone=NONE`, `partnerCategory=BUILDER_PROFESSIONAL`, `partnershipStage=BUILDER_OUTREACH_READY`, `responseStatus=NOT_CONTACTED`, `lastContactChannel=NONE`, `proposalReviewStatus=NOT_STARTED`, `activationType=NONE`, `activationStatus=NOT_PROPOSED` |
| Verification state | `engagementHealth=ACTIVE` or `NEEDS_VERIFICATION` |
| Fit rank | `position` |

Existing raw evidence and outreach dossier fields in the manifest are preserved. Blank public values remain blank rather than being guessed.

## Follow-up Action (Task) mapping

| Manifest field / derivation | Twenty Task field |
|---|---|
| UUIDv5 of initial follow-up + Partner Lead key | `fairlendTaskKey` |
| `First-touch {method} — {builder}` or `Verify and qualify — {builder}` | `title` |
| Ten ranked actions per Toronto business day, beginning 2026-07-16 at 09:00 EDT, 15-minute spacing | `dueAt` |
| Constant | `status=TODO`, `followUpOutcome=PENDING`, `followUpSequenceStep=1` |
| `EMAIL`, `PHONE`, `CONTACT_FORM`, or `RESEARCH` from verified route/status | `followUpMethod` |
| Required outcome, exact information request, hook, asset, verification, capture requirements, and guardrails | `followUpRequirements` |
| Connor Beleznay workspace member ID | `assigneeId` |
| Fit rank | `position` |

Method distribution: 61 email, 7 phone, and 12 research/verification tasks. Verification tasks intentionally block outbound contact until the company, activity, or decision-maker evidence is revalidated.

## Task Target mapping

| Manifest field / derivation | Twenty Task Target field |
|---|---|
| UUIDv5 of Task key + Partner Lead key | `fairlendTaskTargetKey` |
| Task ID resolved by `fairlendTaskKey` | `taskId` |
| Partner Lead ID resolved by `fairlendLeadId` | `targetPartnerLeadId` |
| Fit rank | `position` |

## Validation gates

- Exactly 80 unique `fairlendLeadId` values.
- Exactly 80 unique `fairlendTaskKey` values.
- Exactly 80 unique `fairlendTaskTargetKey` values.
- Exactly 80 Partner Leads with service and build-portfolio summaries and sources.
- 115 attributable public email routes and 134 public phone routes retained; 22 leads have multiple emails and 35 have multiple phones.
- Zero pre-existing key collisions as of the approval preflight.
- Post-write verification must return exactly 80 leads, 80 tasks, 80 task targets, and 80 correct Task-to-Partner-Lead links.
