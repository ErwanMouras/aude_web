# 📧 Système de Newsletter - Aude Architects

Ce système de newsletter permet de collecter des emails depuis le site web et d'envoyer une notification automatique à `terwan28@gmail.com` pour chaque nouvelle inscription.

## 🚀 Architecture

Le système se compose de :
- **Frontend** : Formulaire HTML/CSS/JS dans le footer du site
- **Backend** : Serveur Node.js avec Express-like functionality
- **Stockage** : Fichier JSON local pour les emails
- **Notifications** : Email automatique via Nodemailer (Gmail)

## 📦 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configuration Gmail
1. Activer la validation en 2 étapes sur votre compte Gmail
2. Générer un "Mot de passe d'application" :
   - Aller dans Google Account > Sécurité > Validation en 2 étapes > Mots de passe des applications
   - Générer un mot de passe pour "Autre (nom personnalisé)"
   - Copier le mot de passe généré (16 caractères)

### 3. Configuration du serveur
Modifier `newsletter-server.js` ligne 8-11 :
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'votre-email@gmail.com',        // Votre email Gmail
        pass: 'abcd efgh ijkl mnop'           // Le mot de passe d'application
    }
});
```

## 🛠️ Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📁 Structure des fichiers

```
newsletter-system/
├── newsletter-server.js    # Serveur backend
├── package.json           # Dépendances Node.js
├── subscribers.json       # Base de données des emails (créé automatiquement)
└── README_NEWSLETTER.md   # Cette documentation
```

## 🔧 Fonctionnement

### 1. Côté Frontend (Formulaire)
- Formulaire dans le footer avec validation JavaScript
- Vérification du format email
- Messages de succès/erreur
- Protection contre les doublons

### 2. Côté Backend (Serveur)
- API POST `/subscribe` pour recevoir les inscriptions
- Validation du format email
- Vérification des doublons
- Stockage dans `subscribers.json`
- Envoi d'email de notification

### 3. Email de notification
Envoyé automatiquement à `terwan28@gmail.com` avec :
- Adresse email du nouvel abonné
- Date et heure d'inscription
- Design professionnel HTML

## 🔒 Sécurité

- ✅ Validation côté client ET serveur
- ✅ Protection contre les injections
- ✅ CORS configuré pour le frontend
- ✅ Pas de stockage des mots de passe
- ✅ Gestion d'erreurs complète

## 🎨 Personnalisation

### Modifier l'email de notification
Éditer la section `mailOptions` dans `newsletter-server.js` :
```javascript
const mailOptions = {
    from: 'votre-email@gmail.com',
    to: 'terwan28@gmail.com',  // Changer cette adresse
    subject: '🎉 Nouvelle inscription newsletter',
    html: `<!-- Votre template HTML -->`
};
```

### Changer le port du serveur
Modifier la constante `PORT` dans `newsletter-server.js` :
```javascript
const PORT = 3000; // Changer ici
```

### Personnaliser le design du formulaire
Modifier les styles CSS dans `css/styles.css` :
```css
.newsletter-form { /* Vos styles */ }
.newsletter-message.success { color: #votre-couleur; }
```

## 📊 Base de données

Les emails sont stockés dans `subscribers.json` :
```json
[
  "utilisateur1@example.com",
  "utilisateur2@example.com"
]
```

### Exporter les emails
```bash
cat subscribers.json | jq -r '.[]' > emails_list.txt
```

## 🐛 Dépannage

### Erreur "Authentication failed"
- Vérifier que la validation en 2 étapes est activée
- Utiliser un mot de passe d'application, pas votre mot de passe Gmail
- Vérifier que l'email dans le code correspond à votre compte

### Port déjà utilisé
```bash
lsof -ti:3000 | xargs kill -9  # Tuer le processus sur le port 3000
```

### CORS Error
- Vérifier que le serveur est démarré
- Modifier l'URL dans `js/script.js` si nécessaire

## 🔄 Mise en production

### 1. Utiliser un service email professionnel
Remplacer Gmail par un service comme SendGrid ou Mailgun :
```javascript
const transporter = nodemailer.createTransporter({
    service: 'SendGrid',
    auth: {
        user: 'apikey',
        pass: 'your-sendgrid-api-key'
    }
});
```

### 2. Base de données réelle
Remplacer le fichier JSON par une vraie DB :
```bash
npm install sqlite3
```

### 3. HTTPS et domaine
- Configurer un certificat SSL
- Utiliser un nom de domaine
- Modifier l'URL d'API dans le frontend

## 📞 Support

Pour toute question ou problème :
1. Vérifier cette documentation
2. Consulter les logs du serveur
3. Tester avec un outil comme Postman
4. Contacter le développeur

## 🔄 Versions

- **v1.0.0** - Système de base avec Gmail
- **v1.1.0** - Ajout de la validation avancée
- **v1.2.0** - Design amélioré du footer

---

✨ **Système de newsletter opérationnel et prêt pour la production !**