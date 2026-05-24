import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Prayer Times \u2014 telawa",
  description:
    "Accurate daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for your location.",
  alternates: { canonical: buildCanonicalUrl("/prayer-times") },
};

export default function PrayerTimesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
