import { NextRequest } from "next/server";

/**
 * Hosted MCP endpoint (Streamable HTTP, JSON-RPC 2.0).
 *
 * Lets AI clients (ChatGPT, Claude, etc.) connect to telawa's Quran tools by
 * URL — no local install required. Just add this Server URL:
 *   https://telawa.org/api/mcp
 *
 * Read-only. Wraps the public /api/v1 endpoints. No API key.
 */

const PROTOCOL_VERSION = "2024-11-05";

const BASE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://telawa.org";
const API = `${BASE}/api/v1`;

const TOOLS = [
  {
    name: "list_surahs",
    description:
      "List all 114 surahs (chapters) of the Quran with names, revelation type and verse counts.",
    inputSchema: { type: "object", properties: {} },
    path: () => "/surahs",
  },
  {
    name: "get_surah",
    description: "Get a single surah with its ayahs (1-114).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1, maximum: 114 },
        language: { type: "string" },
        translator: { type: "string" },
      },
      required: ["id"],
    },
    path: (a: Record<string, unknown>) => {
      const q = new URLSearchParams();
      if (a.language) q.set("language", String(a.language));
      if (a.translator) q.set("translator", String(a.translator));
      const qs = q.toString() ? `?${q}` : "";
      return `/surahs/${a.id}${qs}`;
    },
  },
  {
    name: "get_ayah",
    description: "Get a single ayah by surah and ayah number, with optional tafsir.",
    inputSchema: {
      type: "object",
      properties: {
        surah: { type: "integer", minimum: 1, maximum: 114 },
        ayah: { type: "integer", minimum: 1 },
        language: { type: "string" },
        tafsir: { type: "boolean" },
      },
      required: ["surah", "ayah"],
    },
    path: (a: Record<string, unknown>) => {
      const q = new URLSearchParams();
      if (a.language) q.set("language", String(a.language));
      if (a.tafsir) q.set("tafsir", "true");
      const qs = q.toString() ? `?${q}` : "";
      return `/ayahs/${a.surah}/${a.ayah}${qs}`;
    },
  },
  {
    name: "random_ayah",
    description: "Get a random ayah from the Quran.",
    inputSchema: { type: "object", properties: {} },
    path: () => "/ayahs/random",
  },
  {
    name: "search_quran",
    description: "Full-text search across the Quran in Arabic and translations.",
    inputSchema: {
      type: "object",
      properties: { q: { type: "string", minLength: 2 }, limit: { type: "integer" } },
      required: ["q"],
    },
    path: (a: Record<string, unknown>) => {
      const q = new URLSearchParams({ q: String(a.q) });
      if (a.limit) q.set("limit", String(a.limit));
      return `/search?${q}`;
    },
  },
  {
    name: "list_reciters",
    description: "List available Quran reciters.",
    inputSchema: { type: "object", properties: {} },
    path: () => "/reciters",
  },
  {
    name: "list_duas",
    description: "List dua/adhkar categories from Hisn al-Muslim.",
    inputSchema: { type: "object", properties: {} },
    path: () => "/duas",
  },
  {
    name: "qibla",
    description: "Get the qibla (Kaaba) bearing in degrees from a lat/lng.",
    inputSchema: {
      type: "object",
      properties: { lat: { type: "number" }, lng: { type: "number" } },
      required: ["lat", "lng"],
    },
    path: (a: Record<string, unknown>) => `/qibla?lat=${a.lat}&lng=${a.lng}`,
  },
] as const;

type RpcReq = { jsonrpc: "2.0"; id?: number | string | null; method: string; params?: Record<string, unknown> };

function result(id: RpcReq["id"], data: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result: data });
}
function rpcError(id: RpcReq["id"], code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } });
}

async function callTool(name: string, args: Record<string, unknown>) {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  const res = await fetch(`${API}${tool.path(args)}`, {
    headers: { accept: "application/json" },
  });
  const text = await res.text();
  return { content: [{ type: "text", text }], isError: !res.ok };
}

export async function POST(request: NextRequest) {
  let body: RpcReq;
  try {
    body = await request.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }
  const { id = null, method, params } = body;

  if (method === "initialize") {
    return result(id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: "Telawa MCP", version: "1.0.0" },
    });
  }
  if (method === "tools/list") {
    return result(id, {
      tools: TOOLS.map(({ name, description, inputSchema }) => ({
        name,
        description,
        inputSchema,
      })),
    });
  }
  if (method === "tools/call") {
    const name = (params?.name as string) ?? "";
    const args = (params?.arguments as Record<string, unknown>) ?? {};
    try {
      return result(id, await callTool(name, args));
    } catch (e) {
      return rpcError(id, -32602, e instanceof Error ? e.message : "Tool error");
    }
  }
  if (method === "ping") return result(id, {});
  if (method?.startsWith("notifications/")) return new Response(null, { status: 204 });

  return rpcError(id, -32601, `Method not found: ${method}`);
}

export function GET() {
  return Response.json({
    name: "Telawa MCP",
    description:
      "Access the Holy Quran, reciters, duas, and Qibla through the Model Context Protocol.",
    version: "1.0.0",
    homepage: BASE,
    documentation: `${BASE}/mcp`,
    transport: "streamable-http",
    protocol: "JSON-RPC 2.0 over POST",
    url: `${BASE}/api/mcp`,
    auth: "none",
    tools: TOOLS.map((t) => t.name),
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
