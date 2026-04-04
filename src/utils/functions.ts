export type WeatherApiResponse = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };

  current: {
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_dir: string;
    humidity: number;
    feelslike_f: number;
    uv: number;
    dewpoint_f: number;
  };

  forecast: {
    forecastday: ForecastDay[];
  };
};

type ForecastDay = {
  date: string;

  day: {
    maxtemp_f: number;
    mintemp_f: number;
    avghumidity: number;
    maxwind_mph: number;
    uv: number;
    daily_chance_of_rain: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };

  hour: Hour[];
};
type Hour = {
  time: string;
  temp_f: number;
  is_day: number;

  condition: {
    text: string;
    icon: string;
    code: number;
  };

  dewpoint_f: number;
  wind_mph: number;
  wind_dir: string;
  chance_of_rain: number;
};

export type SearchResult = {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
};

export const mapIcon = (condition: string): string => {
  const c = condition.toLowerCase();

  if (c.includes("sunny") || c.includes("clear")) return "sunny";
  if (c.includes("cloud")) return "cloud";
  if (c.includes("rain")) return "rainy";

  return "partly_cloudy_day";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatHour = (date: string) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
  });
};

const getIconColor = (condition: string): string => {
  const c = condition.toLowerCase();

  if (c.includes("sunny") || c.includes("clear")) return "text-amber-500";
  if (c.includes("cloud")) return "text-blue-400";
  if (c.includes("rain")) return "text-blue-400";

  return "text-primary";
};

const generateDescription = (condition: string, high: number, humidity: number, wind: number): string => {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("shower"))
    return `Steady rain expected throughout the morning hours. Cooler breeze from the northwest.`;
  if (c.includes("overcast") || c.includes("mist") || c.includes("fog"))
    return `Cloudy start to the day with potential mist. Clearing by mid-afternoon.`;
  if (c.includes("cloud") || c.includes("partly"))
    return `Occasional showers in the afternoon. Breezy conditions expected near the coast with mild humidity.`;
  if (c.includes("clear") || c.includes("sunny"))
    return high > 80
      ? `Clear blue skies all day. Perfect conditions for outdoor activities. High UV index at midday.`
      : `Light clouds developing in the evening. Temperatures remain comfortable throughout the day.`;
  return `Mixed conditions expected. Wind speeds around ${wind} mph with ${humidity}% humidity.`;
};

const getUVLevel = (uv: number): string => {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  return "Very High";
};

export const transformWeatherData = (data: WeatherApiResponse) => {
  // 🟦 Current Weather
  const weatherData = {
    city: `${data.location.name}, ${data.location.region}`,
    temperature: Math.round(data.current.temp_f),
    high: Math.round(data.forecast.forecastday[0].day.maxtemp_f),
    low: Math.round(data.forecast.forecastday[0].day.mintemp_f),
    condition: data.current.condition.text,
    date: formatDate(data.location.localtime),
    time: formatTime(data.location.localtime),
  };

  // 🟨 Hourly (من الوقت الحالي - 9 hours for the main card)
  const nowHour = new Date(data.location.localtime).getHours();

  const mapHour = (hour: Hour, index: number, isFirst: boolean) => ({
    time: isFirst && index === 0 ? "Now" : formatHour(hour.time),
    temperature: Math.round(hour.temp_f),
    icon: mapIcon(hour.condition.text),
    filled: hour.is_day === 1,
    isDay: hour.is_day === 1,
    windSpeed: Math.round(hour.wind_mph),
    windDirection: hour.wind_dir,
    probOfPrecip: hour.chance_of_rain,
  });

  const hourlyData = data.forecast.forecastday[0].hour
    .slice(nowHour, nowHour + 9)
    .map((hour: Hour, index: number) => mapHour(hour, index, true));

  // 🟨 Full 24-hour data (spans today + tomorrow)
  const todayRemaining = data.forecast.forecastday[0].hour.slice(nowHour);
  const tomorrowHours = data.forecast.forecastday[1]?.hour ?? [];
  const full24Hours = [...todayRemaining, ...tomorrowHours].slice(0, 24);

  const hourly24Data = full24Hours.map((hour: Hour, index: number) =>
    mapHour(hour, index, true),
  );

  // 🟩 7 Days
  const sevenDayData = data.forecast.forecastday.map((day: ForecastDay) => ({
    day: new Date(day.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    high: Math.round(day.day.maxtemp_f),
    low: Math.round(day.day.mintemp_f),
    icon: mapIcon(day.day.condition.text),
    condition: day.day.condition.text,
    filled: true,
    iconColor: getIconColor(day.day.condition.text),
  }));

  // 🟧 Extended 7-Day data (richer cards for the Extended Forecast drawer)
  const extendedForecastData = data.forecast.forecastday.map(
    (day: ForecastDay) => {
      const high = Math.round(day.day.maxtemp_f);
      const low = Math.round(day.day.mintemp_f);
      const humidity = day.day.avghumidity;
      const wind = Math.round(day.day.maxwind_mph);
      const uv = day.day.uv;
      const condition = day.day.condition.text;
      return {
        fullDate: new Date(day.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        day: new Date(day.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        condition,
        description: generateDescription(condition, high, humidity, wind),
        icon: mapIcon(condition),
        high,
        low,
        humidity,
        windSpeed: wind,
        uv,
        iconColor: getIconColor(condition),
        filled: true,
      };
    },
  );

  // 🟣 Details
  const detailsData = {
    humidity: data.current.humidity,
    dewPoint: Math.round(data.current.dewpoint_f),
    windDirection: data.current.wind_dir,
    windSpeed: Math.round(data.current.wind_mph),
    uvIndex: getUVLevel(data.current.uv),
    realFeel: Math.round(data.current.feelslike_f),
  };

  return {
    weatherData,
    hourlyData,
    hourly24Data,
    sevenDayData,
    extendedForecastData,
    detailsData,
  };
};
