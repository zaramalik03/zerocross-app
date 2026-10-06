import { NextRequest, NextResponse } from 'next/server'
import { getIngredients } from '@/lib/db/ingredients'
 
export const runtime = 'nodejs'
export const revalidate = 300  // cache for 5 minutes
 
export async function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams
 
    const filters = {
      isDedicated:    p.get('dedicated') === 'true',
      isCertified:    p.get('certified') === 'true',
      freeOfGluten:   p.get('gluten')   === 'true',
      freeOfWheat:    p.get('wheat')    === 'true',
      freeOfPeanut:   p.get('peanut')   === 'true',
      freeOfTreeNut:  p.get('tree_nut') === 'true',
      freeOfDairy:    p.get('dairy')    === 'true',
      freeOfEgg:      p.get('egg')      === 'true',
      freeOfSoy:      p.get('soy')      === 'true',
      freeOfFish:     p.get('fish')     === 'true',
      freeOfShellfish:p.get('shellfish')=== 'true',
      freeOfSesame:   p.get('sesame')   === 'true',
      dietVegan:      p.get('vegan')    === 'true',
      dietHalal:      p.get('halal')    === 'true',
      dietKosher:     p.get('kosher')   === 'true',
    }
 
    const results = await getIngredients(filters)
 
    return NextResponse.json(
      { data: results, count: results.length },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    )
  } catch (err) {
    console.error('[/api/ingredients]', err)
    return NextResponse.json(
      { error: 'Failed to fetch ingredients listings' },
      { status: 500 }
    )
  }
}
