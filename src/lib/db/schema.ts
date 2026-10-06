// src/lib/db/schema.ts
import {
  pgTable, pgEnum, text, boolean, numeric,
  integer, varchar, timestamp, date, jsonb, uniqueIndex, index,
  primaryKey
} from 'drizzle-orm/pg-core'
import { sql, relations } from 'drizzle-orm'

// ── Enums ──────────────────────────────────────────────────
export const cuisineRegionEnum = pgEnum('cuisine_region_type', [
  'american',
  'southern_us',
  'japanese',
  'korean',
  'chinese',
  'southeast_asian',
  'south_asian',
  'middle_eastern',
  'mediterranean',
  'mexican',
  'latin_american',
  'ethiopian',
  'west_african',
  'caribbean',
  'french',
  'italian',
  'fusion',
  'global',
])

export const listingTypeEnum = pgEnum('listing_type', [
  'restaurant',
  'bakery',
  'cafe',
  'food_truck',
  'convenience_store',
  'grocery_store',
  'health_food_store',
  'catering',
  'farmers_market',
  'college_dining',
  'hotel_kitchen',
])
 
export const restrictionTypeEnum = pgEnum('restriction_type', [
  'intolerance',
  'allergy',
  'preference',
  'medical',
])

export const verifiedByEnum = pgEnum('verified_by_type', [
  'community', 'self_reported', 'third_party',
])

// ── users ─────────────────────────────────────────────────
export const users = pgTable('users', {
  id:        integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name:      varchar('name',  { length: 255 }).notNull(),
  email:     varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── allergens ─────────────────────────────────────────────
// category: 'fda_top9' | 'eu_14' | 'extended'
export const allergens = pgTable('allergens', {
  id:       integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name:     varchar('name',     { length: 201 }).notNull().unique(),
  category: varchar('category', { length: 170 }),
})

// ── diets ─────────────────────────────────────────────────
export const diets = pgTable('diets', {
  id:   integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  tag:  varchar('tag',  { length: 100 }),
})

// ── places ────────────────────────────────────
export const places = pgTable('places', {
  id:                   text('id').primaryKey(),
  name:                 text('name').notNull(),
  category:             text('category'),
  culturalCuisine:      text('cultural_cuisine'),
  description:          text('description'),
  website:              text('website'),
  phone:                text('phone'),
  streetAddress:        text('street_address'),
  city:                 text('city'),
  state:                text('state'),
  zipcode:              text('zipcode'),
  country:              text('country'),
  verified:             boolean('verified'),
  active:               boolean('active'),
  ranking:              integer('ranking'),
  isDedicatedFacility:  boolean('is_dedicated_facility'),
  isCertified:          boolean('is_certified'),
  trainedStaff:         boolean('trained_staff'),
  writtenAllergenMenu:  boolean('written_allergen_menu'),
  knowBeforeYouGo:   text('know_before_you_go'),
  createdAt:            timestamp('created_at').defaultNow(),
  updatedAt:            timestamp('updated_at').defaultNow(),
}, (table) => ({
  cityIdx:      index('idx_places_city').on(table.city),
  stateIdx:     index('idx_places_state').on(table.state),
  rankingIdx:   index('idx_places_ranking').on(table.ranking),
  dedicatedIdx: index('idx_places_dedicated').on(table.isDedicatedFacility),
  certifiedIdx: index('idx_places_certified').on(table.isCertified),
  verifiedIdx:  index('idx_places_verified').on(table.verified),
  activeIdx:    index('idx_places_active').on(table.active),
}))

// ── junction table: places_allergens ────────────────────────────
// status: 'free_of' | 'contains' | 'may_contain' | 'unknown'
export const placesAllergens = pgTable('places_allergens', {
  id:         integer('id').generatedAlwaysAsIdentity().primaryKey(),
  placeId:    text('place_id')
                .notNull()
                .references(() => places.id, { onDelete: 'cascade' }),
  allergenId: integer('allergen_id')
                .notNull()
                .references(() => allergens.id, { onDelete: 'cascade' }),
  status:     varchar('status', { length: 50 }).notNull().default('unknown'),
}, (table) => ({
  uniquePlaceAllergen: uniqueIndex('uniq_place_allergen').on(table.placeId, table.allergenId),
  placeIdx:            index('idx_pa_place').on(table.placeId, table.allergenId),
  statusIdx:           index('idx_pa_status').on(table.status),
}))

// ── junction table: places_diets ────────────────────────────────
export const placesDiets = pgTable('places_diets', {
  placeId: text('place_id')
             .notNull()
             .references(() => places.id, { onDelete: 'cascade' }),
  dietId:  integer('diet_id')
             .notNull()
             .references(() => diets.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.placeId, table.dietId] }),
}))

// ── products ────────────────────────────────
export const products = pgTable('products', {
  id:                  integer('id').primaryKey(),
  name:                text('name').notNull(),
  brandName:           text('brand_name').notNull(),
  category:            text('category').notNull(),
  culturalCuisine:     text('cultural_cuisine'),
  description:         text('description'),
  verified:            boolean('verified'),
  active:              boolean('active'),
  ranking:             integer('ranking'),
  isDedicatedFacility: boolean('is_dedicated_facility').notNull(),
  isCertified:         boolean('is_certified').notNull(),
  knowBeforeYouBuy:    text('know_before_you_buy'),
  whereToBuy:          text('where_to_buy'),
  createdAt:            timestamp('created_at').defaultNow(),
  updatedAt:            timestamp('updated_at').defaultNow(),
}, (table) => ({
  categoryIdx:  index('idx_product_category').on(table.category),
  culturalIdx:  index('idx_product_cultural').on(table.culturalCuisine),
  certifiedIdx: index('idx_product_certified').on(table.isCertified),
  verifiedIdx: index('idx_product_verified').on(table.verified),
  activeIdx:   index('idx_product_active').on(table.active),
  // recipesIdx:   index('idx_product_recipes').on(table.usedInRecipes),
  // barcodeIdx:   index('idx_product_barcode').on(table.barcode),
}))

// ── junction table: product_allergens ───────────────────────────
// status: 'free_of' | 'contains' | 'may_contain' | 'unknown'
export const productAllergens = pgTable('product_allergens', {
  id:         integer('id').generatedAlwaysAsIdentity().primaryKey(),
  productId:  integer('product_id')
                .notNull()
                .references(() => products.id, { onDelete: 'cascade' }),
  allergenId: integer('allergen_id')
                .notNull()
                .references(() => allergens.id, { onDelete: 'cascade' }),
  status:     varchar('status', { length: 50 }).notNull().default('unknown'),
  order:      integer('order_'),
}, (table) => ({
  uniqueProductAllergen: uniqueIndex('uniq_product_allergen').on(table.productId, table.allergenId),
  statusIdx:             index('idx_product_allergen_status').on(table.status),
}))

// ── junction table: product_ingredients ─────────────────────────
export const productIngredients = pgTable('product_ingredients', {
  productId:    integer('product_id')
                  .notNull()
                  .references(() => products.id, { onDelete: 'cascade' }),
  ingredientId: integer('ingredient_id')
                  .notNull()
                  .references(() => ingredients.id, { onDelete: 'cascade' }),
  order:        integer('order_'),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.ingredientId] }),
}))

// ── ingredients ─────────────────────────────────────
export const ingredients = pgTable('ingredients', {
  id:                  text('id').primaryKey(),
  name:                text('name').notNull(),
  type:                text('type').notNull(),
  cuisineCulture:      text('cuisine_culture'),
  verified:             boolean('verified'),
  active:               boolean('active'),
  ranking:              integer('ranking'),
  createdAt:           timestamp('created_at').defaultNow(),
  updatedAt:           timestamp('updated_at').defaultNow(),
}, (table) => ({
  typeIdx:     index('idx_ingredients_type').on(table.type),
  cultureIdx:  index('idx_ingredients_culture').on(table.cuisineCulture),
  verifiedIdx: index('idx_ingredients_verified').on(table.verified),
  activeIdx:   index('idx_ingredients_active').on(table.active),
}))

// ── junction ta table: ingredient_allergens ────────────────────────
// status: 'free_of' | 'contains' | 'may_contain' | 'unknown'
export const ingredientAllergens = pgTable('ingredient_allergens', {
  id:           integer('id').generatedAlwaysAsIdentity().primaryKey(),
  ingredientId: text('ingredient_id')
                  .notNull()
                  .references(() => ingredients.id, { onDelete: 'cascade' }),
  allergenId:   integer('allergen_id')
                  .notNull()
                  .references(() => allergens.id, { onDelete: 'cascade' }),
  status:       varchar('status', { length: 50 }).notNull().default('unknown'),
}, (table) => ({
  uniqueIngAllergen: uniqueIndex('uniq_ing_allergen').on(table.ingredientId, table.allergenId),
  statusIdx:         index('idx_ia_status').on(table.status),
}))
 
// ── junction table: ingredient_diets ────────────────────────────
export const ingredientDiets = pgTable('ingredient_diets', {
  ingredientId: text('ingredient_id')
                  .notNull()
                  .references(() => ingredients.id, { onDelete: 'cascade' }),
  dietId:       integer('diet_id')
                  .notNull()
                  .references(() => diets.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.ingredientId, table.dietId] }),
}))

// ── recipes ────────────────────────
export const recipes = pgTable('recipes', {
  id:             integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name:           varchar('name', { length: 255 }).notNull(),
  description:    text('description'),
  culturalCuisine: varchar('cultural_cuisine', { length: 255 }),
  culturalType:   cuisineRegionEnum('cultural_type'),
  mealType:       varchar('meal_type', { length: 50 }),
  difficulty:     varchar('difficulty', { length: 20 }).default('Easy'),
  prepTimeMins:   integer('prep_time_mins'),
  cookTimeMins:   integer('cook_time_mins'),
  servings:       integer('servings').default(2),
  instructions:   text('instructions').notNull(),
  tips:           text('tips'),
  active:         boolean('active').default(true),
  createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  culturalIdx: index('idx_recipes_cultural').on(table.culturalType),
  mealIdx:     index('idx_recipes_meal').on(table.mealType),
  activeIdx:   index('idx_recipes_active').on(table.active),
}))

export type Place            = typeof places.$inferSelect
export type NewPlace         = typeof places.$inferInsert
export type PlaceAllergen    = typeof placesAllergens.$inferSelect
export type NewPlaceAllergen = typeof placesAllergens.$inferInsert
export type PlaceDiet        = typeof placesDiets.$inferSelect
export type GroceryProduct          = typeof products.$inferSelect
export type NewGroceryProduct       = typeof products.$inferInsert
export type ProductAllergen         = typeof productAllergens.$inferSelect
export type Ingredient              = typeof ingredients.$inferSelect
export type NewIngredient           = typeof ingredients.$inferInsert
export type IngredientAllergen      = typeof ingredientAllergens.$inferSelect
export type Recipe                  = typeof recipes.$inferSelect
export type NewRecipe               = typeof recipes.$inferInsert
// export type RecipeIngredient        = typeof recipeIngredients.$inferSelect
// export type NewRecipeIngredient     = typeof recipeIngredients.$inferInsert
export type Allergen                = typeof allergens.$inferSelect
export type NewAllergen             = typeof allergens.$inferInsert
export type Diet                    = typeof diets.$inferSelect
// export type Store                   = typeof stores.$inferSelect
// export type Certification           = typeof certifications.$inferSelect
export type User                    = typeof users.$inferSelect
// export type DietaryProfile          = typeof dietaryProfiles.$inferSelect
// export type NewDietaryProfile       = typeof dietaryProfiles.$inferInsert
// export type ProfileRestriction      = typeof profileRestrictions.$inferSelect
// export type NewProfileRestriction   = typeof profileRestrictions.$inferInsert