import { WeatherCard } from "./components/weather/WeatherCard";
import { HourlyForecast } from "./components/weather/HourlyForecast";
import { SevenDayForecast } from "./components/weather/SevenDayForecast";
import { WeatherDetails } from "./components/weather/WeatherDetails";
import { RadarMap } from "./components/weather/RadarMap";
import { DailyForecastDrawer } from "./components/weather/DailyForecastDrawer";
import { ExtendedForecastDrawer } from "./components/weather/ExtendedForecastDrawer";
import { useState, useRef, useEffect } from "react";
import useCustomeQuery from "./hooks/useCustomeQuery";
import { transformWeatherData, mapIcon } from "./utils/functions";
import type { SearchResult } from "./utils/functions";

const API_KEY = "70058cd13c394cb588d222355260304";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Cairo");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Weather data query
  const {
    data: weatherApiData,
    isLoading,
    isError,
  } = useCustomeQuery({
    url: `/forecast.json?key=${API_KEY}&q=${city}&days=7`,
    queryKey: ["weather", city],
  });

  // Search autocomplete query
  const { data: searchResults } = useCustomeQuery({
    url: `/search.json?key=${API_KEY}&q=${query}`,
    queryKey: ["search", query],
    enabled: query.length > 2,
  });

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (result: SearchResult) => {
    setCity(result.name);
    setQuery("");
    setShowResults(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      setCity(query.trim());
      setQuery("");
      setShowResults(false);
    }
  };

  // Loading state
  if (isLoading || !weatherApiData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-primary flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-4xl">
            progress_activity
          </span>
          <span className="text-xl font-bold font-heading">
            Loading Weather...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-red-400 text-6xl">
          cloud_off
        </span>
        <p className="text-red-500 font-semibold text-lg">
          Error loading weather data. Please try again.
        </p>
        <button
          onClick={() => setCity("Cairo")}
          className="px-6 py-2 bg-primary text-white rounded-full font-semibold cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    weatherData,
    hourlyData,
    hourly24Data,
    sevenDayData,
    extendedForecastData,
    detailsData,
  } = transformWeatherData(weatherApiData);

  const heroIcon = mapIcon(weatherData.condition);

  return (
    <div className="text-foreground">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl shadow-sm shadow-blue-500/5 font-heading">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tight text-slate-900 cursor-pointer">
              SkyClarity
            </span>
            {/* <div className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-blue-700 font-semibold border-b-2 border-blue-600 pb-0.5 transition-all duration-300"
              >
                Forecast
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-500 transition-all duration-300"
              >
                Radar
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-500 transition-all duration-300"
              >
                History
              </a>
            </div> */}
          </div>
          <div className="flex items-center gap-4">
            {/* Search Box */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">
                    search
                  </span>
                </div>
                <input
                  className="bg-white/80 backdrop-blur-md border-none rounded-full py-2.5 pl-12 pr-6 w-48 md:w-64 focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none text-sm placeholder:text-slate-400"
                  placeholder="Search city..."
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => {
                    if (query.length > 2) setShowResults(true);
                  }}
                />
              </form>

              {/* Search Results Dropdown */}
              {showResults &&
                Array.isArray(searchResults) &&
                searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-lg overflow-hidden z-50 border border-white/20">
                    {(searchResults as SearchResult[]).map(
                      (result: SearchResult) => (
                        <button
                          key={result.id}
                          className="w-full text-left px-4 py-3 hover:bg-white/40 transition-colors flex items-center gap-3 cursor-pointer border-b border-white/10 last:border-none"
                          onClick={() => handleSelectCity(result)}
                        >
                          <span className="material-symbols-outlined text-primary text-lg">
                            location_on
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {result.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {result.region}, {result.country}
                            </p>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                )}

              {/* No Results */}
              {showResults &&
                query.length > 2 &&
                Array.isArray(searchResults) &&
                searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-lg p-4 z-50 border border-white/20">
                    <p className="text-sm text-slate-500 text-center">
                      No cities found
                    </p>
                  </div>
                )}
            </div>

            {/* <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-white/40 transition-all duration-300 cursor-pointer active:scale-95 text-on-surface-variant">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button className="p-2 rounded-full hover:bg-white/40 transition-all duration-300 cursor-pointer active:scale-95 text-on-surface-variant">
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </button>
            </div> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-12 max-w-7xl mx-auto px-6">
        {/* Hero Section: Detached Title + Temperature */}
        <section className="mb-12 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading text-foreground mb-2">
              {weatherData.city}
            </h1>
            <p className="text-on-surface-variant font-medium text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                calendar_today
              </span>
              {weatherData.date} • {weatherData.time}
            </p>
            <WeatherCard data={weatherData} />
          </div>
          {/* Large weather icon with frosted halo */}
          <div className="w-64 h-64 relative flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
            <span
              className="material-symbols-outlined text-primary relative z-10 filled"
              style={{ fontSize: "160px", fontVariationSettings: "'FILL' 1" }}
            >
              {heroIcon}
            </span>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Hourly + Details + Map */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <HourlyForecast
              data={hourlyData}
              onOpen24h={() => setIsDrawerOpen(true)}
            />
            <WeatherDetails data={detailsData} />
            <RadarMap />
          </div>

          {/* Right Column: 7-Day Forecast */}
          <div className="lg:col-span-4 h-full">
            <SevenDayForecast
              data={sevenDayData}
              onViewDetails={() => setIsExtendedOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-slate-50/40 backdrop-blur-md text-slate-500 text-sm tracking-wide font-sans">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="mb-6 md:mb-0">
            <span className="font-black text-slate-800 text-xl font-heading">
              SkyClarity
            </span>
            <p className="mt-2 opacity-80">
              © 2024 SkyClarity Atmospheric Data. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="hover:text-blue-500 transition-colors opacity-80 hover:opacity-100"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="hover:text-blue-500 transition-colors opacity-80 hover:opacity-100"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="hover:text-blue-500 transition-colors opacity-80 hover:opacity-100"
              href="#"
            >
              API Documentation
            </a>
          </div>
        </div>
      </footer>

      <DailyForecastDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={hourly24Data}
        city={weatherData.city}
      />

      <ExtendedForecastDrawer
        isOpen={isExtendedOpen}
        onClose={() => setIsExtendedOpen(false)}
        data={extendedForecastData}
        city={weatherData.city}
      />
    </div>
  );
}

export default App;
