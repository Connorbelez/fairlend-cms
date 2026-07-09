import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "fairlend_leads"
      ADD COLUMN IF NOT EXISTS "intake_additional_liens" varchar;

    UPDATE "fairlend_leads"
    SET "intake_additional_liens" = COALESCE(
      NULLIF("intake"->>'additionalLiens', ''),
      NULLIF("intake"->>'additionalLienBalance', '')
    )
    WHERE "intake" IS NOT NULL
      AND "intake_additional_liens" IS NULL;

    UPDATE "fairlend_leads"
    SET "intake_summary" = NULLIF(
      concat_ws(
        ' | ',
        CASE WHEN "intake_type" IS NOT NULL THEN 'Type: ' || "intake_type" END,
        CASE WHEN "intake_amount" IS NOT NULL THEN 'Amount: ' || "intake_amount" END,
        CASE WHEN "intake_timeline" IS NOT NULL THEN 'Timeline: ' || "intake_timeline" END,
        CASE WHEN "intake_project_stage" IS NOT NULL THEN 'Stage: ' || "intake_project_stage" END,
        CASE WHEN "intake_financing_needs" IS NOT NULL THEN 'Financing: ' || "intake_financing_needs" END,
        CASE WHEN "intake_property_value" IS NOT NULL THEN 'Value: ' || "intake_property_value" END,
        CASE WHEN "intake_mortgage_balance" IS NOT NULL THEN 'Balance: ' || "intake_mortgage_balance" END,
        CASE WHEN "intake_additional_liens" IS NOT NULL THEN 'Additional liens: ' || "intake_additional_liens" END,
        CASE WHEN "intake_investment_focus" IS NOT NULL THEN 'Focus: ' || "intake_investment_focus" END,
        CASE WHEN "intake_detail" IS NOT NULL THEN 'Notes: ' || "intake_detail" END
      ),
      ''
    );
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "fairlend_leads" DROP COLUMN IF EXISTS "intake_additional_liens";
  `)
}
