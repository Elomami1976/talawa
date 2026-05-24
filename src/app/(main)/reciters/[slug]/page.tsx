import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { RECITER_PROFILES, getReciterBySlug } from "@/lib/reciters-data";
import { buildCanonicalUrl, generateBreadcrumbJsonLd } from "@/lib/seo";

/**
 * Fully static reciter profile pages. No API calls.
 * Generates a page per slug at build time.
 */

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return RECITER_PROFILES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const reciter = getReciterBySlug(slug);
  if (!reciter) {
    return { title: "Reciter not found" };
  }

  const title = `${reciter.nameEn} (${reciter.nameAr}) — Quran Reciter Biography`;
  const description = `${reciter.taglineEn} ${reciter.bornEn}. Read the biography of ${reciter.nameEn} in English and Arabic.`;
  const url = buildCanonicalUrl(`/reciters/${reciter.slug}`);

  return {
    title,
    description,
    keywords: [
      reciter.nameEn,
      reciter.nameAr,
      "Quran reciter",
      "Holy Quran",
      "Islamic recitation",
      reciter.countryEn,
      "Murattal",
      "Tilawah",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      locale: "en_US",
      alternateLocale: ["ar_SA"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function jsonLd(reciter: ReturnType<typeof getReciterBySlug>) {
  if (!reciter) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: reciter.nameEn,
    alternateName: reciter.nameAr,
    nationality: reciter.countryEn,
    jobTitle: "Quran Reciter",
    description: reciter.taglineEn,
    url: buildCanonicalUrl(`/reciters/${reciter.slug}`),
  };
}

export default async function ReciterPage({ params }: Params) {
  const { slug } = await params;
  const reciter = getReciterBySlug(slug);
  if (!reciter) notFound();

  const ld = jsonLd(reciter);
  const breadcrumbLd = generateBreadcrumbJsonLd([
    { name: "Home", url: buildCanonicalUrl("/") },
    { name: "Reciters", url: buildCanonicalUrl("/reciters") },
    { name: reciter.nameEn, url: buildCanonicalUrl(`/reciters/${reciter.slug}`) },
  ]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      {ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <Link
          href="/reciters"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← All reciters
        </Link>
        <Link
          href="/quran"
          className="text-sm text-primary hover:underline"
        >
          Listen to the Quran →
        </Link>
      </div>

      {/* Two columns: English (left, LTR) | Arabic (right, RTL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* English column — left */}
        <article
          dir="ltr"
          lang="en"
          className="order-2 md:order-1 rounded-2xl border bg-card p-6 md:p-8 shadow-sm"
        >
          <header className="mb-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Quran Reciter
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
              {reciter.nameEn}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {reciter.bornEn} · {reciter.countryEn} · {reciter.styleEn}
            </p>
          </header>

          <p className="text-base md:text-lg leading-relaxed text-foreground/90 mb-5 font-medium">
            {reciter.taglineEn}
          </p>

          <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
            {reciter.bioEn.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>

        {/* Arabic column — right */}
        <article
          dir="rtl"
          lang="ar"
          className="order-1 md:order-2 rounded-2xl border bg-card p-6 md:p-8 shadow-sm font-arabic-ui"
        >
          <header className="mb-6">
            <p className="text-xs tracking-widest text-muted-foreground mb-2">
              قارئ القرآن الكريم
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
              {reciter.nameAr}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {reciter.bornAr} · {reciter.countryAr} · {reciter.styleAr}
            </p>
          </header>

          <p className="text-base md:text-lg leading-loose text-foreground/90 mb-5 font-medium">
            {reciter.taglineAr}
          </p>

          <div className="space-y-4 text-[16px] leading-loose text-foreground/85">
            {reciter.bioAr.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
