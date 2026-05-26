import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { duaCategories } from "@/lib/duas-data";
import { buildCanonicalUrl } from "@/lib/seo";
import { BookHeart, ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "الأذكار والأدعية — تلاوة",
  description:
    "أذكار وأدعية المسلم اليومية من كتاب حصن المسلم، الواردة في الكتاب والسنة الصحيحة — أذكار الصباح والمساء، النوم، الصلاة، السفر وغيرها.",
  alternates: { canonical: buildCanonicalUrl("/duas") },
};

export default function DuasPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-12" dir="rtl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
          <BookHeart className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          الأذكار والأدعية
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          من كتاب <strong>حصن المسلم</strong> للشيخ سعيد بن علي القحطاني — أذكار
          وأدعية مأثورة عن النبي صلى الله عليه وسلم من الكتاب والسنة الصحيحة.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {duaCategories.map((cat) => (
          <Link key={cat.id} href={`/duas/${cat.id}`}>
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cat.duas.length} {cat.duas.length === 1 ? "ذكر" : "أذكار"}
                  </p>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">
        البيانات مصدرها{" "}
        <a
          href="https://www.hisnmuslim.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          hisnmuslim.com
        </a>
      </p>
    </main>
  );
}
