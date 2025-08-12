import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { confirmNewsletterSubscription } from '../utils/supabase';
import { sendWelcomeEmail } from '../utils/brevo';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow GET method for confirmation links
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'text/html',
        'Allow': 'GET'
      },
      body: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Méthode non autorisée</title>
            <meta charset="UTF-8">
          </head>
          <body>
            <h1>Méthode non autorisée</h1>
            <p>Seules les requêtes GET sont acceptées pour cette URL.</p>
          </body>
        </html>
      `
    };
  }

  try {
    // Get token from query parameters
    const token = event.queryStringParameters?.token;

    if (!token) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <!DOCTYPE html>
          <html lang="fr">
            <head>
              <title>Token manquant - Newsletter Aude Mouradian</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                .error { color: #dc2626; }
                .btn { background: #2c2c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1>🚫 Token manquant</h1>
              <p class="error">Le lien de confirmation est invalide ou incomplet.</p>
              <p>Veuillez utiliser le lien complet envoyé dans votre email de confirmation.</p>
              <a href="/" class="btn">Retour à l'accueil</a>
            </body>
          </html>
        `
      };
    }

    // Confirm subscription
    const confirmedSubscriber = await confirmNewsletterSubscription(token);

    if (!confirmedSubscriber) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <!DOCTYPE html>
          <html lang="fr">
            <head>
              <title>Token invalide - Newsletter Aude Mouradian</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                .error { color: #dc2626; }
                .btn { background: #2c2c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1>🚫 Token invalide</h1>
              <p class="error">Ce lien de confirmation n'est pas valide ou a expiré.</p>
              <p>Les liens de confirmation expirent après 24 heures pour des raisons de sécurité.</p>
              <p>Vous pouvez vous réinscrire à la newsletter depuis notre site web.</p>
              <a href="/" class="btn">Retour à l'accueil</a>
            </body>
          </html>
        `
      };
    }

    // Send welcome email (don't wait for completion)
    sendWelcomeEmail(confirmedSubscriber).catch(error => {
      console.error('Welcome email error:', error);
      // Don't fail the request if welcome email fails
    });

    // Return success page
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <title>Abonnement confirmé - Newsletter Aude Mouradian</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px; 
                text-align: center; 
                background: #f8f6f0;
                color: #2c2c2c;
              }
              .success { color: #059669; font-size: 48px; margin-bottom: 20px; }
              h1 { color: #2c2c2c; margin-bottom: 20px; }
              p { line-height: 1.6; margin-bottom: 15px; }
              .btn { 
                background: #2c2c2c; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                display: inline-block; 
                margin-top: 20px; 
                transition: background 0.3s;
              }
              .btn:hover { background: #1f1f1f; }
              .email { font-weight: bold; color: #2c2c2c; }
            </style>
          </head>
          <body>
            <div class="success">✅</div>
            <h1>Abonnement confirmé !</h1>
            <p>Merci <strong>${confirmedSubscriber.email}</strong> !</p>
            <p>Votre abonnement à notre newsletter a été confirmé avec succès.</p>
            <p>Vous recevrez désormais nos dernières actualités, projets et inspirations design directement dans votre boîte mail.</p>
            <p>Un email de bienvenue vous sera envoyé sous peu.</p>
            <a href="/" class="btn">Découvrir nos projets</a>
            <br><br>
            <small style="color: #666;">
              Vous pouvez vous désabonner à tout moment en cliquant sur le lien présent dans nos emails.
            </small>
          </body>
        </html>
      `
    };

  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <title>Erreur - Newsletter Aude Mouradian</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              .error { color: #dc2626; }
              .btn { background: #2c2c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>🚫 Erreur serveur</h1>
            <p class="error">Une erreur s'est produite lors de la confirmation de votre abonnement.</p>
            <p>Veuillez réessayer plus tard ou contactez notre support.</p>
            <a href="/" class="btn">Retour à l'accueil</a>
          </body>
        </html>
      `
    };
  }
};