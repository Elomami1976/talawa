import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact \u2014 telawa",
  description: "Contact the telawa team.",
  alternates: { canonical: buildCanonicalUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-primary">اتصل بنا</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose space-y-5 text-base">
        <p>
          نُرحّب باقتراحاتك وملاحظاتك على <strong>تلاوة (telawa)</strong>،
          سواءً كانت تصحيحاً أو اقتراح ميزةٍ جديدة أو دعاءً بظهر الغيب.
        </p>

        <div className="rounded-xl border bg-muted/30 p-5">
          <p className="text-sm text-muted-foreground">
            البريد الإلكتروني الرسمي للموقع سيُضاف هنا قريباً بإذن الله.
          </p>
          <p className="mt-2 text-sm">
            إلى أن يتم ذلك، تابع التحديثات عبر هذه الصفحة.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-6">قبل المراسلة</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>إن كانت ملاحظتك خطأً في نصٍّ قرآني، أرفق رقم السورة والآية.</li>
          <li>إن كانت مشكلةً تقنية، اذكر المتصفّح ونوع الجهاز.</li>
          <li>إن كان اقتراحَ ميزةٍ، صِفها بإيجاز ولماذا تراها مفيدة.</li>
        </ul>

        <p className="text-sm text-muted-foreground mt-6">
          جزاكم الله خيراً على وقتكم واهتمامكم.
        </p>
      </div>
    </div>
  );
}
