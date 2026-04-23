import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import type { CurrentWeather, DailyForecast } from '@/types/weather'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[]
  weather:  CurrentWeather  | null
  forecast: DailyForecast[] | null
}

function buildSystemPrompt(
  weather:  CurrentWeather  | null,
  forecast: DailyForecast[] | null
): string {
  const weatherContext = weather ? `
## Current weather in ${weather.city}, ${weather.country}
- Temperature:   ${weather.temp}°C (feels like ${weather.feelsLike}°C)
- Condition:     ${weather.condition.description}
- Humidity:      ${weather.humidity}%
- Wind:          ${weather.windSpeed} m/s
- Visibility:    ${(weather.visibility / 1000).toFixed(1)} km
- Pressure:      ${weather.pressure} hPa
` : ''

  const forecastContext = forecast?.length ? `
## 5-day forecast
${forecast.map(day => `
- ${day.date}: ${day.condition.description}, 
  High ${day.tempMax}°C / Low ${day.tempMin}°C, 
  Rain chance ${Math.round(day.pop * 100)}%`
).join('')}
` : ''

  return `You are a friendly and helpful weather assistant with access to real-time weather data.

${weatherContext}
${forecastContext}

## Your role
- Answer questions about the current weather and forecast naturally
- Give practical advice like what to wear, whether to bring an umbrella, 
  if it's good for outdoor activities, etc.
- Keep responses concise and conversational — 2 to 4 sentences max
- If asked about weather data you don't have, say so honestly
- Use the weather data above to give specific, accurate answers
- Be warm and friendly in tone

Today's date: ${new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest
    const { messages, weather, forecast } = body

    if (!messages?.length) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      )
    }

    const systemPrompt = buildSystemPrompt(weather, forecast)

    const stream = await openai.chat.completions.create({
      model:    'gpt-4o',       // or 'gpt-4o-mini' for cheaper/faster
      max_tokens: 1024,
      stream:   true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role:    m.role,
          content: m.content,
        })),
      ],
    })

    // Stream the response back
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
        controller.close()
      },
    })

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type':      'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}