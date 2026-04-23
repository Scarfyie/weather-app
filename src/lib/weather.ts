/**
 * @fileoverview Weather service — wraps OpenWeather API calls and
 * transforms raw responses into typed application models.
 * All fetch calls use Next.js extended fetch with a 5-minute
 * revalidation window so repeated requests are served from cache.
 */

import type {
  CurrentWeather,
  ForecastData,
  DailyForecast,
  ForecastItem,
  TemperatureUnit,
} from '@/types/weather'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const API_KEY  = process.env.OPENWEATHER_API_KEY

/**
 * Formats a Unix timestamp into a full weekday name.
 * @param timestamp - Unix UTC timestamp in seconds
 * @returns Full day name e.g. "Monday"
 */
function formatDay(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
  })
}

/**
 * Formats a Unix timestamp into a short day + date string.
 * @param timestamp - Unix UTC timestamp in seconds
 * @returns Short label e.g. "Mon 12"
 */
function formatDayShort(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    day:     'numeric',
  })
}

/**
 * Fetches current weather conditions for a city.
 * Results are cached for 5 minutes via Next.js fetch revalidation.
 *
 * @param city - City name to search e.g. "Manila"
 * @param unit - Temperature unit system, defaults to metric
 * @returns Normalised {@link CurrentWeather} object
 * @throws Error if city is not found or the API request fails
 *
 * @example
 * const weather = await fetchCurrentWeather('London', 'metric')
 * console.log(weather.temp) // 14
 */
export async function fetchCurrentWeather(
  city: string,
  unit: TemperatureUnit = 'metric'
): Promise<CurrentWeather> {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`
  const res = await fetch(url, { next: { revalidate: 300 } })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Failed to fetch current weather')
  }

  const data = await res.json()

  return {
    city:       data.name,
    country:    data.sys.country,
    lat:        data.coord.lat,
    lon:        data.coord.lon,
    temp:       Math.round(data.main.temp),
    feelsLike:  Math.round(data.main.feels_like),
    tempMin:    Math.round(data.main.temp_min),
    tempMax:    Math.round(data.main.temp_max),
    humidity:   data.main.humidity,
    pressure:   data.main.pressure,
    visibility: data.visibility,
    windSpeed:  data.wind.speed,
    windDeg:    data.wind.deg,
    clouds:     data.clouds.all,
    sunrise:    data.sys.sunrise,
    sunset:     data.sys.sunset,
    condition:  data.weather[0],
    updatedAt:  data.dt,
  }
}

/**
 * Fetches a 5-day weather forecast for a city in 3-hour intervals,
 * then groups the intervals into daily summaries.
 * Results are cached for 5 minutes via Next.js fetch revalidation.
 *
 * @param city - City name to search e.g. "Manila"
 * @param unit - Temperature unit system, defaults to metric
 * @returns {@link ForecastData} with up to 5 daily summaries
 * @throws Error if city is not found or the API request fails
 *
 * @example
 * const forecast = await fetchForecast('Tokyo', 'imperial')
 * forecast.forecast.forEach(day => console.log(day.date, day.tempMax))
 */
export async function fetchForecast(
  city: string,
  unit: TemperatureUnit = 'metric'
): Promise<ForecastData> {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`
  const res = await fetch(url, { next: { revalidate: 300 } })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Failed to fetch forecast')
  }

  const data = await res.json()
  const grouped: Record<string, ForecastItem[]> = {}

  for (const item of data.list) {
    const day = formatDay(item.dt)
    if (!grouped[day]) grouped[day] = []
    grouped[day].push({
      dt:        item.dt,
      temp:      Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      tempMin:   Math.round(item.main.temp_min),
      tempMax:   Math.round(item.main.temp_max),
      humidity:  item.main.humidity,
      windSpeed: item.wind.speed,
      condition: item.weather[0],
      pop:       item.pop,
    })
  }

  const forecast: DailyForecast[] = Object.entries(grouped)
    .slice(0, 5)
    .map(([date, items]) => {
      if (!items || items.length === 0) return null
      const midIndex  = Math.floor(items.length / 2)
      const firstItem = items[0]
      const midItem   = items[midIndex]
      if (!firstItem || !midItem) return null

      return {
        date,
        dateShort:  formatDayShort(firstItem.dt),
        tempMin:    Math.min(...items.map(i => i.tempMin)),
        tempMax:    Math.max(...items.map(i => i.tempMax)),
        condition:  midItem.condition,
        pop:        Math.max(...items.map(i => i.pop)),
        items,
      }
    })
    .filter((day): day is DailyForecast => day !== null)

  return {
    city:    data.city.name,
    country: data.city.country,
    forecast,
  }
}