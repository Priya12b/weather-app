//app/weather/[city]/page.tsx
import { notFound } from "next/navigation";
import WeatherCard from "@/components/WeatherCard";
import { getBackgroundClass } from "@/utils/weatherUtils";


interface Params {
  city: string;
}

export default async function CityWeatherPage(props: { params: Promise<Params> }) {
  const { city } = await props.params;
  const decodedCity = decodeURIComponent(city);
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("Missing OpenWeather API key");
    notFound();
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(decodedCity)}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(decodedCity)}&units=metric&appid=${apiKey}`
    );

    if (!weatherRes.ok || !forecastRes.ok) {
  // console.error("Failed to fetch data", weatherRes.status, forecastRes.status);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-red-500">City not found. Please try again.</p>
    </div>
  );
}

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    const hourlyData = Array.isArray(forecastData.list)
      ? forecastData.list.slice(0, 12)
      : [];
      

   return (
  <div className={getBackgroundClass(weatherData.weather[0].main)}>
    <WeatherCard
      city={decodedCity}
      data={weatherData}
      forecast={forecastData}
      hourly={hourlyData}
    />
  </div>
);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    notFound();
  }
}