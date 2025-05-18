//app/my-location/page.tsx

"use client";

import { useEffect, useState } from "react";
import WeatherCard from "@/components/WeatherCard";

export default function MyLocationWeather() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [hourly, setHourly] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError("Unable to retrieve your location.")
    );
  }, []);

  useEffect(() => {
    if (!coords) return;
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError("API key missing.");
      return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`)
      .then(res => res.json())
      .then(setWeather);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        setForecast(data);
        setHourly(Array.isArray(data.list) ? data.list.slice(0, 12) : []);
      });
  }, [coords]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!coords || !weather || !forecast) return <div>Detecting your location...</div>;

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <WeatherCard
        city={"Your Location"}
        data={weather}
        forecast={forecast}
        hourly={hourly}
      />
    </div>
  );
}