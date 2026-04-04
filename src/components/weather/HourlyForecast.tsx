import type { HourlyForecastData } from "../../types/weather"

interface HourlyForecastProps {
  data: HourlyForecastData[];
  onOpen24h?: () => void;
}

export function HourlyForecast({ data, onOpen24h }: HourlyForecastProps) {
  return (
    <div className="glass p-6 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-heading flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">schedule</span>
          Hourly Forecast
        </h3>
        <button 
          onClick={onOpen24h}
          className="text-sm font-medium text-primary cursor-pointer hover:underline bg-transparent border-none p-0"
        >
          View 24h
        </button>
      </div>
      <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-3 min-w-[60px]">
            <span className="text-xs font-semibold text-on-surface-variant">
              {item.time}
            </span>
            <span
              className="material-symbols-outlined text-primary"
              style={{
                fontVariationSettings: item.filled
                  ? "'FILL' 1"
                  : "'FILL' 0"
              }}
            >
              {item.icon}
            </span>
            <span className="text-lg font-bold">{item.temperature}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
