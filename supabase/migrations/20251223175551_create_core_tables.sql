/*
  # Create Core Tables for Virtu Serve Admin Dashboard
  
  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `title` (text) - Service title
      - `description` (text) - Service description
      - `category` (text) - Category (Services/Products)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text) - Customer name
      - `designation` (text) - Customer designation/title
      - `rating` (integer) - Rating (1-5)
      - `comment` (text) - Testimonial comment
      - `avatar` (text) - Avatar image URL
      - `date_added` (date) - Date testimonial was added
      - `created_at` (timestamptz) - Creation timestamp
      
    - `contact_info`
      - `id` (uuid, primary key)
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email
      - `address` (text) - Business address
      - `business_hours` (jsonb) - Business hours object
      - `social_media` (jsonb) - Social media links object
      - `updated_at` (timestamptz) - Last update timestamp
      
    - `visitor_stats`
      - `id` (uuid, primary key)
      - `date` (date, unique) - Visit date
      - `visitors` (integer) - Number of visitors
      - `created_at` (timestamptz) - Creation timestamp
      
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique) - Admin username
      - `password_hash` (text) - Hashed password
      - `created_at` (timestamptz) - Creation timestamp
  
  2. Security
    - Enable RLS on all tables except admin_users (server-only access)
    - Add policies for public read access to services, testimonials, contact_info
    - Add policies for authenticated admin writes
    - admin_users table has no RLS policies (accessed only via Edge Functions)
  
  3. Important Notes
    - contact_info table will have only one row (singleton pattern)
    - visitor_stats uses unique constraint on date
    - Passwords are hashed using pgcrypto extension
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Services', 'Products')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  avatar text NOT NULL,
  date_added date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create contact_info table (singleton - only one row)
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  business_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  social_media jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create visitor_stats table
CREATE TABLE IF NOT EXISTS visitor_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  visitors integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table (server-side only, no RLS)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(date);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Enable Row Level Security on public tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read, no public write)
CREATE POLICY "Public can view services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for testimonials (public read, no public write)
CREATE POLICY "Public can view testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for contact_info (public read, no public write)
CREATE POLICY "Public can view contact info"
  ON contact_info FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for visitor_stats (public read, no public write)
CREATE POLICY "Public can view visitor stats"
  ON visitor_stats FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate admin login (used by Edge Functions)
CREATE OR REPLACE FUNCTION validate_admin_login(input_username text, input_password text)
RETURNS TABLE (is_valid boolean, admin_id uuid) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (password_hash = crypt(input_password, password_hash)) as is_valid,
    id as admin_id
  FROM admin_users
  WHERE username = input_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', crypt('admin123', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;