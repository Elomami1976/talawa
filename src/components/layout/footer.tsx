import Link from "next/link";

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-8" dir="rtl">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-arabic text-2xl text-primary">ق</span>
              <span className="font-semibold text-base">تلاوة</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              صدقةٌ جاريةٌ للمسلمين والمسلمات الأحياء منهم والأموات.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">روابط</h3>
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              من نحن
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              اتصل بنا
            </Link>
            <Link href="/developers" className="text-muted-foreground hover:text-primary transition-colors">
              واجهة المطورين (API)
            </Link>
            <Link href="/mcp" className="text-muted-foreground hover:text-primary transition-colors">
              MCP
            </Link>
          </nav>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">تابعنا</h3>
            <Link
              href="https://www.tiktok.com/@telawaorg?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="تيك توك"
            >
              <TikTokIcon />
              <span>تيك توك</span>
            </Link>
            <Link
              href="https://www.youtube.com/@telawaorg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="يوتيوب"
            >
              <YouTubeIcon />
              <span>يوتيوب</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} تلاوة — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
