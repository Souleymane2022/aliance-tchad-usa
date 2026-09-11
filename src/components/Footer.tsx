import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16">
      {/* Liséré rouge de séparation, signature du style officiel */}
      <div className="h-1 bg-accent-500" />
      <div className="bg-brand-800 text-stone-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-double border-accent-500 bg-brand-900 font-serif-brand text-xs font-black text-white"
              >
                AT
              </span>
              <p className="font-serif-brand font-black uppercase tracking-wide text-white">
                Alliance
                <br />
                Tchad-USA
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              La communauté tchadienne aux États-Unis : entraide, culture,
              entrepreneuriat et opportunités entre le Tchad et les USA.
            </p>
          </div>
          <div>
            <p className="mb-3 font-serif-brand font-bold uppercase tracking-wide text-white">
              Marketplace
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace" className="hover:text-white hover:underline">Tous les produits</Link></li>
              <li><Link href="/espaces" className="hover:text-white hover:underline">Espaces vendeurs</Link></li>
              <li><Link href="/tableau-de-bord" className="hover:text-white hover:underline">Vendre mes produits</Link></li>
              <li><Link href="/panier" className="hover:text-white hover:underline">Mon panier</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-serif-brand font-bold uppercase tracking-wide text-white">
              Association
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/a-propos" className="hover:text-white hover:underline">À propos</Link></li>
              <li><Link href="/decouvrir/tchad" className="hover:text-white hover:underline">Découvrir le Tchad</Link></li>
              <li><Link href="/decouvrir/usa" className="hover:text-white hover:underline">Découvrir les USA</Link></li>
              <li><Link href="/evenements" className="hover:text-white hover:underline">Événements</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-serif-brand font-bold uppercase tracking-wide text-white">
              Mon compte
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/connexion" className="hover:text-white hover:underline">Connexion</Link></li>
              <li><Link href="/inscription" className="hover:text-white hover:underline">Devenir membre</Link></li>
              <li><Link href="/mes-commandes" className="hover:text-white hover:underline">Mes commandes</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-brand-900 py-4 text-center text-sm text-stone-400">
        © {new Date().getFullYear()} Alliance Tchad-USA. Tous droits réservés.
      </div>
    </footer>
  );
}
