import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Quran MCP Server — Telawa | Model Context Protocol for AI",
  description:
    "Connect ChatGPT, Claude and Copilot to the Holy Quran. Telawa MCP gives AI assistants live tools to read, search and cite the Quran, tafsir, duas, reciters and qibla — no API key. Hosted URL or local install.",
  keywords: [
    "Quran MCP Server",
    "Quran API for AI",
    "Model Context Protocol Quran",
    "Islamic MCP",
    "Quran AI tools",
    "ChatGPT Quran",
    "Claude Quran",
    "MCP Islamic API",
  ],
  alternates: { canonical: buildCanonicalUrl("/mcp") },
  openGraph: {
    type: "website",
    url: buildCanonicalUrl("/mcp"),
    title: "Quran MCP Server — Telawa",
    description:
      "Give AI assistants live access to the Holy Quran via the Model Context Protocol. Hosted MCP URL, no API key.",
  },
};

export default function McpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
