"use client";

import { useState } from "react";

/**
 * Portrait avec remplacement automatique : tente d'abord la photo
 * (ex. /images/presidents/16.jpg, à déposer dans public/images/), et
 * bascule sur le médaillon gravé généré si elle n'existe pas.
 */
export function Portrait({
  photoSrc,
  fallbackSrc,
  alt,
  className = "",
}: {
  photoSrc: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState(photoSrc);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
