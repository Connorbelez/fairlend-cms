import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "fairlend_campaign_scans" (
      "id" serial PRIMARY KEY NOT NULL,
      "scan_id" varchar NOT NULL,
      "campaign" varchar NOT NULL,
      "source" varchar NOT NULL,
      "destination" varchar DEFAULT '/' NOT NULL,
      "converted_lead_id" varchar,
      "converted_at" timestamp(3) with time zone,
      "captured_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "referrer" varchar,
      "user_agent" varchar,
      "hashed_ip" varchar,
      "query_params" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "fairlend_campaign_scans_scan_id_unique" UNIQUE("scan_id")
    );

    ALTER TABLE "fairlend_leads"
      ADD COLUMN IF NOT EXISTS "campaign" varchar,
      ADD COLUMN IF NOT EXISTS "campaign_scan_id" varchar,
      ADD COLUMN IF NOT EXISTS "attribution" jsonb;

    ALTER TABLE "fairlend"."leads"
      ADD COLUMN IF NOT EXISTS "campaign" varchar(80),
      ADD COLUMN IF NOT EXISTS "campaign_scan_id" varchar(80),
      ADD COLUMN IF NOT EXISTS "attribution_payload" jsonb DEFAULT '{}'::jsonb NOT NULL;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "fairlend_campaign_scans_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'payload_locked_documents_rels_fairlend_campaign_scans_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_fairlend_campaign_scans_fk"
          FOREIGN KEY ("fairlend_campaign_scans_id") REFERENCES "public"."fairlend_campaign_scans"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "fairlend_campaign_scans_scan_id_idx"
      ON "fairlend_campaign_scans" USING btree ("scan_id");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_scans_campaign_idx"
      ON "fairlend_campaign_scans" USING btree ("campaign");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_scans_source_idx"
      ON "fairlend_campaign_scans" USING btree ("source");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_scans_converted_lead_id_idx"
      ON "fairlend_campaign_scans" USING btree ("converted_lead_id");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_scans_created_at_idx"
      ON "fairlend_campaign_scans" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fairlend_campaign_scans_id_idx"
      ON "payload_locked_documents_rels" USING btree ("fairlend_campaign_scans_id");

    CREATE INDEX IF NOT EXISTS "fairlend_leads_campaign_idx"
      ON "fairlend_leads" USING btree ("campaign");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_campaign_scan_id_idx"
      ON "fairlend_leads" USING btree ("campaign_scan_id");
    CREATE INDEX IF NOT EXISTS "leads_campaign_idx"
      ON "fairlend"."leads" USING btree ("campaign");
    CREATE INDEX IF NOT EXISTS "leads_campaign_scan_id_idx"
      ON "fairlend"."leads" USING btree ("campaign_scan_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "leads_campaign_scan_id_idx";
    DROP INDEX IF EXISTS "leads_campaign_idx";
    DROP INDEX IF EXISTS "fairlend_leads_campaign_scan_id_idx";
    DROP INDEX IF EXISTS "fairlend_leads_campaign_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_fairlend_campaign_scans_id_idx";
    DROP INDEX IF EXISTS "fairlend_campaign_scans_created_at_idx";
    DROP INDEX IF EXISTS "fairlend_campaign_scans_converted_lead_id_idx";
    DROP INDEX IF EXISTS "fairlend_campaign_scans_source_idx";
    DROP INDEX IF EXISTS "fairlend_campaign_scans_campaign_idx";
    DROP INDEX IF EXISTS "fairlend_campaign_scans_scan_id_idx";

    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_fairlend_campaign_scans_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "fairlend_campaign_scans_id";

    ALTER TABLE "fairlend"."leads"
      DROP COLUMN IF EXISTS "attribution_payload",
      DROP COLUMN IF EXISTS "campaign_scan_id",
      DROP COLUMN IF EXISTS "campaign";

    ALTER TABLE "fairlend_leads"
      DROP COLUMN IF EXISTS "attribution",
      DROP COLUMN IF EXISTS "campaign_scan_id",
      DROP COLUMN IF EXISTS "campaign";

    DROP TABLE IF EXISTS "fairlend_campaign_scans";
  `)
}
