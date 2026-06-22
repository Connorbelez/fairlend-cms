import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE SCHEMA IF NOT EXISTS "fairlend";

    DO $$
    BEGIN
      IF to_regclass('public.fairlend_leads') IS NOT NULL
        AND to_regclass('fairlend.leads') IS NULL THEN
        ALTER TABLE "public"."fairlend_leads" SET SCHEMA "fairlend";
        ALTER TABLE "fairlend"."fairlend_leads" RENAME TO "leads";
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "fairlend"."leads" (
      "id" varchar(36) PRIMARY KEY,
      "source" varchar(80) NOT NULL DEFAULT 'website',
      "intent" varchar(80),
      "status" varchar(40) NOT NULL DEFAULT 'started',
      "address" text,
      "formatted_address" text,
      "google_place_id" varchar(255),
      "address_payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "intake_payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "name" varchar(240),
      "email" varchar(320),
      "phone" varchar(80),
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "fairlend"."leads" ("created_at");
    CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "fairlend"."leads" ("status");
    CREATE INDEX IF NOT EXISTS "leads_email_idx" ON "fairlend"."leads" ("email");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "fairlend"."leads";
    DROP SCHEMA IF EXISTS "fairlend";
  `)
}
