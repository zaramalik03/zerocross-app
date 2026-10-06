import { db } from './index'
import { places } from './schema'
import { eq, and, desc, ilike, or } from 'drizzle-orm'

export type PlacesFilters = {
  city?:              string
  state?:             string
  culturalCuisine?:    string
  isDedicated?:       boolean
  isCertified?:       boolean
  writtenAllergenMenu?: boolean
  knowBeforeYouGo?:   string
}

export async function getPlaces(filters: PlacesFilters) {
  const conditions = [eq(places.active, true)]
 
  if (filters.city)
    conditions.push(ilike(places.city, `%${filters.city}%`))
  if (filters.state)
    conditions.push(eq(places.state, filters.state))
  if (filters.isDedicated)
    conditions.push(eq(places.isDedicatedFacility, true))
  if (filters.isCertified)
    conditions.push(eq(places.isCertified, true))
  if (filters.culturalCuisine)
    conditions.push(ilike(places.culturalCuisine, `%${filters.culturalCuisine}%`))
  if (filters.knowBeforeYouGo)
    conditions.push(ilike(places.knowBeforeYouGo, `%${filters.knowBeforeYouGo}%`))
 
  return db
    .select()
    .from(places)
    .where(and(...conditions))
    .orderBy(desc(places.isDedicatedFacility))
    .limit(50)
}

