"use client";

import { useState } from "react";

/**
 * Image produit robuste : si l'URL externe est cassée ou vide,
 * on affiche un visuel de remplacement au lieu d'une image brisée.
 */
export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-brand-100 to-stone-200 text-4xl ${className}`}
      >
        🛍️
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
