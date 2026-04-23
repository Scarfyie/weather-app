'use client'

import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function DocsPage() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(setSpec)
  }, [])

  if (!spec) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500">Loading API docs...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Weather App — API Docs
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Interactive documentation for all REST endpoints
          </p>
        </div>
        <SwaggerUI spec={spec} />
      </div>
    </main>
  )
}