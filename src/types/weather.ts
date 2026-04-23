/**
 * Represents a single weather condition returned by OpenWeather API.
 * A weather response can contain multiple conditions but we use the first.
 */
export interface WeatherCondition {
  /** OpenWeather condition ID — used to determine icon and severity */
  id:          number
  /** Condition group e.g. "Rain", "Clear", "Clouds", "Thunderstorm" */
  main:        string
  /** Human-readable description e.g. "light rain", "overcast clouds" */
  description: string
  /** Icon code for OpenWeather icon CDN e.g. "10d", "01n" */
  icon:        string
}

/**
 * Current weather conditions for a specific city.
 * Returned by the /api/weather endpoint and used to populate
 * the main weather card and AI chatbot context.
 */
export interface CurrentWeather {
  /** City name as returned by OpenWeather e.g. "Manila" */
  city:        string
  /** ISO 3166 country code e.g. "PH", "GB", "US" */
  country:     string
  /** Latitude coordinate of the city */
  lat:         number
  /** Longitude coordinate of the city */
  lon:         number
  /** Current temperature in the requested unit */
  temp:        number
  /** Perceived temperature accounting for wind and humidity */
  feelsLike:   number
  /** Minimum temperature within large cities and urban areas */
  tempMin:     number
  /** Maximum temperature within large cities and urban areas */
  tempMax:     number
  /** Humidity percentage 0–100 */
  humidity:    number
  /** Atmospheric pressure in hPa */
  pressure:    number
  /** Visibility in metres, max 10,000 */
  visibility:  number
  /** Wind speed in m/s (metric) or mph (imperial) */
  windSpeed:   number
  /** Wind direction in degrees, meteorological */
  windDeg:     number
  /** Cloudiness percentage 0–100 */
  clouds:      number
  /** Sunrise time as Unix UTC timestamp */
  sunrise:     number
  /** Sunset time as Unix UTC timestamp */
  sunset:      number
  /** Primary weather condition */
  condition:   WeatherCondition
  /** Time of data calculation as Unix UTC timestamp */
  updatedAt:   number
}

/**
 * A single 3-hour forecast interval from the OpenWeather forecast API.
 * Multiple items are grouped into {@link DailyForecast} objects.
 */
export interface ForecastItem {
  /** Forecast time as Unix UTC timestamp */
  dt:        number
  temp:      number
  feelsLike: number
  tempMin:   number
  tempMax:   number
  humidity:  number
  windSpeed: number
  condition: WeatherCondition
  /** Probability of precipitation as a decimal 0–1 */
  pop:       number
}

/**
 * Aggregated daily forecast built from grouping 3-hour intervals.
 * The condition is taken from the midday interval for accuracy.
 */
export interface DailyForecast {
  /** Full day name e.g. "Monday" */
  date:      string
  /** Short date label e.g. "Mon 12" */
  dateShort: string
  /** Lowest temperature across all intervals that day */
  tempMin:   number
  /** Highest temperature across all intervals that day */
  tempMax:   number
  /** Weather condition from the midday interval */
  condition: WeatherCondition
  /** Highest precipitation probability across all intervals */
  pop:       number
  /** All 3-hour intervals for this day */
  items:     ForecastItem[]
}

/**
 * Full forecast response for a city including all daily summaries.
 */
export interface ForecastData {
  city:     string
  country:  string
  forecast: DailyForecast[]
}

/**
 * Combined API response from /api/weather containing both
 * current conditions and the 5-day forecast.
 */
export interface WeatherApiResponse {
  current:  CurrentWeather
  forecast: ForecastData
}

/**
 * Standard error response shape returned by all API routes
 * when a request fails.
 */
export interface ApiError {
  /** Short error category e.g. "Not Found", "Bad Request" */
  error:   string
  /** Human-readable error description */
  message: string
  /** Optional HTTP status code */
  code?:   number
}

/**
 * Temperature unit system.
 * - metric   → Celsius (°C), wind in m/s
 * - imperial → Fahrenheit (°F), wind in mph
 */
export type TemperatureUnit = 'metric' | 'imperial'