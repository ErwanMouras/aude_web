/**
 * Generate a secure random token for double opt-in
 */
export function generateRandomToken(): string {
  // Generate 32 random bytes and convert to base64url
  const bytes = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  
  // Convert to base64url (URL-safe base64)
  const base64 = Buffer.from(bytes).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitize text input (remove HTML tags and trim)
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim() // Remove leading/trailing whitespace
    .substring(0, 10000); // Limit length to prevent abuse
}

/**
 * Format phone number (basic validation)
 */
export function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  
  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Basic validation: should start with + or digit, and be 8-15 digits
  if (!/^(\+?\d{8,15})$/.test(cleaned)) {
    return null;
  }
  
  return cleaned;
}

/**
 * Rate limiting helper (simple in-memory store)
 * In production, use Redis or similar
 */
class SimpleRateLimit {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove expired requests
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
  
  // Cleanup old entries (call periodically)
  cleanup(): void {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < this.windowMs);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

// Export rate limiter instances
export const contactRateLimit = new SimpleRateLimit(3, 15 * 60 * 1000); // 3 requests per 15 minutes
export const newsletterRateLimit = new SimpleRateLimit(2, 5 * 60 * 1000); // 2 requests per 5 minutes

/**
 * Get client IP from Netlify headers
 */
export function getClientIP(headers: { [key: string]: string | undefined }): string {
  return headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         headers['x-real-ip'] ||
         headers['cf-connecting-ip'] ||
         'unknown';
}

/**
 * Parse project type to human readable format
 */
export function formatProjectType(projectType: string): string {
  const types: { [key: string]: string } = {
    'renovation': 'Rénovation',
    'interior-design': 'Décoration intérieure',
    'layout': 'Aménagement',
    'architecture': 'Architecture',
    'furniture': 'Design de mobilier',
    'lighting': 'Éclairage',
    'other': 'Autre'
  };
  
  return types[projectType] || projectType;
}

/**
 * Parse budget to human readable format
 */
export function formatBudget(budget: string): string {
  const budgets: { [key: string]: string } = {
    'under-10k': 'Moins de 10 000€',
    '10k-50k': '10 000€ - 50 000€',
    'over-50k': 'Plus de 50 000€'
  };
  
  return budgets[budget] || budget;
}

/**
 * Simple CORS headers
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

/**
 * Standard error response
 */
export function errorResponse(statusCode: number, message: string, details?: any) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    },
    body: JSON.stringify({
      error: message,
      details,
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * Standard success response
 */
export function successResponse(data: any, statusCode: number = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    },
    body: JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  };
}