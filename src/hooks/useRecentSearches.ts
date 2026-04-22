'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'weather-recent-searches'
const MAX_ITEMS   = 5

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setSearches(JSON.parse(stored))
  }, [])

  function addSearch(city: string) {
    setSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== city.toLowerCase())
      const updated  = [city, ...filtered].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function clearSearches() {
    localStorage.removeItem(STORAGE_KEY)
    setSearches([])
  }

  return { searches, addSearch, clearSearches }
}