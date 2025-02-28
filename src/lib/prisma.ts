import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in environment variables");
  throw new Error("DATABASE_URL environment variable is required");
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
