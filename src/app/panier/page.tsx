import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/money";
import { ProductImage } from "@/components/ProductImage";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/actions/cart";

export const metadata: Metadata = { title: "Mon panier" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/panier");

  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: {
      product: { include: { store: { select: { name: true, slug: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  const problems: string[] = [];
  let totalCents = 0;
  for (const item of items) {
    if (!item.product.active) {
      problems.push(`« ${item.product.name} » n'est plus en vente.`);
    } else if (item.product.stock < item.quantity) {
      problems.push(
        `« ${item.product.name} » : seulement ${item.product.stock} en stock (vous en avez ${item.quantity}).`
      );
    }
    totalCents += item.product.priceCents * item.quantity;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Mon panier</h1>

      {items.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-4xl">🛒</p>
          <p className="mt-3 font-semibold text-stone-800">Votre panier est vide.</p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            Découvrir la marketplace
          </Link>
        </div>
      ) : (
        <>
          {problems.length > 0 && (
            <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">À vérifier avant de commander :</p>
              <ul className="mt-1 list-inside list-disc">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          <ul className="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4 sm:p-5">
                <Link
                  href={`/marketplace/produit/${item.productId}`}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200"
                >
                  <ProductImage
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/marketplace/produit/${item.productId}`}
                        className="line-clamp-1 font-semibold text-stone-900 hover:text-brand-700"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-stone-500">
                        {item.product.store.name}
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-bold text-brand-700">
                      {formatPrice(
                        item.product.priceCents * item.quantity,
                        item.product.currency
                      )}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    <form
                      action={updateCartItemAction}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="itemId" value={item.id} />
                      <label htmlFor={`qty-${item.id}`} className="text-sm text-stone-600">
                        Qté
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        name="quantity"
                        min={1}
                        max={999}
                        defaultValue={item.quantity}
                        className="w-20 rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-stone-100"
                      >
                        Mettre à jour
                      </button>
                    </form>
                    <form action={removeCartItemAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <button
                        type="submit"
                        className="text-sm font-medium text-danger-600 hover:underline"
                      >
                        Retirer
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-lg">
              Total :{" "}
              <span className="text-2xl font-bold text-brand-700">
                {formatPrice(totalCents)}
              </span>
            </p>
            <Link
              href="/commande"
              className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
            >
              Passer la commande →
            </Link>
          </div>
          <p className="mt-3 text-sm text-stone-500">
            Les prix et le stock sont revérifiés au moment de la commande : aucune
            mauvaise surprise.
          </p>
        </>
      )}
    </div>
  );
}
