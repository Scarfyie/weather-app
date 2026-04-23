import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Bad Request', message: 'lat and lon are required' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    )
    const data = await res.json()

    if (!data.length) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No city found for these coordinates' },
        { status: 404 }
      )
    }

    return NextResponse.json({ city: data[0].name })
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to reverse geocode' },
      { status: 500 }
    )
  }
}