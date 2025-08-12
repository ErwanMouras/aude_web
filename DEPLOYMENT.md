# 🚀 Guide de Déploiement - Aude Mouradian Architecture

Ce guide vous accompagne étape par étape pour déployer le site en production sur Netlify.

## 📋 Checklist Pré-Déploiement

### ✅ Services Externes à Configurer

- [ ] **Supabase** - Base de données PostgreSQL
- [ ] **Brevo** - Service d'emails transactionnels  
- [ ] **Cloudflare Turnstile** - Protection anti-bot
- [ ] **Netlify** - Hébergement et CI/CD

## 🗄️ Configuration Supabase

### 1. Créer le Projet

1. Aller sur [supabase.com](https://supabase.com/)
2. Créer un nouveau projet
3. **Important** : Choisir la région `Europe (Frankfurt)` pour la conformité RGPD
4. Choisir un nom et mot de passe forts

### 2. Configurer la Base de Données

1. Aller dans `SQL Editor`
2. Copier-coller le contenu du fichier `database/schema.sql`
3. Exécuter le script
4. Vérifier que les tables sont créées dans `Table Editor`

### 3. Récupérer les Clés API

1. Aller dans `Settings > API`
2. Noter les valeurs suivantes :
   - `URL` (Project URL)
   - `anon` `public` (Anon key)
   - `service_role` `secret` (Service role key) ⚠️ **Sensible**

## 📧 Configuration Brevo

### 1. Créer le Compte

1. Aller sur [brevo.com](https://www.brevo.com/)
2. Créer un compte gratuit (300 emails/jour)
3. Vérifier l'adresse email

### 2. Générer la Clé API

1. Aller dans `Account > SMTP & API > API Keys`
2. Créer une nouvelle clé API
3. Lui donner les permissions d'envoi d'emails
4. Noter la clé ⚠️ **Sensible**

### 3. Configuration Domaine (Optionnel)

Pour envoyer depuis votre domaine personnalisé :
1. Ajouter votre domaine dans `Senders & IP`
2. Configurer les enregistrements DNS
3. Attendre la validation

## 🛡️ Configuration Cloudflare Turnstile

### 1. Créer le Site Turnstile

1. Aller sur [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Accéder à `Turnstile`
3. Ajouter un nouveau site
4. Domaine : `votre-site.netlify.app` (ou votre domaine)

### 2. Récupérer les Clés

1. Noter la `Site Key` (publique)
2. Noter la `Secret Key` ⚠️ **Sensible**

### 3. Mise à Jour du Code

Modifier `src/components/sections/ContactForm.astro` :
```html
<div class="cf-turnstile" data-sitekey="VOTRE_SITE_KEY_ICI"></div>
```

## 🌐 Déploiement Netlify

### 1. Connexion GitHub

1. Pousser le code sur GitHub :
```bash
git add .
git commit -m "Site prêt pour déploiement"
git push origin main
```

### 2. Configuration Netlify

1. Aller sur [netlify.com](https://www.netlify.com/)
2. `New site from Git`
3. Connecter GitHub et sélectionner le repository
4. Configuration build :
   - **Build command** : `npm run build:production`
   - **Publish directory** : `dist`
   - **Node version** : `18`

### 3. Variables d'Environnement

Dans `Site settings > Environment variables`, ajouter :

```
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service
BREVO_API_KEY=votre-cle-brevo
TURNSTILE_SECRET_KEY=votre-cle-turnstile-secrete
URL=https://votre-site.netlify.app
```

### 4. Activation du CMS

1. Activer `Identity` dans `Site settings > Identity`
2. Activer `Git Gateway` 
3. Configurer les options :
   - Registration : `Invite only`
   - Providers : `Email` uniquement
4. Inviter l'administrateur : `aude.mouradian@gmail.com`

## 🔧 Configuration Post-Déploiement

### 1. Test des Fonctionnalités

- [ ] Page d'accueil s'affiche correctement
- [ ] Carrousel fonctionne (transition automatique)
- [ ] Filtres de projets fonctionnent
- [ ] Formulaire de contact envoie des emails
- [ ] Newsletter avec double opt-in fonctionne
- [ ] Recherche Pagefind opérationnelle
- [ ] CMS accessible via `/admin`

### 2. Vérification Performance

1. Tester avec [PageSpeed Insights](https://pagespeed.web.dev/)
2. Score cible : >90 sur tous les critères
3. Vérifier les Core Web Vitals

### 3. Test RGPD

- [ ] Consentement explicite demandé
- [ ] Données stockées en UE (Supabase EU)
- [ ] Mentions légales accessibles
- [ ] Politique de confidentialité

## 🚨 Dépannage

### Build Échoue

```bash
# Vérifier en local
npm run build:production

# Nettoyer le cache
rm -rf node_modules package-lock.json
npm install
```

### Emails Non Reçus

1. Vérifier la configuration Brevo
2. Tester l'API key
3. Vérifier les spams
4. Consulter les logs Netlify Functions

### Formulaires Ne Fonctionnent Pas

1. Vérifier les variables d'environnement
2. Tester les Netlify Functions localement
3. Vérifier la configuration Turnstile

### CMS Inaccessible

1. Vérifier Git Gateway activé
2. Tester l'invitation admin
3. Vérifier la configuration `config.yml`

## 📊 Monitoring

### Logs Netlify

```bash
# Logs des functions
netlify logs:functions --live

# Logs de build  
# Via dashboard Netlify > Builds
```

### Analytics

1. Activer Netlify Analytics (payant mais détaillé)
2. Ou intégrer Google Analytics
3. Monitoring uptime avec UptimeRobot

## 🔄 Maintenance

### Mises à Jour

```bash
# Vérifier les dépendances
npm outdated

# Mettre à jour
npm update

# Audit sécurité
npm audit --audit-level moderate
```

### Sauvegardes

- **Code** : Automatique via Git
- **Base de données** : Sauvegarde automatique Supabase
- **Médias** : Sauvegarde Git (dans `/public/images/`)

## 🎯 Optimisations Avancées

### CDN et Images

1. Configurer Netlify Image CDN
2. Optimisation automatique des images
3. Format WebP/AVIF

### Performance

1. Préchargement des ressources critiques
2. Lazy loading avancé
3. Service worker pour le cache

### SEO

1. Sitemap automatique généré
2. Schema.org configuré  
3. Meta tags optimisés

---

## ✅ Checklist Finale

- [ ] ✅ Site accessible en HTTPS
- [ ] ✅ Formulaires opérationnels
- [ ] ✅ Emails reçus et envoyés
- [ ] ✅ CMS fonctionnel
- [ ] ✅ Performance >90 Lighthouse
- [ ] ✅ Mobile responsive
- [ ] ✅ Recherche active
- [ ] ✅ Conformité RGPD

**🎉 Site en production avec succès !**

---

## 📞 Support

En cas de problème :
1. Consulter les logs Netlify
2. Tester les fonctions en local
3. Vérifier la documentation des services
4. GitHub Issues pour les bugs du code