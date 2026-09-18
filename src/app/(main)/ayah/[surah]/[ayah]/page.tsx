import { prisma } from "@/lib/prisma";
import {
  generateMetaTags,
  buildCanonicalUrl,
  generateAyahJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import type { Surah, Ayah } from "@/types";

// Matches /surah/[id] and /quran: ayah content is effectively static.
// The root layout calls getLocale(), which opts the whole app into dynamic
// rendering; only force-static overrides it. Safe here: there is no locale
// switcher and no [locale] segment, so every request already renders in the
// default locale. Without this the page hits the DB on every request.
export const dynamic = "force-static";
export const revalidate = 86400;

interface Props {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surah, ayah } = await params;
  const surahId = parseInt(surah);
  const ayahNum = parseInt(ayah);

  let found: Awaited<
    ReturnType<
      typeof prisma.ayah.findFirst<{
        include: { surah: true; translations: { take: 1 } };
      }>
    >
  > = null;
  try {
    found = await prisma.ayah.findFirst({
      where: { surahId, ayahNumber: ayahNum },
      include: {
        surah: true,
        translations: { take: 1 },
      },
    });
  } catch {
    found = null;
  }

  if (!found) return { robots: { index: false, follow: false } };

  // Per-ayah pages duplicate content already on the parent surah page. We:
  //   1) noindex them so Google never crawls them as candidates, and
  //   2) point the canonical at the parent surah as a secondary signal.
  // They still work as deep-link landing pages for shared URLs.
  return {
    ...generateMetaTags({
      title: `${found.surah.nameEn} - Ayah ${ayahNum}`,
      description:
        found.translations[0]?.text?.slice(0, 160) ?? found.textAr.slice(0, 160),
      canonical: buildCanonicalUrl(`/surah/${surahId}`),
    }),
    robots: { index: false, follow: true },
  };
}

export async function generateStaticParams() {
  try {
    const surahs = await prisma.surah.findMany({ select: { id: true } });
    return surahs.map((s) => ({ surah: String(s.id), ayah: "1" }));
  } catch {
    return [];
  }
}

export default async function AyahPage({ params }: Props) {
  const { surah, ayah } = await params;
  const surahId = parseInt(surah);
  const ayahNum = parseInt(ayah);

  if (isNaN(surahId) || isNaN(ayahNum)) notFound();

  let found: Awaited<
    ReturnType<
      typeof prisma.ayah.findFirst<{
        include: {
          surah: true;
          translations: { where: { language: "en" }; take: 1 };
          tafsirs: { take: 1 };
        };
      }>
    >
  > = null;
  // Deliberately unguarded. This page is statically rendered, so turning a
  // transient DB failure into notFound() would bake a 404 into the cache; that
  // cost us 21 ayah pages in one build. Letting the error throw fails the
  // render instead, so the last good version keeps being served and ISR retries.
  found = await prisma.ayah.findFirst({
    where: { surahId, ayahNumber: ayahNum },
    include: {
      surah: true,
      translations: { where: { language: "en" }, take: 1 },
      tafsirs: { take: 1 },
    },
  });

  // A genuine miss: the query succeeded and there is no such ayah.
  if (!found) notFound();

  let prevAyah: { ayahNumber: number } | null = null;
  let nextAyah: { ayahNumber: number } | null = null;
  try {
    [prevAyah, nextAyah] = await Promise.all([
      prisma.ayah.findFirst({
        where: { surahId, ayahNumber: ayahNum - 1 },
        select: { ayahNumber: true },
      }),
      prisma.ayah.findFirst({
        where: { surahId, ayahNumber: ayahNum + 1 },
        select: { ayahNumber: true },
      }),
    ]);
  } catch {
    prevAyah = null;
    nextAyah = null;
  }

  const translationText = found.translations?.[0]?.text;
  const ayahJsonLd = generateAyahJsonLd(
    found.surah as unknown as Surah,
    found as unknown as Ayah,
    translationText,
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: buildCanonicalUrl("/") },
    { name: "Quran", url: buildCanonicalUrl("/quran") },
    { name: found.surah.nameEn, url: buildCanonicalUrl(`/surah/${surahId}`) },
    { name: `Ayah ${ayahNum}`, url: buildCanonicalUrl(`/ayah/${surahId}/${ayahNum}`) },
  ]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ayahJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/quran" className="hover:underline">
          Quran
        </Link>
        <span>/</span>
        <Link href={`/surah/${surahId}`} className="hover:underline">
          {found.surah.nameEn}
        </Link>
        <span>/</span>
        <span>Ayah {ayahNum}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {found.surah.nameEn}
          <span className="text-muted-foreground font-normal text-lg ml-2"> - Ayah {ayahNum}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {found.surah.revelationType === "Meccan" ? "Meccan" : "Medinan"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {found.surah.ayahCount} verses
          </span>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-6">
          <div className="text-right font-arabic text-3xl leading-loose text-foreground">
            {found.textAr}
          </div>

          <div className="flex justify-end">
            <Badge className="text-xs">
              {surahId}:{ayahNum}
            </Badge>
          </div>

          {found.translations[0] && (
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                Translation
              </p>
              <p className="text-base leading-relaxed">
                {found.translations[0].text}
              </p>
            </div>
          )}

          {found.tafsirs[0] && (
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                Tafsir
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {found.tafsirs[0].text}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          {prevAyah ? (
            <Button variant="outline" asChild>
              <Link href={`/ayah/${surahId}/${prevAyah.ayahNumber}`}>
                ← Ayah {prevAyah.ayahNumber}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href={`/surah/${surahId}`}>← Back to Surah</Link>
            </Button>
          )}
        </div>
        <Button variant="outline" asChild>
          <Link href={`/surah/${surahId}`}>View Full Surah</Link>
        </Button>
        <div>
          {nextAyah ? (
            <Button variant="outline" asChild>
              <Link href={`/ayah/${surahId}/${nextAyah.ayahNumber}`}>
                Ayah {nextAyah.ayahNumber}
                <ArrowRight className="h-4 w-4 ms-1" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
