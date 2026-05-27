"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Copy,
  Check,
  Zap,
  Heart,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Endpoint {
  method: "GET";
  path: string;
  summary: string;
  description?: string;
  params?: Array<{ name: string; required?: boolean; description: string; example?: string }>;
  example: string;
  exampleResponse: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/v1",
    summary: "API metadata",
    description: "Returns information about the API and all available endpoints.",
    example: "/api/v1",
    exampleResponse: `{
  "success": true,
  "data": {
    "name": "Telawa Public API",
    "version": "1.0.0",
    "rateLimit": "100 requests/minute per IP",
    "endpoints": { ... }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/surahs",
    summary: "List all 114 surahs",
    description: "Returns metadata for every chapter of the Quran.",
    example: "/api/v1/surahs",
    exampleResponse: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "nameAr": "الفاتحة",
      "nameEn": "Al-Fatihah",
      "englishTranslation": "The Opening",
      "revelationType": "Meccan",
      "ayahCount": 7
    }
  ],
  "meta": { "count": 114 }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/surahs/{id}",
    summary: "Get a specific surah",
    params: [
      { name: "id", required: true, description: "Surah number (1–114)", example: "1" },
      { name: "ayahs", description: "Include ayahs (default true). Pass false to skip.", example: "false" },
      { name: "language", description: "Include translations in this language", example: "en" },
      { name: "translator", description: "Specific translator slug", example: "en.sahih" },
    ],
    example: "/api/v1/surahs/1?language=en&translator=en.sahih",
    exampleResponse: `{
  "success": true,
  "data": {
    "id": 1,
    "nameAr": "الفاتحة",
    "ayahs": [
      {
        "ayahNumber": 1,
        "ayahKey": "1:1",
        "textAr": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "translations": [{ "text": "In the name of Allah..." }]
      }
    ]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/ayahs/{surah}/{ayah}",
    summary: "Get a single ayah",
    params: [
      { name: "surah", required: true, description: "Surah number", example: "2" },
      { name: "ayah", required: true, description: "Ayah number", example: "255" },
      { name: "language", description: "Language code for translation", example: "en" },
      { name: "translator", description: "Translator slug", example: "en.sahih" },
      { name: "tafsir", description: "Include tafsir (true/false)", example: "true" },
    ],
    example: "/api/v1/ayahs/2/255?language=en&tafsir=true",
    exampleResponse: `{
  "success": true,
  "data": {
    "ayahKey": "2:255",
    "textAr": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...",
    "surah": { "nameEn": "Al-Baqarah" }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/ayahs/random",
    summary: "Get a random ayah",
    description: "Returns a random ayah from the entire Quran. Not cached.",
    params: [
      { name: "language", description: "Language for translation", example: "en" },
      { name: "translator", description: "Translator slug", example: "en.sahih" },
    ],
    example: "/api/v1/ayahs/random?language=en",
    exampleResponse: `{ "success": true, "data": { "ayahKey": "55:13", ... } }`,
  },
  {
    method: "GET",
    path: "/api/v1/translations",
    summary: "Quran translations",
    description: "List available translations or fetch text by surah/ayah.",
    params: [
      { name: "list", description: "Return distinct (language, translator) pairs", example: "true" },
      { name: "surahId", description: "Filter by surah (1–114)", example: "1" },
      { name: "ayahId", description: "Filter by single ayah id", example: "1" },
      { name: "language", description: "Language code", example: "ar" },
      { name: "translator", description: "Translator slug", example: "ar.muyassar" },
    ],
    example: "/api/v1/translations?list=true",
    exampleResponse: `{
  "success": true,
  "data": [
    { "language": "ar", "translator": "ar.muyassar", "ayahCount": 6236 },
    { "language": "en", "translator": "en.sahih", "ayahCount": 6236 }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/tafsirs",
    summary: "Quranic tafsir (exegesis)",
    params: [
      { name: "list", description: "List available tafsirs", example: "true" },
      { name: "surahId", description: "Filter by surah", example: "1" },
      { name: "ayahId", description: "Filter by single ayah", example: "1" },
      { name: "source", description: "Tafsir source slug", example: "ar.muyassar" },
      { name: "language", description: "Language code", example: "ar" },
    ],
    example: "/api/v1/tafsirs?surahId=1&source=ar.muyassar",
    exampleResponse: `{ "success": true, "data": [...] }`,
  },
  {
    method: "GET",
    path: "/api/v1/reciters",
    summary: "List Quran reciters",
    description: "Returns all available reciters with audio base URLs.",
    example: "/api/v1/reciters",
    exampleResponse: `{
  "success": true,
  "data": [
    {
      "identifier": "ar.alafasy",
      "name": "Mishary Al-Afasy",
      "style": "Murattal",
      "audioBaseUrl": "https://..."
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/duas",
    summary: "List all dua categories",
    description: "132 chapters of authentic supplications from Hisn al-Muslim.",
    example: "/api/v1/duas",
    exampleResponse: `{
  "success": true,
  "data": [
    { "id": 27, "title": "أذكار الصباح والمساء", "duaCount": 24 }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/duas/{id}",
    summary: "Get duas in a category",
    params: [{ name: "id", required: true, description: "Category id", example: "27" }],
    example: "/api/v1/duas/27",
    exampleResponse: `{
  "success": true,
  "data": {
    "id": 27,
    "title": "أذكار الصباح والمساء",
    "duas": [{ "arabic": "...", "repeat": "3" }]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/qibla",
    summary: "Calculate qibla direction",
    description: "Returns the great-circle bearing from any point to the Kaaba.",
    params: [
      { name: "lat", required: true, description: "Latitude (-90 to 90)", example: "40.7128" },
      { name: "lng", required: true, description: "Longitude (-180 to 180)", example: "-74.0060" },
    ],
    example: "/api/v1/qibla?lat=40.7128&lng=-74.0060",
    exampleResponse: `{
  "success": true,
  "data": {
    "from": { "latitude": 40.7128, "longitude": -74.006 },
    "qibla": {
      "bearingDegreesFromNorth": 58.48,
      "distanceKm": 10322.31
    }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/search",
    summary: "Full-text Quran search",
    params: [
      { name: "q", required: true, description: "Query (min 2 chars)", example: "الرحمن" },
      { name: "language", description: "Also search translations in this language", example: "en" },
      { name: "page", description: "Page number (default 1)", example: "1" },
      { name: "limit", description: "Results per page (max 50)", example: "20" },
    ],
    example: "/api/v1/search?q=الرحمن&language=ar",
    exampleResponse: `{
  "success": true,
  "data": {
    "arabicMatches": [...],
    "translationMatches": [...]
  }
}`,
  },
];

function EndpointCard({ ep, baseUrl }: { ep: Endpoint; baseUrl: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fullUrl = `${baseUrl}${ep.example}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-right hover:bg-muted/30 transition-colors"
      >
        <CardContent className="p-4 flex items-center gap-3">
          <Badge variant="secondary" className="font-mono text-xs shrink-0">
            {ep.method}
          </Badge>
          <code className="text-sm font-mono flex-1 truncate text-left ltr:text-left">
            {ep.path}
          </code>
          <span className="text-xs text-muted-foreground hidden sm:block">
            {ep.summary}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </CardContent>
      </button>

      {open && (
        <div className="border-t bg-muted/20 p-4 space-y-4">
          {ep.description && (
            <p className="text-sm text-muted-foreground">{ep.description}</p>
          )}

          {ep.params && ep.params.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Parameters
              </h4>
              <div className="space-y-1.5">
                {ep.params.map((p) => (
                  <div key={p.name} className="text-sm flex flex-wrap items-baseline gap-2">
                    <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
                      {p.name}
                    </code>
                    {p.required && (
                      <span className="text-xs text-destructive">required</span>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {p.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Try it
            </h4>
            <div className="flex items-stretch gap-2">
              <code
                dir="ltr"
                className="flex-1 text-xs font-mono bg-background border rounded-md px-3 py-2 overflow-x-auto whitespace-nowrap"
              >
                {fullUrl}
              </code>
              <button
                type="button"
                onClick={copy}
                className="px-3 rounded-md border bg-background hover:bg-muted transition-colors"
                aria-label="Copy URL"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <a
                href={ep.example}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 flex items-center rounded-md border bg-background hover:bg-muted transition-colors"
                aria-label="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Response example
            </h4>
            <pre
              dir="ltr"
              className="text-xs font-mono bg-background border rounded-md p-3 overflow-x-auto whitespace-pre"
            >
              {ep.exampleResponse}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function DevelopersPage() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-12" dir="ltr">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <Code2 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Telawa <span className="text-primary">API</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A free and open Quran API for the Muslim developer community. Quran
          text, translations, tafsir, audio, duas, qibla and prayer times — all
          in one place. <strong>No API key required.</strong>
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm">100% Free</p>
            <p className="text-xs text-muted-foreground mt-1">
              Forever, no payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="font-semibold text-sm">No Auth</p>
            <p className="text-xs text-muted-foreground mt-1">
              No keys, no signups
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <p className="font-semibold text-sm">Fast</p>
            <p className="text-xs text-muted-foreground mt-1">
              CDN-cached responses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShieldCheck className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="font-semibold text-sm">CORS Open</p>
            <p className="text-xs text-muted-foreground mt-1">
              Use from anywhere
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick start */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">Quick start</h2>
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Make a GET request to any endpoint below. All responses are JSON
              with a consistent envelope:
            </p>
            <pre
              dir="ltr"
              className="text-xs font-mono bg-muted/40 border rounded-md p-3 overflow-x-auto"
            >
{`// Success
{ "success": true, "data": ..., "meta": { ... } }

// Error
{ "success": false, "error": "Reason" }`}
            </pre>
            <p className="text-sm text-muted-foreground">Example using fetch:</p>
            <pre
              dir="ltr"
              className="text-xs font-mono bg-muted/40 border rounded-md p-3 overflow-x-auto"
            >
{`const res = await fetch("${baseUrl || "https://telawa.app"}/api/v1/surahs/1");
const { data } = await res.json();
console.log(data.nameEn); // "Al-Fatihah"`}
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Rate limit */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">Rate limits & caching</h2>
        <Card>
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">100 requests / minute / IP</p>
                <p className="text-muted-foreground text-xs">
                  Search endpoint is 30/min due to its higher cost.
                  Exceeding the limit returns HTTP 429 with a{" "}
                  <code className="text-xs">Retry-After</code> header.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Aggressive CDN caching</p>
                <p className="text-muted-foreground text-xs">
                  Quran text, surahs and duas are cached for up to 30 days. Most
                  requests are served from the edge and never hit the database.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Endpoints */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">Endpoints</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click any endpoint to expand parameters and see an example response.
        </p>
        <div className="space-y-2">
          {endpoints.map((ep) => (
            <EndpointCard key={ep.path} ep={ep} baseUrl={baseUrl} />
          ))}
        </div>
      </section>

      {/* Attribution */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">Attribution</h2>
        <Card>
          <CardContent className="p-4 text-sm space-y-2">
            <p>
              Telawa API is provided as <strong>ṣadaqah jāriyah</strong> — a
              continuous charity. You may use it in any project (commercial or
              non-commercial) without payment.
            </p>
            <p className="text-muted-foreground">
              An attribution link to{" "}
              <Link
                href="/"
                className="text-primary underline hover:no-underline"
              >
                telawa.app
              </Link>{" "}
              is appreciated but not required. Please make duʿāʾ for the team
              and contributors.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-xl font-bold mb-3">Support</h2>
        <Card>
          <CardContent className="p-4 text-sm space-y-2">
            <p>
              Found a bug or want to request an endpoint?{" "}
              <Link href="/contact" className="text-primary underline">
                Contact us
              </Link>
              .
            </p>
            <p className="text-muted-foreground text-xs">
              This API is built on the same database that powers telawa.app.
              Both will be maintained together for as long as we can.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
