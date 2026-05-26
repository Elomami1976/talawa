import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "اتجاه القبلة — تلاوة",
  description:
    "حدد اتجاه القبلة (الكعبة المشرفة) من موقعك الحالي باستخدام البوصلة وخدمة تحديد الموقع.",
  alternates: { canonical: buildCanonicalUrl("/qibla") },
};

export default function QiblaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
