import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let latestProducts: Awaited<ReturnType<typeof getLatestProducts>> = [];
  let storeCount = 0;
  try {
    [latestProducts, storeCount] = await Promise.all([
      getLatestProducts(),
      db.store.count(),
    ]);
  } catch {
    // La page d'accueil reste affichable même si la base est indisponible.
  }

  return (
    <div>
      {/* Héro */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fcc419 0, transparent 40%), radial-gradient(circle at 80% 70%, #d64545 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-accent-400 ring-1 ring-white/20">
            🇹🇩 La communauté tchadienne aux États-Unis 🇺🇸
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Ensemble, plus forts.{" "}
            <span className="text-accent-400">Achetez, vendez</span> et
            grandissez avec la communauté.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-200">
            L'Alliance Tchad-USA rassemble la diaspora tchadienne : entraide,
            événements culturels, et une marketplace où chaque membre peut
            ouvrir son espace pour vendre ses produits et services.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/marketplace"
              className="rounded-lg bg-accent-500 px-6 py-3 font-bold text-brand-900 transition hover:bg-accent-600"
            >
              🛍️ Explorer la marketplace
            </Link>
            <Link
              href="/inscription"
              className="rounded-lg border-2 border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Rejoindre la communauté
            </Link>
          </div>
        </div>
      </section>

      {/* Piliers */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-stone-900">
          Ce que l'Alliance vous apporte
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "🏪",
              title: "Votre espace vendeur",
              text: "Créez gratuitement votre boutique et vendez vos produits à toute la communauté.",
            },
            {
              icon: "🤝",
              title: "Entraide & réseau",
              text: "Un réseau solidaire entre le Tchad et les USA : conseils, contacts, opportunités.",
            },
            {
              icon: "🎉",
              title: "Événements culturels",
              text: "Fêtes, rencontres et célébrations pour garder nos racines vivantes.",
            },
            {
              icon: "🔒",
              title: "Achats sécurisés",
              text: "Stock vérifié en temps réel, commandes suivies et historique protégé.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-4xl">{f.icon}</p>
              <h3 className="mt-3 font-bold text-stone-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Derniers produits */}
      {latestProducts.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-bold text-stone-900">
                Nouveautés de la marketplace
              </h2>
              <Link
                href="/marketplace"
                className="font-semibold text-brand-600 hover:underline"
              >
                Tout voir →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Appel à vendre */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold">
            Vous avez quelque chose à vendre ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-200">
            {storeCount > 0
              ? `${storeCount} espace${storeCount > 1 ? "s" : ""} vendeur${storeCount > 1 ? "s" : ""} déjà ouvert${storeCount > 1 ? "s" : ""} dans la communauté.`
              : "Soyez parmi les premiers à ouvrir votre espace vendeur."}{" "}
            Créez le vôtre en moins d'une minute — c'est gratuit.
          </p>
          <Link
            href="/tableau-de-bord"
            className="mt-6 inline-block rounded-lg bg-accent-500 px-8 py-3 font-bold text-brand-900 transition hover:bg-accent-600"
          >
            Ouvrir mon espace vendeur
          </Link>
        </div>
      </section>
    </div>
  );
}

function getLatestProducts() {
  return db.product.findMany({
    where: { active: true },
    include: { store: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}
