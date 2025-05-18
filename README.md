<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->


# Weather Forecast Web Application

A responsive weather forecast app built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🌍 Browse cities with infinite scroll, search, filter, and sort
- 🌦️ View current weather and 5-day forecast for any city
- 📍 See weather for your current location (geolocation)
- ⭐ Save favorite locations and view history
- 🌗 Toggle between light and dark mode
- 🌡️ Switch between Celsius and Fahrenheit
- 🗺️ See city location on a map

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` (or create `.env.local`)
   - Add your OpenWeatherMap API key:
     ```
     NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
     ```

4. **Run the development server:**
   ```
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app is ready to deploy on [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
3. Click **New Project** and import your repo.
4. Set the environment variable `NEXT_PUBLIC_OPENWEATHER_API_KEY` in Vercel dashboard.
5. Click **Deploy**.

## License

MIT