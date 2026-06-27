import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260622_000000_fairlend_leads from './20260622_000000_fairlend_leads'

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
]
