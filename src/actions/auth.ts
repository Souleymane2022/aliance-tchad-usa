"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  loginSchema,
  registerSchema,
  firstFieldErrors,
  type ActionResult,
} from "@/lib/validation";

async function clientKey(prefix: string): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "inconnu";
  return `${prefix}:${ip}`;
}

export async function registerAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const limit = checkRateLimit(await clientKey("register"), {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) {
    return {
      ok: false,
      error: `Trop de tentatives. Réessayez dans ${limit.retryAfterS} secondes.`,
    };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Veuillez corriger les champs indiqués.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { name, email, passwordHash },
      select: { id: true },
    });
    await createSession(user.id);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        ok: false,
        error: "Un compte existe déjà avec cette adresse e-mail.",
        fieldErrors: { email: "Adresse déjà utilisée." },
      };
    }
    console.error("registerAction:", err);
    return {
      ok: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }

  redirect("/tableau-de-bord");
}

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const limit = checkRateLimit(await clientKey("login"), {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) {
    return {
      ok: false,
      error: `Trop de tentatives. Réessayez dans ${limit.retryAfterS} secondes.`,
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Veuillez corriger les champs indiqués.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }

  const { email, password } = parsed.data;
  const genericError = "Adresse e-mail ou mot de passe incorrect.";

  try {
    const user = await db.user.findUnique({ where: { email } });
    // Comparaison même si l'utilisateur n'existe pas (hash factice) :
    // le temps de réponse ne révèle pas quels e-mails ont un compte.
    const hash =
      user?.passwordHash ??
      "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpDLh6uJc1kU1e5eXAMPLEFAKEHASH";
    const valid = await bcrypt.compare(password, hash);
    if (!user || !valid) {
      return { ok: false, error: genericError };
    }
    await createSession(user.id);
  } catch (err) {
    console.error("loginAction:", err);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }

  const redirectTo = formData.get("redirectTo");
  // Uniquement des chemins internes : jamais de redirection vers un site externe.
  const target =
    typeof redirectTo === "string" &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
      ? redirectTo
      : "/tableau-de-bord";
  redirect(target);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
