import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

const demoPostSlugs = [
  'digital-horizons',
  'global-gaze',
  'dollar-and-sense-the-financial-forecast',
]

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await payload.delete({
    collection: 'pages',
    context: { disableRevalidate: true },
    overrideAccess: true,
    where: {
      slug: { equals: 'money-page-blocks-qa-2026-07-12' },
    },
  })

  await payload.delete({
    collection: 'posts',
    context: { disableRevalidate: true },
    overrideAccess: true,
    where: {
      slug: { in: demoPostSlugs },
    },
  })

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS fairlend_indexnow_events (
      id serial PRIMARY KEY,
      fingerprint varchar NOT NULL UNIQUE,
      url varchar NOT NULL,
      change_type varchar NOT NULL,
      source_collection varchar NOT NULL,
      source_document_id varchar NOT NULL,
      document_updated_at timestamp(3) with time zone,
      deployment varchar,
      status varchar NOT NULL DEFAULT 'pending',
      response_code integer,
      retry_count integer NOT NULL DEFAULT 0,
      last_error text,
      created_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      updated_at timestamp(3) with time zone NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS fairlend_indexnow_events_url_idx
      ON fairlend_indexnow_events USING btree (url);
    CREATE INDEX IF NOT EXISTS fairlend_indexnow_events_status_idx
      ON fairlend_indexnow_events USING btree (status);
    CREATE INDEX IF NOT EXISTS fairlend_indexnow_events_created_at_idx
      ON fairlend_indexnow_events USING btree (created_at);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS fairlend_indexnow_events;`)
}
