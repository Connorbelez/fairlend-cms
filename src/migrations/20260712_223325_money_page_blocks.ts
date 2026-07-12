import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."at" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_money_page_hero_variant" AS ENUM('routeField', 'splitDossier', 'mediaStatement');
  CREATE TYPE "public"."enum_pages_blocks_money_page_hero_heading_level" AS ENUM('h1', 'h2');
  CREATE TYPE "public"."s" AS ENUM('paper', 'white', 'ink');
  CREATE TYPE "public"."t" AS ENUM('fabric-of-squares', 'grid-noise', 'inflicted', 'debut-light', 'groovepaper');
  CREATE TYPE "public"."p" AS ENUM('compact', 'standard', 'immersive');
  CREATE TYPE "public"."enum_pages_blocks_money_page_narrative_variant" AS ENUM('fieldNote', 'splitBrief', 'pullQuote');
  CREATE TYPE "public"."enum_pages_blocks_money_page_media_split_variant" AS ENUM('imageLeft', 'imageRight', 'imageTop', 'videoLeft', 'videoRight');
  CREATE TYPE "public"."enum_pages_blocks_money_page_media_split_video_playback" AS ENUM('controls', 'ambient');
  CREATE TYPE "public"."enum_pages_blocks_money_page_features_variant" AS ENUM('alternatingEvidence', 'routeLedger', 'underwritingIndex');
  CREATE TYPE "public"."enum_pages_blocks_money_page_process_variant" AS ENUM('topographicRoute', 'zPattern', 'dealFile');
  CREATE TYPE "public"."enum_pages_blocks_money_page_proof_variant" AS ENUM('caseFile', 'testimonyDossier', 'verifiedOutcomes');
  CREATE TYPE "public"."enum_pages_blocks_money_page_comparison_variant" AS ENUM('fitCheck', 'routeComparison', 'decisionMatrix');
  CREATE TYPE "public"."enum_pages_blocks_money_page_disclosure_variant" AS ENUM('accordion', 'tabs', 'decisionPath');
  CREATE TYPE "public"."enum_pages_blocks_money_page_f_a_q_variant" AS ENUM('routeMap', 'compactLedger');
  CREATE TYPE "public"."enum_pages_blocks_money_page_c_t_a_variant" AS ENUM('applicationDesk', 'expertRoute', 'splitContact');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_hero_variant" AS ENUM('routeField', 'splitDossier', 'mediaStatement');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_hero_heading_level" AS ENUM('h1', 'h2');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_narrative_variant" AS ENUM('fieldNote', 'splitBrief', 'pullQuote');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_media_split_variant" AS ENUM('imageLeft', 'imageRight', 'imageTop', 'videoLeft', 'videoRight');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_media_split_video_playback" AS ENUM('controls', 'ambient');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_features_variant" AS ENUM('alternatingEvidence', 'routeLedger', 'underwritingIndex');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_process_variant" AS ENUM('topographicRoute', 'zPattern', 'dealFile');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_proof_variant" AS ENUM('caseFile', 'testimonyDossier', 'verifiedOutcomes');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_comparison_variant" AS ENUM('fitCheck', 'routeComparison', 'decisionMatrix');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_disclosure_variant" AS ENUM('accordion', 'tabs', 'decisionPath');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_f_a_q_variant" AS ENUM('routeMap', 'compactLedger');
  CREATE TYPE "public"."enum__pages_v_blocks_money_page_c_t_a_variant" AS ENUM('applicationDesk', 'expertRoute', 'splitContact');
  CREATE TYPE "public"."enum_posts_blocks_money_page_hero_variant" AS ENUM('routeField', 'splitDossier', 'mediaStatement');
  CREATE TYPE "public"."enum_posts_blocks_money_page_hero_heading_level" AS ENUM('h1', 'h2');
  CREATE TYPE "public"."enum_posts_blocks_money_page_narrative_variant" AS ENUM('fieldNote', 'splitBrief', 'pullQuote');
  CREATE TYPE "public"."enum_posts_blocks_money_page_media_split_variant" AS ENUM('imageLeft', 'imageRight', 'imageTop', 'videoLeft', 'videoRight');
  CREATE TYPE "public"."enum_posts_blocks_money_page_media_split_video_playback" AS ENUM('controls', 'ambient');
  CREATE TYPE "public"."enum_posts_blocks_money_page_features_variant" AS ENUM('alternatingEvidence', 'routeLedger', 'underwritingIndex');
  CREATE TYPE "public"."enum_posts_blocks_money_page_process_variant" AS ENUM('topographicRoute', 'zPattern', 'dealFile');
  CREATE TYPE "public"."enum_posts_blocks_money_page_proof_variant" AS ENUM('caseFile', 'testimonyDossier', 'verifiedOutcomes');
  CREATE TYPE "public"."enum_posts_blocks_money_page_comparison_variant" AS ENUM('fitCheck', 'routeComparison', 'decisionMatrix');
  CREATE TYPE "public"."enum_posts_blocks_money_page_disclosure_variant" AS ENUM('accordion', 'tabs', 'decisionPath');
  CREATE TYPE "public"."enum_posts_blocks_money_page_f_a_q_variant" AS ENUM('routeMap', 'compactLedger');
  CREATE TYPE "public"."enum_posts_blocks_money_page_c_t_a_variant" AS ENUM('applicationDesk', 'expertRoute', 'splitContact');
  CREATE TYPE "public"."enum_posts_content_mode" AS ENUM('article', 'moneyPage');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_hero_variant" AS ENUM('routeField', 'splitDossier', 'mediaStatement');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_hero_heading_level" AS ENUM('h1', 'h2');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_narrative_variant" AS ENUM('fieldNote', 'splitBrief', 'pullQuote');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_media_split_variant" AS ENUM('imageLeft', 'imageRight', 'imageTop', 'videoLeft', 'videoRight');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_media_split_video_playback" AS ENUM('controls', 'ambient');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_features_variant" AS ENUM('alternatingEvidence', 'routeLedger', 'underwritingIndex');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_process_variant" AS ENUM('topographicRoute', 'zPattern', 'dealFile');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_proof_variant" AS ENUM('caseFile', 'testimonyDossier', 'verifiedOutcomes');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_comparison_variant" AS ENUM('fitCheck', 'routeComparison', 'decisionMatrix');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_disclosure_variant" AS ENUM('accordion', 'tabs', 'decisionPath');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_f_a_q_variant" AS ENUM('routeMap', 'compactLedger');
  CREATE TYPE "public"."enum__posts_v_blocks_money_page_c_t_a_variant" AS ENUM('applicationDesk', 'expertRoute', 'splitContact');
  CREATE TYPE "public"."enum__posts_v_version_content_mode" AS ENUM('article', 'moneyPage');
  CREATE TABLE "pages_blocks_money_page_hero_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_hero_variant" DEFAULT 'routeField',
  	"heading_level" "enum_pages_blocks_money_page_hero_heading_level" DEFAULT 'h1',
  	"route_label" varchar,
  	"heading" varchar,
  	"summary" jsonb,
  	"media_id" integer,
  	"mobile_media_id" integer,
  	"media_caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_narrative_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_narrative" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_narrative_variant" DEFAULT 'fieldNote',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"aside_title" varchar,
  	"aside" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_media_split_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_media_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_media_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_media_split_variant" DEFAULT 'imageLeft',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"media_id" integer,
  	"poster_id" integer,
  	"video_playback" "enum_pages_blocks_money_page_media_split_video_playback" DEFAULT 'controls',
  	"caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_features_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route_code" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"proof" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_features_variant" DEFAULT 'alternatingEvidence',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"proof" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "pages_blocks_money_page_process_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_process_variant" DEFAULT 'topographicRoute',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_proof_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"context" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_proof_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_proof_variant" DEFAULT 'caseFile',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"quote" varchar,
  	"source_name" varchar,
  	"source_role" varchar,
  	"source_organization" varchar,
  	"source_portrait_id" integer,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"recommended" boolean
  );
  
  CREATE TABLE "pages_blocks_money_page_comparison_criteria_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_comparison_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_comparison_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_comparison_variant" DEFAULT 'fitCheck',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_disclosure_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_disclosure_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"signal" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "pages_blocks_money_page_disclosure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_disclosure_variant" DEFAULT 'accordion',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_f_a_q_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_money_page_f_a_q" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_f_a_q_variant" DEFAULT 'routeMap',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"enable_structured_data" boolean DEFAULT true,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_c_t_a_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_c_t_a_trust_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_money_page_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_money_page_c_t_a_variant" DEFAULT 'applicationDesk',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"body" jsonb,
  	"media_id" integer,
  	"disclosure" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_hero_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_hero_variant" DEFAULT 'routeField',
  	"heading_level" "enum__pages_v_blocks_money_page_hero_heading_level" DEFAULT 'h1',
  	"route_label" varchar,
  	"heading" varchar,
  	"summary" jsonb,
  	"media_id" integer,
  	"mobile_media_id" integer,
  	"media_caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_narrative_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_narrative" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_narrative_variant" DEFAULT 'fieldNote',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"aside_title" varchar,
  	"aside" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_media_split_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_media_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_media_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_media_split_variant" DEFAULT 'imageLeft',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"media_id" integer,
  	"poster_id" integer,
  	"video_playback" "enum__pages_v_blocks_money_page_media_split_video_playback" DEFAULT 'controls',
  	"caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_features_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"route_code" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"proof" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_features_variant" DEFAULT 'alternatingEvidence',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"proof" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_process_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_process_variant" DEFAULT 'topographicRoute',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_proof_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"context" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_proof_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_proof_variant" DEFAULT 'caseFile',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"quote" varchar,
  	"source_name" varchar,
  	"source_role" varchar,
  	"source_organization" varchar,
  	"source_portrait_id" integer,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"recommended" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_comparison_criteria_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_comparison_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_comparison_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_comparison_variant" DEFAULT 'fitCheck',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_disclosure_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_disclosure_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"signal" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_disclosure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_disclosure_variant" DEFAULT 'accordion',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_f_a_q_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_f_a_q" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_f_a_q_variant" DEFAULT 'routeMap',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"enable_structured_data" boolean DEFAULT true,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_c_t_a_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_c_t_a_trust_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_money_page_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_money_page_c_t_a_variant" DEFAULT 'applicationDesk',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"body" jsonb,
  	"media_id" integer,
  	"disclosure" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_hero_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_hero_variant" DEFAULT 'routeField',
  	"heading_level" "enum_posts_blocks_money_page_hero_heading_level" DEFAULT 'h1',
  	"route_label" varchar,
  	"heading" varchar,
  	"summary" jsonb,
  	"media_id" integer,
  	"mobile_media_id" integer,
  	"media_caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_narrative_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_narrative" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_narrative_variant" DEFAULT 'fieldNote',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"aside_title" varchar,
  	"aside" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_media_split_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_media_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_media_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_media_split_variant" DEFAULT 'imageLeft',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"media_id" integer,
  	"poster_id" integer,
  	"video_playback" "enum_posts_blocks_money_page_media_split_video_playback" DEFAULT 'controls',
  	"caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_features_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route_code" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"proof" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_features_variant" DEFAULT 'alternatingEvidence',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"proof" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "posts_blocks_money_page_process_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_process_variant" DEFAULT 'topographicRoute',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_proof_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"context" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_proof_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_proof_variant" DEFAULT 'caseFile',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"quote" varchar,
  	"source_name" varchar,
  	"source_role" varchar,
  	"source_organization" varchar,
  	"source_portrait_id" integer,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"recommended" boolean
  );
  
  CREATE TABLE "posts_blocks_money_page_comparison_criteria_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_comparison_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_comparison_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_comparison_variant" DEFAULT 'fitCheck',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_disclosure_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_disclosure_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"signal" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "posts_blocks_money_page_disclosure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_disclosure_variant" DEFAULT 'accordion',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_f_a_q_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "posts_blocks_money_page_f_a_q" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_f_a_q_variant" DEFAULT 'routeMap',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"enable_structured_data" boolean DEFAULT true,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_c_t_a_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_c_t_a_trust_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "posts_blocks_money_page_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_money_page_c_t_a_variant" DEFAULT 'applicationDesk',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"body" jsonb,
  	"media_id" integer,
  	"disclosure" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_hero_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_hero_variant" DEFAULT 'routeField',
  	"heading_level" "enum__posts_v_blocks_money_page_hero_heading_level" DEFAULT 'h1',
  	"route_label" varchar,
  	"heading" varchar,
  	"summary" jsonb,
  	"media_id" integer,
  	"mobile_media_id" integer,
  	"media_caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_narrative_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_narrative" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_narrative_variant" DEFAULT 'fieldNote',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"aside_title" varchar,
  	"aside" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_media_split_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_media_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_media_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_media_split_variant" DEFAULT 'imageLeft',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"content" jsonb,
  	"media_id" integer,
  	"poster_id" integer,
  	"video_playback" "enum__posts_v_blocks_money_page_media_split_video_playback" DEFAULT 'controls',
  	"caption" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_features_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"route_code" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"proof" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_features_variant" DEFAULT 'alternatingEvidence',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"proof" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_process_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_process_variant" DEFAULT 'topographicRoute',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_proof_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"context" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_proof_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_proof_variant" DEFAULT 'caseFile',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"quote" varchar,
  	"source_name" varchar,
  	"source_role" varchar,
  	"source_organization" varchar,
  	"source_portrait_id" integer,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_comparison_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"recommended" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_comparison_criteria_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_comparison_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_comparison_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_comparison_variant" DEFAULT 'fitCheck',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_disclosure_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_disclosure_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"signal" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_disclosure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_disclosure_variant" DEFAULT 'accordion',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_f_a_q_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_f_a_q" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_f_a_q_variant" DEFAULT 'routeMap',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"enable_structured_data" boolean DEFAULT true,
  	"open_first" boolean DEFAULT true,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_c_t_a_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "at" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_c_t_a_trust_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_money_page_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_money_page_c_t_a_variant" DEFAULT 'applicationDesk',
  	"system_label" varchar,
  	"heading" varchar,
  	"intro" jsonb,
  	"body" jsonb,
  	"media_id" integer,
  	"disclosure" varchar,
  	"anchor" varchar,
  	"presentation_surface" "s" DEFAULT 'paper',
  	"presentation_texture" "t" DEFAULT 'fabric-of-squares',
  	"presentation_spacing" "p" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "posts" ADD COLUMN "content_mode" "enum_posts_content_mode" DEFAULT 'article';
  ALTER TABLE "posts_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content_mode" "enum__posts_v_version_content_mode" DEFAULT 'article';
  ALTER TABLE "_posts_v_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "pages_blocks_money_page_hero_proof_points" ADD CONSTRAINT "pages_blocks_money_page_hero_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_hero_links" ADD CONSTRAINT "pages_blocks_money_page_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_hero" ADD CONSTRAINT "pages_blocks_money_page_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_hero" ADD CONSTRAINT "pages_blocks_money_page_hero_mobile_media_id_media_id_fk" FOREIGN KEY ("mobile_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_hero" ADD CONSTRAINT "pages_blocks_money_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_narrative_links" ADD CONSTRAINT "pages_blocks_money_page_narrative_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_narrative" ADD CONSTRAINT "pages_blocks_money_page_narrative_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_media_split_points" ADD CONSTRAINT "pages_blocks_money_page_media_split_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_media_split_links" ADD CONSTRAINT "pages_blocks_money_page_media_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_media_split" ADD CONSTRAINT "pages_blocks_money_page_media_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_media_split" ADD CONSTRAINT "pages_blocks_money_page_media_split_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_media_split" ADD CONSTRAINT "pages_blocks_money_page_media_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_features_items_links" ADD CONSTRAINT "pages_blocks_money_page_features_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_features_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_features_items" ADD CONSTRAINT "pages_blocks_money_page_features_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_features_items" ADD CONSTRAINT "pages_blocks_money_page_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_features" ADD CONSTRAINT "pages_blocks_money_page_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_process_steps" ADD CONSTRAINT "pages_blocks_money_page_process_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_process_steps" ADD CONSTRAINT "pages_blocks_money_page_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_process_links" ADD CONSTRAINT "pages_blocks_money_page_process_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_process" ADD CONSTRAINT "pages_blocks_money_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_proof_outcomes" ADD CONSTRAINT "pages_blocks_money_page_proof_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_proof_links" ADD CONSTRAINT "pages_blocks_money_page_proof_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_proof" ADD CONSTRAINT "pages_blocks_money_page_proof_source_portrait_id_media_id_fk" FOREIGN KEY ("source_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_proof" ADD CONSTRAINT "pages_blocks_money_page_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_comparison_columns" ADD CONSTRAINT "pages_blocks_money_page_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_comparison_criteria_values" ADD CONSTRAINT "pages_blocks_money_page_comparison_criteria_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_comparison_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_comparison_criteria" ADD CONSTRAINT "pages_blocks_money_page_comparison_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_comparison_links" ADD CONSTRAINT "pages_blocks_money_page_comparison_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_comparison" ADD CONSTRAINT "pages_blocks_money_page_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_disclosure_items_links" ADD CONSTRAINT "pages_blocks_money_page_disclosure_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_disclosure_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_disclosure_items" ADD CONSTRAINT "pages_blocks_money_page_disclosure_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_disclosure_items" ADD CONSTRAINT "pages_blocks_money_page_disclosure_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_disclosure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_disclosure" ADD CONSTRAINT "pages_blocks_money_page_disclosure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_f_a_q_items" ADD CONSTRAINT "pages_blocks_money_page_f_a_q_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_f_a_q"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_f_a_q" ADD CONSTRAINT "pages_blocks_money_page_f_a_q_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_c_t_a_links" ADD CONSTRAINT "pages_blocks_money_page_c_t_a_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_c_t_a_trust_notes" ADD CONSTRAINT "pages_blocks_money_page_c_t_a_trust_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_c_t_a" ADD CONSTRAINT "pages_blocks_money_page_c_t_a_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_money_page_c_t_a" ADD CONSTRAINT "pages_blocks_money_page_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_hero_proof_points" ADD CONSTRAINT "_pages_v_blocks_money_page_hero_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_hero_links" ADD CONSTRAINT "_pages_v_blocks_money_page_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_hero" ADD CONSTRAINT "_pages_v_blocks_money_page_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_hero" ADD CONSTRAINT "_pages_v_blocks_money_page_hero_mobile_media_id_media_id_fk" FOREIGN KEY ("mobile_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_hero" ADD CONSTRAINT "_pages_v_blocks_money_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_narrative_links" ADD CONSTRAINT "_pages_v_blocks_money_page_narrative_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_narrative" ADD CONSTRAINT "_pages_v_blocks_money_page_narrative_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_media_split_points" ADD CONSTRAINT "_pages_v_blocks_money_page_media_split_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_media_split_links" ADD CONSTRAINT "_pages_v_blocks_money_page_media_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_media_split" ADD CONSTRAINT "_pages_v_blocks_money_page_media_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_media_split" ADD CONSTRAINT "_pages_v_blocks_money_page_media_split_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_media_split" ADD CONSTRAINT "_pages_v_blocks_money_page_media_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_features_items_links" ADD CONSTRAINT "_pages_v_blocks_money_page_features_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_features_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_features_items" ADD CONSTRAINT "_pages_v_blocks_money_page_features_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_features_items" ADD CONSTRAINT "_pages_v_blocks_money_page_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_features" ADD CONSTRAINT "_pages_v_blocks_money_page_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_process_steps" ADD CONSTRAINT "_pages_v_blocks_money_page_process_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_process_steps" ADD CONSTRAINT "_pages_v_blocks_money_page_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_process_links" ADD CONSTRAINT "_pages_v_blocks_money_page_process_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_process" ADD CONSTRAINT "_pages_v_blocks_money_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_proof_outcomes" ADD CONSTRAINT "_pages_v_blocks_money_page_proof_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_proof_links" ADD CONSTRAINT "_pages_v_blocks_money_page_proof_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_proof" ADD CONSTRAINT "_pages_v_blocks_money_page_proof_source_portrait_id_media_id_fk" FOREIGN KEY ("source_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_proof" ADD CONSTRAINT "_pages_v_blocks_money_page_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_columns" ADD CONSTRAINT "_pages_v_blocks_money_page_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_criteria_values" ADD CONSTRAINT "_pages_v_blocks_money_page_comparison_criteria_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_comparison_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_criteria" ADD CONSTRAINT "_pages_v_blocks_money_page_comparison_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_links" ADD CONSTRAINT "_pages_v_blocks_money_page_comparison_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_comparison" ADD CONSTRAINT "_pages_v_blocks_money_page_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_disclosure_items_links" ADD CONSTRAINT "_pages_v_blocks_money_page_disclosure_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_disclosure_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_disclosure_items" ADD CONSTRAINT "_pages_v_blocks_money_page_disclosure_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_disclosure_items" ADD CONSTRAINT "_pages_v_blocks_money_page_disclosure_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_disclosure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_disclosure" ADD CONSTRAINT "_pages_v_blocks_money_page_disclosure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_f_a_q_items" ADD CONSTRAINT "_pages_v_blocks_money_page_f_a_q_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_f_a_q"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_f_a_q" ADD CONSTRAINT "_pages_v_blocks_money_page_f_a_q_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_c_t_a_links" ADD CONSTRAINT "_pages_v_blocks_money_page_c_t_a_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_c_t_a_trust_notes" ADD CONSTRAINT "_pages_v_blocks_money_page_c_t_a_trust_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_c_t_a" ADD CONSTRAINT "_pages_v_blocks_money_page_c_t_a_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_money_page_c_t_a" ADD CONSTRAINT "_pages_v_blocks_money_page_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_hero_proof_points" ADD CONSTRAINT "posts_blocks_money_page_hero_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_hero_links" ADD CONSTRAINT "posts_blocks_money_page_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_hero" ADD CONSTRAINT "posts_blocks_money_page_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_hero" ADD CONSTRAINT "posts_blocks_money_page_hero_mobile_media_id_media_id_fk" FOREIGN KEY ("mobile_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_hero" ADD CONSTRAINT "posts_blocks_money_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_narrative_links" ADD CONSTRAINT "posts_blocks_money_page_narrative_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_narrative" ADD CONSTRAINT "posts_blocks_money_page_narrative_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_media_split_points" ADD CONSTRAINT "posts_blocks_money_page_media_split_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_media_split_links" ADD CONSTRAINT "posts_blocks_money_page_media_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_media_split" ADD CONSTRAINT "posts_blocks_money_page_media_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_media_split" ADD CONSTRAINT "posts_blocks_money_page_media_split_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_media_split" ADD CONSTRAINT "posts_blocks_money_page_media_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_features_items_links" ADD CONSTRAINT "posts_blocks_money_page_features_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_features_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_features_items" ADD CONSTRAINT "posts_blocks_money_page_features_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_features_items" ADD CONSTRAINT "posts_blocks_money_page_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_features" ADD CONSTRAINT "posts_blocks_money_page_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_process_steps" ADD CONSTRAINT "posts_blocks_money_page_process_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_process_steps" ADD CONSTRAINT "posts_blocks_money_page_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_process_links" ADD CONSTRAINT "posts_blocks_money_page_process_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_process" ADD CONSTRAINT "posts_blocks_money_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_proof_outcomes" ADD CONSTRAINT "posts_blocks_money_page_proof_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_proof_links" ADD CONSTRAINT "posts_blocks_money_page_proof_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_proof" ADD CONSTRAINT "posts_blocks_money_page_proof_source_portrait_id_media_id_fk" FOREIGN KEY ("source_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_proof" ADD CONSTRAINT "posts_blocks_money_page_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_comparison_columns" ADD CONSTRAINT "posts_blocks_money_page_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_comparison_criteria_values" ADD CONSTRAINT "posts_blocks_money_page_comparison_criteria_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_comparison_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_comparison_criteria" ADD CONSTRAINT "posts_blocks_money_page_comparison_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_comparison_links" ADD CONSTRAINT "posts_blocks_money_page_comparison_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_comparison" ADD CONSTRAINT "posts_blocks_money_page_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_disclosure_items_links" ADD CONSTRAINT "posts_blocks_money_page_disclosure_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_disclosure_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_disclosure_items" ADD CONSTRAINT "posts_blocks_money_page_disclosure_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_disclosure_items" ADD CONSTRAINT "posts_blocks_money_page_disclosure_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_disclosure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_disclosure" ADD CONSTRAINT "posts_blocks_money_page_disclosure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_f_a_q_items" ADD CONSTRAINT "posts_blocks_money_page_f_a_q_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_f_a_q"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_f_a_q" ADD CONSTRAINT "posts_blocks_money_page_f_a_q_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_c_t_a_links" ADD CONSTRAINT "posts_blocks_money_page_c_t_a_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_c_t_a_trust_notes" ADD CONSTRAINT "posts_blocks_money_page_c_t_a_trust_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_c_t_a" ADD CONSTRAINT "posts_blocks_money_page_c_t_a_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_money_page_c_t_a" ADD CONSTRAINT "posts_blocks_money_page_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_hero_proof_points" ADD CONSTRAINT "_posts_v_blocks_money_page_hero_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_hero_links" ADD CONSTRAINT "_posts_v_blocks_money_page_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_hero" ADD CONSTRAINT "_posts_v_blocks_money_page_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_hero" ADD CONSTRAINT "_posts_v_blocks_money_page_hero_mobile_media_id_media_id_fk" FOREIGN KEY ("mobile_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_hero" ADD CONSTRAINT "_posts_v_blocks_money_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_narrative_links" ADD CONSTRAINT "_posts_v_blocks_money_page_narrative_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_narrative" ADD CONSTRAINT "_posts_v_blocks_money_page_narrative_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_media_split_points" ADD CONSTRAINT "_posts_v_blocks_money_page_media_split_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_media_split_links" ADD CONSTRAINT "_posts_v_blocks_money_page_media_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_media_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_media_split" ADD CONSTRAINT "_posts_v_blocks_money_page_media_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_media_split" ADD CONSTRAINT "_posts_v_blocks_money_page_media_split_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_media_split" ADD CONSTRAINT "_posts_v_blocks_money_page_media_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_features_items_links" ADD CONSTRAINT "_posts_v_blocks_money_page_features_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_features_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_features_items" ADD CONSTRAINT "_posts_v_blocks_money_page_features_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_features_items" ADD CONSTRAINT "_posts_v_blocks_money_page_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_features" ADD CONSTRAINT "_posts_v_blocks_money_page_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_process_steps" ADD CONSTRAINT "_posts_v_blocks_money_page_process_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_process_steps" ADD CONSTRAINT "_posts_v_blocks_money_page_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_process_links" ADD CONSTRAINT "_posts_v_blocks_money_page_process_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_process" ADD CONSTRAINT "_posts_v_blocks_money_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_proof_outcomes" ADD CONSTRAINT "_posts_v_blocks_money_page_proof_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_proof_links" ADD CONSTRAINT "_posts_v_blocks_money_page_proof_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_proof" ADD CONSTRAINT "_posts_v_blocks_money_page_proof_source_portrait_id_media_id_fk" FOREIGN KEY ("source_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_proof" ADD CONSTRAINT "_posts_v_blocks_money_page_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_columns" ADD CONSTRAINT "_posts_v_blocks_money_page_comparison_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_criteria_values" ADD CONSTRAINT "_posts_v_blocks_money_page_comparison_criteria_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_comparison_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_criteria" ADD CONSTRAINT "_posts_v_blocks_money_page_comparison_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_links" ADD CONSTRAINT "_posts_v_blocks_money_page_comparison_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_comparison" ADD CONSTRAINT "_posts_v_blocks_money_page_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_disclosure_items_links" ADD CONSTRAINT "_posts_v_blocks_money_page_disclosure_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_disclosure_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_disclosure_items" ADD CONSTRAINT "_posts_v_blocks_money_page_disclosure_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_disclosure_items" ADD CONSTRAINT "_posts_v_blocks_money_page_disclosure_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_disclosure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_disclosure" ADD CONSTRAINT "_posts_v_blocks_money_page_disclosure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_f_a_q_items" ADD CONSTRAINT "_posts_v_blocks_money_page_f_a_q_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_f_a_q"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_f_a_q" ADD CONSTRAINT "_posts_v_blocks_money_page_f_a_q_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_c_t_a_links" ADD CONSTRAINT "_posts_v_blocks_money_page_c_t_a_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_c_t_a_trust_notes" ADD CONSTRAINT "_posts_v_blocks_money_page_c_t_a_trust_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_money_page_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_c_t_a" ADD CONSTRAINT "_posts_v_blocks_money_page_c_t_a_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_money_page_c_t_a" ADD CONSTRAINT "_posts_v_blocks_money_page_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_money_page_hero_proof_points_order_idx" ON "pages_blocks_money_page_hero_proof_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_hero_proof_points_parent_id_idx" ON "pages_blocks_money_page_hero_proof_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_hero_links_order_idx" ON "pages_blocks_money_page_hero_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_hero_links_parent_id_idx" ON "pages_blocks_money_page_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_hero_order_idx" ON "pages_blocks_money_page_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_hero_parent_id_idx" ON "pages_blocks_money_page_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_hero_path_idx" ON "pages_blocks_money_page_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_hero_media_idx" ON "pages_blocks_money_page_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_money_page_hero_mobile_media_idx" ON "pages_blocks_money_page_hero" USING btree ("mobile_media_id");
  CREATE INDEX "pages_blocks_money_page_narrative_links_order_idx" ON "pages_blocks_money_page_narrative_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_narrative_links_parent_id_idx" ON "pages_blocks_money_page_narrative_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_narrative_order_idx" ON "pages_blocks_money_page_narrative" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_narrative_parent_id_idx" ON "pages_blocks_money_page_narrative" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_narrative_path_idx" ON "pages_blocks_money_page_narrative" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_media_split_points_order_idx" ON "pages_blocks_money_page_media_split_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_media_split_points_parent_id_idx" ON "pages_blocks_money_page_media_split_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_media_split_links_order_idx" ON "pages_blocks_money_page_media_split_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_media_split_links_parent_id_idx" ON "pages_blocks_money_page_media_split_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_media_split_order_idx" ON "pages_blocks_money_page_media_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_media_split_parent_id_idx" ON "pages_blocks_money_page_media_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_media_split_path_idx" ON "pages_blocks_money_page_media_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_media_split_media_idx" ON "pages_blocks_money_page_media_split" USING btree ("media_id");
  CREATE INDEX "pages_blocks_money_page_media_split_poster_idx" ON "pages_blocks_money_page_media_split" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_money_page_features_items_links_order_idx" ON "pages_blocks_money_page_features_items_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_features_items_links_parent_id_idx" ON "pages_blocks_money_page_features_items_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_features_items_order_idx" ON "pages_blocks_money_page_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_features_items_parent_id_idx" ON "pages_blocks_money_page_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_features_items_media_idx" ON "pages_blocks_money_page_features_items" USING btree ("media_id");
  CREATE INDEX "pages_blocks_money_page_features_order_idx" ON "pages_blocks_money_page_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_features_parent_id_idx" ON "pages_blocks_money_page_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_features_path_idx" ON "pages_blocks_money_page_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_process_steps_order_idx" ON "pages_blocks_money_page_process_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_process_steps_parent_id_idx" ON "pages_blocks_money_page_process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_process_steps_media_idx" ON "pages_blocks_money_page_process_steps" USING btree ("media_id");
  CREATE INDEX "pages_blocks_money_page_process_links_order_idx" ON "pages_blocks_money_page_process_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_process_links_parent_id_idx" ON "pages_blocks_money_page_process_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_process_order_idx" ON "pages_blocks_money_page_process" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_process_parent_id_idx" ON "pages_blocks_money_page_process" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_process_path_idx" ON "pages_blocks_money_page_process" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_proof_outcomes_order_idx" ON "pages_blocks_money_page_proof_outcomes" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_proof_outcomes_parent_id_idx" ON "pages_blocks_money_page_proof_outcomes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_proof_links_order_idx" ON "pages_blocks_money_page_proof_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_proof_links_parent_id_idx" ON "pages_blocks_money_page_proof_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_proof_order_idx" ON "pages_blocks_money_page_proof" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_proof_parent_id_idx" ON "pages_blocks_money_page_proof" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_proof_path_idx" ON "pages_blocks_money_page_proof" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_proof_source_source_portrait_idx" ON "pages_blocks_money_page_proof" USING btree ("source_portrait_id");
  CREATE INDEX "pages_blocks_money_page_comparison_columns_order_idx" ON "pages_blocks_money_page_comparison_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_comparison_columns_parent_id_idx" ON "pages_blocks_money_page_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_comparison_criteria_values_order_idx" ON "pages_blocks_money_page_comparison_criteria_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_comparison_criteria_values_parent_id_idx" ON "pages_blocks_money_page_comparison_criteria_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_comparison_criteria_order_idx" ON "pages_blocks_money_page_comparison_criteria" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_comparison_criteria_parent_id_idx" ON "pages_blocks_money_page_comparison_criteria" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_comparison_links_order_idx" ON "pages_blocks_money_page_comparison_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_comparison_links_parent_id_idx" ON "pages_blocks_money_page_comparison_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_comparison_order_idx" ON "pages_blocks_money_page_comparison" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_comparison_parent_id_idx" ON "pages_blocks_money_page_comparison" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_comparison_path_idx" ON "pages_blocks_money_page_comparison" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_disclosure_items_links_order_idx" ON "pages_blocks_money_page_disclosure_items_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_disclosure_items_links_parent_id_idx" ON "pages_blocks_money_page_disclosure_items_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_disclosure_items_order_idx" ON "pages_blocks_money_page_disclosure_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_disclosure_items_parent_id_idx" ON "pages_blocks_money_page_disclosure_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_disclosure_items_media_idx" ON "pages_blocks_money_page_disclosure_items" USING btree ("media_id");
  CREATE INDEX "pages_blocks_money_page_disclosure_order_idx" ON "pages_blocks_money_page_disclosure" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_disclosure_parent_id_idx" ON "pages_blocks_money_page_disclosure" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_disclosure_path_idx" ON "pages_blocks_money_page_disclosure" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_f_a_q_items_order_idx" ON "pages_blocks_money_page_f_a_q_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_f_a_q_items_parent_id_idx" ON "pages_blocks_money_page_f_a_q_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_f_a_q_order_idx" ON "pages_blocks_money_page_f_a_q" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_f_a_q_parent_id_idx" ON "pages_blocks_money_page_f_a_q" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_f_a_q_path_idx" ON "pages_blocks_money_page_f_a_q" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_c_t_a_links_order_idx" ON "pages_blocks_money_page_c_t_a_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_c_t_a_links_parent_id_idx" ON "pages_blocks_money_page_c_t_a_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_c_t_a_trust_notes_order_idx" ON "pages_blocks_money_page_c_t_a_trust_notes" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_c_t_a_trust_notes_parent_id_idx" ON "pages_blocks_money_page_c_t_a_trust_notes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_c_t_a_order_idx" ON "pages_blocks_money_page_c_t_a" USING btree ("_order");
  CREATE INDEX "pages_blocks_money_page_c_t_a_parent_id_idx" ON "pages_blocks_money_page_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_money_page_c_t_a_path_idx" ON "pages_blocks_money_page_c_t_a" USING btree ("_path");
  CREATE INDEX "pages_blocks_money_page_c_t_a_media_idx" ON "pages_blocks_money_page_c_t_a" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_money_page_hero_proof_points_order_idx" ON "_pages_v_blocks_money_page_hero_proof_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_hero_proof_points_parent_id_idx" ON "_pages_v_blocks_money_page_hero_proof_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_hero_links_order_idx" ON "_pages_v_blocks_money_page_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_hero_links_parent_id_idx" ON "_pages_v_blocks_money_page_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_hero_order_idx" ON "_pages_v_blocks_money_page_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_hero_parent_id_idx" ON "_pages_v_blocks_money_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_hero_path_idx" ON "_pages_v_blocks_money_page_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_hero_media_idx" ON "_pages_v_blocks_money_page_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_money_page_hero_mobile_media_idx" ON "_pages_v_blocks_money_page_hero" USING btree ("mobile_media_id");
  CREATE INDEX "_pages_v_blocks_money_page_narrative_links_order_idx" ON "_pages_v_blocks_money_page_narrative_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_narrative_links_parent_id_idx" ON "_pages_v_blocks_money_page_narrative_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_narrative_order_idx" ON "_pages_v_blocks_money_page_narrative" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_narrative_parent_id_idx" ON "_pages_v_blocks_money_page_narrative" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_narrative_path_idx" ON "_pages_v_blocks_money_page_narrative" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_points_order_idx" ON "_pages_v_blocks_money_page_media_split_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_points_parent_id_idx" ON "_pages_v_blocks_money_page_media_split_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_links_order_idx" ON "_pages_v_blocks_money_page_media_split_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_links_parent_id_idx" ON "_pages_v_blocks_money_page_media_split_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_order_idx" ON "_pages_v_blocks_money_page_media_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_parent_id_idx" ON "_pages_v_blocks_money_page_media_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_path_idx" ON "_pages_v_blocks_money_page_media_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_media_idx" ON "_pages_v_blocks_money_page_media_split" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_money_page_media_split_poster_idx" ON "_pages_v_blocks_money_page_media_split" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_money_page_features_items_links_order_idx" ON "_pages_v_blocks_money_page_features_items_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_features_items_links_parent_id_idx" ON "_pages_v_blocks_money_page_features_items_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_features_items_order_idx" ON "_pages_v_blocks_money_page_features_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_features_items_parent_id_idx" ON "_pages_v_blocks_money_page_features_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_features_items_media_idx" ON "_pages_v_blocks_money_page_features_items" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_money_page_features_order_idx" ON "_pages_v_blocks_money_page_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_features_parent_id_idx" ON "_pages_v_blocks_money_page_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_features_path_idx" ON "_pages_v_blocks_money_page_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_process_steps_order_idx" ON "_pages_v_blocks_money_page_process_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_process_steps_parent_id_idx" ON "_pages_v_blocks_money_page_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_process_steps_media_idx" ON "_pages_v_blocks_money_page_process_steps" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_money_page_process_links_order_idx" ON "_pages_v_blocks_money_page_process_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_process_links_parent_id_idx" ON "_pages_v_blocks_money_page_process_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_process_order_idx" ON "_pages_v_blocks_money_page_process" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_process_parent_id_idx" ON "_pages_v_blocks_money_page_process" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_process_path_idx" ON "_pages_v_blocks_money_page_process" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_proof_outcomes_order_idx" ON "_pages_v_blocks_money_page_proof_outcomes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_proof_outcomes_parent_id_idx" ON "_pages_v_blocks_money_page_proof_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_proof_links_order_idx" ON "_pages_v_blocks_money_page_proof_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_proof_links_parent_id_idx" ON "_pages_v_blocks_money_page_proof_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_proof_order_idx" ON "_pages_v_blocks_money_page_proof" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_proof_parent_id_idx" ON "_pages_v_blocks_money_page_proof" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_proof_path_idx" ON "_pages_v_blocks_money_page_proof" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_proof_source_source_portrait_idx" ON "_pages_v_blocks_money_page_proof" USING btree ("source_portrait_id");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_columns_order_idx" ON "_pages_v_blocks_money_page_comparison_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_columns_parent_id_idx" ON "_pages_v_blocks_money_page_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_criteria_values_order_idx" ON "_pages_v_blocks_money_page_comparison_criteria_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_criteria_values_parent_id_idx" ON "_pages_v_blocks_money_page_comparison_criteria_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_criteria_order_idx" ON "_pages_v_blocks_money_page_comparison_criteria" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_criteria_parent_id_idx" ON "_pages_v_blocks_money_page_comparison_criteria" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_links_order_idx" ON "_pages_v_blocks_money_page_comparison_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_links_parent_id_idx" ON "_pages_v_blocks_money_page_comparison_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_order_idx" ON "_pages_v_blocks_money_page_comparison" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_parent_id_idx" ON "_pages_v_blocks_money_page_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_comparison_path_idx" ON "_pages_v_blocks_money_page_comparison" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_items_links_order_idx" ON "_pages_v_blocks_money_page_disclosure_items_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_items_links_parent_id_idx" ON "_pages_v_blocks_money_page_disclosure_items_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_items_order_idx" ON "_pages_v_blocks_money_page_disclosure_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_items_parent_id_idx" ON "_pages_v_blocks_money_page_disclosure_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_items_media_idx" ON "_pages_v_blocks_money_page_disclosure_items" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_order_idx" ON "_pages_v_blocks_money_page_disclosure" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_parent_id_idx" ON "_pages_v_blocks_money_page_disclosure" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_disclosure_path_idx" ON "_pages_v_blocks_money_page_disclosure" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_f_a_q_items_order_idx" ON "_pages_v_blocks_money_page_f_a_q_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_f_a_q_items_parent_id_idx" ON "_pages_v_blocks_money_page_f_a_q_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_f_a_q_order_idx" ON "_pages_v_blocks_money_page_f_a_q" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_f_a_q_parent_id_idx" ON "_pages_v_blocks_money_page_f_a_q" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_f_a_q_path_idx" ON "_pages_v_blocks_money_page_f_a_q" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_links_order_idx" ON "_pages_v_blocks_money_page_c_t_a_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_links_parent_id_idx" ON "_pages_v_blocks_money_page_c_t_a_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_trust_notes_order_idx" ON "_pages_v_blocks_money_page_c_t_a_trust_notes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_trust_notes_parent_id_idx" ON "_pages_v_blocks_money_page_c_t_a_trust_notes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_order_idx" ON "_pages_v_blocks_money_page_c_t_a" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_parent_id_idx" ON "_pages_v_blocks_money_page_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_path_idx" ON "_pages_v_blocks_money_page_c_t_a" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_money_page_c_t_a_media_idx" ON "_pages_v_blocks_money_page_c_t_a" USING btree ("media_id");
  CREATE INDEX "posts_blocks_money_page_hero_proof_points_order_idx" ON "posts_blocks_money_page_hero_proof_points" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_hero_proof_points_parent_id_idx" ON "posts_blocks_money_page_hero_proof_points" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_hero_links_order_idx" ON "posts_blocks_money_page_hero_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_hero_links_parent_id_idx" ON "posts_blocks_money_page_hero_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_hero_order_idx" ON "posts_blocks_money_page_hero" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_hero_parent_id_idx" ON "posts_blocks_money_page_hero" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_hero_path_idx" ON "posts_blocks_money_page_hero" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_hero_media_idx" ON "posts_blocks_money_page_hero" USING btree ("media_id");
  CREATE INDEX "posts_blocks_money_page_hero_mobile_media_idx" ON "posts_blocks_money_page_hero" USING btree ("mobile_media_id");
  CREATE INDEX "posts_blocks_money_page_narrative_links_order_idx" ON "posts_blocks_money_page_narrative_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_narrative_links_parent_id_idx" ON "posts_blocks_money_page_narrative_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_narrative_order_idx" ON "posts_blocks_money_page_narrative" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_narrative_parent_id_idx" ON "posts_blocks_money_page_narrative" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_narrative_path_idx" ON "posts_blocks_money_page_narrative" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_media_split_points_order_idx" ON "posts_blocks_money_page_media_split_points" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_media_split_points_parent_id_idx" ON "posts_blocks_money_page_media_split_points" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_media_split_links_order_idx" ON "posts_blocks_money_page_media_split_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_media_split_links_parent_id_idx" ON "posts_blocks_money_page_media_split_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_media_split_order_idx" ON "posts_blocks_money_page_media_split" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_media_split_parent_id_idx" ON "posts_blocks_money_page_media_split" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_media_split_path_idx" ON "posts_blocks_money_page_media_split" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_media_split_media_idx" ON "posts_blocks_money_page_media_split" USING btree ("media_id");
  CREATE INDEX "posts_blocks_money_page_media_split_poster_idx" ON "posts_blocks_money_page_media_split" USING btree ("poster_id");
  CREATE INDEX "posts_blocks_money_page_features_items_links_order_idx" ON "posts_blocks_money_page_features_items_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_features_items_links_parent_id_idx" ON "posts_blocks_money_page_features_items_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_features_items_order_idx" ON "posts_blocks_money_page_features_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_features_items_parent_id_idx" ON "posts_blocks_money_page_features_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_features_items_media_idx" ON "posts_blocks_money_page_features_items" USING btree ("media_id");
  CREATE INDEX "posts_blocks_money_page_features_order_idx" ON "posts_blocks_money_page_features" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_features_parent_id_idx" ON "posts_blocks_money_page_features" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_features_path_idx" ON "posts_blocks_money_page_features" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_process_steps_order_idx" ON "posts_blocks_money_page_process_steps" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_process_steps_parent_id_idx" ON "posts_blocks_money_page_process_steps" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_process_steps_media_idx" ON "posts_blocks_money_page_process_steps" USING btree ("media_id");
  CREATE INDEX "posts_blocks_money_page_process_links_order_idx" ON "posts_blocks_money_page_process_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_process_links_parent_id_idx" ON "posts_blocks_money_page_process_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_process_order_idx" ON "posts_blocks_money_page_process" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_process_parent_id_idx" ON "posts_blocks_money_page_process" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_process_path_idx" ON "posts_blocks_money_page_process" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_proof_outcomes_order_idx" ON "posts_blocks_money_page_proof_outcomes" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_proof_outcomes_parent_id_idx" ON "posts_blocks_money_page_proof_outcomes" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_proof_links_order_idx" ON "posts_blocks_money_page_proof_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_proof_links_parent_id_idx" ON "posts_blocks_money_page_proof_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_proof_order_idx" ON "posts_blocks_money_page_proof" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_proof_parent_id_idx" ON "posts_blocks_money_page_proof" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_proof_path_idx" ON "posts_blocks_money_page_proof" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_proof_source_source_portrait_idx" ON "posts_blocks_money_page_proof" USING btree ("source_portrait_id");
  CREATE INDEX "posts_blocks_money_page_comparison_columns_order_idx" ON "posts_blocks_money_page_comparison_columns" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_comparison_columns_parent_id_idx" ON "posts_blocks_money_page_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_comparison_criteria_values_order_idx" ON "posts_blocks_money_page_comparison_criteria_values" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_comparison_criteria_values_parent_id_idx" ON "posts_blocks_money_page_comparison_criteria_values" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_comparison_criteria_order_idx" ON "posts_blocks_money_page_comparison_criteria" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_comparison_criteria_parent_id_idx" ON "posts_blocks_money_page_comparison_criteria" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_comparison_links_order_idx" ON "posts_blocks_money_page_comparison_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_comparison_links_parent_id_idx" ON "posts_blocks_money_page_comparison_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_comparison_order_idx" ON "posts_blocks_money_page_comparison" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_comparison_parent_id_idx" ON "posts_blocks_money_page_comparison" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_comparison_path_idx" ON "posts_blocks_money_page_comparison" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_disclosure_items_links_order_idx" ON "posts_blocks_money_page_disclosure_items_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_disclosure_items_links_parent_id_idx" ON "posts_blocks_money_page_disclosure_items_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_disclosure_items_order_idx" ON "posts_blocks_money_page_disclosure_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_disclosure_items_parent_id_idx" ON "posts_blocks_money_page_disclosure_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_disclosure_items_media_idx" ON "posts_blocks_money_page_disclosure_items" USING btree ("media_id");
  CREATE INDEX "posts_blocks_money_page_disclosure_order_idx" ON "posts_blocks_money_page_disclosure" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_disclosure_parent_id_idx" ON "posts_blocks_money_page_disclosure" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_disclosure_path_idx" ON "posts_blocks_money_page_disclosure" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_f_a_q_items_order_idx" ON "posts_blocks_money_page_f_a_q_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_f_a_q_items_parent_id_idx" ON "posts_blocks_money_page_f_a_q_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_f_a_q_order_idx" ON "posts_blocks_money_page_f_a_q" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_f_a_q_parent_id_idx" ON "posts_blocks_money_page_f_a_q" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_f_a_q_path_idx" ON "posts_blocks_money_page_f_a_q" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_c_t_a_links_order_idx" ON "posts_blocks_money_page_c_t_a_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_c_t_a_links_parent_id_idx" ON "posts_blocks_money_page_c_t_a_links" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_c_t_a_trust_notes_order_idx" ON "posts_blocks_money_page_c_t_a_trust_notes" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_c_t_a_trust_notes_parent_id_idx" ON "posts_blocks_money_page_c_t_a_trust_notes" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_c_t_a_order_idx" ON "posts_blocks_money_page_c_t_a" USING btree ("_order");
  CREATE INDEX "posts_blocks_money_page_c_t_a_parent_id_idx" ON "posts_blocks_money_page_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_money_page_c_t_a_path_idx" ON "posts_blocks_money_page_c_t_a" USING btree ("_path");
  CREATE INDEX "posts_blocks_money_page_c_t_a_media_idx" ON "posts_blocks_money_page_c_t_a" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_money_page_hero_proof_points_order_idx" ON "_posts_v_blocks_money_page_hero_proof_points" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_hero_proof_points_parent_id_idx" ON "_posts_v_blocks_money_page_hero_proof_points" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_hero_links_order_idx" ON "_posts_v_blocks_money_page_hero_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_hero_links_parent_id_idx" ON "_posts_v_blocks_money_page_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_hero_order_idx" ON "_posts_v_blocks_money_page_hero" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_hero_parent_id_idx" ON "_posts_v_blocks_money_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_hero_path_idx" ON "_posts_v_blocks_money_page_hero" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_hero_media_idx" ON "_posts_v_blocks_money_page_hero" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_money_page_hero_mobile_media_idx" ON "_posts_v_blocks_money_page_hero" USING btree ("mobile_media_id");
  CREATE INDEX "_posts_v_blocks_money_page_narrative_links_order_idx" ON "_posts_v_blocks_money_page_narrative_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_narrative_links_parent_id_idx" ON "_posts_v_blocks_money_page_narrative_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_narrative_order_idx" ON "_posts_v_blocks_money_page_narrative" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_narrative_parent_id_idx" ON "_posts_v_blocks_money_page_narrative" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_narrative_path_idx" ON "_posts_v_blocks_money_page_narrative" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_points_order_idx" ON "_posts_v_blocks_money_page_media_split_points" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_points_parent_id_idx" ON "_posts_v_blocks_money_page_media_split_points" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_links_order_idx" ON "_posts_v_blocks_money_page_media_split_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_links_parent_id_idx" ON "_posts_v_blocks_money_page_media_split_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_order_idx" ON "_posts_v_blocks_money_page_media_split" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_parent_id_idx" ON "_posts_v_blocks_money_page_media_split" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_path_idx" ON "_posts_v_blocks_money_page_media_split" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_media_idx" ON "_posts_v_blocks_money_page_media_split" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_money_page_media_split_poster_idx" ON "_posts_v_blocks_money_page_media_split" USING btree ("poster_id");
  CREATE INDEX "_posts_v_blocks_money_page_features_items_links_order_idx" ON "_posts_v_blocks_money_page_features_items_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_features_items_links_parent_id_idx" ON "_posts_v_blocks_money_page_features_items_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_features_items_order_idx" ON "_posts_v_blocks_money_page_features_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_features_items_parent_id_idx" ON "_posts_v_blocks_money_page_features_items" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_features_items_media_idx" ON "_posts_v_blocks_money_page_features_items" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_money_page_features_order_idx" ON "_posts_v_blocks_money_page_features" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_features_parent_id_idx" ON "_posts_v_blocks_money_page_features" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_features_path_idx" ON "_posts_v_blocks_money_page_features" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_process_steps_order_idx" ON "_posts_v_blocks_money_page_process_steps" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_process_steps_parent_id_idx" ON "_posts_v_blocks_money_page_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_process_steps_media_idx" ON "_posts_v_blocks_money_page_process_steps" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_money_page_process_links_order_idx" ON "_posts_v_blocks_money_page_process_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_process_links_parent_id_idx" ON "_posts_v_blocks_money_page_process_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_process_order_idx" ON "_posts_v_blocks_money_page_process" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_process_parent_id_idx" ON "_posts_v_blocks_money_page_process" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_process_path_idx" ON "_posts_v_blocks_money_page_process" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_proof_outcomes_order_idx" ON "_posts_v_blocks_money_page_proof_outcomes" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_proof_outcomes_parent_id_idx" ON "_posts_v_blocks_money_page_proof_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_proof_links_order_idx" ON "_posts_v_blocks_money_page_proof_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_proof_links_parent_id_idx" ON "_posts_v_blocks_money_page_proof_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_proof_order_idx" ON "_posts_v_blocks_money_page_proof" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_proof_parent_id_idx" ON "_posts_v_blocks_money_page_proof" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_proof_path_idx" ON "_posts_v_blocks_money_page_proof" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_proof_source_source_portrait_idx" ON "_posts_v_blocks_money_page_proof" USING btree ("source_portrait_id");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_columns_order_idx" ON "_posts_v_blocks_money_page_comparison_columns" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_columns_parent_id_idx" ON "_posts_v_blocks_money_page_comparison_columns" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_criteria_values_order_idx" ON "_posts_v_blocks_money_page_comparison_criteria_values" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_criteria_values_parent_id_idx" ON "_posts_v_blocks_money_page_comparison_criteria_values" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_criteria_order_idx" ON "_posts_v_blocks_money_page_comparison_criteria" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_criteria_parent_id_idx" ON "_posts_v_blocks_money_page_comparison_criteria" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_links_order_idx" ON "_posts_v_blocks_money_page_comparison_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_links_parent_id_idx" ON "_posts_v_blocks_money_page_comparison_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_order_idx" ON "_posts_v_blocks_money_page_comparison" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_parent_id_idx" ON "_posts_v_blocks_money_page_comparison" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_comparison_path_idx" ON "_posts_v_blocks_money_page_comparison" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_items_links_order_idx" ON "_posts_v_blocks_money_page_disclosure_items_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_items_links_parent_id_idx" ON "_posts_v_blocks_money_page_disclosure_items_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_items_order_idx" ON "_posts_v_blocks_money_page_disclosure_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_items_parent_id_idx" ON "_posts_v_blocks_money_page_disclosure_items" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_items_media_idx" ON "_posts_v_blocks_money_page_disclosure_items" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_order_idx" ON "_posts_v_blocks_money_page_disclosure" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_parent_id_idx" ON "_posts_v_blocks_money_page_disclosure" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_disclosure_path_idx" ON "_posts_v_blocks_money_page_disclosure" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_f_a_q_items_order_idx" ON "_posts_v_blocks_money_page_f_a_q_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_f_a_q_items_parent_id_idx" ON "_posts_v_blocks_money_page_f_a_q_items" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_f_a_q_order_idx" ON "_posts_v_blocks_money_page_f_a_q" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_f_a_q_parent_id_idx" ON "_posts_v_blocks_money_page_f_a_q" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_f_a_q_path_idx" ON "_posts_v_blocks_money_page_f_a_q" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_links_order_idx" ON "_posts_v_blocks_money_page_c_t_a_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_links_parent_id_idx" ON "_posts_v_blocks_money_page_c_t_a_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_trust_notes_order_idx" ON "_posts_v_blocks_money_page_c_t_a_trust_notes" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_trust_notes_parent_id_idx" ON "_posts_v_blocks_money_page_c_t_a_trust_notes" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_order_idx" ON "_posts_v_blocks_money_page_c_t_a" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_parent_id_idx" ON "_posts_v_blocks_money_page_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_path_idx" ON "_posts_v_blocks_money_page_c_t_a" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_money_page_c_t_a_media_idx" ON "_posts_v_blocks_money_page_c_t_a" USING btree ("media_id");
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_rels_pages_id_idx" ON "posts_rels" USING btree ("pages_id");
  CREATE INDEX "_posts_v_rels_pages_id_idx" ON "_posts_v_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_money_page_hero_proof_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_narrative_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_narrative" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_media_split_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_media_split_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_media_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_features_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_process_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_proof_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_proof_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_proof" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_comparison_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_comparison_criteria_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_comparison_criteria" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_comparison_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_comparison" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_disclosure_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_disclosure_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_disclosure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_f_a_q_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_f_a_q" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_c_t_a_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_c_t_a_trust_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_money_page_c_t_a" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_hero_proof_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_narrative_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_narrative" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_media_split_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_media_split_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_media_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_features_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_process_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_proof_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_proof_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_proof" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_criteria_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_criteria" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_comparison_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_comparison" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_disclosure_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_disclosure_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_disclosure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_f_a_q_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_f_a_q" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_c_t_a_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_c_t_a_trust_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_money_page_c_t_a" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_hero_proof_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_narrative_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_narrative" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_media_split_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_media_split_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_media_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_features_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_process_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_proof_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_proof_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_proof" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_comparison_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_comparison_criteria_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_comparison_criteria" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_comparison_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_comparison" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_disclosure_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_disclosure_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_disclosure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_f_a_q_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_f_a_q" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_c_t_a_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_c_t_a_trust_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_money_page_c_t_a" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_hero_proof_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_narrative_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_narrative" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_media_split_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_media_split_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_media_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_features_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_process_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_proof_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_proof_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_proof" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_criteria_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_criteria" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_comparison_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_comparison" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_disclosure_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_disclosure_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_disclosure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_f_a_q_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_f_a_q" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_c_t_a_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_c_t_a_trust_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_money_page_c_t_a" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_money_page_hero_proof_points" CASCADE;
  DROP TABLE "pages_blocks_money_page_hero_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_hero" CASCADE;
  DROP TABLE "pages_blocks_money_page_narrative_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_narrative" CASCADE;
  DROP TABLE "pages_blocks_money_page_media_split_points" CASCADE;
  DROP TABLE "pages_blocks_money_page_media_split_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_media_split" CASCADE;
  DROP TABLE "pages_blocks_money_page_features_items_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_features_items" CASCADE;
  DROP TABLE "pages_blocks_money_page_features" CASCADE;
  DROP TABLE "pages_blocks_money_page_process_steps" CASCADE;
  DROP TABLE "pages_blocks_money_page_process_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_process" CASCADE;
  DROP TABLE "pages_blocks_money_page_proof_outcomes" CASCADE;
  DROP TABLE "pages_blocks_money_page_proof_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_proof" CASCADE;
  DROP TABLE "pages_blocks_money_page_comparison_columns" CASCADE;
  DROP TABLE "pages_blocks_money_page_comparison_criteria_values" CASCADE;
  DROP TABLE "pages_blocks_money_page_comparison_criteria" CASCADE;
  DROP TABLE "pages_blocks_money_page_comparison_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_comparison" CASCADE;
  DROP TABLE "pages_blocks_money_page_disclosure_items_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_disclosure_items" CASCADE;
  DROP TABLE "pages_blocks_money_page_disclosure" CASCADE;
  DROP TABLE "pages_blocks_money_page_f_a_q_items" CASCADE;
  DROP TABLE "pages_blocks_money_page_f_a_q" CASCADE;
  DROP TABLE "pages_blocks_money_page_c_t_a_links" CASCADE;
  DROP TABLE "pages_blocks_money_page_c_t_a_trust_notes" CASCADE;
  DROP TABLE "pages_blocks_money_page_c_t_a" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_hero_proof_points" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_narrative_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_narrative" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_media_split_points" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_media_split_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_media_split" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_features_items_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_features" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_process_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_process_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_process" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_proof_outcomes" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_proof_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_proof" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_comparison_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_comparison_criteria_values" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_comparison_criteria" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_comparison_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_comparison" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_disclosure_items_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_disclosure_items" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_disclosure" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_f_a_q_items" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_f_a_q" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_c_t_a_links" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_c_t_a_trust_notes" CASCADE;
  DROP TABLE "_pages_v_blocks_money_page_c_t_a" CASCADE;
  DROP TABLE "posts_blocks_money_page_hero_proof_points" CASCADE;
  DROP TABLE "posts_blocks_money_page_hero_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_hero" CASCADE;
  DROP TABLE "posts_blocks_money_page_narrative_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_narrative" CASCADE;
  DROP TABLE "posts_blocks_money_page_media_split_points" CASCADE;
  DROP TABLE "posts_blocks_money_page_media_split_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_media_split" CASCADE;
  DROP TABLE "posts_blocks_money_page_features_items_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_features_items" CASCADE;
  DROP TABLE "posts_blocks_money_page_features" CASCADE;
  DROP TABLE "posts_blocks_money_page_process_steps" CASCADE;
  DROP TABLE "posts_blocks_money_page_process_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_process" CASCADE;
  DROP TABLE "posts_blocks_money_page_proof_outcomes" CASCADE;
  DROP TABLE "posts_blocks_money_page_proof_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_proof" CASCADE;
  DROP TABLE "posts_blocks_money_page_comparison_columns" CASCADE;
  DROP TABLE "posts_blocks_money_page_comparison_criteria_values" CASCADE;
  DROP TABLE "posts_blocks_money_page_comparison_criteria" CASCADE;
  DROP TABLE "posts_blocks_money_page_comparison_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_comparison" CASCADE;
  DROP TABLE "posts_blocks_money_page_disclosure_items_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_disclosure_items" CASCADE;
  DROP TABLE "posts_blocks_money_page_disclosure" CASCADE;
  DROP TABLE "posts_blocks_money_page_f_a_q_items" CASCADE;
  DROP TABLE "posts_blocks_money_page_f_a_q" CASCADE;
  DROP TABLE "posts_blocks_money_page_c_t_a_links" CASCADE;
  DROP TABLE "posts_blocks_money_page_c_t_a_trust_notes" CASCADE;
  DROP TABLE "posts_blocks_money_page_c_t_a" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_hero_proof_points" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_hero_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_hero" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_narrative_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_narrative" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_media_split_points" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_media_split_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_media_split" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_features_items_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_features_items" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_features" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_process_steps" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_process_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_process" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_proof_outcomes" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_proof_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_proof" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_comparison_columns" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_comparison_criteria_values" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_comparison_criteria" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_comparison_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_comparison" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_disclosure_items_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_disclosure_items" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_disclosure" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_f_a_q_items" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_f_a_q" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_c_t_a_links" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_c_t_a_trust_notes" CASCADE;
  DROP TABLE "_posts_v_blocks_money_page_c_t_a" CASCADE;
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_pages_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_pages_fk";
  
  DROP INDEX "posts_rels_pages_id_idx";
  DROP INDEX "_posts_v_rels_pages_id_idx";
  ALTER TABLE "posts" DROP COLUMN "content_mode";
  ALTER TABLE "posts_rels" DROP COLUMN "pages_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content_mode";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."at";
  DROP TYPE "public"."enum_pages_blocks_money_page_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_hero_heading_level";
  DROP TYPE "public"."s";
  DROP TYPE "public"."t";
  DROP TYPE "public"."p";
  DROP TYPE "public"."enum_pages_blocks_money_page_narrative_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_media_split_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_media_split_video_playback";
  DROP TYPE "public"."enum_pages_blocks_money_page_features_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_process_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_proof_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_comparison_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_disclosure_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_f_a_q_variant";
  DROP TYPE "public"."enum_pages_blocks_money_page_c_t_a_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_hero_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_narrative_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_media_split_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_media_split_video_playback";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_features_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_process_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_proof_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_comparison_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_disclosure_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_f_a_q_variant";
  DROP TYPE "public"."enum__pages_v_blocks_money_page_c_t_a_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_hero_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_hero_heading_level";
  DROP TYPE "public"."enum_posts_blocks_money_page_narrative_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_media_split_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_media_split_video_playback";
  DROP TYPE "public"."enum_posts_blocks_money_page_features_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_process_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_proof_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_comparison_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_disclosure_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_f_a_q_variant";
  DROP TYPE "public"."enum_posts_blocks_money_page_c_t_a_variant";
  DROP TYPE "public"."enum_posts_content_mode";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_hero_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_hero_heading_level";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_narrative_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_media_split_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_media_split_video_playback";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_features_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_process_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_proof_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_comparison_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_disclosure_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_f_a_q_variant";
  DROP TYPE "public"."enum__posts_v_blocks_money_page_c_t_a_variant";
  DROP TYPE "public"."enum__posts_v_version_content_mode";`)
}
