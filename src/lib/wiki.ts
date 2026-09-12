import "server-only";

/**
 * Récupère l'image principale d'un article Wikipédia (API REST « summary »).
 * Utilisé côté serveur pour afficher de vraies photos (portraits officiels,
 * monuments, paysages) avec mise en cache d'une semaine par Next.js.
 * Renvoie null en cas d'échec : l'appelant affiche alors une illustration
 * de secours — jamais d'image cassée.
 */
export async function getWikiImage(
  title: string,
  lang: "fr" | "en" = "fr",
  width = 640
): Promise<string | null> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title.replace(/ /g, "_")
  )}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Api-User-Agent":
          "AllianceTchadUSA/1.0 (site communautaire ; souleymanemahamatsaleh2000@gmail.com)",
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      thumbnail?: { source?: string };
      originalimage?: { source?: string };
    };
    const thumb = data.thumbnail?.source;
    if (!thumb) return data.originalimage?.source ?? null;
    // La vignette est servie en 320 px : on demande une largeur plus grande.
    return thumb.replace(/\/\d+px-/, `/${width}px-`);
  } catch {
    return null;
  }
}

/** Version « tolérante » pour une liste : renvoie null pour chaque échec. */
export async function getWikiImages(
  items: { title: string; lang?: "fr" | "en" }[],
  width = 640
): Promise<(string | null)[]> {
  return Promise.all(
    items.map((it) => getWikiImage(it.title, it.lang ?? "fr", width))
  );
}
