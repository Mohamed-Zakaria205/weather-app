import type { WeatherData } from "../../types/weather";

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className="mt-8 flex items-center gap-6">
      <span className="text-8xl md:text-9xl font-extrabold font-heading text-primary tracking-tighter">
        {data.temperature}°
      </span>
      <div className="text-left">
        <p className="text-2xl font-bold text-foreground">{data.condition}</p>
        <p className="text-on-surface-variant">
          H: {data.high}° L: {data.low}°
        </p>
      </div>
    </div>
  );
}
