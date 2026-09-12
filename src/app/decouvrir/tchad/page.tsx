import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { Portrait } from "@/components/Portrait";
import {
  histoireTchad,
  chefsEtatTchad,
  figuresTchad,
  provincesTchad,
} from "@/data/tchad";
import {
  chefsTchadWiki,
  figuresWiki,
  provincesWiki,
  paysWiki,
} from "@/data/wiki-images";
import { getWikiImage, getWikiImages } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Le Tchad — histoire, chefs d'État et provinces",
  description:
    "Une vue globale du Tchad : son histoire de Toumaï à aujourd'hui, tous ses chefs d'État depuis 1960, ses figures marquantes et ses 23 provinces avec leur économie.",
};

// Les photos Wikipédia sont rafraîchies au plus une fois par semaine.
export const revalidate = 604800;

export default async function TchadPage() {
  const [banner, chefPhotos, figurePhotos, provincePhotos] = await Promise.all([
    getWikiImage(paysWiki.tchad.title, paysWiki.tchad.lang, 1200),
    getWikiImages(chefsTchadWiki.map((title) => ({ title, lang: "fr" as const })), 320),
    getWikiImages(
      figuresTchad.map((f) => figuresWiki[f.nom] ?? { title: f.nom, lang: "fr" as const }),
      320
    ),
    getWikiImages(
      provincesTchad.map((p) => ({ title: provincesWiki[p.slug], lang: "fr" as const })),
      480
    ),
  ]);

  return (
    <div>
      <PageBanner
        title="🇹🇩 Le Tchad"
        subtitle="Au cœur de l'Afrique, un pays de plus de 18 millions d'habitants, 120 langues et 7 millions d'années d'histoire humaine — du fossile de Toumaï aux grands royaumes sahéliens et au Tchad contemporain."
        breadcrumb={[
          { href: "/decouvrir", label: "Découvrir" },
          { href: "/decouvrir/tchad", label: "Le Tchad" },
        ]}
        image={banner ?? "/images/hero-tchad.svg"}
        flag={{ src: "/images/drapeau-td.svg", alt: "Drapeau du Tchad" }}
      />

      {/* Repères */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-stone-200 text-center md:grid-cols-4">
          {[
            ["N'Djamena", "Capitale"],
            ["≈ 18 millions", "Habitants"],
            ["1,28 M km²", "Superficie (5e d'Afrique)"],
            ["11 août 1960", "Indépendance"],
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
          Une histoire de 7 millions d'années
        </h2>
        <div className="mt-8 space-y-8">
          {histoireTchad.map((chapitre) => (
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

      {/* Chefs d'État */}
      <section className="bg-stone-100 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="section-title text-3xl font-black text-brand-800">
            Les chefs d'État depuis 1960
          </h2>
          <ol className="mt-8 space-y-0 border-l-4 border-brand-600">
            {chefsEtatTchad.map((chef, index) => (
              <li key={`${chef.nom}-${chef.periode}`} className="relative pb-8 pl-6">
                <span
                  aria-hidden
                  className="absolute -left-[10px] top-1 h-4 w-4 rounded-full border-4 border-white bg-accent-500"
                />
                <div className="flex items-start gap-4">
                  <Portrait
                    photoSrc={chefPhotos[index]}
                    fallbackSrc={`/images/tchad-chefs/medaillon-${index + 1}.svg`}
                    alt={`Portrait : ${chef.nom}`}
                    className="h-24 w-24 shrink-0 border-4 border-white shadow-md"
                  />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-accent-500">
                      {chef.periode}
                    </p>
                    <h3 className="text-lg font-bold text-brand-800">{chef.nom}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-700">
                      {chef.note}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-xs text-stone-500">
            Portraits : Wikimedia Commons.
          </p>
        </div>
      </section>

      {/* Figures marquantes */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="section-title text-3xl font-black text-brand-800">
          Figures marquantes
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {figuresTchad.map((figure, i) => (
            <article
              key={figure.nom}
              className="flex gap-4 border border-stone-200 bg-white p-5"
            >
              <Portrait
                photoSrc={figurePhotos[i]}
                fallbackSrc="/images/tchad-chefs/medaillon-3.svg"
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

      {/* Provinces */}
      <section className="bg-brand-800 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-black text-white">
            Les {provincesTchad.length} provinces du Tchad
          </h2>
          <p className="mt-2 max-w-3xl text-stone-300">
            Cliquez sur une province pour découvrir sa présentation, son
            chef-lieu et son économie.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {provincesTchad.map((province, i) => (
              <Link
                key={province.slug}
                href={`/decouvrir/tchad/provinces/${province.slug}`}
                className="group overflow-hidden border border-brand-700 bg-brand-700/50 transition hover:border-accent-500 hover:bg-brand-700"
              >
                <div className="aspect-video overflow-hidden">
                  <Portrait
                    photoSrc={provincePhotos[i]}
                    fallbackSrc={`/images/tchad/${province.slug}.svg`}
                    alt={`${provincesWiki[province.slug]} — ${province.nom}`}
                    rounded={false}
                    className="h-full w-full transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="font-bold text-white group-hover:text-accent-400">
                    {province.nom}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-300">
                    Chef-lieu : {province.chefLieu}
                  </p>
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
