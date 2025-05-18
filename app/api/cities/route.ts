// app/api/cities/route.ts

export async function GET() {
  try {
    const res = await fetch(
      'https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=100&sort=name'
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch data from source API' }), {
        status: res.status,
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    // console.error("API fetch error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
