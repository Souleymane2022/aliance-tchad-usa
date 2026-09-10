/**
 * Détection tolérante des URLs PostgreSQL dans l'environnement.
 * Partagé par scripts/build.mjs et prisma.config.ts : quel que soit le nom
 * choisi par une intégration (DATABASE_URL, MONPREFIXE_URL,
 * POSTGRES_PRISMA_URL, …), on retrouve la base.
 * Renseigne process.env.DATABASE_URL et process.env.DIRECT_URL si absents.
 */
export function ensureDatabaseEnv(env = process.env) {
  const candidates = Object.entries(env).filter(
    ([, value]) => typeof value === "string" && /^postgres(ql)?:\/\//.test(value)
  );

  if (!env.DATABASE_URL && candidates.length > 0) {
    const pooled =
      candidates.find(([key]) => key.endsWith("PRISMA_URL")) ??
      candidates.find(([, value]) => value.includes("-pooler")) ??
      candidates[0];
    env.DATABASE_URL = pooled[1];
    console.log(`ℹ DATABASE_URL absente : utilisation de ${pooled[0]}.`);
  }

  if (!env.DIRECT_URL && env.DATABASE_URL) {
    const direct =
      candidates.find(([key]) => key.endsWith("_UNPOOLED")) ??
      candidates.find(([key]) => key.endsWith("NON_POOLING")) ??
      candidates.find(([, value]) => !value.includes("-pooler"));
    env.DIRECT_URL = direct ? direct[1] : env.DATABASE_URL.replace("-pooler", "");
    if (direct) console.log(`ℹ DIRECT_URL absente : utilisation de ${direct[0]}.`);
  }

  return Boolean(env.DATABASE_URL);
}
