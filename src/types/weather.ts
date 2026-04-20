// ── Current weather ──────────────────────────────────────

export interface WeatherCondition {
  id:          number
  main:        string   // e.g. "Rain", "Clear", "Clouds"
  description: string   // e.g. "light rain"
  icon:        string   // e.g. "10d"
}

export interface CurrentWeather {
  city:        string
  country:     string
  lat:         number
  lon:         number
  temp:        number
  feelsLike:   number
  tempMin:     number
  tempMax:     number
  humidity:    number
  pressure:    number
  visibility:  number
  windSpeed:   number
  windDeg:     number
  clouds:      number
  sunrise:     number   // Unix timestamp
  sunset:      number   // Unix timestamp
  condition:   WeatherCondition
  updatedAt:   number   // Unix timestamp
}

// ── Forecast ─────────────────────────────────────────────

export interface ForecastItem {
  dt:        number     // Unix timestamp
  temp:      number
  feelsLike: number
  tempMin:   number
  tempMax:   number
  humidity:  number
  windSpeed: number
  condition: WeatherCondition
  pop:       number     // Probability of precipitation (0–1)
}

export interface DailyForecast {
  date:      string     // e.g. "Monday", "Tuesday"
  dateShort: string     // e.g. "Mon 12"
  tempMin:   number
  tempMax:   number
  condition: WeatherCondition
  pop:       number
  items:     ForecastItem[]
}

export interface ForecastData {
  city:     string
  country:  string
  forecast: DailyForecast[]
}

// ── API response types ────────────────────────────────────

export interface WeatherApiResponse {
  current:  CurrentWeather
  forecast: ForecastData
}

export interface ApiError {
  error:   string
  message: string
  code?:   number
}

// ── Unit system ───────────────────────────────────────────

export type TemperatureUnit = 'metric' | 'imperial'  // °C or °F