# START HERE - Bien Démarrer avec Mentorly

Bienvenue sur le projet **Mentorly** ! Ce document a été mis à jour pour refléter l'arrivée de la base de données PostgreSQL, de la sécurisation JWT, et du nouvel espace Administrateur premium.

## Étape 1 : Initialisez vos variables d'environnement
Avant de commencer, vous devez avoir un cluster de base de données PostgreSQL actif (par exemple, sur **Neon Postgres**).
Modifiez ou créez le fichier `.env` à la racine de votre projet avec vos propres identifiants :

```env
DATABASE_URL="postgresql://user:password@serveur.neon.tech/neondb?sslmode=require"
AUTH_SECRET="un-secret-très-complexe-de-plus-de-32-caractères"
```

## Étape 2 : Installez et Préparez la Base de Données
Dans votre terminal (assurez-vous d'avoir Node.js installé) :

```bash
# 1. Installez les dépendances
npm install

# 2. Synchronisez le schéma Prisma avec votre base de données PostgreSQL
npx prisma db push

# 3. Ajoutez les données de test (Services, Utilisateurs, Administrateur)
npm run db:seed
```
⏱️ *Cette étape crée le client Prisma adapté à votre système, et injecte notamment l'utilisateur "ADMIN" dans votre base de données grâce aux nouveaux rôles stricts (Enum Postgres).*

## Étape 3 : Lancez l'application
```bash
npm run dev
```
Ouvrez votre navigateur sur **http://localhost:3000** et profitez !

---

## Fonctionnalités à Tester

### Espace Utilisateur (Client)
- **Email** : `user@example.com`
- **Mot de passe** : `password123`
- 👉 Naviguez dans la boutique, ajoutez au panier, et visualisez vos commandes dans votre tableau de bord personnel.

### Nouvel Espace Administrateur V2 (Sécurisé)
- **Email** : `admin@example.com`
- **Mot de passe** : `password123`
- 👉 Accédez à l'URL **http://localhost:3000/admin/dashboard**
- L'espace est protégé par un Middleware Edge (vérification JWT `jose` instantanée) qui empêche tout utilisateur n'ayant pas le strict rôle `ADMIN` d'y accéder.
- L'interface Admin utilise un design system moderne (Bento, Glassmorphism, Graphiques Recharts).

---

## Problèmes Courants
**Le moteur Prisma est bloqué lors de `db:push` (Erreur EPERM sous Windows)**
- Arrêtez votre serveur de développement `npm run dev` (`Ctrl+C`).
- Mieux encore, forcez l'arrêt de Node : `taskkill /F /IM node.exe`.
- Relancez la commande `npx prisma db push`.

**Erreurs de lenteur de compilation (`next-intl`)**
- Le système gère de gigantesques fichiers de traduction dans `messages.ts`. Veillez à extraire cela vers de multiples fichiers `.json` à l'avenir si vous remarquez des rechargements (HMR) lents en mode développement.

**Comment donner le rôle d'Admin à un autre utilisateur ?**
- Ne touchez pas au code source. Lancez `npx prisma studio` pour ouvrir l'interface visuelle de votre base de données. Cherchez votre utilisateur et changez son champ `role` (limité à `USER, ADMIN, MODERATOR, SUPER_ADMIN` par l'Enum).
