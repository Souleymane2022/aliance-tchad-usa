import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { provincesTchad } from "@/data/tchad";
import { etatsUsa } from "@/data/usa";

export const metadata: Metadata = {
  title: "Découvrir le Tchad et les USA",
  description:
    "Histoire, économie, société et culture : une vue globale du Tchad et des États-Unis, leurs provinces et États, leurs chefs d'État et leurs héros.",
};

export default function DecouvrirPage() {
  return (
    <div>
      <PageBanner
        title="Découvrir nos deux pays"
        subtitle="Un pont culturel, historique, économique et social entre le Tchad et les États-Unis : histoire, chefs d'État, figures marquantes, provinces et États — pour une vraie vue globale des deux nations."
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
        <Link
          href="/decouvrir/tchad"
          className="group overflow-hidden border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-tchad.svg"
              alt="Paysage stylisé du Tchad : dunes, palmiers et pirogue"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-2 right-3 text-4xl drop-shadow" aria-hidden>🇹🇩</span>
          </div>
          <div className="border-t-4 border-accent-500 p-6">
            <h2 className="text-2xl font-black text-brand-800 group-hover:text-brand-600">
              Le Tchad
            </h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              Du berceau de l'humanité (Toumaï) aux grands royaumes du
              Kanem-Bornou et du Ouaddaï, jusqu'au Tchad d'aujourd'hui : son
              histoire, ses chefs d'État depuis 1960, ses figures et ses{" "}
              {provincesTchad.length} provinces, une à une.
            </p>
            <p className="mt-4 font-bold uppercase tracking-wide text-brand-600 group-hover:text-accent-500">
              Explorer le Tchad →
            </p>
          </div>
        </Link>

        <Link
          href="/decouvrir/usa"
          className="group overflow-hidden border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-usa.svg"
              alt="Paysage stylisé des États-Unis : montagnes et gratte-ciel"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-2 right-3 text-4xl drop-shadow" aria-hidden>🇺🇸</span>
          </div>
          <div className="border-t-4 border-accent-500 p-6">
            <h2 className="text-2xl font-black text-brand-800 group-hover:text-brand-600">
              Les États-Unis
            </h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              De l'indépendance de 1776 à la première puissance mondiale : son
              histoire, les {" "}47 présidences de Washington à aujourd'hui, ses
              héros, et les {etatsUsa.length} États avec leur économie et leur
              mode de vie.
            </p>
            <p className="mt-4 font-bold uppercase tracking-wide text-brand-600 group-hover:text-accent-500">
              Explorer les États-Unis →
            </p>
          </div>
        </Link>
      </div>

      <section className="bg-stone-100 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-black text-brand-800">
            Pourquoi cette rubrique ?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-stone-700">
            L'Alliance Tchad-USA est un pont entre deux nations. Se connaître,
            c'est mieux échanger : cette encyclopédie vivante aide les
            Tchadiens à comprendre l'Amérique où ils vivent, et fait découvrir
            aux Américains la richesse du Tchad — son histoire millénaire, ses
            cultures et ses opportunités économiques, province par province.
          </p>
        </div>
      </section>
    </div>
  );
}
