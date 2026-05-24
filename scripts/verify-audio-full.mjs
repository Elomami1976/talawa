/**
 * Verify the LIVE URL builder against the real CDNs for every reciter in
 * DEFAULT_RECITERS. Tests 4 representative ayahs per reciter.
 *
 * Usage: node scripts/verify-audio-full.mjs
 */

// Mirror of DEFAULT_RECITERS (kept inline so this script needs no transpile)
const RECITERS = [
  { id: "ar.yasseraldossari",   base: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps",        format: "surah-ayah" },
  { id: "ar.mahermuaiqly",      base: "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly", format: "global" },
  { id: "ar.saadalghamdi",      base: "https://everyayah.com/data/Ghamadi_40kbps",                   format: "surah-ayah" },
  { id: "ar.shaatree",          base: "https://cdn.islamic.network/quran/audio/128/ar.shaatree",     format: "global" },
  { id: "ar.minshawi",          base: "https://cdn.islamic.network/quran/audio/128/ar.minshawi",     format: "global" },
  { id: "ar.alafasy",           base: "https://cdn.islamic.network/quran/audio/128/ar.alafasy",      format: "global" },
  { id: "ar.husary",            base: "https://cdn.islamic.network/quran/audio/128/ar.husary",       format: "global" },
  { id: "ar.husarymujawwad",    base: "https://cdn.islamic.network/quran/audio/128/ar.husarymujawwad", format: "global" },
  { id: "ar.abdulsamad",        base: "https://cdn.islamic.network/quran/audio/64/ar.abdulsamad",    format: "global" },
  { id: "ar.abdurrahmaansudais",base: "https://cdn.islamic.network/quran/audio/64/ar.abdurrahmaansudais", format: "global" },
  { id: "ar.hudhaify",          base: "https://cdn.islamic.network/quran/audio/128/ar.hudhaify",     format: "global" },
  { id: "ar.ahmedajamy",        base: "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy",   format: "global" },
  { id: "ar.muhammadayyoub",    base: "https://cdn.islamic.network/quran/audio/128/ar.muhammadayyoub", format: "global" },
  { id: "ar.muhammadjibreel",   base: "https://cdn.islamic.network/quran/audio/128/ar.muhammadjibreel", format: "global" },
  { id: "ar.hanirifai",         base: "https://cdn.islamic.network/quran/audio/64/ar.hanirifai",     format: "global" },
  { id: "ar.saoodshuraym",      base: "https://cdn.islamic.network/quran/audio/64/ar.saoodshuraym",  format: "global" },
  { id: "ar.abdullahbasfar",    base: "https://cdn.islamic.network/quran/audio/64/ar.abdullahbasfar",format: "global" },
  { id: "ar.aymanswoaid",       base: "https://cdn.islamic.network/quran/audio/64/ar.aymanswoaid",   format: "global" },
];

// Test cases: [global, surah, ayahInSurah]
const TESTS = [
  [1,      1,   1],   // Al-Fatiha 1:1
  [128,    2,   121], // Mid Al-Baqarah
  [3000,   25,  53],  // Al-Furqan ~
  [6236,   114, 6],   // Last ayah (An-Nas 114:6)
];

function buildAudioUrl(base, global, s, a, fmt) {
  if (fmt === "surah-ayah" && s && a) {
    return `${base}/${String(s).padStart(3, "0")}${String(a).padStart(3, "0")}.mp3`;
  }
  return `${base}/${global}.mp3`;
}

async function head(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
    clearTimeout(t);
    return res.status;
  } catch (err) {
    return `ERR ${err.message}`;
  }
}

const failed = [];
console.log(`🎧 Verifying ${RECITERS.length} reciters × ${TESTS.length} ayahs\n`);

for (const r of RECITERS) {
  const urls = TESTS.map(([g, s, a]) => buildAudioUrl(r.base, g, s, a, r.format));
  const statuses = await Promise.all(urls.map(head));
  const okCount = statuses.filter((s) => s === 200).length;
  const flag = okCount === statuses.length ? "✅" : okCount === 0 ? "❌" : "⚠️ ";
  console.log(`${flag} ${r.id.padEnd(28)} ${okCount}/${statuses.length}  [${r.format}]`);
  if (okCount < statuses.length) {
    statuses.forEach((s, i) => s !== 200 && console.log(`     ↳ ${urls[i]}  → ${s}`));
    failed.push(r.id);
  }
}

console.log("\n═══════════════════════════════");
console.log(failed.length === 0
  ? `✅ All ${RECITERS.length} reciters work for every tested ayah.`
  : `❌ ${failed.length} reciter(s) failed: ${failed.join(", ")}`);
console.log("═══════════════════════════════");
