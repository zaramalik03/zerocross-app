import { db } from './index'
import { ingredients } from './schema'
import { and, desc, eq, ilike } from 'drizzle-orm'

export type IngredientFilters = {
  type?: string
  cuisineCulture?: string
  isDedicated?: boolean
  isCertified?: boolean
  freeOfGluten?: boolean
  freeOfWheat?: boolean
  freeOfPeanut?: boolean
  freeOfTreeNut?: boolean
  freeOfDairy?: boolean
  freeOfEgg?: boolean
  freeOfSoy?: boolean
  freeOfFish?: boolean
  freeOfShellfish?: boolean
  freeOfSesame?: boolean
  dietVegan?: boolean
  dietHalal?: boolean
  dietKosher?: boolean
}

export async function getIngredients(filters: IngredientFilters = {}) {
  const conditions = [eq(ingredients.active, true)]

  if (filters.type) {
    conditions.push(ilike(ingredients.type, `%${filters.type}%`))
  }

  if (filters.cuisineCulture) {
    conditions.push(ilike(ingredients.cuisineCulture, `%${filters.cuisineCulture}%`))
  }

  if (filters.isDedicated || filters.isCertified) {
    conditions.push(eq(ingredients.verified, true))
  }

  return db
    .select()
    .from(ingredients)
    .where(and(...conditions))
    .orderBy(desc(ingredients.ranking))
    .limit(50)
}
