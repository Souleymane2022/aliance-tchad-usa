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

function chooseDatabaseEntry(): [string, string] | undefined {
  if (process.env.DATABASE_URL) return ["DATABASE_URL", process.env.DATABASE_URL];
  const candidates = postgresUrlCandidates();
  if (candidates.length === 0) return undefined;
  return (
    candidates.find(([key]) => key.endsWith("PRISMA_URL")) ??
    candidates.find(([, value]) => value.includes("-pooler")) ??
    candidates[0]
  );
}

/** URL pour l'application (préfère la connexion poolée, ex. Neon "-pooler"). */
export function resolveDatabaseUrl(): string | undefined {
  return chooseDatabaseEntry()?.[1];
}

/**
 * URL directe (non poolée) pour les migrations Prisma.
 * Dérivée uniquement de la MÊME famille de variables que l'URL retenue :
 * jamais d'une variable pointant potentiellement vers une autre base.
 */
export function resolveDirectUrl(): string | undefined {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL;
  const chosen = chooseDatabaseEntry();
  if (!chosen) return undefined;
  const [key, value] = chosen;
  const sameFamilyKeys = [
    `${key}_UNPOOLED`,
    key.replace(/_URL$/, "_URL_NON_POOLING"),
    key.replace(/_PRISMA_URL$/, "_URL_NON_POOLING"),
  ];
  for (const familyKey of sameFamilyKeys) {
    if (familyKey === key) continue;
    const familyValue = process.env[familyKey];
    if (
      familyValue &&
      /^postgres(ql)?:\/\//.test(familyValue) &&
      sameDatabaseName(familyValue, value)
    ) {
      return familyValue;
    }
  }
  return value.replace("-pooler", "");
}

/** Vraie seulement si les deux URLs désignent la même base (même chemin). */
function sameDatabaseName(a: string, b: string): boolean {
  try {
    return new URL(a).pathname === new URL(b).pathname;
  } catch {
    return false;
  }
}
