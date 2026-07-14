import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "fairlend_leads"
      ADD COLUMN IF NOT EXISTS "captured_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "submitted_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "submitted_at_source" varchar,
      ADD COLUMN IF NOT EXISTS "twenty_object_kind" varchar,
      ADD COLUMN IF NOT EXISTS "twenty_related_record_ids" jsonb NOT NULL DEFAULT '[]'::jsonb;

    UPDATE "fairlend_leads"
    SET
      "captured_at" = COALESCE("captured_at", "created_at"),
      "submitted_at" = COALESCE(
        "submitted_at",
        CASE
          WHEN NULLIF("intake"->>'submittedAt', '') ~ '^\\d{4}-\\d{2}-\\d{2}T'
            THEN ("intake"->>'submittedAt')::timestamptz
          WHEN "status"::text = 'submitted' THEN "created_at"
          ELSE NULL
        END
      ),
      "submitted_at_source" = COALESCE(
        "submitted_at_source",
        CASE
          WHEN NULLIF("intake"->>'submittedAt', '') ~ '^\\d{4}-\\d{2}-\\d{2}T' THEN 'source_supplied'
          WHEN "status"::text = 'submitted' THEN 'inferred_created_at'
          ELSE 'not_submitted'
        END
      );

    CREATE INDEX IF NOT EXISTS "fairlend_leads_twenty_object_kind_idx"
      ON "fairlend_leads" USING btree ("twenty_object_kind");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_submitted_at_idx"
      ON "fairlend_leads" USING btree ("submitted_at");

    DO $$
    BEGIN
      IF to_regclass('fairlend.leads') IS NOT NULL THEN
        ALTER TABLE fairlend.leads
          ADD COLUMN IF NOT EXISTS captured_at timestamptz,
          ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
          ADD COLUMN IF NOT EXISTS submitted_at_source varchar(40);

        UPDATE fairlend.leads
        SET
          captured_at = COALESCE(captured_at, created_at),
          submitted_at = COALESCE(
            submitted_at,
            CASE
              WHEN NULLIF(intake_payload->>'submittedAt', '') ~ '^\\d{4}-\\d{2}-\\d{2}T'
                THEN (intake_payload->>'submittedAt')::timestamptz
              WHEN status = 'submitted' THEN created_at
              ELSE NULL
            END
          ),
          submitted_at_source = COALESCE(
            submitted_at_source,
            CASE
              WHEN NULLIF(intake_payload->>'submittedAt', '') ~ '^\\d{4}-\\d{2}-\\d{2}T' THEN 'source_supplied'
              WHEN status = 'submitted' THEN 'inferred_created_at'
              ELSE 'not_submitted'
            END
          );
      END IF;
    END $$;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "fairlend_leads_submitted_at_idx";
    DROP INDEX IF EXISTS "fairlend_leads_twenty_object_kind_idx";
    ALTER TABLE "fairlend_leads"
      DROP COLUMN IF EXISTS "twenty_related_record_ids",
      DROP COLUMN IF EXISTS "twenty_object_kind",
      DROP COLUMN IF EXISTS "submitted_at_source",
      DROP COLUMN IF EXISTS "submitted_at",
      DROP COLUMN IF EXISTS "captured_at";

    DO $$
    BEGIN
      IF to_regclass('fairlend.leads') IS NOT NULL THEN
        ALTER TABLE fairlend.leads
          DROP COLUMN IF EXISTS submitted_at_source,
          DROP COLUMN IF EXISTS submitted_at,
          DROP COLUMN IF EXISTS captured_at;
      END IF;
    END $$;
  `)
}
