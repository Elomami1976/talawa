import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiOk,
  apiError,
  preflight,
  enforceRateLimit,
  CACHE_NONE,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

// Total ayahs in the Quran
const TOTAL_AYAHS = 6236;

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language");
  const translator = searchParams.get("translator");

  try {
    const targetId = Math.floor(Math.random() * TOTAL_AYAHS) + 1;
    const ayah = await prisma.ayah.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        ayahKey: true,
        ayahNumber: true,
        surahId: true,
        juz: true,
        page: true,
        textAr: true,
        textSimple: true,
        surah: {
          select: { nameAr: true, nameEn: true, nameTrans: true },
        },
        ...(language && {
          translations: {
            where: translator ? { language, translator } : { language },
            take: 1,
            select: { language: true, translator: true, text: true },
          },
        }),
      },
    });

    if (!ayah) return apiError("Random ayah not found", 500);
    return apiOk(ayah, { cache: CACHE_NONE });
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
