import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surahId: string }> }
) {
  const ip = getClientIp(request);
  const { success } = rateLimit(ip, { windowMs: 60_000, maxRequests: 60 });
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { surahId } = await params;
  const surahIdNum = parseInt(surahId);
  if (isNaN(surahIdNum) || surahIdNum < 1 || surahIdNum > 114) {
    return NextResponse.json({ error: "Invalid surah ID" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") || "en";
  const translator = searchParams.get("translator") || "en.sahih";
  const includeTafsir = searchParams.get("tafsir") === "true";

  try {
    const ayahs = await prisma.ayah.findMany({
      where: { surahId: surahIdNum },
      orderBy: { ayahNumber: "asc" },
      include: {
        translations: {
          where: { language, translator },
          take: 1,
        },
        ...(includeTafsir && {
          tafsirs: {
            where: { language: "en" },
            take: 1,
          },
        }),
      },
    });

    return NextResponse.json({ data: ayahs }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
