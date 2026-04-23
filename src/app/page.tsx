'use client'

import { useEffect } from 'react'
import { useWeather } from '@/hooks/useWeather'
import { CurrentWeatherCard } from '@/components/weather/CurrentWeather'
import { ForecastCards }       from '@/components/weather/ForecastCards'
import { SearchBar }           from '@/components/weather/SearchBar'
import { WeatherSkeleton }     from '@/components/weather/WeatherSkeleton'
import { ThemeToggle }         from '../components/ThemeToggle'
import { AlertCircle }         from 'lucide-react'// 
import { ChatBot }             from '@/components/weather/ChatBot'

const DEFAULT_CITY = 'Manila'
const UNIT         = 'metric'

export default function Home() {
  const { data, error, loading, fetch } = useWeather()

  // Load default city on mount
  useEffect(() => {
    fetch(DEFAULT_CITY, UNIT)
  }, [fetch])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Weather
          </h1>
          <ThemeToggle />
        </div>

        {/* Search */}
        <SearchBar onSearch={city => fetch(city, UNIT)} loading={loading} />

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950 
                          border border-red-200 dark:border-red-800 
                          rounded-2xl p-4 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && <WeatherSkeleton />}

        {/* Weather data */}
        {!loading && data && (
          <div className="space-y-4 animate-fade-in">
            <CurrentWeatherCard data={data.current}  unit={UNIT} />
            <ForecastCards      forecast={data.forecast.forecast} unit={UNIT} />
          </div>
        )}

      </div>

      <ChatBot
          weather={data?.current  ?? null}
          forecast={data?.forecast.forecast ?? null}
        />
        
    </main>
  )
}