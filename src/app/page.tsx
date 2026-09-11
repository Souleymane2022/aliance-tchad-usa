import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let latestProducts: Awaited<ReturnType<typeof getLatestProducts>> = [];
  let upcomingEvents: Awaited<ReturnType<typeof getUpcomingEvents>> = [];
  let storeCount = 0;
  try {
    [latestProducts, upcomingEvents, storeCount] = await Promise.all([
      getLatestProducts(),
      getUpcomingEvents(),
      db.store.count(),
    ]);
  } catch {
    // La page d'accueil reste affichable même si la base est indisponible.
  }

  const eventFmt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Héro institutionnel : image de fond stylisée + encart bleu marine */}
      <section className="relative isolate overflow-hidden bg-brand-700">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(115deg, #163e66 0%, #0a4480 45%, #205493 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 20%, #c61826 0, transparent 35%), radial-gradient(circle at 10% 85%, #ffd24d 0, transparent 30%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl border-l-4 border-accent-500 bg-brand-900/80 p-6 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-stone-300">
              🇹🇩 Alliance Tchad-USA 🇺🇸
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Au service de la communauté tchadienne aux États-Unis
            </h1>
            <p className="mt-4 leading-relaxed text-stone-200">
              Entraide, culture et entrepreneuriat : chaque membre peut ouvrir
              son espace vendeur et proposer ses produits et services à toute
              la communauté, en toute confiance.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="bg-accent-500 px-6 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-accent-600"
              >
                Explorer la Marketplace
              </Link>
              <Link
                href="/inscription"
                className="border-2 border-white px-6 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-brand-800"
              >
                Devenir membre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tuiles de services rapides (style rubriques officielles) */}
      <section className="bg-brand-800">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-brand-700 lg:grid-cols-4">
          {[
            { icon: "🛍️", label: "Marketplace", href: "/marketplace" },
            { icon: "🏪", label: "Ouvrir mon espace", href: "/tableau-de-bord" },
            { icon: "🎉", label: "Événements", href: "/evenements" },
            { icon: "✉️", label: "Nous contacter", href: "/contact" },
          ].map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group flex flex-col items-center gap-2 border-b-4 border-transparent px-4 py-7 text-center transition hover:border-accent-500 hover:bg-brand-700"
            >
              <span className="text-3xl" aria-hidden>
                {tile.icon}
              </span>
              <span className="font-bold uppercase tracking-wide text-white">
                {tile.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nouveautés de la marketplace */}
      {latestProducts.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="section-title text-3xl font-black text-brand-800">
                Nouveautés de la Marketplace
              </h2>
              <Link
                href="/marketplace"
                className="font-bold uppercase tracking-wide text-brand-600 hover:text-accent-500"
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

      {/* Actualités & événements */}
      <section className="bg-stone-100 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title text-3xl font-black text-brand-800">
            Actualités & Événements
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <article
                  key={event.id}
                  className="border border-stone-200 bg-white"
                >
                  <div className="border-t-4 border-accent-500 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                      Événement
                    </p>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-brand-800">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-500">
                      📅 {eventFmt.format(event.date)} — 📍 {event.location}
                    </p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-700">
                      {event.description}
                    </p>
                    <Link
                      href="/evenements"
                      className="mt-4 inline-block text-sm font-bold uppercase tracking-wide text-brand-600 hover:text-accent-500"
                    >
                      En savoir plus →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-stone-600 md:col-span-3">
                Aucun événement programmé pour le moment — revenez bientôt, ou{" "}
                <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
                  contactez-nous
                </Link>{" "}
                pour proposer le vôtre.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Appel à vendre */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-l-4 border-accent-500 bg-brand-800 px-6 py-10 text-center sm:px-12">
            <h2 className="text-3xl font-black text-white">
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
              className="mt-6 inline-block bg-accent-500 px-8 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-accent-600"
            >
              Ouvrir mon espace vendeur
            </Link>
          </div>
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

function getUpcomingEvents() {
  return db.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 3,
  });
}
