import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await db.store.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!store) return { title: "Espace introuvable" };
  return { title: store.name, description: store.description.slice(0, 160) };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await db.store.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        orderBy: { createdAt: "desc" },
        take: 60,
      },
    },
  });
  if (!store) notFound();

  return (
    <div>
      <div className="bg-gradient-to-br from-brand-800 to-brand-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-double border-accent-500 bg-brand-900 text-2xl font-black text-white">
              {store.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{store.name}</h1>
              {(store.city || store.country) && (
                <p className="mt-1 text-stone-300">
                  📍 {[store.city, store.country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
          <p className="mt-5 max-w-3xl leading-relaxed text-stone-200">
            {store.description}
          </p>
          {store.phone && (
            <p className="mt-3 text-sm text-stone-300">📞 {store.phone}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold text-stone-900">
          Produits ({store.products.length})
        </h2>
        {store.products.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">
            Cet espace n'a pas encore de produits en vente.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {store.products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, store: { name: store.name, slug: store.slug } }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
