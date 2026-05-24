const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const total = await p.ayah.count();
  const samples = await p.ayah.findMany({
    where: { ayahKey: { in: ["1:1", "1:7", "2:1", "6:1", "114:6"] } },
    select: { id: true, ayahKey: true, surahId: true, ayahNumber: true },
    orderBy: { id: "asc" },
  });
  console.log("total:", total);
  console.log(JSON.stringify(samples, null, 2));
  await p.$disconnect();
})();
