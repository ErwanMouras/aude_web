import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { insertContact, Contact } from '../utils/supabase';
import { sendContactNotification, sendContactConfirmation } from '../utils/brevo';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

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
    console.log('Content-Type:', event.headers['content-type']);
    console.log('Body length:', event.body?.length);
    
    // Parse JSON data
    const formFields = JSON.parse(event.body || '{}');
    console.log('Parsed form fields:', Object.keys(formFields));

    // Extract and validate required fields
    const fullName = formFields.fullName?.trim();
    const email = formFields.email?.trim();
    const projectType = formFields.projectType?.trim();
    const projectDescription = formFields.projectDescription?.trim();
    const gdprConsent = formFields.gdprConsent === 'on' || formFields.gdprConsent === 'true' || formFields.gdprConsent === true;

    console.log('Extracted fields:', { fullName, email, projectType, hasDescription: !!projectDescription, gdprConsent });

    // Validate required fields
    if (!fullName || !email || !projectType || !projectDescription) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Missing required fields',
          missing: {
            fullName: !fullName,
            email: !email,
            projectType: !projectType,
            projectDescription: !projectDescription
          }
        })
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

    // Prepare contact data for database
    const contactData: Contact = {
      name: fullName,
      email: email.toLowerCase(),
      phone: formFields.phone?.trim() || null,
      project_type: projectType,
      message: projectDescription,
      budget: formFields.budget?.trim() || null,
      rgpd_consent: gdprConsent,
      status: 'nouveau'
    };

    // Parse start date if provided
    if (formFields.startDate && formFields.startDate.trim()) {
      try {
        const startDate = new Date(formFields.startDate);
        if (!isNaN(startDate.getTime())) {
          contactData.start_date = startDate.toISOString().split('T')[0];
        }
      } catch (e) {
        console.log('Invalid date format:', formFields.startDate);
      }
    }

    console.log('Contact data to save:', contactData);

    // Save to database
    const savedContact = await insertContact(contactData);
    console.log('Saved contact:', savedContact.id);

    // Send notification emails (disabled for now)
    // Email sending will be re-enabled once Brevo API is configured

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
    
    // Provide detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : JSON.stringify(error);
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorDetails,
      environment: process.env.NODE_ENV
    });
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Unable to process your request. Please try again later.',
        // Include error details for debugging
        errorMessage,
        errorDetails: errorDetails?.split('\n')[0] // First line of stack trace
      })
    };
  }
};