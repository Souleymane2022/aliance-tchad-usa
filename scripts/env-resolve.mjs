/**
 * Détection tolérante des URLs PostgreSQL dans l'environnement.
 * Partagé par scripts/build.mjs et prisma.config.ts : quel que soit le nom
 * choisi par une intégration (DATABASE_URL, MONPREFIXE_URL,
 * POSTGRES_PRISMA_URL, …), on retrouve la base.
 * Renseigne process.env.DATABASE_URL et process.env.DIRECT_URL si absents.
 *
 * Sécurité : DIRECT_URL n'est dérivée que de la MÊME famille de variables
 * que l'URL retenue (même préfixe), jamais d'une autre variable qui
 * pourrait pointer vers la base d'une autre application.
 */
function isPostgresUrl(value) {
  return typeof value === "string" && /^postgres(ql)?:\/\//.test(value);
}

export function ensureDatabaseEnv(env = process.env) {
  const candidates = Object.entries(env).filter(([, value]) =>
    isPostgresUrl(value)
  );

  let chosenKey = null;
  if (env.DATABASE_URL) {
    chosenKey = "DATABASE_URL";
  } else if (candidates.length > 0) {
    const pooled =
      candidates.find(([key]) => key.endsWith("PRISMA_URL")) ??
      candidates.find(([, value]) => value.includes("-pooler")) ??
      candidates[0];
    env.DATABASE_URL = pooled[1];
    chosenKey = pooled[0];
    console.log(`ℹ DATABASE_URL absente : utilisation de ${pooled[0]}.`);
  }

  if (!env.DIRECT_URL && env.DATABASE_URL && chosenKey) {
    const sameFamilyKeys = [
      `${chosenKey}_UNPOOLED`,
      chosenKey.replace(/_URL$/, "_URL_NON_POOLING"),
      chosenKey.replace(/_PRISMA_URL$/, "_URL_NON_POOLING"),
    ];
    const familyKey = sameFamilyKeys.find((key) => isPostgresUrl(env[key]));
    if (familyKey) {
      env.DIRECT_URL = env[familyKey];
      console.log(`ℹ DIRECT_URL absente : utilisation de ${familyKey}.`);
    } else {
      env.DIRECT_URL = env.DATABASE_URL.replace("-pooler", "");
    }
  }

  return Boolean(env.DATABASE_URL);
}
