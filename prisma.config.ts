import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";
import { ensureDatabaseEnv } from "./scripts/env-resolve.mjs";

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

// Filet de sécurité : DATABASE_URL / DIRECT_URL détectées parmi toutes les
// variables contenant une URL PostgreSQL, quel que soit leur nom.
ensureDatabaseEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
