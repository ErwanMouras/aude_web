# Site Web Aude Architects

Un site web moderne pour un cabinet d'architecture avec système de newsletter et formulaire de contact intégrés.

## 📁 Structure du projet

```
site_web/
├── html/                    # Pages HTML
│   ├── index.html          # Page d'accueil avec formulaire de contact
│   ├── components/         # Composants réutilisables (navbar, footer)
│   └── ...                 # Autres pages
├── css/
│   └── styles.css          # Styles CSS principaux
├── js/
│   ├── script.js           # JavaScript principal + traductions
│   └── components*.js      # Scripts des composants
├── images/                 # Images du site
├── newsletter-server.js    # Serveur Node.js pour newsletter + contact
├── package.json           # Dépendances Node.js
└── README.md              # Ce fichier
```

## 🚀 Hébergement gratuit

### Option 1: Netlify (Recommandé pour les sites statiques)

**Avantages :** Interface simple, déploiement automatique depuis Git, SSL gratuit, formulaires intégrés

1. **Créer un compte sur [Netlify](https://www.netlify.com/)**

2. **Pousser votre code sur GitHub/GitLab :**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/votre-repo.git
   git push -u origin main
   ```

3. **Connecter le repo à Netlify :**
   - Dans Netlify : "New site from Git"
   - Sélectionner votre repository
   - Build settings : laisser vide (site statique)
   - Publish directory : `./` ou laisser vide

4. **Configuration pour les formulaires Netlify :**
   - Modifier le formulaire de contact dans `html/index.html` :
   ```html
   <form name="contact" method="POST" data-netlify="true" action="/success">
       <input type="hidden" name="form-name" value="contact">
       <!-- vos champs de formulaire -->
   </form>
   ```

### Option 2: Vercel

**Avantages :** Excellent pour les projets Next.js/React, mais fonctionne aussi pour le HTML statique

1. **Installer Vercel CLI :**
   ```bash
   npm i -g vercel
   ```

2. **Déployer :**
   ```bash
   vercel
   # Suivre les instructions
   ```

### Option 3: GitHub Pages

**Avantages :** Totalement gratuit, intégré à GitHub

1. **Pousser sur GitHub**

2. **Activer GitHub Pages :**
   - Repository Settings → Pages
   - Source: Deploy from a branch → main → root

⚠️ **Limitation :** GitHub Pages ne supporte que les sites statiques (pas de serveur Node.js)

## 🛠 Configuration du système de Newsletter + Contact

### Avec Netlify (Solution recommandée)

Netlify propose des formulaires intégrés qui remplacent votre serveur Node.js :

1. **Modifier `html/index.html` :**
   ```html
   <!-- Remplacer le formulaire de contact par -->
   <form name="contact" method="POST" data-netlify="true" action="/merci">
       <input type="hidden" name="form-name" value="contact">
       <!-- garder tous vos champs existants -->
   </form>
   
   <!-- Newsletter -->
   <form name="newsletter" method="POST" data-netlify="true">
       <input type="hidden" name="form-name" value="newsletter">
       <input type="email" name="email" required>
       <button type="submit">S'abonner</button>
   </form>
   ```

2. **Créer une page de remerciement `html/merci.html` :**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Merci !</title>
       <meta http-equiv="refresh" content="3;url=/">
   </head>
   <body>
       <h1>Merci pour votre message !</h1>
       <p>Nous vous contacterons bientôt.</p>
   </body>
   </html>
   ```

3. **Notifications par email :**
   - Dashboard Netlify → Site settings → Forms
   - Add notification → Email notification
   - Entrer votre email : `terwan28@gmail.com`

### Avec un serveur Node.js (Heroku/Railway)

Si vous voulez garder votre serveur Node.js actuel :

#### Option A: Railway (Recommandé - gratuit et simple)

1. **Créer un compte sur [Railway](https://railway.app/)**

2. **Préparer le projet :**
   ```bash
   # Créer un dossier séparé pour le serveur
   mkdir server
   mv newsletter-server.js server/
   mv package.json server/
   cd server
   ```

3. **Modifier `server/newsletter-server.js` :**
   ```javascript
   // Remplacer les CORS pour accepter votre domaine
   res.setHeader('Access-Control-Allow-Origin', 'https://votre-site.netlify.app');
   
   // Ajouter le port pour Railway
   const PORT = process.env.PORT || 3000;
   ```

4. **Déployer sur Railway :**
   - Connecter votre repo GitHub
   - Railway détecte automatiquement Node.js
   - Configurer les variables d'environnement pour l'email

#### Option B: Heroku

1. **Installer Heroku CLI**

2. **Créer une app :**
   ```bash
   cd server
   heroku create votre-app-name
   ```

3. **Configurer les variables d'environnement :**
   ```bash
   heroku config:set EMAIL_USER=your-gmail@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   ```

4. **Déployer :**
   ```bash
   git add .
   git commit -m "Deploy server"
   git push heroku main
   ```

### Configuration Email (Gmail)

1. **Activer l'authentification à 2 facteurs** sur votre compte Gmail

2. **Créer un mot de passe d'application :**
   - Google Account → Security → 2-Step Verification → App passwords
   - Générer un mot de passe pour "Mail"

3. **Modifier `newsletter-server.js` :**
   ```javascript
   const transporter = nodemailer.createTransporter({
       service: 'gmail',
       auth: {
           user: process.env.EMAIL_USER || 'votre-email@gmail.com',
           pass: process.env.EMAIL_PASS || 'votre-mot-de-passe-app'
       }
   });
   ```

## 📧 Alternative sans serveur : EmailJS

Pour éviter d'héberger un serveur, vous pouvez utiliser EmailJS :

1. **Créer un compte sur [EmailJS](https://www.emailjs.com/)**

2. **Configurer un service email** (Gmail)

3. **Créer un template d'email**

4. **Modifier `js/script.js` :**
   ```javascript
   // Remplacer la fonction de soumission par :
   emailjs.send('service_id', 'template_id', {
       fullName: data.fullName,
       email: data.email,
       message: data.projectDescription
   }).then(function(response) {
       showContactMessage('Message envoyé !', 'success');
   });
   ```

## 🎯 Solution recommandée complète

1. **Site statique :** Netlify
2. **Formulaires :** Netlify Forms
3. **Notifications :** Email Netlify → `terwan28@gmail.com`
4. **Domaine :** Netlify fournit un sous-domaine gratuit

Cette solution est :
- ✅ **100% gratuite**
- ✅ **Aucun serveur à maintenir**
- ✅ **SSL automatique**
- ✅ **Sauvegarde des soumissions**
- ✅ **Notifications email automatiques**

## 🔧 Scripts utiles

```bash
# Développement local
python -m http.server 8000
# ou
npx live-server

# Si vous utilisez le serveur Node.js
npm install
node newsletter-server.js
```

## 📱 Fonctionnalités

- ✅ **Design responsive** (mobile, tablette, desktop)
- ✅ **Multilingue** (français/anglais)
- ✅ **Formulaire de contact** avec validation
- ✅ **Newsletter** avec sauvegarde
- ✅ **Upload de fichiers** (images, PDF, plans)
- ✅ **Validation RGPD**
- ✅ **Notifications email automatiques**

## 🆘 Support

Pour toute question technique :
- Vérifier les logs dans la console du navigateur
- Tester d'abord en local
- Consulter la documentation de la plateforme d'hébergement choisie

---

**Note :** Ce README couvre toutes les options d'hébergement. Pour une mise en ligne rapide et simple, privilégiez Netlify avec les formulaires intégrés.
