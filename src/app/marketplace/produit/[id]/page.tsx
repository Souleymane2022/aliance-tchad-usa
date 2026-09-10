import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartForm } from "./AddToCartForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    select: { name: true, description: true },
  });
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { store: { select: { name: true, slug: true, city: true, country: true } } },
  });
  if (!product || !product.active) notFound();

  const related = await db.product.findMany({
    where: {
      active: true,
      category: product.category,
      id: { not: product.id },
    },
    include: { store: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-stone-500" aria-label="Fil d'Ariane">
        <Link href="/marketplace" className="hover:text-brand-600">Marketplace</Link>
        {" / "}
        <Link
          href={`/marketplace?categorie=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-600"
        >
          {product.category}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full"
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">{product.name}</h1>
          <p className="mt-2 text-stone-600">
            Vendu par{" "}
            <Link
              href={`/espaces/${product.store.slug}`}
              className="font-semibold text-brand-600 hover:underline"
            >
              {product.store.name}
            </Link>
            {product.store.city ? ` — ${product.store.city}, ${product.store.country}` : ""}
          </p>

          <p className="mt-6 text-4xl font-bold text-brand-700">
            {formatPrice(product.priceCents, product.currency)}
          </p>

          <p className="mt-2 text-sm font-medium">
            {product.stock > 0 ? (
              <span className="text-green-700">
                ✓ En stock ({product.stock} disponible{product.stock > 1 ? "s" : ""})
              </span>
            ) : (
              <span className="text-danger-600">✗ Rupture de stock</span>
            )}
          </p>

          <AddToCartForm productId={product.id} maxQuantity={product.stock} />

          <div className="mt-8 border-t border-stone-200 pt-6">
            <h2 className="font-semibold text-stone-900">Description</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-stone-700">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-900">
            Dans la même catégorie
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
