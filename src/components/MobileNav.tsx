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
        className="rounded p-2 text-2xl leading-none text-brand-800 hover:bg-brand-50"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-stone-200 bg-brand-800 shadow-lg">
          <nav className="mx-auto max-w-6xl px-4 py-2" aria-label="Menu mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-l-4 border-transparent px-3 py-2.5 font-bold uppercase tracking-wide text-white hover:border-accent-500 hover:bg-brand-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-brand-700 pt-2 pb-2">
              {isConnected ? (
                <>
                  {userName && (
                    <p className="px-3 py-1 text-sm text-stone-300">
                      Connecté : {userName}
                    </p>
                  )}
                  <Link
                    href="/tableau-de-bord"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 font-bold text-white hover:bg-brand-700"
                  >
                    Mon espace
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 font-semibold text-stone-200 hover:bg-brand-700"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 font-bold text-white hover:bg-brand-700"
                  >
                    Devenir membre
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
