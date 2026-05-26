import { NextRequest } from "next/server";
import { duaCategories } from "@/lib/duas-data";
import {
  apiOk,
  preflight,
  enforceRateLimit,
  CACHE_STATIC,
} from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const summary = duaCategories.map((c) => ({
    id: c.id,
    title: c.title,
    audioUrl: c.audioUrl,
    duaCount: c.duas.length,
  }));

  return apiOk(summary, {
    cache: CACHE_STATIC,
    meta: { count: summary.length, source: "Hisn al-Muslim" },
  });
}

export const OPTIONS = preflight;
