import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { logoutAction } from "@/actions/auth";
import { MobileNav } from "@/components/MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
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
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-black text-accent-400">
            AT
          </span>
          <span className="hidden sm:inline">Alliance Tchad-USA</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/panier"
            className="relative rounded-lg p-2 text-stone-700 transition hover:bg-brand-50"
            aria-label={`Panier (${cartCount} article${cartCount > 1 ? "s" : ""})`}
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-500 px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/tableau-de-bord"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                Mon espace
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/connexion"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-brand-50"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Créer un compte
              </Link>
            </div>
          )}

          <MobileNav
            links={NAV_LINKS}
            isConnected={Boolean(user)}
            userName={user?.name ?? null}
          />
        </div>
      </div>
    </header>
  );
}
