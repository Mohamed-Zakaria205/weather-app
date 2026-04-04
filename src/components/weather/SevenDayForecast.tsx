import type { DailyForecastData } from "../../types/weather";
import { ArrowRight } from "lucide-react";

interface SevenDayForecastProps {
  data: DailyForecastData[];
  onViewDetails?: () => void;
}

export function SevenDayForecast({ data, onViewDetails }: SevenDayForecastProps) {
  return (
    <div className="glass p-6 rounded-xl h-full flex flex-col gap-6">
      <h3 className="text-xl font-bold font-heading flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">calendar_month</span>
        7-Day Forecast
      </h3>
      <div className="flex flex-col divide-y divide-white/10">
        {data.map((day, index) => (
          <div
            key={index}
            className="py-4 flex items-center justify-between first:pt-0 last:pb-0"
          >
            <span className="w-12 font-bold text-on-surface-variant">{day.day}</span>
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined ${day.iconColor || 'text-primary'}`}
                style={{
                  fontVariationSettings: day.filled
                    ? "'FILL' 1"
                    : "'FILL' 0"
                }}
              >
                {day.icon}
              </span>
              <span className="text-sm font-medium text-on-surface-variant w-24">
                {day.condition}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold">{day.high}°</span>
              <span className="text-on-surface-variant opacity-60">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onViewDetails}
        className="w-full mt-auto bg-primary text-white py-4 rounded-full font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        View More Details
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
