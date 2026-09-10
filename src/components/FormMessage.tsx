import type { ActionResult } from "@/lib/validation";

/** Bandeau de succès ou d'erreur affiché au-dessus des formulaires. */
export function FormMessage({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  if (result.ok) {
    if (!result.message) return null;
    return (
      <p
        role="status"
        className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
      >
        ✓ {result.message}
      </p>
    );
  }
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
    >
      {result.error}
    </p>
  );
}

/** Message d'erreur sous un champ précis. */
export function FieldError({
  result,
  field,
}: {
  result: ActionResult | null;
  field: string;
}) {
  if (!result || result.ok) return null;
  const message = result.fieldErrors?.[field];
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-700">{message}</p>;
}
