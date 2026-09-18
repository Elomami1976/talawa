import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  generateMetaTags,
  generateSurahJsonLd,
  generateBreadcrumbJsonLd,
  buildCanonicalUrl,
} from "@/lib/seo";
import { plainArabicName } from "@/lib/utils";
import { SurahReader } from "@/components/quran/surah-reader";
import { Badge } from "@/components/ui/badge";
import type { AyahWithDetails } from "@/types";

// The root layout calls getLocale(), which opts the whole app into dynamic
// rendering; only force-static overrides it. Safe here: there is no locale
// switcher and no [locale] segment, so every request already renders in the
// default locale. Without this the page hits the DB on every request.
export const dynamic = "force-static";
export const revalidate = 86400;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const surahId = parseInt(id);
  if (isNaN(surahId) || surahId < 1 || surahId > 114) return {};

  let surah: {
    nameAr: string;
    nameEn: string;
    englishTranslation: string;
    ayahCount: number;
    revelationType: string;
  } | null = null;
  try {
    surah = await prisma.surah.findUnique({ where: { id: surahId } });
  } catch {
    surah = null;
  }
  if (!surah) return {};

  // Include the Arabic name: a large share of the queries reaching these pages
  // are Arabic or transliterated spellings ("sourat abasa", "سورة عبس"), and
  // matching the searcher's own script is what earns the click.
  return generateMetaTags({
    title: `Surah ${surah.nameEn} (${plainArabicName(surah.nameAr)}) - Read & Listen`,
    description: `Read Surah ${surah.nameEn}, "${surah.englishTranslation}", in Arabic with English translation and transliteration, and listen to audio recitation by leading reciters. ${surah.ayahCount} verses · ${surah.revelationType} · chapter ${surahId} of 114.`,
    canonical: buildCanonicalUrl(`/surah/${surahId}`),
  });
}

type SurahMeta = {
  id: number;
  nameAr: string;
  nameEn: string;
  nameTrans: string;
  englishTranslation: string;
  revelationType: string;
  ayahCount: number;
  chronologicalOrder: number;
  rukuCount: number;
  sajdaCount: number;
};

/**
 * Questions people actually type ("surah hashr in which para", "how many
 * verses in surah abasa", "is al-mulk meccan"). Every answer is derived from
 * the surah record, so nothing here is editorial guesswork.
 */
function faqJsonLd(surah: SurahMeta) {
  const qa: Array<[string, string]> = [
    [
      `How many verses are in Surah ${surah.nameEn}?`,
      `Surah ${surah.nameEn} (${plainArabicName(surah.nameAr)}) contains ${surah.ayahCount} verses (ayahs).`,
    ],
    [
      `Is Surah ${surah.nameEn} Meccan or Medinan?`,
      `Surah ${surah.nameEn} is a ${surah.revelationType} surah, revealed during the ${surah.revelationType} period. It was the ${ordinal(surah.chronologicalOrder)} surah revealed.`,
    ],
    [
      `What does Surah ${surah.nameEn} mean in English?`,
      `The name ${surah.nameEn} (${plainArabicName(surah.nameAr)}) means "${surah.englishTranslation}".`,
    ],
    [
      `Which chapter number is Surah ${surah.nameEn}?`,
      `Surah ${surah.nameEn} is chapter ${surah.id} of the 114 surahs of the Holy Quran.`,
    ],
  ];

  if (surah.sajdaCount > 0) {
    qa.push([
      `Is there a prostration (sajdah) in Surah ${surah.nameEn}?`,
      `Yes. Surah ${surah.nameEn} contains ${surah.sajdaCount} verse${surah.sajdaCount > 1 ? "s" : ""} of prostration (sajdat at-tilawah).`,
    ]);
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(surah as SurahMeta)),
        }}
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
          <p className="text-muted-foreground mb-3">
            {surah.englishTranslation}
          </p>
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

        {/* Reader (client) - translation + reciter live */}
        <SurahReader surahId={surah.id} ayahs={ayahs as unknown as AyahWithDetails[]} />

        {/* Server-rendered facts + FAQ. The reader above is a client component,
            so without this the crawlable body of the page is close to empty - which is why these pages sit around position 40-70. */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-bold mb-4">
            About Surah {surah.nameEn}
          </h2>
          <p className="text-[15px] leading-relaxed text-foreground/85 mb-6">
            Surah {surah.nameEn} ({plainArabicName(surah.nameAr)}), meaning
            &ldquo;{surah.englishTranslation}&rdquo;, is chapter {surah.id} of the 114 surahs of
            the Holy Quran. It contains {surah.ayahCount} verses and is a{" "}
            {surah.revelationType} surah, revealed{" "}
            {ordinal(surah.chronologicalOrder)} in the order of revelation
            {surah.rukuCount > 0
              ? `. It is divided into ${surah.rukuCount} ruku${surah.rukuCount > 1 ? "s" : ""}`
              : ""}
            {surah.sajdaCount > 0
              ? `, and contains ${surah.sajdaCount} verse${surah.sajdaCount > 1 ? "s" : ""} of prostration (sajdah)`
              : ""}
            . You can read it above in Arabic with transliteration and
            translation, and listen to the full recitation.
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              ["Chapter", `${surah.id} of 114`],
              ["Verses", String(surah.ayahCount)],
              ["Revelation", surah.revelationType],
              ["Revealed", `${ordinal(surah.chronologicalOrder)}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border p-3">
                <dt className="text-xs text-muted-foreground mb-1">{label}</dt>
                <dd className="text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="text-xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqJsonLd(surah as SurahMeta).mainEntity.map((q) => (
              <div key={q.name}>
                <h3 className="text-[15px] font-semibold mb-1">{q.name}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {q.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

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
              Next Surah
              <ArrowRight className="h-4 w-4 ms-1 inline" aria-hidden="true" />
            </a>
          )}
        </div>
      </main>
    </>
  );
}
