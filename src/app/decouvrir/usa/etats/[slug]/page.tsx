import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { StateFlag } from "@/components/StateFlag";
import { etatsUsa } from "@/data/usa";

export function generateStaticParams() {
  return etatsUsa.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const etat = etatsUsa.find((e) => e.slug === slug);
  if (!etat) return { title: "État introuvable" };
  return {
    title: `${etat.nom} (USA)`,
    description: `${etat.nom} — ${etat.surnom}. ${etat.economie}`.slice(0, 160),
  };
}

export default async function EtatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = etatsUsa.findIndex((e) => e.slug === slug);
  if (index === -1) notFound();
  const etat = etatsUsa[index];
  const precedent = etatsUsa[index - 1];
  const suivant = etatsUsa[index + 1];

  return (
    <div>
      <PageBanner
        title={etat.nom}
        subtitle={`« ${etat.surnom} » — Capitale : ${etat.capitale}`}
        breadcrumb={[
          { href: "/decouvrir", label: "Découvrir" },
          { href: "/decouvrir/usa", label: "Les États-Unis" },
          { href: `/decouvrir/usa/etats/${etat.slug}`, label: etat.nom },
        ]}
        image={`/images/usa/${etat.slug}.svg`}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <section className="flex flex-wrap items-center gap-5 border border-stone-200 bg-stone-50 p-5">
          <StateFlag code={etat.code} name={etat.nom} className="h-20 w-32 text-xl" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
              Drapeau de l'État
            </p>
            <p className="mt-1 font-serif-brand text-lg font-black text-brand-800">
              {etat.nom} — « {etat.surnom} »
            </p>
            <p className="text-sm text-stone-600">Capitale : {etat.capitale}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="section-title text-2xl font-black text-brand-800">
            Économie
          </h2>
          <p className="mt-4 leading-relaxed text-stone-700">{etat.economie}</p>
        </section>

        <section className="mt-10 border-t-0">
          <h2 className="section-title text-2xl font-black text-brand-800">
            Mode de vie
          </h2>
          <p className="mt-4 leading-relaxed text-stone-700">
            {etat.modeDeVie}
          </p>
        </section>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-6 text-sm font-bold uppercase tracking-wide">
          {precedent ? (
            <Link
              href={`/decouvrir/usa/etats/${precedent.slug}`}
              className="text-brand-600 hover:text-accent-500"
            >
              ← {precedent.nom}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/decouvrir/usa"
            className="text-stone-500 hover:text-brand-600"
          >
            Tous les États
          </Link>
          {suivant ? (
            <Link
              href={`/decouvrir/usa/etats/${suivant.slug}`}
              className="text-brand-600 hover:text-accent-500"
            >
              {suivant.nom} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
