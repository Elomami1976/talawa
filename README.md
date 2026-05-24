# Telawa — Production-Ready Islamic Quran Platform

A full-featured, production-ready Quran platform built with **Next.js 15**, **TypeScript**, **PostgreSQL + Prisma**, and **Tailwind CSS**.

## Features

- 📖 Complete Quran (114 Surahs, 6,236 Ayahs) with Uthmani Arabic script
- 🎧 Audio recitations via `cdn.islamic.network` (10 reciters)
- 🌐 Translations in 10 languages (EN, AR, FR, TR, UR, DE, RU, ID + more)
- 📚 Tafsir (Ibn Kathir, Maariful Quran)
- 🔍 Full-text search in Arabic & English
- 🕌 Prayer times via AlAdhan API (geolocation + 14 calculation methods)
- 🔖 Bookmarks & reading progress (stored locally in the browser)
- 🌙 Dark / Light / System theme
- 📱 Mobile-first responsive design with bottom nav
- ⚡ Static generation + ISR for all 114 surah pages
- 🗺️ XML Sitemap + `robots.txt` for SEO
- 🔒 Rate limiting on all API routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| State | Zustand (persisted, localStorage) |
| Animations | Framer Motion |
| i18n | next-intl (8 locales) |

## Getting Started

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+ (Neon, Supabase, or any Postgres provider)
- npm or pnpm

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/telawa"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Telawa"
```

### 4. Set up the database

```bash
# Push the schema
npm run db:push

# Or use migrations
npm run db:migrate
```

### 5. Import Quran data

```bash
# Import everything at once
npm run import:all

# Or import step by step
npm run import:surahs
npm run import:ayahs
npm run import:reciters
npm run import:translations
npm run import:tafsir
```

> **Note:** The full import takes ~20-30 minutes due to API rate limiting. Translations take the longest.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Management

```bash
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:generate  # Regenerate Prisma client
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/             # Main layout group
│   │   ├── page.tsx        # Homepage
│   │   ├── quran/          # Surah list
│   │   ├── surah/[id]/     # Surah detail
│   │   ├── search/         # Full-text search
│   │   ├── prayer-times/   # Prayer times
│   │   ├── bookmarks/      # User bookmarks
│   │   └── settings/       # App settings
│   ├── api/                # API routes
│   │   ├── surahs/
│   │   ├── ayahs/[surahId]/
│   │   ├── search/
│   │   ├── prayer-times/
│   │   ├── bookmarks/
│   │   └── translations/
│   ├── layout.tsx          # Root layout
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # robots.txt
├── components/
│   ├── audio/              # AudioPlayerBar
│   ├── layout/             # Navbar, MobileNav
│   ├── prayer/             # PrayerTimesWidget
│   ├── providers/          # Theme provider
│   ├── quran/              # AyahCard, SurahCard, Bismillah, etc.
│   ├── search/             # SearchBar
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── constants.ts        # Translations, reciters, tafsirs
│   ├── prayer-times.ts     # AlAdhan API utilities
│   ├── prisma.ts           # Prisma client singleton
│   ├── rate-limit.ts       # In-memory rate limiter
│   ├── seo.ts              # JSON-LD generators
│   └── utils.ts            # Helper functions
├── store/
│   ├── audio-store.ts      # Audio playback state
│   ├── reading-progress-store.ts
│   └── settings-store.ts   # Persisted user settings
└── types/
    └── index.ts            # All TypeScript interfaces
scripts/
├── import-surahs.ts
├── import-ayahs.ts
├── import-translations.ts
├── import-tafsir.ts
└── import-reciters.ts
prisma/
└── schema.prisma
messages/
├── en.json
└── ar.json
```

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t quranapp .
docker run -p 3000:3000 --env-file .env.local quranapp
```

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/surahs` | GET | List all 114 surahs |
| `/api/ayahs/:surahId` | GET | Get ayahs for a surah |
| `/api/search?q=` | GET | Full-text search |
| `/api/prayer-times?lat=&lng=` | GET | Prayer times by coordinates |
| `/api/translations?ayahId=` | GET | Translations for an ayah |

## License

MIT
