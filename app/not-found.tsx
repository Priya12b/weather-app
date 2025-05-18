import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="mb-6">The city you searched for doesn’t exist or weather data couldn’t be loaded.
Sorry, we couldn’t find weather data for this city.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        ← Back to Cities
      </Link>
    </div>
  );
}