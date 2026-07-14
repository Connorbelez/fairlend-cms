import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "fairlend_leads"
      ADD COLUMN IF NOT EXISTS "analytics_eligible" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "analytics_consented_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "analytics_revoked_at" timestamp(3) with time zone;

    CREATE INDEX IF NOT EXISTS "fairlend_leads_analytics_eligible_idx"
      ON "fairlend_leads" USING btree ("analytics_eligible");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "fairlend_leads_analytics_eligible_idx";
    ALTER TABLE "fairlend_leads"
      DROP COLUMN IF EXISTS "analytics_revoked_at",
      DROP COLUMN IF EXISTS "analytics_consented_at",
      DROP COLUMN IF EXISTS "analytics_eligible";
  `)
}
