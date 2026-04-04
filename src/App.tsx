import { WeatherCard } from './components/weather/WeatherCard'
import { HourlyForecast } from './components/weather/HourlyForecast'
import { SevenDayForecast } from './components/weather/SevenDayForecast'
import { WeatherDetails } from './components/weather/WeatherDetails'
import { RadarMap } from './components/weather/RadarMap'
import { DailyForecastDrawer } from './components/weather/DailyForecastDrawer'
import { useState } from 'react'

// Mock Data matching the exact Stitch reference design
const weatherData = {
  city: "San Francisco, CA",
  temperature: 72,
  high: 76,
  low: 58,
  condition: "Partly Cloudy",
  date: "Monday, Oct 24",
  time: "10:45 AM"
}

const hourlyData = [
  { time: "Now", temperature: 72, icon: "partly_cloudy_day", filled: true },
  { time: "11 AM", temperature: 73, icon: "partly_cloudy_day", filled: true },
  { time: "12 PM", temperature: 75, icon: "sunny", filled: true },
  { time: "1 PM", temperature: 76, icon: "sunny", filled: true },
  { time: "2 PM", temperature: 76, icon: "sunny", filled: true },
  { time: "3 PM", temperature: 74, icon: "partly_cloudy_day", filled: true },
  { time: "4 PM", temperature: 72, icon: "cloud", filled: false },
  { time: "5 PM", temperature: 70, icon: "cloud", filled: false },
  { time: "6 PM", temperature: 68, icon: "cloud", filled: false },
]

const sevenDayData = [
  { day: "Mon", high: 72, low: 58, icon: "partly_cloudy_day", condition: "Partly Cloudy", filled: true, iconColor: "text-primary" },
  { day: "Tue", high: 78, low: 60, icon: "sunny", condition: "Sunny", filled: true, iconColor: "text-amber-500" },
  { day: "Wed", high: 81, low: 62, icon: "sunny", condition: "Sunny", filled: true, iconColor: "text-amber-500" },
  { day: "Thu", high: 69, low: 55, icon: "cloud", condition: "Cloudy", filled: false, iconColor: "text-blue-400" },
  { day: "Fri", high: 64, low: 52, icon: "rainy", condition: "Showers", filled: false, iconColor: "text-blue-400" },
  { day: "Sat", high: 70, low: 56, icon: "partly_cloudy_day", condition: "Partial Sun", filled: true, iconColor: "text-primary" },
  { day: "Sun", high: 75, low: 58, icon: "sunny", condition: "Sunny", filled: true, iconColor: "text-amber-500" },
]

const detailsData = {
  humidity: 45,
  dewPoint: 52,
  windDirection: "NNW",
  windSpeed: 12,
  uvIndex: "Moderate",
  realFeel: 75,
}

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="text-foreground">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl shadow-sm shadow-blue-500/5 font-heading">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tight text-slate-900 cursor-pointer">
              SkyClarity
            </span>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-blue-700 font-semibold border-b-2 border-blue-600 pb-0.5 transition-all duration-300">
                Forecast
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-500 transition-all duration-300">
                Radar
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-500 transition-all duration-300">
                History
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="bg-white/80 backdrop-blur-md border-none rounded-full py-2.5 pl-12 pr-6 w-48 md:w-64 focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none text-sm placeholder:text-slate-400"
                placeholder="Search city..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-white/40 transition-all duration-300 cursor-pointer active:scale-95 text-on-surface-variant">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button className="p-2 rounded-full hover:bg-white/40 transition-all duration-300 cursor-pointer active:scale-95 text-on-surface-variant">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-12 max-w-7xl mx-auto px-6">

        {/* Hero Section: Detached Title + Temperature */}
        <section className="mb-12 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading text-foreground mb-2">
              San Francisco, CA
            </h1>
            <p className="text-on-surface-variant font-medium text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              Monday, Oct 24 • 10:45 AM
            </p>
            <WeatherCard data={weatherData} />
          </div>
          {/* Large weather icon with frosted halo */}
          <div className="w-64 h-64 relative flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
            <span
              className="material-symbols-outlined text-primary relative z-10 filled"
              style={{ fontSize: '160px', fontVariationSettings: "'FILL' 1" }}
            >
              partly_cloudy_day
            </span>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Hourly + Details + Map */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <HourlyForecast data={hourlyData} onOpen24h={() => setIsDrawerOpen(true)} />
            <WeatherDetails data={detailsData} />
            <RadarMap />
          </div>

          {/* Right Column: 7-Day Forecast */}
          <div className="lg:col-span-4 h-full">
            <SevenDayForecast data={sevenDayData} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-slate-50/40 backdrop-blur-md text-slate-500 text-sm tracking-wide font-sans">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="mb-6 md:mb-0">
            <span className="font-black text-slate-800 text-xl font-heading">SkyClarity</span>
            <p className="mt-2 opacity-80">© 2024 SkyClarity Atmospheric Data. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="hover:text-blue-500 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="hover:text-blue-500 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="hover:text-blue-500 transition-colors opacity-80 hover:opacity-100" href="#">API Documentation</a>
          </div>
        </div>
      </footer>
      
      <DailyForecastDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        data={hourlyData}
      />
    </div>
  )
}

export default App
