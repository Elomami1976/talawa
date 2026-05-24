import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(ip, { windowMs: 60_000, maxRequests: 30 });
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const language = searchParams.get("language") || "en";
  const translator = searchParams.get("translator") || "en.sahih";

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  const skip = (page - 1) * limit;

  // Normalize Arabic: strip diacritics + unify alef forms + ta marbouta
  const normalizeArabic = (s: string) =>
    s
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "") // diacritics + tatweel
      .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627") // آ أ إ ٱ → ا
      .replace(/\u0629/g, "\u0647") // ة → ه (optional, helps match)
      .replace(/\u0649/g, "\u064A"); // ى → ي

  const simpleQuery = normalizeArabic(query);

  try {
    // Strip-diacritics regex pattern for Postgres (matches Arabic harakat/tatweel)
    const diacriticsPattern = "[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]";
    const likeQuery = `%${simpleQuery}%`;

    // Full-text search on Arabic text + translations + surah names
    const [surahMatches, arabicResults, translationResults] = await Promise.all([
      prisma.$queryRaw<Array<{
        id: number;
        name_ar: string;
        name_en: string;
        name_trans: string;
        english_translation: string;
        ayah_count: number;
        revelation_type: string;
      }>>`
        SELECT id, name_ar, name_en, name_trans, english_translation, ayah_count, revelation_type
        FROM surahs
        WHERE translate(
                regexp_replace(name_ar, ${diacriticsPattern}, '', 'g'),
                'آأإٱةى',
                'ااااهي'
              ) ILIKE ${likeQuery}
           OR name_en ILIKE ${likeQuery}
           OR name_trans ILIKE ${likeQuery}
           OR english_translation ILIKE ${likeQuery}
        ORDER BY id ASC
        LIMIT 10
      `,
      prisma.ayah.findMany({
        where: {
          OR: [
            { textAr: { contains: query } },
            { textSimple: { contains: simpleQuery } },
          ],
        },
        take: limit,
        skip,
        include: {
          surah: { select: { nameEn: true, nameAr: true, nameTrans: true } },
          translations: {
            where: { language, translator },
            take: 1,
          },
        },
        orderBy: { id: "asc" },
      }),
      prisma.translation.findMany({
        where: {
          language,
          text: { contains: query, mode: "insensitive" },
        },
        take: limit,
        skip,
        include: {
          ayah: {
            include: {
              surah: { select: { nameEn: true, nameAr: true, nameTrans: true } },
            },
          },
        },
      }),
    ]);

    // Merge and deduplicate
    const seen = new Set<number>();
    const results: Array<{
      ayahId: number;
      ayahKey: string;
      surahId: number;
      ayahNumber: number;
      textAr: string;
      textSimple: string;
      surah: { nameEn: string; nameAr: string; nameTrans: string };
      translation?: string;
    }> = [];

    for (const ayah of arabicResults) {
      if (!seen.has(ayah.id)) {
        seen.add(ayah.id);
        results.push({
          ayahId: ayah.id,
          ayahKey: ayah.ayahKey,
          surahId: ayah.surahId,
          ayahNumber: ayah.ayahNumber,
          textAr: ayah.textAr,
          textSimple: ayah.textSimple,
          surah: ayah.surah,
          translation: ayah.translations[0]?.text,
        });
      }
    }

    for (const tr of translationResults) {
      if (!seen.has(tr.ayah.id)) {
        seen.add(tr.ayah.id);
        results.push({
          ayahId: tr.ayah.id,
          ayahKey: tr.ayah.ayahKey,
          surahId: tr.ayah.surahId,
          ayahNumber: tr.ayah.ayahNumber,
          textAr: tr.ayah.textAr,
          textSimple: tr.ayah.textSimple,
          surah: tr.ayah.surah,
          translation: tr.text,
        });
      }
    }

    return NextResponse.json(
      {
        data: results,
        surahs: surahMatches.map((s) => ({
          id: s.id,
          nameAr: s.name_ar,
          nameEn: s.name_en,
          nameTrans: s.name_trans,
          englishTranslation: s.english_translation,
          ayahCount: s.ayah_count,
          revelationType: s.revelation_type,
        })),
        pagination: {
          page,
          limit,
          total: results.length,
          hasMore: results.length === limit,
        },
        query,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
