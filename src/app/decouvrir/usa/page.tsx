import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { histoireUsa, presidentsUsa, figuresUsa, etatsUsa } from "@/data/usa";

export const metadata: Metadata = {
  title: "Les États-Unis — histoire, présidents et États",
  description:
    "Une vue globale des États-Unis : leur histoire, les 47 présidences de Washington à aujourd'hui, leurs héros et les 50 États avec économie et mode de vie.",
};

export default function UsaPage() {
  return (
    <div>
      <PageBanner
        title="🇺🇸 Les États-Unis"
        subtitle="Une république fédérale de 50 États et 335 millions d'habitants, première puissance économique mondiale — et terre d'accueil d'une diaspora tchadienne dynamique."
        breadcrumb={[
          { href: "/decouvrir", label: "Découvrir" },
          { href: "/decouvrir/usa", label: "Les États-Unis" },
        ]}
      />

      {/* Repères */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-stone-200 text-center md:grid-cols-4">
          {[
            ["Washington D.C.", "Capitale fédérale"],
            ["≈ 335 millions", "Habitants"],
            ["9,8 M km²", "Superficie"],
            ["4 juillet 1776", "Indépendance"],
          ].map(([valeur, label]) => (
            <div key={label} className="px-4 py-6">
              <p className="font-serif-brand text-lg font-black text-brand-800">
                {valeur}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Histoire */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="section-title text-3xl font-black text-brand-800">
          De 1776 à aujourd'hui
        </h2>
        <div className="mt-8 space-y-8">
          {histoireUsa.map((chapitre) => (
            <article key={chapitre.titre}>
              <h3 className="text-xl font-bold text-brand-700">
                {chapitre.titre}
              </h3>
              <p className="mt-2 leading-relaxed text-stone-700">
                {chapitre.texte}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Présidents */}
      <section className="bg-stone-100 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="section-title text-3xl font-black text-brand-800">
            Les présidences, de Washington à aujourd'hui
          </h2>
          <p className="mt-3 text-stone-600">
            {presidentsUsa.length} présidences depuis 1789 (Grover Cleveland a
            exercé deux mandats non consécutifs, tout comme Donald Trump).
          </p>
          <div className="mt-6 overflow-x-auto border border-stone-200 bg-white">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="bg-brand-800 text-left text-white">
                  <th className="px-3 py-2.5 font-bold">N°</th>
                  <th className="px-3 py-2.5 font-bold">Président</th>
                  <th className="px-3 py-2.5 font-bold">Mandat</th>
                  <th className="px-3 py-2.5 font-bold">Parti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {presidentsUsa.map((p) => (
                  <tr key={`${p.n}-${p.periode}`} className="odd:bg-stone-50">
                    <td className="px-3 py-2 font-bold text-brand-700">{p.n}</td>
                    <td className="px-3 py-2 font-semibold text-stone-900">
                      {p.nom}
                    </td>
                    <td className="px-3 py-2 text-stone-600">{p.periode}</td>
                    <td className="px-3 py-2 text-stone-600">{p.parti}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Héros et figures */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="section-title text-3xl font-black text-brand-800">
          Héros et figures marquantes
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {figuresUsa.map((figure) => (
            <article
              key={figure.nom}
              className="border border-stone-200 bg-white p-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                {figure.domaine}
              </p>
              <h3 className="mt-1 font-bold text-brand-800">{figure.nom}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {figure.note}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* États */}
      <section className="bg-brand-800 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-black text-white">
            Les {etatsUsa.length} États
          </h2>
          <p className="mt-2 max-w-3xl text-stone-300">
            Cliquez sur un État pour découvrir sa capitale, son économie et
            son mode de vie.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {etatsUsa.map((etat) => (
              <Link
                key={etat.slug}
                href={`/decouvrir/usa/etats/${etat.slug}`}
                className="group border border-brand-700 bg-brand-700/50 p-3.5 transition hover:border-accent-500 hover:bg-brand-700"
              >
                <p className="font-bold text-white group-hover:text-accent-400">
                  {etat.nom}
                </p>
                <p className="mt-1 text-xs text-stone-300">{etat.capitale}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
