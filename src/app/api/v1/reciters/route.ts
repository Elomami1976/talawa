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
    const reciters = await prisma.reciter.findMany({
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      select: {
        id: true,
        identifier: true,
        name: true,
        style: true,
        language: true,
        audioBaseUrl: true,
        format: true,
        isDefault: true,
      },
    });
    return apiOk(reciters, {
      cache: CACHE_STATIC,
      meta: { count: reciters.length },
    });
  } catch {
    return apiError("Internal server error", 500);
  }
}

export const OPTIONS = preflight;
