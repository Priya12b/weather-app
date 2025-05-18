// app/page.tsx
"use client";

import CitiesTable from "../components/CitiesTable";
import History from "@/components/ViewHistory";
import Favorites from "@/components/ViewFavourites";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-500">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Image
          src="/next.svg"
          alt="Weather App Logo"
          width={80}
          height={80}
          className="mb-4 drop-shadow-xl"
        />
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow">
          Weather Explorer
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 max-w-xl mb-6">
          Instantly check the weather for any city. Save your favorites, view your history, and explore the world’s weather with a click.
        </p>
        <Link href="/my-location">
          <button className="mt-2 px-7 py-2 rounded-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition">
            Show My Location Weather
          </button>
        </Link>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-16">
        {/* Cities Table */}
        <div className="md:col-span-2 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-6 flex flex-col border border-blue-100 dark:border-indigo-900">
          <CitiesTable />
        </div>
        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-blue-900">
            <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <span>⭐</span> Favorites
            </h2>
            <Favorites />
          </div>
          <div className="bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 dark:from-blue-900 dark:via-pink-900 dark:to-purple-900 rounded-2xl shadow-xl p-6 border border-pink-100 dark:border-pink-900">
            <h2 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <span>🕑</span> Viewed
            </h2>
            <History />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 flex flex-col items-center gap-2 bg-transparent mt-8">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Weather Explorer &mdash; Powered by Next.js
        </span>
      </footer>
    </div>
  );
}