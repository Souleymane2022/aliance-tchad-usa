import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-brand-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-3 font-bold text-white">Alliance Tchad-USA</p>
          <p className="text-sm leading-relaxed">
            La communauté tchadienne aux États-Unis : entraide, culture,
            entrepreneuriat et opportunités entre le Tchad et les USA.
          </p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Marketplace</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/marketplace" className="hover:text-accent-400">Tous les produits</Link></li>
            <li><Link href="/espaces" className="hover:text-accent-400">Espaces vendeurs</Link></li>
            <li><Link href="/tableau-de-bord" className="hover:text-accent-400">Vendre mes produits</Link></li>
            <li><Link href="/panier" className="hover:text-accent-400">Mon panier</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Association</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/a-propos" className="hover:text-accent-400">À propos</Link></li>
            <li><Link href="/evenements" className="hover:text-accent-400">Événements</Link></li>
            <li><Link href="/contact" className="hover:text-accent-400">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Mon compte</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/connexion" className="hover:text-accent-400">Connexion</Link></li>
            <li><Link href="/inscription" className="hover:text-accent-400">Créer un compte</Link></li>
            <li><Link href="/mes-commandes" className="hover:text-accent-400">Mes commandes</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800 py-4 text-center text-sm text-stone-400">
        © {new Date().getFullYear()} Alliance Tchad-USA. Tous droits réservés.
      </div>
    </footer>
  );
}
