import { apiOk, CACHE_STATIC } from "@/lib/api-response";

export const dynamic = "force-static";

export async function GET() {
  return apiOk(
    {
      name: "Telawa Public API",
      version: "1.0.0",
      description:
        "Free, open Quran API — Quran text, translations, tafsir, audio recitations, duas, prayer times, and qibla. No API key required.",
      documentation: "/developers",
      license: "Open data — attribution appreciated.",
      rateLimit: "100 requests/minute per IP",
      endpoints: {
        meta: "/api/v1",
        surahs: "/api/v1/surahs",
        surah: "/api/v1/surahs/{id}",
        ayah: "/api/v1/ayahs/{surah}/{ayah}",
        randomAyah: "/api/v1/ayahs/random",
        translations: "/api/v1/translations?surahId={id}",
        tafsirs: "/api/v1/tafsirs?surahId={id}",
        reciters: "/api/v1/reciters",
        duas: "/api/v1/duas",
        duaCategory: "/api/v1/duas/{id}",
        qibla: "/api/v1/qibla?lat={lat}&lng={lng}",
        search: "/api/v1/search?q={query}",
      },
      contact: "https://telawa.org/contact",
    },
    { cache: CACHE_STATIC }
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
