import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { provincesTchad } from "@/data/tchad";

export function generateStaticParams() {
  return provincesTchad.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const province = provincesTchad.find((p) => p.slug === slug);
  if (!province) return { title: "Province introuvable" };
  return {
    title: `${province.nom} (Tchad)`,
    description: province.apropos.slice(0, 160),
  };
}

export default async function ProvincePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = provincesTchad.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const province = provincesTchad[index];
  const precedente = provincesTchad[index - 1];
  const suivante = provincesTchad[index + 1];

  return (
    <div>
      <PageBanner
        title={province.nom}
        subtitle={`Chef-lieu : ${province.chefLieu}`}
        breadcrumb={[
          { href: "/decouvrir", label: "Découvrir" },
          { href: "/decouvrir/tchad", label: "Le Tchad" },
          { href: `/decouvrir/tchad/provinces/${province.slug}`, label: province.nom },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <section>
          <h2 className="section-title text-2xl font-black text-brand-800">
            À propos
          </h2>
          <p className="mt-4 leading-relaxed text-stone-700">
            {province.apropos}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="section-title text-2xl font-black text-brand-800">
            Économie
          </h2>
          <p className="mt-4 leading-relaxed text-stone-700">
            {province.economie}
          </p>
        </section>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-6 text-sm font-bold uppercase tracking-wide">
          {precedente ? (
            <Link
              href={`/decouvrir/tchad/provinces/${precedente.slug}`}
              className="text-brand-600 hover:text-accent-500"
            >
              ← {precedente.nom}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/decouvrir/tchad"
            className="text-stone-500 hover:text-brand-600"
          >
            Toutes les provinces
          </Link>
          {suivante ? (
            <Link
              href={`/decouvrir/tchad/provinces/${suivante.slug}`}
              className="text-brand-600 hover:text-accent-500"
            >
              {suivante.nom} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
