import type { Metadata } from "next";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { SurahCard } from "@/components/quran/surah-card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMetaTags, buildCanonicalUrl } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import type { Surah } from "@/types";

export const metadata: Metadata = generateMetaTags({
  title: "Quran Surahs \u2014 All 114 Chapters",
  description:
    "Browse all 114 chapters (surahs) of the Holy Quran. Read each surah with Arabic text, transliteration, and English translation.",
  canonical: buildCanonicalUrl("/quran"),
});

export const revalidate = 86400; // Revalidate once a day

async function getSurahs(): Promise<Surah[]> {
  try {
    return prisma.surah.findMany({
      orderBy: { id: "asc" },
    }) as Promise<Surah[]>;
  } catch {
    return [];
  }
}

function SurahListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="h-[68px] rounded-xl" />
      ))}
    </div>
  );
}

async function SurahList() {
  const surahs = await getSurahs();

  if (surahs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No surahs found</p>
        <p className="text-sm mt-1">Make sure the database is seeded.</p>
      </div>
    );
  }

  const meccan = surahs.filter((s) => s.revelationType === "Meccan");
  const medinan = surahs.filter((s) => s.revelationType === "Medinan");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Meccan Surahs ({meccan.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {meccan.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Medinan Surahs ({medinan.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {medinan.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuranPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          The Holy Quran
        </h1>
        <p className="text-muted-foreground">
          114 surahs, 6,236 ayahs — the complete revelation
        </p>
      </div>

      <Suspense fallback={<SurahListSkeleton />}>
        <SurahList />
      </Suspense>
    </main>
  );
}
