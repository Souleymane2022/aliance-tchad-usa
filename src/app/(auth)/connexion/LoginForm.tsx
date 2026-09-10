"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage, FieldError } from "@/components/FormMessage";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [result, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <FormMessage result={result} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

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
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <FieldError result={result} field="password" />
      </div>

      <SubmitButton className="w-full" pendingText="Connexion…">
        Se connecter
      </SubmitButton>

      <p className="text-center text-sm text-stone-600">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-brand-600 hover:underline">
          Créez-en un gratuitement
        </Link>
      </p>
    </form>
  );
}
