import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

// User-tool page (interactive search UI). Not a content page \u2014 noindex to
// avoid "Crawled - currently not indexed" / "Duplicate" reports in GSC.
export const metadata: Metadata = {
  title: "Search the Quran",
  description: "Search across the Holy Quran by verse, translation or topic.",
  robots: { index: false, follow: true },
  alternates: { canonical: buildCanonicalUrl("/search") },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
