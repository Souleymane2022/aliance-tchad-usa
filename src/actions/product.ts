"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { parsePriceToCents } from "@/lib/money";
import {
  productSchema,
  firstFieldErrors,
  type ActionResult,
} from "@/lib/validation";

/** Renvoie la boutique de l'utilisateur connecté, ou null. */
async function getOwnStore(userId: string) {
  return db.store.findUnique({ where: { ownerId: userId } });
}

type ParsedProduct = {
  name: string;
  description: string;
  category: (typeof productSchema.shape.category)["options"][number];
  stock: number;
  imageUrl?: string;
  priceCents: number;
};

function parseProductForm(
  formData: FormData
):
  | { success: false; error: ActionResult & { ok: false } }
  | { success: true; data: ParsedProduct } {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: {
        ok: false,
        error: "Veuillez corriger les champs indiqués.",
        fieldErrors: firstFieldErrors(parsed.error),
      },
    };
  }
  const priceCents = parsePriceToCents(parsed.data.price);
  if (priceCents === null || priceCents === 0) {
    return {
      success: false,
      error: {
        ok: false,
        error: "Veuillez corriger les champs indiqués.",
        fieldErrors: { price: "Prix invalide (ex. : 12.50), supérieur à 0." },
      },
    };
  }
  return { success: true, data: { ...parsed.data, priceCents } };
}

export async function createProductAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const store = await getOwnStore(user.id);
  if (!store) {
    return {
      ok: false,
      error: "Créez d'abord votre espace vendeur avant d'ajouter des produits.",
    };
  }

  const productCount = await db.product.count({ where: { storeId: store.id } });
  if (productCount >= 200) {
    return {
      ok: false,
      error: "Limite atteinte : 200 produits maximum par espace.",
    };
  }

  const result = parseProductForm(formData);
  if (!result.success) return result.error;
  const { name, description, category, stock, imageUrl, priceCents } =
    result.data;

  try {
    await db.product.create({
      data: {
        name,
        description,
        priceCents,
        category,
        stock,
        imageUrl: imageUrl || null,
        storeId: store.id,
      },
    });
  } catch (err) {
    console.error("createProductAction:", err);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }

  revalidatePath("/marketplace");
  revalidatePath(`/espaces/${store.slug}`);
  revalidatePath("/tableau-de-bord");
  return { ok: true, message: "Produit ajouté !" };
}

export async function updateProductAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const productId = formData.get("productId");
  if (typeof productId !== "string" || !productId) {
    return { ok: false, error: "Produit introuvable." };
  }

  const store = await getOwnStore(user.id);
  if (!store) return { ok: false, error: "Vous n'avez pas d'espace vendeur." };

  const result = parseProductForm(formData);
  if (!result.success) return result.error;
  const { name, description, category, stock, imageUrl, priceCents } =
    result.data;
  const active = formData.get("active") === "on";

  // updateMany avec storeId : impossible de modifier le produit d'un autre vendeur.
  const updated = await db.product.updateMany({
    where: { id: productId, storeId: store.id },
    data: {
      name,
      description,
      priceCents,
      category,
      stock,
      imageUrl: imageUrl || null,
      active,
    },
  });
  if (updated.count === 0) {
    return { ok: false, error: "Produit introuvable dans votre espace." };
  }

  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/produit/${productId}`);
  revalidatePath(`/espaces/${store.slug}`);
  revalidatePath("/tableau-de-bord");
  return { ok: true, message: "Produit mis à jour." };
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const productId = formData.get("productId");
  if (typeof productId !== "string" || !productId) return;

  const store = await getOwnStore(user.id);
  if (!store) return;

  // deleteMany scopé au storeId : sécurité d'appartenance garantie.
  // Les commandes passées gardent leur copie (OrderItem.productName / SetNull).
  await db.product.deleteMany({
    where: { id: productId, storeId: store.id },
  });

  revalidatePath("/marketplace");
  revalidatePath(`/espaces/${store.slug}`);
  revalidatePath("/tableau-de-bord");
}
