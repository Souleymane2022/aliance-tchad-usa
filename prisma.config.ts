import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Avec un fichier prisma.config.ts, la CLI Prisma ne charge plus .env
// automatiquement : on le fait ici, sans dépendance externe.
// Les variables déjà présentes dans l'environnement restent prioritaires.
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

// Filet de sécurité (même logique que scripts/build.mjs) : si DIRECT_URL
// manque, on la déduit pour que les migrations ne cassent jamais.
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL.replace("-pooler", "");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
