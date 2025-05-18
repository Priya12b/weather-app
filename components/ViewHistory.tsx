"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const History: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory") || "[]");
    setHistory(storedHistory);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Viewed Locations</h2>
      {history.length > 0 ? (
      <ul>
          {history.map((city, index) => (
            <li key={index} className="mb-1">
              <Link
                href={`/weather/${encodeURIComponent(city)}`}
                className="text-blue-500 hover:underline"
              >
                {city}
              </Link>
            </li>
          ))}
        </ul>
    ) : (
      <p className="text-gray-500">No locations viewed yet.</p>
    )}
  </div>
  );
};

export default History;