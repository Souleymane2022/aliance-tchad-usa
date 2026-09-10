# Alliance Tchad-USA — Site communautaire & Marketplace

Site officiel de l'**Alliance Tchad-USA** : la communauté tchadienne aux
États-Unis. Chaque membre peut créer gratuitement son **espace vendeur**
pour acheter et vendre au sein de la communauté.

## ✨ Fonctionnalités

### Marketplace (e-commerce)
- **Espaces vendeurs** : chaque utilisateur crée sa boutique (nom, description, ville, téléphone) avec une adresse publique (`/espaces/ma-boutique`).
- **Produits** : ajout/modification/suppression, prix, stock, catégorie, photo, activation/masquage. Limite de 200 produits par espace.
- **Recherche & filtres** : recherche plein texte, filtres par catégorie, pagination.
- **Panier** : quantités modifiables, alertes de stock avant commande.
- **Commandes** : tunnel de commande avec adresse de livraison, référence unique, suivi de statut (en attente → confirmée → expédiée → livrée), annulation par l'acheteur avec restitution automatique du stock.
- **Tableau de bord vendeur** : gestion des produits et des commandes reçues (coordonnées de livraison de l'acheteur, changement de statut).

### Association
- Accueil, À propos, Événements (à venir / passés), Contact.

## 🛡️ Robustesse & sécurité

- **Prix en cents (entiers)** : aucune erreur d'arrondi en virgule flottante.
- **Commande transactionnelle** : le stock est décrémenté avec une clause conditionnelle (`stock >= quantité`) dans une transaction — deux acheteurs simultanés ne peuvent jamais acheter le même dernier article. Tout échoue ou tout réussit.
- **Prix revérifiés côté serveur** au moment de la commande (jamais ceux affichés au client).
- **Historique de commande figé** : nom, prix et boutique sont copiés dans la commande — la modification ou suppression d'un produit ne change jamais l'historique.
- **Authentification** : mots de passe hachés (bcrypt, coût 12), sessions JWT signées en cookie `httpOnly` + `SameSite`, protection contre l'énumération d'e-mails, redirections internes uniquement.
- **Limitation de débit** sur connexion, inscription et commande (anti force brute / spam).
- **Validation Zod** de toutes les entrées côté serveur, messages d'erreur en français champ par champ.
- **Contrôle d'accès strict** : un vendeur ne peut modifier que ses produits, un acheteur ne voit que ses commandes (requêtes systématiquement scopées à l'utilisateur).
- **En-têtes de sécurité** (X-Frame-Options, nosniff, Referrer-Policy…), pas d'achat de ses propres produits, images externes en HTTPS uniquement avec visuel de secours si l'URL est cassée.

## 🚀 Démarrage local

Il vous faut une base PostgreSQL. Le plus simple : créez une base gratuite sur
[Neon](https://neon.tech) et utilisez-la aussi en local.

```bash
npm install
cp .env.example .env        # collez vos URLs Neon + AUTH_SECRET (openssl rand -base64 32)
npx prisma migrate deploy   # applique les migrations
npm run db:seed             # (optionnel) données de démonstration
npm run dev                 # http://localhost:3000
```

Compte de démonstration (après le seed) :
`demo.vendeur@alliancetchadusa.org` / `Demo1234!`

## 🌍 Déploiement : Neon + Vercel (gratuit)

### Étape 1 — Créer la base sur Neon
1. Créez un compte sur [neon.tech](https://neon.tech) et un projet (ex. `alliance-tchad-usa`).
2. Dans **Connection Details**, copiez **deux** URLs :
   - l'URL **Pooled connection** (elle contient `-pooler`) → ce sera `DATABASE_URL` ;
   - l'URL **directe** (sans `-pooler`, décochez "Connection pooling") → ce sera `DIRECT_URL`.

### Étape 2 — Déployer sur Vercel
1. Sur [vercel.com](https://vercel.com), cliquez **Add New → Project** et importez ce dépôt GitHub.
2. Dans **Environment Variables**, ajoutez :

   | Nom | Valeur |
   |---|---|
   | `DATABASE_URL` | l'URL Neon **avec** `-pooler` |
   | `AUTH_SECRET` | le résultat de `openssl rand -base64 32` |
   | `DIRECT_URL` *(optionnel)* | l'URL Neon **sans** `-pooler` |

   `DIRECT_URL` est facultative : si elle manque, le build la déduit
   automatiquement (variables de l'intégration Neon, ou `DATABASE_URL`
   sans `-pooler`).

3. Cliquez **Deploy**. La commande de build (`prisma generate && prisma migrate deploy && next build`) crée automatiquement les tables sur Neon au premier déploiement.
4. (Optionnel) Pour les données de démonstration, en local avec le `.env` pointant sur Neon : `npm run db:seed`.

> Pourquoi deux URLs ? L'application utilise la connexion **poolée** de Neon
> (indispensable en serverless), tandis que les migrations Prisma passent par la
> connexion **directe** (`directUrl` dans `prisma/schema.prisma`).

> 💳 Paiement : le site fonctionne aujourd'hui en « paiement à la livraison / accord direct avec le vendeur ». La structure (montants en cents, commandes transactionnelles) est prête pour brancher Stripe plus tard.

## 🧰 Stack technique

Next.js 15 (App Router, Server Actions) · TypeScript strict · Prisma ORM ·
PostgreSQL (Neon) · Tailwind CSS 4 · Zod · jose (JWT) · bcryptjs ·
Déploiement Vercel.
