'use client'

import { useState, useCallback } from 'react'
import type { WeatherApiResponse, ApiError, TemperatureUnit } from '@/types/weather'

interface UseWeatherReturn {
  data:    WeatherApiResponse | null
  error:   string | null
  loading: boolean
  fetch:   (city: string, unit?: TemperatureUnit) => Promise<void>
}

export function useWeather(): UseWeatherReturn {
  const [data,    setData]    = useState<WeatherApiResponse | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (
    city: string,
    unit: TemperatureUnit = 'metric'
  ) => {
    setLoading(true)
    setError(null)

    try {
      const res = await window.fetch(
        `/api/weather?city=${encodeURIComponent(city)}&unit=${unit}`
      )
      const json = await res.json()

      if (!res.ok) {
        setError((json as ApiError).message)
        return
      }

      setData(json as WeatherApiResponse)
    } catch {
      setError('Network error — please check your connection')
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, error, loading, fetch }
}