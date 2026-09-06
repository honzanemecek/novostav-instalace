import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_photo_strip_source" AS ENUM('latest', 'featured', 'service', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_photo_strip_limit" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_related_services_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum__pages_v_blocks_photo_strip_source" AS ENUM('latest', 'featured', 'service', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_photo_strip_limit" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_related_services_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum_services_blocks_photo_strip_source" AS ENUM('latest', 'featured', 'service', 'manual');
  CREATE TYPE "public"."enum_services_blocks_photo_strip_limit" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_services_blocks_related_services_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum__services_v_blocks_photo_strip_source" AS ENUM('latest', 'featured', 'service', 'manual');
  CREATE TYPE "public"."enum__services_v_blocks_photo_strip_limit" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__services_v_blocks_related_services_variant" AS ENUM('plain', 'slab');
  CREATE TYPE "public"."enum_projects_blocks_photo_strip_source" AS ENUM('latest', 'featured', 'service', 'manual');
  CREATE TYPE "public"."enum_projects_blocks_photo_strip_limit" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__projects_v_blocks_photo_strip_source" AS ENUM('latest', 'featured', 'service', 'manual');
  CREATE TYPE "public"."enum__projects_v_blocks_photo_strip_limit" AS ENUM('2', '3');
  CREATE TABLE "pages_blocks_photo_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_photo_strip_source" DEFAULT 'latest',
  	"limit" "enum_pages_blocks_photo_strip_limit" DEFAULT '3',
  	"plain" boolean DEFAULT true,
  	"service_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_related_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_related_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"variant" "enum_pages_blocks_related_services_variant" DEFAULT 'plain',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_photo_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_photo_strip_source" DEFAULT 'latest',
  	"limit" "enum__pages_v_blocks_photo_strip_limit" DEFAULT '3',
  	"plain" boolean DEFAULT true,
  	"service_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_related_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_id" integer,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_related_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"variant" "enum__pages_v_blocks_related_services_variant" DEFAULT 'plain',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_photo_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "services_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_services_blocks_photo_strip_source" DEFAULT 'latest',
  	"limit" "enum_services_blocks_photo_strip_limit" DEFAULT '3',
  	"plain" boolean DEFAULT true,
  	"service_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_feature_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "services_blocks_related_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer,
  	"note" varchar
  );
  
  CREATE TABLE "services_blocks_related_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"variant" "enum_services_blocks_related_services_variant" DEFAULT 'plain',
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_photo_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__services_v_blocks_photo_strip_source" DEFAULT 'latest',
  	"limit" "enum__services_v_blocks_photo_strip_limit" DEFAULT '3',
  	"plain" boolean DEFAULT true,
  	"service_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_feature_grid_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_related_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_id" integer,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_related_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"variant" "enum__services_v_blocks_related_services_variant" DEFAULT 'plain',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_photo_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "projects_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_projects_blocks_photo_strip_source" DEFAULT 'latest',
  	"limit" "enum_projects_blocks_photo_strip_limit" DEFAULT '3',
  	"plain" boolean DEFAULT true,
  	"service_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_photo_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__projects_v_blocks_photo_strip_source" DEFAULT 'latest',
  	"limit" "enum__projects_v_blocks_photo_strip_limit" DEFAULT '3',
  	"plain" boolean DEFAULT true,
  	"service_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "default_open_first" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "default_open_first" boolean DEFAULT true;
  ALTER TABLE "services_blocks_faq" ADD COLUMN "anchor" varchar;
  ALTER TABLE "services_blocks_faq" ADD COLUMN "default_open_first" boolean DEFAULT true;
  ALTER TABLE "_services_v_blocks_faq" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_services_v_blocks_faq" ADD COLUMN "default_open_first" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_photo_strip_items" ADD CONSTRAINT "pages_blocks_photo_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip_items" ADD CONSTRAINT "pages_blocks_photo_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip" ADD CONSTRAINT "pages_blocks_photo_strip_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip" ADD CONSTRAINT "pages_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items_tags" ADD CONSTRAINT "pages_blocks_feature_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_services_items" ADD CONSTRAINT "pages_blocks_related_services_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_services_items" ADD CONSTRAINT "pages_blocks_related_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_related_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_services" ADD CONSTRAINT "pages_blocks_related_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photo_strip_items" ADD CONSTRAINT "_pages_v_blocks_photo_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photo_strip_items" ADD CONSTRAINT "_pages_v_blocks_photo_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photo_strip" ADD CONSTRAINT "_pages_v_blocks_photo_strip_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photo_strip" ADD CONSTRAINT "_pages_v_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items_tags" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_related_services_items" ADD CONSTRAINT "_pages_v_blocks_related_services_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_related_services_items" ADD CONSTRAINT "_pages_v_blocks_related_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_related_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_related_services" ADD CONSTRAINT "_pages_v_blocks_related_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_photo_strip_items" ADD CONSTRAINT "services_blocks_photo_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_photo_strip_items" ADD CONSTRAINT "services_blocks_photo_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_photo_strip" ADD CONSTRAINT "services_blocks_photo_strip_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_photo_strip" ADD CONSTRAINT "services_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_feature_grid_items_tags" ADD CONSTRAINT "services_blocks_feature_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_related_services_items" ADD CONSTRAINT "services_blocks_related_services_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_related_services_items" ADD CONSTRAINT "services_blocks_related_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_related_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_related_services" ADD CONSTRAINT "services_blocks_related_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_photo_strip_items" ADD CONSTRAINT "_services_v_blocks_photo_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_photo_strip_items" ADD CONSTRAINT "_services_v_blocks_photo_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_photo_strip" ADD CONSTRAINT "_services_v_blocks_photo_strip_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_photo_strip" ADD CONSTRAINT "_services_v_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_feature_grid_items_tags" ADD CONSTRAINT "_services_v_blocks_feature_grid_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_related_services_items" ADD CONSTRAINT "_services_v_blocks_related_services_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_related_services_items" ADD CONSTRAINT "_services_v_blocks_related_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_related_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_related_services" ADD CONSTRAINT "_services_v_blocks_related_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_photo_strip_items" ADD CONSTRAINT "projects_blocks_photo_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_photo_strip_items" ADD CONSTRAINT "projects_blocks_photo_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_photo_strip" ADD CONSTRAINT "projects_blocks_photo_strip_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_photo_strip" ADD CONSTRAINT "projects_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_photo_strip_items" ADD CONSTRAINT "_projects_v_blocks_photo_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_photo_strip_items" ADD CONSTRAINT "_projects_v_blocks_photo_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_photo_strip" ADD CONSTRAINT "_projects_v_blocks_photo_strip_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_photo_strip" ADD CONSTRAINT "_projects_v_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_photo_strip_items_order_idx" ON "pages_blocks_photo_strip_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_strip_items_parent_id_idx" ON "pages_blocks_photo_strip_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_strip_items_image_idx" ON "pages_blocks_photo_strip_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_photo_strip_order_idx" ON "pages_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_strip_parent_id_idx" ON "pages_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_strip_path_idx" ON "pages_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_photo_strip_service_idx" ON "pages_blocks_photo_strip" USING btree ("service_id");
  CREATE INDEX "pages_blocks_feature_grid_items_tags_order_idx" ON "pages_blocks_feature_grid_items_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_items_tags_parent_id_idx" ON "pages_blocks_feature_grid_items_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_services_items_order_idx" ON "pages_blocks_related_services_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_related_services_items_parent_id_idx" ON "pages_blocks_related_services_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_services_items_service_idx" ON "pages_blocks_related_services_items" USING btree ("service_id");
  CREATE INDEX "pages_blocks_related_services_order_idx" ON "pages_blocks_related_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_related_services_parent_id_idx" ON "pages_blocks_related_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_services_path_idx" ON "pages_blocks_related_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_photo_strip_items_order_idx" ON "_pages_v_blocks_photo_strip_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_photo_strip_items_parent_id_idx" ON "_pages_v_blocks_photo_strip_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_photo_strip_items_image_idx" ON "_pages_v_blocks_photo_strip_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_photo_strip_order_idx" ON "_pages_v_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_photo_strip_parent_id_idx" ON "_pages_v_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_photo_strip_path_idx" ON "_pages_v_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_photo_strip_service_idx" ON "_pages_v_blocks_photo_strip" USING btree ("service_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_tags_order_idx" ON "_pages_v_blocks_feature_grid_items_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_tags_parent_id_idx" ON "_pages_v_blocks_feature_grid_items_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_related_services_items_order_idx" ON "_pages_v_blocks_related_services_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_related_services_items_parent_id_idx" ON "_pages_v_blocks_related_services_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_related_services_items_service_idx" ON "_pages_v_blocks_related_services_items" USING btree ("service_id");
  CREATE INDEX "_pages_v_blocks_related_services_order_idx" ON "_pages_v_blocks_related_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_related_services_parent_id_idx" ON "_pages_v_blocks_related_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_related_services_path_idx" ON "_pages_v_blocks_related_services" USING btree ("_path");
  CREATE INDEX "services_blocks_photo_strip_items_order_idx" ON "services_blocks_photo_strip_items" USING btree ("_order");
  CREATE INDEX "services_blocks_photo_strip_items_parent_id_idx" ON "services_blocks_photo_strip_items" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_photo_strip_items_image_idx" ON "services_blocks_photo_strip_items" USING btree ("image_id");
  CREATE INDEX "services_blocks_photo_strip_order_idx" ON "services_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "services_blocks_photo_strip_parent_id_idx" ON "services_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_photo_strip_path_idx" ON "services_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "services_blocks_photo_strip_service_idx" ON "services_blocks_photo_strip" USING btree ("service_id");
  CREATE INDEX "services_blocks_feature_grid_items_tags_order_idx" ON "services_blocks_feature_grid_items_tags" USING btree ("_order");
  CREATE INDEX "services_blocks_feature_grid_items_tags_parent_id_idx" ON "services_blocks_feature_grid_items_tags" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_related_services_items_order_idx" ON "services_blocks_related_services_items" USING btree ("_order");
  CREATE INDEX "services_blocks_related_services_items_parent_id_idx" ON "services_blocks_related_services_items" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_related_services_items_service_idx" ON "services_blocks_related_services_items" USING btree ("service_id");
  CREATE INDEX "services_blocks_related_services_order_idx" ON "services_blocks_related_services" USING btree ("_order");
  CREATE INDEX "services_blocks_related_services_parent_id_idx" ON "services_blocks_related_services" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_related_services_path_idx" ON "services_blocks_related_services" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_photo_strip_items_order_idx" ON "_services_v_blocks_photo_strip_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_photo_strip_items_parent_id_idx" ON "_services_v_blocks_photo_strip_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_photo_strip_items_image_idx" ON "_services_v_blocks_photo_strip_items" USING btree ("image_id");
  CREATE INDEX "_services_v_blocks_photo_strip_order_idx" ON "_services_v_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_photo_strip_parent_id_idx" ON "_services_v_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_photo_strip_path_idx" ON "_services_v_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_photo_strip_service_idx" ON "_services_v_blocks_photo_strip" USING btree ("service_id");
  CREATE INDEX "_services_v_blocks_feature_grid_items_tags_order_idx" ON "_services_v_blocks_feature_grid_items_tags" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_feature_grid_items_tags_parent_id_idx" ON "_services_v_blocks_feature_grid_items_tags" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_related_services_items_order_idx" ON "_services_v_blocks_related_services_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_related_services_items_parent_id_idx" ON "_services_v_blocks_related_services_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_related_services_items_service_idx" ON "_services_v_blocks_related_services_items" USING btree ("service_id");
  CREATE INDEX "_services_v_blocks_related_services_order_idx" ON "_services_v_blocks_related_services" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_related_services_parent_id_idx" ON "_services_v_blocks_related_services" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_related_services_path_idx" ON "_services_v_blocks_related_services" USING btree ("_path");
  CREATE INDEX "projects_blocks_photo_strip_items_order_idx" ON "projects_blocks_photo_strip_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_photo_strip_items_parent_id_idx" ON "projects_blocks_photo_strip_items" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_photo_strip_items_image_idx" ON "projects_blocks_photo_strip_items" USING btree ("image_id");
  CREATE INDEX "projects_blocks_photo_strip_order_idx" ON "projects_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "projects_blocks_photo_strip_parent_id_idx" ON "projects_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_photo_strip_path_idx" ON "projects_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "projects_blocks_photo_strip_service_idx" ON "projects_blocks_photo_strip" USING btree ("service_id");
  CREATE INDEX "_projects_v_blocks_photo_strip_items_order_idx" ON "_projects_v_blocks_photo_strip_items" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_photo_strip_items_parent_id_idx" ON "_projects_v_blocks_photo_strip_items" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_photo_strip_items_image_idx" ON "_projects_v_blocks_photo_strip_items" USING btree ("image_id");
  CREATE INDEX "_projects_v_blocks_photo_strip_order_idx" ON "_projects_v_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_photo_strip_parent_id_idx" ON "_projects_v_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_photo_strip_path_idx" ON "_projects_v_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_photo_strip_service_idx" ON "_projects_v_blocks_photo_strip" USING btree ("service_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_photo_strip_items" CASCADE;
  DROP TABLE "pages_blocks_photo_strip" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items_tags" CASCADE;
  DROP TABLE "pages_blocks_related_services_items" CASCADE;
  DROP TABLE "pages_blocks_related_services" CASCADE;
  DROP TABLE "_pages_v_blocks_photo_strip_items" CASCADE;
  DROP TABLE "_pages_v_blocks_photo_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_items_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_related_services_items" CASCADE;
  DROP TABLE "_pages_v_blocks_related_services" CASCADE;
  DROP TABLE "services_blocks_photo_strip_items" CASCADE;
  DROP TABLE "services_blocks_photo_strip" CASCADE;
  DROP TABLE "services_blocks_feature_grid_items_tags" CASCADE;
  DROP TABLE "services_blocks_related_services_items" CASCADE;
  DROP TABLE "services_blocks_related_services" CASCADE;
  DROP TABLE "_services_v_blocks_photo_strip_items" CASCADE;
  DROP TABLE "_services_v_blocks_photo_strip" CASCADE;
  DROP TABLE "_services_v_blocks_feature_grid_items_tags" CASCADE;
  DROP TABLE "_services_v_blocks_related_services_items" CASCADE;
  DROP TABLE "_services_v_blocks_related_services" CASCADE;
  DROP TABLE "projects_blocks_photo_strip_items" CASCADE;
  DROP TABLE "projects_blocks_photo_strip" CASCADE;
  DROP TABLE "_projects_v_blocks_photo_strip_items" CASCADE;
  DROP TABLE "_projects_v_blocks_photo_strip" CASCADE;
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "default_open_first";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "default_open_first";
  ALTER TABLE "services_blocks_faq" DROP COLUMN "anchor";
  ALTER TABLE "services_blocks_faq" DROP COLUMN "default_open_first";
  ALTER TABLE "_services_v_blocks_faq" DROP COLUMN "anchor";
  ALTER TABLE "_services_v_blocks_faq" DROP COLUMN "default_open_first";
  DROP TYPE "public"."enum_pages_blocks_photo_strip_source";
  DROP TYPE "public"."enum_pages_blocks_photo_strip_limit";
  DROP TYPE "public"."enum_pages_blocks_related_services_variant";
  DROP TYPE "public"."enum__pages_v_blocks_photo_strip_source";
  DROP TYPE "public"."enum__pages_v_blocks_photo_strip_limit";
  DROP TYPE "public"."enum__pages_v_blocks_related_services_variant";
  DROP TYPE "public"."enum_services_blocks_photo_strip_source";
  DROP TYPE "public"."enum_services_blocks_photo_strip_limit";
  DROP TYPE "public"."enum_services_blocks_related_services_variant";
  DROP TYPE "public"."enum__services_v_blocks_photo_strip_source";
  DROP TYPE "public"."enum__services_v_blocks_photo_strip_limit";
  DROP TYPE "public"."enum__services_v_blocks_related_services_variant";
  DROP TYPE "public"."enum_projects_blocks_photo_strip_source";
  DROP TYPE "public"."enum_projects_blocks_photo_strip_limit";
  DROP TYPE "public"."enum__projects_v_blocks_photo_strip_source";
  DROP TYPE "public"."enum__projects_v_blocks_photo_strip_limit";`)
}
