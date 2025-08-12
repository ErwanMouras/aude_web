import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { insertNewsletterSubscriber, getNewsletterSubscriber, NewsletterSubscriber } from '../utils/supabase';
import { sendDoubleOptinEmail } from '../utils/brevo';
import { generateRandomToken } from '../utils/helpers';

interface SubscribeData {
  email: string;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request data
    const { email }: SubscribeData = JSON.parse(event.body || '{}');

    // Validate email
    if (!email) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existingSubscriber = await getNewsletterSubscriber(normalizedEmail);
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'confirmed') {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            message: 'Vous êtes déjà abonné à notre newsletter',
            alreadySubscribed: true
          })
        };
      } else if (existingSubscriber.status === 'pending') {
        // Resend confirmation email (temporarily disabled)
        // await sendDoubleOptinEmail(existingSubscriber);
        
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            message: 'Email de confirmation renvoyé. Vérifiez votre boîte de réception.',
            pendingConfirmation: true
          })
        };
      }
    }

    // Generate double opt-in token
    const token = generateRandomToken();
    
    // Create new subscription
    const subscriberData: NewsletterSubscriber = {
      email: normalizedEmail,
      status: 'pending',
      double_optin_token: token
    };

    // Save to database
    const savedSubscriber = await insertNewsletterSubscriber(subscriberData);

    // Send double opt-in email (don't wait for completion) - temporarily disabled
    /*
    sendDoubleOptinEmail(savedSubscriber).catch(error => {
      console.error('Double opt-in email error:', error);
      // Don't fail the request if email fails
    });
    */

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Inscription réussie ! Vérifiez votre email pour confirmer votre abonnement.',
        requiresConfirmation: true
      })
    };

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Unable to process your subscription. Please try again later.'
      })
    };
  }
};

// Handle preflight requests
export const OPTIONS: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: ''
  };
};