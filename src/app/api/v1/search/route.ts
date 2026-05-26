import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiOk,
  apiError,
  preflight,
  enforceRateLimit,
  CACHE_MEDIUM,
} from "@/lib/api-response";

// Lower rate limit for search since it's heavier
const SEARCH_LIMIT = { maxRequests: 30, windowMs: 60_000 };

function normalizeArabic(s: string): string {
  return s
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0629/g, "\u0647")
    .replace(/\u0649/g, "\u064A");
}

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, SEARCH_LIMIT);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const language = searchParams.get("language") || undefined;

  if (!query || query.length < 2) {
    return apiError("Query must be at least 2 characters (?q=...)", 400);
  }

  const simpleQuery = normalizeArabic(query);
  const skip = (page - 1) * limit;

  try {
    const [arabicResults, translationResults] = await Promise.all([
      prisma.ayah.findMany({
        where: {
          OR: [
            { textAr: { contains: query } },
            { textSimple: { contains: simpleQuery } },
          ],
        },
        take: limit,
        skip,
        select: {
          id: true,
          ayahKey: true,
          ayahNumber: true,
          surahId: true,
          textAr: true,
          surah: { select: { nameAr: true, nameEn: true, nameTrans: true } },
        },
        orderBy: { id: "asc" },
      }),
      language
        ? prisma.translation.findMany({
            where: {
              language,
              text: { contains: query, mode: "insensitive" },
            },
            take: limit,
            skip,
            select: {
              language: true,
              translator: true,
              text: true,
              ayah: {
                select: {
                  id: true,
                  ayahKey: true,
                  ayahNumber: true,
                  surahId: true,
                  textAr: true,
                  surah: { select: { nameAr: true, nameEn: true, nameTrans: true } },
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    return apiOk(
      {
        arabicMatches: arabicResults,
        translationMatches: translationResults,
      },
      {
        cache: CACHE_MEDIUM,
        meta: {
          query,
          page,
          limit,
          arabicCount: arabicResults.length,
          translationCount: translationResults.length,
        },
      }
    );
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
