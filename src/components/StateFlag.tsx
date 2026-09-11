"use client";

import { useState } from "react";

/**
 * Drapeau d'un État américain servi par le CDN spécialisé flagcdn.com.
 * Si le drapeau ne charge pas (réseau, code inconnu…), un écusson de
 * remplacement aux initiales de l'État s'affiche : jamais d'image cassée.
 */
export function StateFlag({
  code,
  name,
  className = "",
}: {
  code: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        role="img"
        aria-label={`Drapeau de l'État : ${name}`}
        className={`flex items-center justify-center border border-white/40 bg-brand-700 font-serif-brand font-black uppercase text-white ${className}`}
      >
        {code.toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w320/us-${code}.png`}
      alt={`Drapeau de l'État : ${name}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`border border-white/40 object-cover shadow-sm ${className}`}
    />
  );
}
