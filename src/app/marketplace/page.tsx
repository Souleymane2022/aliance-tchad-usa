import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/validation";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Achetez et vendez au sein de la communauté tchadienne aux USA : alimentation, artisanat, mode, services et plus.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().slice(0, 100);
  const categorie = (CATEGORIES as readonly string[]).includes(
    params.categorie ?? ""
  )
    ? params.categorie
    : undefined;
  const pageNum = Math.max(1, Math.min(500, parseInt(params.page ?? "1", 10) || 1));

  const where = {
    active: true,
    ...(categorie ? { category: categorie } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { store: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.product.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildUrl = (page: number, cat?: string) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    const c = cat === undefined ? categorie : cat || undefined;
    if (c) sp.set("categorie", c);
    if (page > 1) sp.set("page", String(page));
    const s = sp.toString();
    return `/marketplace${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Marketplace</h1>
          <p className="mt-1 text-stone-600">
            {total} produit{total > 1 ? "s" : ""} proposé{total > 1 ? "s" : ""} par la communauté.
          </p>
        </div>
        <Link
          href="/tableau-de-bord"
          className="rounded-lg bg-accent-500 px-4 py-2.5 font-semibold text-brand-900 transition hover:bg-accent-600"
        >
          + Vendre mes produits
        </Link>
      </div>

      <form method="GET" action="/marketplace" className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un produit…"
          maxLength={100}
          className="min-w-0 flex-1 rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        {categorie && <input type="hidden" name="categorie" value={categorie} />}
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={buildUrl(1, "")}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            !categorie
              ? "bg-brand-600 text-white"
              : "bg-white text-stone-700 ring-1 ring-stone-300 hover:bg-brand-50"
          }`}
        >
          Tout
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={buildUrl(1, cat)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              categorie === cat
                ? "bg-brand-600 text-white"
                : "bg-white text-stone-700 ring-1 ring-stone-300 hover:bg-brand-50"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-4xl">🛒</p>
          <p className="mt-3 font-semibold text-stone-800">
            Aucun produit ne correspond à votre recherche.
          </p>
          <p className="mt-1 text-stone-600">
            Essayez d'autres mots-clés, ou soyez le premier à vendre ici !
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          {pageNum > 1 && (
            <Link
              href={buildUrl(pageNum - 1)}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium hover:bg-brand-50"
            >
              ← Précédent
            </Link>
          )}
          <span className="px-3 text-sm text-stone-600">
            Page {pageNum} sur {totalPages}
          </span>
          {pageNum < totalPages && (
            <Link
              href={buildUrl(pageNum + 1)}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium hover:bg-brand-50"
            >
              Suivant →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
