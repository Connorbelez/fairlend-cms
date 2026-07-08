import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260622_000000_fairlend_leads from './20260622_000000_fairlend_leads'
import * as migration_20260704_000000_fairlend_leads_admin from './20260704_000000_fairlend_leads_admin'
import * as migration_20260705_000000_fairlend_consultation_booking from './20260705_000000_fairlend_consultation_booking'
import * as migration_20260705_010000_fairlend_lead_workflow from './20260705_010000_fairlend_lead_workflow'

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
]
