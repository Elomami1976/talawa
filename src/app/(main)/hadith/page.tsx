import type { Metadata } from "next";
import { BookCheck } from "lucide-react";
import { HadithSearchClient } from "@/components/hadith/hadith-search-client";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "التحقّق من صحة الحديث | Hadith Authenticity Check — تلاوة",
  description:
    "تحقّق من صحة الأحاديث النبوية عبر الموسوعة الحديثية للدرر السنية: ابحث عن أي حديث لتعرف درجته (صحيح، حسن، ضعيف، موضوع) ومخرِّجه والكتاب الذي ورد فيه.",
  alternates: { canonical: buildCanonicalUrl("/hadith") },
  openGraph: {
    title: "التحقّق من صحة الحديث — تلاوة",
    description:
      "ابحث عن أي حديث في الموسوعة الحديثية للدرر السنية، واطّلع على درجته ومصدره.",
    url: buildCanonicalUrl("/hadith"),
  },
};

export default function HadithPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-4 py-8 pb-24 md:pb-12"
      dir="rtl"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
          <BookCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          التحقّق من صحة الحديث
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
          ابحث عن أيّ حديث أو جزء منه لمعرفة درجته (صحيح، حسن، ضعيف، موضوع)
          والكتاب الذي ورد فيه، وذلك عبر الموسوعة الحديثية{" "}
          <a
            href="https://dorar.net"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            للدرر السنية
          </a>
          .
        </p>
      </div>

      <HadithSearchClient />

      <div className="mt-10 p-4 rounded-lg bg-muted/50 border text-xs text-muted-foreground text-center leading-relaxed">
        <p>
          النتائج تُجلب مباشرةً من خدمة الموسوعة الحديثية للدرر السنية. موقع
          تلاوة لا يستضيف بيانات الأحاديث، وإنما يعرضها للمستخدم. لأيّ استفسار
          حول حكم الحديث، يُرجى الرجوع إلى{" "}
          <a
            href="https://dorar.net"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            موقع الدرر السنية
          </a>
          .
        </p>
      </div>
    </main>
  );
}
