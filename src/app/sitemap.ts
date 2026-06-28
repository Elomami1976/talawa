import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { RECITER_PROFILES } from "@/lib/reciters-data";
import { duaCategories } from "@/lib/duas-data";
import { APP_URL } from "@/lib/seo";

const BASE_URL = APP_URL;

// Use a stable monthly timestamp so the sitemap doesn't churn on every
// rebuild (which makes Search Console re-discover everything constantly and
// dilutes the signal). Content here is essentially static; bumping
// `LAST_MODIFIED` (or shipping a new build in a new month) is enough.
const LAST_MODIFIED = new Date(
  Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const surahs = await prisma.surah
    .findMany({
      select: { id: true },
      orderBy: { id: "asc" },
    })
    .catch(() => []);

  // Fallback: if the DB read fails (cold start / network blip) we still want
  // a complete sitemap with all 114 surahs so Google doesn't see entries
  // disappear and start dropping them from the index.
  const surahIds =
    surahs.length === 114
      ? surahs.map((s) => s.id)
      : Array.from({ length: 114 }, (_, i) => i + 1);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/quran`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/prayer-times`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/reciters`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/hadith`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/duas`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/qibla`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/developers`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/mcp`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const surahRoutes: MetadataRoute.Sitemap = surahIds.map((id) => ({
    url: `${BASE_URL}/surah/${id}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const reciterRoutes: MetadataRoute.Sitemap = RECITER_PROFILES.map((r) => ({
    url: `${BASE_URL}/reciters/${r.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const duaRoutes: MetadataRoute.Sitemap = duaCategories.map((c) => ({
    url: `${BASE_URL}/duas/${c.id}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // NOTE: intentionally excluded — these are not canonical content:
  //   /search       -> noindex (search UI, no value to crawl)
  //   /bookmarks    -> user-private, blocked in robots.txt
  //   /settings     -> user-private, blocked in robots.txt
  //   /ayah/*       -> canonicalizes to /surah/[id]
  //   /api/*        -> JSON endpoints
  //   /_next/*      -> build assets

  return [...staticRoutes, ...surahRoutes, ...reciterRoutes, ...duaRoutes];
}

