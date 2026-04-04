import type { WeatherDetailsData } from "../../types/weather";

interface WeatherDetailsProps {
  data: WeatherDetailsData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Humidity */}
      <div className="glass p-5 rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">humidity_percentage</span>
          <span className="text-xs font-bold tracking-wider uppercase">Humidity</span>
        </div>
        <span className="text-2xl font-bold font-heading">{data.humidity}%</span>
        <p className="text-[10px] text-on-surface-variant">Dew point is {data.dewPoint}°</p>
      </div>

      {/* Wind */}
      <div className="glass p-5 rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">air</span>
          <span className="text-xs font-bold tracking-wider uppercase">Wind</span>
        </div>
        <span className="text-2xl font-bold font-heading">{data.windSpeed} mph</span>
        <p className="text-[10px] text-on-surface-variant">Direction: {data.windDirection}</p>
      </div>

      {/* UV Index */}
      <div className="glass p-5 rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">wb_sunny</span>
          <span className="text-xs font-bold tracking-wider uppercase">UV Index</span>
        </div>
        <span className="text-2xl font-bold font-heading">{data.uvIndex}</span>
        <p className="text-[10px] text-on-surface-variant">Use sun protection</p>
      </div>

      {/* Real Feel */}
      <div className="glass p-5 rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">thermostat</span>
          <span className="text-xs font-bold tracking-wider uppercase">Real Feel</span>
        </div>
        <span className="text-2xl font-bold font-heading">{data.realFeel}°</span>
        <p className="text-[10px] text-on-surface-variant">Humidex: No impact</p>
      </div>
    </div>
  );
}
