import { NextRequest, NextResponse } from 'next/server'

interface CityResult {
  name:    string
  country: string
  state?:  string
  lat:     number
  lon:     number
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json([], { status: 200 })
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`
    )
    const data = await res.json()

    const cities: CityResult[] = data.map((item: any) => ({
      name:    item.name,
      country: item.country,
      state:   item.state,
      lat:     item.lat,
      lon:     item.lon,
    }))

    return NextResponse.json(cities)
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}