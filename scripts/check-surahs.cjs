const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const r = await p.surah.findMany({
    take: 5,
    select: { id: true, nameAr: true, nameEn: true, nameTrans: true, englishTranslation: true },
  });
  console.log(JSON.stringify(r, null, 2));
  await p.$disconnect();
})();
