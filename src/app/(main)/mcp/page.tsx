"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Search,
  BookOpen,
  Bot,
  ShieldCheck,
  Zap,
  Server,
  Download,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HOSTED_URL = "https://telawa.org/api/mcp";

const useCases = [
  { icon: BookOpen, t: "Cite verses accurately", d: "Models stop hallucinating ayat — they fetch real Arabic text + translation." },
  { icon: Search, t: "Search the Quran", d: "Full-text search across Arabic and 10+ translations from inside a chat." },
  { icon: Bot, t: "Build Islamic assistants", d: "Power custom GPTs / agents with tafsir, duas, reciters and qibla." },
  { icon: Zap, t: "Daily verse & study", d: "Random ayah, dhikr from Hisn al-Muslim, prayer/qibla helpers." },
];

const tools = [
  ["list_surahs", "All 114 chapters with names + verse counts"],
  ["get_surah", "A full surah with ayahs and translation"],
  ["get_ayah", "A single verse, optional tafsir"],
  ["random_ayah", "A random verse for daily inspiration"],
  ["search_quran", "Full-text Arabic / translation search"],
  ["list_reciters", "Featured Quran reciters"],
  ["list_duas / get_dua_category", "Adhkar from Hisn al-Muslim"],
  ["qibla", "Kaaba bearing from any location"],
];

const localConfig = `{
  "mcpServers": {
    "telawa": {
      "command": "npx",
      "args": ["-y", "telawa-mcp"]
    }
  }
}`;

const faq = [
  ["Do I need an API key?", "No. It is free and open. The hosted URL works immediately; please attribute telawa.org."],
  ["Hosted vs local?", "Hosted = paste the URL, zero install. Local = run via npx/node for offline or custom setups."],
  ["What data is it?", "The same as our public API: Quran text, translations, tafsir, duas, reciters, qibla."],
  ["Is it read-only?", "Yes. The MCP server only reads — it never modifies anything."],
];

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export default function McpPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 pb-24 md:pb-16">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Telawa MCP — Quran for AI
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Connect ChatGPT, Claude, Copilot and any MCP client to the Holy Quran.
          Live tools to read, search and cite the Quran, tafsir, duas, reciters
          and qibla — no API key required.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="secondary">Free & open</Badge>
          <Badge variant="secondary">No API key</Badge>
          <Badge variant="secondary">Read-only</Badge>
        </div>
      </header>

      {/* Hosted URL */}
      <Card className="mb-10 border-primary/40">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Hosted server — just paste the URL</h2>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5 font-mono text-sm">
            <span className="flex-1 truncate">{HOSTED_URL}</span>
            <CopyBtn text={HOSTED_URL} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Add this as a Server URL in your AI client. No install, no Node.js, no JSON.
          </p>
        </CardContent>
      </Card>

      {/* Use cases */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Use cases</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {useCases.map(({ icon: Icon, t, d }) => (
            <Card key={t}><CardContent className="p-4">
              <Icon className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold text-sm">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">What the model can do</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {tools.map(([n, d]) => (
            <div key={n} className="flex gap-2 text-sm border rounded-lg px-3 py-2">
              <code className="text-primary font-mono shrink-0">{n}</code>
              <span className="text-muted-foreground">— {d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Install (local) */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Local install (optional)</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Prefer running it yourself? Add this to your Claude Desktop / VS Code config:
        </p>
        <div className="relative">
          <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto"><code>{localConfig}</code></pre>
          <div className="absolute top-3 right-3"><CopyBtn text={localConfig} /></div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <Download className="h-4 w-4 text-primary" />
          <a href="/developers" className="text-primary underline">REST API docs</a>
          <span className="text-muted-foreground">·</span>
          <a href={HOSTED_URL} className="text-primary underline">View server manifest</a>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold mb-4">FAQ</h2>
        <div className="space-y-2">
          {faq.map(([q, a]) => (
            <details key={q} className="group border rounded-lg px-4 py-3">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-medium list-none">
                {q}
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-sm text-muted-foreground mt-2">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
