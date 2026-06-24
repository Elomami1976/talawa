import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/seo";

const BASE_URL = APP_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule applied to every crawler (Googlebot, Bingbot, AI bots, etc.)
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: [
          "/api/",
          "/bookmarks",
          "/settings",
          "/search",
          "/ayah/", // ayah pages canonicalize to /surah/[id]; keep crawlers off them
          "/_next/static/", // build assets, not user-facing content
          "/*?*", // strip query-string variants (utm_*, ?q=, ?lang=, etc.)
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}


