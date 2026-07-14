import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_fairlend_leads_twenty_sync_status'
      ) THEN
        CREATE TYPE enum_fairlend_leads_twenty_sync_status AS ENUM(
          'disabled',
          'pending',
          'synced',
          'failed'
        );
      END IF;
    END $$;

    ALTER TABLE "fairlend_leads"
      ADD COLUMN IF NOT EXISTS "twenty_sync_status"
        enum_fairlend_leads_twenty_sync_status NOT NULL DEFAULT 'disabled',
      ADD COLUMN IF NOT EXISTS "twenty_record_id" varchar,
      ADD COLUMN IF NOT EXISTS "twenty_last_synced_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "twenty_sync_error" varchar;

    CREATE INDEX IF NOT EXISTS "fairlend_leads_twenty_sync_status_idx"
      ON "fairlend_leads" USING btree ("twenty_sync_status");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_twenty_record_id_idx"
      ON "fairlend_leads" USING btree ("twenty_record_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "fairlend_leads_twenty_record_id_idx";
    DROP INDEX IF EXISTS "fairlend_leads_twenty_sync_status_idx";

    ALTER TABLE "fairlend_leads"
      DROP COLUMN IF EXISTS "twenty_sync_error",
      DROP COLUMN IF EXISTS "twenty_last_synced_at",
      DROP COLUMN IF EXISTS "twenty_record_id",
      DROP COLUMN IF EXISTS "twenty_sync_status";

    DROP TYPE IF EXISTS enum_fairlend_leads_twenty_sync_status;
  `)
}
