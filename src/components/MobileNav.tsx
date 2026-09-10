"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileNav({
  links,
  isConnected,
  userName,
}: {
  links: { href: string; label: string }[];
  isConnected: boolean;
  userName: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="rounded-lg p-2 text-2xl leading-none text-stone-700 hover:bg-brand-50"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-stone-200 bg-white shadow-lg">
          <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Menu mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-medium text-stone-700 hover:bg-brand-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-stone-200 pt-2">
              {isConnected ? (
                <>
                  {userName && (
                    <p className="px-3 py-1 text-sm text-stone-500">
                      Connecté : {userName}
                    </p>
                  )}
                  <Link
                    href="/tableau-de-bord"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-medium text-brand-700 hover:bg-brand-50"
                  >
                    Mon espace
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-medium text-stone-700 hover:bg-brand-50"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
