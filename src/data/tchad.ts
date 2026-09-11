/**
 * Contenu éditorial sur le Tchad : histoire, chefs d'État, figures
 * marquantes et les 23 provinces (découpage administratif de 2018).
 * Textes de présentation générale à vocation informative.
 */

export const histoireTchad: { titre: string; texte: string }[] = [
  {
    titre: "Le berceau de l'humanité",
    texte:
      "Le Tchad occupe une place unique dans l'histoire de l'humanité : c'est dans le désert du Djourab qu'a été découvert en 2001 « Toumaï » (Sahelanthropus tchadensis), vieux d'environ 7 millions d'années, considéré comme l'un des plus anciens représentants connus de la lignée humaine. Bien plus tard, les peintures rupestres de l'Ennedi et du Tibesti témoignent d'un Sahara autrefois verdoyant et habité.",
  },
  {
    titre: "Les grands royaumes et sultanats",
    texte:
      "Du IXe au XIXe siècle, l'espace tchadien est structuré par de puissants États : l'empire du Kanem puis du Kanem-Bornou autour du lac Tchad, le royaume du Baguirmi et le sultanat du Ouaddaï à l'est. Ces royaumes prospèrent grâce au commerce transsaharien, à l'islamisation progressive et à des administrations organisées, et rayonnent bien au-delà des frontières actuelles.",
  },
  {
    titre: "La période coloniale (1900-1960)",
    texte:
      "À partir de 1900, la France conquiert progressivement le territoire, intégré à l'Afrique-Équatoriale française en 1920. Le Tchad se distingue pendant la Seconde Guerre mondiale : sous l'impulsion du gouverneur Félix Éboué, premier gouverneur noir de l'empire colonial français, il est le premier territoire à rallier la France libre du général de Gaulle en 1940. La colonne Leclerc partira du Tchad pour ses victoires de Koufra et du Fezzan.",
  },
  {
    titre: "L'indépendance et la construction nationale",
    texte:
      "Le Tchad proclame son indépendance le 11 août 1960, avec François Tombalbaye comme premier président. Les décennies suivantes sont marquées par des tensions entre le nord et le sud, des rébellions armées, le conflit avec la Libye autour de la bande d'Aozou (récupérée en 1994 par décision de la Cour internationale de justice) et une succession de régimes militaires.",
  },
  {
    titre: "Le Tchad contemporain",
    texte:
      "Depuis les années 2000, l'exploitation pétrolière (oléoduc Doba-Kribi inauguré en 2003) a transformé l'économie. Le Tchad est devenu un acteur militaire majeur du Sahel dans la lutte contre les groupes armés autour du lac Tchad. Après trois décennies de pouvoir d'Idriss Déby Itno, tué au front en 2021, une transition dirigée par son fils Mahamat Idriss Déby Itno a conduit à l'élection présidentielle de 2024. Pays de plus de 18 millions d'habitants, jeune et multiculturel, le Tchad compte plus de 120 langues et une diaspora dynamique, notamment aux États-Unis.",
  },
];

export const chefsEtatTchad: {
  nom: string;
  periode: string;
  note: string;
}[] = [
  {
    nom: "François Tombalbaye",
    periode: "1960 – 1975",
    note: "Premier président du Tchad indépendant, artisan de l'indépendance du 11 août 1960. Son régime s'achève lors du coup d'État militaire d'avril 1975.",
  },
  {
    nom: "Félix Malloum",
    periode: "1975 – 1979",
    note: "Général porté au pouvoir par le Conseil supérieur militaire après 1975 ; il tente une réconciliation avec les rébellions du nord avant de quitter le pouvoir en 1979.",
  },
  {
    nom: "Lol Mahamat Choua",
    periode: "1979",
    note: "Président du premier Gouvernement d'union nationale de transition (GUNT) pendant quelques mois en 1979, au plus fort de la guerre civile.",
  },
  {
    nom: "Goukouni Oueddei",
    periode: "1979 – 1982",
    note: "Figure du nord, chef du GUNT ; son gouvernement est renversé en 1982 à l'issue de la guerre civile.",
  },
  {
    nom: "Hissène Habré",
    periode: "1982 – 1990",
    note: "Son régime, marqué par la guerre contre la Libye, est aussi resté associé à de graves violations des droits humains, jugées par les Chambres africaines extraordinaires de Dakar en 2016.",
  },
  {
    nom: "Idriss Déby Itno",
    periode: "1990 – 2021",
    note: "Arrivé au pouvoir en décembre 1990, il dirige le pays pendant plus de trente ans, fait du Tchad un acteur central de la sécurité au Sahel, et meurt au front en avril 2021 face à une rébellion.",
  },
  {
    nom: "Mahamat Idriss Déby Itno",
    periode: "2021 – aujourd'hui",
    note: "Président du Conseil militaire de transition à partir d'avril 2021, puis président élu à l'issue de l'élection présidentielle de mai 2024.",
  },
];

export const figuresTchad: { nom: string; domaine: string; note: string }[] = [
  {
    nom: "Toumaï (Sahelanthropus tchadensis)",
    domaine: "Préhistoire",
    note: "Fossile vieux d'environ 7 millions d'années découvert au Djourab en 2001 : un symbole national qui fait du Tchad un berceau de l'humanité.",
  },
  {
    nom: "Félix Éboué",
    domaine: "Histoire",
    note: "Gouverneur du Tchad en 1940, il rallie le territoire à la France libre — un acte fondateur de la résistance depuis l'Afrique.",
  },
  {
    nom: "Joseph Brahim Seïd",
    domaine: "Littérature",
    note: "Écrivain et magistrat, auteur du classique « Au Tchad sous les étoiles », pionnier de la littérature tchadienne.",
  },
  {
    nom: "Nimrod Bena Djangrang",
    domaine: "Littérature",
    note: "Poète, romancier et essayiste parmi les plus reconnus de la littérature africaine francophone contemporaine.",
  },
  {
    nom: "Kaltouma Nadjina",
    domaine: "Sport",
    note: "Sprinteuse, championne d'Afrique du 400 m, porte-drapeau du sport tchadien sur la scène internationale.",
  },
  {
    nom: "Japhet N'Doram",
    domaine: "Football",
    note: "Surnommé « le Sorcier », milieu offensif emblématique du FC Nantes dans les années 1990, légende du football tchadien.",
  },
  {
    nom: "Achta Ahmat Breme",
    domaine: "Musique",
    note: "Voix féminine emblématique de la chanson tchadienne, ambassadrice des cultures du pays.",
  },
];

export type Province = {
  slug: string;
  nom: string;
  chefLieu: string;
  apropos: string;
  economie: string;
};

export const provincesTchad: Province[] = [
  {
    slug: "batha",
    nom: "Batha",
    chefLieu: "Ati",
    apropos:
      "Province du centre du pays, traversée par le ouadi Batha, au carrefour des mondes sahélien et saharien. Terre d'élevage par excellence, elle est le berceau de grandes traditions pastorales arabes et kanembou.",
    economie:
      "Élevage de dromadaires, bovins et petits ruminants, grands marchés à bétail (Ati, Oum-Hadjer), cultures pluviales de mil et de sorgho, gomme arabique.",
  },
  {
    slug: "bahr-el-gazel",
    nom: "Bahr el Gazel",
    chefLieu: "Moussoro",
    apropos:
      "Province sahélienne créée en 2008, sur l'ancien lit fossile du « fleuve des gazelles ». Société largement pastorale, réputée pour ses puits profonds et ses grandes transhumances.",
    economie:
      "Élevage camelin et bovin, commerce de bétail vers N'Djamena et la Libye, natron, maraîchage dans les ouadis.",
  },
  {
    slug: "borkou",
    nom: "Borkou",
    chefLieu: "Faya-Largeau",
    apropos:
      "Immense province saharienne autour de la plus grande oasis du pays, Faya-Largeau. Paysages de palmeraies, de regs et de dunes, sur les routes caravanières historiques.",
    economie:
      "Dattes (une des premières régions productrices), sel et natron, commerce transsaharien, perspectives minières.",
  },
  {
    slug: "chari-baguirmi",
    nom: "Chari-Baguirmi",
    chefLieu: "Massenya",
    apropos:
      "Héritière du royaume du Baguirmi fondé au XVIe siècle, dont Massenya fut la capitale. Plaines fertiles entre Chari et Logone, aux portes de N'Djamena.",
    economie:
      "Agriculture vivrière (sorgho, maïs, arachide), élevage, pêche fluviale, approvisionnement des marchés de la capitale.",
  },
  {
    slug: "ennedi-est",
    nom: "Ennedi-Est",
    chefLieu: "Am-Djarass",
    apropos:
      "Partie orientale du massif de l'Ennedi, aux paysages spectaculaires d'arches et de canyons ornés de milliers de peintures rupestres, classés au patrimoine mondial de l'UNESCO.",
    economie:
      "Élevage camelin nomade, tourisme saharien naissant (guelta d'Archeï), artisanat.",
  },
  {
    slug: "ennedi-ouest",
    nom: "Ennedi-Ouest",
    chefLieu: "Fada",
    apropos:
      "Versant occidental de l'Ennedi, autour de l'oasis de Fada. Territoire toubou aux traditions nomades vivaces, entre plateaux gréseux et palmeraies.",
    economie:
      "Élevage transhumant, dattes, tourisme de désert, échanges avec la Libye.",
  },
  {
    slug: "guera",
    nom: "Guéra",
    chefLieu: "Mongo",
    apropos:
      "Province de montagnes granitiques au cœur du pays, terre des peuples hadjeraï, réputée pour ses paysages d'inselbergs et sa forte identité culturelle.",
    economie:
      "Céréales (mil, sorgho), arachide et sésame, élevage, apiculture et karité sur les massifs.",
  },
  {
    slug: "hadjer-lamis",
    nom: "Hadjer-Lamis",
    chefLieu: "Massakory",
    apropos:
      "Plaines sahéliennes au nord-est de N'Djamena, entre le lac Tchad et le Chari, ponctuées de collines rocheuses (« hadjer » signifie pierre en arabe).",
    economie:
      "Élevage bovin, cultures de décrue, spiruline du lac, commerce vers la capitale et le Nigeria.",
  },
  {
    slug: "kanem",
    nom: "Kanem",
    chefLieu: "Mao",
    apropos:
      "Cœur historique de l'empire du Kanem, l'un des plus anciens États d'Afrique subsaharienne. Dunes fixées, ouadis verdoyants et sultanat toujours vivant à Mao.",
    economie:
      "Élevage, dattes et maraîchage des ouadis, natron du lac, artisanat du cuir.",
  },
  {
    slug: "lac",
    nom: "Lac",
    chefLieu: "Bol",
    apropos:
      "Province riveraine du lac Tchad, mosaïque d'îles et de polders. Espace stratégique et fragile, confronté au retrait des eaux et aux défis sécuritaires régionaux.",
    economie:
      "Polders très fertiles (maïs, blé, niébé), pêche, spiruline récoltée par les femmes kanembou, élevage.",
  },
  {
    slug: "logone-occidental",
    nom: "Logone Occidental",
    chefLieu: "Moundou",
    apropos:
      "Petite province densément peuplée du sud, autour de Moundou, capitale économique du pays et ville industrielle historique (brasseries, coton).",
    economie:
      "Coton, industrie agroalimentaire, brasserie, commerce, cultures vivrières et pétrole à proximité.",
  },
  {
    slug: "logone-oriental",
    nom: "Logone Oriental",
    chefLieu: "Doba",
    apropos:
      "Province du bassin pétrolier de Doba, en zone soudanienne fertile. Savanes, terres agricoles généreuses et forte croissance démographique.",
    economie:
      "Pétrole (champs de Doba et oléoduc vers Kribi), coton, arachide, manioc, cultures vivrières.",
  },
  {
    slug: "mandoul",
    nom: "Mandoul",
    chefLieu: "Koumra",
    apropos:
      "Province méridionale arrosée par le Mandoul, affluent du Chari. Terroir sara aux villages agricoles prospères et aux traditions d'initiation réputées.",
    economie:
      "Coton, riz et sorgho, karité, élevage, pêche dans les plaines inondables.",
  },
  {
    slug: "mayo-kebbi-est",
    nom: "Mayo-Kebbi Est",
    chefLieu: "Bongor",
    apropos:
      "Plaines du fleuve Logone à la frontière camerounaise, pays des Massa et des Toupouri, célèbre pour ses cavaliers et la lutte traditionnelle.",
    economie:
      "Riz des plaines inondables, pêche, élevage, coton, échanges transfrontaliers avec le Cameroun.",
  },
  {
    slug: "mayo-kebbi-ouest",
    nom: "Mayo-Kebbi Ouest",
    chefLieu: "Pala",
    apropos:
      "Province verdoyante du sud-ouest, aux collines et lacs (Léré, Tréné) abritant les derniers lamantins d'Afrique centrale. Terre moundang au riche patrimoine.",
    economie:
      "Coton, arachide, riz, or artisanal, élevage et pêche lacustre.",
  },
  {
    slug: "moyen-chari",
    nom: "Moyen-Chari",
    chefLieu: "Sarh",
    apropos:
      "Province du grand sud autour de Sarh, ancienne Fort-Archambault, ville sucrière et cotonnière. Le parc national de Manda borde le fleuve Chari.",
    economie:
      "Canne à sucre (complexe de Banda), coton, cultures vivrières, pêche, agro-industrie.",
  },
  {
    slug: "ndjamena",
    nom: "Ville de N'Djamena",
    chefLieu: "N'Djamena",
    apropos:
      "Capitale politique et économique, fondée en 1900 sous le nom de Fort-Lamy, rebaptisée en 1973. Métropole cosmopolite de plus d'1,5 million d'habitants au confluent du Chari et du Logone.",
    economie:
      "Administration, services, banques, grands marchés (Grand Marché, marché à mil), industrie légère, aéroport international.",
  },
  {
    slug: "ouaddai",
    nom: "Ouaddaï",
    chefLieu: "Abéché",
    apropos:
      "Héritière du puissant sultanat du Ouaddaï, dont Abéché conserve palais, mosquées et traditions. Porte de l'est, sur les anciennes routes caravanières vers le Soudan.",
    economie:
      "Commerce transfrontalier avec le Soudan, élevage, arachide et sésame, artisanat du cuir et du tissage.",
  },
  {
    slug: "salamat",
    nom: "Salamat",
    chefLieu: "Am Timan",
    apropos:
      "Vaste province du sud-est, royaume des plaines inondables et du parc national de Zakouma, l'une des plus belles réserves d'éléphants et de girafes d'Afrique centrale.",
    economie:
      "Élevage transhumant, riz et sorgho de décrue, pêche, écotourisme autour de Zakouma.",
  },
  {
    slug: "sila",
    nom: "Sila",
    chefLieu: "Goz Beïda",
    apropos:
      "Province frontalière du Soudan créée en 2008, terre du sultanat du Dar Sila. Collines et ouadis où cohabitent agriculteurs et éleveurs.",
    economie:
      "Cultures pluviales, élevage, échanges frontaliers, gomme arabique.",
  },
  {
    slug: "tandjile",
    nom: "Tandjilé",
    chefLieu: "Laï",
    apropos:
      "Province du sud-ouest traversée par le Logone, aux vastes plaines rizicoles. Laï est réputée pour ses fêtes traditionnelles et ses pirogues.",
    economie:
      "Riz (grenier rizicole du pays), coton, pêche, élevage, cultures maraîchères.",
  },
  {
    slug: "tibesti",
    nom: "Tibesti",
    chefLieu: "Bardaï",
    apropos:
      "Massif volcanique le plus haut du Sahara, culminant à l'Emi Koussi (3 415 m). Terre toubou de canyons, de sources chaudes et de paysages lunaires.",
    economie:
      "Or (orpaillage), dattes des oasis, élevage caprin et camelin, potentiel touristique majeur.",
  },
  {
    slug: "wadi-fira",
    nom: "Wadi Fira",
    chefLieu: "Biltine",
    apropos:
      "Province de l'est sahélien, entre massifs et ouadis, au carrefour des peuples zaghawa, tama et arabes. Porte d'entrée vers le Darfour.",
    economie:
      "Élevage, mil et sorgho, gomme arabique, commerce frontalier.",
  },
];
