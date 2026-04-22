function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl ${className}`} />
  )
}

export function WeatherSkeleton() {
  return (
    <div className="space-y-4">
      {/* Current weather skeleton */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6 md:p-8">
        <div className="flex justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-16 w-16 rounded-2xl" />
        </div>
        <Skeleton className="h-24 w-40 mb-2" />
        <Skeleton className="h-5 w-28 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  )
}