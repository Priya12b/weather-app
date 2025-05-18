// components/WeatherCard.tsx

"use client";
import { getBackgroundClass } from "@/utils/weatherUtils";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the Map component to disable SSR
const Map = dynamic(() => import("./Map"), { ssr: false });

interface WeatherCardProps {
  city: string;
  data: any;
  forecast: any;
  hourly: any[];
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, data, forecast, hourly }) => {
  const [isCelsius, setIsCelsius] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const temperature = isCelsius
    ? `${Math.round(data.main.temp)}°C`
    : `${Math.round((data.main.temp * 9) / 5 + 32)}°F`;

  const toggleUnit = () => setIsCelsius(!isCelsius);

  const getDailyForecast = (forecastData: any) => {
    const daily = forecastData.list.filter((entry: any) =>
      entry.dt_txt.includes("12:00:00")
    );
    return daily.slice(0, 5);
  };

  const toggleFavorite = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (isFavorite) {
        favorites = favorites.filter((fav: string) => fav !== city);
        alert(`${city} removed from favorites.`);
      } else {
        favorites.push(city);
        alert(`${city} added to favorites!`);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } else {
      alert("Unable to save favorites. Local storage is not available.");
    }
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(city));

    const history = JSON.parse(localStorage.getItem("weatherHistory") || "[]");
    if (!history.includes(city)) {
      localStorage.setItem("weatherHistory", JSON.stringify([...history, city]));
    }
  }, [city]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${getBackgroundClass(
        data.weather[0].main
      )} transition-colors duration-500`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-blue-100 dark:border-blue-900"
      >
        {/* City & Weather Icon */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent mb-1 tracking-tight">
            {decodeURIComponent(city)}
          </h1>
          <Image
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
            width={100}
            height={100}
            className="mx-auto drop-shadow-lg"
          />
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-1 capitalize">
            {data.weather[0].main}
          </p>
        </div>

        {/* Temperature & Details */}
        <AnimatePresence mode="wait">
          <motion.p
            key={temperature}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2"
          >
            {temperature}
          </motion.p>
        </AnimatePresence>
        <div className="flex justify-center gap-4 mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold">
            Humidity: {data.main.humidity}%
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 text-xs font-semibold">
            Wind: {data.wind.speed} m/s
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <button
            onClick={toggleUnit}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white rounded-full font-semibold shadow hover:scale-105 transition text-sm"
          >
            Show in {isCelsius ? "Fahrenheit" : "Celsius"}
          </button>
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 ${
              isFavorite
                ? "bg-gradient-to-r from-red-500 to-pink-500"
                : "bg-gradient-to-r from-green-500 to-blue-400"
            } text-white rounded-full font-semibold shadow hover:scale-105 transition text-sm`}
          >
            {isFavorite ? "Remove from Favorites" : "Save to Favorites"}
          </button>
        </div>

        <Link
          href="/"
          className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white rounded-full font-semibold shadow hover:scale-105 transition"
        >
          ← Back to Cities
        </Link>

        {/* 5-Day Forecast */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-8">
          5 Day Forecast
        </h2>
        <div className="overflow-x-auto flex gap-4 py-2 scrollbar-thin scrollbar-thumb-blue-500">
          {getDailyForecast(forecast).map((day: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gradient-to-br from-blue-100 via-fuchsia-100 to-pink-100 dark:from-blue-900 dark:via-fuchsia-900 dark:to-pink-900 rounded-xl px-3 py-2 min-w-[75px] shadow"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(day.dt_txt).toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </p>
              <Image
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt="icon"
                width={40}
                height={40}
              />
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                {Math.round(day.main.temp)}°C
              </p>
            </div>
          ))}
        </div>

        {/* Hourly Forecast */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-6">
          Hourly Forecast
        </h2>
        <div className="overflow-x-auto flex gap-4 py-2 scrollbar-thin scrollbar-thumb-blue-500">
          {hourly.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gradient-to-br from-blue-50 via-fuchsia-50 to-pink-50 dark:from-blue-900 dark:via-fuchsia-900 dark:to-pink-900 rounded-xl px-3 py-2 min-w-[75px] shadow"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(hour.dt * 1000).getHours()}:00
              </p>
              <Image
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt={hour.weather[0].description}
                width={40}
                height={40}
              />
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                {Math.round(hour.main.temp)}°
              </p>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-2">
          Location on the Map
        </h2>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <Map lat={data.coord.lat} lon={data.coord.lon} />
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherCard;