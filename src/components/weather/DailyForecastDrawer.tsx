import type { HourlyForecastData } from "../../types/weather";

interface DailyForecastDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: HourlyForecastData[];
}

export function DailyForecastDrawer({
  isOpen,
  onClose,
  data,
}: DailyForecastDrawerProps) {
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
            <span className="text-xs font-sans uppercase tracking-widest text-[#717786]">
              San Francisco, CA
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
                  High 84°{" "}
                  <span className="text-outline font-light">/ Low 62°</span>
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
                    id="chartGradient"
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
                <path
                  d="M 0 35 Q 10 32, 20 20 T 40 10 T 60 15 T 80 28 T 100 35 V 40 H 0 Z"
                  fill="url(#chartGradient)"
                ></path>
                <path
                  className="chart-spline transition-all duration-1000 ease-out"
                  d="M 0 35 Q 10 32, 20 20 T 40 10 T 60 15 T 80 28 T 100 35"
                  fill="none"
                  stroke="#005da7"
                  strokeWidth="0.8"
                  strokeDasharray="1000"
                  strokeDashoffset="0"
                ></path>
                <circle cx="0" cy="35" fill="#005da7" r="1"></circle>
                <circle cx="20" cy="20" fill="#005da7" r="1"></circle>
                <circle cx="40" cy="10" fill="#005da7" r="1.5"></circle>
                <circle cx="60" cy="15" fill="#005da7" r="1"></circle>
                <circle cx="80" cy="28" fill="#005da7" r="1"></circle>
                <circle cx="100" cy="35" fill="#005da7" r="1"></circle>
              </svg>
              <div className="flex justify-between mt-2 text-[10px] font-sans text-outline uppercase tracking-tighter">
                <span>2 PM</span>
                <span>8 PM</span>
                <span>2 AM</span>
                <span>8 AM</span>
                <span>2 PM</span>
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
              const prob = item.probOfPrecip || 0;
              const windSpeed = 10 + (index % 5);

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-white/80 border-[#c1c6d7]/5 shadow-sm hover:translate-x-1"
                      : "bg-[#f2f4f6]/40 border-transparent hover:bg-white/60"
                  }`}
                >
                  <div className="w-16">
                    <span
                      className={`text-sm ${isCurrent ? "font-semibold text-on-surface-variant" : "font-medium text-on-surface-variant"}`}
                    >
                      {item.time}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className="material-symbols-outlined text-primary text-2xl"
                      style={{
                        fontVariationSettings: item.filled
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div className="w-16 text-center">
                    <span
                      className={`text-xl font-heading ${isCurrent ? "font-extrabold text-primary" : "font-bold text-on-surface"}`}
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
                        style={{ width: `${prob}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[11px] font-medium text-outline">
                        {windSpeed} mph
                      </span>
                      <span
                        className={`material-symbols-outlined text-[14px] text-outline rotate-[${(index * 30) % 360}deg]`}
                      >
                        navigation
                      </span>
                    </div>
                    <span className="text-[9px] text-outline uppercase font-bold">
                      NNW
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Night cycle mocks */}
            {[
              { time: "8 PM", t: 68, w: 5 },
              { time: "9 PM", t: 66, w: 4 },
              { time: "10 PM", t: 64, w: 3 },
            ].map((night, i) => (
              <div
                key={`night-${i}`}
                className="flex items-center justify-between p-4 rounded-xl bg-[#f2f4f6]/20"
              >
                <div className="w-16">
                  <span className="text-sm font-medium text-on-surface-variant/60">
                    {night.time}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className="material-symbols-outlined text-primary/60 text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bedtime
                  </span>
                </div>
                <div className="w-16 text-center">
                  <span className="text-xl font-heading font-bold text-[#191c1e]/60">
                    {night.t}°
                  </span>
                </div>
                <div className="w-24">
                  <div className="h-1 w-full bg-[#eceef0]/40 rounded-full"></div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-[11px] text-outline/60">
                    {night.w} mph
                  </span>
                </div>
              </div>
            ))}
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
