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

  try {
    const surahs = await prisma.surah.findMany({
      orderBy: { id: "asc" },
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
    return apiOk(surahs, {
      cache: CACHE_STATIC,
      meta: { count: surahs.length },
    });
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
