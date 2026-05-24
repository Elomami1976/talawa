import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/seo";

const BASE_URL = APP_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/bookmarks",
          "/settings",
          "/ayah/", // pages canonicalize to /surah/[id]; keep crawlers off them
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
