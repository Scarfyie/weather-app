'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import type { ForecastItem } from '@/types/weather'

interface Props {
  items: ForecastItem[]
  unit: 'metric' | 'imperial'
}

const unitSymbol = (unit: string) => (unit === 'metric' ? '°C' : '°F')

function formatHour(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  })
}

export function HourlyChart({ items, unit }: Props) {
  // Take next 8 intervals (24 hours)
  const data = items.slice(0, 8).map(item => ({
    time: formatHour(item.dt),
    temp: item.temp,
    pop: Math.round(item.pop * 100),
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
        24-hour forecast
      </h2>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-700"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-gray-400 dark:text-gray-500"
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-gray-400 dark:text-gray-500"
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}°`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg, #fff)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '13px',
            }}
            formatter={(value, name) => {
                const v = Array.isArray(value) ? value[0] : value

                if (v == null) return ['', '']

                return [
                    name === 'temp'
                    ? `${v}${unitSymbol(unit)}`
                    : `${v}%`,
                    name === 'temp' ? 'Temperature' : 'Rain chance',
                ]
            }}
          />

          <Area
            type="monotone"
            dataKey="temp"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#tempGradient)"
            dot={{ fill: '#3B82F6', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}