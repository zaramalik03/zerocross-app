CREATE TYPE "public"."cuisine_region_type" AS ENUM('american', 'southern_us', 'japanese', 'korean', 'chinese', 'southeast_asian', 'south_asian', 'middle_eastern', 'mediterranean', 'mexican', 'latin_american', 'ethiopian', 'west_african', 'caribbean', 'french', 'italian', 'fusion', 'global');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('restaurant', 'bakery', 'cafe', 'food_truck', 'convenience_store', 'grocery_store', 'health_food_store', 'catering', 'farmers_market', 'college_dining', 'hotel_kitchen');--> statement-breakpoint
CREATE TYPE "public"."restriction_type" AS ENUM('intolerance', 'allergy', 'preference', 'medical');--> statement-breakpoint
CREATE TYPE "public"."verified_by_type" AS ENUM('community', 'self_reported', 'third_party');--> statement-breakpoint
CREATE TABLE "allergens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "allergens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(201) NOT NULL,
	"category" varchar(170),
	CONSTRAINT "allergens_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "diets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "diets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"tag" varchar(100),
	CONSTRAINT "diets_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ingredient_allergens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredient_allergens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ingredient_id" integer NOT NULL,
	"allergen_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'unknown' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredient_diets" (
	"ingredient_id" integer NOT NULL,
	"diet_id" integer NOT NULL,
	CONSTRAINT "ingredient_diets_ingredient_id_diet_id_pk" PRIMARY KEY("ingredient_id","diet_id")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"cuisine_culture" text,
	"verified" boolean,
	"active" boolean,
	"ranking" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"cultural_cuisine" text,
	"description" text,
	"website" text,
	"phone" text,
	"street_address" text,
	"city" text,
	"state" text,
	"zipcode" text,
	"country" text,
	"verified" boolean,
	"active" boolean,
	"ranking" integer,
	"is_dedicated_facility" boolean,
	"is_certified" boolean,
	"trained_staff" boolean,
	"written_allergen_menu" boolean,
	"know_before_you_go" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "places_allergens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "places_allergens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"place_id" integer NOT NULL,
	"allergen_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'unknown' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places_diets" (
	"place_id" integer NOT NULL,
	"diet_id" integer NOT NULL,
	CONSTRAINT "places_diets_place_id_diet_id_pk" PRIMARY KEY("place_id","diet_id")
);
--> statement-breakpoint
CREATE TABLE "product_allergens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_allergens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"allergen_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'unknown' NOT NULL,
	"order_" integer
);
--> statement-breakpoint
CREATE TABLE "product_ingredients" (
	"product_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"order_" integer,
	CONSTRAINT "product_ingredients_product_id_ingredient_id_pk" PRIMARY KEY("product_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand_name" text NOT NULL,
	"category" text NOT NULL,
	"cultural_cuisine" text,
	"description" text,
	"verified" boolean,
	"active" boolean,
	"ranking" integer,
	"is_dedicated_facility" boolean NOT NULL,
	"is_certified" boolean NOT NULL,
	"know_before_you_buy" text,
	"where_to_buy" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"cultural_cuisine" varchar(255),
	"cultural_type" "cuisine_region_type",
	"meal_type" varchar(50),
	"difficulty" varchar(20) DEFAULT 'Easy',
	"prep_time_mins" integer,
	"cook_time_mins" integer,
	"servings" integer DEFAULT 2,
	"instructions" text NOT NULL,
	"tips" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ingredient_allergens" ADD CONSTRAINT "ingredient_allergens_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_allergens" ADD CONSTRAINT "ingredient_allergens_allergen_id_allergens_id_fk" FOREIGN KEY ("allergen_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_diets" ADD CONSTRAINT "ingredient_diets_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_diets" ADD CONSTRAINT "ingredient_diets_diet_id_diets_id_fk" FOREIGN KEY ("diet_id") REFERENCES "public"."diets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places_allergens" ADD CONSTRAINT "places_allergens_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places_allergens" ADD CONSTRAINT "places_allergens_allergen_id_allergens_id_fk" FOREIGN KEY ("allergen_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places_diets" ADD CONSTRAINT "places_diets_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places_diets" ADD CONSTRAINT "places_diets_diet_id_diets_id_fk" FOREIGN KEY ("diet_id") REFERENCES "public"."diets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_allergens" ADD CONSTRAINT "product_allergens_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_allergens" ADD CONSTRAINT "product_allergens_allergen_id_allergens_id_fk" FOREIGN KEY ("allergen_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_ing_allergen" ON "ingredient_allergens" USING btree ("ingredient_id","allergen_id");--> statement-breakpoint
CREATE INDEX "idx_ia_status" ON "ingredient_allergens" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_ingredients_type" ON "ingredients" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_ingredients_culture" ON "ingredients" USING btree ("cuisine_culture");--> statement-breakpoint
CREATE INDEX "idx_ingredients_verified" ON "ingredients" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "idx_ingredients_active" ON "ingredients" USING btree ("active");--> statement-breakpoint
CREATE INDEX "idx_places_city" ON "places" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_places_state" ON "places" USING btree ("state");--> statement-breakpoint
CREATE INDEX "idx_places_ranking" ON "places" USING btree ("ranking");--> statement-breakpoint
CREATE INDEX "idx_places_dedicated" ON "places" USING btree ("is_dedicated_facility");--> statement-breakpoint
CREATE INDEX "idx_places_certified" ON "places" USING btree ("is_certified");--> statement-breakpoint
CREATE INDEX "idx_places_verified" ON "places" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "idx_places_active" ON "places" USING btree ("active");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_place_allergen" ON "places_allergens" USING btree ("place_id","allergen_id");--> statement-breakpoint
CREATE INDEX "idx_pa_place" ON "places_allergens" USING btree ("place_id","allergen_id");--> statement-breakpoint
CREATE INDEX "idx_pa_status" ON "places_allergens" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_product_allergen" ON "product_allergens" USING btree ("product_id","allergen_id");--> statement-breakpoint
CREATE INDEX "idx_product_allergen_status" ON "product_allergens" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_product_category" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_product_cultural" ON "products" USING btree ("cultural_cuisine");--> statement-breakpoint
CREATE INDEX "idx_product_certified" ON "products" USING btree ("is_certified");--> statement-breakpoint
CREATE INDEX "idx_product_verified" ON "products" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "idx_product_active" ON "products" USING btree ("active");--> statement-breakpoint
CREATE INDEX "idx_recipes_cultural" ON "recipes" USING btree ("cultural_type");--> statement-breakpoint
CREATE INDEX "idx_recipes_meal" ON "recipes" USING btree ("meal_type");--> statement-breakpoint
CREATE INDEX "idx_recipes_active" ON "recipes" USING btree ("active");