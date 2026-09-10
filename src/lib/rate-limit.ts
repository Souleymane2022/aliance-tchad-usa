import "server-only";

/**
 * Limiteur de débit en mémoire (fenêtre glissante simplifiée).
 * Protège les actions sensibles (connexion, inscription, commande) contre
 * les abus et la force brute. En cas de déploiement multi-instances,
 * remplacez-le par un stockage partagé (Redis/Upstash) — l'interface
 * `checkRateLimit` reste identique.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

function prune(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; retryAfterS: number } {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterS: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterS: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfterS: 0 };
}
