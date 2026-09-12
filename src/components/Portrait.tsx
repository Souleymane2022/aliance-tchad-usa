"use client";

import { useState } from "react";

/**
 * Image avec remplacement automatique : tente d'abord la photo réelle
 * (Wikipédia ou fichier déposé dans public/images/), et bascule sur
 * l'illustration de secours si elle ne charge pas — jamais d'image cassée.
 */
export function Portrait({
  photoSrc,
  fallbackSrc,
  alt,
  className = "",
  rounded = true,
}: {
  photoSrc: string | null | undefined;
  fallbackSrc: string;
  alt: string;
  className?: string;
  rounded?: boolean;
}) {
  const [src, setSrc] = useState(photoSrc || fallbackSrc);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
      className={`${rounded ? "rounded-full" : ""} object-cover ${className}`}
    />
  );
}
