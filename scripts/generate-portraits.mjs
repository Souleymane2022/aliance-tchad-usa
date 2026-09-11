/**
 * Génère dans public/images/ :
 *  - les drapeaux exacts du Tchad (drapeau-td.svg) et des USA (drapeau-us.svg) ;
 *  - les médaillons gravés des 47 présidences américaines
 *    (presidents/medaillon-<n>-<periode>.svg, anneau coloré selon le parti) ;
 *  - les médaillons des 7 chefs d'État tchadiens (tchad-chefs/medaillon-<i>.svg).
 *
 * Usage : node scripts/generate-portraits.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

/* ---------------- Drapeaux exacts (dessins simples et fidèles) -------- */

// Tchad : tricolore vertical bleu-jaune-rouge (proportions 2:3).
const drapeauTchad = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
<rect width="300" height="600" fill="#002664"/>
<rect x="300" width="300" height="600" fill="#FECB00"/>
<rect x="600" width="300" height="600" fill="#C60C30"/>
</svg>`;

// USA : 13 bandes + canton aux 50 étoiles (proportions officielles 10:19).
function drapeauUsa() {
  const W = 1900;
  const H = 1000;
  const stripe = H / 13;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">`;
  for (let i = 0; i < 13; i++) {
    out += `<rect y="${(i * stripe).toFixed(2)}" width="${W}" height="${stripe.toFixed(2)}" fill="${i % 2 === 0 ? "#B22234" : "#FFFFFF"}"/>`;
  }
  const cantonW = W * 0.4;
  const cantonH = stripe * 7;
  out += `<rect width="${cantonW}" height="${cantonH.toFixed(2)}" fill="#3C3B6E"/>`;
  const star = (cx, cy, r) => {
    let p = "";
    for (let k = 0; k < 5; k++) {
      const aOut = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
      const aIn = aOut + Math.PI / 5;
      p += `${(cx + r * Math.cos(aOut)).toFixed(1)},${(cy + r * Math.sin(aOut)).toFixed(1)} `;
      p += `${(cx + r * 0.382 * Math.cos(aIn)).toFixed(1)},${(cy + r * 0.382 * Math.sin(aIn)).toFixed(1)} `;
    }
    return `<polygon points="${p.trim()}" fill="#FFFFFF"/>`;
  };
  const gx = cantonW / 12;
  const gy = cantonH / 10;
  const r = gy * 0.55;
  for (let row = 0; row < 9; row++) {
    const cols = row % 2 === 0 ? 6 : 5;
    for (let col = 0; col < cols; col++) {
      const cx = gx * (row % 2 === 0 ? 1 + col * 2 : 2 + col * 2);
      const cy = gy * (1 + row);
      out += star(cx, cy, r);
    }
  }
  return out + "</svg>";
}

/* ---------------- Médaillons de portrait gravés ----------------------- */

const PARTY_COLORS = {
  "Républicain": "#a6192e",
  "Démocrate": "#0a4480",
  "Fédéraliste": "#7a6520",
  "Whig": "#7a6520",
  "Républicain-démocrate": "#4b5f38",
  "Indépendant": "#54430f",
};

function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h = (h ^= h >>> 16) >>> 0;
    return h / 4294967296;
  };
}

/**
 * Buste gravé stylisé, avec variations déterministes (coiffure, col,
 * favoris) pour donner à chaque médaillon son caractère.
 */
function medaillon({ seed, ring, label }) {
  const rand = rng(seed);
  const S = 240;
  const cx = S / 2;
  const skin = "#e8d9c3";
  const ink = "#3d3428";
  const hairVariant = Math.floor(rand() * 4);
  const collarVariant = Math.floor(rand() * 3);
  const sideburns = rand() > 0.55;

  let hair = "";
  if (hairVariant === 0) {
    hair = `<path d="M${cx - 34} 96 Q ${cx - 38} 58 ${cx} 54 Q ${cx + 38} 58 ${cx + 34} 96 Q ${cx + 30} 74 ${cx} 72 Q ${cx - 30} 74 ${cx - 34} 96 Z" fill="${ink}"/>`;
  } else if (hairVariant === 1) {
    hair = `<path d="M${cx - 36} 100 Q ${cx - 40} 52 ${cx - 4} 52 Q ${cx + 42} 54 ${cx + 34} 104 Q ${cx + 26} 70 ${cx - 6} 70 Q ${cx - 32} 72 ${cx - 36} 100 Z" fill="${ink}"/>`;
  } else if (hairVariant === 2) {
    // cheveux courts dégarnis
    hair = `<path d="M${cx - 32} 84 Q ${cx - 26} 62 ${cx} 60 Q ${cx + 26} 62 ${cx + 32} 84 Q ${cx + 18} 72 ${cx} 71 Q ${cx - 18} 72 ${cx - 32} 84 Z" fill="${ink}" opacity="0.85"/>`;
  } else {
    // perruque d'époque nouée
    hair = `<path d="M${cx - 36} 104 Q ${cx - 42} 56 ${cx} 52 Q ${cx + 42} 56 ${cx + 36} 104 L${cx + 30} 118 Q ${cx + 34} 90 ${cx + 26} 82 Q ${cx + 30} 108 ${cx + 22} 120 L${cx - 22} 120 Q ${cx - 30} 108 ${cx - 26} 82 Q ${cx - 34} 90 ${cx - 30} 118 Z" fill="${ink}" opacity="0.9"/>`;
  }

  const burns = sideburns
    ? `<path d="M${cx - 30} 96 Q ${cx - 32} 116 ${cx - 24} 128 L${cx - 20} 124 Q ${cx - 26} 112 ${cx - 26} 96 Z" fill="${ink}" opacity="0.8"/>
<path d="M${cx + 30} 96 Q ${cx + 32} 116 ${cx + 24} 128 L${cx + 20} 124 Q ${cx + 26} 112 ${cx + 26} 96 Z" fill="${ink}" opacity="0.8"/>`
    : "";

  let collar = "";
  if (collarVariant === 0) {
    collar = `<path d="M${cx - 16} 148 L${cx} 168 L${cx + 16} 148 L${cx + 8} 178 L${cx - 8} 178 Z" fill="#f4efe4"/>
<path d="M${cx - 5} 168 L${cx + 5} 168 L${cx + 3} 190 L${cx - 3} 190 Z" fill="${ring}"/>`;
  } else if (collarVariant === 1) {
    collar = `<path d="M${cx - 18} 150 Q ${cx} 166 ${cx + 18} 150 L${cx + 14} 172 Q ${cx} 182 ${cx - 14} 172 Z" fill="#f4efe4"/>`;
  } else {
    collar = `<path d="M${cx - 16} 150 L${cx - 4} 164 L${cx - 12} 176 Z" fill="#f4efe4"/>
<path d="M${cx + 16} 150 L${cx + 4} 164 L${cx + 12} 176 Z" fill="#f4efe4"/>`;
  }

  // Lignes de gravure du fond
  let engraving = "";
  for (let y = 26; y < S - 20; y += 7) {
    engraving += `<line x1="24" y1="${y}" x2="${S - 24}" y2="${y}" stroke="#c9bfa8" stroke-width="1"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
<defs>
<clipPath id="c"><circle cx="${cx}" cy="${S / 2}" r="${S / 2 - 14}"/></clipPath>
<radialGradient id="bg" cx="0.5" cy="0.38" r="0.75">
<stop offset="0" stop-color="#f4ecd9"/><stop offset="1" stop-color="#d8ccb2"/>
</radialGradient>
</defs>
<circle cx="${cx}" cy="${S / 2}" r="${S / 2 - 4}" fill="${ring}"/>
<circle cx="${cx}" cy="${S / 2}" r="${S / 2 - 10}" fill="#f8f3e6"/>
<g clip-path="url(#c)">
<rect width="${S}" height="${S}" fill="url(#bg)"/>
${engraving}
<ellipse cx="${cx}" cy="206" rx="64" ry="58" fill="${ink}"/>
<ellipse cx="${cx}" cy="204" rx="58" ry="52" fill="#5a4d3c"/>
<rect x="${cx - 10}" y="132" width="20" height="30" fill="${skin}"/>
<ellipse cx="${cx}" cy="104" rx="34" ry="42" fill="${skin}"/>
<path d="M${cx - 12} 108 Q ${cx} 104 ${cx + 12} 108" stroke="#b39a76" stroke-width="2.5" fill="none"/>
<circle cx="${cx - 13}" cy="96" r="3" fill="${ink}"/>
<circle cx="${cx + 13}" cy="96" r="3" fill="${ink}"/>
<path d="M${cx - 8} 124 Q ${cx} 129 ${cx + 8} 124" stroke="#a5825d" stroke-width="2.5" fill="none"/>
${hair}
${burns}
${collar}
</g>
<circle cx="${cx}" cy="${S / 2}" r="${S / 2 - 10}" fill="none" stroke="#b7a984" stroke-width="2"/>
<text x="${cx}" y="${S - 22}" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#f8f3e6">${label}</text>
</svg>`;
}

/* ---------------- Données minimales --------------------------------- */

const presidents = [
  [1, "1789-1797", "Indépendant"], [2, "1797-1801", "Fédéraliste"],
  [3, "1801-1809", "Républicain-démocrate"], [4, "1809-1817", "Républicain-démocrate"],
  [5, "1817-1825", "Républicain-démocrate"], [6, "1825-1829", "Républicain-démocrate"],
  [7, "1829-1837", "Démocrate"], [8, "1837-1841", "Démocrate"],
  [9, "1841", "Whig"], [10, "1841-1845", "Whig"],
  [11, "1845-1849", "Démocrate"], [12, "1849-1850", "Whig"],
  [13, "1850-1853", "Whig"], [14, "1853-1857", "Démocrate"],
  [15, "1857-1861", "Démocrate"], [16, "1861-1865", "Républicain"],
  [17, "1865-1869", "Démocrate"], [18, "1869-1877", "Républicain"],
  [19, "1877-1881", "Républicain"], [20, "1881", "Républicain"],
  [21, "1881-1885", "Républicain"], [22, "1885-1889", "Démocrate"],
  [23, "1889-1893", "Républicain"], [24, "1893-1897", "Démocrate"],
  [25, "1897-1901", "Républicain"], [26, "1901-1909", "Républicain"],
  [27, "1909-1913", "Républicain"], [28, "1913-1921", "Démocrate"],
  [29, "1921-1923", "Républicain"], [30, "1923-1929", "Républicain"],
  [31, "1929-1933", "Républicain"], [32, "1933-1945", "Démocrate"],
  [33, "1945-1953", "Démocrate"], [34, "1953-1961", "Républicain"],
  [35, "1961-1963", "Démocrate"], [36, "1963-1969", "Démocrate"],
  [37, "1969-1974", "Républicain"], [38, "1974-1977", "Républicain"],
  [39, "1977-1981", "Démocrate"], [40, "1981-1989", "Républicain"],
  [41, "1989-1993", "Républicain"], [42, "1993-2001", "Démocrate"],
  [43, "2001-2009", "Républicain"], [44, "2009-2017", "Démocrate"],
  [45, "2017-2021", "Républicain"], [46, "2021-2025", "Démocrate"],
  [47, "2025-aujourd'hui", "Républicain"],
];

const chefsTchad = [
  [1, "1960-1975"], [2, "1975-1979"], [3, "1979"], [4, "1979-1982"],
  [5, "1982-1990"], [6, "1990-2021"], [7, "2021-auj."],
];

/* ---------------- Génération ----------------------------------------- */

write(path.join(OUT, "drapeau-td.svg"), drapeauTchad);
write(path.join(OUT, "drapeau-us.svg"), drapeauUsa());

for (const [n, periode, parti] of presidents) {
  write(
    path.join(OUT, "presidents", `medaillon-${n}.svg`),
    medaillon({
      seed: `pres-${n}-${periode}`,
      ring: PARTY_COLORS[parti] ?? "#54430f",
      label: `N° ${n}`,
    })
  );
}

for (const [i, periode] of chefsTchad) {
  write(
    path.join(OUT, "tchad-chefs", `medaillon-${i}.svg`),
    medaillon({
      seed: `tchad-${i}-${periode}`,
      ring: i % 2 === 0 ? "#C60C30" : "#002664",
      label: periode,
    })
  );
}

console.log(
  `✓ 2 drapeaux + ${presidents.length} médaillons présidentiels + ${chefsTchad.length} médaillons tchadiens générés.`
);
