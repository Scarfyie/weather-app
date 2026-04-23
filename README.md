# Weather App

A full-stack weather application built with Next.js 14, TypeScript, and Tailwind CSS.
Displays real-time weather conditions and a 5-day forecast powered by the OpenWeather API,
with an AI assistant powered by OpenAI GPT-4o.

**[Live Demo](https://weather-app-seven-gamma-76.vercel.app)** · **[API Docs](https://weather-app-seven-gamma-76.vercel.app/docs)**

---

## Features

- **Current conditions** — temperature, humidity, wind, pressure, visibility, sunrise/sunset
- **5-day forecast** — daily high/low, precipitation probability, weather icons
- **24-hour chart** — hourly temperature trend using Recharts
- **City search** — autocomplete powered by OpenWeather Geo API
- **Geolocation** — auto-detect user location with one click
- **Recent searches** — quick access to previously searched cities
- **AI chatbot** — context-aware weather assistant powered by GPT-4o
- **Dark mode** — system preference detected, manually toggleable
- **Responsive** — works on all screen sizes, mobile-first design
- **API documentation** — interactive Swagger UI at `/docs`

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript (strict mode)            |
| Styling     | Tailwind CSS v4                     |
| Charts      | Recharts                            |
| Icons       | Lucide React                        |
| AI          | OpenAI GPT-4o via OpenAI SDK        |
| Weather API | OpenWeather API (v2.5 + Geo API)    |
| Deployment  | Vercel                              |

---

## Getting Started

### Prerequisites

- Node.js v18.17 or later
- npm v9 or later
- OpenWeather API key — [get one free](https://openweathermap.org/api)
- OpenAI API key — [get one here](https://platform.openai.com/api-keys)

### Installation

1. Clone the repository

```bash
git clone https://github.com/Scarfyie/weather-app.git
cd weather-app
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and fill in your keys:

```env
OPENWEATHER_API_KEY=your_openweather_key_here
OPENAI_API_KEY=your_openai_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## API Endpoints

| Method | Endpoint      | Description                              |
|--------|---------------|------------------------------------------|
| GET    | `/api/weather`| Current weather + 5-day forecast         |
| GET    | `/api/geocode`| Reverse geocode coordinates to city name |
| GET    | `/api/cities` | City autocomplete search                 |
| POST   | `/api/chat`   | AI weather assistant (streaming)         |
| GET    | `/api/docs`   | OpenAPI spec as JSON                     |

Full interactive documentation available at [`/docs`](http://localhost:3000/docs).

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── weather/route.ts    # Weather + forecast endpoint
│   │   ├── geocode/route.ts    # Reverse geocoding endpoint
│   │   ├── cities/route.ts     # City autocomplete endpoint
│   │   ├── chat/route.ts       # AI chatbot endpoint
│   │   └── docs/route.ts       # OpenAPI spec endpoint
│   ├── docs/
│   │   └── page.tsx            # Swagger UI page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main weather page
│   └── globals.css             # Tailwind v4 + design tokens
├── components/
│   ├── ThemeToggle.tsx         # Dark mode toggle
│   └── weather/
│       ├── CurrentWeather.tsx  # Current conditions card
│       ├── ForecastCards.tsx   # 5-day forecast grid
│       ├── HourlyChart.tsx     # 24-hour temperature chart
│       ├── SearchBar.tsx       # Search + autocomplete
│       ├── ChatBot.tsx         # AI chatbot UI
│       └── WeatherSkeleton.tsx # Loading skeleton
├── hooks/
│   ├── useWeather.ts           # Weather data fetching hook
│   ├── useChat.ts              # AI chat streaming hook
│   ├── useGeolocation.ts       # Browser geolocation hook
│   └── useRecentSearches.ts    # Recent searches hook
├── lib/
│   ├── weather.ts              # OpenWeather API service
│   ├── weatherIcons.ts         # Icon + color mapping
│   └── openapi.ts              # OpenAPI specification
└── types/
    └── weather.ts              # TypeScript type definitions
```

---

## Environment Variables

| Variable               | Required | Description                        |
|------------------------|----------|------------------------------------|
| `OPENWEATHER_API_KEY`  | Yes      | OpenWeather API key                |
| `OPENAI_API_KEY`       | Yes      | OpenAI API key for GPT-4o          |
| `NEXT_PUBLIC_APP_URL`  | No       | Public URL (used in production)    |

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build locally
npm run lint     # Run ESLint
```

---

## Deployment

This app is deployed on Vercel. To deploy your own:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables in the Vercel dashboard
4. Deploy — every push to `main` triggers an automatic deployment

---

## License

MIT — feel free to use this project as a reference or template.
