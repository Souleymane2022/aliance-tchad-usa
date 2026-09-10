"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { quantitySchema, type ActionResult } from "@/lib/validation";

export async function addToCartAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  const productId = formData.get("productId");
  if (!user) {
    const back =
      typeof productId === "string" && productId
        ? `/marketplace/produit/${encodeURIComponent(productId)}`
        : "/marketplace";
    redirect(`/connexion?redirectTo=${encodeURIComponent(back)}`);
  }

  if (typeof productId !== "string" || !productId) {
    return { ok: false, error: "Produit introuvable." };
  }
  const qtyParsed = quantitySchema.safeParse(formData.get("quantity") ?? 1);
  if (!qtyParsed.success) {
    return { ok: false, error: qtyParsed.error.issues[0].message };
  }
  const quantity = qtyParsed.data;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { store: { select: { ownerId: true } } },
  });
  if (!product || !product.active) {
    return { ok: false, error: "Ce produit n'est plus disponible." };
  }
  if (product.store.ownerId === user.id) {
    return { ok: false, error: "Vous ne pouvez pas acheter vos propres produits." };
  }

  try {
    const existing = await db.cartItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });
    const newQty = Math.min((existing?.quantity ?? 0) + quantity, 999);

    if (product.stock < newQty) {
      return {
        ok: false,
        error:
          product.stock === 0
            ? "Ce produit est en rupture de stock."
            : `Stock insuffisant : il ne reste que ${product.stock} exemplaire(s).`,
      };
    }

    await db.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: { userId: user.id, productId, quantity: newQty },
      update: { quantity: newQty },
    });
  } catch (err) {
    console.error("addToCartAction:", err);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }

  revalidatePath("/panier");
  return { ok: true, message: "Produit ajouté au panier." };
}

export async function updateCartItemAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/panier");

  const itemId = formData.get("itemId");
  if (typeof itemId !== "string" || !itemId) return;

  const qtyParsed = quantitySchema.safeParse(formData.get("quantity"));
  if (!qtyParsed.success) return;

  // updateMany scopé au userId : impossible de toucher le panier d'un autre.
  await db.cartItem.updateMany({
    where: { id: itemId, userId: user.id },
    data: { quantity: qtyParsed.data },
  });

  revalidatePath("/panier");
}

export async function removeCartItemAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/panier");

  const itemId = formData.get("itemId");
  if (typeof itemId !== "string" || !itemId) return;

  await db.cartItem.deleteMany({
    where: { id: itemId, userId: user.id },
  });

  revalidatePath("/panier");
}
