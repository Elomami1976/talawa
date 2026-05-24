#!/usr/bin/env node
/**
 * SEO audit: crawls every URL in the sitemap and verifies for each:
 *   - HTTP status === 200 (no redirects, no 5xx)
 *   - HTML contains a <link rel="canonical"> tag
 *   - the canonical URL is absolute, on the same origin, and (when the route
 *     should self-canonical) equals the fetched URL
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 node scripts/verify-seo.mjs
 *   BASE_URL=https://telawa.app    node scripts/verify-seo.mjs
 */

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Routes whose canonical should NOT equal the fetched URL (intentional). */
const ALIASED = new Map([
  // Per-ayah pages canonicalize to the parent surah; that's by design.
  // The check below applies a regex.
]);

const ALIASED_PATTERNS = [
  { test: /^\/ayah\/(\d+)\/\d+$/, canonical: (m) => `/surah/${m[1]}` },
];

async function getSitemapUrls() {
  const res = await fetch(`${BASE_URL}/sitemap.xml`, { redirect: "manual" });
  if (res.status !== 200) {
    throw new Error(`sitemap.xml returned ${res.status}`);
  }
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function extractCanonical(html) {
  const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function expectedCanonical(url) {
  const u = new URL(url);
  for (const { test, canonical } of ALIASED_PATTERNS) {
    const m = u.pathname.match(test);
    if (m) return `${u.origin}${canonical(m)}`;
  }
  return url;
}

async function checkUrl(url) {
  const errors = [];
  const res = await fetch(url, { redirect: "manual" });

  if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
    errors.push(`redirect ${res.status} -> ${res.headers.get("location")}`);
    return { url, status: res.status, errors };
  }
  if (res.status >= 500) {
    errors.push(`server error ${res.status}`);
    return { url, status: res.status, errors };
  }
  if (res.status !== 200) {
    errors.push(`status ${res.status}`);
  }

  const html = await res.text();
  const canonical = extractCanonical(html);

  if (!canonical) {
    errors.push("missing <link rel=canonical>");
  } else {
    const expected = expectedCanonical(url);
    if (canonical !== expected) {
      errors.push(`canonical mismatch: got ${canonical} expected ${expected}`);
    }
  }

  return { url, status: res.status, canonical, errors };
}

async function main() {
  console.log(`\nSEO audit against ${BASE_URL}\n`);

  const urls = await getSitemapUrls();
  console.log(`Sitemap entries: ${urls.length}\n`);

  let ok = 0;
  let fail = 0;
  const failures = [];

  for (const url of urls) {
    const result = await checkUrl(url);
    if (result.errors.length === 0) {
      ok++;
      process.stdout.write(".");
    } else {
      fail++;
      failures.push(result);
      process.stdout.write("F");
    }
  }

  console.log(`\n\nResults: ${ok} ok, ${fail} failed\n`);
  if (failures.length) {
    for (const f of failures) {
      console.log(`\n  ${f.url}`);
      console.log(`    status: ${f.status}`);
      if (f.canonical) console.log(`    canonical: ${f.canonical}`);
      for (const e of f.errors) console.log(`    - ${e}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
