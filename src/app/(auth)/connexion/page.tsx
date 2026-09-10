import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/tableau-de-bord");

  const params = await searchParams;
  const redirectTo =
    params.redirectTo?.startsWith("/") && !params.redirectTo.startsWith("//")
      ? params.redirectTo
      : "/tableau-de-bord";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-stone-900">Connexion</h1>
      <p className="mt-2 text-stone-600">
        Heureux de vous revoir dans la communauté !
      </p>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
