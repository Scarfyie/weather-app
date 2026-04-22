import type { DailyForecast } from '@/types/weather'
import { getWeatherIcon } from '@/lib/weatherIcons'
import { Droplets } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  forecast: DailyForecast[]
  unit:     'metric' | 'imperial'
}

const unitSymbol = (unit: string) => unit === 'metric' ? '°C' : '°F'

export function ForecastCards({ forecast, unit }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
        5-day forecast
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {forecast.map((day, index) => {
          const { icon: WeatherIcon, colorClass, bgClass } = getWeatherIcon(
            day.condition.main
          )
          const isToday = index === 0

          return (
            <div
              key={day.date}
              className={clsx(
                'rounded-2xl p-4 flex flex-col items-center gap-2',
                'transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
                isToday
                  ? bgClass
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
              )}
            >
              <p className={clsx(
                'text-xs font-medium',
                isToday
                  ? 'text-gray-700 dark:text-gray-200'
                  : 'text-gray-500 dark:text-gray-400'
              )}>
                {isToday ? 'Today' : day.dateShort}
              </p>

              <WeatherIcon className={clsx('w-8 h-8', colorClass)} />

              <p className="text-xs capitalize text-center text-gray-500 dark:text-gray-400 leading-tight">
                {day.condition.description}
              </p>

              <div className="flex gap-2 text-sm font-semibold">
                <span className="text-gray-900 dark:text-white">
                  {day.tempMax}{unitSymbol(unit)}
                </span>
                <span className="text-gray-400 dark:text-gray-500">
                  {day.tempMin}{unitSymbol(unit)}
                </span>
              </div>

              {day.pop > 0 && (
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-rainy" />
                  <span className="text-xs text-rainy">
                    {Math.round(day.pop * 100)}%
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}