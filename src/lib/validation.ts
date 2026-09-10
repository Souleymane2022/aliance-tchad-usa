import { z } from "zod";

export const CATEGORIES = [
  "Alimentation",
  "Mode & Vêtements",
  "Artisanat",
  "Beauté & Soins",
  "Électronique",
  "Maison",
  "Services",
  "Autre",
] as const;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(80, "Le nom est trop long (80 caractères max)."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Adresse e-mail invalide.")
    .max(254, "Adresse e-mail trop longue."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(128, "Le mot de passe est trop long (128 caractères max)."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Mot de passe requis.").max(128),
});

export const storeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom de l'espace doit contenir au moins 2 caractères.")
    .max(60, "Le nom est trop long (60 caractères max)."),
  description: z
    .string()
    .trim()
    .min(10, "Décrivez votre espace en au moins 10 caractères.")
    .max(1000, "Description trop longue (1000 caractères max)."),
  phone: z
    .string()
    .trim()
    .max(25, "Numéro de téléphone trop long.")
    .regex(/^[+\d\s().-]*$/, "Numéro de téléphone invalide.")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(60, "Ville trop longue.").optional().or(z.literal("")),
  country: z.string().trim().max(60, "Pays trop long.").optional().or(z.literal("")),
});

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom du produit doit contenir au moins 2 caractères.")
    .max(100, "Nom trop long (100 caractères max)."),
  description: z
    .string()
    .trim()
    .min(10, "Décrivez le produit en au moins 10 caractères.")
    .max(2000, "Description trop longue (2000 caractères max)."),
  price: z.string().trim().min(1, "Prix requis."),
  category: z.enum(CATEGORIES, { message: "Catégorie invalide." }),
  stock: z.coerce
    .number({ message: "Stock invalide." })
    .int("Le stock doit être un nombre entier.")
    .min(0, "Le stock ne peut pas être négatif.")
    .max(1_000_000, "Stock trop élevé."),
  imageUrl: z
    .string()
    .trim()
    .max(2048, "URL d'image trop longue.")
    .url("L'URL de l'image est invalide.")
    .startsWith("https://", "L'image doit être une URL https://.")
    .optional()
    .or(z.literal("")),
});

export const checkoutSchema = z.object({
  shippingName: z
    .string()
    .trim()
    .min(2, "Nom du destinataire requis (2 caractères min).")
    .max(80, "Nom trop long."),
  shippingPhone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone requis.")
    .max(25, "Numéro de téléphone trop long.")
    .regex(/^[+\d\s().-]+$/, "Numéro de téléphone invalide."),
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Adresse de livraison requise (5 caractères min).")
    .max(200, "Adresse trop longue."),
  shippingCity: z
    .string()
    .trim()
    .min(2, "Ville requise.")
    .max(60, "Ville trop longue."),
  note: z.string().trim().max(500, "Note trop longue (500 caractères max).").optional().or(z.literal("")),
});

export const quantitySchema = z.coerce
  .number({ message: "Quantité invalide." })
  .int("La quantité doit être un nombre entier.")
  .min(1, "Quantité minimale : 1.")
  .max(999, "Quantité maximale : 999.");

/** Résultat standard renvoyé par toutes les actions serveur. */
export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function firstFieldErrors(
  error: z.ZodError
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
