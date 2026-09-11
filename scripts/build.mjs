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
import fs from "node:fs";
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

function run(cmd, args) {
  console.log(`\n▶ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    stdio: ["inherit", "pipe", "pipe"],
    env,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result;
}

function runOrExit(cmd, args) {
  const result = run(cmd, args);
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result;
}

runOrExit("npx", ["prisma", "generate"]);

const migrate = run("npx", ["prisma", "migrate", "deploy"]);
if (migrate.status !== 0) {
  const output = `${migrate.stdout ?? ""}${migrate.stderr ?? ""}`;
  if (output.includes("P3005")) {
    // La base contient déjà des tables (ex. table d'exemple créée par Neon)
    // mais pas d'historique de migrations. On synchronise le schéma
    // directement (non destructif), puis on enregistre les migrations comme
    // appliquées pour que les prochains déploiements reprennent le circuit
    // normal.
    console.log(
      "\nℹ Base non vide sans historique de migrations : synchronisation " +
        "directe du schéma (prisma db push), puis baseline des migrations."
    );
    const push = run("npx", ["prisma", "db", "push", "--skip-generate"]);
    if (push.status !== 0) {
      const pushOutput = `${push.stdout ?? ""}${push.stderr ?? ""}`;
      if (/data loss|about to drop/i.test(pushOutput)) {
        console.error(
          "\n⛔ ARRÊT DE SÉCURITÉ : la base connectée contient déjà les données\n" +
            "   d'une AUTRE application (tables avec des lignes existantes).\n" +
            "   Rien n'a été modifié ni supprimé.\n\n" +
            "   ➜ Ce site doit utiliser sa PROPRE base, vide et dédiée :\n" +
            "     1. Vercel → onglet Storage → Create Database → Neon\n" +
            "        (nommez-la par ex. alliance-db)\n" +
            "     2. Connectez-la à ce projet avec le préfixe DATABASE\n" +
            "     3. Relancez le déploiement.\n" +
            "   (Le site utilisera DATABASE_URL en priorité ; l'autre base\n" +
            "   ne sera plus jamais touchée.)\n"
        );
      }
      process.exit(push.status ?? 1);
    }
    let migrationNames = [];
    try {
      migrationNames = fs
        .readdirSync("prisma/migrations", { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch {
      // Pas de dossier de migrations : rien à baseliner.
    }
    for (const name of migrationNames) {
      // Best effort : un échec ici n'empêche pas le site de fonctionner.
      run("npx", ["prisma", "migrate", "resolve", "--applied", name]);
    }
  } else {
    process.exit(migrate.status ?? 1);
  }
}

runOrExit("npx", ["next", "build"]);
