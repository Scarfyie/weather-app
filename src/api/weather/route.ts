import { NextRequest, NextResponse } from 'next/server'
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather'
import type { WeatherApiResponse, ApiError, TemperatureUnit } from '@/types/weather'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const city = searchParams.get('city')
  const unit = (searchParams.get('unit') ?? 'metric') as TemperatureUnit

  // ── Validate input ──────────────────────────────────────
  if (!city || city.trim().length === 0) {
    return NextResponse.json<ApiError>(
      { error: 'Bad Request', message: 'city parameter is required' },
      { status: 400 }
    )
  }

  if (!['metric', 'imperial'].includes(unit)) {
    return NextResponse.json<ApiError>(
      { error: 'Bad Request', message: 'unit must be metric or imperial' },
      { status: 400 }
    )
  }

  // ── Fetch both in parallel ──────────────────────────────
  try {
    const [current, forecast] = await Promise.all([
      fetchCurrentWeather(city, unit),
      fetchForecast(city, unit),
    ])

    return NextResponse.json<WeatherApiResponse>(
      { current, forecast },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    // City not found
    if (message.toLowerCase().includes('not found') || message.includes('404')) {
      return NextResponse.json<ApiError>(
        { error: 'Not Found', message: `City "${city}" not found` },
        { status: 404 }
      )
    }

    // Everything else
    return NextResponse.json<ApiError>(
      { error: 'Internal Server Error', message },
      { status: 500 }
    )
  }
}