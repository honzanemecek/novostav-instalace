import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_contact_details" ADD COLUMN "show_big_phone" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_contact_details" ADD COLUMN "show_map" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_contact_details" ADD COLUMN "show_big_phone" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_contact_details" ADD COLUMN "show_map" boolean DEFAULT false;
  ALTER TABLE "services_blocks_contact_details" ADD COLUMN "show_big_phone" boolean DEFAULT true;
  ALTER TABLE "services_blocks_contact_details" ADD COLUMN "show_map" boolean DEFAULT false;
  ALTER TABLE "_services_v_blocks_contact_details" ADD COLUMN "show_big_phone" boolean DEFAULT true;
  ALTER TABLE "_services_v_blocks_contact_details" ADD COLUMN "show_map" boolean DEFAULT false;
  ALTER TABLE "projects_blocks_contact_details" ADD COLUMN "show_big_phone" boolean DEFAULT true;
  ALTER TABLE "projects_blocks_contact_details" ADD COLUMN "show_map" boolean DEFAULT false;
  ALTER TABLE "_projects_v_blocks_contact_details" ADD COLUMN "show_big_phone" boolean DEFAULT true;
  ALTER TABLE "_projects_v_blocks_contact_details" ADD COLUMN "show_map" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_inquiry" ADD CONSTRAINT "pages_blocks_inquiry_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_inquiry" ADD CONSTRAINT "pages_blocks_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_inquiry" ADD CONSTRAINT "_pages_v_blocks_inquiry_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_inquiry" ADD CONSTRAINT "_pages_v_blocks_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_inquiry" ADD CONSTRAINT "services_blocks_inquiry_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_inquiry" ADD CONSTRAINT "services_blocks_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_inquiry" ADD CONSTRAINT "_services_v_blocks_inquiry_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_inquiry" ADD CONSTRAINT "_services_v_blocks_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_inquiry" ADD CONSTRAINT "projects_blocks_inquiry_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_inquiry" ADD CONSTRAINT "projects_blocks_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_inquiry" ADD CONSTRAINT "_projects_v_blocks_inquiry_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_inquiry" ADD CONSTRAINT "_projects_v_blocks_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_inquiry_order_idx" ON "pages_blocks_inquiry" USING btree ("_order");
  CREATE INDEX "pages_blocks_inquiry_parent_id_idx" ON "pages_blocks_inquiry" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_inquiry_path_idx" ON "pages_blocks_inquiry" USING btree ("_path");
  CREATE INDEX "pages_blocks_inquiry_form_idx" ON "pages_blocks_inquiry" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_inquiry_order_idx" ON "_pages_v_blocks_inquiry" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_inquiry_parent_id_idx" ON "_pages_v_blocks_inquiry" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_inquiry_path_idx" ON "_pages_v_blocks_inquiry" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_inquiry_form_idx" ON "_pages_v_blocks_inquiry" USING btree ("form_id");
  CREATE INDEX "services_blocks_inquiry_order_idx" ON "services_blocks_inquiry" USING btree ("_order");
  CREATE INDEX "services_blocks_inquiry_parent_id_idx" ON "services_blocks_inquiry" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_inquiry_path_idx" ON "services_blocks_inquiry" USING btree ("_path");
  CREATE INDEX "services_blocks_inquiry_form_idx" ON "services_blocks_inquiry" USING btree ("form_id");
  CREATE INDEX "_services_v_blocks_inquiry_order_idx" ON "_services_v_blocks_inquiry" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_inquiry_parent_id_idx" ON "_services_v_blocks_inquiry" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_inquiry_path_idx" ON "_services_v_blocks_inquiry" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_inquiry_form_idx" ON "_services_v_blocks_inquiry" USING btree ("form_id");
  CREATE INDEX "projects_blocks_inquiry_order_idx" ON "projects_blocks_inquiry" USING btree ("_order");
  CREATE INDEX "projects_blocks_inquiry_parent_id_idx" ON "projects_blocks_inquiry" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_inquiry_path_idx" ON "projects_blocks_inquiry" USING btree ("_path");
  CREATE INDEX "projects_blocks_inquiry_form_idx" ON "projects_blocks_inquiry" USING btree ("form_id");
  CREATE INDEX "_projects_v_blocks_inquiry_order_idx" ON "_projects_v_blocks_inquiry" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_inquiry_parent_id_idx" ON "_projects_v_blocks_inquiry" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_inquiry_path_idx" ON "_projects_v_blocks_inquiry" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_inquiry_form_idx" ON "_projects_v_blocks_inquiry" USING btree ("form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_inquiry" CASCADE;
  DROP TABLE "_pages_v_blocks_inquiry" CASCADE;
  DROP TABLE "services_blocks_inquiry" CASCADE;
  DROP TABLE "_services_v_blocks_inquiry" CASCADE;
  DROP TABLE "projects_blocks_inquiry" CASCADE;
  DROP TABLE "_projects_v_blocks_inquiry" CASCADE;
  ALTER TABLE "pages_blocks_contact_details" DROP COLUMN "show_big_phone";
  ALTER TABLE "pages_blocks_contact_details" DROP COLUMN "show_map";
  ALTER TABLE "_pages_v_blocks_contact_details" DROP COLUMN "show_big_phone";
  ALTER TABLE "_pages_v_blocks_contact_details" DROP COLUMN "show_map";
  ALTER TABLE "services_blocks_contact_details" DROP COLUMN "show_big_phone";
  ALTER TABLE "services_blocks_contact_details" DROP COLUMN "show_map";
  ALTER TABLE "_services_v_blocks_contact_details" DROP COLUMN "show_big_phone";
  ALTER TABLE "_services_v_blocks_contact_details" DROP COLUMN "show_map";
  ALTER TABLE "projects_blocks_contact_details" DROP COLUMN "show_big_phone";
  ALTER TABLE "projects_blocks_contact_details" DROP COLUMN "show_map";
  ALTER TABLE "_projects_v_blocks_contact_details" DROP COLUMN "show_big_phone";
  ALTER TABLE "_projects_v_blocks_contact_details" DROP COLUMN "show_map";`)
}
