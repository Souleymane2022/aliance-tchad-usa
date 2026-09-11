import Link from "next/link";

/** Bandeau de titre institutionnel des pages intérieures (photo optionnelle). */
export function PageBanner({
  title,
  subtitle,
  breadcrumb,
  image,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: { href: string; label: string }[];
  image?: string;
}) {
  return (
    <section
      className="relative border-b-4 border-accent-500 bg-brand-900 bg-cover bg-center py-10 text-white"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {/* Voile bleu nuit pour la lisibilité du texte sur l'image */}
      <div
        aria-hidden
        className={`absolute inset-0 ${image ? "bg-brand-900/70" : "bg-gradient-to-br from-brand-800 to-brand-900"}`}
      />
      <div className="relative mx-auto max-w-6xl px-4">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-2 text-sm text-stone-300" aria-label="Fil d'Ariane">
            {breadcrumb.map((item, i) => (
              <span key={item.href}>
                {i > 0 && " / "}
                <Link href={item.href} className="hover:text-white hover:underline">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-3xl leading-relaxed text-stone-200">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
