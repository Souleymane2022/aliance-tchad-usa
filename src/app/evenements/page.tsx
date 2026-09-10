import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Les prochains événements de la communauté Alliance Tchad-USA : rencontres, fêtes et célébrations.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    db.event.findMany({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
      take: 20,
    }),
    db.event.findMany({
      where: { date: { lt: now } },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  const fmt = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Événements</h1>
      <p className="mt-1 text-stone-600">
        Rencontres, fêtes et célébrations de la communauté.
      </p>

      <h2 className="mt-10 text-xl font-bold text-stone-900">À venir</h2>
      {upcoming.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
          Aucun événement programmé pour le moment. Revenez bientôt !
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {upcoming.map((event) => (
            <li
              key={event.id}
              className="rounded-2xl border border-stone-200 bg-white p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                {fmt.format(event.date)}
              </p>
              <h3 className="mt-1 text-lg font-bold text-stone-900">
                {event.title}
              </h3>
              <p className="mt-1 text-sm text-stone-500">📍 {event.location}</p>
              <p className="mt-3 leading-relaxed text-stone-700">
                {event.description}
              </p>
            </li>
          ))}
        </ul>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mt-12 text-xl font-bold text-stone-900">
            Événements passés
          </h2>
          <ul className="mt-4 space-y-3">
            {past.map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-stone-200 bg-stone-100 p-4 text-stone-600"
              >
                <p className="text-sm">{fmt.format(event.date)}</p>
                <p className="font-semibold text-stone-800">{event.title}</p>
                <p className="text-sm">📍 {event.location}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
