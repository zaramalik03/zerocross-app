import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/db/products'
import { products } from '@/lib/db/schema'
import { eq, asc, desc, and, ilike, SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
 
export const runtime = 'nodejs'
export const revalidate = 300  // cache for 5 minutes
 
export async function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams
    const filters = {
      category:       p.get('category') ?? undefined,
      culture:        p.get('culture')  ?? undefined,
      ranking:        p.get('ranking')  ? parseInt(p.get('ranking')!) : undefined,
      productSearch:  p.get('productSearch') ?? undefined,
      isDedicated:    p.get('is_dedicated_facility') === 'true',
      isCertified:    p.get('is_certified') === 'true',
    }
    const results = await getProducts(filters)
    const conditions: SQL[] = [
      eq(products.active, true),
    ]
    if (filters.category) 
      conditions.push(ilike(products.category, filters.category))
    if (filters.ranking)  
      conditions.push(eq(products.ranking, filters.ranking))
    if (filters.productSearch)   
      conditions.push(ilike(products.name,  `%${filters.productSearch}%`))
    if (filters.culture && filters.culture !== 'all')  
      conditions.push(ilike(products.culturalCuisine, `%${filters.culture}%`))
    
    const productRows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.ranking), desc(products.isDedicatedFacility), asc(products.name))
    .limit(100)

    if (productRows.length === 0) {
      return NextResponse.json({ data: [], count: 0 })
    }
    // const productIds = productRows.map(r => r.id)

    // return NextResponse.json(
    //   { data: results, count: results.length },
    //   { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    // )
    return NextResponse.json(
      {data: productRows, count: productRows.length}
    )
  } catch (err) {
    console.error('[/api/products]', err)
    return NextResponse.json(
      { error: 'Failed to fetch products listings' },
      { status: 500 }
    )
  }
}
