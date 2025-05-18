// components/CitiesTable.tsx

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import InfiniteScroll from "react-infinite-scroll-component";

interface City {
  name: string;
  country: string;
  timezone: string;
  weather?: {
    high: number;
    low: number;
  };
}

function dedupeCities(cities: City[]) {
  const seen = new Set();
  return cities.filter(city => {
    const key = `${city.name}|${city.country}|${city.timezone}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Sorting
  const [sortColumn, setSortColumn] = useState<"name" | "country" | "timezone" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtering
  const [countryFilter, setCountryFilter] = useState("");
  const [timezoneFilter, setTimezoneFilter] = useState("");
  const dedupedCities = dedupeCities(cities);

  const fetchCities = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/cities?start=${pageNum * 100}&rows=100`
      );
      if (response.data && response.data.records) {
        const cleanedCities = response.data.records
          .map((rec: any) => rec.fields)
          .filter((fields: any) => fields?.name && fields?.cou_name_en && fields?.timezone)
          .map((fields: any) => ({
            name: fields.name,
            country: fields.cou_name_en,
            timezone: fields.timezone,
          }));

        const citiesWithWeather = await Promise.all(
          cleanedCities.map(async (city: City) => {
            try {
              const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
              const weatherRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                  city.name
                )}&units=metric&appid=${apiKey}`
              );
              const weatherData = weatherRes.data;
              return {
                ...city,
                weather: {
                  high: weatherData.main.temp_max,
                  low: weatherData.main.temp_min,
                },
              };
            } catch {
              return city;
            }
          })
        );

        setCities((prev) => [...prev, ...citiesWithWeather]);
        setHasMore(cleanedCities.length === 100);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCities(nextPage);
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valid = /^[a-zA-Z\s-]*$/.test(value);
    if (!valid && value !== "") {
      setErrorMessage("Please enter valid letters only.");
    } else {
      setErrorMessage("");
    }
    setSearchTerm(value);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (cityName: string) => {
    setSearchTerm(cityName);
    setSuggestions([]);
  };

  const handleSort = (column: "name" | "country" | "timezone") => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getSortedCities = (citiesToSort: City[]) => {
    if (!sortColumn) return citiesToSort;
    return [...citiesToSort].sort((a, b) => {
      const valA = a[sortColumn].toLowerCase();
      const valB = b[sortColumn].toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const uniqueCountries = [...new Set(cities.map((city) => city.country))].sort();
  const uniqueTimezones = [...new Set(cities.map((city) => city.timezone))].sort();

  const filteredCities = cities
    .filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      city.weather &&
      typeof city.weather.high === "number" &&
      typeof city.weather.low === "number"
    )
    .filter((city) => (countryFilter ? city.country === countryFilter : true))
    .filter((city) => (timezoneFilter ? city.timezone === timezoneFilter : true));

  const sortedFilteredCities = getSortedCities(filteredCities);

 return (
  <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent tracking-tight mb-2 sm:mb-0 flex items-center gap-2">
        <span role="img" aria-label="globe">🌎</span>
        Explore Cities
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search for a city"
          className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-gray-800/80 transition w-full sm:w-64"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {errorMessage && (
          <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
    </div>

    {suggestions.length > 0 && (
      <ul className="border rounded bg-white shadow-md max-h-40 overflow-y-auto mb-4">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition"
            onClick={() => handleSuggestionClick(suggestion.name)}
          >
            {suggestion.name}, {suggestion.country}
          </li>
        ))}
      </ul>
    )}

    <div className="flex flex-wrap gap-4 mb-6">
      <select
        value={countryFilter}
        onChange={(e) => setCountryFilter(e.target.value)}
        className="p-2 border border-blue-200 rounded-lg bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option value="">Filter by Country</option>
        {uniqueCountries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <select
        value={timezoneFilter}
        onChange={(e) => setTimezoneFilter(e.target.value)}
        className="p-2 border border-blue-200 rounded-lg bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option value="">Filter by Timezone</option>
        {uniqueTimezones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
    </div>

    <hr className="mb-6 border-blue-100 dark:border-gray-700" />

    {loading && cities.length === 0 ? (
      <p className="text-center text-blue-500">Loading...</p>
    ) : (
      <div className="overflow-x-auto">
        <InfiniteScroll
          dataLength={cities.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className="text-center py-2 text-blue-400">Loading more cities...</h4>}
          endMessage={<p className="text-center py-2 text-gray-400">No more cities.</p>}
        >
          <table className="min-w-full table-auto text-sm sm:text-base rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white">
                <th
                  className="px-4 py-2 text-left cursor-pointer font-semibold"
                  onClick={() => handleSort("name")}
                >
                  City Name {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer font-semibold"
                  onClick={() => handleSort("country")}
                >
                  Country {sortColumn === "country" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer font-semibold"
                  onClick={() => handleSort("timezone")}
                >
                  Timezone {sortColumn === "timezone" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-2 text-left font-semibold">High (°C)</th>
                <th className="px-4 py-2 text-left font-semibold">Low (°C)</th>
              </tr>
            </thead>
            <tbody>
              {dedupeCities(sortedFilteredCities).length > 0 ? (
                dedupeCities(sortedFilteredCities).map((city, index) => (
                  <tr
                    key={`${city.name}-${index}`}
                    className={`${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
                        : "bg-white dark:bg-gray-900"
                    } hover:bg-blue-100 dark:hover:bg-blue-950 transition`}
                  >
                    <td className="px-4 py-2">
                      <a
                        href={`/weather/${encodeURIComponent(city.name)}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {city.name}
                      </a>
                    </td>
                    <td className="px-4 py-2">{city.country}</td>
                    <td className="px-4 py-2">{city.timezone}</td>
                    <td className="px-4 py-2">
                      {city.weather?.high !== undefined ? (
                        <span className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 text-white text-xs font-bold shadow">
                          {city.weather.high}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {city.weather?.low !== undefined ? (
                        <span className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-blue-400 to-green-300 text-white text-xs font-bold shadow">
                          {city.weather.low}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-2">
                    No cities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    )}
  </div>
);
   
};

export default CitiesTable;
