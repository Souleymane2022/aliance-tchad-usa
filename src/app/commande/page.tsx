import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/money";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Passer la commande" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/commande");

  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: { include: { store: { select: { name: true } } } } },
    orderBy: { createdAt: "asc" },
  });
  if (items.length === 0) redirect("/panier");

  const totalCents = items.reduce(
    (sum, it) => sum + it.product.priceCents * it.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Finaliser la commande</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm defaultName={user.name} />
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="font-bold text-stone-900">Récapitulatif</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between gap-3">
                  <span className="text-stone-700">
                    {it.product.name} × {it.quantity}
                  </span>
                  <span className="whitespace-nowrap font-medium">
                    {formatPrice(it.product.priceCents * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-stone-200 pt-3 font-bold">
              <span>Total</span>
              <span className="text-brand-700">{formatPrice(totalCents)}</span>
            </div>
            <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs leading-relaxed text-brand-800">
              💡 Paiement à la livraison ou selon l'accord passé directement avec
              chaque vendeur. Le vendeur vous contactera au numéro indiqué.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
