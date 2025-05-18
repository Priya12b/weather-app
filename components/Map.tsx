// components/Map.tsx
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  lat: number;
  lon: number;
}

const Map: React.FC<MapProps> = ({ lat, lon }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup("Weather Location");

    return () => {
      map.remove();
    };
  }, [lat, lon]);

  return <div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />;
};

export default Map;
