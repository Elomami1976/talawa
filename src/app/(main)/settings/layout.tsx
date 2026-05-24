import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

// Personal/user-state page \u2014 must not be indexed.
export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your reading preferences.",
  robots: { index: false, follow: false },
  alternates: { canonical: buildCanonicalUrl("/settings") },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
