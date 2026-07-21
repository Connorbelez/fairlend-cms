import { getPayload } from 'payload'

import config from '../payload.config'
import { productionMigrations } from '../migrations'

process.env.PAYLOAD_MIGRATING = 'true'

const payload = await getPayload({ config })

try {
  await payload.db.migrate({ migrations: productionMigrations })
  payload.logger.info('Production database migrations are up to date.')
} finally {
  await payload.destroy()
}
