import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"auto_from_company" boolean DEFAULT true,
  	"on_slab" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"auto_from_company" boolean DEFAULT true,
  	"on_slab" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "services_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"auto_from_company" boolean DEFAULT true,
  	"on_slab" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"auto_from_company" boolean DEFAULT true,
  	"on_slab" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_text_with_image" ADD COLUMN "full_bleed" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_text_with_image" ADD COLUMN "duotone" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_text_with_image" ADD COLUMN "full_bleed" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_text_with_image" ADD COLUMN "duotone" boolean DEFAULT false;
  ALTER TABLE "services_blocks_text_with_image" ADD COLUMN "full_bleed" boolean DEFAULT true;
  ALTER TABLE "services_blocks_text_with_image" ADD COLUMN "duotone" boolean DEFAULT false;
  ALTER TABLE "_services_v_blocks_text_with_image" ADD COLUMN "full_bleed" boolean DEFAULT true;
  ALTER TABLE "_services_v_blocks_text_with_image" ADD COLUMN "duotone" boolean DEFAULT false;
  ALTER TABLE "projects_blocks_text_with_image" ADD COLUMN "full_bleed" boolean DEFAULT true;
  ALTER TABLE "projects_blocks_text_with_image" ADD COLUMN "duotone" boolean DEFAULT false;
  ALTER TABLE "_projects_v_blocks_text_with_image" ADD COLUMN "full_bleed" boolean DEFAULT true;
  ALTER TABLE "_projects_v_blocks_text_with_image" ADD COLUMN "duotone" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_facts_items" ADD CONSTRAINT "pages_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_facts" ADD CONSTRAINT "pages_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts_items" ADD CONSTRAINT "_pages_v_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts" ADD CONSTRAINT "_pages_v_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_facts_items" ADD CONSTRAINT "services_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_facts" ADD CONSTRAINT "services_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_facts_items" ADD CONSTRAINT "_services_v_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_facts" ADD CONSTRAINT "_services_v_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_facts_items_order_idx" ON "pages_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_facts_items_parent_id_idx" ON "pages_blocks_facts_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_facts_order_idx" ON "pages_blocks_facts" USING btree ("_order");
  CREATE INDEX "pages_blocks_facts_parent_id_idx" ON "pages_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_facts_path_idx" ON "pages_blocks_facts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_facts_items_order_idx" ON "_pages_v_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_facts_items_parent_id_idx" ON "_pages_v_blocks_facts_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_order_idx" ON "_pages_v_blocks_facts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_facts_parent_id_idx" ON "_pages_v_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_path_idx" ON "_pages_v_blocks_facts" USING btree ("_path");
  CREATE INDEX "services_blocks_facts_items_order_idx" ON "services_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "services_blocks_facts_items_parent_id_idx" ON "services_blocks_facts_items" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_facts_order_idx" ON "services_blocks_facts" USING btree ("_order");
  CREATE INDEX "services_blocks_facts_parent_id_idx" ON "services_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_facts_path_idx" ON "services_blocks_facts" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_facts_items_order_idx" ON "_services_v_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_facts_items_parent_id_idx" ON "_services_v_blocks_facts_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_facts_order_idx" ON "_services_v_blocks_facts" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_facts_parent_id_idx" ON "_services_v_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_facts_path_idx" ON "_services_v_blocks_facts" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_facts_items" CASCADE;
  DROP TABLE "pages_blocks_facts" CASCADE;
  DROP TABLE "_pages_v_blocks_facts_items" CASCADE;
  DROP TABLE "_pages_v_blocks_facts" CASCADE;
  DROP TABLE "services_blocks_facts_items" CASCADE;
  DROP TABLE "services_blocks_facts" CASCADE;
  DROP TABLE "_services_v_blocks_facts_items" CASCADE;
  DROP TABLE "_services_v_blocks_facts" CASCADE;
  ALTER TABLE "pages_blocks_text_with_image" DROP COLUMN "full_bleed";
  ALTER TABLE "pages_blocks_text_with_image" DROP COLUMN "duotone";
  ALTER TABLE "_pages_v_blocks_text_with_image" DROP COLUMN "full_bleed";
  ALTER TABLE "_pages_v_blocks_text_with_image" DROP COLUMN "duotone";
  ALTER TABLE "services_blocks_text_with_image" DROP COLUMN "full_bleed";
  ALTER TABLE "services_blocks_text_with_image" DROP COLUMN "duotone";
  ALTER TABLE "_services_v_blocks_text_with_image" DROP COLUMN "full_bleed";
  ALTER TABLE "_services_v_blocks_text_with_image" DROP COLUMN "duotone";
  ALTER TABLE "projects_blocks_text_with_image" DROP COLUMN "full_bleed";
  ALTER TABLE "projects_blocks_text_with_image" DROP COLUMN "duotone";
  ALTER TABLE "_projects_v_blocks_text_with_image" DROP COLUMN "full_bleed";
  ALTER TABLE "_projects_v_blocks_text_with_image" DROP COLUMN "duotone";`)
}
