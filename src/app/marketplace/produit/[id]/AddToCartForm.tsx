"use client";

import { useActionState } from "react";
import { addToCartAction } from "@/actions/cart";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/FormMessage";

export function AddToCartForm({
  productId,
  maxQuantity,
}: {
  productId: string;
  maxQuantity: number;
}) {
  const [result, formAction] = useActionState(addToCartAction, null);

  if (maxQuantity === 0) {
    return (
      <p className="mt-6 rounded-lg bg-stone-100 px-4 py-3 text-stone-600">
        Ce produit est momentanément indisponible.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-3">
      <FormMessage result={result} />
      <input type="hidden" name="productId" value={productId} />
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="font-medium text-stone-800">
          Quantité
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={Math.min(maxQuantity, 999)}
          defaultValue={1}
          className="w-24 rounded-lg border border-stone-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <SubmitButton pendingText="Ajout…" className="flex-1 sm:flex-none">
          🛒 Ajouter au panier
        </SubmitButton>
      </div>
    </form>
  );
}
