/**
 * Import Reciters from Quran Cloud API into PostgreSQL
 *
 * Usage: npm run import:reciters
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ReciterData {
  identifier: string;
  name: string;
  style: string;
  language: string;
  audioBaseUrl: string;
  format: string;
  isDefault: boolean;
}

const RECITERS: ReciterData[] = [
  {
    identifier: "ar.yasseraldossari",
    name: "Yasser Al-Dosari",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.yasseraldossari",
    format: "mp3",
    isDefault: true,
  },
  {
    identifier: "ar.mahermuaiqly",
    name: "Maher Al-Muaiqly",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.saadalghamdi",
    name: "Saad Al-Ghamdi",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.saadalghamdi",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.shaatree",
    name: "Abu Baker Ash-Shaatree",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.shaatree",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.minshawi",
    name: "Mohamed Siddiq AL-Minshawi",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawi",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.alafasy",
    name: "Mishary Rashid Alafasy",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.husary",
    name: "Mahmoud Khalil Al-Husary",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.abdulbasitmurattal",
    name: "Abdul Basit Abdul Samad (Murattal)",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.abdulbasat",
    name: "Abdul Basit Abdul Samad (Mujawwad)",
    style: "Mujawwad",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasat",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.sudais",
    name: "Abdul Rahman Al-Sudais",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.sudais",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.hanirifai",
    name: "Hani Ar-Rifai",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.hanirifai",
    format: "mp3",
    isDefault: false,
  },
  {
    identifier: "ar.khalefa",
    name: "Khalid Al Jalil",
    style: "Murattal",
    language: "ar",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.khalefa",
    format: "mp3",
    isDefault: false,
  },
];

async function importReciters(): Promise<void> {
  console.log("🎙️  Starting reciter import...\n");

  let created = 0;
  let updated = 0;

  for (const reciter of RECITERS) {
    await prisma.reciter.upsert({
      where: { identifier: reciter.identifier },
      create: reciter,
      update: {
        name: reciter.name,
        style: reciter.style,
        audioBaseUrl: reciter.audioBaseUrl,
        isDefault: reciter.isDefault,
      },
    });

    const existing = await prisma.reciter.findUnique({
      where: { identifier: reciter.identifier },
    });
    if (existing) {
      updated++;
    } else {
      created++;
    }

    console.log(`   ✅ ${reciter.name} (${reciter.identifier})`);
  }

  console.log("\n═══════════════════════════════");
  console.log(`✅ Reciter import complete!`);
  console.log(`📊 ${RECITERS.length} reciters upserted`);
  console.log("═══════════════════════════════");
}

importReciters()
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
