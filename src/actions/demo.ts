"use server";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/lib/validation";

/**
 * Charge un jeu de données fictives de démonstration : boutiques,
 * produits et événements. Garde-fous :
 *  - ne fait rien si la marketplace contient déjà des produits ;
 *  - les comptes vendeurs de démo reçoivent un mot de passe aléatoire
 *    inconnu de tous (personne ne peut s'y connecter) ;
 *  - limité en fréquence par adresse IP.
 */
export async function loadDemoDataAction(
  _prev: ActionResult | null,
  _formData: FormData
): Promise<ActionResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
  const limit = checkRateLimit(`demo:${ip}`, {
    limit: 3,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.ok) {
    return { ok: false, error: "Veuillez patienter avant de réessayer." };
  }

  try {
    const productCount = await db.product.count();
    if (productCount > 0) {
      return {
        ok: false,
        error:
          "La marketplace contient déjà des produits : les données de démonstration ne peuvent être chargées que sur une marketplace vide.",
      };
    }

    const stores: {
      email: string;
      userName: string;
      slug: string;
      name: string;
      description: string;
      city: string;
      phone: string;
      products: {
        name: string;
        description: string;
        priceCents: number;
        category: string;
        stock: number;
      }[];
    }[] = [
      {
        email: "demo.saveurs@alliancetchadusa.org",
        userName: "Amina Saleh (démo)",
        slug: "saveurs-du-tchad",
        name: "Saveurs du Tchad",
        description:
          "Épicerie tchadienne authentique : épices, céréales et douceurs importées directement pour la diaspora. Boutique de démonstration.",
        city: "Washington DC",
        phone: "+1 555 010 2030",
        products: [
          {
            name: "Mélange d'épices tchadiennes (200 g)",
            description:
              "Assortiment d'épices traditionnelles pour sauces et grillades : le goût authentique de la maison. (Produit fictif de démonstration.)",
            priceCents: 899,
            category: "Alimentation",
            stock: 40,
          },
          {
            name: "Farine de mil rouge (2 kg)",
            description:
              "Farine de mil pour la boule, moulue finement. Idéale pour retrouver les saveurs du pays. (Produit fictif de démonstration.)",
            priceCents: 1450,
            category: "Alimentation",
            stock: 25,
          },
          {
            name: "Karkanji — fleurs d'hibiscus séchées (500 g)",
            description:
              "Pour préparer la fameuse boisson rouge rafraîchissante. Récolte artisanale. (Produit fictif de démonstration.)",
            priceCents: 1099,
            category: "Alimentation",
            stock: 60,
          },
          {
            name: "Beurre de karité pur (250 g)",
            description:
              "Karité 100 % naturel, non raffiné, pressé à la main pour la peau et les cheveux. (Produit fictif de démonstration.)",
            priceCents: 1250,
            category: "Beauté & Soins",
            stock: 30,
          },
        ],
      },
      {
        email: "demo.artisanat@alliancetchadusa.org",
        userName: "Mahamat Ali (démo)",
        slug: "artisanat-du-sahel",
        name: "Artisanat du Sahel",
        description:
          "Objets faits main par des artisans du Tchad : vannerie, cuir, tissage. Chaque pièce est unique. Boutique de démonstration.",
        city: "New York",
        phone: "+1 555 020 4050",
        products: [
          {
            name: "Panier tressé du Lac Tchad",
            description:
              "Panier en fibres de palmier doum tressé à la main par les artisanes de Bol. (Produit fictif de démonstration.)",
            priceCents: 3200,
            category: "Artisanat",
            stock: 8,
          },
          {
            name: "Sac en cuir d'Abéché",
            description:
              "Maroquinerie du Ouaddaï, tannage traditionnel et motifs gravés à la main. (Produit fictif de démonstration.)",
            priceCents: 5500,
            category: "Artisanat",
            stock: 5,
          },
          {
            name: "Tapis tissé du Guéra",
            description:
              "Tissage épais aux motifs géométriques hadjeraï, 120 × 80 cm. (Produit fictif de démonstration.)",
            priceCents: 7800,
            category: "Maison",
            stock: 4,
          },
          {
            name: "Calebasse décorée",
            description:
              "Calebasse gravée et pyrogravée, objet de décoration et d'usage. (Produit fictif de démonstration.)",
            priceCents: 1800,
            category: "Artisanat",
            stock: 12,
          },
        ],
      },
      {
        email: "demo.mode@alliancetchadusa.org",
        userName: "Fatimé Deby (démo)",
        slug: "elegance-ndjamena",
        name: "Élégance N'Djamena",
        description:
          "Mode et tissus : pagnes premium, tenues sur mesure et accessoires pour toutes les grandes occasions. Boutique de démonstration.",
        city: "Houston",
        phone: "+1 555 030 6070",
        products: [
          {
            name: "Pagne premium (6 yards)",
            description:
              "Tissu wax de qualité supérieure aux motifs éclatants, parfait pour les cérémonies. (Produit fictif de démonstration.)",
            priceCents: 4500,
            category: "Mode & Vêtements",
            stock: 15,
          },
          {
            name: "Boubou brodé homme",
            description:
              "Grand boubou en bazin riche avec broderies fines, coupe traditionnelle. (Produit fictif de démonstration.)",
            priceCents: 12000,
            category: "Mode & Vêtements",
            stock: 6,
          },
          {
            name: "Foulard en soie motifs sahéliens",
            description:
              "Foulard léger aux motifs inspirés des dunes du Kanem. (Produit fictif de démonstration.)",
            priceCents: 2500,
            category: "Mode & Vêtements",
            stock: 20,
          },
          {
            name: "Bijoux en argent du Tibesti",
            description:
              "Parure artisanale en argent travaillé selon la tradition toubou. (Produit fictif de démonstration.)",
            priceCents: 6500,
            category: "Beauté & Soins",
            stock: 7,
          },
        ],
      },
    ];

    for (const storeData of stores) {
      // Mot de passe aléatoire jamais communiqué : compte de vitrine uniquement.
      const passwordHash = await bcrypt.hash(
        randomBytes(32).toString("hex"),
        12
      );
      const user = await db.user.upsert({
        where: { email: storeData.email },
        update: {},
        create: {
          email: storeData.email,
          name: storeData.userName,
          passwordHash,
        },
      });
      const store = await db.store.upsert({
        where: { ownerId: user.id },
        update: {},
        create: {
          slug: storeData.slug,
          name: storeData.name,
          description: storeData.description,
          city: storeData.city,
          country: "USA",
          phone: storeData.phone,
          ownerId: user.id,
        },
      });
      for (const p of storeData.products) {
        await db.product.create({ data: { ...p, storeId: store.id } });
      }
    }

    const eventCount = await db.event.count();
    if (eventCount === 0) {
      const in1 = new Date();
      in1.setMonth(in1.getMonth() + 1);
      in1.setHours(15, 0, 0, 0);
      const in2 = new Date();
      in2.setMonth(in2.getMonth() + 2);
      in2.setHours(18, 30, 0, 0);
      const in3 = new Date();
      in3.setMonth(in3.getMonth() + 3);
      in3.setHours(12, 0, 0, 0);
      await db.event.createMany({
        data: [
          {
            title: "Grande rencontre annuelle de l'Alliance (démo)",
            description:
              "Retrouvailles de la communauté : repas partagé, musique, présentation des projets de l'année et stands des vendeurs de la marketplace. Familles bienvenues ! (Événement fictif de démonstration.)",
            location: "Washington DC",
            date: in1,
          },
          {
            title: "Soirée culturelle : contes et musiques du Tchad (démo)",
            description:
              "Une soirée pour transmettre nos traditions aux jeunes générations : contes sara et kanembou, démonstrations de musique et dégustations. (Événement fictif de démonstration.)",
            location: "New York",
            date: in2,
          },
          {
            title: "Forum économique Tchad-USA (démo)",
            description:
              "Rencontres entre entrepreneurs de la diaspora, investisseurs et porteurs de projets entre les deux pays : commerce, agriculture, tech. (Événement fictif de démonstration.)",
            location: "Houston",
            date: in3,
          },
        ],
      });
    }
  } catch (err) {
    console.error("loadDemoDataAction:", err);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }

  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/espaces");
  revalidatePath("/evenements");
  return {
    ok: true,
    message:
      "Données de démonstration chargées : 3 boutiques, 12 produits et 3 événements fictifs.",
  };
}
