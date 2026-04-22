'use client'

import { useState, useCallback } from 'react'

interface GeolocationState {
  loading: boolean
  error:   string | null
}

interface UseGeolocationReturn extends GeolocationState {
  getLocation: (onSuccess: (city: string) => void) => void
}

export function useGeolocation(): UseGeolocationReturn {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const getLocation = useCallback((onSuccess: (city: string) => void) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res  = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
          const data = await res.json()

          if (!res.ok) throw new Error(data.message)
          onSuccess(data.city)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to get city name')
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setLoading(false)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied — please allow it in your browser settings')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable — try searching manually')
            break
          default:
            setError('Could not get your location')
        }
      }
    )
  }, [])

  return { loading, error, getLocation }
}