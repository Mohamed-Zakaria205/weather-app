import type { ExtendedDailyData } from "../../types/weather";
import { useMemo } from "react";

interface ExtendedForecastDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExtendedDailyData[];
  city: string;
}

export function ExtendedForecastDrawer({
  isOpen,
  onClose,
  data,
  city,
}: ExtendedForecastDrawerProps) {
  // Compute average precipitation chance across all days
  const avgPrecip = useMemo(() => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, d) => sum + d.humidity, 0);
    return Math.round(total / data.length);
  }, [data]);

  // Generate precipitation bar chart heights from humidity data
  const precipBars = useMemo(() => {
    return data.map((d) => ({
      day: d.day,
      height: Math.max(8, (d.humidity / 100) * 100),
    }));
  }, [data]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#191c1e]/5 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 w-full max-w-xl bg-[#e8f0fe]/80 backdrop-blur-2xl shadow-2xl h-full flex flex-col border-l border-[#c1c6d7]/15 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <header className="flex justify-between items-start px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <button
              onClick={onClose}
              className="mt-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors active:scale-95 cursor-pointer text-blue-800"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
            </button>
            <div>
              <h2 className="text-xl font-heading font-bold tracking-tight text-blue-900">
                Extended Forecast
              </h2>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-primary text-sm">
                  location_on
                </span>
                {city}
              </p>
            </div>
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors text-on-surface-variant cursor-pointer">
            <span className="material-symbols-outlined text-xl">
              more_vert
            </span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 hide-scrollbar">
          {/* Precipitation Summary Card */}
          <section className="mb-8 p-5 rounded-2xl bg-white/50 border border-[#c1c6d7]/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-heading font-bold text-on-surface">
                  Precipitation
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Next 7 days probability
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-heading font-bold text-primary">
                  {avgPrecip}%
                </span>
                <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">
                  Avg. Chance
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-20">
              {precipBars.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-primary/20 relative overflow-hidden transition-all duration-500"
                    style={{ height: `${bar.height}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary/40 rounded-t-md"
                      style={{ height: `${Math.min(bar.height, 70)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {precipBars.map((bar, i) => (
                <span
                  key={i}
                  className="flex-1 text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-wider"
                >
                  {bar.day}
                </span>
              ))}
            </div>
          </section>

          {/* 7-Day Outlook */}
          <h3 className="text-sm font-heading font-bold text-primary mb-4 px-1">
            7-Day Outlook
          </h3>

          <div className="space-y-4">
            {data.map((day, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white/50 border border-[#c1c6d7]/10 transition-all hover:bg-white/70"
              >
                {/* Top Row: Date + Icon + Temps */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-base font-heading font-bold text-on-surface">
                      {day.fullDate}
                    </h4>
                    <p className="text-xs text-on-surface-variant">{day.condition}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-3xl ${day.iconColor}`}
                      style={{
                        fontVariationSettings: day.filled
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {day.icon}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-heading font-bold text-on-surface">
                        {day.high}°
                      </span>
                      <span className="text-sm text-on-surface-variant ml-0.5">
                        / {day.low}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {day.description}
                </p>

                {/* Bottom Stats Row (Humidity, Wind, UV) */}
                <div className="flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">
                      water_drop
                    </span>
                    <span className="font-bold text-on-surface-variant">
                      {day.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">
                      air
                    </span>
                    <span className="font-bold text-on-surface-variant">
                      {day.windSpeed} mph
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">
                      sunny
                    </span>
                    <span className="font-bold text-on-surface-variant">
                      UV {day.uv}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
