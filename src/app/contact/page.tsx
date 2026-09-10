import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'Alliance Tchad-USA.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-stone-900">Contactez-nous</h1>
      <p className="mt-2 text-stone-600">
        Une question sur l'association, la marketplace ou un partenariat ?
        Écrivez-nous, nous répondons rapidement.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <a
          href="mailto:souleymanemahamatsaleh2000@gmail.com"
          className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:shadow-md"
        >
          <p className="text-3xl">✉️</p>
          <h2 className="mt-3 font-bold text-stone-900">Par e-mail</h2>
          <p className="mt-1 break-all text-sm text-brand-600">
            souleymanemahamatsaleh2000@gmail.com
          </p>
        </a>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-3xl">🌍</p>
          <h2 className="mt-3 font-bold text-stone-900">Communauté</h2>
          <p className="mt-1 text-sm text-stone-600">
            Rejoignez nos événements pour nous rencontrer en personne — consultez
            la page Événements.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="font-bold text-brand-800">Vendeurs & acheteurs</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-800">
          Pour toute question sur une commande, contactez d'abord directement le
          vendeur (son téléphone figure sur sa page d'espace et dans la
          commande). L'association reste disponible en cas de litige.
        </p>
      </div>
    </div>
  );
}
