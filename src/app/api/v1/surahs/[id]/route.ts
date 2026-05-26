import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiOk,
  apiError,
  preflight,
  enforceRateLimit,
  CACHE_STATIC,
} from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const { id } = await params;
  const surahId = parseInt(id, 10);
  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return apiError("Invalid surah id. Must be between 1 and 114.", 400);
  }

  const { searchParams } = new URL(request.url);
  const includeAyahs = searchParams.get("ayahs") !== "false"; // default true
  const language = searchParams.get("language");
  const translator = searchParams.get("translator");

  try {
    const surah = await prisma.surah.findUnique({
      where: { id: surahId },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        nameTrans: true,
        englishTranslation: true,
        revelationType: true,
        ayahCount: true,
        chronologicalOrder: true,
        rukuCount: true,
        sajdaCount: true,
      },
    });

    if (!surah) return apiError("Surah not found", 404);

    if (!includeAyahs) {
      return apiOk(surah, { cache: CACHE_STATIC });
    }

    const ayahs = await prisma.ayah.findMany({
      where: { surahId },
      orderBy: { ayahNumber: "asc" },
      select: {
        id: true,
        ayahNumber: true,
        ayahKey: true,
        juz: true,
        hizb: true,
        page: true,
        textAr: true,
        textSimple: true,
        sajda: true,
        ...(language && {
          translations: {
            where: translator
              ? { language, translator }
              : { language },
            select: {
              language: true,
              translator: true,
              text: true,
            },
          },
        }),
      },
    });

    return apiOk(
      { ...surah, ayahs },
      { cache: CACHE_STATIC, meta: { ayahCount: ayahs.length } }
    );
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
