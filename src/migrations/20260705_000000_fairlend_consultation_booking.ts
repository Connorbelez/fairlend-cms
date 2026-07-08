import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_fairlend_consultation_bookings_status" AS ENUM('syncing', 'confirmed', 'cancelled', 'sync_failed');

    CREATE TABLE "fairlend_consultation_bookings" (
      "id" serial PRIMARY KEY NOT NULL,
      "booking_id" varchar NOT NULL,
      "status" "public"."enum_fairlend_consultation_bookings_status" DEFAULT 'syncing' NOT NULL,
      "scheduled_start" timestamp(3) with time zone NOT NULL,
      "scheduled_end" timestamp(3) with time zone NOT NULL,
      "timezone" varchar DEFAULT 'America/Toronto' NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "phone" varchar,
      "notes" varchar,
      "source" varchar DEFAULT 'leadership-cta' NOT NULL,
      "google_event_id" varchar,
      "google_event_link" varchar,
      "sync_error" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "fairlend_consultation_bookings_booking_id_unique" UNIQUE("booking_id")
    );

    CREATE TABLE "fairlend_consultation_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "timezone" varchar DEFAULT 'America/Toronto' NOT NULL,
      "slot_duration_minutes" numeric DEFAULT 30 NOT NULL,
      "buffer_minutes" numeric DEFAULT 15 NOT NULL,
      "minimum_notice_hours" numeric DEFAULT 24 NOT NULL,
      "booking_window_days" numeric DEFAULT 30 NOT NULL,
      "weekly_availability" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "blackout_dates" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "extra_availability" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fairlend_consultation_bookings_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_fairlend_consultation_bookings_fk"
      FOREIGN KEY ("fairlend_consultation_bookings_id") REFERENCES "public"."fairlend_consultation_bookings"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "fairlend_consultation_bookings_booking_id_idx" ON "fairlend_consultation_bookings" USING btree ("booking_id");
    CREATE INDEX "fairlend_consultation_bookings_status_idx" ON "fairlend_consultation_bookings" USING btree ("status");
    CREATE INDEX "fairlend_consultation_bookings_scheduled_start_idx" ON "fairlend_consultation_bookings" USING btree ("scheduled_start");
    CREATE INDEX "fairlend_consultation_bookings_scheduled_end_idx" ON "fairlend_consultation_bookings" USING btree ("scheduled_end");
    CREATE INDEX "fairlend_consultation_bookings_email_idx" ON "fairlend_consultation_bookings" USING btree ("email");
    CREATE INDEX "fairlend_consultation_bookings_google_event_id_idx" ON "fairlend_consultation_bookings" USING btree ("google_event_id");
    CREATE INDEX "fairlend_consultation_bookings_updated_at_idx" ON "fairlend_consultation_bookings" USING btree ("updated_at");
    CREATE INDEX "fairlend_consultation_bookings_created_at_idx" ON "fairlend_consultation_bookings" USING btree ("created_at");
    CREATE UNIQUE INDEX "fairlend_consultation_bookings_active_slot_idx"
      ON "fairlend_consultation_bookings" ("scheduled_start")
      WHERE "status" IN ('syncing', 'confirmed');
    CREATE INDEX "payload_locked_documents_rels_fairlend_consultation_bookings_id_idx"
      ON "payload_locked_documents_rels" USING btree ("fairlend_consultation_bookings_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_fairlend_consultation_bookings_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_fairlend_consultation_bookings_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "fairlend_consultation_bookings_id";
    DROP TABLE IF EXISTS "fairlend_consultation_settings";
    DROP TABLE IF EXISTS "fairlend_consultation_bookings";
    DROP TYPE IF EXISTS "public"."enum_fairlend_consultation_bookings_status";
  `)
}
