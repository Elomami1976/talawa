import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  generateMetaTags,
  generateSurahJsonLd,
  generateBreadcrumbJsonLd,
  buildCanonicalUrl,
} from "@/lib/seo";
import { SurahReader } from "@/components/quran/surah-reader";
import { Badge } from "@/components/ui/badge";
import type { AyahWithDetails } from "@/types";

export const revalidate = 86400;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const surahId = parseInt(id);
  if (isNaN(surahId) || surahId < 1 || surahId > 114) return {};

  let surah: { nameEn: string; nameTrans: string; ayahCount: number; revelationType: string } | null = null;
  try {
    surah = await prisma.surah.findUnique({ where: { id: surahId } });
  } catch {
    surah = null;
  }
  if (!surah) return {};

  return generateMetaTags({
    title: `Surah ${surah.nameEn} (${surah.nameTrans}) — ${surah.ayahCount} Verses`,
    description: `Read Surah ${surah.nameEn} with Arabic text, transliteration, and translation. ${surah.ayahCount} ayahs revealed in ${surah.revelationType} period.`,
    canonical: buildCanonicalUrl(`/surah/${surahId}`),
  });
}

async function getSurahData(surahId: number) {
  try {
    const [surah, ayahs] = await Promise.all([
      prisma.surah.findUnique({ where: { id: surahId } }),
      prisma.ayah.findMany({
        where: { surahId },
        orderBy: { ayahNumber: "asc" },
        include: {
          surah: { select: { nameEn: true, nameAr: true, nameTrans: true } },
        },
      }),
    ]);
    return { surah, ayahs };
  } catch {
    return { surah: null, ayahs: [] as never[] };
  }
}

export default async function SurahPage({ params }: Params) {
  const { id } = await params;
  const surahId = parseInt(id);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) notFound();

  const { surah, ayahs } = await getSurahData(surahId);
  if (!surah) notFound();

  const jsonLd = generateSurahJsonLd(surah as unknown as import("@/types").Surah);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: buildCanonicalUrl("/") },
    { name: "Quran", url: buildCanonicalUrl("/quran") },
    { name: `Surah ${surah.nameEn}`, url: buildCanonicalUrl(`/surah/${surah.id}`) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="mx-auto max-w-3xl px-4 py-8 pb-32 md:pb-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <p
            className="text-4xl sm:text-5xl font-arabic text-primary mb-3 leading-loose"
            dir="rtl"
            lang="ar"
          >
            {surah.nameAr}
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Surah {surah.nameEn}
          </h1>
          <p className="text-muted-foreground mb-3">{surah.nameTrans}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="secondary">{surah.revelationType}</Badge>
            <Badge variant="outline">{surah.ayahCount} verses</Badge>
            {surah.chronologicalOrder && (
              <Badge variant="outline">
                Revealed #{surah.chronologicalOrder}
              </Badge>
            )}
          </div>
        </div>

        {/* Reader (client) — translation + reciter live */}
        <SurahReader surahId={surah.id} ayahs={ayahs as unknown as AyahWithDetails[]} />

        {/* Pagination navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t">
          {surah.id > 1 && (
            <a
              href={`/surah/${surah.id - 1}`}
              className="text-sm text-primary hover:underline"
            >
              ← Previous Surah
            </a>
          )}
          <div className="flex-1" />
          {surah.id < 114 && (
            <a
              href={`/surah/${surah.id + 1}`}
              className="text-sm text-primary hover:underline"
            >
              Next Surah →
            </a>
          )}
        </div>
      </main>
    </>
  );
}
