/**
 * Validate Cloudflare Turnstile response
 */
export async function validateTurnstile(token: string, remoteip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return false;
  }
  
  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    
    if (remoteip && remoteip !== 'unknown') {
      formData.append('remoteip', remoteip);
    }
    
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (!response.ok) {
      console.error('Turnstile API error:', response.status, response.statusText);
      return false;
    }
    
    const result = await response.json();
    
    // Log for debugging (remove in production)
    console.log('Turnstile validation result:', {
      success: result.success,
      error_codes: result['error-codes'],
      challenge_ts: result.challenge_ts,
      hostname: result.hostname
    });
    
    return result.success === true;
    
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return false;
  }
}