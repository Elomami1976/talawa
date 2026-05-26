import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Developers — Telawa API",
  description:
    "Free and open Telawa API. Quran text, translations, tafsir, duas, qibla and prayer times. No API key required.",
  alternates: { canonical: buildCanonicalUrl("/developers") },
};

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
