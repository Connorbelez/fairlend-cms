import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "fairlend_leads"
      ADD COLUMN IF NOT EXISTS "intake_type" varchar,
      ADD COLUMN IF NOT EXISTS "intake_summary" varchar,
      ADD COLUMN IF NOT EXISTS "intake_amount" varchar,
      ADD COLUMN IF NOT EXISTS "intake_timeline" varchar,
      ADD COLUMN IF NOT EXISTS "intake_detail" varchar,
      ADD COLUMN IF NOT EXISTS "intake_project_stage" varchar,
      ADD COLUMN IF NOT EXISTS "intake_financing_needs" varchar,
      ADD COLUMN IF NOT EXISTS "intake_property_value" varchar,
      ADD COLUMN IF NOT EXISTS "intake_mortgage_balance" varchar,
      ADD COLUMN IF NOT EXISTS "intake_investment_focus" varchar;

    UPDATE "fairlend_leads"
    SET
      "intake_type" = COALESCE(
        NULLIF("intake"->>'requestedIntent', ''),
        NULLIF("intake"->>'situationType', ''),
        NULLIF("intent", ''),
        NULLIF("intake"->>'page', '')
      ),
      "intake_amount" = COALESCE(
        NULLIF("intake"->>'amount', ''),
        NULLIF("intake"->>'amountNeeded', ''),
        NULLIF("intake"->>'investmentAmount', ''),
        NULLIF("intake"->>'approximateEquity', '')
      ),
      "intake_timeline" = COALESCE(
        NULLIF("intake"->>'timeline', ''),
        NULLIF("intake"->>'deadline', ''),
        NULLIF("intake"->>'scheduledStart', ''),
        NULLIF("intake"->>'preferredWindow', '')
      ),
      "intake_detail" = COALESCE(
        NULLIF("intake"->>'detail', ''),
        NULLIF("intake"->>'notes', ''),
        NULLIF("intake"->>'message', ''),
        NULLIF("intake"->>'documentStatus', ''),
        NULLIF("intake"->>'googleEventLink', '')
      ),
      "intake_project_stage" = COALESCE(
        NULLIF("intake"->>'projectStage', ''),
        NULLIF("intake"->>'stage', ''),
        NULLIF("intake"->>'permitStage', '')
      ),
      "intake_financing_needs" = COALESCE(
        NULLIF(
          CASE
            WHEN jsonb_typeof("intake"->'financingNeeds') = 'array'
              THEN (
                SELECT string_agg(value, ', ')
                FROM jsonb_array_elements_text("intake"->'financingNeeds') AS value
              )
            ELSE "intake"->>'financingNeeds'
          END,
          ''
        ),
        NULLIF("intake"->>'financingNeed', '')
      ),
      "intake_property_value" = COALESCE(
        NULLIF("intake"->>'estimatedValue', ''),
        NULLIF("intake"->>'propertyValue', '')
      ),
      "intake_mortgage_balance" = COALESCE(
        NULLIF("intake"->>'mortgageBalance', ''),
        NULLIF("intake"->>'currentMortgageBalance', '')
      ),
      "intake_investment_focus" = COALESCE(
        NULLIF("intake"->>'investmentFocus', ''),
        NULLIF("intake"->>'focus', '')
      )
    WHERE "intake" IS NOT NULL;

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
        CASE WHEN "intake_investment_focus" IS NOT NULL THEN 'Focus: ' || "intake_investment_focus" END,
        CASE WHEN "intake_detail" IS NOT NULL THEN 'Notes: ' || "intake_detail" END
      ),
      ''
    );

    CREATE INDEX IF NOT EXISTS "fairlend_leads_intake_type_idx"
      ON "fairlend_leads" USING btree ("intake_type");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_intake_amount_idx"
      ON "fairlend_leads" USING btree ("intake_amount");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_intake_timeline_idx"
      ON "fairlend_leads" USING btree ("intake_timeline");
    CREATE INDEX IF NOT EXISTS "fairlend_leads_intake_project_stage_idx"
      ON "fairlend_leads" USING btree ("intake_project_stage");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "fairlend_leads_intake_project_stage_idx";
    DROP INDEX IF EXISTS "fairlend_leads_intake_timeline_idx";
    DROP INDEX IF EXISTS "fairlend_leads_intake_amount_idx";
    DROP INDEX IF EXISTS "fairlend_leads_intake_type_idx";

    ALTER TABLE "fairlend_leads"
      DROP COLUMN IF EXISTS "intake_investment_focus",
      DROP COLUMN IF EXISTS "intake_mortgage_balance",
      DROP COLUMN IF EXISTS "intake_property_value",
      DROP COLUMN IF EXISTS "intake_financing_needs",
      DROP COLUMN IF EXISTS "intake_project_stage",
      DROP COLUMN IF EXISTS "intake_detail",
      DROP COLUMN IF EXISTS "intake_timeline",
      DROP COLUMN IF EXISTS "intake_amount",
      DROP COLUMN IF EXISTS "intake_summary",
      DROP COLUMN IF EXISTS "intake_type";
  `)
}
