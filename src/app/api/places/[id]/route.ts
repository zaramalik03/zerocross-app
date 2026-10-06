// src/app/api/places/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db }     from '@/lib/db'
import { places, placesAllergens, placesDiets,
         allergens, diets } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = rawId

  if (!id) {
    return NextResponse.json(
      { error: 'Invalid ID' },
      { status: 400 }
    )
  }

  try {
    // Get the place
    const [place] = await db
      .select()
      .from(places)
      .where(eq(places.id, id))
      .limit(1)

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      )
    }

    // Get allergen status
    const allergenRows = await db
      .select({
        name:   allergens.name,
        status: placesAllergens.status,
      })
      .from(placesAllergens)
      .innerJoin(allergens, eq(placesAllergens.allergenId, allergens.id))
      .where(eq(placesAllergens.placeId, id))
      .orderBy(allergens.name)

    // Get diet tags
    const dietRows = await db
      .select({ name: diets.name, tag: diets.tag })
      .from(placesDiets)
      .innerJoin(diets, eq(placesDiets.dietId, diets.id))
      .where(eq(placesDiets.placeId, id))

    // Group allergens by status
    const freeOf    = allergenRows.filter(a => a.status === 'free_from').map(a => a.name)
    const canAccommodate  = allergenRows.filter(a => a.status === 'can_accommodate').map(a => a.name)
    const mayContain = allergenRows.filter(a => a.status === 'may_contain').map(a => a.name)
    const dietTags  = dietRows.map(d => d.tag ?? d.name)

    return NextResponse.json({
      data: { ...place, freeOf, canAccommodate, mayContain, dietTags }
    })

  } catch (err) {
    console.error('[/api/places/[id]]', err)
    return NextResponse.json(
      { error: 'Failed to load place' },
      { status: 500 }
    )
  }
}