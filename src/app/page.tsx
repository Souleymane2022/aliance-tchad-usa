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
      {/* Héro institutionnel : grande image + encart bleu marine */}
      <section className="relative isolate overflow-hidden bg-brand-900">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-accueil.svg)" }}
        />
        <div aria-hidden className="absolute inset-0 bg-brand-900/45" />
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

      {/* Découvrir les deux pays */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title text-3xl font-black text-brand-800">
            Découvrir nos deux pays
          </h2>
          <p className="mt-3 max-w-3xl text-stone-600">
            Histoire, chefs d'État, héros, économie et mode de vie : une vue
            globale du Tchad ({`${23}`} provinces) et des États-Unis ({`${50}`}{" "}
            États), pour mieux se connaître et mieux échanger.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Link
              href="/decouvrir/tchad"
              className="group flex items-center gap-5 border border-stone-200 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="relative h-24 w-36 shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-tchad.svg"
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-1 right-1.5 text-xl drop-shadow" aria-hidden>🇹🇩</span>
              </span>
              <span>
                <span className="block text-xl font-black text-brand-800 group-hover:text-brand-600">
                  Le Tchad
                </span>
                <span className="mt-1 block text-sm text-stone-600">
                  De Toumaï aux 23 provinces : histoire, chefs d'État depuis
                  1960, figures et économies régionales.
                </span>
              </span>
            </Link>
            <Link
              href="/decouvrir/usa"
              className="group flex items-center gap-5 border border-stone-200 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="relative h-24 w-36 shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-usa.svg"
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-1 right-1.5 text-xl drop-shadow" aria-hidden>🇺🇸</span>
              </span>
              <span>
                <span className="block text-xl font-black text-brand-800 group-hover:text-brand-600">
                  Les États-Unis
                </span>
                <span className="mt-1 block text-sm text-stone-600">
                  De 1776 à aujourd'hui : les 47 présidences, les héros, et
                  les 50 États avec leur économie et leur mode de vie.
                </span>
              </span>
            </Link>
          </div>
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
