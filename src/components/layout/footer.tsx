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

const linkGroups = [
  {
    title: "الموقع",
    links: [
      { href: "/about", label: "من نحن" },
      { href: "/support", label: "دعم الموقع" },
      { href: "/contact", label: "اتصل بنا" },
      { href: "/privacy", label: "سياسة الخصوصية" },
    ],
  },
  {
    title: "للمطورين",
    links: [
      { href: "/developers", label: "واجهة المطورين (API)" },
      { href: "/mcp", label: "خادم MCP" },
    ],
  },
];

const socialLinks = [
  { href: "https://www.tiktok.com/@telawaorg?lang=en", label: "تيك توك", Icon: TikTokIcon },
  { href: "https://www.youtube.com/@telawaorg", label: "يوتيوب", Icon: YouTubeIcon },
];

const linkClass = "text-muted-foreground hover:text-primary transition-colors";

export function Footer() {
  return (
    <footer className="theme-inverse border-t bg-background text-foreground mt-8" dir="rtl">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-sm md:grid-cols-4">
          {/* Brand - full width on mobile, first column from md up */}
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <span className="font-arabic text-2xl text-primary">ق</span>
              <span className="font-semibold text-base">تلاوة</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              صدقةٌ جاريةٌ للمسلمين والمسلمات الأحياء منهم والأموات.
            </p>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} className="flex flex-col gap-3" aria-label={group.title}>
              <h3 className="font-semibold">{group.title}</h3>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">تابعنا</h3>
            {socialLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 w-fit ${linkClass}`}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} تلاوة. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
