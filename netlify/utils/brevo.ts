import { Configuration, TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import type { Contact, NewsletterSubscriber } from './supabase';

// Initialize Brevo API
const configuration = new Configuration({
  apiKey: process.env.BREVO_API_KEY
});

const apiInstance = new TransactionalEmailsApi(configuration);

// Email templates configuration
const EMAIL_CONFIG = {
  from: {
    email: 'noreply@aude-mouradian.com',
    name: 'Aude Mouradian Architecture'
  },
  adminEmail: 'aude.mouradian@gmail.com',
  baseUrl: process.env.URL || 'https://aude-mouradian.netlify.app'
};

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(contact: Contact): Promise<void> {
  const sendSmtpEmail: SendSmtpEmail = {
    to: [{ email: EMAIL_CONFIG.adminEmail, name: 'Aude Mouradian' }],
    subject: `🔔 Nouveau contact - ${contact.name}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nouveau contact</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f6f0; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h1 style="color: #2c2c2c; margin-bottom: 20px; text-align: center;">
              🏗️ Nouveau contact depuis le site web
            </h1>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #2c2c2c; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
                Informations du contact
              </h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 30%;">Nom :</td>
                  <td style="padding: 8px 0;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email :</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${contact.email}" style="color: #2c2c2c;">${contact.email}</a>
                  </td>
                </tr>
                ${contact.phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Téléphone :</td>
                  <td style="padding: 8px 0;">
                    <a href="tel:${contact.phone}" style="color: #2c2c2c;">${contact.phone}</a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Type de projet :</td>
                  <td style="padding: 8px 0; text-transform: capitalize;">${contact.project_type}</td>
                </tr>
                ${contact.budget ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Budget :</td>
                  <td style="padding: 8px 0;">${contact.budget}</td>
                </tr>
                ` : ''}
                ${contact.start_date ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Date de début :</td>
                  <td style="padding: 8px 0;">${new Date(contact.start_date).toLocaleDateString('fr-FR')}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Date de soumission :</td>
                  <td style="padding: 8px 0;">${new Date(contact.created_at || '').toLocaleDateString('fr-FR')} à ${new Date(contact.created_at || '').toLocaleTimeString('fr-FR')}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px;">
              <h2 style="color: #2c2c2c; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
                Message
              </h2>
              <p style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #2c2c2c; margin: 15px 0;">
                ${contact.message.replace(/\n/g, '<br>')}
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${contact.email}?subject=Re: Votre demande de projet&body=Bonjour ${contact.name}," 
                 style="background: #2c2c2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                📧 Répondre au contact
              </a>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
            <p>Email automatique envoyé depuis le site web Aude Mouradian Architecture</p>
          </div>
        </body>
      </html>
    `,
    sender: EMAIL_CONFIG.from
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
}

/**
 * Send contact confirmation to client
 */
export async function sendContactConfirmation(contact: Contact): Promise<void> {
  const sendSmtpEmail: SendSmtpEmail = {
    to: [{ email: contact.email, name: contact.name }],
    subject: 'Confirmation de réception - Aude Mouradian Architecture',
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de réception</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f6f0;">
          <div style="background: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c2c2c; margin-bottom: 10px;">AUDE MOURADIAN</h1>
              <p style="color: #666; margin: 0;">Architecture d'Intérieur & Design</p>
            </div>
            
            <div style="text-align: center; font-size: 48px; margin-bottom: 20px;">✅</div>
            
            <h2 style="color: #2c2c2c; text-align: center; margin-bottom: 20px;">
              Merci pour votre demande !
            </h2>
            
            <p style="text-align: center; margin-bottom: 30px; font-size: 16px;">
              Bonjour <strong>${contact.name}</strong>,
            </p>
            
            <p style="margin-bottom: 20px;">
              Nous avons bien reçu votre demande concernant votre projet de <strong>${contact.project_type}</strong>. 
              Votre message nous a été transmis et nous vous en remercions.
            </p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #2c2c2c;">
              <h3 style="color: #2c2c2c; margin-top: 0;">Récapitulatif de votre demande :</h3>
              <p style="margin: 10px 0;"><strong>Type de projet :</strong> ${contact.project_type}</p>
              ${contact.budget ? `<p style="margin: 10px 0;"><strong>Budget :</strong> ${contact.budget}</p>` : ''}
              ${contact.start_date ? `<p style="margin: 10px 0;"><strong>Date souhaitée :</strong> ${new Date(contact.start_date).toLocaleDateString('fr-FR')}</p>` : ''}
            </div>
            
            <p style="margin-bottom: 20px;">
              <strong>Nos prochaines étapes :</strong>
            </p>
            
            <ul style="margin-bottom: 30px; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Étude approfondie de votre demande (sous 24-48h)</li>
              <li style="margin-bottom: 10px;">Contact téléphonique pour préciser vos besoins</li>
              <li style="margin-bottom: 10px;">Proposition personnalisée adaptée à votre projet</li>
            </ul>
            
            <p style="margin-bottom: 30px;">
              En attendant, n'hésitez pas à consulter nos derniers projets sur notre site web 
              pour vous inspirer.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${EMAIL_CONFIG.baseUrl}" 
                 style="background: #2c2c2c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 15px;">
                🏠 Voir nos projets
              </a>
              <a href="${EMAIL_CONFIG.baseUrl}/about" 
                 style="background: transparent; color: #2c2c2c; padding: 15px 30px; text-decoration: none; border: 2px solid #2c2c2c; border-radius: 6px; display: inline-block;">
                👩‍🎨 Notre équipe
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e5e5; padding-top: 30px; margin-top: 40px;">
              <p style="margin-bottom: 10px;"><strong>Contact direct :</strong></p>
              <p style="margin-bottom: 5px;">📧 aude.mouradian@gmail.com</p>
              <p style="margin-bottom: 5px;">📍 Lyon, France</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 12px;">
              <p>Merci de votre confiance !</p>
              <p>L'équipe Aude Mouradian Architecture</p>
            </div>
          </div>
        </body>
      </html>
    `,
    sender: EMAIL_CONFIG.from
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
}

/**
 * Send double opt-in email for newsletter
 */
export async function sendDoubleOptinEmail(subscriber: NewsletterSubscriber): Promise<void> {
  const confirmUrl = `${EMAIL_CONFIG.baseUrl}/.netlify/functions/confirm-newsletter?token=${subscriber.double_optin_token}`;
  
  const sendSmtpEmail: SendSmtpEmail = {
    to: [{ email: subscriber.email }],
    subject: 'Confirmez votre abonnement - Newsletter Aude Mouradian',
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmez votre abonnement</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f6f0;">
          <div style="background: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c2c2c; margin-bottom: 10px;">AUDE MOURADIAN</h1>
              <p style="color: #666; margin: 0;">Architecture d'Intérieur & Design</p>
            </div>
            
            <div style="text-align: center; font-size: 48px; margin-bottom: 20px;">📧</div>
            
            <h2 style="color: #2c2c2c; text-align: center; margin-bottom: 30px;">
              Confirmez votre abonnement
            </h2>
            
            <p style="margin-bottom: 20px; text-align: center;">
              Merci de votre intérêt pour notre newsletter !
            </p>
            
            <p style="margin-bottom: 30px;">
              Pour finaliser votre abonnement et recevoir nos dernières actualités, projets et inspirations design, 
              veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmUrl}" 
                 style="background: #2c2c2c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                ✅ Confirmer mon abonnement
              </a>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; text-align: center;">
                <strong>Ce que vous recevrez :</strong><br>
                • Nos derniers projets et réalisations<br>
                • Conseils et tendances en architecture d'intérieur<br>
                • Événements et actualités du studio<br>
                • Contenu exclusif et inspirations design
              </p>
            </div>
            
            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 40px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
              <a href="${confirmUrl}" style="color: #2c2c2c; word-break: break-all;">${confirmUrl}</a>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 12px;">
              <p><strong>Important :</strong> Ce lien expire dans 24 heures pour des raisons de sécurité.</p>
              <p>Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    sender: EMAIL_CONFIG.from
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
}

/**
 * Send welcome email after newsletter confirmation
 */
export async function sendWelcomeEmail(subscriber: NewsletterSubscriber): Promise<void> {
  const sendSmtpEmail: SendSmtpEmail = {
    to: [{ email: subscriber.email }],
    subject: 'Bienvenue dans notre communauté ! 🏠',
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue !</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f6f0;">
          <div style="background: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c2c2c; margin-bottom: 10px;">AUDE MOURADIAN</h1>
              <p style="color: #666; margin: 0;">Architecture d'Intérieur & Design</p>
            </div>
            
            <div style="text-align: center; font-size: 48px; margin-bottom: 20px;">🎉</div>
            
            <h2 style="color: #2c2c2c; text-align: center; margin-bottom: 30px;">
              Bienvenue dans notre communauté !
            </h2>
            
            <p style="margin-bottom: 20px; text-align: center; font-size: 16px;">
              Merci de nous avoir rejoint ! Votre abonnement est maintenant confirmé.
            </p>
            
            <p style="margin-bottom: 30px;">
              Vous faites désormais partie d'une communauté passionnée par l'architecture d'intérieur et le design. 
              Nous sommes ravis de partager avec vous notre vision créative et nos dernières réalisations.
            </p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="color: #2c2c2c; margin-top: 0;">🎁 En attendant notre première newsletter...</h3>
              <p style="margin-bottom: 20px;">Découvrez dès maintenant nos derniers projets :</p>
              <a href="${EMAIL_CONFIG.baseUrl}" 
                 style="background: #2c2c2c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">
                🏠 Portfolio
              </a>
              <a href="${EMAIL_CONFIG.baseUrl}/blog" 
                 style="background: transparent; color: #2c2c2c; padding: 12px 25px; text-decoration: none; border: 2px solid #2c2c2c; border-radius: 6px; display: inline-block; margin: 10px;">
                📚 Blog & Conseils
              </a>
            </div>
            
            <div style="border: 2px solid #f0f0f0; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #2c2c2c; margin-top: 0; text-align: center;">📮 Fréquence des envois</h3>
              <p style="text-align: center; margin: 0;">
                Nous respectons votre boîte de réception ! Vous recevrez nos newsletters environ 1 à 2 fois par mois, 
                uniquement avec du contenu de qualité et nos actualités importantes.
              </p>
            </div>
            
            <p style="margin-bottom: 30px; text-align: center;">
              Des questions sur un projet ? Une idée d'aménagement ? 
              N'hésitez pas à nous contacter directement !
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${EMAIL_CONFIG.baseUrl}/contact" 
                 style="background: #2c2c2c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                💬 Nous contacter
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 12px;">
              <p>Suivez-nous aussi sur nos réseaux sociaux !</p>
              <p>
                <a href="#" style="color: #2c2c2c; text-decoration: none; margin: 0 10px;">Instagram</a> |
                <a href="#" style="color: #2c2c2c; text-decoration: none; margin: 0 10px;">LinkedIn</a> |
                <a href="#" style="color: #2c2c2c; text-decoration: none; margin: 0 10px;">Pinterest</a>
              </p>
              <p style="margin-top: 20px;">
                Vous pouvez vous désabonner à tout moment en cliquant sur le lien présent dans nos emails.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    sender: EMAIL_CONFIG.from
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
}