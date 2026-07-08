import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_fairlend_leads_status" AS ENUM('draft', 'started', 'submitted');

    CREATE TABLE "fairlend_leads" (
      "id" serial PRIMARY KEY NOT NULL,
      "lead_id" varchar NOT NULL,
      "status" "public"."enum_fairlend_leads_status" DEFAULT 'started' NOT NULL,
      "intent" varchar,
      "source" varchar DEFAULT 'website' NOT NULL,
      "name" varchar,
      "email" varchar,
      "phone" varchar,
      "address" varchar,
      "formatted_address" varchar,
      "place_id" varchar,
      "intake" jsonb,
      "address_details" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "fairlend_leads_lead_id_unique" UNIQUE("lead_id")
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fairlend_leads_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_fairlend_leads_fk"
      FOREIGN KEY ("fairlend_leads_id") REFERENCES "public"."fairlend_leads"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "fairlend_leads_lead_id_idx" ON "fairlend_leads" USING btree ("lead_id");
    CREATE INDEX "fairlend_leads_status_idx" ON "fairlend_leads" USING btree ("status");
    CREATE INDEX "fairlend_leads_intent_idx" ON "fairlend_leads" USING btree ("intent");
    CREATE INDEX "fairlend_leads_email_idx" ON "fairlend_leads" USING btree ("email");
    CREATE INDEX "fairlend_leads_address_idx" ON "fairlend_leads" USING btree ("address");
    CREATE INDEX "fairlend_leads_updated_at_idx" ON "fairlend_leads" USING btree ("updated_at");
    CREATE INDEX "fairlend_leads_created_at_idx" ON "fairlend_leads" USING btree ("created_at");
    CREATE INDEX "payload_locked_documents_rels_fairlend_leads_id_idx"
      ON "payload_locked_documents_rels" USING btree ("fairlend_leads_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_fairlend_leads_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_fairlend_leads_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "fairlend_leads_id";
    DROP TABLE IF EXISTS "fairlend_leads";
    DROP TYPE IF EXISTS "public"."enum_fairlend_leads_status";
  `)
}
