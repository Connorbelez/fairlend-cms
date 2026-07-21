import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts_populated_authors"
      ADD COLUMN IF NOT EXISTS "official_title" varchar,
      ADD COLUMN IF NOT EXISTS "bio" varchar;

    ALTER TABLE "_posts_v_version_populated_authors"
      ADD COLUMN IF NOT EXISTS "official_title" varchar,
      ADD COLUMN IF NOT EXISTS "bio" varchar;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_posts_v_version_populated_authors"
      DROP COLUMN IF EXISTS "bio",
      DROP COLUMN IF EXISTS "official_title";

    ALTER TABLE "posts_populated_authors"
      DROP COLUMN IF EXISTS "bio",
      DROP COLUMN IF EXISTS "official_title";
  `)
}
