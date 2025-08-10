const http = require('http');
const url = require('url');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Configuration email
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'your-gmail@gmail.com', // À remplacer par un vrai compte Gmail
        pass: 'your-app-password'     // Mot de passe d'application Gmail
    }
});

// Fichiers de stockage des emails et des contacts
const SUBSCRIBERS_FILE = 'subscribers.json';
const CONTACTS_FILE = 'contacts.json';

// Charger les abonnés existants
function loadSubscribers() {
    try {
        const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Sauvegarder les abonnés
function saveSubscribers(subscribers) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

// Charger les contacts existants
function loadContacts() {
    try {
        const data = fs.readFileSync(CONTACTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Sauvegarder les contacts
function saveContacts(contacts) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

// Valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Serveur HTTP
const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    
    if (req.method === 'POST' && parsedUrl.pathname === '/subscribe') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const { email } = JSON.parse(body);
                
                if (!email || !isValidEmail(email)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Email invalide' 
                    }));
                    return;
                }
                
                const subscribers = loadSubscribers();
                
                // Vérifier si l'email existe déjà
                if (subscribers.includes(email)) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Cet email est déjà inscrit' 
                    }));
                    return;
                }
                
                // Ajouter l'email
                subscribers.push(email);
                saveSubscribers(subscribers);
                
                // Envoyer email de notification à terwan28@gmail.com
                const mailOptions = {
                    from: 'your-gmail@gmail.com',
                    to: 'terwan28@gmail.com',
                    subject: '🎉 Nouvelle inscription à la newsletter - Aude Architects',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #2c2c2c;">Nouvelle inscription à la newsletter</h2>
                            <p>Une nouvelle personne s'est inscrite à la newsletter du site Aude Architects :</p>
                            <div style="background: #f8f6f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                <strong>Email :</strong> ${email}
                            </div>
                            <p style="color: #666; font-size: 14px;">
                                Inscription effectuée le ${new Date().toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <hr style="border: none; height: 1px; background: #e8e4d8; margin: 30px 0;">
                            <p style="color: #8b8680; font-size: 12px;">
                                Cet email a été envoyé automatiquement par le système de newsletter du site Aude Architects.
                            </p>
                        </div>
                    `
                };
                
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Erreur envoi email:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: false, 
                            message: 'Erreur lors de l\'envoi de l\'email de notification' 
                        }));
                    } else {
                        console.log('Email envoyé:', info.response);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: true, 
                            message: 'Inscription réussie ! Merci de vous être inscrit.' 
                        }));
                    }
                });
                
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Données invalides' 
                }));
            }
        });
    } else if (req.method === 'POST' && parsedUrl.pathname === '/contact') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const contactData = JSON.parse(body);
                const { fullName, email, phone, projectType, projectDescription, budget, startDate, gdprConsent } = contactData;
                
                // Validation
                if (!fullName || !email || !projectType || !projectDescription || !gdprConsent) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Tous les champs obligatoires doivent être remplis' 
                    }));
                    return;
                }
                
                if (!isValidEmail(email)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Email invalide' 
                    }));
                    return;
                }
                
                // Sauvegarder le contact
                const contacts = loadContacts();
                const newContact = {
                    id: Date.now(),
                    fullName,
                    email,
                    phone,
                    projectType,
                    projectDescription,
                    budget,
                    startDate,
                    gdprConsent,
                    timestamp: new Date().toISOString()
                };
                
                contacts.push(newContact);
                saveContacts(contacts);
                
                // Envoyer email de notification à terwan28@gmail.com
                const mailOptions = {
                    from: 'your-gmail@gmail.com',
                    to: 'terwan28@gmail.com',
                    subject: '🎯 Nouvelle demande de contact - Aude Architects',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #2c2c2c;">Nouvelle demande de contact</h2>
                            <p>Une nouvelle demande de contact a été reçue sur le site Aude Architects :</p>
                            
                            <div style="background: #f8f6f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                <p><strong>Nom complet :</strong> ${fullName}</p>
                                <p><strong>Email :</strong> ${email}</p>
                                ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}
                                <p><strong>Type de projet :</strong> ${projectType}</p>
                                ${budget ? `<p><strong>Budget :</strong> ${budget}</p>` : ''}
                                ${startDate ? `<p><strong>Date de début souhaitée :</strong> ${startDate}</p>` : ''}
                            </div>
                            
                            <div style="background: #fff; border: 1px solid #e8e4d8; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="color: #2c2c2c; margin-top: 0;">Description du projet :</h3>
                                <p style="line-height: 1.6;">${projectDescription}</p>
                            </div>
                            
                            <p style="color: #666; font-size: 14px;">
                                Demande reçue le ${new Date().toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <hr style="border: none; height: 1px; background: #e8e4d8; margin: 30px 0;">
                            <p style="color: #8b8680; font-size: 12px;">
                                Cet email a été envoyé automatiquement par le formulaire de contact du site Aude Architects.
                            </p>
                        </div>
                    `
                };
                
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Erreur envoi email:', error);
                        // Même en cas d'erreur d'email, on considère le contact comme sauvegardé
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: true, 
                            message: 'Votre demande a été enregistrée avec succès ! Nous vous contacterons bientôt.' 
                        }));
                    } else {
                        console.log('Email de contact envoyé:', info.response);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: true, 
                            message: 'Votre demande a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.' 
                        }));
                    }
                });
                
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Données invalides' 
                }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route non trouvée' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur de newsletter démarré sur http://localhost:${PORT}`);
    console.log('📧 Prêt à recevoir les inscriptions !');
});