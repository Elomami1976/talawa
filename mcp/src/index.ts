#!/usr/bin/env node
/**
 * Telawa MCP server.
 *
 * Exposes the public telawa.org Quran API (/api/v1) as Model Context Protocol
 * tools so AI assistants (Claude, ChatGPT, Copilot, …) can read, search and
 * cite the Holy Quran, tafsir, duas, reciters and qibla direction directly
 * from authoritative data instead of hallucinating verses.
 *
 * Read-only. No API key required. Honours the upstream rate limit.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = process.env.TELAWA_API_BASE ?? "https://telawa.org/api/v1";

async function api(path: string): Promise<unknown> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Telawa API ${res.status} for ${path}`);
  }
  return res.json();
}

function asText(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

const server = new McpServer({ name: "telawa", version: "1.0.0" });

server.tool(
  "list_surahs",
  "List all 114 surahs (chapters) of the Quran with names, revelation type and verse counts.",
  {},
  async () => asText(await api("/surahs"))
);

server.tool(
  "get_surah",
  "Get a single surah with its ayahs. Optionally filter translation by language/translator, or skip ayahs.",
  {
    id: z.number().int().min(1).max(114),
    includeAyahs: z.boolean().optional(),
    language: z.string().optional(),
    translator: z.string().optional(),
  },
  async ({ id, includeAyahs, language, translator }) => {
    const q = new URLSearchParams();
    if (includeAyahs === false) q.set("ayahs", "false");
    if (language) q.set("language", language);
    if (translator) q.set("translator", translator);
    const qs = q.toString() ? `?${q}` : "";
    return asText(await api(`/surahs/${id}${qs}`));
  }
);

server.tool(
  "get_ayah",
  "Get a single ayah by surah and ayah number, with optional translation and tafsir.",
  {
    surah: z.number().int().min(1).max(114),
    ayah: z.number().int().min(1),
    language: z.string().optional(),
    tafsir: z.boolean().optional(),
  },
  async ({ surah, ayah, language, tafsir }) => {
    const q = new URLSearchParams();
    if (language) q.set("language", language);
    if (tafsir) q.set("tafsir", "true");
    const qs = q.toString() ? `?${q}` : "";
    return asText(await api(`/ayahs/${surah}/${ayah}${qs}`));
  }
);

server.tool(
  "random_ayah",
  "Get a random ayah from the Quran (useful for daily verse / inspiration).",
  {},
  async () => asText(await api("/ayahs/random"))
);

server.tool(
  "search_quran",
  "Full-text search across the Quran in Arabic and translations.",
  {
    q: z.string().min(2),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    language: z.string().optional(),
  },
  async ({ q, page, limit, language }) => {
    const p = new URLSearchParams({ q });
    if (page) p.set("page", String(page));
    if (limit) p.set("limit", String(limit));
    if (language) p.set("language", language);
    return asText(await api(`/search?${p}`));
  }
);

server.tool(
  "list_reciters",
  "List available Quran reciters and their metadata.",
  {},
  async () => asText(await api("/reciters"))
);

server.tool(
  "list_duas",
  "List dua/adhkar categories from Hisn al-Muslim.",
  {},
  async () => asText(await api("/duas"))
);

server.tool(
  "get_dua_category",
  "Get all duas within a category by id.",
  { id: z.number().int().min(1) },
  async ({ id }) => asText(await api(`/duas/${id}`))
);

server.tool(
  "qibla",
  "Get the qibla (Kaaba) bearing in degrees from a latitude/longitude.",
  { lat: z.number(), lng: z.number() },
  async ({ lat, lng }) => asText(await api(`/qibla?lat=${lat}&lng=${lng}`))
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("telawa-mcp fatal:", err);
  process.exit(1);
});
