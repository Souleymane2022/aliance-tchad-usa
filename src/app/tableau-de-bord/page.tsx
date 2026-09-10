import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/money";
import { statusLabel, statusStyle } from "@/lib/order-status";
import { deleteProductAction } from "@/actions/product";
import { updateOrderStatusAction } from "@/actions/order";
import { StoreForm } from "./StoreForm";
import { ProductForm } from "./ProductForm";

export const metadata: Metadata = { title: "Mon espace" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const store = await db.store.findUnique({
    where: { ownerId: user.id },
    include: {
      products: { orderBy: { createdAt: "desc" } },
    },
  });

  // Commandes contenant au moins un produit de cet espace.
  const receivedOrders = store
    ? await db.order.findMany({
        where: {
          items: { some: { product: { storeId: store.id } } },
        },
        include: {
          items: {
            where: { product: { storeId: store.id } },
            select: {
              id: true,
              productName: true,
              unitPriceCents: true,
              quantity: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">
        Bonjour, {user.name} 👋
      </h1>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link
          href="/mes-commandes"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium hover:bg-brand-50"
        >
          📦 Mes achats
        </Link>
        {store && (
          <Link
            href={`/espaces/${store.slug}`}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium hover:bg-brand-50"
          >
            👁️ Voir ma boutique publique
          </Link>
        )}
      </div>

      {!store ? (
        <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-stone-900">
            🏪 Créez votre espace vendeur
          </h2>
          <p className="mt-2 text-stone-600">
            Ouvrez votre boutique en quelques secondes et proposez vos produits
            à toute la communauté. C'est gratuit.
          </p>
          <div className="mt-6">
            <StoreForm store={null} />
          </div>
        </section>
      ) : (
        <>
          <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">
              Mon espace : {store.name}
            </h2>
            <div className="mt-4">
              <StoreForm
                store={{
                  name: store.name,
                  description: store.description,
                  phone: store.phone,
                  city: store.city,
                  country: store.country,
                }}
              />
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">
              Mes produits ({store.products.length})
            </h2>
            {store.products.length === 0 ? (
              <p className="mt-3 text-stone-600">
                Aucun produit pour l'instant : ajoutez-en un ci-dessous !
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-stone-200">
                {store.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900">
                        {product.name}
                        {!product.active && (
                          <span className="ml-2 rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
                            Masqué
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-stone-500">
                        {formatPrice(product.priceCents)} — Stock : {product.stock}
                        {product.stock === 0 && (
                          <span className="ml-1 font-semibold text-danger-600">
                            (rupture)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tableau-de-bord/produits/${product.id}`}
                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-brand-50"
                      >
                        Modifier
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-danger-500 px-3 py-1.5 text-sm font-medium text-danger-600 hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 border-t border-stone-200 pt-6">
              <h3 className="text-lg font-bold text-stone-900">
                + Ajouter un produit
              </h3>
              <div className="mt-4">
                <ProductForm product={null} />
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">
              Commandes reçues ({receivedOrders.length})
            </h2>
            {receivedOrders.length === 0 ? (
              <p className="mt-3 text-stone-600">
                Aucune commande pour le moment. Elles apparaîtront ici dès qu'un
                membre achètera vos produits.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {receivedOrders.map((order) => {
                  const myTotal = order.items.reduce(
                    (s, it) => s + it.unitPriceCents * it.quantity,
                    0
                  );
                  const editable =
                    order.status !== "LIVREE" && order.status !== "ANNULEE";
                  return (
                    <li
                      key={order.id}
                      className="rounded-xl border border-stone-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-mono text-sm text-stone-500">
                          {order.reference}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(order.status)}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      <ul className="mt-2 text-sm text-stone-700">
                        {order.items.map((it) => (
                          <li key={it.id}>
                            {it.productName} × {it.quantity} —{" "}
                            {formatPrice(it.unitPriceCents * it.quantity)}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1 text-sm font-semibold text-brand-700">
                        Total (vos produits) : {formatPrice(myTotal)}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Livraison : {order.shippingName}, {order.shippingAddress},{" "}
                        {order.shippingCity} — 📞 {order.shippingPhone}
                      </p>
                      {order.note && (
                        <p className="mt-1 text-sm text-stone-500">
                          Note : {order.note}
                        </p>
                      )}
                      {editable && (
                        <form
                          action={updateOrderStatusAction}
                          className="mt-3 flex flex-wrap items-center gap-2"
                        >
                          <input type="hidden" name="orderId" value={order.id} />
                          <label
                            htmlFor={`status-${order.id}`}
                            className="text-sm font-medium text-stone-700"
                          >
                            Changer le statut :
                          </label>
                          <select
                            id={`status-${order.id}`}
                            name="status"
                            defaultValue={order.status}
                            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                          >
                            <option value="EN_ATTENTE">En attente</option>
                            <option value="CONFIRMEE">Confirmée</option>
                            <option value="EXPEDIEE">Expédiée</option>
                            <option value="LIVREE">Livrée</option>
                          </select>
                          <button
                            type="submit"
                            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
                          >
                            Mettre à jour
                          </button>
                        </form>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
