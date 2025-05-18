//components/ViewFavourites.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Favorite Locations</h2>
      {favorites.length > 0 ? (
      <ul>
        {favorites.map((city, index) => (
          <li key={index} className="mb-1">
              <Link
                href={`/weather/${encodeURIComponent(city)}`}
                className="text-blue-500 hover:underline"
              >
                {city}
              </Link>
            </li>
        ))}
      </ul>) : (
      <p className="text-gray-500">No favorite locations saved yet.</p>
    )}
  </div>
  );
};

export default Favorites;