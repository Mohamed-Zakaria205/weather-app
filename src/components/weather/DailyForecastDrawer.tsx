import type { HourlyForecastData } from "../../types/weather";
import { useMemo } from "react";

interface DailyForecastDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: HourlyForecastData[];
  city: string;
}

export function DailyForecastDrawer({
  isOpen,
  onClose,
  data,
  city,
}: DailyForecastDrawerProps) {
  // Compute high/low from the 24h data
  const { highTemp, lowTemp, chartPath, chartFill, chartDots, chartLabels } =
    useMemo(() => {
      if (data.length === 0)
        return {
          highTemp: 0,
          lowTemp: 0,
          chartPath: "",
          chartFill: "",
          chartDots: [],
          chartLabels: [],
        };

      const temps = data.map((d) => d.temperature);
      const high = Math.max(...temps);
      const low = Math.min(...temps);
      const range = high - low || 1;

      // Generate SVG spline points
      const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 38 - ((d.temperature - low) / range) * 34; // 4..38 range
        return { x, y };
      });

      // Build smooth path with quadratic curves
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const cx = (points[i - 1].x + points[i].x) / 2;
        path += ` Q ${cx} ${points[i - 1].y}, ${points[i].x} ${points[i].y}`;
      }

      const fillPath = `${path} V 40 H 0 Z`;

      // Sample 6 evenly-spaced dots
      const step = Math.max(1, Math.floor(data.length / 5));
      const dots = [0, step, step * 2, step * 3, step * 4, data.length - 1]
        .filter((i) => i < data.length)
        .map((i) => points[i]);

      // Labels at 5 points
      const labelStep = Math.max(1, Math.floor(data.length / 4));
      const labels = [
        0,
        labelStep,
        labelStep * 2,
        labelStep * 3,
        data.length - 1,
      ]
        .filter((i) => i < data.length)
        .map((i) => data[i].time);

      return {
        highTemp: high,
        lowTemp: low,
        chartPath: path,
        chartFill: fillPath,
        chartDots: dots,
        chartLabels: labels,
      };
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

      {/* Panel Content */}
      <div
        className={`fixed top-0 right-0 z-50 w-full max-w-xl bg-white/60 dark:bg-slate-900/60 glass shadow-2xl h-full flex flex-col border-l border-[#c1c6d7]/15 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* TopAppBar */}
        <header className="absolute top-0 w-full max-w-xl z-50 flex justify-between items-center px-6 py-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm shadow-blue-500/5 transition-colors duration-300">
          <div className="flex flex-col">
            <span className="text-xs font-sans uppercase tracking-widest text-outline">
              {city}
            </span>
            <h2 className="text-xl font-heading font-bold tracking-tight text-blue-900 dark:text-blue-100">
              24-Hour Forecast
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors active:scale-95 duration-200 text-blue-700 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pt-24 pb-12 px-6 hide-scrollbar">
          {/* Temperature Chart Section */}
          <section className="mb-10 p-6 rounded-xl bg-white/40 border border-[#c1c6d7]/10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-sm font-sans text-on-surface-variant">
                  Temperature Trend
                </span>
                <div className="text-3xl font-heading font-bold text-primary">
                  High {highTemp}°{" "}
                  <span className="text-outline font-light">
                    / Low {lowTemp}°
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-40 w-full">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <defs>
                  <linearGradient
                    id="chartGradient24h"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#005da7"
                      stopOpacity="0.3"
                    ></stop>
                    <stop
                      offset="100%"
                      stopColor="#005da7"
                      stopOpacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
                <path d={chartFill} fill="url(#chartGradient24h)"></path>
                <path
                  d={chartPath}
                  fill="none"
                  stroke="#005da7"
                  strokeWidth="0.8"
                ></path>
                {chartDots.map((dot, i) => (
                  <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    fill="#005da7"
                    r={i === 2 ? 1.5 : 1}
                  ></circle>
                ))}
              </svg>
              <div className="flex justify-between mt-2 text-[10px] font-sans text-outline uppercase tracking-tighter">
                {chartLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Detailed Hourly List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4 px-2">
              Next 24 Hours
            </h3>

            {data.map((item, index) => {
              const isCurrent = index === 0;
              const prob = item.probOfPrecip ?? 0;
              const isNight = !item.isDay && !item.filled;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-white/80 border-[#c1c6d7]/5 shadow-sm hover:translate-x-1"
                      : isNight
                        ? "bg-[#f2f4f6]/20 border-transparent"
                        : "bg-[#f2f4f6]/40 border-transparent hover:bg-white/60"
                  }`}
                >
                  <div className="w-16">
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? "font-semibold text-on-surface-variant"
                          : isNight
                            ? "font-medium text-on-surface-variant/60"
                            : "font-medium text-on-surface-variant"
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className={`material-symbols-outlined text-2xl ${isNight ? "text-primary/60" : "text-primary"}`}
                      style={{
                        fontVariationSettings: item.filled
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {isNight ? "bedtime" : item.icon}
                    </span>
                  </div>
                  <div className="w-16 text-center">
                    <span
                      className={`text-xl font-heading ${
                        isCurrent
                          ? "font-extrabold text-primary"
                          : isNight
                            ? "font-bold text-on-surface/60"
                            : "font-bold text-on-surface"
                      }`}
                    >
                      {item.temperature}°
                    </span>
                  </div>
                  <div className="w-24">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        water_drop
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant">
                        {prob}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min(prob, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span
                        className={`text-[11px] font-medium ${isNight ? "text-outline/60" : "text-outline"}`}
                      >
                        {item.windSpeed ?? 0} mph
                      </span>
                    </div>
                    <span
                      className={`text-[9px] uppercase font-bold ${isNight ? "text-outline/60" : "text-outline"}`}
                    >
                      {item.windDirection ?? ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative element */}
          <div className="mt-12 text-center pb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">info</span>
              Data updated 2 minutes ago
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
