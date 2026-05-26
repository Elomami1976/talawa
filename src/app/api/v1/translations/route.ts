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
  const translator = searchParams.get("translator");
  const list = searchParams.get("list") === "true";

  try {
    // ?list=true returns distinct (language, translator) pairs
    if (list) {
      const rows = await prisma.translation.groupBy({
        by: ["language", "translator"],
        _count: { _all: true },
        orderBy: [{ language: "asc" }, { translator: "asc" }],
      });
      return apiOk(
        rows.map((r) => ({
          language: r.language,
          translator: r.translator,
          ayahCount: r._count._all,
        })),
        { cache: CACHE_STATIC, meta: { count: rows.length } }
      );
    }

    const where: Record<string, unknown> = {};
    if (language) where.language = language;
    if (translator) where.translator = translator;

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
        "Provide ?surahId, ?ayahId, or ?list=true to list available translations.",
        400
      );
    }

    const translations = await prisma.translation.findMany({
      where,
      orderBy: { ayahId: "asc" },
      select: {
        ayahId: true,
        language: true,
        translator: true,
        text: true,
      },
    });

    return apiOk(translations, {
      cache: CACHE_STATIC,
      meta: { count: translations.length },
    });
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
