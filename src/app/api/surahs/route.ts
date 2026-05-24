import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(ip, { windowMs: 60_000, maxRequests: 60 });
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

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
      },
    });
    return NextResponse.json({ data: surahs }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
