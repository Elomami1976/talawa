import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { RECITER_PROFILES } from "@/lib/reciters-data";
import { APP_URL } from "@/lib/seo";

const BASE_URL = APP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const surahs = await prisma.surah.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  }).catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/quran`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/prayer-times`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/reciters`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const surahRoutes: MetadataRoute.Sitemap = surahs.map((s) => ({
    url: `${BASE_URL}/surah/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const reciterRoutes: MetadataRoute.Sitemap = RECITER_PROFILES.map((r) => ({
    url: `${BASE_URL}/reciters/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...surahRoutes, ...reciterRoutes];
}
