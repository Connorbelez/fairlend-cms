import type { Migration } from 'payload'

import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260622_000000_fairlend_leads from './20260622_000000_fairlend_leads'
import * as migration_20260704_000000_fairlend_leads_admin from './20260704_000000_fairlend_leads_admin'
import * as migration_20260705_000000_fairlend_consultation_booking from './20260705_000000_fairlend_consultation_booking'
import * as migration_20260705_010000_fairlend_lead_workflow from './20260705_010000_fairlend_lead_workflow'
import * as migration_20260708_000000_qr_campaign_attribution from './20260708_000000_qr_campaign_attribution'
import * as migration_20260708_010000_fairlend_lead_intake_detail_columns from './20260708_010000_fairlend_lead_intake_detail_columns'
import * as migration_20260709_000000_fairlend_lead_additional_liens from './20260709_000000_fairlend_lead_additional_liens'
import * as migration_20260712_010000_fairlend_lead_mortgage_classification from './20260712_010000_fairlend_lead_mortgage_classification'
import * as migration_20260712_223325_money_page_blocks from './20260712_223325_money_page_blocks'
import * as migration_20260713_012559_money_page_unique_editor_enums from './20260713_012559_money_page_unique_editor_enums'
import * as migration_20260714_120000_twenty_crm_sync from './20260714_120000_twenty_crm_sync'
import * as migration_20260714_130000_twenty_intake_model from './20260714_130000_twenty_intake_model'
import * as migration_20260714_140000_search_readiness from './20260714_140000_search_readiness'
import * as migration_20260714_150000_campaign_journey_analytics from './20260714_150000_campaign_journey_analytics'
import * as migration_20260714_160000_posthog_analytics_consent from './20260714_160000_posthog_analytics_consent'
import * as migration_20260720_120000_blog_author_attribution from './20260720_120000_blog_author_attribution'
import * as migration_20260720_130000_blog_author_post_fields from './20260720_130000_blog_author_post_fields'

const defineMigration = <UpArgs, DownArgs>(
  name: string,
  migration: {
    down: (args: DownArgs) => Promise<void>
    up: (args: UpArgs) => Promise<void>
  },
): Migration => ({
  down: (args) => migration.down(args as DownArgs),
  name,
  up: (args) => migration.up(args as UpArgs),
})

export const productionMigrations: Migration[] = [
  defineMigration(
    '20260720_120000_blog_author_attribution',
    migration_20260720_120000_blog_author_attribution,
  ),
  defineMigration(
    '20260720_130000_blog_author_post_fields',
    migration_20260720_130000_blog_author_post_fields,
  ),
]

export const migrations = [
  {
    up: migration_20260409_155721_initial.up,
    down: migration_20260409_155721_initial.down,
    name: '20260409_155721_initial',
  },
  {
    up: migration_20260622_000000_fairlend_leads.up,
    down: migration_20260622_000000_fairlend_leads.down,
    name: '20260622_000000_fairlend_leads',
  },
  {
    up: migration_20260704_000000_fairlend_leads_admin.up,
    down: migration_20260704_000000_fairlend_leads_admin.down,
    name: '20260704_000000_fairlend_leads_admin',
  },
  {
    up: migration_20260705_000000_fairlend_consultation_booking.up,
    down: migration_20260705_000000_fairlend_consultation_booking.down,
    name: '20260705_000000_fairlend_consultation_booking',
  },
  {
    up: migration_20260705_010000_fairlend_lead_workflow.up,
    down: migration_20260705_010000_fairlend_lead_workflow.down,
    name: '20260705_010000_fairlend_lead_workflow',
  },
  {
    up: migration_20260708_000000_qr_campaign_attribution.up,
    down: migration_20260708_000000_qr_campaign_attribution.down,
    name: '20260708_000000_qr_campaign_attribution',
  },
  {
    up: migration_20260708_010000_fairlend_lead_intake_detail_columns.up,
    down: migration_20260708_010000_fairlend_lead_intake_detail_columns.down,
    name: '20260708_010000_fairlend_lead_intake_detail_columns',
  },
  {
    up: migration_20260709_000000_fairlend_lead_additional_liens.up,
    down: migration_20260709_000000_fairlend_lead_additional_liens.down,
    name: '20260709_000000_fairlend_lead_additional_liens',
  },
  {
    up: migration_20260712_010000_fairlend_lead_mortgage_classification.up,
    down: migration_20260712_010000_fairlend_lead_mortgage_classification.down,
    name: '20260712_010000_fairlend_lead_mortgage_classification',
  },
  {
    up: migration_20260712_223325_money_page_blocks.up,
    down: migration_20260712_223325_money_page_blocks.down,
    name: '20260712_223325_money_page_blocks',
  },
  {
    up: migration_20260713_012559_money_page_unique_editor_enums.up,
    down: migration_20260713_012559_money_page_unique_editor_enums.down,
    name: '20260713_012559_money_page_unique_editor_enums',
  },
  {
    up: migration_20260714_120000_twenty_crm_sync.up,
    down: migration_20260714_120000_twenty_crm_sync.down,
    name: '20260714_120000_twenty_crm_sync',
  },
  {
    up: migration_20260714_130000_twenty_intake_model.up,
    down: migration_20260714_130000_twenty_intake_model.down,
    name: '20260714_130000_twenty_intake_model',
  },
  {
    up: migration_20260714_140000_search_readiness.up,
    down: migration_20260714_140000_search_readiness.down,
    name: '20260714_140000_search_readiness',
  },
  {
    up: migration_20260714_150000_campaign_journey_analytics.up,
    down: migration_20260714_150000_campaign_journey_analytics.down,
    name: '20260714_150000_campaign_journey_analytics',
  },
  {
    up: migration_20260714_160000_posthog_analytics_consent.up,
    down: migration_20260714_160000_posthog_analytics_consent.down,
    name: '20260714_160000_posthog_analytics_consent',
  },
  ...productionMigrations,
]
