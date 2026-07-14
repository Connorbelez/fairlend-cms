# Twenty CRM integration

FairLend uses Twenty Cloud as the operator-facing CRM while the website database remains the durable lead-capture source. The integration has three explicit layers:

1. `integrations/fairlend-crm` is the version-controlled Twenty application and data model.
2. `src/lib/twenty/client.ts` mirrors website leads into Twenty without making lead capture depend on CRM availability.
3. `.codex/config.toml` exposes Twenty's native MCP server to Codex for CRM record and metadata operations.

## Data model

The app creates **Mortgage Lead**, **Consultation**, and **Campaign Touch** objects. Mortgage Lead is the normalized union of mortgage, construction, investor, partner, consultation, contact, newsletter, and route-helper intake payloads. It preserves the complete raw intake, address, and attribution JSON alongside operator-friendly normalized columns.

Mortgage Leads relate to Twenty's standard **Person**, **Company**, and **Opportunity** objects. Codex can qualify a raw lead, create or find the canonical CRM entities, and attach them without duplicating Twenty's native sales model.

The website owns capture fields such as contact details, requested amount, mortgage lane, intake payload, and attribution. Twenty owns workflow stage, priority, next action, Person/Company/Opportunity relations, and internal notes after initial creation. Website resubmissions deliberately do not overwrite those CRM-owned fields.

## Automatic lead capture and autofill

Every website intake that calls `upsertFairlendLead`—including `/api/leads`, autosaved Drawflow applications, contact/newsletter forms, mortgage applications, and consultation booking mirrors—immediately upserts the corresponding Twenty **Mortgage Lead** using the FairLend UUID as the stable record ID.

The first create autofills contact name, email, phone, structured and formatted address, source, intent, campaign attribution, capture state, workflow state, priority, next action, internal notes, mortgage classification, amount, timeline, project and financing details, normalized intake summary, and the complete raw intake/address/attribution payloads. Later autosaves refresh website-owned intake fields while preserving workflow state, priority, next action, internal notes, and CRM relations edited by the sales team.

Lead capture remains fail-open: the website database commits first, Twenty sync status and the remote ID are recorded in Payload, and a Twenty outage does not discard the submission. Run reconciliation for any `pending` or `failed` records.

## Credentials and roles

Create two role-scoped keys under **Twenty → Settings → APIs & Webhooks**:

- **FairLend website sync**: create/update/read access to Mortgage Leads only. Store this as `TWENTY_API_KEY` in the server/Vercel environment.
- **Codex CRM operator**: read/write access to Mortgage Leads, Consultations, Campaign Touches, People, Companies, Opportunities, Notes, and Tasks. Export this key as `TWENTY_API_KEY` in the shell that launches Codex.

Use a separate temporary deployment key with application/metadata permissions for `twenty plan` and `twenty apply` if the restricted website key cannot deploy the app. Do not commit a key or pass a real key directly on a command line that will be saved to shell history.

The app's generated function role has no record read, update, soft-delete, or destroy permissions. Add explicit object permissions only if a future Twenty logic function requires them.

## Install the Twenty application

```bash
cd integrations/fairlend-crm
corepack enable
yarn install --immutable

# Omit --api-key to use the interactive prompt.
yarn twenty remote:add --url https://api.twenty.com --as production
yarn twenty remote:use production
yarn twenty remote:status

yarn typecheck
yarn lint
yarn test:unit
yarn twenty plan
```

Review the complete plan. Apply only after confirming the target workspace and checking for destructive changes:

```bash
yarn twenty apply
```

Never use `--force` for a production workspace unless the destructive change and migration have been explicitly approved.

## Enable website-to-Twenty sync

Set the production environment variables only after the app schema is installed:

```dotenv
TWENTY_SYNC_ENABLED=true
TWENTY_API_URL=https://api.twenty.com
TWENTY_API_KEY=<role-scoped website sync key>
```

Apply the Payload migration before enabling sync:

```bash
pnpm payload:migrate
```

If Payload reports that the target database was previously pushed in dev mode and warns that migration data loss will occur, answer **no**. Do not force the migration. First inspect `fairlend_leads` for the four `twenty_*` columns and the two `fairlend_leads_twenty_*_idx` indexes; the runtime schema guard may already have applied this idempotent structure. Reconcile only after all six schema objects are present.

For Vercel production, configure the following variables in the project environment and leave them disabled in Preview so branch traffic cannot write into the live CRM:

```dotenv
TWENTY_SYNC_ENABLED=true
TWENTY_API_URL=https://api.twenty.com
TWENTY_API_KEY=<role-scoped website sync key>
```

Environment-variable changes take effect on the next production deployment.

Every new lead is persisted locally first. Twenty failures are recorded in the Payload **Twenty CRM Sync** panel and returned as a successful website submission, preventing a CRM outage from dropping a lead.

Backfill or retry non-synced leads after deployment:

```bash
TWENTY_RECONCILE_LIMIT=100 pnpm crm:twenty:reconcile
```

The reconciliation command is intentionally rate-limited to stay within Twenty Cloud's documented 100-request-per-minute limit.

## Drive the CRM from Codex

The repository config registers `https://api.twenty.com/mcp` and reads the bearer token from `TWENTY_API_KEY`. Restart Codex after exporting the operator key so the process inherits it, then verify:

```bash
codex mcp get twenty
codex mcp list
```

Safe first prompt:

```text
Use the Twenty MCP server. Inspect the available tools and the FairLend CRM schema.
Read only: list the five newest Mortgage Leads with workflow status, source,
requested amount, timeline, contact details, and related Person/Company/Opportunity.
Do not mutate anything.
```

Operational prompt:

```text
Use Twenty to find Mortgage Leads in NEW status. For each lead, check for an
existing Person by email before creating one, attach the Person to the lead,
create a follow-up task due next business day, and move the lead to
CONTACT_ATTEMPTED. Show a dry-run summary before executing writes.
```

Schema changes belong in `integrations/fairlend-crm`, validated and previewed with `yarn twenty plan`. Do not make ad hoc production metadata changes through MCP when the equivalent app declaration can be version-controlled.

## Failure handling

- `disabled`: `TWENTY_SYNC_ENABLED` is not `true`; local capture operates normally.
- `pending`: local persistence succeeded and the current request is attempting the mirror.
- `synced`: Twenty accepted the create/update; the remote ID and timestamp are stored.
- `failed`: Twenty rejected or timed out; a bounded error is stored without credentials or lead payloads.

Run reconciliation after correcting a key, permission, schema, or network problem. It only selects records whose sync status is not `synced`.
