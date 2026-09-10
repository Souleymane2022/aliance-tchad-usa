import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Créer un compte" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/tableau-de-bord");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-stone-900">Créer un compte</h1>
      <p className="mt-2 text-stone-600">
        Rejoignez la communauté : achetez, vendez et participez aux événements.
      </p>
      <RegisterForm />
    </div>
  );
}
