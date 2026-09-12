import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { Portrait } from "@/components/Portrait";
import { StateFlag } from "@/components/StateFlag";
import { histoireUsa, presidentsUsa, figuresUsa, etatsUsa } from "@/data/usa";
import {
  presidentsWiki,
  figuresWiki,
  etatsWiki,
  paysWiki,
} from "@/data/wiki-images";
import { getWikiImage, getWikiImages } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Les États-Unis — histoire, présidents et États",
  description:
    "Une vue globale des États-Unis : leur histoire, les 47 présidences de Washington à aujourd'hui, leurs héros et les 50 États avec économie et mode de vie.",
};

// Les photos Wikipédia sont rafraîchies au plus une fois par semaine.
export const revalidate = 604800;

const PARTY_STYLES: Record<string, string> = {
  "Républicain": "bg-red-100 text-red-900",
  "Démocrate": "bg-blue-100 text-blue-900",
  "Fédéraliste": "bg-amber-100 text-amber-900",
  "Whig": "bg-amber-100 text-amber-900",
  "Républicain-démocrate": "bg-green-100 text-green-900",
  "Indépendant": "bg-stone-200 text-stone-800",
};

export default async function UsaPage() {
  const [banner, presidentPhotos, figurePhotos, etatPhotos] = await Promise.all([
    getWikiImage(paysWiki.usa.title, paysWiki.usa.lang, 1200),
    getWikiImages(
      presidentsUsa.map((p) => ({ title: presidentsWiki[p.n], lang: "en" as const })),
      320
    ),
    getWikiImages(
      figuresUsa.map((f) => figuresWiki[f.nom] ?? { title: f.nom, lang: "en" as const }),
      320
    ),
    getWikiImages(
      etatsUsa.map((e) => ({ title: etatsWiki[e.slug], lang: "en" as const })),
      480
    ),
  ]);

  return (
    <div>
      <PageBanner
        title="🇺🇸 Les États-Unis"
        subtitle="Une république fédérale de 50 États et 335 millions d'habitants, première puissance économique mondiale — et terre d'accueil d'une diaspora tchadienne dynamique."
        breadcrumb={[
          { href: "/decouvrir", label: "Découvrir" },
          { href: "/decouvrir/usa", label: "Les États-Unis" },
        ]}
        image={banner ?? "/images/hero-usa.svg"}
        flag={{ src: "/images/drapeau-us.svg", alt: "Drapeau des États-Unis" }}
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
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title text-3xl font-black text-brand-800">
            Les présidences, de Washington à aujourd'hui
          </h2>
          <p className="mt-3 text-stone-600">
            {presidentsUsa.length} présidences depuis 1789 (Grover Cleveland a
            exercé deux mandats non consécutifs, tout comme Donald Trump).
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {presidentsUsa.map((p, i) => (
              <article
                key={`${p.n}-${p.periode}`}
                className="flex flex-col items-center border border-stone-200 bg-white p-4 text-center"
              >
                <Portrait
                  photoSrc={presidentPhotos[i]}
                  fallbackSrc={`/images/presidents/medaillon-${p.n}.svg`}
                  alt={`Portrait : ${p.nom} (${p.n}e présidence)`}
                  className="h-28 w-28 border-4 border-white shadow-md"
                />
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-stone-400">
                  {p.n}e présidence
                </p>
                <h3 className="mt-0.5 font-bold leading-snug text-brand-800">
                  {p.nom}
                </h3>
                <p className="text-sm text-stone-500">{p.periode}</p>
                <p
                  className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${PARTY_STYLES[p.parti] ?? "bg-stone-200 text-stone-800"}`}
                >
                  {p.parti}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone-500">
            Portraits : Wikimedia Commons (domaine public / licences libres).
          </p>
        </div>
      </section>

      {/* Héros et figures */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="section-title text-3xl font-black text-brand-800">
          Héros et figures marquantes
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {figuresUsa.map((figure, i) => (
            <article
              key={figure.nom}
              className="flex gap-4 border border-stone-200 bg-white p-5"
            >
              <Portrait
                photoSrc={figurePhotos[i]}
                fallbackSrc="/images/presidents/medaillon-1.svg"
                alt={`Portrait : ${figure.nom}`}
                className="h-20 w-20 shrink-0 border-2 border-white shadow"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                  {figure.domaine}
                </p>
                <h3 className="mt-1 font-bold text-brand-800">{figure.nom}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {figure.note}
                </p>
              </div>
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
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {etatsUsa.map((etat, i) => (
              <Link
                key={etat.slug}
                href={`/decouvrir/usa/etats/${etat.slug}`}
                className="group overflow-hidden border border-brand-700 bg-brand-700/50 transition hover:border-accent-500 hover:bg-brand-700"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Portrait
                    photoSrc={etatPhotos[i]}
                    fallbackSrc={`/images/usa/${etat.slug}.svg`}
                    alt={`${etatsWiki[etat.slug]} — ${etat.nom}`}
                    rounded={false}
                    className="h-full w-full transition duration-300 group-hover:scale-105"
                  />
                  <StateFlag
                    code={etat.code}
                    name={etat.nom}
                    className="absolute bottom-1.5 right-1.5 h-7 w-11 text-[10px]"
                  />
                </div>
                <div className="p-3">
                  <p className="font-bold text-white group-hover:text-accent-400">
                    {etat.nom}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-300">{etat.capitale}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Photos : Wikimedia Commons.
          </p>
        </div>
      </section>
    </div>
  );
}
