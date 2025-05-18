// components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-sm rounded"
      onClick={() => setDarkMode(!darkMode)}
    >
      Toggle {darkMode ? "Light" : "Dark"} Mode
    </button>
  );
}
