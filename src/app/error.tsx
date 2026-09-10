"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl">⚠️</p>
      <h1 className="mt-4 text-3xl font-bold text-stone-900">
        Une erreur est survenue
      </h1>
      <p className="mt-2 text-stone-600">
        Rien n'a été perdu. Vous pouvez réessayer en toute sécurité.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
      >
        Réessayer
      </button>
    </div>
  );
}
