import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "L'Alliance Tchad-USA : notre mission, nos valeurs et notre engagement pour la diaspora tchadienne aux États-Unis.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-black">À propos de l'Alliance Tchad-USA</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-200">
            Un pont entre le Tchad et les États-Unis, au service de notre
            communauté.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-bold text-stone-900">Notre mission</h2>
        <p className="mt-4 leading-relaxed text-stone-700">
          L'Alliance Tchad-USA est une organisation communautaire qui rassemble
          les Tchadiennes et Tchadiens vivant aux États-Unis, ainsi que leurs
          amis et partenaires. Notre mission : renforcer les liens de
          solidarité, promouvoir la culture tchadienne, et créer des
          opportunités économiques concrètes pour nos membres.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-stone-900">Nos valeurs</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: "🤝",
              title: "Solidarité",
              text: "Personne ne réussit seul : nous nous soutenons dans les moments importants comme dans le quotidien.",
            },
            {
              icon: "🇹🇩",
              title: "Culture",
              text: "Nos langues, notre cuisine, notre musique et nos traditions sont un héritage que nous transmettons.",
            },
            {
              icon: "🚀",
              title: "Entrepreneuriat",
              text: "Nous encourageons chaque membre à créer, vendre et développer son activité au sein de la communauté.",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-3xl">{v.icon}</p>
              <h3 className="mt-3 font-bold text-stone-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{v.text}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-bold text-stone-900">
          La marketplace communautaire
        </h2>
        <p className="mt-4 leading-relaxed text-stone-700">
          Le cœur économique de l'Alliance : chaque membre peut ouvrir
          gratuitement son <strong>espace vendeur</strong> et proposer produits
          et services — alimentation, artisanat, mode, services et plus. Les
          commandes sont suivies de bout en bout et le stock est vérifié en
          temps réel pour que les échanges se passent en toute confiance.
        </p>

        <div className="mt-10 text-center">
          <Link
            href="/inscription"
            className="inline-block rounded-lg bg-brand-600 px-8 py-3 font-bold text-white transition hover:bg-brand-700"
          >
            Rejoindre l'Alliance
          </Link>
        </div>
      </section>
    </div>
  );
}
