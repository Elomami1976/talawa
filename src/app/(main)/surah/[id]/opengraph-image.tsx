import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

/**
 * Per-surah dynamic OpenGraph card. Next.js compiles this to a PNG at build
 * time for every entry in `generateImageMetadata` and injects
 * <meta property="og:image"> automatically. No manual wiring needed.
 *
 * Used by Facebook, Twitter, WhatsApp, Telegram, Discord, LinkedIn previews.
 */

export const runtime = "nodejs";
export const alt = "Surah preview card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { id: string };
}

export default async function Image({ params }: Props) {
  const surahId = parseInt(params.id);

  let surah: {
    nameEn: string;
    nameAr: string;
    nameTrans: string;
    ayahCount: number;
    revelationType: string;
  } | null = null;

  try {
    surah = await prisma.surah.findUnique({
      where: { id: surahId },
      select: {
        nameEn: true,
        nameAr: true,
        nameTrans: true,
        ayahCount: true,
        revelationType: true,
      },
    });
  } catch {
    surah = null;
  }

  // Fallback card if DB lookup fails
  const display = surah ?? {
    nameEn: "The Holy Quran",
    nameAr: "القرآن الكريم",
    nameTrans: "Al-Quran",
    ayahCount: 0,
    revelationType: "",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Top brand strip */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            fontSize: 28,
            letterSpacing: 2,
            color: "#94a3b8",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          telawa
        </div>

        {/* Surah number badge */}
        {surah && (
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 60,
              padding: "10px 24px",
              borderRadius: 999,
              border: "2px solid #334155",
              fontSize: 24,
              color: "#cbd5e1",
              display: "flex",
            }}
          >
            Surah {surahId}
          </div>
        )}

        {/* Arabic name (RTL) */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#fbbf24",
            marginBottom: 16,
            display: "flex",
          }}
        >
          {display.nameAr}
        </div>

        {/* English name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "white",
            marginBottom: 8,
            display: "flex",
          }}
        >
          Surah {display.nameEn}
        </div>

        {/* Transliteration */}
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            marginBottom: 24,
            display: "flex",
          }}
        >
          {display.nameTrans}
        </div>

        {/* Meta row */}
        {surah && (
          <div
            style={{
              display: "flex",
              gap: 24,
              fontSize: 26,
              color: "#cbd5e1",
            }}
          >
            <span style={{ display: "flex" }}>
              {display.ayahCount} verses
            </span>
            <span style={{ display: "flex", color: "#475569" }}>•</span>
            <span style={{ display: "flex" }}>{display.revelationType}</span>
          </div>
        )}

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "#64748b",
            display: "flex",
          }}
        >
          Read, listen & reflect
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
