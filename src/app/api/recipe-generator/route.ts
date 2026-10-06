// src/app/api/recipe-customizer/route.ts
import { NextRequest, NextResponse } from 'next/server'

const PYTHON_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  // Forward all query params to the Python server
  const pythonUrl = `${PYTHON_URL}/recipes?${params.toString()}`

  try {
    const res = await fetch(pythonUrl, {
      headers: { 'Content-Type': 'application/json' },
      // Don't cache — always return fresh results
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Recipe engine error' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (err) {
    return NextResponse.json(
      { error: 'Could not reach recipe engine' },
      { status: 503 }
    )
  }
}