/**
 * Résolution robuste de l'URL de base de données.
 *
 * Idéalement DATABASE_URL est définie. Mais les intégrations (Neon sur
 * Vercel, etc.) créent parfois les variables sous un autre nom, selon le
 * préfixe choisi (MABASE_URL, POSTGRES_PRISMA_URL, …). Plutôt que
 * d'échouer, on balaie l'environnement à la recherche d'une URL
 * postgres:// ou postgresql:// et on prend la meilleure candidate.
 */

function postgresUrlCandidates(): [string, string][] {
  return Object.entries(process.env).filter(
    (entry): entry is [string, string] =>
      typeof entry[1] === "string" && /^postgres(ql)?:\/\//.test(entry[1])
  );
}

/** URL pour l'application (préfère la connexion poolée, ex. Neon "-pooler"). */
export function resolveDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const candidates = postgresUrlCandidates();
  if (candidates.length === 0) return undefined;
  const pooled =
    candidates.find(([key]) => key.endsWith("PRISMA_URL")) ??
    candidates.find(([, value]) => value.includes("-pooler"));
  return (pooled ?? candidates[0])[1];
}

/** URL directe (non poolée) pour les migrations Prisma. */
export function resolveDirectUrl(): string | undefined {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL;
  const candidates = postgresUrlCandidates();
  const direct =
    candidates.find(([key]) => key.endsWith("_UNPOOLED")) ??
    candidates.find(([key]) => key.endsWith("NON_POOLING")) ??
    candidates.find(([, value]) => !value.includes("-pooler"));
  if (direct) return direct[1];
  const fallback = resolveDatabaseUrl();
  return fallback ? fallback.replace("-pooler", "") : undefined;
}
