/**
 * Telawa Public API v1 — response helpers.
 *
 * Free, open, no API key required. Protects the database via:
 *   1. Per-IP rate limit (in-memory; replace with Redis in prod cluster).
 *   2. Aggressive Cache-Control headers — most reads hit the CDN, never DB.
 *   3. Consistent JSON envelope for all responses.
 */
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

/** Long cache for static content (Quran text, surahs, duas) — 30 days. */
export const CACHE_STATIC =
  "public, max-age=3600, s-maxage=2592000, stale-while-revalidate=86400";

/** Medium cache for semi-dynamic content (search, reciters list) — 1 hour. */
export const CACHE_MEDIUM =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=3600";

/** Short cache for time-sensitive content (prayer times) — 5 min. */
export const CACHE_SHORT =
  "public, max-age=60, s-maxage=300, stale-while-revalidate=600";

/** No cache (random ayah). */
export const CACHE_NONE = "no-store";

const DEFAULT_LIMIT = { maxRequests: 100, windowMs: 60_000 };

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export function apiOk<T>(
  data: T,
  opts: { cache?: string; meta?: Record<string, unknown> } = {}
): NextResponse {
  const body: ApiEnvelope<T> = { success: true, data };
  if (opts.meta) body.meta = opts.meta;
  return NextResponse.json(body, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": opts.cache ?? CACHE_MEDIUM,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    {
      status,
      headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
    }
  );
}

export function preflight(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Enforces rate limiting; returns null when allowed, an error response when denied.
 */
export function enforceRateLimit(
  request: NextRequest,
  config = DEFAULT_LIMIT
): NextResponse | null {
  const ip = getClientIp(request);
  const result = rateLimit(`v1:${ip}`, config);
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded. Free tier allows 100 requests/minute.",
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          ...CORS_HEADERS,
          "Retry-After": String(result.retryAfter ?? 60),
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
        },
      }
    );
  }
  return null;
}
