"use client";

import { useActionState } from "react";
import { loadDemoDataAction } from "@/actions/demo";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/FormMessage";

/** Bouton de chargement des données fictives (marketplace vide uniquement). */
export function LoadDemoButton() {
  const [result, formAction] = useActionState(loadDemoDataAction, null);

  return (
    <form action={formAction} className="mt-5 space-y-3">
      <FormMessage result={result} />
      <SubmitButton pendingText="Chargement des données…">
        ✨ Charger des données de démonstration
      </SubmitButton>
      <p className="text-xs text-stone-500">
        Ajoute 3 boutiques, 12 produits et 3 événements fictifs pour visualiser
        le site rempli. Possible uniquement tant que la marketplace est vide.
      </p>
    </form>
  );
}
