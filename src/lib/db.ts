import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "@/lib/db-url";

// Un seul client Prisma pour tout le processus : évite d'épuiser les
// connexions à la base quand Next.js recharge le code en développement.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const datasourceUrl = resolveDatabaseUrl();
  return new PrismaClient({
    // Si DATABASE_URL n'existe pas sous ce nom exact (intégration avec un
    // autre préfixe), on passe l'URL détectée explicitement.
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
