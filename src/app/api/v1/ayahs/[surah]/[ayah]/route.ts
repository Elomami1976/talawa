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
  { params }: { params: Promise<{ surah: string; ayah: string }> }
) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const { surah, ayah } = await params;
  const surahId = parseInt(surah, 10);
  const ayahNumber = parseInt(ayah, 10);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return apiError("Invalid surah id (1-114).", 400);
  }
  if (isNaN(ayahNumber) || ayahNumber < 1) {
    return apiError("Invalid ayah number.", 400);
  }

  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language");
  const translator = searchParams.get("translator");
  const includeTafsir = searchParams.get("tafsir") === "true";

  try {
    const result = await prisma.ayah.findUnique({
      where: { ayahKey: `${surahId}:${ayahNumber}` },
      select: {
        id: true,
        ayahKey: true,
        ayahNumber: true,
        surahId: true,
        juz: true,
        hizb: true,
        page: true,
        textAr: true,
        textSimple: true,
        sajda: true,
        surah: {
          select: {
            nameAr: true,
            nameEn: true,
            nameTrans: true,
            englishTranslation: true,
            revelationType: true,
          },
        },
        ...(language && {
          translations: {
            where: translator ? { language, translator } : { language },
            select: { language: true, translator: true, text: true },
          },
        }),
        ...(includeTafsir && {
          tafsirs: {
            select: { language: true, source: true, text: true },
          },
        }),
      },
    });

    if (!result) return apiError("Ayah not found", 404);
    return apiOk(result, { cache: CACHE_STATIC });
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
