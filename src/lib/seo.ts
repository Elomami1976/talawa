/**
 * SEO utilities for generating structured data and metadata
 */

import type { Ayah, Surah } from "@/types";

/**
 * Single source of truth for the production origin. Always read from this
 * constant (never inline `process.env.NEXT_PUBLIC_*` elsewhere) so canonical
 * URLs, sitemap entries and OpenGraph all stay in sync.
 *
 * Falls back to `NEXT_PUBLIC_SITE_URL` for backwards compat with the older
 * env name that used to live in sitemap/robots.
 */
export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://telawa.app"
).replace(/\/$/, "");

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "telawa";

/**
 * Default OpenGraph / Twitter card image. Lives in /public so it is served
 * from the site root. Override per-page by passing `ogImage` to
 * generateMetaTags. Must be an ABSOLUTE URL for crawlers/social scrapers.
 */
export const DEFAULT_OG_IMAGE = `${APP_URL}/og-default.png`;

export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${APP_URL}${cleanPath}`;
}

export function generateSurahJsonLd(surah: Surah) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: `Surah ${surah.nameEn} - ${surah.nameTrans}`,
    inLanguage: ["ar", "en"],
    about: {
      "@type": "Thing",
      name: "Quran",
      description: "The Holy Quran",
    },
    author: {
      "@type": "Organization",
      name: "Islamic Text",
    },
    url: buildCanonicalUrl(`/surah/${surah.id}`),
    description: `Read Surah ${surah.nameEn} (${surah.nameAr}) - ${surah.englishTranslation}. ${surah.ayahCount} verses. ${surah.revelationType} revelation.`,
    numberOfPages: surah.ayahCount,
  };
}

export function generateAyahJsonLd(surah: Surah, ayah: Ayah, translationText?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: ayah.textSimple,
    inLanguage: "ar",
    isPartOf: {
      "@type": "Book",
      name: `Surah ${surah.nameEn}`,
      url: buildCanonicalUrl(`/surah/${surah.id}`),
    },
    url: buildCanonicalUrl(`/ayah/${surah.id}/${ayah.ayahNumber}`),
    description: translationText || `Ayah ${ayah.ayahNumber} of Surah ${surah.nameEn}`,
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: APP_URL,
    description:
      "Read, listen and learn the Holy Quran. Features translations, tafsir, audio recitations, prayer times and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${APP_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en", "ar"],
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      url: APP_URL,
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateMetaTags({
  title,
  description,
  canonical,
  ogImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}) {
  const image = ogImage || DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: APP_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "en_US",
      alternateLocale: ["ar_AR", "fr_FR", "tr_TR", "ur_PK", "de_DE", "ru_RU", "id_ID"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical,
    },
  };
}
