import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_fairlend_leads_workflow_status') THEN
        CREATE TYPE "public"."enum_fairlend_leads_workflow_status" AS ENUM(
          'new',
          'contact_attempted',
          'contacted',
          'qualified',
          'consultation_booked',
          'working_file',
          'closed_won',
          'closed_lost'
        );
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_fairlend_leads_priority') THEN
        CREATE TYPE "public"."enum_fairlend_leads_priority" AS ENUM('high', 'normal', 'low');
      END IF;
    END $$;

    ALTER TABLE "fairlend_leads"
      ADD COLUMN IF NOT EXISTS "workflow_status" "public"."enum_fairlend_leads_workflow_status" DEFAULT 'new' NOT NULL,
      ADD COLUMN IF NOT EXISTS "priority" "public"."enum_fairlend_leads_priority" DEFAULT 'normal' NOT NULL,
      ADD COLUMN IF NOT EXISTS "next_action_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "admin_notes" varchar;

    CREATE INDEX IF NOT EXISTS "fairlend_leads_workflow_status_idx"
      ON "fairlend_leads" USING btree ("workflow_status");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_priority_idx"
      ON "fairlend_leads" USING btree ("priority");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_next_action_at_idx"
      ON "fairlend_leads" USING btree ("next_action_at");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "fairlend_leads_next_action_at_idx";
    DROP INDEX IF EXISTS "fairlend_leads_priority_idx";
    DROP INDEX IF EXISTS "fairlend_leads_workflow_status_idx";

    ALTER TABLE "fairlend_leads"
      DROP COLUMN IF EXISTS "admin_notes",
      DROP COLUMN IF EXISTS "next_action_at",
      DROP COLUMN IF EXISTS "priority",
      DROP COLUMN IF EXISTS "workflow_status";

    DROP TYPE IF EXISTS "public"."enum_fairlend_leads_priority";
    DROP TYPE IF EXISTS "public"."enum_fairlend_leads_workflow_status";
  `)
}
