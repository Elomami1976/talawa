import { NextRequest, NextResponse } from "next/server";
import { fetchPrayerTimes, fetchPrayerTimesByCity } from "@/lib/prayer-times";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(ip, { windowMs: 60_000, maxRequests: 30 });
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const city = searchParams.get("city");
  const country = searchParams.get("country");
  const date = searchParams.get("date") || new Date().toLocaleDateString("en-CA");
  const method = parseInt(searchParams.get("method") || "2");

  try {
    let data;
    if (lat && lng) {
      data = await fetchPrayerTimes(parseFloat(lat), parseFloat(lng), date, method);
    } else if (city && country) {
      data = await fetchPrayerTimesByCity(city, country, date, method);
    } else {
      return NextResponse.json(
        { error: "Provide lat/lng or city/country" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 502 });
  }
}
