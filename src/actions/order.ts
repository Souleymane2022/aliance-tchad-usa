"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  checkoutSchema,
  firstFieldErrors,
  type ActionResult,
} from "@/lib/validation";

const ORDER_STATUSES = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "EXPEDIEE",
  "LIVREE",
  "ANNULEE",
] as const;

function makeReference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ATU-${date}-${rand}`;
}

/**
 * Passage de commande, entièrement transactionnel :
 *  1. relecture des produits DANS la transaction (prix et stock réels, pas ceux du panier) ;
 *  2. décrément conditionnel du stock (`stock >= quantité`) — si un autre client
 *     achète en même temps, la transaction échoue proprement au lieu de vendre
 *     un stock inexistant ;
 *  3. création de la commande avec copie du nom/prix (l'historique reste exact) ;
 *  4. vidage du panier.
 * Tout échoue ou tout réussit : jamais d'état à moitié enregistré.
 */
export async function checkoutAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/panier");

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
  const limit = checkRateLimit(`checkout:${user.id}:${ip}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.ok) {
    return {
      ok: false,
      error: `Trop de commandes rapprochées. Réessayez dans ${limit.retryAfterS} secondes.`,
    };
  }

  const parsed = checkoutSchema.safeParse({
    shippingName: formData.get("shippingName"),
    shippingPhone: formData.get("shippingPhone"),
    shippingAddress: formData.get("shippingAddress"),
    shippingCity: formData.get("shippingCity"),
    note: formData.get("note"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Veuillez corriger les champs indiqués.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }

  let orderId: string | null = null;
  try {
    orderId = await db.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId: user.id },
        include: {
          product: { include: { store: { select: { name: true, ownerId: true } } } },
        },
      });
      if (cartItems.length === 0) {
        throw new CheckoutError("Votre panier est vide.");
      }

      let totalCents = 0;
      const orderItemsData: {
        productId: string;
        productName: string;
        storeName: string;
        unitPriceCents: number;
        quantity: number;
      }[] = [];

      for (const item of cartItems) {
        const p = item.product;
        if (!p || !p.active) {
          throw new CheckoutError(
            `« ${p?.name ?? "Un produit"} » n'est plus disponible. Retirez-le du panier.`
          );
        }
        if (p.store.ownerId === user.id) {
          throw new CheckoutError(
            `Vous ne pouvez pas acheter votre propre produit « ${p.name} ».`
          );
        }

        // Décrément conditionnel : la clause `stock >= quantité` rend
        // l'opération atomique face aux achats simultanés.
        const decremented = await tx.product.updateMany({
          where: { id: p.id, stock: { gte: item.quantity }, active: true },
          data: { stock: { decrement: item.quantity } },
        });
        if (decremented.count === 0) {
          const fresh = await tx.product.findUnique({
            where: { id: p.id },
            select: { stock: true },
          });
          throw new CheckoutError(
            `Stock insuffisant pour « ${p.name} » : ${fresh?.stock ?? 0} exemplaire(s) restant(s). Ajustez votre panier.`
          );
        }

        totalCents += p.priceCents * item.quantity;
        orderItemsData.push({
          productId: p.id,
          productName: p.name,
          storeName: p.store.name,
          unitPriceCents: p.priceCents,
          quantity: item.quantity,
        });
      }

      const order = await tx.order.create({
        data: {
          reference: makeReference(),
          userId: user.id,
          totalCents,
          shippingName: parsed.data.shippingName,
          shippingPhone: parsed.data.shippingPhone,
          shippingAddress: parsed.data.shippingAddress,
          shippingCity: parsed.data.shippingCity,
          note: parsed.data.note || null,
          items: { create: orderItemsData },
        },
        select: { id: true },
      });

      await tx.cartItem.deleteMany({ where: { userId: user.id } });
      return order.id;
    });
  } catch (err) {
    if (err instanceof CheckoutError) {
      revalidatePath("/panier");
      return { ok: false, error: err.message };
    }
    console.error("checkoutAction:", err);
    return {
      ok: false,
      error: "Une erreur est survenue lors de la commande. Aucun montant n'a été engagé. Réessayez.",
    };
  }

  revalidatePath("/panier");
  revalidatePath("/marketplace");
  revalidatePath("/mes-commandes");
  redirect(`/mes-commandes/${orderId}?nouvelle=1`);
}

class CheckoutError extends Error {}

/** Le vendeur (ou un admin) fait avancer le statut d'une commande qui contient ses produits. */
export async function updateOrderStatusAction(
  formData: FormData
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/tableau-de-bord");

  const orderId = formData.get("orderId");
  const status = formData.get("status");
  if (
    typeof orderId !== "string" ||
    typeof status !== "string" ||
    !(ORDER_STATUSES as readonly string[]).includes(status)
  ) {
    return;
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: { select: { storeName: true, productId: true, product: { select: { store: { select: { ownerId: true } } } } } } },
  });
  if (!order) return;

  const isAdmin = user.role === "ADMIN";
  const isSeller = order.items.some(
    (it) => it.product?.store.ownerId === user.id
  );
  if (!isAdmin && !isSeller) return;

  // Une commande livrée ou annulée ne change plus de statut.
  if (order.status === "LIVREE" || order.status === "ANNULEE") return;

  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/tableau-de-bord");
  revalidatePath("/mes-commandes");
  revalidatePath(`/mes-commandes/${orderId}`);
}

/** L'acheteur annule sa commande tant qu'elle n'est pas expédiée ; le stock est restitué. */
export async function cancelOrderAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirectTo=/mes-commandes");

  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || !orderId) return;

  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.userId !== user.id) return;
      if (order.status !== "EN_ATTENTE" && order.status !== "CONFIRMEE") return;

      await tx.order.update({
        where: { id: orderId },
        data: { status: "ANNULEE" },
      });

      // Restitution du stock pour les produits encore existants.
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.updateMany({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    });
  } catch (err) {
    console.error("cancelOrderAction:", err);
    return;
  }

  revalidatePath("/mes-commandes");
  revalidatePath(`/mes-commandes/${orderId}`);
  revalidatePath("/marketplace");
  revalidatePath("/tableau-de-bord");
}
