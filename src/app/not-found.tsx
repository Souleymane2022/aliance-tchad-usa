import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl">🔎</p>
      <h1 className="mt-4 text-3xl font-bold text-stone-900">Page introuvable</h1>
      <p className="mt-2 text-stone-600">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
