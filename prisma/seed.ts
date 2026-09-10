/**
 * Données de démonstration : `npm run db:seed`.
 * Idempotent — peut être relancé sans créer de doublons.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Demo1234!", 12);

  const demoSeller = await db.user.upsert({
    where: { email: "demo.vendeur@alliancetchadusa.org" },
    update: {},
    create: {
      email: "demo.vendeur@alliancetchadusa.org",
      name: "Amina Démo",
      passwordHash,
    },
  });

  const store = await db.store.upsert({
    where: { ownerId: demoSeller.id },
    update: {},
    create: {
      slug: "saveurs-du-tchad",
      name: "Saveurs du Tchad",
      description:
        "Épicerie et artisanat tchadiens : épices, karité, tissus et objets faits main, directement importés pour la diaspora.",
      city: "Washington DC",
      country: "USA",
      phone: "+1 555 010 2030",
      ownerId: demoSeller.id,
    },
  });

  const products: Array<{
    name: string;
    description: string;
    priceCents: number;
    category: string;
    stock: number;
  }> = [
    {
      name: "Beurre de karité pur (250 g)",
      description:
        "Beurre de karité 100 % naturel, non raffiné, pressé à la main. Idéal pour la peau et les cheveux.",
      priceCents: 1250,
      category: "Beauté & Soins",
      stock: 25,
    },
    {
      name: "Mélange d'épices tchadiennes",
      description:
        "Assortiment d'épices traditionnelles pour vos sauces et grillades : goût authentique garanti.",
      priceCents: 899,
      category: "Alimentation",
      stock: 40,
    },
    {
      name: "Tissu pagne premium (6 yards)",
      description:
        "Pagne de qualité supérieure aux motifs traditionnels, parfait pour vos tenues de cérémonie.",
      priceCents: 4500,
      category: "Mode & Vêtements",
      stock: 12,
    },
    {
      name: "Panier artisanal tressé",
      description:
        "Panier tressé à la main par des artisans tchadiens. Chaque pièce est unique.",
      priceCents: 3200,
      category: "Artisanat",
      stock: 8,
    },
  ];

  for (const p of products) {
    const exists = await db.product.findFirst({
      where: { storeId: store.id, name: p.name },
      select: { id: true },
    });
    if (!exists) {
      await db.product.create({ data: { ...p, storeId: store.id } });
    }
  }

  const eventTitle = "Grande rencontre annuelle de l'Alliance";
  const eventExists = await db.event.findFirst({ where: { title: eventTitle } });
  if (!eventExists) {
    const inTwoMonths = new Date();
    inTwoMonths.setMonth(inTwoMonths.getMonth() + 2);
    inTwoMonths.setHours(15, 0, 0, 0);
    await db.event.create({
      data: {
        title: eventTitle,
        description:
          "Retrouvailles de la communauté : repas partagé, musique, présentation des projets de l'année et stands des vendeurs de la marketplace. Familles bienvenues !",
        location: "Washington DC",
        date: inTwoMonths,
      },
    });
  }

  console.log("✓ Données de démonstration créées.");
  console.log("  Compte vendeur démo : demo.vendeur@alliancetchadusa.org / Demo1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
