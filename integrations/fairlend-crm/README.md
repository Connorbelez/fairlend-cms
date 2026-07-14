# FairLend CRM Twenty application

This package is the source of truth for FairLend's Twenty Cloud data model. It defines Mortgage Borrower Leads, Lender Applications, Construction Applications, Partner Leads, Consultation Requests, General Inquiries, Newsletter Subscriptions, Campaign Touches, saved views, navigation, and standard-object relations.

## Features

- Promotes every emitted intake value into a typed CRM column while preserving raw source payloads as hidden audit data.
- Separates website-owned capture data from CRM-owned workflow data.
- Deduplicates and connects native People; creates Companies only from explicit organization input.
- Ships Operations, All Intake Fields, Drafts, and workflow Kanban views.
- Retains Legacy Intake Leads read-only until migration verification is complete.

## Getting started

The full deployment and operating runbook lives in [`../../docs/twenty-crm.md`](../../docs/twenty-crm.md).

```bash
corepack enable
yarn install --immutable
yarn typecheck
yarn lint
yarn test:unit
yarn twenty remote:add --url https://api.twenty.com --as production
yarn twenty remote:use production
yarn twenty plan
```

Apply only after reviewing the plan and receiving explicit production approval:

```bash
yarn twenty apply
```

## Changelog

Notable changes are documented in [CHANGELOG.md](CHANGELOG.md).

## Learn more

- [Twenty Apps documentation](https://docs.twenty.com/developers/extend/apps/getting-started/quick-start)
- [twenty-sdk CLI reference](https://www.npmjs.com/package/twenty-sdk)
- [Discord](https://discord.gg/cx5n4Jzs57)
