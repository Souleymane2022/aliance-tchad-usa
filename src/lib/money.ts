/**
 * Tous les prix sont stockés en cents (entiers) : jamais de flottants
 * pour l'argent. Ces helpers convertissent pour l'affichage et la saisie.
 */
export function formatPrice(cents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** Convertit une saisie utilisateur ("12.50", "12,50") en cents, ou null si invalide. */
export function parsePriceToCents(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(parseFloat(normalized) * 100);
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > 100_000_000) {
    return null;
  }
  return cents;
}
