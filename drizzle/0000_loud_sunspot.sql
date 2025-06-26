CREATE TABLE "recipes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"recipe_data" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "recipes_user_id_idx" ON "recipes" USING btree ("user_id");