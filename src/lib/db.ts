import { PrismaClient } from "@prisma/client";

// Un seul client Prisma pour tout le processus : évite d'épuiser les
// connexions à la base quand Next.js recharge le code en développement.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
