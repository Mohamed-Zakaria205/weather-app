export interface WeatherData {
  city: string;
  temperature: number;
  high: number;
  low: number;
  condition: string;
  date: string;
  time: string;
}

export interface HourlyForecastData {
  time: string;
  temperature: number;
  icon: string;
  filled?: boolean;
  probOfPrecip?: number;
  windSpeed?: number;
  windDirection?: string;
  isDay?: boolean;
}

export interface DailyForecastData {
  day: string;
  high: number;
  low: number;
  icon: string;
  condition: string;
  filled?: boolean;
  iconColor?: string;
}

export interface WeatherDetailsData {
  humidity: number;
  dewPoint: number;
  windDirection: string;
  windSpeed: number;
  uvIndex: string;
  realFeel: number;
}

export interface ExtendedDailyData {
  fullDate: string;
  day: string;
  condition: string;
  description: string;
  icon: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  uv: number;
  iconColor: string;
  filled: boolean;
}
