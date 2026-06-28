import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/seo";

const BASE_URL = APP_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule applied to every crawler (Googlebot, Bingbot, AI bots, etc.)
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/api/mcp"],
        disallow: [
          "/api/",
          "/bookmarks",
          "/settings",
          // NOTE: do NOT disallow /search or /ayah/. Those routes already ship a
          // noindex meta tag (search/layout.tsx, ayah page). Blocking them in
          // robots.txt would stop Google from reading the noindex/canonical, so
          // they'd linger as "Crawled - currently not indexed" / "Duplicate".
          // Leaving them crawlable lets Google honor noindex and the canonical
          // back to /surah/[id], then drop them cleanly.
          "/_next/static/", // build assets, not user-facing content
          "/*?*", // strip query-string variants (utm_*, ?q=, ?lang=, etc.)
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}


