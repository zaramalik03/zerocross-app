import { NextRequest, NextResponse } from 'next/server'
import { getPlaces } from '@/lib/db/places'
import { eq, and, ilike, asc, desc, or, SQL } from 'drizzle-orm'
import { places, placesAllergens, placesDiets, allergens, diets } from '@/lib/db/schema'
import { db } from '@/lib/db'
 
export const runtime = 'nodejs'
export const revalidate = 300  // cache for 5 minutes
 
export async function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams
    const filters = {
      city:           p.get('city')    ?? undefined,
      state:          p.get('state')   ?? undefined,
      category:       p.get('category') ?? undefined,
      culture:        p.get('culture')  ?? undefined,
      ranking:        p.get('ranking')  ? parseInt(p.get('ranking')!) : undefined,
      placeSearch:    p.get('placeSearch') ?? undefined,
      locationSearch: p.get('locationSearch') ?? undefined,
      // avoidAllergens: p.get('avoid')    ? p.get('avoid')!.split(',') : [],
      isDedicated:    p.get('is_dedicated_facility') === 'true',
      isCertified:    p.get('is_certified') === 'true',
      trainedStaff:   p.get('trained_staff') === 'true',
      writtenMenu:    p.get('written_allergen_menu') === 'true',
    }
    const results = await getPlaces(filters)
    const conditions: SQL[] = [
      eq(places.active, true),
    ]
    if (filters.state)    
      conditions.push(eq(places.state, filters.state))
    if (filters.city)     
      conditions.push(ilike(places.city, `%${filters.city}%`))
    if (filters.category) 
      conditions.push(ilike(places.category, filters.category))
    if (filters.ranking)  
      conditions.push(eq(places.ranking, filters.ranking))
    if (filters.culture && filters.culture !== 'all')  
      conditions.push(ilike(places.culturalCuisine, `%${filters.culture}%`))
    if (filters.placeSearch)   
      conditions.push(ilike(places.name,  `%${filters.placeSearch}%`))
    if (filters.locationSearch)   
      conditions.push(
        or(
          ilike(places.city,          `%${filters.locationSearch}%`),
          ilike(places.streetAddress, `%${filters.locationSearch}%`),
          ilike(places.state,         `%${filters.locationSearch}%`)
        )!
      )

    const placeRows = await db
      .select()
      .from(places)
      .where(and(...conditions))
      .orderBy(asc(places.ranking), desc(places.isDedicatedFacility), asc(places.city), asc(places.name))
      .limit(100)

    if (placeRows.length === 0) {
      return NextResponse.json({ data: [], count: 0 })
    }

    //const placeIds = placeRows.map(r => r.id)
 
    // return NextResponse.json(
    //   { data: results, count: results.length },
    //   { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    // )
    return NextResponse.json(
      {data: placeRows, count: placeRows.length}
    )
  } catch (err) {
    console.error('[/api/places]', err)
    return NextResponse.json(
      { error: 'Failed to fetch place listings' },
      { status: 500 }
    )
  }
}
