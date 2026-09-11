import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { logoutAction } from "@/actions/auth";
import { MobileNav } from "@/components/MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/decouvrir", label: "Découvrir" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/espaces", label: "Espaces vendeurs" },
  { href: "/evenements", label: "Événements" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const user = await getCurrentUser();
  let cartCount = 0;
  if (user) {
    try {
      const items = await db.cartItem.findMany({
        where: { userId: user.id },
        select: { quantity: true },
      });
      cartCount = items.reduce((sum, it) => sum + it.quantity, 0);
    } catch {
      // Le compteur du panier n'est pas critique : le site reste utilisable.
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Barre utilitaire supérieure */}
      <div className="bg-brand-900 text-xs text-stone-200">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-between px-4">
          <p className="truncate">
            🇹🇩 Organisation communautaire de la diaspora tchadienne aux
            États-Unis 🇺🇸
          </p>
          <div className="flex shrink-0 items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-stone-300 sm:inline">
                  {user.name}
                </span>
                <Link
                  href="/tableau-de-bord"
                  className="font-semibold text-white hover:underline"
                >
                  Mon espace
                </Link>
                <form action={logoutAction} className="leading-none">
                  <button type="submit" className="hover:underline">
                    Déconnexion
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/connexion" className="hover:underline">
                  Connexion
                </Link>
                <span aria-hidden>|</span>
                <Link
                  href="/inscription"
                  className="font-semibold text-white hover:underline"
                >
                  Devenir membre
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* En-tête principal : sceau + titre + recherche + panier */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center gap-4 px-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-double border-accent-500 bg-brand-800 font-serif-brand text-sm font-black text-white"
            >
              AT
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif-brand text-lg font-black uppercase leading-tight tracking-wide text-brand-800 sm:text-xl">
                Alliance Tchad-USA
              </span>
              <span className="hidden text-xs text-stone-500 sm:block">
                La communauté tchadienne aux États-Unis
              </span>
            </span>
          </Link>

          <form
            method="GET"
            action="/marketplace"
            className="ml-auto hidden items-center md:flex"
            role="search"
          >
            <input
              type="search"
              name="q"
              placeholder="Rechercher un produit…"
              maxLength={100}
              className="h-10 w-56 rounded-l border border-stone-300 px-3 text-sm focus:border-brand-600 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Rechercher"
              className="h-10 rounded-r bg-brand-600 px-4 text-white hover:bg-brand-700"
            >
              🔍
            </button>
          </form>

          <Link
            href="/panier"
            className="relative ml-auto rounded p-2 text-2xl leading-none text-brand-800 hover:bg-brand-50 md:ml-2"
            aria-label={`Panier (${cartCount} article${cartCount > 1 ? "s" : ""})`}
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <MobileNav
            links={NAV_LINKS}
            isConnected={Boolean(user)}
            userName={user?.name ?? null}
          />
        </div>
      </div>

      {/* Bandeau de navigation principal */}
      <nav
        className="hidden bg-brand-700 lg:block"
        aria-label="Navigation principale"
      >
        <div className="mx-auto flex max-w-6xl px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b-4 border-transparent px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-accent-500 hover:bg-brand-800"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
