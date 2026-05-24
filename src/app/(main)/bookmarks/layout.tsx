import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

// Personal/user-state page \u2014 must not be indexed.
export const metadata: Metadata = {
  title: "Your Bookmarks",
  description: "Your saved verses and surahs.",
  robots: { index: false, follow: false },
  alternates: { canonical: buildCanonicalUrl("/bookmarks") },
};

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
