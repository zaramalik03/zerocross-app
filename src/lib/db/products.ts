import { db } from './index'
import { products } from './schema'
import { eq, and, desc, ilike } from 'drizzle-orm'

export type ProductFilters = {
  city?:              string
  state?:             string
  culturalCuisine?:   string
  isDedicated?:       boolean
  isCertified?:       boolean
  knowBeforeYouBuy?:  string
  whereToBuy?:        string
}

export async function getProducts(filters: ProductFilters) {
  const conditions = [eq(products.active, true)]
 
  if (filters.isDedicated)
    conditions.push(eq(products.isDedicatedFacility, true))
  if (filters.isCertified)
    conditions.push(eq(products.isCertified, true))
  if (filters.culturalCuisine)
    conditions.push(ilike(products.culturalCuisine, `%${filters.culturalCuisine}%`))
  if (filters.knowBeforeYouBuy)
    conditions.push(ilike(products.knowBeforeYouBuy, `%${filters.knowBeforeYouBuy}%`))
  if (filters.whereToBuy)
    conditions.push(ilike(products.whereToBuy, `%${filters.whereToBuy}%`))

  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.isDedicatedFacility))
    .limit(50)
}

