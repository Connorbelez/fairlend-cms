import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "fairlend_campaign_events" (
      "id" serial PRIMARY KEY NOT NULL,
      "event_id" varchar NOT NULL,
      "scan_id" varchar NOT NULL,
      "campaign" varchar NOT NULL,
      "event_type" varchar NOT NULL,
      "page_path" varchar,
      "visit_id" varchar,
      "duration_ms" integer,
      "form_id" varchar,
      "form_name" varchar,
      "intake_type" varchar,
      "lead_id" varchar,
      "occurred_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "fairlend_campaign_events_event_id_unique" UNIQUE("event_id")
    );

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "fairlend_campaign_events_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'payload_locked_documents_rels_fairlend_campaign_events_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_fairlend_campaign_events_fk"
          FOREIGN KEY ("fairlend_campaign_events_id")
          REFERENCES "public"."fairlend_campaign_events"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "fairlend_campaign_events_scan_id_idx"
      ON "fairlend_campaign_events" USING btree ("scan_id");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_events_campaign_idx"
      ON "fairlend_campaign_events" USING btree ("campaign");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_events_event_type_idx"
      ON "fairlend_campaign_events" USING btree ("event_type");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_events_page_path_idx"
      ON "fairlend_campaign_events" USING btree ("page_path");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_events_lead_id_idx"
      ON "fairlend_campaign_events" USING btree ("lead_id");
    CREATE INDEX IF NOT EXISTS "fairlend_campaign_events_occurred_at_idx"
      ON "fairlend_campaign_events" USING btree ("occurred_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fairlend_campaign_events_id_idx"
      ON "payload_locked_documents_rels" USING btree ("fairlend_campaign_events_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_fairlend_campaign_events_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_fairlend_campaign_events_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "fairlend_campaign_events_id";
    DROP TABLE IF EXISTS "fairlend_campaign_events" CASCADE;
  `)
}
