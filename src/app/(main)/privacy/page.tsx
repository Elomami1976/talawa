import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy \u2014 telawa",
  description: "Privacy policy for the telawa platform.",
  alternates: { canonical: buildCanonicalUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-primary">سياسة الخصوصية</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose space-y-5 text-base">
        <p>
          نحن في <strong>تلاوة (telawa)</strong> نحترم خصوصيتك ونلتزم بحمايتها.
          يوضّح هذا المستند ما الذي نجمعه ولماذا، ومالا نجمعه.
        </p>

        <h2 className="text-xl font-semibold mt-6">١. ما لا نجمعه</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>لا نطلب التسجيل ولا إنشاء حسابات.</li>
          <li>لا نجمع أسماءً أو عناوين بريد إلكتروني أو أرقام هواتف.</li>
          <li>لا نبيع أي بيانات لأي طرفٍ ثالث، لأنّنا لا نمتلك بيانات لبيعها.</li>
          <li>لا توجد إعلانات ولا مُتتبّعات إعلانية على الموقع.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">٢. ما يُخزَّن محلياً على جهازك</h2>
        <p>
          تُحفظ الإعدادات (اللغة، الخط، القارئ المختار) والإشارات المرجعية
          داخل <code>localStorage</code> في متصفّحك فقط. لا تُرسَل إلى أي خادم.
          يمكنك مسحها في أي وقتٍ من إعدادات المتصفح.
        </p>

        <h2 className="text-xl font-semibold mt-6">٣. الخدمات الخارجية</h2>
        <p>يستخدم الموقع خدماتٍ عامة موثوقة لجلب البيانات:</p>
        <ul className="list-disc pr-6 space-y-1">
          <li><code>alquran.cloud</code> و <code>cdn.islamic.network</code> — نصوص القرآن والصوتيات.</li>
          <li><code>aladhan.com</code> — حساب مواقيت الصلاة.</li>
          <li><code>ipapi.co</code> — تقدير الموقع تقريبياً عند تعذّر الـ GPS (لتحديد القبلة والمواقيت).</li>
        </ul>
        <p>
          هذه الخدمات قد تسجّل عنوان IP وفق سياساتها الخاصة. لا نحن من نخزّن هذه السجلّات.
        </p>

        <h2 className="text-xl font-semibold mt-6">٤. ملفّات الكوكيز</h2>
        <p>
          لا يستخدم الموقع كوكيز تتبّعٍ أو إعلانات. قد يستخدم المتصفح كوكيز تقنية بسيطة
          (مثل تفضيل الوضع الليلي).
        </p>

        <h2 className="text-xl font-semibold mt-6">٥. الأطفال</h2>
        <p>
          الموقع مناسبٌ لجميع الأعمار، ولا يجمع بياناتٍ من أيّ شخص بصرف النظر عن سنّه.
        </p>

        <h2 className="text-xl font-semibold mt-6">٦. تحديثات هذه السياسة</h2>
        <p>
          قد نُحدّث هذه السياسة لاحقاً عند إضافة ميزاتٍ جديدة. سيُذكَر تاريخ آخر تحديث هنا.
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          آخر تحديث: ٢٢ مايو ٢٠٢٦.
        </p>
      </div>
    </div>
  );
}
