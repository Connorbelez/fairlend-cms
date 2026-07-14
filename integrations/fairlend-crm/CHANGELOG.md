# Changelog

All notable changes to this application are documented in this file.

## 0.2.0

- Replaced the broad intake union with seven typed operational intake objects.
- Added object-specific workflows plus Operations, All Intake Fields, Drafts, and Kanban views.
- Added deterministic Person, explicit Company, Campaign Touch, consultation, attachment, note, and task relations.
- Preserved Legacy Intake Leads as active read-only metadata while removing its shared navigation item.
- Promoted capture/submission timestamps and every emitted form field into visible CRM columns; raw JSON is retained for audit only.

## 0.1.0

- Initial application scaffolded with [`create-twenty-app`](https://www.npmjs.com/package/create-twenty-app)
