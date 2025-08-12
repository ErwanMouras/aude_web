-- Supabase Database Schema for Aude Mouradian Architecture
-- This file contains the complete database schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: contacts
-- Stores contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  project_type VARCHAR(100),
  message TEXT NOT NULL,
  budget VARCHAR(50),
  start_date DATE,
  file_urls TEXT[], -- Array of file URLs if files are uploaded
  rgpd_consent BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(50) DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'lu', 'repondu', 'archive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: newsletter_subscribers  
-- Stores newsletter subscriptions with double opt-in
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  double_optin_token VARCHAR(255) UNIQUE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: admin_users (for future CMS access)
-- Stores admin user information for CMS access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Contacts: Only service role can access (server-side functions only)
CREATE POLICY "Service role can manage contacts" ON contacts
  FOR ALL USING (auth.role() = 'service_role');

-- Newsletter: Only service role can access (server-side functions only)  
CREATE POLICY "Service role can manage newsletter" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Admin users: Only authenticated users can read their own data
CREATE POLICY "Admins can read own data" ON admin_users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_token ON newsletter_subscribers(double_optin_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_subscribers(created_at DESC);

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at 
  BEFORE UPDATE ON newsletter_subscribers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Generate secure random token
CREATE OR REPLACE FUNCTION generate_random_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Function: Clean expired newsletter tokens (older than 24h)
CREATE OR REPLACE FUNCTION clean_expired_newsletter_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM newsletter_subscribers 
    WHERE status = 'pending' 
      AND double_optin_token IS NOT NULL 
      AND created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert default admin user (replace email with actual admin email)
INSERT INTO admin_users (email, name, role) 
VALUES ('terwan28@gmail.com', 'Aude Mouradian', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample data for development (remove in production)
INSERT INTO contacts (name, email, message, project_type, rgpd_consent) VALUES
('Jean Dupont', 'jean.dupont@example.com', 'Projet de rénovation appartement 100m2', 'renovation', true),
('Marie Martin', 'marie.martin@example.com', 'Design mobilier sur mesure pour salon', 'furniture', true),
('Pierre Lambert', 'pierre.lambert@example.com', 'Architecture intérieure maison neuve', 'interior-design', true)
ON CONFLICT DO NOTHING;

-- Create view for contact statistics
CREATE OR REPLACE VIEW contact_stats AS
SELECT 
    COUNT(*) as total_contacts,
    COUNT(CASE WHEN status = 'nouveau' THEN 1 END) as new_contacts,
    COUNT(CASE WHEN status = 'lu' THEN 1 END) as read_contacts,
    COUNT(CASE WHEN status = 'repondu' THEN 1 END) as replied_contacts,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as contacts_last_30_days,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as contacts_last_7_days
FROM contacts;

-- Create view for newsletter statistics  
CREATE OR REPLACE VIEW newsletter_stats AS
SELECT 
    COUNT(*) as total_subscribers,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_subscribers,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_subscribers,
    COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed_subscribers,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as subscribers_last_30_days
FROM newsletter_subscribers;

COMMENT ON TABLE contacts IS 'Contact form submissions from website';
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscriptions with double opt-in';
COMMENT ON TABLE admin_users IS 'Admin users for CMS access';
COMMENT ON FUNCTION clean_expired_newsletter_tokens() IS 'Cleanup function for expired newsletter tokens';
COMMENT ON VIEW contact_stats IS 'Statistics dashboard for contact submissions';
COMMENT ON VIEW newsletter_stats IS 'Statistics dashboard for newsletter subscriptions';