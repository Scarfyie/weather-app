'use client'

import { useEffect } from 'react'
import { useWeather }         from '@/hooks/useWeather'
import { useRecentSearches }  from '@/hooks/useRecentSearches'
import { CurrentWeatherCard } from '@/components/weather/CurrentWeather'
import { ForecastCards }      from '@/components/weather/ForecastCards'
import { HourlyChart }        from '@/components/weather/HourlyChart'
import { SearchBar }          from '@/components/weather/SearchBar'
import { WeatherSkeleton }    from '@/components/weather/WeatherSkeleton'
import { ThemeToggle }        from '@/components/ThemeToggle'
import { ChatBot }            from '@/components/weather/ChatBot'
import { AlertCircle, Clock, X } from 'lucide-react'

const DEFAULT_CITY = 'Manila'
const UNIT         = 'metric'

export default function Home() {
  const { data, error, loading, fetch } = useWeather()
  const { searches, addSearch, clearSearches } = useRecentSearches()

  // Load default city on mount
  useEffect(() => {
    fetch(DEFAULT_CITY, UNIT)
  }, [fetch])

  function handleSearch(city: string) {
    fetch(city, UNIT)
    addSearch(city)
  }

  // Flatten all forecast intervals for the hourly chart
  const hourlyItems = data?.forecast.forecast.flatMap(d => d.items) ?? []

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
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Recent searches */}
        {searches.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {searches.map(city => (
              <button
                key={city}
                onClick={() => handleSearch(city)}
                className="text-xs px-3 py-1 rounded-full
                           bg-white dark:bg-gray-800
                           border border-gray-200 dark:border-gray-700
                           text-gray-600 dark:text-gray-400
                           hover:border-rainy hover:text-rainy
                           transition-colors duration-200"
              >
                {city}
              </button>
            ))}
            <button
              onClick={clearSearches}
              className="text-xs text-gray-400 hover:text-red-400
                         transition-colors duration-200 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

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
            <CurrentWeatherCard data={data.current}           unit={UNIT} />
            <HourlyChart        items={hourlyItems}           unit={UNIT} />
            <ForecastCards      forecast={data.forecast.forecast} unit={UNIT} />
          </div>
        )}

      </div>

      {/* AI Chatbot — floats bottom-right, receives live weather context */}
      <ChatBot
        weather={data?.current          ?? null}
        forecast={data?.forecast.forecast ?? null}
      />

    </main>
  )
}