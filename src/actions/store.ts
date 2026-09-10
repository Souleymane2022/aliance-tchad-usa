"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { slugify } from "@/lib/slug";
import {
  storeSchema,
  firstFieldErrors,
  type ActionResult,
} from "@/lib/validation";

export async function createStoreAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const parsed = storeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    country: formData.get("country"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Veuillez corriger les champs indiqués.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }

  const existing = await db.store.findUnique({ where: { ownerId: user.id } });
  if (existing) {
    return {
      ok: false,
      error: "Vous avez déjà un espace vendeur. Gérez-le depuis votre tableau de bord.",
    };
  }

  const { name, description, phone, city, country } = parsed.data;
  const base = slugify(name);

  // Jusqu'à 5 tentatives avec suffixe aléatoire si le slug est déjà pris :
  // aucune course possible, la contrainte unique de la base tranche.
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug =
      attempt === 0
        ? base
        : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      await db.store.create({
        data: {
          slug,
          name,
          description,
          phone: phone || null,
          city: city || null,
          country: country || "USA",
          ownerId: user.id,
        },
      });
      revalidatePath("/espaces");
      revalidatePath("/tableau-de-bord");
      return { ok: true, message: "Votre espace vendeur a été créé !" };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        const target = (err.meta?.target as string[] | undefined) ?? [];
        if (target.includes("ownerId")) {
          return { ok: false, error: "Vous avez déjà un espace vendeur." };
        }
        continue; // slug pris : nouvelle tentative
      }
      console.error("createStoreAction:", err);
      return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
    }
  }
  return { ok: false, error: "Impossible de générer une adresse unique. Réessayez." };
}

export async function updateStoreAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const parsed = storeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    country: formData.get("country"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Veuillez corriger les champs indiqués.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }

  const store = await db.store.findUnique({ where: { ownerId: user.id } });
  if (!store) {
    return { ok: false, error: "Vous n'avez pas encore d'espace vendeur." };
  }

  const { name, description, phone, city, country } = parsed.data;
  try {
    await db.store.update({
      where: { id: store.id },
      data: {
        name,
        description,
        phone: phone || null,
        city: city || null,
        country: country || "USA",
      },
    });
  } catch (err) {
    console.error("updateStoreAction:", err);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }

  revalidatePath("/espaces");
  revalidatePath(`/espaces/${store.slug}`);
  revalidatePath("/tableau-de-bord");
  return { ok: true, message: "Espace mis à jour." };
}
