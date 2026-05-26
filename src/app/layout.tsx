import type { Metadata, Viewport } from "next";
import { Inter, Scheherazade_New, Noto_Naskh_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { Toaster } from "@/components/ui/toaster";
import { generateWebsiteJsonLd, APP_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Self-hosted Arabic fonts via next/font: automatic preload, no external
// network request, no FOUT, weights trimmed to what we actually render.
const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-noto-naskh",
  display: "swap",
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "telawa";

// NOTE: we intentionally do NOT set `export const dynamic = "force-dynamic"` here.
// Forcing every page dynamic disables SSG, slows TTFB, and turns transient DB
// hiccups into 5xx responses — which Google flags as "Server error (5xx)" in
// Search Console. Individual routes opt in to dynamic rendering when needed.

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Read the Holy Quran Online`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Read, listen and understand the Holy Quran. Features translations in 10+ languages, tafsir (exegesis), audio recitations by top reciters, prayer times, and bookmarks.",
  keywords: [
    "Quran",
    "Holy Quran",
    "Quran online",
    "Quran translation",
    "Quran tafsir",
    "Islamic",
    "Muslim",
    "Prayer times",
    "Arabic",
    "Quran recitation",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Read the Holy Quran Online`,
    description:
      "Read, listen and understand the Holy Quran with translations, tafsir and audio recitations.",
    images: [
      {
        url: `${APP_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Read the Holy Quran Online`,
    description:
      "Read, listen and understand the Holy Quran with translations, tafsir and audio recitations.",
    images: [`${APP_URL}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: APP_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === "ar" || locale === "ur";

  const websiteJsonLd = generateWebsiteJsonLd();

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${inter.variable} ${scheherazade.variable} ${notoNaskh.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <LoadingScreen />
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
