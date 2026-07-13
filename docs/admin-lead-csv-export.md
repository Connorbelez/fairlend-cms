# Admin lead CSV export

The **FairLend Leads** collection list includes an **Export to CSV** action. The action calls the
authenticated `GET /api/fairlend-leads/export` collection endpoint and downloads every lead in the
collection, regardless of status, intent, or intake type.

The export contains the lead workflow/contact fields, normalized intake summary fields, raw intake
JSON, address details, attribution, admin notes, and timestamps. It also computes the union of all
intake payload paths present in the exported records and emits each path as an `intake.*` column.
Nested objects use dot paths and arrays remain JSON values. This keeps legacy and future intake
variants lossless without requiring a second hard-coded intake schema.

The endpoint requires an authenticated Payload user, runs the collection read access policy, disables
pagination to include all records, and returns `Cache-Control: no-store`. CSV text is UTF-8 with a BOM
for Excel compatibility, uses RFC 4180 quoting, and neutralizes spreadsheet formula prefixes in user
entered strings.
