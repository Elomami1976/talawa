import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-8" dir="rtl">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-arabic text-xl text-primary">ق</span>
          <span>تلاوة — صدقةٌ جاريةٌ للمسلمين والمسلمات</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="hover:text-primary transition-colors">
            من نحن
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            سياسة الخصوصية
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            اتصل بنا
          </Link>
        </nav>
      </div>
    </footer>
  );
}
