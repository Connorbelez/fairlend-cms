# FairLend agent-assisted origination

Status: proposed  
Date: 2026-07-15  
Scope: customer account creation, preliminary intake, indicative rates, consultation booking, and pre-approval handoff through ChatGPT and other agent clients

## Decision

Build a remote FairLend MCP server backed by a first-party, versioned application API. Use WorkOS AuthKit for customer identity and OAuth, and expose WorkOS Agent Registration / `auth.md` as an additional account-claim path when the environment supports it.

The product promise should be **agent-assisted intake**, not autonomous mortgage origination. An agent may explain products, calculate scenarios, create and update a user-owned draft, and book a consultation after confirmation. A user must explicitly claim the account and approve sensitive or consequential actions. A licensed FairLend professional remains responsible for suitability, any lender submission, and any representation that a rate is held or a mortgage is pre-approved.

## Why this fits the current system

FairLend already has most of the downstream workflow:

- `POST /api/leads` persists draft, started, and submitted leads and syncs them to Twenty.
- Lead IDs are stable UUIDs, and intake payloads already route mortgage, construction, investor, partner, consultation, and general inquiries.
- `POST /api/consultations/book` validates availability, creates a booking, mirrors it as a submitted lead, and syncs it to Google Calendar and Twenty.
- The construction intake already captures project stage, project costs, requested loan, equity, experience, project team, and permit information.
- Twenty already receives a normalized operational record and can remain the staff workflow surface.

The missing layer is a customer identity and authorization boundary. The Payload `Users` collection is currently admin-only, and the public lead endpoint has no borrower ownership model. The MCP server must therefore call a new first-party application service rather than expose or lightly wrap the existing public endpoints.

## Customer experience

Example conversation:

1. User: “Help me see whether FairLend could finance my Toronto laneway build.”
2. The agent calls public product and calculator tools and explains an illustrative range without collecting identity.
3. The user asks to save the scenario. The agent starts WorkOS `service_auth` using the user-provided email, or standard OAuth if the client does not support agent registration.
4. The user opens a FairLend-owned URL and signs in or signs up. The claim screen states which agent is requesting access, the requested permissions, and the exact draft it will create.
5. The agent creates a draft and fills only facts supplied or confirmed by the user. Every field records its source.
6. The agent returns a missing-information checklist and may obtain an indicative, conditional rate range based on self-attested information. No credit report is accessed.
7. The user explicitly confirms before the agent books a consultation or submits the completed file for FairLend review.
8. FairLend staff review the narrative and source evidence in Twenty. A licensed professional performs suitability and decides whether to issue or seek a pre-approval.

## Product vocabulary

These labels must not be collapsed into one “personalized rate” response.

| Label | Meaning | Agent may produce? |
| --- | --- | --- |
| Illustrative estimate | Calculator output using generic assumptions; not tailored lender pricing | Yes, anonymously |
| Indicative rate range | Conditional range based on user-entered facts and a dated pricing snapshot; not a quote, approval, or rate hold | Yes, after claim |
| Preliminary assessment | FairLend review of file fit and missing items; no lender commitment | Agent may request it; staff issues it |
| Pre-approval | Written preliminary analysis with maximum amount, rate, expiry, and conditions; not a funding guarantee | Licensed workflow only |
| Commitment | Lender-issued approval with transaction terms and conditions | Never generated or accepted by the agent |

Every estimate or range must return its assumptions, pricing timestamp, expiry, source/model version, fees included or excluded, and a plain-language status label.

## Architecture

```text
ChatGPT / Claude / other agent
        |
        | Streamable HTTP + OAuth bearer token
        v
api.fairlend.ca/mcp
        |
        +-- token validation, scopes, user/agent delegation, approvals
        +-- MCP tool schemas and safety annotations
        |
        v
FairLend Application Service (versioned domain API)
        |
        +-- customer/application ownership
        +-- consent and audit ledger
        +-- quote snapshots and decision labels
        +-- booking orchestration
        +-- idempotency and field provenance
        |
        +--> existing lead persistence --> Payload admin mirror --> Twenty
        +--> existing consultation service --> Google Calendar --> Twenty
        +--> rate/pricing adapters
        +--> encrypted document storage

WorkOS AuthKit
        +-- human sign-in/sign-up and account recovery
        +-- OAuth authorization server for MCP
        +-- optional Agent Registration and /auth.md claim flow
```

Keep the MCP layer thin. Business rules, consent checks, ownership, and audit requirements belong in the application service so the same behavior can later power the website portal, partner portal, mobile experience, and direct API integrations.

## Authentication and authorization

### Standard path

Implement the MCP authorization profile using OAuth and Protected Resource Metadata:

- `GET /.well-known/oauth-protected-resource`
- WorkOS authorization-server metadata
- PKCE for public clients
- audience-bound access tokens for the canonical MCP resource
- `WWW-Authenticate` challenges on `401` and incremental-scope challenges on `403`

The resource server must validate issuer, signature, expiry, audience/resource, scopes, and revocation state. Tokens must never be forwarded to another service.

### WorkOS `auth.md` path

When WorkOS enables Agent Registration for the FairLend environment:

- Reverse-proxy the generated WorkOS document at `https://fairlend.ca/auth.md`.
- Support `service_auth` first. The agent may initiate with an email, but receives no trusted application permissions until the user completes the FairLend-owned claim ceremony.
- Let the claim page offer sign-in or sign-up. The authenticated email must match the claimed email.
- Map the WorkOS registration subject to a FairLend customer and preserve the delegated user from the token `act` claim in every audit event.
- Do not enable useful anonymous write scopes in v1. Anonymous access should be limited to public product discovery and generic calculations that do not require a credential anyway.

Do not depend on the agent provider supporting WorkOS identity assertions. The user-claimed flow and standard OAuth path preserve interoperability.

### Initial scopes

| Scope | Capability |
| --- | --- |
| `products:read` | Public product requirements and educational content |
| `calculators:use` | Generic calculations with no stored personal data |
| `profile:read` | Read the claimed customer's basic profile |
| `applications:read` | Read user-owned applications and status |
| `applications:draft` | Create and update user-owned drafts |
| `rates:indicative` | Request a conditional range from self-attested data |
| `consultations:read` | Read available times and the user's bookings |
| `consultations:book` | Create or reschedule a booking after confirmation |
| `applications:submit` | Submit a completed draft to FairLend for human review after confirmation |
| `documents:write` | Request an upload slot and attach a document to a user-owned draft |

Credit authorization, lender submission, and commitment acceptance must not be represented as ordinary reusable scopes. They require a FairLend-hosted, purpose-specific consent or signature ceremony.

## MCP tool contract

### Public/read-only

- `get_product_catalog`
- `get_product_requirements`
- `calculate_payment_scenario`
- `calculate_construction_draw_scenario`
- `list_consultation_availability`

### Claimed account

- `get_my_profile`
- `list_my_applications`
- `get_application`
- `create_application_draft`
- `update_application_draft`
- `get_application_missing_items`
- `request_document_upload`
- `list_my_consultations`
- `get_application_status`

### Consequential writes

- `request_indicative_rate_range`
- `book_consultation`
- `reschedule_consultation`
- `submit_application_for_fairlend_review`

All writes accept an `idempotency_key`; updates use an application `version` for optimistic concurrency. Consequential tools return a preview containing the material facts and require the client to show an approval. The server also validates a short-lived `confirmation_token` minted from a FairLend-owned confirmation page for submission-grade actions.

MCP annotations should accurately declare read-only, additive/destructive, idempotent, and open-world behavior. An annotation is metadata, not an authorization control.

### Tools intentionally excluded from v1

- `pull_credit_report`
- `submit_to_lender`
- `issue_preapproval`
- `accept_commitment`
- `sign_disclosure`
- `transfer_funds`

The agent may prepare or explain these steps and link to the authenticated FairLend portal. It may not perform the user's signature, attest that facts are accurate, or substitute its own approval for the user's consent.

## Application data model

Twenty should remain an operational projection, not the security or customer-ownership system of record.

### `fairlend_customers`

- `id`
- `workos_user_id` (unique)
- verified email and contact channels
- identity-verification status
- created/updated timestamps

### `fairlend_applications`

- `id`, `customer_id`, and application type
- state: `draft`, `ready_for_review`, `submitted_for_review`, `under_review`, `more_information_required`, `preliminary_assessment_ready`, `preapproval_issued`, `closed`
- schema version and row version
- structured application payload
- completion/missing-items snapshot
- current FairLend lead ID and Twenty record references
- created/updated/submitted timestamps

### `fairlend_application_field_evidence`

- application ID and JSON pointer/field name
- value hash, not a second uncontrolled copy of sensitive values
- source: `user_statement`, `agent_transcription`, `uploaded_document`, `staff_entry`, `derived`
- supplied by user ID, agent registration ID, or staff ID
- source message/reference and timestamp
- user-confirmed timestamp

### `fairlend_consents`

- customer and application IDs
- purpose-specific consent type and version
- exact presented text hash
- granted/withdrawn timestamps
- actor, agent registration, IP/user agent where appropriate
- evidence artifact/signature reference

### `fairlend_rate_snapshots`

- application ID
- result label (`illustrative` or `indicative`)
- input snapshot hash and material assumptions
- candidate product/range data
- pricing source and rules/model version
- generated/expires timestamps
- staff-review status

### `fairlend_agent_audit_events`

- customer, application, WorkOS user, agent registration, and delegated actor IDs
- tool, normalized arguments hash, scope, outcome, and correlation ID
- confirmation/consent references
- before/after version references
- timestamp and retention class

### `fairlend_documents`

- application and customer ownership
- object-store key, MIME type, size, checksum, malware-scan state
- classification and extraction status
- upload actor and provenance
- retention/deletion state

Never put raw SINs, banking credentials, full credit reports, identity documents, or uploaded files into MCP tool results, logs, analytics, or Twenty free-text fields.

## Rate and preliminary assessment engine

Use a deterministic rules service before considering an LLM-driven recommendation engine.

1. Normalize verified/self-attested application facts.
2. Evaluate explicit product eligibility rules and data freshness.
3. Calculate payment/cost scenarios with versioned formulas.
4. Return zero or more conditional ranges with reason codes and missing facts.
5. Generate a human-readable explanation from structured result data; do not let an LLM invent pricing or eligibility.
6. Store the input/output snapshot and model/rules version.
7. Route exceptions or private/construction files to staff rather than forcing a score.

DrawFlow can become a particularly strong agent offering: a builder or borrower describes the project, the agent creates the construction draft, validates the budget/draw prerequisites, produces a draw-readiness checklist, and books a file review. Actual advance approval remains with FairLend/lender staff.

## Privacy, compliance, and safety gates

This is product architecture, not legal advice. FairLend's Principal Broker and privacy counsel should approve the final disclosures, consent text, record retention, advertising labels, and staff workflow before launch.

- A mortgage professional should not request a credit report without prior consent. Credit authorization needs a distinct, retained consent event; it must never be inferred from “continue” or from creating an account.
- Collect only information needed for the stated step. The account-claim screen must identify the agent, purpose, requested scopes, data uses, downstream disclosure, retention, and withdrawal path in plain language.
- Any indicative range must be clear, accurate, dated, assumption-based, and visibly not a pre-approval, commitment, rate hold, or guarantee.
- A true pre-approval is a staff/lender artifact with a maximum amount, rate, validity period, and conditions. It remains preliminary and does not guarantee funding.
- Suitability starts at first engagement. Preserve the facts collected, alternatives considered, missing information, rationale, and human review so the file can be re-performed.
- Mortgage-related public content and agent responses must use the brokerage's authorized name/licence disclosures and may not be false, misleading, or materially incomplete.
- Provide a user portal to review agent access, active registrations, applications, consents, documents, and audit history; allow token/registration revocation and consent withdrawal.
- Use rate limits, bot controls, prompt-injection-resistant tool descriptions, strict JSON schemas, output minimization, malware scanning, encrypted storage, and field-level redaction.
- Treat joint applications as multiple principals. Each person's data and credit consent must be separately authenticated and authorized.

## Implementation sequence

### Phase 0 — compliance and product contract

- Approve the vocabulary and disclosures above.
- Decide which customer segments enter v1: recommend construction/DrawFlow and private-mortgage preliminary intake first, without a credit pull.
- Confirm WorkOS Agent Registration availability and the consumer account/organization model.
- Define retention, deletion, breach response, and data-residency requirements.

### Phase 1 — identity and owned drafts

- Add AuthKit customer sign-in/sign-up and the customer/application ownership tables.
- Create the application service with idempotency, optimistic concurrency, field provenance, consent ledger, and audit events.
- Adapt current lead normalization/Twenty sync behind the service.
- Build a minimal authenticated portal to claim, inspect, correct, submit, and revoke.

### Phase 2 — remote MCP

- Implement Streamable HTTP MCP, Protected Resource Metadata, OAuth token validation, scopes, and tool annotations.
- Ship product/catalog, calculators, owned-draft, missing-items, status, availability, and booking tools.
- Require approval for all writes and a FairLend confirmation token for application submission.
- Add contract tests against at least ChatGPT and one independent MCP client.

### Phase 3 — WorkOS Agent Registration

- Enable `service_auth`; proxy the generated `/auth.md`.
- Add claim/sign-up UX, agent registration display, revocation, and delegated-actor audit capture.
- Run account-linking, email mismatch, replay, expired-claim, revoked-token, and confused-deputy tests.

### Phase 4 — conditional rates and review

- Connect versioned lender/pricing rules.
- Launch indicative ranges with assumption, expiry, disclosure, and audit snapshots.
- Add staff review and preliminary-assessment artifacts in Twenty/customer portal.
- Only later consider purpose-specific credit authorization and credit bureau integration.

## MVP launch criteria

- A new user can ask an agent to start, claim an account through FairLend, create a construction or mortgage draft, review/correct it, and see it in Twenty.
- The agent cannot read or alter another customer's application even with a known UUID.
- Replayed writes are idempotent; stale updates fail without overwriting newer facts.
- Booking cannot occur without a visible approval and produces one calendar event and one linked CRM record.
- Every stored field identifies whether it came from the user, the agent's transcription, a document, staff, or a calculation.
- No credit check, lender submission, pre-approval issuance, disclosure signature, or commitment acceptance is agent-callable.
- Revoking the agent blocks further access while preserving the required audit record.
- Indicative rates are reproducible from a stored rules version and input snapshot and cannot be mistaken for a held rate or approval.

## Current-source references

- WorkOS, [The auth.md file](https://workos.com/auth-md/docs/auth-md)
- WorkOS, [AuthKit Agent Registration](https://workos.com/docs/authkit/agent-auth)
- WorkOS, [auth.md for apps](https://workos.com/auth-md/docs/apps)
- Model Context Protocol, [Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- Model Context Protocol, [Tool annotations schema](https://modelcontextprotocol.io/specification/2025-11-25/schema)
- OpenAI API, [remote MCP tools and approval controls](https://platform.openai.com/docs/api-reference/responses)
- FSRA, [Mortgage application process](https://www.fsrao.ca/consumers/mortgage-brokering/mortgage-application-process)
- FSRA, [Mortgage brokerage disclosure requirements](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements)
- FSRA, [Mortgage industry advertising requirements](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-industry-public-relations-and-advertising-requirements)
- FSRA, [Documenting a suitability assessment](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/need-know-how-document-suitability-assessment)
- Office of the Privacy Commissioner of Canada, [Businesses and personal information](https://www.priv.gc.ca/en/privacy-topics/information-and-advice-for-individuals/your-privacy-rights/businesses-and-your-personal-information/)
- Ontario, [Consumer Reporting Act](https://www.ontario.ca/laws/statute/90c33)

