# Automated sales cycle and phone alert options

Research date: 2026-07-14

## Executive recommendation

Build a deterministic **human-outreach control loop** around Twenty Tasks and the existing FairLend intake sync:

1. A submitted intake is scored, assigned and given an explicit SLA.
2. The system creates exactly one linked next-action Task with an assignee, due time and call brief.
3. The assigned person immediately receives a concise Telegram alert with `Call`, `Email` and `Open in Twenty` actions.
4. Completing the Task or changing the application stage generates the next appropriate Task.
5. A scheduled sweep escalates overdue or untouched records and sends each salesperson a morning agenda.

Humans decide what to say and perform the outreach. The software decides **who owns the lead, what the next action is, when it is due, what context is needed and when to escalate**.

Telegram is the strongest free mobile-notification channel for this use case. WhatsApp Cloud API is supported but proactive messages cannot be assumed to be free. Signal has no supported bot/business API and should not carry the production-critical alert path.

## What Twenty supports

Twenty workflows can start on record create/update/delete, manual invocation, a recurring UTC schedule/cron, or an incoming webhook. Custom and advanced objects are supported, and Twenty specifically identifies `Record is Created` as suitable for records created through an API. This matches FairLend's object-specific CRM sync. [Twenty workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers)

Available workflow actions include record create/update/search/upsert, filters, branches, iterators, delays, email, JavaScript and outbound HTTP requests. A delay can wait until a date supplied by an earlier step, but fails if that date is already in the past. [Twenty workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)

Tasks are a standard Twenty object. They can be related to CRM records and carry assignee, due date and completion state. Twenty recommends Tasks for follow-ups. [Twenty objects: Tasks](https://docs.twenty.com/user-guide/data-model/capabilities/objects)

Twenty documents both:

- a scheduled workflow that finds due Tasks per workspace member and emails a personalized daily reminder; and
- Task calendar views filtered to `My Tasks`, `This Week` and overdue incomplete Tasks.

Sources: [email alerts for Tasks due](https://docs.twenty.com/user-guide/workflows/how-tos/crm-automations/send-email-alerts-with-tasks-due), [Task calendar view](https://docs.twenty.com/user-guide/views-pipelines/how-tos/create-a-calendar-view-for-tasks-due).

Twenty also provides outbound webhooks for every custom or standard record create/update/delete. The webhook payload contains the record data, and Twenty signs deliveries with HMAC SHA-256. Webhooks currently emit all event types rather than offering event filtering, so the FairLend endpoint must authenticate and filter them. [Twenty webhooks](https://docs.twenty.com/developers/extend/webhooks)

### Important cost and implementation constraint

Twenty's current Pro pricing page advertises **50 workflow credits per year included**, while the workflow documentation states that a Delay consumes one credit when it executes. The same pricing page separately says workflows are available and API calls are limited to 50/minute on Pro and 100/minute on Organization. The exact credit accounting for every planned action should be confirmed in the FairLend workspace before placing a high-volume SLA engine entirely inside Twenty. [Twenty pricing](https://twenty.com/pricing), [Twenty Delay credits](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions#delay)

Because FairLend already has a version-controlled application and website worker, the low-friction design is:

- keep authoritative routing, scoring, idempotency, task creation and Telegram delivery in version-controlled FairLend code;
- project the output into Twenty fields and Tasks;
- use Twenty views for the human work queue;
- use Twenty record webhooks or a short scheduled reconciler to capture task completion/stage changes;
- reserve no-code workflows for low-volume operator conveniences unless the workspace's actual credit allowance proves sufficient.

This also avoids another Twenty limitation: its inline Code action documentation says external API keys must be placed directly in the function body. Telegram credentials should instead remain in Vercel/server secrets, never workflow source. [Twenty Code action](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions#code)

## Recommended human-outreach control loop

### 1. On intake submission

Perform the following atomically/idempotently using the stable FairLend lead UUID:

- classify object kind and application stage;
- compute a deterministic lead score and urgency tier;
- select an owner through an explicit routing table, with round-robin only among eligible active staff;
- set `Assigned At`, `SLA Due At`, `Next Action At`, `Last Human Touch At`, `Escalation Level` and `Automation State`;
- create one linked Task, such as `Call new mortgage borrower`, due according to the SLA;
- create a short pre-call brief from typed fields;
- send the assigned person's Telegram alert;
- store a notification delivery record/idempotency key.

The website should preserve CRM-owned fields exactly as it does now. A later form autosave must not reset the owner, stage, priority or next action.

### 2. Human work queue

The salesperson should need no triage or data re-entry. Their default view should answer, in order:

1. What is overdue?
2. What must I do now?
3. Who do I contact?
4. Why is this lead important?
5. What information do I need before calling?

Recommended columns/card fields:

- Next Action At and overdue duration
- Task title/action type
- Person, phone and email
- score/priority and the reason for the score
- intake type and current stage
- amount requested/investment amount/project cost
- timeline/urgency
- property or project location
- missing documents or blocking information
- last contact outcome and attempt count
- owner

### 3. After each human action

Reduce data entry to a small structured outcome rather than free-form notes:

- `Reached — qualified`
- `Reached — needs documents`
- `No answer — voicemail`
- `No answer — no voicemail`
- `Wrong/unusable contact`
- `Not interested`
- `Book consultation`

The outcome should automatically set `Last Human Touch At`, increment attempts, add a templated activity note, calculate the next due time and create/replace the next Task. Humans may add an optional note, but should not have to calculate dates or manually move fields that can be inferred.

Do not infer a successful contact from opening a record or clicking a phone link. Only an explicit outcome should advance a stage or satisfy the SLA.

### 4. SLA and escalation sweep

Run a deterministic sweep every 5–15 minutes:

- untouched `New` lead past SLA: remind owner;
- still untouched after the second threshold: notify owner and manager;
- overdue Task: raise escalation level and surface it at the top of the queue;
- owner unavailable/unassigned: reassign through the routing table;
- Task completed without a next Task: repair the gap;
- duplicate active Tasks for one next action: close extras and retain one canonical Task.

Send a morning agenda to each owner and an exception digest to the manager. Do not send repeated alerts on every sweep; use escalation state and notification idempotency keys.

### 5. Suggested initial cadence

The exact values should be configurable by intake type and priority rather than hard-coded:

| Event | High priority | Normal priority |
| --- | ---: | ---: |
| New submitted lead | call within 5 minutes | call within 15 minutes |
| First no-answer retry | 2 hours | 4 hours |
| Second retry | next business morning | next business day |
| Documents outstanding | 1 business day | 2 business days |
| Commitment/closing milestone | explicit file-specific due date | explicit file-specific due date |

The automation should understand FairLend business hours and Toronto holidays. A Friday evening lead should get an immediate phone alert but a due time based on the configured after-hours policy.

## Mobile notification options

### Telegram Bot API — recommended

Telegram states that its Bot Platform is free for users and developers. Bots use a simple HTTPS API and are created through `@BotFather`. [Telegram bot overview](https://core.telegram.org/bots), [Bot API](https://core.telegram.org/bots/api)

A bot cannot start a conversation with a user. Each salesperson must first message the bot or add it to the private staff group. [Telegram bot limitations](https://core.telegram.org/bots)

The free rate limits are far above FairLend's expected lead volume: approximately one message/second to one chat, 20 messages/minute to a group, and roughly 30 recipients/second for broadcasts. [Telegram Bots FAQ](https://core.telegram.org/bots/faq)

`sendMessage` accepts a target chat ID and up to 4,096 characters after entity parsing. Inline keyboards support URL and callback buttons, which makes `Open in Twenty`, `Call`, `Email`, `Claim` or `Acknowledge` actions practical. [Telegram `sendMessage`](https://core.telegram.org/bots/api#sendmessage), [inline keyboard buttons](https://core.telegram.org/bots/api#inlinekeyboardbutton)

Recommended setup:

1. Create a FairLend alerts bot through `@BotFather`.
2. Create one private internal Telegram group and add the bot, or have each salesperson start a private chat with it.
3. Capture and allowlist the group/user chat IDs.
4. Store `TELEGRAM_BOT_TOKEN` and permitted chat IDs in Vercel encrypted environment variables.
5. Send notifications from the same idempotent post-sync job that creates the Twenty Task.
6. Store the Telegram message ID, status and error; retry transient failures without duplicating alerts.

Suggested phone brief:

```text
HIGH · New Mortgage Borrower Lead · due 2:35 PM

Call: Jane Smith · +1 416 …
Email: jane@example.com
Goal: Refinance / equity take-out
Requested: $850,000
Property: Toronto · owner occupied
Value / current debt: $1.45M / $620k
Timeline: ASAP
Why high priority: submitted, reachable phone, urgent timeline
Missing before lender review: income docs, mortgage statement

Next action: Call now; confirm income and use of funds.
[Open in Twenty] [Call] [Email]
```

#### Telegram privacy limitation

Bot messages are Telegram cloud chats, not Secret Chats. Telegram says cloud-chat content is stored on its servers; only Secret Chats are end-to-end encrypted. The Bot API also uses Telegram's intermediary server. Therefore, do not send uploaded identity documents, raw intake JSON, SINs, banking data or unnecessary sensitive detail. Send the minimum operational brief and a permission-controlled Twenty deep link. [Telegram privacy policy](https://telegram.org/privacy#3-3-your-messages), [Telegram APIs](https://core.telegram.org/api)

### WhatsApp Cloud API — supported, but not reliably free

Meta's official Cloud API is intended for programmatic business messaging. Setup requires a Meta business portfolio, WhatsApp Business Account, business phone number and access tokens/permissions. A production integration must subscribe the application to WABA webhooks and register the business phone number with two-step verification. [Meta's official WhatsApp Cloud API collection](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api)

WhatsApp charges per delivered message based on destination market and message category. Service messages and utility messages sent in response to users are free. A user message opens a free 24-hour service window. Messages for 72 hours after a click-to-WhatsApp ad or Facebook Page CTA entry point are also free. [WhatsApp Business Platform pricing](https://whatsappbusiness.com/products/platform-pricing/)

Proactive internal lead alerts sent to an employee's phone are not safely covered by those free-response cases. They generally require an approved notification template and may be billable. Meta's official collection demonstrates outbound test notifications using a template and a recipient phone number. [Cloud API template send example](https://www.postman.com/meta/whatsapp-business-platform/request/pj4e5jq/send-test-message)

Conclusion: use WhatsApp only if staff adoption makes it materially preferable and FairLend accepts Meta onboarding, template governance and variable per-message cost. It is not the best answer to “ideally free.”

### Signal — not recommended for the primary path

Signal does not publish a supported business/bot messaging API. The common automation bridge, `signal-cli`, explicitly describes itself as unofficial. It requires a phone number, stores cryptographic keys locally, needs continuous/regular receive processing, and warns that releases older than roughly three months may stop working as Signal Server changes. [signal-cli repository](https://github.com/AsamK/signal-cli)

There is also a policy concern: Signal's terms prohibit impermissible bulk messaging/auto-messaging and accounts created through unauthorized or automated means. An internal low-volume notification account is not necessarily impermissible, but the absence of an authorized bot API means FairLend would be taking on avoidable interpretation and availability risk. [Signal Terms](https://signal.org/legal/)

It is technically possible to operate `signal-cli` for free, but it requires a persistent daemon, phone-number ownership, secure key custody, frequent upgrades and monitoring. That is a poor fit for production-critical sales alerts and for Vercel's ephemeral serverless runtime.

### Email and native Twenty views — keep as fallback

Twenty can send scheduled personalized due-Task emails, and staff can use Task calendar/table views on mobile. This is not as immediate as a Telegram push, but it is a useful zero-additional-vendor fallback and daily digest channel. [Twenty due-Task email workflow](https://docs.twenty.com/user-guide/workflows/how-tos/crm-automations/send-email-alerts-with-tasks-due)

## Delivery and security requirements

- Treat the intake UUID plus notification type and escalation level as an idempotency key.
- Persist every alert attempt, destination, provider message ID, delivery status and error.
- Allowlist destinations; never accept an arbitrary chat ID or phone number from intake payloads.
- Keep provider tokens only in encrypted deployment secrets and rotate them after suspected disclosure.
- Redact raw payloads and sensitive financial/identity documents from notifications.
- Put authorization on the Twenty deep link; a link is not a security boundary.
- Make alerts secondary to the canonical Twenty Task. A Telegram outage must not lose or reassign work.
- Expose a dead-letter/failed-notification view and manager digest.
- Add a quiet-hours policy while preserving SLA escalation for truly urgent leads.
- Record acknowledgement separately from completion; reading an alert is not outreach.

## Decision

Use **Twenty Tasks as the canonical human work queue**, a **version-controlled FairLend automation worker as the scheduling and idempotency engine**, and a **private Telegram bot/group as the immediate mobile delivery channel**. Keep email as the daily/failure fallback. Do not adopt WhatsApp until there is a specific organizational need that justifies templates and cost; do not depend on Signal for production-critical routing.
