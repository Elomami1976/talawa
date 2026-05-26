import { NextRequest } from "next/server";
import { getDuaCategoryById } from "@/lib/duas-data";
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
  const catId = parseInt(id, 10);
  if (isNaN(catId)) return apiError("Invalid category id", 400);

  const category = getDuaCategoryById(catId);
  if (!category) return apiError("Category not found", 404);

  return apiOk(category, { cache: CACHE_STATIC });
}

export const OPTIONS = preflight;
