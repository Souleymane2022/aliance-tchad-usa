import Link from "next/link";

/** Bandeau de titre institutionnel des pages intérieures. */
export function PageBanner({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: { href: string; label: string }[];
}) {
  return (
    <section className="border-b-4 border-accent-500 bg-gradient-to-br from-brand-800 to-brand-900 py-10 text-white">
      <div className="mx-auto max-w-6xl px-4">
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
