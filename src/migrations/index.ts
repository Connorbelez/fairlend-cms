import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260622_000000_fairlend_leads from './20260622_000000_fairlend_leads'
import * as migration_20260704_000000_fairlend_leads_admin from './20260704_000000_fairlend_leads_admin'
import * as migration_20260705_000000_fairlend_consultation_booking from './20260705_000000_fairlend_consultation_booking'
import * as migration_20260705_010000_fairlend_lead_workflow from './20260705_010000_fairlend_lead_workflow'
import * as migration_20260708_000000_qr_campaign_attribution from './20260708_000000_qr_campaign_attribution'
import * as migration_20260708_010000_fairlend_lead_intake_detail_columns from './20260708_010000_fairlend_lead_intake_detail_columns'

export const migrations = [
  {
    up: migration_20260409_155721_initial.up,
    down: migration_20260409_155721_initial.down,
    name: '20260409_155721_initial',
  },
  {
    up: migration_20260622_000000_fairlend_leads.up,
    down: migration_20260622_000000_fairlend_leads.down,
    name: '20260622_000000_fairlend_leads',
  },
  {
    up: migration_20260704_000000_fairlend_leads_admin.up,
    down: migration_20260704_000000_fairlend_leads_admin.down,
    name: '20260704_000000_fairlend_leads_admin',
  },
  {
    up: migration_20260705_000000_fairlend_consultation_booking.up,
    down: migration_20260705_000000_fairlend_consultation_booking.down,
    name: '20260705_000000_fairlend_consultation_booking',
  },
  {
    up: migration_20260705_010000_fairlend_lead_workflow.up,
    down: migration_20260705_010000_fairlend_lead_workflow.down,
    name: '20260705_010000_fairlend_lead_workflow',
  },
  {
    up: migration_20260708_000000_qr_campaign_attribution.up,
    down: migration_20260708_000000_qr_campaign_attribution.down,
    name: '20260708_000000_qr_campaign_attribution',
  },
  {
    up: migration_20260708_010000_fairlend_lead_intake_detail_columns.up,
    down: migration_20260708_010000_fairlend_lead_intake_detail_columns.down,
    name: '20260708_010000_fairlend_lead_intake_detail_columns',
  },
]
