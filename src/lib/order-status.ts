export const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export const STATUS_STYLES: Record<string, string> = {
  EN_ATTENTE: "bg-amber-100 text-amber-800",
  CONFIRMEE: "bg-blue-100 text-blue-800",
  EXPEDIEE: "bg-violet-100 text-violet-800",
  LIVREE: "bg-green-100 text-green-800",
  ANNULEE: "bg-stone-200 text-stone-600",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusStyle(status: string): string {
  return STATUS_STYLES[status] ?? "bg-stone-100 text-stone-700";
}
