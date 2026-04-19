export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-rainy-light">
      <div className="weather-card bg-white dark:bg-gray-800 max-w-sm w-full">
        <h1 className="text-sunny text-3xl font-bold mb-2">
          Tailwind v4 ✓
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Custom colors and components are working.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="weather-badge bg-rainy-light text-rainy-dark">
            Rainy
          </span>
          <span className="weather-badge bg-sunny-light text-sunny-dark">
            Sunny
          </span>
          <span className="weather-badge bg-stormy-light text-stormy-dark">
            Stormy
          </span>
        </div>
      </div>
    </main>
  )
}