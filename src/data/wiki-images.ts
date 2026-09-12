/**
 * Articles Wikipédia dont l'image principale illustre chaque élément
 * (portrait officiel, monument emblématique, paysage). Les photos sont
 * récupérées par le serveur via src/lib/wiki.ts ; en cas d'absence,
 * l'illustration locale de public/images/ prend le relais.
 */

/** Présidences américaines : numéro → article (Wikipédia anglophone). */
export const presidentsWiki: Record<number, string> = {
  1: "George Washington", 2: "John Adams", 3: "Thomas Jefferson",
  4: "James Madison", 5: "James Monroe", 6: "John Quincy Adams",
  7: "Andrew Jackson", 8: "Martin Van Buren", 9: "William Henry Harrison",
  10: "John Tyler", 11: "James K. Polk", 12: "Zachary Taylor",
  13: "Millard Fillmore", 14: "Franklin Pierce", 15: "James Buchanan",
  16: "Abraham Lincoln", 17: "Andrew Johnson", 18: "Ulysses S. Grant",
  19: "Rutherford B. Hayes", 20: "James A. Garfield", 21: "Chester A. Arthur",
  22: "Grover Cleveland", 23: "Benjamin Harrison", 24: "Grover Cleveland",
  25: "William McKinley", 26: "Theodore Roosevelt", 27: "William Howard Taft",
  28: "Woodrow Wilson", 29: "Warren G. Harding", 30: "Calvin Coolidge",
  31: "Herbert Hoover", 32: "Franklin D. Roosevelt", 33: "Harry S. Truman",
  34: "Dwight D. Eisenhower", 35: "John F. Kennedy", 36: "Lyndon B. Johnson",
  37: "Richard Nixon", 38: "Gerald Ford", 39: "Jimmy Carter",
  40: "Ronald Reagan", 41: "George H. W. Bush", 42: "Bill Clinton",
  43: "George W. Bush", 44: "Barack Obama", 45: "Donald Trump",
  46: "Joe Biden", 47: "Donald Trump",
};

/** Chefs d'État tchadiens, dans l'ordre de src/data/tchad.ts (Wikipédia francophone). */
export const chefsTchadWiki: string[] = [
  "François Tombalbaye",
  "Félix Malloum",
  "Lol Mahamat Choua",
  "Goukouni Oueddei",
  "Hissène Habré",
  "Idriss Déby",
  "Mahamat Idriss Déby",
];

/** Figures marquantes : nom affiché → article. */
export const figuresWiki: Record<string, { title: string; lang: "fr" | "en" }> = {
  "Toumaï (Sahelanthropus tchadensis)": { title: "Sahelanthropus tchadensis", lang: "fr" },
  "Félix Éboué": { title: "Félix Éboué", lang: "fr" },
  "Joseph Brahim Seïd": { title: "Joseph Brahim Seid", lang: "fr" },
  "Nimrod Bena Djangrang": { title: "Nimrod (écrivain)", lang: "fr" },
  "Kaltouma Nadjina": { title: "Kaltouma Nadjina", lang: "fr" },
  "Japhet N'Doram": { title: "Japhet N'Doram", lang: "fr" },
  "Achta Ahmat Breme": { title: "Achta Ahmat Breme", lang: "fr" },
  "Harriet Tubman": { title: "Harriet Tubman", lang: "en" },
  "Abraham Lincoln": { title: "Abraham Lincoln", lang: "en" },
  "Martin Luther King Jr.": { title: "Martin Luther King Jr.", lang: "en" },
  "Rosa Parks": { title: "Rosa Parks", lang: "en" },
  "Neil Armstrong": { title: "Neil Armstrong", lang: "en" },
  "Muhammad Ali": { title: "Muhammad Ali", lang: "en" },
  "Katherine Johnson": { title: "Katherine Johnson", lang: "en" },
};

/** États américains : slug → lieu emblématique photographié (Wikipédia anglophone). */
export const etatsWiki: Record<string, string> = {
  alabama: "Montgomery, Alabama",
  alaska: "Denali",
  arizona: "Grand Canyon",
  arkansas: "Hot Springs National Park",
  californie: "Golden Gate Bridge",
  "caroline-du-nord": "Blue Ridge Parkway",
  "caroline-du-sud": "Charleston, South Carolina",
  colorado: "Rocky Mountain National Park",
  connecticut: "Yale University",
  "dakota-du-nord": "Theodore Roosevelt National Park",
  "dakota-du-sud": "Mount Rushmore",
  delaware: "Rehoboth Beach, Delaware",
  floride: "Miami Beach, Florida",
  georgie: "Atlanta",
  hawai: "Waikiki",
  idaho: "Boise, Idaho",
  illinois: "Chicago",
  indiana: "Indianapolis Motor Speedway",
  iowa: "Des Moines, Iowa",
  kansas: "Flint Hills",
  kentucky: "Churchill Downs",
  louisiane: "French Quarter",
  maine: "Acadia National Park",
  maryland: "Annapolis, Maryland",
  massachusetts: "Boston",
  michigan: "Detroit",
  minnesota: "Minneapolis",
  mississippi: "Mississippi River",
  missouri: "Gateway Arch",
  montana: "Glacier National Park (U.S.)",
  nebraska: "Chimney Rock National Historic Site",
  nevada: "Las Vegas Strip",
  "new-hampshire": "White Mountains (New Hampshire)",
  "new-jersey": "Atlantic City, New Jersey",
  "new-york": "Statue of Liberty",
  "nouveau-mexique": "Santa Fe, New Mexico",
  ohio: "Cleveland",
  oklahoma: "Oklahoma City",
  oregon: "Crater Lake",
  pennsylvanie: "Independence Hall",
  "rhode-island": "Newport, Rhode Island",
  tennessee: "Great Smoky Mountains National Park",
  texas: "Texas State Capitol",
  utah: "Zion National Park",
  vermont: "Stowe, Vermont",
  virginie: "Mount Vernon",
  "virginie-occidentale": "New River Gorge Bridge",
  washington: "Seattle",
  wisconsin: "Milwaukee",
  wyoming: "Yellowstone National Park",
};

/** Provinces du Tchad : slug → chef-lieu ou site emblématique (Wikipédia francophone). */
export const provincesWiki: Record<string, string> = {
  batha: "Ati (Tchad)",
  "bahr-el-gazel": "Moussoro",
  borkou: "Faya-Largeau",
  "chari-baguirmi": "Massenya",
  "ennedi-est": "Ennedi",
  "ennedi-ouest": "Fada (Tchad)",
  guera: "Mongo (Tchad)",
  "hadjer-lamis": "Massakory",
  kanem: "Mao (Tchad)",
  lac: "Lac Tchad",
  "logone-occidental": "Moundou",
  "logone-oriental": "Doba (Tchad)",
  mandoul: "Koumra",
  "mayo-kebbi-est": "Bongor",
  "mayo-kebbi-ouest": "Pala (Tchad)",
  "moyen-chari": "Sarh",
  ndjamena: "N'Djaména",
  ouaddai: "Abéché",
  salamat: "Parc national de Zakouma",
  sila: "Goz Beïda",
  tandjile: "Laï",
  tibesti: "Tibesti",
  "wadi-fira": "Biltine",
};

/** Bannières des pays. */
export const paysWiki = {
  tchad: { title: "N'Djaména", lang: "fr" as const },
  usa: { title: "Washington, D.C.", lang: "en" as const },
};
