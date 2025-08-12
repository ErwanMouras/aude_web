import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { insertContact, Contact } from '../../src/utils/supabase';
import { sendContactNotification, sendContactConfirmation } from '../utils/brevo';
import { validateTurnstile } from '../utils/turnstile';

interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  projectType: string;
  projectDescription: string;
  budget?: string;
  startDate?: string;
  files?: File[];
  gdprConsent: boolean;
  'cf-turnstile-response': string;
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
    // Parse form data
    let formData: ContactFormData;
    
    if (event.headers['content-type']?.includes('multipart/form-data')) {
      // Handle multipart form data (with files)
      // For now, we'll handle as JSON - file upload can be added later
      formData = JSON.parse(event.body || '{}');
    } else {
      // Handle JSON data
      formData = JSON.parse(event.body || '{}');
    }

    // Validate required fields
    const { fullName, email, projectType, projectDescription, gdprConsent } = formData;
    
    if (!fullName || !email || !projectType || !projectDescription) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    if (!gdprConsent) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'GDPR consent is required' })
      };
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Validate Cloudflare Turnstile
    const turnstileResponse = formData['cf-turnstile-response'];
    if (!turnstileResponse) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Captcha verification required' })
      };
    }

    const turnstileValid = await validateTurnstile(turnstileResponse, event.headers['x-forwarded-for'] || 'unknown');
    if (!turnstileValid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Captcha verification failed' })
      };
    }

    // Prepare contact data
    const contactData: Contact = {
      name: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: formData.phone?.trim(),
      project_type: projectType,
      message: projectDescription.trim(),
      budget: formData.budget,
      rgpd_consent: gdprConsent,
      status: 'nouveau'
    };

    // Parse start date if provided
    if (formData.startDate) {
      try {
        const startDate = new Date(formData.startDate);
        if (!isNaN(startDate.getTime())) {
          contactData.start_date = startDate.toISOString().split('T')[0];
        }
      } catch (e) {
        // Invalid date, ignore
      }
    }

    // Save to database
    const savedContact = await insertContact(contactData);

    // Send notification emails in parallel (don't wait for completion)
    Promise.allSettled([
      sendContactNotification(savedContact),
      sendContactConfirmation(savedContact)
    ]).catch(error => {
      console.error('Email sending error:', error);
      // Don't fail the request if emails fail
    });

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
        message: 'Contact form submitted successfully',
        contactId: savedContact.id
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Unable to process your request. Please try again later.'
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