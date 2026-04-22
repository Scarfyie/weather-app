import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Thermometer } from 'lucide-react'
import type { CurrentWeather as CurrentWeatherType } from '../../types/weather'
import { getWeatherIcon, formatTime, getWindDirection } from '../../lib/weatherIcons'
import clsx from 'clsx'

interface Props {
  data: CurrentWeatherType
  unit: 'metric' | 'imperial'
}

const unitSymbol = (unit: string) => unit === 'metric' ? '°C' : '°F'
const windUnit   = (unit: string) => unit === 'metric' ? 'm/s' : 'mph'

export function CurrentWeatherCard({ data, unit }: Props) {
  const { icon: WeatherIcon, colorClass, bgClass } = getWeatherIcon(data.condition.main)

  return (
    <div className={clsx(
      'rounded-3xl p-6 md:p-8 transition-all duration-500',
      bgClass
    )}>
      {/* Top row — city + date */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {data.city}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {data.country} ·{' '}
            {new Date(data.updatedAt * 1000).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        <div className={clsx(
          'p-3 rounded-2xl',
          'bg-white/40 dark:bg-black/20'
        )}>
          <WeatherIcon className={clsx('w-10 h-10', colorClass)} />
        </div>
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-4 mb-2">
        <span className="text-7xl md:text-8xl font-bold text-gray-900 dark:text-white leading-none">
          {data.temp}
        </span>
        <div className="mb-3">
          <span className="text-3xl font-light text-gray-600 dark:text-gray-300">
            {unitSymbol(unit)}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Feels like {data.feelsLike}{unitSymbol(unit)}
          </p>
        </div>
      </div>

      {/* Condition */}
      <p className="text-lg capitalize text-gray-700 dark:text-gray-200 mb-6">
        {data.condition.description}
      </p>

      {/* High / Low */}
      <div className="flex gap-3 mb-6">
        <span className="weather-badge bg-white/40 dark:bg-black/20 text-gray-700 dark:text-gray-200">
          <Thermometer className="w-3.5 h-3.5" />
          H: {data.tempMax}{unitSymbol(unit)}
        </span>
        <span className="weather-badge bg-white/40 dark:bg-black/20 text-gray-700 dark:text-gray-200">
          <Thermometer className="w-3.5 h-3.5" />
          L: {data.tempMin}{unitSymbol(unit)}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Droplets,  label: 'Humidity',    value: `${data.humidity}%` },
          { icon: Wind,      label: 'Wind',         value: `${data.windSpeed} ${windUnit(unit)} ${getWindDirection(data.windDeg)}` },
          { icon: Eye,       label: 'Visibility',   value: `${(data.visibility / 1000).toFixed(1)} km` },
          { icon: Gauge,     label: 'Pressure',     value: `${data.pressure} hPa` },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white/40 dark:bg-black/20 rounded-2xl p-3"
          >
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs">{label}</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Sunrise / Sunset */}
      <div className="flex gap-3 mt-3">
        <div className="flex-1 bg-white/40 dark:bg-black/20 rounded-2xl p-3 flex items-center gap-2">
          <Sunrise className="w-4 h-4 text-sunny" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatTime(data.sunrise)}
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white/40 dark:bg-black/20 rounded-2xl p-3 flex items-center gap-2">
          <Sunset className="w-4 h-4 text-sunny-dark" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatTime(data.sunset)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}