"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage, FieldError } from "@/components/FormMessage";

export function RegisterForm() {
  const [result, formAction] = useActionState(registerAction, null);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <FormMessage result={result} />

      <div>
        <label htmlFor="name" className="mb-1 block font-medium text-stone-800">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <FieldError result={result} field="name" />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block font-medium text-stone-800">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <FieldError result={result} field="email" />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block font-medium text-stone-800">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-1 text-sm text-stone-500">8 caractères minimum.</p>
        <FieldError result={result} field="password" />
      </div>

      <SubmitButton className="w-full" pendingText="Création du compte…">
        Créer mon compte
      </SubmitButton>

      <p className="text-center text-sm text-stone-600">
        Déjà membre ?{" "}
        <Link href="/connexion" className="font-semibold text-brand-600 hover:underline">
          Connectez-vous
        </Link>
      </p>
    </form>
  );
}
