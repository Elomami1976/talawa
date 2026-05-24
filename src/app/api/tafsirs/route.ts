import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(ip, { windowMs: 60_000, maxRequests: 60 });
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const ayahIdParam = searchParams.get("ayahId");
  const surahIdParam = searchParams.get("surahId");
  const language = searchParams.get("language") || "en";
  const source = searchParams.get("source");

  try {
    const where: Record<string, unknown> = { language };
    if (source) where.source = source;

    if (ayahIdParam) {
      const ayahId = parseInt(ayahIdParam);
      if (isNaN(ayahId)) {
        return NextResponse.json({ error: "Invalid ayahId" }, { status: 400 });
      }
      where.ayahId = ayahId;
    } else if (surahIdParam) {
      const surahId = parseInt(surahIdParam);
      if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        return NextResponse.json({ error: "Invalid surahId" }, { status: 400 });
      }
      where.ayah = { surahId };
    } else {
      return NextResponse.json({ error: "Provide ayahId or surahId" }, { status: 400 });
    }

    const tafsirs = await prisma.tafsir.findMany({
      where,
      orderBy: { ayahId: "asc" },
      select: {
        id: true,
        ayahId: true,
        language: true,
        source: true,
        text: true,
      },
    });
    return NextResponse.json(
      { data: tafsirs },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
