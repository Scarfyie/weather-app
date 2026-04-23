'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { MessageCircle, X, Send, Trash2, Bot, Loader2 } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import type { CurrentWeather, DailyForecast } from '@/types/weather'
import clsx from 'clsx'

interface Props {
  weather:  CurrentWeather  | null
  forecast: DailyForecast[] | null
}

const SUGGESTED_QUESTIONS = [
  'Should I bring an umbrella today?',
  'What should I wear outside?',
  'Is it good weather for a run?',
  'How is the week looking?',
]

export function ChatBot({ weather, forecast }: Props) {
  const [isOpen,  setIsOpen]  = useState(false)
  const [input,   setInput]   = useState('')
  const messagesEndRef         = useRef<HTMLDivElement>(null)
  const inputRef               = useRef<HTMLTextAreaElement>(null)

  const { messages, loading, error, sendMessage, clearChat } = useChat()

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setInput('')
    await sendMessage(trimmed, weather, forecast)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'fixed bottom-6 right-6 z-40',
          'w-14 h-14 rounded-full shadow-lg',
          'bg-rainy text-white',
          'flex items-center justify-center',
          'hover:bg-rainy-dark transition-all duration-200',
          'hover:scale-105 active:scale-95',
          isOpen && 'hidden'
        )}
        aria-label="Open weather assistant"
      >
        <MessageCircle className="w-6 h-6" />
        {messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-sunny 
                           rounded-full text-xs flex items-center 
                           justify-center font-bold text-sunny-dark">
            AI
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className={clsx(
          'fixed bottom-6 right-6 z-50',
          'w-[350px] md:w-[400px]',
          'h-[560px]',
          'bg-white dark:bg-gray-900',
          'border border-gray-200 dark:border-gray-700',
          'rounded-3xl shadow-2xl',
          'flex flex-col',
          'animate-slide-up'
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 
                          border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rainy-light 
                              dark:bg-rainy-dark flex items-center justify-center">
                <Bot className="w-4 h-4 text-rainy" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Weather Assistant
                </p>
                <p className="text-xs text-gray-400">
                  Powered by Claude AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-xl text-gray-400 
                             hover:text-red-400 hover:bg-red-50 
                             dark:hover:bg-red-950
                             transition-colors duration-200"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 
                           hover:text-gray-600 hover:bg-gray-100 
                           dark:hover:bg-gray-800
                           transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center 
                              justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rainy-light 
                                dark:bg-rainy-dark flex items-center justify-center">
                  <Bot className="w-6 h-6 text-rainy" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Ask me anything about the weather
                  </p>
                  <p className="text-xs text-gray-400">
                    I have access to current conditions and the 5-day forecast
                  </p>
                </div>

                {/* Suggested questions */}
                <div className="w-full space-y-2">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q, weather, forecast)}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl
                                 bg-gray-50 dark:bg-gray-800
                                 border border-gray-100 dark:border-gray-700
                                 text-gray-600 dark:text-gray-400
                                 hover:border-rainy hover:text-rainy
                                 transition-colors duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map(message => (
              <div
                key={message.id}
                className={clsx(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div className={clsx(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  message.role === 'user'
                    ? 'bg-rainy text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                )}>
                  {message.content || (
                    <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                  )}
                </div>
              </div>
            ))}

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the weather..."
                rows={1}
                disabled={loading}
                className={clsx(
                  'flex-1 resize-none rounded-2xl px-4 py-2.5',
                  'bg-gray-50 dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700',
                  'text-sm text-gray-900 dark:text-white',
                  'placeholder:text-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-rainy/50',
                  'transition-all duration-200',
                  'disabled:opacity-50 max-h-32'
                )}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={clsx(
                  'p-2.5 rounded-2xl shrink-0',
                  'bg-rainy text-white',
                  'hover:bg-rainy-dark',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'transition-all duration-200',
                  'hover:scale-105 active:scale-95'
                )}
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send    className="w-4 h-4" />
                }
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  )
}