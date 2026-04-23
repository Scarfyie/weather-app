'use client'

import { useState, useCallback } from 'react'
import type { CurrentWeather, DailyForecast } from '@/types/weather'

export interface ChatMessage {
  id:      string
  role:    'user' | 'assistant'
  content: string
}

interface UseChatReturn {
  messages:   ChatMessage[]
  loading:    boolean
  error:      string | null
  sendMessage: (
    content:  string,
    weather:  CurrentWeather  | null,
    forecast: DailyForecast[] | null
  ) => Promise<void>
  clearChat:  () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const sendMessage = useCallback(async (
    content:  string,
    weather:  CurrentWeather  | null,
    forecast: DailyForecast[] | null
  ) => {
    const userMessage: ChatMessage = {
      id:      crypto.randomUUID(),
      role:    'user',
      content,
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setError(null)

    // Placeholder for the assistant's streaming response
    const assistantId = crypto.randomUUID()
    setMessages(prev => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ])

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role:    m.role,
            content: m.content,
          })),
          weather,
          forecast,
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')
      if (!res.body) throw new Error('No response body')

      // Stream the response text into the assistant message
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content + chunk }
              : m
          )
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.id !== assistantId))
    } finally {
      setLoading(false)
    }
  }, [messages])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, clearChat }
}