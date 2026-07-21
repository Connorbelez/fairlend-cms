# FairLend speaker-opportunity deduplication audit

**Snapshot date:** July 28, 2026  
**Scope:** Exclusion evidence for the net-new speaker-opportunity corpus  
**External mutations:** None; Twenty was queried read-only

## Live Twenty Partner Leads snapshot

The production API returned **181 Partner Lead records**.

| Existing Partner Lead category | Count |
|---|---:|
| Builder / early-file professional | 100 |
| Investor group | 20 |
| Podcast / media | 20 |
| Trade show / event | 20 |
| Meetup / recurring community | 20 |
| Other | 1 |
| **Total** | **181** |

The single `OTHER` record has a blank name and no stable FairLend lead ID. It remains part of the production record-count reconciliation but cannot participate in name-based deduplication.

## Source-controlled exclusion set

The validator loads these deterministic sources:

| Source | Records |
|---|---:|
| `integrations/fairlend-crm/scripts/data/partner-lead-id-map.json` | 100 |
| `integrations/fairlend-crm/scripts/data/gta-builders-80-crm-manifest.json` | 80 |
| `integrations/fairlend-crm/scripts/data/mli-select-early-file-professionals-80-crm-manifest.json` | 80 |
| **Total source records** | **260** |

After Unicode normalization, diacritic removal, case folding, ampersand normalization, punctuation removal, whitespace folding, and coalescing `name`/`companyName`, the sources produce **260 unique exclusion names**.

The exclusion set intentionally exceeds the live Twenty count. It includes the 80 researched MLI Select early-file professionals even when they are not present in the current live Partner Leads snapshot, because the discovery brief requires deduplication against the complete source-controlled research corpus.

## Duplicate rules

- `NET_NEW` records cannot match an exclusion name, company name, event/program name, or known company root domain.
- `EXISTING_ORGANIZATION_NEW_PROGRAM` is allowed only for a materially separate program with a unique program name, organizer/program route, and evidence surface.
- A new event date, ticket-platform listing, URL slug, or spelling variant is not a new opportunity.
- Separate national and chapter programs are allowed only when programming and organizer routes are materially distinct.
- `opportunitySeriesKey`, `eventOccurrenceKey`, and normalized organization/opportunity pairs must be unique in the new corpus.
- The validator fails closed on any exact source-controlled name/domain collision that is labelled `NET_NEW`.

## Final reconciliation

The assembled corpus passed the deterministic reconciliation validator on 2026-07-28.

- Qualified candidate records: **120**
- Unique opportunity series: **120**
- Source-controlled collisions: **0**
- Within-corpus duplicate series: **0**
- Within-corpus duplicate occurrences: **0**
- Category reconciliation: **20 investor groups/meetups; 15 investor education; 20 builder groups; 15 builder education; 15 trade events; 15 broker/agent education; 10 short-term-rental; 10 adjacent channels**
