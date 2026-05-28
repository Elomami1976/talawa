import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;
export const maxDuration = 30;

interface ParsedHadith {
  text: string;
  rawi: string;
  mhd: string;
  book: string;
  numberOrPage: string;
  grade: string;
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function pickField(block: string, label: string): string {
  const re = new RegExp(
    `info-subtitle">\\s*${label}\\s*:?\\s*<\\/span>([\\s\\S]*?)(?=<span class="info-subtitle"|<\\/div>)`,
    "i"
  );
  const m = block.match(re);
  return m ? stripTags(m[1]) : "";
}

function parseDorarHtml(html: string): ParsedHadith[] {
  if (!html) return [];
  const items: ParsedHadith[] = [];
  const hadithRe =
    /<div class="hadith"[^>]*>([\s\S]*?)<\/div>\s*<div class="hadith-info">([\s\S]*?)<\/div>/g;
  let m: RegExpExecArray | null;
  while ((m = hadithRe.exec(html))) {
    const text = stripTags(m[1])
      .replace(/^\d+\s*[-–]\s*/, "")
      .replace(/\.\s*\.\s*\.\s*\.?$/, "")
      .trim();
    const info = m[2];
    items.push({
      text,
      rawi: pickField(info, "الراوي"),
      mhd: pickField(info, "المحدث"),
      book: pickField(info, "المصدر"),
      numberOrPage: pickField(info, "الصفحة أو الرقم"),
      grade: pickField(info, "خلاصة حكم المحدث"),
    });
  }
  return items;
}

/** Tries multiple public CORS proxies in sequence. Returns Dorar HTML or null. */
async function fetchDorarHtml(query: string): Promise<string | null> {
  const upstream = `https://dorar.net/dorar_api.json?skey=${encodeURIComponent(
    query
  )}`;
  const encoded = encodeURIComponent(upstream);

  const candidates: Array<{
    url: string;
    extract: (body: string) => string | null;
  }> = [
    {
      url: `https://api.allorigins.win/raw?url=${encoded}`,
      extract: (body) => {
        try {
          const data = JSON.parse(body);
          return typeof data?.ahadith?.result === "string"
            ? data.ahadith.result
            : null;
        } catch {
          return null;
        }
      },
    },
    {
      url: `https://api.allorigins.win/get?url=${encoded}`,
      extract: (body) => {
        try {
          const data = JSON.parse(body);
          const inner = data?.contents;
          if (typeof inner !== "string") return null;
          try {
            const json = JSON.parse(inner);
            return typeof json?.ahadith?.result === "string"
              ? json.ahadith.result
              : inner;
          } catch {
            return inner;
          }
        } catch {
          return null;
        }
      },
    },
  ];

  for (const c of candidates) {
    try {
      const res = await fetch(c.url, {
        signal: AbortSignal.timeout(12000),
        headers: {
          Accept: "application/json,*/*",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const body = await res.text();
      const html = c.extract(body);
      if (!html) continue;
      if (/Cloudflare|Attention Required|cf-error-details/i.test(html)) {
        continue;
      }
      if (html.includes("hadith") || html.includes("info-subtitle")) {
        return html;
      }
    } catch {
      /* try next proxy */
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json(
      { ok: false, error: "missing_query" },
      { status: 400 }
    );
  }
  if (q.length > 200) {
    return NextResponse.json(
      { ok: false, error: "query_too_long" },
      { status: 400 }
    );
  }

  const html = await fetchDorarHtml(q);
  if (html === null) {
    return NextResponse.json(
      { ok: false, error: "upstream_unavailable" },
      { status: 503 }
    );
  }

  const ahadith = parseDorarHtml(html);
  return NextResponse.json(
    { ok: true, query: q, count: ahadith.length, ahadith },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
