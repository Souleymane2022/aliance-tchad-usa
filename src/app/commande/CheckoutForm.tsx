"use client";

import { useActionState } from "react";
import { checkoutAction } from "@/actions/order";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage, FieldError } from "@/components/FormMessage";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export function CheckoutForm({ defaultName }: { defaultName: string }) {
  const [result, formAction] = useActionState(checkoutAction, null);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <FormMessage result={result} />

      <div>
        <label htmlFor="shippingName" className="mb-1 block font-medium text-stone-800">
          Nom du destinataire
        </label>
        <input
          id="shippingName"
          name="shippingName"
          type="text"
          defaultValue={defaultName}
          required
          maxLength={80}
          className={inputClass}
        />
        <FieldError result={result} field="shippingName" />
      </div>

      <div>
        <label htmlFor="shippingPhone" className="mb-1 block font-medium text-stone-800">
          Téléphone (pour être contacté par le vendeur)
        </label>
        <input
          id="shippingPhone"
          name="shippingPhone"
          type="tel"
          placeholder="+1 555 123 4567"
          required
          maxLength={25}
          className={inputClass}
        />
        <FieldError result={result} field="shippingPhone" />
      </div>

      <div>
        <label htmlFor="shippingAddress" className="mb-1 block font-medium text-stone-800">
          Adresse de livraison
        </label>
        <input
          id="shippingAddress"
          name="shippingAddress"
          type="text"
          placeholder="Numéro, rue, appartement…"
          required
          maxLength={200}
          className={inputClass}
        />
        <FieldError result={result} field="shippingAddress" />
      </div>

      <div>
        <label htmlFor="shippingCity" className="mb-1 block font-medium text-stone-800">
          Ville
        </label>
        <input
          id="shippingCity"
          name="shippingCity"
          type="text"
          required
          maxLength={60}
          className={inputClass}
        />
        <FieldError result={result} field="shippingCity" />
      </div>

      <div>
        <label htmlFor="note" className="mb-1 block font-medium text-stone-800">
          Note pour le vendeur (optionnel)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={500}
          className={inputClass}
        />
        <FieldError result={result} field="note" />
      </div>

      <SubmitButton className="w-full" pendingText="Commande en cours…">
        Confirmer ma commande
      </SubmitButton>
      <p className="text-center text-xs text-stone-500">
        Le stock est réservé instantanément à la confirmation. Vous pourrez
        annuler tant que la commande n'est pas expédiée.
      </p>
    </form>
  );
}
