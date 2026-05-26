import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiOk,
  apiError,
  preflight,
  enforceRateLimit,
  CACHE_STATIC,
} from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const surahIdParam = searchParams.get("surahId");
  const ayahIdParam = searchParams.get("ayahId");
  const language = searchParams.get("language");
  const source = searchParams.get("source");
  const list = searchParams.get("list") === "true";

  try {
    if (list) {
      const rows = await prisma.tafsir.groupBy({
        by: ["language", "source"],
        _count: { _all: true },
        orderBy: [{ language: "asc" }, { source: "asc" }],
      });
      return apiOk(
        rows.map((r) => ({
          language: r.language,
          source: r.source,
          ayahCount: r._count._all,
        })),
        { cache: CACHE_STATIC, meta: { count: rows.length } }
      );
    }

    const where: Record<string, unknown> = {};
    if (language) where.language = language;
    if (source) where.source = source;

    if (ayahIdParam) {
      const ayahId = parseInt(ayahIdParam, 10);
      if (isNaN(ayahId)) return apiError("Invalid ayahId", 400);
      where.ayahId = ayahId;
    } else if (surahIdParam) {
      const surahId = parseInt(surahIdParam, 10);
      if (isNaN(surahId) || surahId < 1 || surahId > 114)
        return apiError("Invalid surahId", 400);
      where.ayah = { surahId };
    } else {
      return apiError(
        "Provide ?surahId, ?ayahId, or ?list=true to list available tafsirs.",
        400
      );
    }

    const tafsirs = await prisma.tafsir.findMany({
      where,
      orderBy: { ayahId: "asc" },
      select: { ayahId: true, language: true, source: true, text: true },
    });

    return apiOk(tafsirs, {
      cache: CACHE_STATIC,
      meta: { count: tafsirs.length },
    });
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
