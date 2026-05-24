// Try alternate bitrate / identifier variants for the two failing reciters
const VARIANTS = [
  // Yasser Al-Dosari candidates
  "https://cdn.islamic.network/quran/audio/64/ar.yasseraldossari/1.mp3",
  "https://cdn.islamic.network/quran/audio/32/ar.yasseraldossari/1.mp3",
  "https://cdn.islamic.network/quran/audio/192/ar.yasseraldossari/1.mp3",
  "https://cdn.islamic.network/quran/audio-surah/128/ar.yasseraldossari/1.mp3",
  // Saad Al-Ghamdi candidates
  "https://cdn.islamic.network/quran/audio/64/ar.saadalghamdi/1.mp3",
  "https://cdn.islamic.network/quran/audio/32/ar.saadalghamdi/1.mp3",
  "https://cdn.islamic.network/quran/audio/192/ar.saadalghamdi/1.mp3",
  "https://cdn.islamic.network/quran/audio-surah/128/ar.saadalghamdi/1.mp3",
];

async function probe(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      const headers = method === "GET" ? { Range: "bytes=0-100" } : {};
      const res = await fetch(url, { method, signal: ctrl.signal, headers });
      clearTimeout(t);
      console.log(`  ${method.padEnd(4)} ${url}  →  ${res.status}`);
      if (res.ok) return true;
    } catch (err) {
      console.log(`  ${method.padEnd(4)} ${url}  →  ERR ${err.message}`);
    }
  }
  return false;
}

async function run() {
  // First also try the alquran.cloud editions list to find canonical identifiers
  try {
    const r = await fetch("https://api.alquran.cloud/v1/edition?format=audio&language=ar");
    const j = await r.json();
    const matches = (j.data || []).filter((e) =>
      /yasser|dosari|ghamdi|saad/i.test(e.identifier + " " + (e.name || "") + " " + (e.englishName || ""))
    );
    console.log("🔎 Matching editions in alquran.cloud:");
    matches.forEach((m) =>
      console.log(`  ${m.identifier}  |  ${m.englishName || m.name}  |  bitrate: ${m.bitrate || "?"}`)
    );
    console.log();
  } catch (e) {
    console.log("Could not query editions list:", e.message);
  }

  for (const url of VARIANTS) {
    await probe(url);
  }
}
run();
