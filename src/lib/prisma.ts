import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Cache in every environment, not just development: on serverless each function
// instance would otherwise build its own client and connection pool against the
// shared pooler.
global.prisma = prisma;

export { prisma };
export default prisma;
