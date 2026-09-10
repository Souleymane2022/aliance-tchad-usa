import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { ProductImage } from "@/components/ProductImage";

export type ProductCardData = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  category: string;
  stock: number;
  store: { name: string; slug: string };
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.stock === 0;
  return (
    <article className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/marketplace/produit/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full transition duration-300 group-hover:scale-105"
          />
          {outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-danger-500 px-2.5 py-1 text-xs font-bold text-white">
              Rupture de stock
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-stone-900">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-stone-500">par {product.store.name}</p>
          <p className="mt-2 text-lg font-bold text-brand-700">
            {formatPrice(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
