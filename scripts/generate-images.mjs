/**
 * Génère les illustrations SVG du site (bannières et vignettes des
 * provinces du Tchad et des États américains) dans public/images/.
 * Paysages stylisés, déterministes (variés par slug), sans aucune
 * dépendance externe : les images sont servies par le site lui-même.
 *
 * Usage : node scripts/generate-images.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images");
const W = 800;
const H = 450;

/** Petit générateur pseudo-aléatoire déterministe à partir d'un texte. */
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) {
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

const svgOpen = (
  defs
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>${defs}</defs>`;

function sky(id, top, bottom) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
</linearGradient>`;
}

function sun(r, cx, cy, color, halo) {
  return `<circle cx="${cx}" cy="${cy}" r="${r * 2.6}" fill="${halo}" opacity="0.35"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
}

/** Chaîne de collines/dunes : une courbe douce remplie. */
function ridge(rand, baseY, amp, color, opacity = 1) {
  let d = `M0 ${H} L0 ${baseY}`;
  const bumps = 4 + Math.floor(rand() * 3);
  const step = W / bumps;
  for (let i = 0; i < bumps; i++) {
    const x1 = i * step + step * 0.5;
    const y1 = baseY - amp * (0.4 + rand() * 0.9);
    const x2 = (i + 1) * step;
    const y2 = baseY - amp * (rand() * 0.5);
    d += ` Q ${x1.toFixed(0)} ${y1.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`;
  }
  d += ` L${W} ${H} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

function palm(x, y, s, color) {
  const leaves = [-70, -35, 0, 35, 70]
    .map(
      (a) =>
        `<path d="M0 0 Q ${Math.sin((a * Math.PI) / 180) * 34} ${-26 - Math.cos((a * Math.PI) / 180) * 12} ${Math.sin((a * Math.PI) / 180) * 58} ${-14 - Math.cos((a * Math.PI) / 180) * 20}" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    )
    .join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M-3 0 Q 2 -30 8 -52" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
<g transform="translate(8 -52)">${leaves}</g></g>`;
}

function acacia(x, y, s, color) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M0 0 L-4 -34 M-4 -34 L-20 -48 M-4 -34 L14 -50" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="-2" cy="-56" rx="42" ry="12" fill="${color}"/></g>`;
}

function pirogue(x, y, s, color) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M-40 0 Q 0 14 40 0 Q 20 6 0 6 Q -20 6 -40 0 Z" fill="${color}"/>
<path d="M6 2 L10 -26" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
<circle cx="10" cy="-30" r="5" fill="${color}"/></g>`;
}

function birds(rand, color) {
  let out = "";
  for (let i = 0; i < 3; i++) {
    const x = 80 + rand() * 500;
    const y = 60 + rand() * 90;
    const s = 0.6 + rand() * 0.7;
    out += `<path d="M${x} ${y} q ${8 * s} ${-7 * s} ${16 * s} 0 q ${8 * s} ${-7 * s} ${16 * s} 0" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}

function skyline(rand, baseY, color) {
  let out = "";
  let x = 20;
  while (x < W - 40) {
    const w = 34 + rand() * 60;
    const h = 60 + rand() * 150;
    out += `<rect x="${x.toFixed(0)}" y="${(baseY - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${color}"/>`;
    if (rand() > 0.5) {
      for (let wy = baseY - h + 12; wy < baseY - 12; wy += 22) {
        for (let wx = x + 7; wx < x + w - 10; wx += 16) {
          if (rng(`${wx}-${wy}`)() > 0.45)
            out += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="9" fill="#ffd9a0" opacity="0.8"/>`;
        }
      }
    }
    x += w + 10 + rand() * 26;
  }
  return out;
}

function mountains(rand, baseY, amp, color, snow) {
  let out = "";
  let x = -60;
  while (x < W + 60) {
    const w = 180 + rand() * 160;
    const peakX = x + w / 2 + (rand() - 0.5) * 40;
    const peakY = baseY - amp * (0.7 + rand() * 0.5);
    out += `<path d="M${x} ${baseY} L${peakX.toFixed(0)} ${peakY.toFixed(0)} L${x + w} ${baseY} Z" fill="${color}"/>`;
    if (snow)
      out += `<path d="M${(peakX - w * 0.12).toFixed(0)} ${(peakY + amp * 0.22).toFixed(0)} L${peakX.toFixed(0)} ${peakY.toFixed(0)} L${(peakX + w * 0.12).toFixed(0)} ${(peakY + amp * 0.22).toFixed(0)} Q ${peakX.toFixed(0)} ${(peakY + amp * 0.3).toFixed(0)} ${(peakX - w * 0.12).toFixed(0)} ${(peakY + amp * 0.22).toFixed(0)} Z" fill="#f5f8fc"/>`;
    x += w * 0.72;
  }
  return out;
}

function barn(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
<rect x="-34" y="-30" width="68" height="30" fill="#8f2b26"/>
<path d="M-40 -30 L0 -56 L40 -30 Z" fill="#6d1f1b"/>
<rect x="-9" y="-22" width="18" height="22" fill="#4a1512"/>
<rect x="26" y="-96" width="8" height="66" fill="#9aa3ad"/>
<ellipse cx="30" cy="-100" rx="16" ry="7" fill="#9aa3ad"/></g>`;
}

const SCENES = {
  desert(rand) {
    return `${svgOpen(sky("s", "#ffdf9e", "#f7a94e"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(46, 150 + rand() * 480, 120, "#fff3d1", "#ffe9b0")}
${birds(rand, "#7a4a1f")}
${ridge(rand, 300, 70, "#e0913f")}
${ridge(rand, 350, 60, "#c9742e")}
${ridge(rand, 400, 45, "#a55a22")}
${palm(120 + rand() * 160, 395, 1.15, "#5c3a14")}
${palm(560 + rand() * 160, 408, 0.9, "#5c3a14")}
</svg>`;
  },
  savanna(rand) {
    return `${svgOpen(sky("s", "#ffe9b8", "#f0b45c"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(42, 560 + rand() * 160, 120, "#fff4d6", "#ffe9b0")}
${birds(rand, "#6b4318")}
${ridge(rand, 320, 40, "#caa14e", 0.9)}
${ridge(rand, 370, 35, "#a97f36")}
${ridge(rand, 412, 26, "#7d5a24")}
${acacia(150 + rand() * 140, 398, 1.25, "#4c3411")}
${acacia(560 + rand() * 140, 412, 0.85, "#4c3411")}
</svg>`;
  },
  water(rand) {
    return `${svgOpen(sky("s", "#cfe8f7", "#7db8dc") + sky("w", "#5fa3cc", "#2b6f9e"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(40, 160 + rand() * 420, 110, "#fff8e0", "#fff0c4")}
${birds(rand, "#2d5b7a")}
${ridge(rand, 260, 45, "#7fae7a", 0.9)}
<rect y="290" width="${W}" height="${H - 290}" fill="url(#w)"/>
<path d="M0 292 Q ${W / 2} ${282 + rand() * 14} ${W} 292 L${W} 300 Q ${W / 2} 306 0 300 Z" fill="#bfe0ef" opacity="0.5"/>
${pirogue(240 + rand() * 300, 350, 1.2, "#33281a")}
<g stroke="#3f7d3a" stroke-width="5" stroke-linecap="round">
<path d="M60 ${H} L54 372"/><path d="M78 ${H} L80 362"/><path d="M96 ${H} L104 376"/>
<path d="M710 ${H} L704 370"/><path d="M730 ${H} L736 360"/>
</g>
</svg>`;
  },
  mountain(rand) {
    return `${svgOpen(sky("s", "#dbe9f7", "#9db8d6"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(38, 620, 100, "#fff6df", "#ffedbe")}
${birds(rand, "#41586f")}
${mountains(rand, 340, 220, "#5a708a", true)}
${mountains(rand, 400, 150, "#3e5065", false)}
${ridge(rand, 420, 30, "#2c3b4d")}
</svg>`;
  },
  city(rand) {
    return `${svgOpen(sky("s", "#ffd9a8", "#e07b52"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(44, 170 + rand() * 420, 130, "#fff1cf", "#ffe4ad")}
${birds(rand, "#5e3324")}
${skyline(rand, 400, "#38455a")}
<rect y="400" width="${W}" height="${H - 400}" fill="#222d3d"/>
</svg>`;
  },
  plains(rand) {
    return `${svgOpen(sky("s", "#d8ecfb", "#9ecdec"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(42, 150 + rand() * 460, 110, "#fff8e2", "#fff0c6")}
${birds(rand, "#4a6a4a")}
${ridge(rand, 300, 26, "#b9cf6e", 0.9)}
${ridge(rand, 340, 22, "#8fb84f")}
${ridge(rand, 385, 18, "#5f8f3a")}
${barn(560 + rand() * 120, 395, 1.05)}
</svg>`;
  },
  coast(rand) {
    return `${svgOpen(sky("s", "#ffe3c1", "#f6a06b") + sky("w", "#4d90bd", "#245e8a"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(48, 400, 210, "#fff0cd", "#ffdf9e")}
${birds(rand, "#8a4a2a")}
<rect y="250" width="${W}" height="${H - 250}" fill="url(#w)"/>
<path d="M0 252 Q ${W / 2} 244 ${W} 252 L${W} 262 Q ${W / 2} 268 0 262 Z" fill="#ffd9a8" opacity="0.6"/>
${ridge(rand, H, 90, "#e8cf9e")}
${palm(110 + rand() * 90, 420, 1.2, "#3f4a33")}
</svg>`;
  },
};

/** Bannières « héro » composées, plus larges. */
function hero(kind) {
  const rand = rng(kind);
  if (kind === "tchad") {
    return `${svgOpen(sky("s", "#ffd98f", "#e8863c") + sky("w", "#4d90bd", "#2b6f9e"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(52, 590, 120, "#fff3d1", "#ffe9b0")}
${birds(rand, "#6b3a16")}
${ridge(rand, 270, 80, "#dd8c3c", 0.95)}
${ridge(rand, 330, 60, "#b96c2c")}
<rect y="356" width="${W}" height="${H - 356}" fill="url(#w)"/>
${pirogue(300, 400, 1.3, "#2e2313")}
${palm(90, 356, 1.3, "#4c3411")}
${palm(710, 360, 1.05, "#4c3411")}
</svg>`;
  }
  if (kind === "usa") {
    return `${svgOpen(sky("s", "#c9ddf3", "#8fb4dd"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(44, 170, 110, "#fff6df", "#ffedbe")}
${birds(rand, "#3d5570")}
${mountains(rand, 330, 190, "#5a708a", true)}
${skyline(rand, 430, "#33415a")}
<rect y="430" width="${W}" height="${H - 430}" fill="#1f2a3c"/>
</svg>`;
  }
  // accueil : les deux pays réunis (dunes + skyline au loin)
  return `${svgOpen(sky("s", "#ffd9a0", "#d97b45") + sky("w", "#4d90bd", "#245e8a"))}
<rect width="${W}" height="${H}" fill="url(#s)"/>
${sun(50, 400, 130, "#fff1cd", "#ffe2a6")}
${birds(rand, "#5e3324")}
${skyline(rng("skyline-accueil"), 300, "#54617a")}
${ridge(rng("dunes-accueil"), 330, 70, "#dd8c3c")}
<rect y="380" width="${W}" height="${H - 380}" fill="url(#w)"/>
${pirogue(250, 415, 1.2, "#2e2313")}
${palm(700, 384, 1.1, "#4c3411")}
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Attribution des scènes                                              */
/* ------------------------------------------------------------------ */

const provincesThemes = {
  batha: "savanna",
  "bahr-el-gazel": "desert",
  borkou: "desert",
  "chari-baguirmi": "water",
  "ennedi-est": "desert",
  "ennedi-ouest": "desert",
  guera: "mountain",
  "hadjer-lamis": "savanna",
  kanem: "desert",
  lac: "water",
  "logone-occidental": "city",
  "logone-oriental": "savanna",
  mandoul: "water",
  "mayo-kebbi-est": "water",
  "mayo-kebbi-ouest": "water",
  "moyen-chari": "water",
  ndjamena: "city",
  ouaddai: "city",
  salamat: "savanna",
  sila: "savanna",
  tandjile: "water",
  tibesti: "mountain",
  "wadi-fira": "savanna",
};

const etatsThemes = {
  alabama: "plains",
  alaska: "mountain",
  arizona: "desert",
  arkansas: "plains",
  californie: "coast",
  "caroline-du-nord": "coast",
  "caroline-du-sud": "coast",
  colorado: "mountain",
  connecticut: "coast",
  "dakota-du-nord": "plains",
  "dakota-du-sud": "plains",
  delaware: "coast",
  floride: "coast",
  georgie: "city",
  hawai: "coast",
  idaho: "mountain",
  illinois: "city",
  indiana: "plains",
  iowa: "plains",
  kansas: "plains",
  kentucky: "plains",
  louisiane: "water",
  maine: "coast",
  maryland: "coast",
  massachusetts: "city",
  michigan: "water",
  minnesota: "water",
  mississippi: "water",
  missouri: "plains",
  montana: "mountain",
  nebraska: "plains",
  nevada: "desert",
  "new-hampshire": "mountain",
  "new-jersey": "coast",
  "new-york": "city",
  "nouveau-mexique": "desert",
  ohio: "city",
  oklahoma: "plains",
  oregon: "mountain",
  pennsylvanie: "city",
  "rhode-island": "coast",
  tennessee: "city",
  texas: "city",
  utah: "desert",
  vermont: "mountain",
  virginie: "coast",
  "virginie-occidentale": "mountain",
  washington: "mountain",
  wisconsin: "plains",
  wyoming: "mountain",
};

function writeSvg(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.replace(/\n+/g, "\n"));
}

writeSvg(path.join(OUT, "hero-accueil.svg"), hero("accueil"));
writeSvg(path.join(OUT, "hero-tchad.svg"), hero("tchad"));
writeSvg(path.join(OUT, "hero-usa.svg"), hero("usa"));

for (const [slug, theme] of Object.entries(provincesThemes)) {
  writeSvg(
    path.join(OUT, "tchad", `${slug}.svg`),
    SCENES[theme](rng(`tchad-${slug}`))
  );
}
for (const [slug, theme] of Object.entries(etatsThemes)) {
  writeSvg(
    path.join(OUT, "usa", `${slug}.svg`),
    SCENES[theme](rng(`usa-${slug}`))
  );
}

const count =
  3 + Object.keys(provincesThemes).length + Object.keys(etatsThemes).length;
console.log(`✓ ${count} illustrations générées dans public/images/`);
