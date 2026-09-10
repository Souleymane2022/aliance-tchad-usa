import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/money";
import { statusLabel, statusStyle } from "@/lib/order-status";

export const metadata: Metadata = { title: "Mes commandes" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/mes-commandes");

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: { select: { quantity: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-4xl">📦</p>
          <p className="mt-3 font-semibold text-stone-800">
            Vous n'avez pas encore passé de commande.
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            Découvrir la marketplace
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => {
            const itemCount = order.items.reduce((s, it) => s + it.quantity, 0);
            return (
              <li key={order.id}>
                <Link
                  href={`/mes-commandes/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-5 transition hover:shadow-md"
                >
                  <div>
                    <p className="font-mono text-sm text-stone-500">
                      {order.reference}
                    </p>
                    <p className="mt-1 font-semibold text-stone-900">
                      {itemCount} article{itemCount > 1 ? "s" : ""} —{" "}
                      {formatPrice(order.totalCents, order.currency)}
                    </p>
                    <p className="text-sm text-stone-500">
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
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
