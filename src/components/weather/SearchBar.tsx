'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Search, Loader2, MapPin, LocateFixed } from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'
import clsx from 'clsx'

interface CityResult {
  name:    string
  country: string
  state?:  string
}

interface Props {
  onSearch:  (city: string) => void
  loading:   boolean
}

export function SearchBar({ onSearch, loading }: Props) {
  const [value,       setValue]       = useState('')
  const [suggestions, setSuggestions] = useState<CityResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [fetching,    setFetching]    = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef  = useRef<HTMLDivElement>(null)

  const { getLocation, loading: geoLoading, error: geoError } = useGeolocation()

  // Fetch suggestions with debounce
  useEffect(() => {
    if (value.trim().length < 2) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setFetching(true)
      try {
        const res  = await fetch(`/api/cities?q=${encodeURIComponent(value)}`)
        const data = await res.json()
        setSuggestions(data)
        setShowDropdown(true)
      } finally {
        setFetching(false)
      }
    }, 300)
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      onSearch(trimmed)
      setShowDropdown(false)
    }
  }

  function handleSelect(city: CityResult) {
    setValue(city.name)
    onSearch(city.name)
    setShowDropdown(false)
  }

  function handleGeolocate() {
    getLocation((city) => {
      setValue(city)
      onSearch(city)
    })
  }

  return (
    <div className="flex gap-2 w-full">
      <div ref={wrapperRef} className="relative flex-1">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder="Search city..."
            disabled={loading}
            className={clsx(
              'w-full rounded-2xl py-3 pl-5 pr-12',
              'bg-white dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-rainy/50',
              'transition-all duration-200 disabled:opacity-50'
            )}
          />
          <button
            type="submit"
            disabled={loading || fetching || !value.trim()}
            className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1.5 rounded-xl text-gray-400 hover:text-rainy',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'transition-colors duration-200'
            )}
          >
            {loading || fetching
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Search  className="w-5 h-5" />
            }
          </button>
        </form>

        {/* Autocomplete dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <ul className={clsx(
            'absolute z-50 w-full mt-1',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-2xl shadow-lg overflow-hidden'
          )}>
            {suggestions.map((city, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSelect(city)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 text-left',
                    'hover:bg-gray-50 dark:hover:bg-gray-700',
                    'transition-colors duration-150'
                  )}
                >
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {city.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {city.state ? `${city.state}, ` : ''}{city.country}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Geo error */}
        {geoError && (
          <p className="absolute mt-1 text-xs text-red-500">{geoError}</p>
        )}
      </div>

      {/* Geolocation button */}
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={geoLoading || loading}
        title="Use my location"
        className={clsx(
          'p-3 rounded-2xl shrink-0',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'text-gray-400 hover:text-rainy dark:hover:text-rainy',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
      >
        {geoLoading
          ? <Loader2     className="w-5 h-5 animate-spin" />
          : <LocateFixed className="w-5 h-5" />
        }
      </button>
    </div>
  )
}