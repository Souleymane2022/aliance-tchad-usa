/**
 * Script de build (utilisé par Vercel et en local) :
 *   prisma generate → prisma migrate deploy → next build
 *
 * Robustesse : si DIRECT_URL n'est pas définie, on la déduit automatiquement.
 * L'intégration Neon de Vercel crée DATABASE_URL_UNPOOLED / POSTGRES_URL_NON_POOLING ;
 * à défaut, on retire le suffixe "-pooler" de DATABASE_URL ; en dernier recours,
 * on utilise DATABASE_URL telle quelle. Le déploiement ne casse donc jamais
 * pour une simple variable manquante.
 */
import { spawnSync } from "node:child_process";

const env = { ...process.env };

if (!env.DATABASE_URL) {
  // Autres noms possibles selon l'intégration utilisée sur Vercel.
  env.DATABASE_URL =
    env.POSTGRES_PRISMA_URL || env.POSTGRES_URL || env.DATABASE_URL_UNPOOLED || "";
}
if (!env.DATABASE_URL) {
  console.error(
    "\n✗ DATABASE_URL est manquante.\n" +
      "  Ajoutez-la dans Vercel → Settings → Environment Variables\n" +
      "  (l'URL Neon « pooled », celle qui contient -pooler).\n"
  );
  process.exit(1);
}

if (!env.DIRECT_URL) {
  env.DIRECT_URL =
    env.DATABASE_URL_UNPOOLED ||
    env.POSTGRES_URL_NON_POOLING ||
    env.DATABASE_URL.replace("-pooler", "");
  console.log(
    "ℹ DIRECT_URL non définie : utilisation automatique de " +
      (env.DATABASE_URL_UNPOOLED
        ? "DATABASE_URL_UNPOOLED"
        : env.POSTGRES_URL_NON_POOLING
          ? "POSTGRES_URL_NON_POOLING"
          : "DATABASE_URL (sans -pooler)") +
      " pour les migrations."
  );
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
