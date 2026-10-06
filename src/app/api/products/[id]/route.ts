// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db }     from '@/lib/db'
import { products, productAllergens, allergens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)

  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid ID' },
      { status: 400 }
    )
  }

  try {
    // Get the place
    const [place] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
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
        status: productAllergens.status,
      })
      .from(productAllergens)
      .innerJoin(allergens, eq(productAllergens.allergenId, allergens.id))
      .where(eq(productAllergens.productId, id))
      .orderBy(allergens.name)

    // Group allergens by status
    const freeOf    = allergenRows.filter(a => a.status === 'free_from').map(a => a.name)
    const canAccommodate  = allergenRows.filter(a => a.status === 'can_accommodate').map(a => a.name)
    const mayContain = allergenRows.filter(a => a.status === 'may_contain').map(a => a.name)

    return NextResponse.json({
      data: { ...place, freeOf, canAccommodate, mayContain }
    })

  } catch (err) {
    console.error('[/api/products/[id]]', err)
    return NextResponse.json(
      { error: 'Failed to load place' },
      { status: 500 }
    )
  }
}