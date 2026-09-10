/**
 * Script de build (utilisé par Vercel et en local) :
 *   prisma generate → prisma migrate deploy → next build
 *
 * Robustesse : DATABASE_URL et DIRECT_URL sont détectées automatiquement
 * parmi toutes les variables d'environnement contenant une URL PostgreSQL
 * (voir scripts/env-resolve.mjs), quel que soit le préfixe choisi par
 * l'intégration (Neon, Vercel Postgres, …).
 */
import { spawnSync } from "node:child_process";
import { ensureDatabaseEnv } from "./env-resolve.mjs";

const env = { ...process.env };

if (!ensureDatabaseEnv(env)) {
  console.error(
    "\n✗ Aucune URL PostgreSQL trouvée dans les variables d'environnement.\n" +
      "  Sur Vercel : Settings → Environment Variables, ajoutez DATABASE_URL\n" +
      "  (l'URL de connexion Neon), ou connectez la base via l'onglet Storage.\n" +
      "  Variables actuellement visibles commençant par des noms usuels :\n  " +
      Object.keys(env)
        .filter((k) => /(DATABASE|POSTGRES|NEON|PG)/i.test(k))
        .join(", ") +
      "\n"
  );
  process.exit(1);
}

const steps = [
  ["npx", ["prisma", "generate"]],
  ["npx", ["prisma", "migrate", "deploy"]],
  ["npx", ["next", "build"]],
];

for (const [cmd, args] of steps) {
  console.log(`\n▶ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", env, shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
