import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.islamic.network",
        pathname: "/quran/**",
      },
      {
        protocol: "https",
        hostname: "everyayah.com",
        pathname: "/data/**",
      },
    ],
  },
  async redirects() {
    return [
      // NOTE: do NOT add a www<->apex redirect here. Vercel handles the
      // canonical host at the platform level (see Project > Domains).
      // Adding a redirect in Next.js will fight Vercel's redirect and cause
      // ERR_TOO_MANY_REDIRECTS.
      //
      // Catch malformed legacy URLs surfaced by Google Search Console
      // (e.g. https://www.telawa.org/&, https://www.telawa.org/$ )
      { source: "/&", destination: "/", permanent: true },
      { source: "/&/:path*", destination: "/", permanent: true },
      { source: "/$", destination: "/", permanent: true },
      { source: "/$/:path*", destination: "/", permanent: true },
      // Legacy URLs from a previous site (e.g. /singer-55.html).
      { source: "/singer-:id.html", destination: "/reciters", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
      {
        // Belt-and-braces: robots.txt already disallows /api/, but if a
        // crawler ignores robots and hits an endpoint directly, this header
        // tells it not to index the JSON response.
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        // Static build assets (JS chunks, fonts, images) should not show up
        // in Google's index. Search Console flags them as "Crawled - currently
        // not indexed", which is noise. Tell crawlers explicitly: noindex.
        source: "/_next/static/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        // PWA / browser metadata files: must remain crawlable (so browsers
        // and search engines can discover them) but should not appear as
        // search results in their own right.
        source: "/manifest.json",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/apple-icon.png",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/icon.png",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default withNextIntl(nextConfig);
