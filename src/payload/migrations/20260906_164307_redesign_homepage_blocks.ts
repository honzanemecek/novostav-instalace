import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_process_variant" AS ENUM('slab', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_layout" AS ENUM('trades', 'rows');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum__pages_v_blocks_process_variant" AS ENUM('slab', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_layout" AS ENUM('trades', 'rows');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum_services_blocks_process_variant" AS ENUM('slab', 'plain');
  CREATE TYPE "public"."enum_services_blocks_cta_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum__services_v_blocks_process_variant" AS ENUM('slab', 'plain');
  CREATE TYPE "public"."enum__services_v_blocks_cta_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum_projects_blocks_cta_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum__projects_v_blocks_cta_variant" AS ENUM('plain', 'slab');
  CREATE TABLE "pages_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_process" ADD COLUMN "variant" "enum_pages_blocks_process_variant" DEFAULT 'slab';
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "layout" "enum_pages_blocks_services_grid_layout" DEFAULT 'trades';
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "columns" "enum_pages_blocks_services_grid_columns" DEFAULT '3';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "variant" "enum_pages_blocks_cta_variant" DEFAULT 'plain';
  ALTER TABLE "pages" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_process" ADD COLUMN "variant" "enum__pages_v_blocks_process_variant" DEFAULT 'slab';
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "layout" "enum__pages_v_blocks_services_grid_layout" DEFAULT 'trades';
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "columns" "enum__pages_v_blocks_services_grid_columns" DEFAULT '3';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'plain';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "services_blocks_process" ADD COLUMN "variant" "enum_services_blocks_process_variant" DEFAULT 'slab';
  ALTER TABLE "services_blocks_cta" ADD COLUMN "variant" "enum_services_blocks_cta_variant" DEFAULT 'plain';
  ALTER TABLE "_services_v_blocks_process" ADD COLUMN "variant" "enum__services_v_blocks_process_variant" DEFAULT 'slab';
  ALTER TABLE "_services_v_blocks_cta" ADD COLUMN "variant" "enum__services_v_blocks_cta_variant" DEFAULT 'plain';
  ALTER TABLE "projects_blocks_cta" ADD COLUMN "variant" "enum_projects_blocks_cta_variant" DEFAULT 'plain';
  ALTER TABLE "_projects_v_blocks_cta" ADD COLUMN "variant" "enum__projects_v_blocks_cta_variant" DEFAULT 'plain';
  ALTER TABLE "pages_hero_facts" ADD CONSTRAINT "pages_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_facts" ADD CONSTRAINT "_pages_v_version_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_facts_order_idx" ON "pages_hero_facts" USING btree ("_order");
  CREATE INDEX "pages_hero_facts_parent_id_idx" ON "pages_hero_facts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_facts_order_idx" ON "_pages_v_version_hero_facts" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_facts_parent_id_idx" ON "_pages_v_version_hero_facts" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_facts" CASCADE;
  DROP TABLE "_pages_v_version_hero_facts" CASCADE;
  ALTER TABLE "pages_blocks_process" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "pages" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "_pages_v_blocks_process" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "services_blocks_process" DROP COLUMN "variant";
  ALTER TABLE "services_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "_services_v_blocks_process" DROP COLUMN "variant";
  ALTER TABLE "_services_v_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "projects_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "_projects_v_blocks_cta" DROP COLUMN "variant";
  DROP TYPE "public"."enum_pages_blocks_process_variant";
  DROP TYPE "public"."enum_pages_blocks_services_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_services_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_process_variant";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum_services_blocks_process_variant";
  DROP TYPE "public"."enum_services_blocks_cta_variant";
  DROP TYPE "public"."enum__services_v_blocks_process_variant";
  DROP TYPE "public"."enum__services_v_blocks_cta_variant";
  DROP TYPE "public"."enum_projects_blocks_cta_variant";
  DROP TYPE "public"."enum__projects_v_blocks_cta_variant";`)
}
