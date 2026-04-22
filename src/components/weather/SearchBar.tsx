'use client'

import { useState, type FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  onSearch:  (city: string) => void
  loading:   boolean
}

export function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search city..."
        disabled={loading}
        className={clsx(
          'w-full rounded-2xl py-3 pl-5 pr-12',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'text-gray-900 dark:text-white',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-rainy/50',
          'transition-all duration-200',
          'disabled:opacity-50'
        )}
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className={clsx(
          'absolute right-3 top-1/2 -translate-y-1/2',
          'p-1.5 rounded-xl',
          'text-gray-400 hover:text-rainy',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
      >
        {loading
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <Search  className="w-5 h-5" />
        }
      </button>
    </form>
  )
}