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

```bash
npm install
cp .env.example .env        # puis éditez AUTH_SECRET (openssl rand -base64 32)
npx prisma migrate dev      # crée la base SQLite locale
npm run db:seed             # (optionnel) données de démonstration
npm run dev                 # http://localhost:3000
```

Compte de démonstration (après le seed) :
`demo.vendeur@alliancetchadusa.org` / `Demo1234!`

## 🌍 Déploiement (Vercel recommandé)

1. Importez ce dépôt sur [vercel.com](https://vercel.com) (gratuit).
2. Dans les variables d'environnement du projet, définissez :
   - `DATABASE_URL` — une base **PostgreSQL** (gratuite chez [Neon](https://neon.tech) ou Vercel Postgres). Changez aussi `provider = "postgresql"` dans `prisma/schema.prisma` et régénérez la migration (`npx prisma migrate dev`).
   - `AUTH_SECRET` — générez-la : `openssl rand -base64 32`.
3. Déployez : la commande de build (`prisma generate && prisma migrate deploy && next build`) applique les migrations automatiquement.

> ⚠️ SQLite convient au développement local et aux petits serveurs (VPS avec disque persistant). Sur Vercel/serverless, utilisez PostgreSQL — le fichier SQLite n'y survit pas entre les déploiements.

> 💳 Paiement : le site fonctionne aujourd'hui en « paiement à la livraison / accord direct avec le vendeur ». La structure (montants en cents, commandes transactionnelles) est prête pour brancher Stripe plus tard.

## 🧰 Stack technique

Next.js 15 (App Router, Server Actions) · TypeScript strict · Prisma ORM ·
SQLite/PostgreSQL · Tailwind CSS 4 · Zod · jose (JWT) · bcryptjs.
