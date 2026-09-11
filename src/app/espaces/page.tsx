import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Espaces vendeurs",
  description:
    "Découvrez les boutiques des membres de la communauté Alliance Tchad-USA.",
};

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const stores = await db.store.findMany({
    include: {
      _count: { select: { products: { where: { active: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Espaces vendeurs</h1>
          <p className="mt-1 text-stone-600">
            Les boutiques créées par les membres de la communauté.
          </p>
        </div>
        <Link
          href="/tableau-de-bord"
          className="bg-accent-500 px-4 py-2.5 font-bold uppercase tracking-wide text-white transition hover:bg-accent-600"
        >
          + Créer mon espace
        </Link>
      </div>

      {stores.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-4xl">🏪</p>
          <p className="mt-3 font-semibold text-stone-800">
            Aucun espace vendeur pour le moment.
          </p>
          <p className="mt-1 text-stone-600">Soyez le premier à ouvrir le vôtre !</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/espaces/${store.slug}`}
              className="group rounded-xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-lg font-black text-white">
                {store.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-lg font-bold text-stone-900 group-hover:text-brand-700">
                {store.name}
              </h2>
              {(store.city || store.country) && (
                <p className="mt-0.5 text-sm text-stone-500">
                  📍 {[store.city, store.country].filter(Boolean).join(", ")}
                </p>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                {store.description}
              </p>
              <p className="mt-3 text-sm font-semibold text-brand-600">
                {store._count.products} produit{store._count.products > 1 ? "s" : ""} en vente
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
