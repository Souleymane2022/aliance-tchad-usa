import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { ProductForm } from "../../ProductForm";

export const metadata: Metadata = { title: "Modifier le produit" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { store: { select: { ownerId: true } } },
  });
  // Un vendeur ne peut modifier que ses propres produits.
  if (!product || product.store.ownerId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/tableau-de-bord"
        className="text-sm font-medium text-brand-600 hover:underline"
      >
        ← Retour à mon espace
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-stone-900">
        Modifier : {product.name}
      </h1>
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <ProductForm
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            priceCents: product.priceCents,
            category: product.category,
            stock: product.stock,
            imageUrl: product.imageUrl,
            active: product.active,
          }}
        />
      </div>
    </div>
  );
}
