# FairLend CRM Twenty application

This package is the source of truth for FairLend's Twenty Cloud data model. It defines Mortgage Leads, Consultations, Campaign Touches, saved views, sidebar navigation, and relations to Twenty's standard Person, Company, and Opportunity objects.

## Features

- Models every normalized FairLend intake field and preserves raw source payloads.
- Separates website-owned capture data from CRM-owned workflow data.
- Connects leads to native People, Companies, and Opportunities.
- Ships useful list views and sidebar navigation.

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
