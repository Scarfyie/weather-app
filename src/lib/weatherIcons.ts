import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudDrizzle, Wind, CloudFog, type LucideIcon
} from 'lucide-react'

interface WeatherIconConfig {
  icon:       LucideIcon
  colorClass: string
  bgClass:    string
}

export function getWeatherIcon(conditionMain: string): WeatherIconConfig {
  const condition = conditionMain.toLowerCase()

  if (condition.includes('thunderstorm')) return {
    icon:       CloudLightning,
    colorClass: 'text-stormy',
    bgClass:    'bg-stormy-light dark:bg-stormy-dark',
  }
  if (condition.includes('drizzle')) return {
    icon:       CloudDrizzle,
    colorClass: 'text-rainy',
    bgClass:    'bg-rainy-light dark:bg-rainy-dark',
  }
  if (condition.includes('rain')) return {
    icon:       CloudRain,
    colorClass: 'text-rainy',
    bgClass:    'bg-rainy-light dark:bg-rainy-dark',
  }
  if (condition.includes('snow')) return {
    icon:       CloudSnow,
    colorClass: 'text-snowy-dark',
    bgClass:    'bg-snowy-light dark:bg-snowy-dark',
  }
  if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) return {
    icon:       CloudFog,
    colorClass: 'text-cloudy',
    bgClass:    'bg-cloudy-light dark:bg-cloudy-dark',
  }
  if (condition.includes('wind') || condition.includes('squall')) return {
    icon:       Wind,
    colorClass: 'text-cloudy',
    bgClass:    'bg-cloudy-light dark:bg-cloudy-dark',
  }
  if (condition.includes('cloud')) return {
    icon:       Cloud,
    colorClass: 'text-cloudy',
    bgClass:    'bg-cloudy-light dark:bg-cloudy-dark',
  }

  // Default: clear/sunny
  return {
    icon:       Sun,
    colorClass: 'text-sunny',
    bgClass:    'bg-sunny-light dark:bg-sunny-dark',
  }
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export function getWindDirection(deg: number): string {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8] ?? 'N'
}