import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "official_title" varchar,
      ADD COLUMN IF NOT EXISTS "bio" varchar;

    UPDATE "users"
    SET
      "official_title" = COALESCE(
        "official_title",
        CASE "name"
          WHEN 'Elie Soberano' THEN 'Founder, Principal Broker & MIC Director'
          WHEN 'Connor Beleznay' THEN 'CTO & MIC Director'
          WHEN 'Bogdan Krystek' THEN 'CFO & MIC Director'
        END
      ),
      "bio" = COALESCE(
        "bio",
        CASE "name"
          WHEN 'Elie Soberano' THEN 'Leads mortgage brokerage, private lending, construction-financing, and investment-finance strategy.'
          WHEN 'Connor Beleznay' THEN 'Leads capital-markets systems and AI infrastructure built around human-led underwriting.'
          WHEN 'Bogdan Krystek' THEN 'Leads financial oversight, capital planning, reporting, and controls across FairLend.'
        END
      )
    WHERE "name" IN ('Elie Soberano', 'Connor Beleznay', 'Bogdan Krystek');
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
      DROP COLUMN IF EXISTS "bio",
      DROP COLUMN IF EXISTS "official_title";
  `)
}
