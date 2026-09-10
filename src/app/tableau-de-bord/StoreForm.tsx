"use client";

import { useActionState } from "react";
import { createStoreAction, updateStoreAction } from "@/actions/store";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage, FieldError } from "@/components/FormMessage";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

type StoreData = {
  name: string;
  description: string;
  phone: string | null;
  city: string | null;
  country: string;
};

export function StoreForm({ store }: { store: StoreData | null }) {
  const isEdit = store !== null;
  const [result, formAction] = useActionState(
    isEdit ? updateStoreAction : createStoreAction,
    null
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <FormMessage result={result} />

      <div>
        <label htmlFor="store-name" className="mb-1 block font-medium text-stone-800">
          Nom de l'espace
        </label>
        <input
          id="store-name"
          name="name"
          type="text"
          defaultValue={store?.name ?? ""}
          required
          maxLength={60}
          placeholder="Ex. : Saveurs du Tchad"
          className={inputClass}
        />
        <FieldError result={result} field="name" />
      </div>

      <div>
        <label htmlFor="store-description" className="mb-1 block font-medium text-stone-800">
          Description
        </label>
        <textarea
          id="store-description"
          name="description"
          rows={4}
          defaultValue={store?.description ?? ""}
          required
          maxLength={1000}
          placeholder="Présentez votre activité, vos produits, vos valeurs…"
          className={inputClass}
        />
        <FieldError result={result} field="description" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="store-phone" className="mb-1 block font-medium text-stone-800">
            Téléphone (optionnel)
          </label>
          <input
            id="store-phone"
            name="phone"
            type="tel"
            defaultValue={store?.phone ?? ""}
            maxLength={25}
            className={inputClass}
          />
          <FieldError result={result} field="phone" />
        </div>
        <div>
          <label htmlFor="store-city" className="mb-1 block font-medium text-stone-800">
            Ville (optionnel)
          </label>
          <input
            id="store-city"
            name="city"
            type="text"
            defaultValue={store?.city ?? ""}
            maxLength={60}
            className={inputClass}
          />
          <FieldError result={result} field="city" />
        </div>
        <div>
          <label htmlFor="store-country" className="mb-1 block font-medium text-stone-800">
            Pays
          </label>
          <input
            id="store-country"
            name="country"
            type="text"
            defaultValue={store?.country ?? "USA"}
            maxLength={60}
            className={inputClass}
          />
          <FieldError result={result} field="country" />
        </div>
      </div>

      <SubmitButton pendingText="Enregistrement…">
        {isEdit ? "Enregistrer les modifications" : "🏪 Créer mon espace vendeur"}
      </SubmitButton>
    </form>
  );
}
