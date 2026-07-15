# CRM Follow-up Sales-Cycle Model

**Prepared for:** FairLend Partner Lead workflow  
**Date:** 2026-07-15  
**Research scope:** Twenty, Buildertrend, HubSpot, and Pipedrive official documentation

## Recommendation

Model a scheduled follow-up as a first-class **Follow-up Action** backed by Twenty's standard `Task` object and linked to a `Partner Lead` through `TaskTarget`. Treat the task as the system of record for execution. Keep only a denormalized **Next Follow-up Snapshot** on the lead for fast list filtering, sorting, and sales queues.

Do not collapse the schedule, method, requirements, assignee, and status into one lead text field. A follow-up has its own lifecycle, can recur an open-ended number of times, and must retain history. Twenty describes Tasks as action items with due dates, assignees, completion state, and links to CRM records; Buildertrend, HubSpot, and Pipedrive all use the same separate activity/task pattern. [Twenty: Objects](https://docs.twenty.com/user-guide/data-model/capabilities/objects), [Buildertrend: Lead Activities](https://buildertrend.com/help-article/lead-activities-overview/), [HubSpot: Create tasks](https://knowledge.hubspot.com/tasks/create-tasks?MKT=CMV), [Pipedrive: Activities](https://support.pipedrive.com/en/article/activities)

## What the official systems model

### Twenty

- Tasks are first-class to-dos that can be linked to records and carry due dates, assignees, and completion status. Twenty's documentation also explicitly supports Tasks as workflow-triggerable system objects. [Twenty: Objects](https://docs.twenty.com/user-guide/data-model/capabilities/objects), [Twenty: Workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers)
- Workflows can create, update, search, and upsert records. Upsert matching can use a field marked unique, which is the right primitive for retry-safe task generation. [Twenty: Workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)
- Scheduled workflows run in UTC. Delay steps can wait until a specific date/time or a date field, but the workflow fails if that scheduled date is already in the past. Search Records returns at most 200 records, so reconciliation must query bounded batches. [Twenty: Workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers), [Twenty: Workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)
- Twenty supports relations that point from Tasks to multiple record types, while its CSV importer does not support those polymorphic relations. FairLend should therefore create `TaskTarget` links through the API/workflow path, not a flat CSV import. [Twenty: Import relations](https://docs.twenty.com/user-guide/data-migration/capabilities/import-relations)

### Buildertrend

- Buildertrend stores Lead Activities separately and ties them to individual lead opportunities. Fields include activity type, activity date, start/end time, reminder, assigned user, attendees, initiator, location, and description. Activity types include Phone Call, Email, Meeting, Follow-up, and Website Form. The same object is used both to schedule future work and log completed history. [Buildertrend: Lead Activities](https://buildertrend.com/help-article/lead-activities-overview/)
- Activity templates preserve the timing between steps and rebase the sequence from an operator-selected start date. Activities are logged so the organization can evaluate what worked or failed in the sales process. [Buildertrend: Lead Activities](https://buildertrend.com/help-article/lead-activities-overview/)
- Buildertrend exposes scheduled lead tasks and follow-ups through a Lead Activity Calendar, reinforcing that activities are execution records rather than attributes of the lead. [Buildertrend: Glossary](https://buildertrend.com/help-article/buildertrend-glossary/)

### HubSpot

- HubSpot Task records include title, type, priority, associated records, assignee, queue, due date/time, reminders, and notes. It supports default due timing and reminds a user to create a new follow-up when a task is completed. It can also create a follow-up task while logging a call, email, note, or meeting. [HubSpot: Create tasks](https://knowledge.hubspot.com/tasks/create-tasks?MKT=CMV)
- HubSpot sequences apply business-day-aware timing and a selected timezone to follow-up email and task creation. This demonstrates that sequence timing and local business-day semantics should be explicit rather than inferred from a raw UTC timestamp. [HubSpot: Create and edit sequences](https://knowledge.hubspot.com/sequences/create-and-edit-sequences)

### Pipedrive

- Pipedrive Activities represent calls, meetings, tasks, emails, or custom types and link to people, organizations, leads, deals, or projects. The activity carries title, type, date/time/duration, owner, and notes. [Pipedrive: Activities](https://support.pipedrive.com/en/article/activities)
- Pipedrive computes a `Next activity date` from the next scheduled activity that is not done, while retaining separate last-activity and completion timestamps. That is direct precedent for FairLend's lead-level Next Follow-up Snapshot. [Pipedrive: Activities](https://support.pipedrive.com/en/article/activities)
- Pipedrive's automation templates include follow-up when a lead is added, re-engagement when a lead remains unchanged, and follow-up when an activity is marked done. [Pipedrive: Automation templates](https://support.pipedrive.com/en/article/workflow-automation-templates)

## FairLend canonical model

### 1. Follow-up Action — source of truth

Use Twenty's standard `Task` object, extended with FairLend-specific fields.

| Field | Type | Purpose |
|---|---|---|
| `title` | native text | Human-readable action, e.g. `First-touch email — Acme Homes` |
| `dueAt` | native datetime | Exact execution deadline stored as an ISO instant |
| `status` | native select | `TODO`, `IN_PROGRESS`, or `DONE` |
| `assignee` | native relation | Accountable FairLend owner |
| `bodyV2` | native rich text | Optional full operator brief and context |
| `fairlendTaskKey` | custom unique text | Deterministic idempotency key |
| `followUpMethod` | custom select | `EMAIL`, `LINKEDIN`, `PHONE`, `CONTACT_FORM`, `MEETING`, `RESEARCH`, `OTHER` |
| `followUpRequirements` | custom rich text/text | Exact information to request or verify, assets to send, CTA, and compliance guardrails |
| `followUpSequenceStep` | custom number | Stable sequence position for reporting and regeneration |
| `followUpOutcome` | custom select | Recommended: `NO_RESPONSE`, `REPLIED`, `MEETING_BOOKED`, `INFO_RECEIVED`, `NOT_INTERESTED`, `BAD_CONTACT`, `DO_NOT_CONTACT`, `OTHER` |

`followUpRequirements` should be executable, not a generic note. Recommended structure:

1. **Objective:** the intended result of this touch.
2. **Information requested:** the specific person, project, process, document, or qualification detail to obtain.
3. **Personalization hook:** lead-specific evidence to reference.
4. **Asset/offer:** the exact FairLend or DrawFlow material to provide.
5. **CTA:** one concrete next step.
6. **Guardrails:** verification and regulatory/claim constraints.
7. **Completion rule:** what must be recorded before marking the task done.

### 2. TaskTarget — canonical linkage

Create one `TaskTarget` record for each follow-up/lead association:

| Field | Purpose |
|---|---|
| `taskId` | Points to the Follow-up Action |
| `targetPartnerLeadId` | Points to the Partner Lead |
| `fairlendTaskTargetKey` | Recommended unique custom key for retry-safe linking |

This preserves Twenty's standard task timeline and avoids putting repeatable action history into the lead. The FairLend live workspace metadata inspected on 2026-07-15 exposes `Task.taskTargets` and `TaskTarget.targetPartnerLead`, which is the concrete implementation of Twenty's documented polymorphic Task-to-record relation.

### 3. Next Follow-up Snapshot — lead projection

Add or reuse these fields on `Partner Lead`:

| Field | Type | Projection rule |
|---|---|---|
| `nextActionAt` / label `Next Follow-up At` | datetime | Earliest `dueAt` among open linked follow-up Tasks |
| `nextAction` / label `Next Follow-up Objective` | text | Title/objective of that same Task |
| `nextFollowUpMethod` | select | Method of that same Task |
| `nextFollowUpRequirements` | text | Concise operator-ready requirements from that same Task |
| `nextFollowUpTaskKey` | text | Stable key of that same Task |
| `lastContactAt` | datetime | Most recent completed outbound/inbound contact timestamp |
| `lastContactSummary` | text | Outcome and salient response from the last completed touch |
| `followUpCount` | number | Count of completed follow-up actions |

Do not duplicate task status on the lead. It will drift. The snapshot must always be derived from the earliest open linked Task; when no open Task exists, clear it or immediately create the next task if the lead is still active.

## Automation rules

### A. Initial follow-up creation

Trigger when a Partner Lead is created or reaches an outreach-ready state. Twenty recommends `Record is Created or Updated` for records that may be manually created because its auto-save UI can fire creation before all fields are entered. [Twenty: Workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers)

1. Exit if the lead is closed, disqualified, duplicate, or do-not-contact.
2. Search for an open Task with the deterministic `fairlendTaskKey`.
3. Upsert the Task; do not blindly create it.
4. Upsert its TaskTarget link.
5. Recompute the lead's Next Follow-up Snapshot from the earliest open linked Task.

### B. “No active lead without a next task”

When a linked Follow-up Action is marked `DONE`:

1. Require `followUpOutcome` and an outcome summary.
2. Update `lastContactAt`, `lastContactSummary`, and `followUpCount`.
3. Branch by outcome:
   - `REPLIED`, `INFO_RECEIVED`, or `MEETING_BOOKED`: create the context-specific next action.
   - `NO_RESPONSE`: advance to the next cadence step and, where appropriate, change channel.
   - `BAD_CONTACT`: create a `RESEARCH` task to identify/verify the right contact.
   - `NOT_INTERESTED` or `DO_NOT_CONTACT`: close/suppress the cadence; create no outbound task.
4. Upsert the next Task and TaskTarget using deterministic keys.
5. Refresh the lead snapshot.

This follows the operational pattern exposed by HubSpot's follow-up task reminders, Buildertrend's activity templates, and Pipedrive's follow-up-on-completed-activity automations. [HubSpot: Create tasks](https://knowledge.hubspot.com/tasks/create-tasks?MKT=CMV), [Buildertrend: Lead Activities](https://buildertrend.com/help-article/lead-activities-overview/), [Pipedrive: Automation templates](https://support.pipedrive.com/en/article/workflow-automation-templates)

### C. Reconciliation and overdue handling

Run a scheduled reconciliation that:

- finds active leads without an open linked Follow-up Action;
- repairs stale Next Follow-up Snapshots;
- surfaces overdue tasks instead of attempting to delay until a past timestamp;
- partitions searches by status and due-date window so every query remains under Twenty's 200-record Search Records limit;
- reports tasks with missing owners, methods, or requirements.

### D. Outbound-send boundary

Automate internal task creation, queueing, reminders, and snapshot maintenance first. Do not make task scheduling synonymous with sending an email or message. Automated outbound communication should be a separate, explicitly enabled workflow with verified contact data, suppression checks, sender authorization, and approved copy. Twenty's Send Email workflow action currently sends from a mailbox synced to the executing user's own account and supports one recipient, another reason to keep execution tasks independent from outbound delivery. [Twenty: Workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)

## Time-zone and business-day rules

- Store `dueAt` as an absolute ISO-8601 instant and calculate it from the business timezone `America/Toronto`; never persist an ambiguous local time.
- Twenty's scheduled triggers run in UTC. A nominal 9:00 a.m. Toronto run is 13:00 UTC during EDT and 14:00 UTC during EST. Either maintain seasonally adjusted UTC schedules or run a bounded hourly reconciliation and check Toronto local date/time inside the workflow. [Twenty: Workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers)
- Define business-day behavior explicitly: skip Saturday/Sunday, and optionally Ontario statutory holidays. HubSpot's sequences make business-day timing and enrollment timezone explicit; FairLend should do the same. [HubSpot: Create and edit sequences](https://knowledge.hubspot.com/sequences/create-and-edit-sequences)
- If a calculated due time is already past, mark the task overdue or schedule the next valid business slot. Do not feed a past date to Twenty's Delay action because that run will fail. [Twenty: Workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)

## Idempotency and consistency

- Make `fairlendTaskKey` unique. Suggested deterministic input: `partner-lead:{fairlendLeadId}:sequence:{sequenceVersion}:step:{stepNumber}`. Add a cycle/attempt discriminator only when a repeated step is a legitimate new action.
- Make `fairlendTaskTargetKey` unique, derived from `{fairlendTaskKey}:{partnerLeadId}`.
- Use Twenty's Upsert action against the unique key for Task creation and linkage repair. Upsert is explicitly designed to update a match or create when absent. [Twenty: Workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)
- Recompute the lead snapshot after every Task create, reschedule, completion, deletion, or relink. The task remains authoritative if a projection write fails.
- Record `sequenceVersion` in the key or task metadata so changing cadence rules does not mutate completed history.
- Never overwrite completed tasks to represent a new follow-up. Create a new Task so historical timing and outcomes remain auditable.

## Sales views and operational controls

Create these Partner Lead views from the snapshot and linked tasks:

- **Due today:** active leads with `Next Follow-up At` in today's Toronto window.
- **Overdue:** active leads with `Next Follow-up At < now`.
- **No next task:** active leads with no open linked follow-up.
- **Research required:** next method `RESEARCH` or outcome `BAD_CONTACT`.
- **Awaiting reply:** last completed outcome `NO_RESPONSE` and a future follow-up exists.
- **Meetings / information requested:** method or requirements indicate a scheduled meeting or explicit data request.

Minimum health metrics:

- percentage of active leads with an open next task;
- overdue task count and median overdue age;
- completion rate by method and sequence step;
- reply/meeting/information-received rate by method;
- leads with missing owner, due date, method, or requirements;
- duplicate task-key or orphaned TaskTarget count (must remain zero).

## Implementation acceptance criteria

1. Every active Partner Lead has exactly one correctly projected next open Follow-up Action or an explicit suppression/closed reason.
2. Every Follow-up Action has a due datetime, method, assignee, status, requirements, unique key, and TaskTarget link.
3. Completing a task preserves it as history and generates or suppresses the next task according to outcome.
4. Re-running imports or workflows creates no duplicate Tasks or TaskTargets.
5. Toronto-local due queues remain correct across daylight-saving transitions.
6. Overdue timestamps are surfaced and repaired without passing a past value into a Twenty Delay action.
7. No outbound message is sent merely because an internal follow-up task becomes due.

