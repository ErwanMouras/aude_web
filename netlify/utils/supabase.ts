import { createClient } from '@supabase/supabase-js';

// Environment variables (set in Netlify)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Service client for server-side operations (full permissions)
export const supabaseService = createClient(
  supabaseUrl, 
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types
export interface Contact {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  project_type?: string;
  message: string;
  budget?: string;
  start_date?: string;
  rgpd_consent: boolean;
  status?: 'nouveau' | 'lu' | 'repondu' | 'archive';
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  status?: 'pending' | 'confirmed' | 'unsubscribed';
  double_optin_token?: string;
  confirmed_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Utility functions
export async function insertContact(contact: Contact) {
  const { data, error } = await supabaseService
    .from('contacts')
    .insert(contact)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function insertNewsletterSubscriber(subscriber: NewsletterSubscriber) {
  const { data, error } = await supabaseService
    .from('newsletter_subscribers')
    .insert(subscriber)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateNewsletterSubscriber(email: string, updates: Partial<NewsletterSubscriber>) {
  const { data, error } = await supabaseService
    .from('newsletter_subscribers')
    .update(updates)
    .eq('email', email)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getNewsletterSubscriber(email: string) {
  const { data, error } = await supabaseService
    .from('newsletter_subscribers')
    .select('*')
    .eq('email', email)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

export async function confirmNewsletterSubscription(token: string) {
  const { data, error } = await supabaseService
    .from('newsletter_subscribers')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      double_optin_token: null
    })
    .eq('double_optin_token', token)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}