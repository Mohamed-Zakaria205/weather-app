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
