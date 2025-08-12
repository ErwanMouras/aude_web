# 🏗️ Aude Mouradian Architecture - Site Web

Site web moderne en Astro pour le portfolio d'architecture d'intérieur d'Aude Mouradian.

## 🚀 Stack Technique

### Frontend
- **Astro 5.x** + TypeScript - Framework statique moderne
- **TailwindCSS** - Styles utilitaires
- **Components modulaires** - Architecture évolutive

### Backend Serverless
- **Netlify Functions** - API serverless
- **Supabase** - Base de données PostgreSQL (région EU)
- **Brevo API** - Service d'emails transactionnels

### CMS & Contenu
- **Decap CMS** - Interface d'administration
- **Astro Content Collections** - Gestion du contenu
- **Pagefind** - Recherche statique

### Sécurité & Performance
- **Cloudflare Turnstile** - Protection anti-bot
- **RGPD Compliant** - Conformité européenne
- **Optimisation SEO** - Meta tags et Schema.org

## 📋 Prérequis

- Node.js 18+
- npm 9+
- Compte Netlify
- Compte Supabase
- Compte Brevo (ex-SendinBlue)
- Compte Cloudflare (pour Turnstile)

## 🛠️ Installation

### 1. Cloner et installer les dépendances

```bash
git clone https://github.com/ErwanMouras/aude_web.git
cd aude_web/astro-site
npm install
```

### 2. Configuration de la base de données (Supabase)

1. Créer un projet Supabase (région EU recommandée)
2. Exécuter le script SQL dans `database/schema.sql`
3. Récupérer les clés API depuis Settings > API

### 3. Configuration des variables d'environnement

Créer un fichier `.env` :

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Brevo (SendinBlue)
BREVO_API_KEY=your-brevo-api-key

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=your-turnstile-secret

# Site URL (pour les emails)
URL=http://localhost:4321
```

## 🏃‍♂️ Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Build avec indexation de recherche
npm run build:production

# Prévisualiser le build
npm run preview
```

## 🎨 Fonctionnalités

### ✅ Implémentées
- [x] **Carrousel automatique** en page d'accueil (5s transition)
- [x] **Galerie de projets filtrée** par catégories
- [x] **Formulaire de contact avancé** avec validation
- [x] **Newsletter avec double opt-in**
- [x] **Système anti-bot** Cloudflare Turnstile
- [x] **Base de données** Supabase avec RLS
- [x] **Emails transactionnels** Brevo
- [x] **CMS d'administration** Decap CMS
- [x] **Recherche intégrée** Pagefind
- [x] **Multilingue** FR/EN
- [x] **SEO optimisé** Meta tags + Schema.org
- [x] **Design responsive** Mobile-first
- [x] **Conformité RGPD**

## 🚀 Déploiement Netlify

### 1. Configuration automatique

1. Connecter le repository GitHub à Netlify
2. Build command: `npm run build:production`  
3. Publish directory: `dist`

### 2. Variables d'environnement Netlify

Dans Netlify > Site settings > Environment variables :

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BREVO_API_KEY=your-brevo-api-key
TURNSTILE_SECRET_KEY=your-turnstile-secret
URL=https://your-site.netlify.app
```

---

**🎉 Site prêt pour la production !**

*Développé avec ❤️ par Claude pour Aude Mouradian Architecture*
