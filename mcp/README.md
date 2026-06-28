# telawa MCP server

Exposes the public **telawa.org Quran API** (`/api/v1`) as Model Context Protocol
tools so AI assistants (Claude, ChatGPT, Copilot, …) can read, search and cite
the Holy Quran, tafsir, duas, reciters and qibla direction directly.

Read-only · no API key · uses the live public API.

## Tools
- `list_surahs` — all 114 chapters
- `get_surah` — a surah + ayahs (filter by language/translator)
- `get_ayah` — one verse + optional tafsir
- `random_ayah` — daily verse
- `search_quran` — full-text Arabic/translation search
- `list_reciters`, `list_duas`, `get_dua_category`, `qibla`

## Build & run
```bash
cd mcp
npm install
npm run build
npm start        # stdio transport
```

## Use in Claude Desktop / VS Code
```json
{
  "mcpServers": {
    "telawa": { "command": "node", "args": ["./mcp/dist/index.js"] }
  }
}
```

Override the API origin with `TELAWA_API_BASE` (default `https://telawa.org/api/v1`).
