"use client";

import { useActionState } from "react";
import { createProductAction, updateProductAction } from "@/actions/product";
import { CATEGORIES } from "@/lib/validation";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage, FieldError } from "@/components/FormMessage";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export type ProductFormData = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  stock: number;
  imageUrl: string | null;
  active: boolean;
};

export function ProductForm({ product }: { product: ProductFormData | null }) {
  const isEdit = product !== null;
  const [result, formAction] = useActionState(
    isEdit ? updateProductAction : createProductAction,
    null
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <FormMessage result={result} />
      {isEdit && <input type="hidden" name="productId" value={product.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="p-name" className="mb-1 block font-medium text-stone-800">
            Nom du produit
          </label>
          <input
            id="p-name"
            name="name"
            type="text"
            defaultValue={product?.name ?? ""}
            required
            maxLength={100}
            className={inputClass}
          />
          <FieldError result={result} field="name" />
        </div>
        <div>
          <label htmlFor="p-category" className="mb-1 block font-medium text-stone-800">
            Catégorie
          </label>
          <select
            id="p-category"
            name="category"
            defaultValue={product?.category ?? "Autre"}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <FieldError result={result} field="category" />
        </div>
      </div>

      <div>
        <label htmlFor="p-description" className="mb-1 block font-medium text-stone-800">
          Description
        </label>
        <textarea
          id="p-description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          required
          maxLength={2000}
          className={inputClass}
        />
        <FieldError result={result} field="description" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="p-price" className="mb-1 block font-medium text-stone-800">
            Prix en USD (ex. : 12.50)
          </label>
          <input
            id="p-price"
            name="price"
            type="text"
            inputMode="decimal"
            defaultValue={
              product ? (product.priceCents / 100).toFixed(2) : ""
            }
            required
            className={inputClass}
          />
          <FieldError result={result} field="price" />
        </div>
        <div>
          <label htmlFor="p-stock" className="mb-1 block font-medium text-stone-800">
            Quantité en stock
          </label>
          <input
            id="p-stock"
            name="stock"
            type="number"
            min={0}
            max={1000000}
            defaultValue={product?.stock ?? 1}
            required
            className={inputClass}
          />
          <FieldError result={result} field="stock" />
        </div>
      </div>

      <div>
        <label htmlFor="p-image" className="mb-1 block font-medium text-stone-800">
          URL de la photo (optionnel, https://…)
        </label>
        <input
          id="p-image"
          name="imageUrl"
          type="url"
          defaultValue={product?.imageUrl ?? ""}
          placeholder="https://exemple.com/photo.jpg"
          maxLength={2048}
          className={inputClass}
        />
        <FieldError result={result} field="imageUrl" />
      </div>

      {isEdit && (
        <label className="flex items-center gap-2 font-medium text-stone-800">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product.active}
            className="h-4 w-4 rounded border-stone-300"
          />
          Produit visible sur la marketplace
        </label>
      )}

      <SubmitButton pendingText="Enregistrement…">
        {isEdit ? "Enregistrer les modifications" : "+ Ajouter le produit"}
      </SubmitButton>
    </form>
  );
}
