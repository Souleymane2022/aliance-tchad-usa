import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/money";
import { statusLabel, statusStyle } from "@/lib/order-status";
import { cancelOrderAction } from "@/actions/order";

export const metadata: Metadata = { title: "Détail de la commande" };
export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nouvelle?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/mes-commandes");

  const { id } = await params;
  const { nouvelle } = await searchParams;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
  // Seul l'acheteur (ou un admin) peut voir cette commande.
  if (!order || (order.userId !== user.id && user.role !== "ADMIN")) notFound();

  const cancellable =
    order.userId === user.id &&
    (order.status === "EN_ATTENTE" || order.status === "CONFIRMEE");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {nouvelle === "1" && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-900">
          <p className="text-lg font-bold">🎉 Commande confirmée !</p>
          <p className="mt-1 text-sm">
            Le stock a été réservé. Les vendeurs vous contacteront au numéro
            indiqué pour organiser la livraison et le paiement.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Commande <span className="font-mono">{order.reference}</span>
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Passée le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(order.createdAt)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyle(order.status)}`}
        >
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white">
        <ul className="divide-y divide-stone-200">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-stone-900">{item.productName}</p>
                <p className="text-sm text-stone-500">
                  {item.storeName} — {formatPrice(item.unitPriceCents, order.currency)} × {item.quantity}
                </p>
              </div>
              <p className="whitespace-nowrap font-bold text-brand-700">
                {formatPrice(item.unitPriceCents * item.quantity, order.currency)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-stone-200 p-4 text-lg font-bold">
          <span>Total</span>
          <span className="text-brand-700">
            {formatPrice(order.totalCents, order.currency)}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="font-bold text-stone-900">Livraison</h2>
        <dl className="mt-3 space-y-1 text-sm text-stone-700">
          <div className="flex gap-2"><dt className="font-medium">Destinataire :</dt><dd>{order.shippingName}</dd></div>
          <div className="flex gap-2"><dt className="font-medium">Téléphone :</dt><dd>{order.shippingPhone}</dd></div>
          <div className="flex gap-2"><dt className="font-medium">Adresse :</dt><dd>{order.shippingAddress}, {order.shippingCity}</dd></div>
          {order.note && (
            <div className="flex gap-2"><dt className="font-medium">Note :</dt><dd>{order.note}</dd></div>
          )}
        </dl>
      </div>

      {cancellable && (
        <form action={cancelOrderAction} className="mt-6">
          <input type="hidden" name="orderId" value={order.id} />
          <button
            type="submit"
            className="rounded-lg border border-danger-500 px-5 py-2.5 font-semibold text-danger-600 transition hover:bg-red-50"
          >
            Annuler la commande
          </button>
          <p className="mt-2 text-xs text-stone-500">
            Le stock sera automatiquement remis en vente.
          </p>
        </form>
      )}
    </div>
  );
}
